import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { BigNumber } from "@ethersproject/bignumber"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useRockyMasterChefContract } from "./useContract"
import { useSnackbar } from "notistack"

export function useHarvest(): (pid: number) => Promise<void> {
  const dispatch = useDispatch()
  const masterChefContract = useRockyMasterChefContract()
  const { account } = useActiveWeb3React()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

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
        enqueueSnackbar(`${getFormattedTimeString()} No ROCKY pending`, {
          variant: "error",
        })
        return
      }

      const pendingSnack = enqueueSnackbar(
        `${getFormattedTimeString()} Starting your harvest...`,
        { variant: "info" },
      )

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
      closeSnackbar(pendingSnack)
      enqueueSnackbar(
        `${getFormattedTimeString()} Liquidity staked, you rock!`,
        { variant: "success" },
      )
      return Promise.resolve()
    } catch (e) {
      console.error(e)
      closeSnackbar()
      enqueueSnackbar(
        `${getFormattedTimeString()} Unable to complete your transaction`,
        { variant: "error" },
      )
    }
  }
}
