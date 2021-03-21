import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { useAllContracts, useRockyMasterChefContract } from "./useContract"

import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import checkAndApproveTokenForTrade from "../utils/checkAndApproveTokenForTrade"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useSnackbar } from "notistack"

interface ApproveAndStakeStateArgument {
  pid: number
  amount: string
}

export function useApproveAndStake(): (
  args: ApproveAndStakeStateArgument,
) => Promise<void> {
  const dispatch = useDispatch()
  const masterChefContract = useRockyMasterChefContract()
  const tokenContracts = useAllContracts()
  const { account } = useActiveWeb3React()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  return async function useApproveAndStake(
    args: ApproveAndStakeStateArgument,
  ): Promise<void> {
    if (!account) throw new Error("Wallet must be connected")
    if (!masterChefContract)
      throw new Error("Masterchef contract is not loaded")
    const contract_pid = MASTERCHEF_POOLS[args.pid].contract_pid
    const POOL_TOKEN = MASTERCHEF_POOLS[args.pid].token
    if (!POOL_TOKEN)
      throw new Error("useApproveAndStake requires a valid pool id")

    const stakingValue = BigNumber.from(args.amount)
    if (stakingValue.isZero()) return

    let balance: BigNumber

    const tokenContract = tokenContracts?.[POOL_TOKEN.symbol] as Erc20
    if (tokenContract == null) return
    try {
      balance = await tokenContract.balanceOf(account)
      if (balance.lt(stakingValue)) {
        enqueueSnackbar(
          `${getFormattedTimeString()} You don't have enough tokens`,
          {
            variant: "error",
          },
        )
        return
      }
    } catch (e) {
      console.error(e)
      closeSnackbar()
      enqueueSnackbar(
        `${getFormattedTimeString()} Unable to complete your transaction`,
        {
          variant: "error",
        },
      )
      return
    }

    const approveSingleToken = async (): Promise<void> => {
      await checkAndApproveTokenForTrade(
        tokenContract,
        masterChefContract.address,
        account,
        stakingValue,
        true, // Set infinite approval to true as the chef is not upgradeable.
        {
          onTransactionStart: () => {
            enqueueSnackbar(
              `${getFormattedTimeString()} Approving spend for ${
                POOL_TOKEN.name
              }`,
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
                POOL_TOKEN.name
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
      await approveSingleToken()

      const pendingMessage = enqueueSnackbar(
        `${getFormattedTimeString()} Starting your stake...`,
        {
          variant: "info",
        },
      )

      const spendTransaction = await masterChefContract.deposit(
        contract_pid,
        stakingValue,
      )

      await spendTransaction.wait()
      dispatch(
        updateLastTransactionTimes({
          [TRANSACTION_TYPES.DEPOSIT]: Date.now(),
        }),
      )
      closeSnackbar(pendingMessage)
      enqueueSnackbar(
        `${getFormattedTimeString()} Liquidity staked, you rock!`,
        {
          variant: "success",
        },
      )
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
