import { ROCKY_TOKEN, STABLECOIN_SWAP_TOKEN } from "../constants"
import React, { ReactElement } from "react"
import StakePool from "./StakePoolCard"
import { logEvent } from "../utils/googleAnalytics"
import { useApproveAndStake } from "../hooks/useApproveAndStake"
import { useHarvest } from "../hooks/useHarvest"
import { useUnstake } from "../hooks/useUnstake"

/* eslint-disable @typescript-eslint/no-explicit-any */
// interface Props {
//   title: string
// }

/* eslint-enable @typescript-eslint/no-explicit-any */
const pools = [
  {
    title: "USD LP",
    token: {
      symbol: STABLECOIN_SWAP_TOKEN.symbol,
      name: STABLECOIN_SWAP_TOKEN.name,
      icon: STABLECOIN_SWAP_TOKEN.icon,
      max: "0",
    },
  },
  {
    title: "ROCKY",
    token: {
      symbol: ROCKY_TOKEN.symbol,
      name: ROCKY_TOKEN.name,
      icon: ROCKY_TOKEN.icon,
      max: "0",
    },
  },
]

const StakePage = (): ReactElement => {
  const harvest = useHarvest()
  const approveAndStake = useApproveAndStake()
  const unstake = useUnstake()

  async function onHarvest(pid: number) {
    logEvent("harvest", { pid: pid } || {})

    await harvest(pid)

    console.log("harvest", pid)
  }

  async function onDeposit(pid: number, amount: string) {
    if (!amount) return
    logEvent("stake", { pid: pid } || {})

    await approveAndStake({ pid: pid, amount: amount })
    console.log(pid, "stake", amount)
  }

  async function onWithdraw(pid: number, amount: string) {
    if (!amount) return
    logEvent("unstake", { pid: pid } || {})

    await unstake({ pid: pid, amount: amount })
    console.log(pid, "unstake", amount)
  }
  return (
    <div className="deposit">
      <div className="content">
        {pools.map((pool, index) => (
          <div className={index % 2 == 0 ? "left" : "right"} key={index}>
            <StakePool
              title={pool.title}
              token={pool.token}
              onHarvest={() => onHarvest(index)}
              onWithdraw={(amount) => onWithdraw(index, amount)}
              onDeposit={(amount) => onDeposit(index, amount)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StakePage
