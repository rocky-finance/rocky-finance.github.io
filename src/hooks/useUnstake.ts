import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { useAllContracts, useRockyMasterChefContract } from "./useContract"

import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useToast } from "./useToast"

interface UnstaketateArgument {
  pid: number
  amount: string
}

export function useUnstake(): (args: UnstaketateArgument) => Promise<void> {
  const dispatch = useDispatch()
  const masterChefContract = useRockyMasterChefContract()
  const tokenContracts = useAllContracts()
  const { account } = useActiveWeb3React()
  const { addToast, clearToasts } = useToast()

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
        addToast({
          type: "error",
          title: `${getFormattedTimeString()} You don't have enough tokens staked`,
        })
        return
      }
    } catch (e) {
      console.error(e)
      clearToasts()
      addToast({
        type: "error",
        title: `${getFormattedTimeString()} Unable to complete your transaction`,
      })
      return
    }

    try {
      const clearMessage = addToast({
        type: "pending",
        title: `${getFormattedTimeString()} Starting your unstake...`,
      })

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
      clearMessage()
      addToast({
        type: "success",
        title: `${getFormattedTimeString()} Liquidity unstaked, goodbye!`,
      })
      return Promise.resolve()
    } catch (e) {
      console.error(e)
      clearToasts()
      addToast({
        type: "error",
        title: `${getFormattedTimeString()} Unable to complete your transaction`,
      })
    }
  }
}
