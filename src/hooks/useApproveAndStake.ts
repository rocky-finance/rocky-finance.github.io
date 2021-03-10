import { MASTERCHEF_POOLS, TRANSACTION_TYPES } from "../constants"
import { useAllContracts, useRockyMasterChefContract } from "./useContract"

import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import checkAndApproveTokenForTrade from "../utils/checkAndApproveTokenForTrade"
import { getFormattedTimeString } from "../utils/dateTime"
import { updateLastTransactionTimes } from "../state/application"
import { useActiveWeb3React } from "."
import { useDispatch } from "react-redux"
import { useToast } from "./useToast"

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
  const { addToast, clearToasts } = useToast()

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
        addToast({
          type: "error",
          title: `${getFormattedTimeString()} You don't have enough tokens`,
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

    const approveSingleToken = async (): Promise<void> => {
      await checkAndApproveTokenForTrade(
        tokenContract,
        masterChefContract.address,
        account,
        stakingValue,
        true, // Set infinite approval to true as the chef is not upgradeable.
        {
          onTransactionStart: () => {
            return addToast(
              {
                type: "pending",
                title: `${getFormattedTimeString()} Approving spend for ${
                  POOL_TOKEN.name
                }`,
              },
              {
                autoDismiss: false, // TODO: be careful of orphan toasts on error
              },
            )
          },
          onTransactionSuccess: () => {
            return addToast({
              type: "success",
              title: `${getFormattedTimeString()} Successfully approved spend for ${
                POOL_TOKEN.name
              }`,
            })
          },
          onTransactionError: () => {
            throw new Error("Your transaction could not be completed")
          },
        },
      )
    }
    try {
      await approveSingleToken()

      const clearMessage = addToast({
        type: "pending",
        title: `${getFormattedTimeString()} Starting your deposit...`,
      })

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
