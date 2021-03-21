import { POOLS } from "../../constants"
import React, { ReactElement } from "react"
import StakePool from "./StakePoolCard"
import { logEvent } from "../../utils/googleAnalytics"
import { useApproveAndStake } from "../../hooks/useApproveAndStake"
import { useHarvest } from "../../hooks/useHarvest"
import { useUnstake } from "../../hooks/useUnstake"
import {
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core"

/* eslint-disable @typescript-eslint/no-explicit-any */
// interface Props {
//   title: string
// }

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
    },
    bonus: {
      color: theme.palette.success.main,
    },
    warn: {
      color: theme.palette.warning.main,
    },
  }),
)

const StakePage = (): ReactElement => {
  const harvest = useHarvest()
  const approveAndStake = useApproveAndStake()
  const unstake = useUnstake()
  const classes = useStyles()

  const exceedsWallet = () => false

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
    <Container maxWidth="md" className={classes.container}>
      <Grid container direction="column" spacing={2}>
        <Grid
          item
          container
          direction="row"
          className={classes.root}
          spacing={2}
        >
          {POOLS.map((pool, index) => (
            <Grid key={index} item xs={12} md={6}>
              <Paper variant="outlined" className={classes.paper}>
                <StakePool
                  data={pool}
                  exceedsWallet={exceedsWallet}
                  onHarvest={() => onHarvest(index)}
                  onWithdraw={(amount: string) => onWithdraw(index, amount)}
                  onDeposit={(amount: string) => onDeposit(index, amount)}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  )
}

export default StakePage
