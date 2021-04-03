import { POOLS_MAP, PoolName, TRANSACTION_TYPES, Token } from "../constants"
import { useAllContracts, useSwapContract } from "./useContract"

import { AppState } from "../state"
import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import { GasPrices } from "../state/user"
import { NumberInputState } from "../utils/numberInputState"
import checkAndApproveTokenForTrade from "../utils/checkAndApproveTokenForTrade"
import { formatDeadlineToNumber } from "../utils"
import { getFormattedTimeString } from "../utils/dateTime"
import { parseUnits } from "@ethersproject/units"
import { subtractSlippage } from "../utils/slippage"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useSnackbar } from "notistack"

interface ApproveAndDepositStateArgument {
  [tokenSymbol: string]: NumberInputState
}

export function useApproveAndDeposit(
  poolName: PoolName,
): (state: ApproveAndDepositStateArgument) => Promise<void> {
  const swapContract = useSwapContract(poolName)
  const tokenContracts = useAllContracts()
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const { gasStandard, gasFast, gasInstant } = useSelector(
    (state: AppState) => state.application,
  )
  const {
    slippageCustom,
    slippageSelected,
    gasPriceSelected,
    gasCustom,
    transactionDeadlineCustom,
    transactionDeadlineSelected,
    infiniteApproval,
  } = useSelector((state: AppState) => state.user)
  const POOL_TOKENS = POOLS_MAP[poolName]
  if (!POOL_TOKENS)
    throw new Error("useApproveAndDeposit requires a valid pool name")

  return async function approveAndDeposit(
    state: ApproveAndDepositStateArgument,
  ): Promise<void> {
    if (!account) throw new Error("Wallet must be connected")
    if (!swapContract) throw new Error("Swap contract is not loaded")

    const approveSingleToken = async (token: Token): Promise<void> => {
      const spendingValue = BigNumber.from(state[token.symbol].valueSafe)
      if (spendingValue.isZero()) return
      const tokenContract = tokenContracts?.[token.symbol] as Erc20
      if (tokenContract == null) return
      await checkAndApproveTokenForTrade(
        tokenContract,
        swapContract.address,
        account,
        spendingValue,
        infiniteApproval,
        {
          onTransactionStart: () => {
            enqueueSnackbar(
              `${getFormattedTimeString()} Approving spend for ${token.name}`,
              {
                variant: "info",
                persist: true, // TODO: be careful of orphan toasts on error
              },
            )
            return undefined
          },
          onTransactionSuccess: () => {
            enqueueSnackbar(
              `${getFormattedTimeString()} Successfully approved spend for ${
                token.name
              }`,
              {
                variant: "success",
              },
            )
            return undefined
          },
          onTransactionError: () => {
            enqueueSnackbar("Your transaction could not be completed", {
              variant: "error",
            })
            return undefined
          },
        },
      )
    }
    try {
      // For each token being deposited, check the allowance and approve it if necessary
      // await Promise.all(POOL_TOKENS.map((token) => approveSingleToken(token)))
      for (const token of POOL_TOKENS) {
        await approveSingleToken(token)
      }

      // "isFirstTransaction" check can be removed after launch
      const poolTokenBalances: BigNumber[] = await Promise.all(
        POOL_TOKENS.map(async (token, i) => {
          return await swapContract.getTokenBalance(i)
        }),
      )
      const isFirstTransaction = poolTokenBalances.every((bal) => bal.isZero())
      let minToMint: BigNumber
      if (isFirstTransaction) {
        minToMint = BigNumber.from("0")
      } else {
        minToMint = await swapContract.calculateTokenAmount(
          account,
          POOL_TOKENS.map(({ symbol }) => state[symbol].valueSafe),
          true, // deposit boolean
        )
      }

      minToMint = subtractSlippage(minToMint, slippageSelected, slippageCustom)
      const pendingMessage = enqueueSnackbar(
        `${getFormattedTimeString()} Starting your deposit...`,
        {
          variant: "info",
        },
      )
      let gasPrice
      if (gasPriceSelected === GasPrices.Custom) {
        gasPrice = gasCustom?.valueSafe
      } else if (gasPriceSelected === GasPrices.Fast) {
        gasPrice = gasFast
      } else if (gasPriceSelected === GasPrices.Instant) {
        gasPrice = gasInstant
      } else {
        gasPrice = gasStandard
      }
      gasPrice = parseUnits(String(gasPrice) || "45", 9)
      const deadline = formatDeadlineToNumber(
        transactionDeadlineSelected,
        transactionDeadlineCustom,
      )

      const spendTransaction = await swapContract.addLiquidity(
        POOL_TOKENS.map(({ symbol }) => state[symbol].valueSafe),
        minToMint,
        Math.round(new Date().getTime() / 1000 + 60 * deadline),
        [],
        {
          gasPrice,
        },
      )
      await spendTransaction.wait()
      dispatch(
        updateLastTransactionTimes({
          [TRANSACTION_TYPES.DEPOSIT]: Date.now(),
        }),
      )
      closeSnackbar(pendingMessage)
      enqueueSnackbar(`${getFormattedTimeString()} Liquidity added!`, {
        variant: "success",
      })
      return Promise.resolve()
    } catch (e) {
      console.error(e)
      closeSnackbar()
      enqueueSnackbar(
        `${getFormattedTimeString()} Unable to complete your transaction`,
        {
          variant: "error",
        },
      )
    }
  }
}
