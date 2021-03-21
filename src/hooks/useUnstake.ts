import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { useAllContracts, useRockyMasterChefContract } from "./useContract"

import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useSnackbar } from "notistack"

interface UnstaketateArgument {
  pid: number
  amount: string
}

export function useUnstake(): (args: UnstaketateArgument) => Promise<void> {
  const dispatch = useDispatch()
  const masterChefContract = useRockyMasterChefContract()
  const tokenContracts = useAllContracts()
  const { account } = useActiveWeb3React()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  return async function useApproveAndStake(
    args: UnstaketateArgument,
  ): Promise<void> {
    if (!account) throw new Error("Wallet must be connected")
    if (!masterChefContract)
      throw new Error("Masterchef contract is not loaded")

    const contract_pid = MASTERCHEF_POOLS[args.pid].contract_pid
    const POOL_TOKEN = MASTERCHEF_POOLS[args.pid].token
    if (!POOL_TOKEN) throw new Error("useUnstake requires a valid pool id")

    const unstakingValue = BigNumber.from(args.amount)
    if (unstakingValue.isZero()) return

    let stakedBalance: BigNumber

    const tokenContract = tokenContracts?.[POOL_TOKEN.symbol] as Erc20
    if (tokenContract == null) return
    try {
      const userinfo = await masterChefContract.userInfo(contract_pid, account)
      stakedBalance = userinfo.amount
      if (stakedBalance.lt(unstakingValue)) {
        enqueueSnackbar(
          `${getFormattedTimeString()} You don't have enough tokens staked`,
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

    try {
      const pendingMessage = enqueueSnackbar(
        `${getFormattedTimeString()} Starting your unstake...`,
        {
          variant: "info",
        },
      )

      const spendTransaction = await masterChefContract.withdraw(
        contract_pid,
        unstakingValue,
      )

      await spendTransaction.wait()
      dispatch(
        updateLastTransactionTimes({
          [TRANSACTION_TYPES.DEPOSIT]: Date.now(),
        }),
      )
      closeSnackbar(pendingMessage)
      enqueueSnackbar(
        `${getFormattedTimeString()} Liquidity unstaked, goodbye!`,
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
