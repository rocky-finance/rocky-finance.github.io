import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { BigNumber } from "@ethersproject/bignumber"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useRockyMasterChefContract } from "./useContract"
import { useToast } from "./useToast"

export function useHarvest(): (pid: number) => Promise<void> {
  const dispatch = useDispatch()
  const masterChefContract = useRockyMasterChefContract()
  const { account } = useActiveWeb3React()
  const { addToast, clearToasts } = useToast()

  return async function useHarvest(pid: number): Promise<void> {
    if (!account) throw new Error("Wallet must be connected")
    if (!masterChefContract)
      throw new Error("Masterchef contract is not loaded")
    const contract_pid = MASTERCHEF_POOLS[pid].contract_pid
    const POOL_TOKEN = MASTERCHEF_POOLS[pid].token
    if (!POOL_TOKEN) throw new Error("useHarvest requires a valid pool id")

    try {
      // "isFirstTransaction" check can be removed after launch
      const pending: BigNumber = await masterChefContract.pendingRocky(
        contract_pid,
        account,
      )
      if (pending.eq(0)) {
        addToast({
          type: "error",
          title: `${getFormattedTimeString()} No ROCKY pending`,
        })
        return
      }

      const clearMessage = addToast({
        type: "pending",
        title: `${getFormattedTimeString()} Starting your harvest...`,
      })

      const spendTransaction = await masterChefContract.withdraw(
        contract_pid,
        0,
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
        title: `${getFormattedTimeString()} Liquidity staked, you rock!`,
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
