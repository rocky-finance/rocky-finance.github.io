import {
  Button,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement, useState } from "react"
import FlexRow from "./FlexRow"
import TokenInput from "./TokenInput"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      borderBottom: "1px dashed",
      borderBottomColor: theme.palette.text.secondary,
      background: "none",
    },
    title: {
      marginLeft: theme.spacing(2),
    },
  }),
)

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  data: {
    title: string
    token: {
      symbol: string
      name: string
      icon: string
      max: string
      isZeroBalance: boolean
    }
    pool: {
      apy: string // percent
      stake: {
        total: string
        user: string
      }
      rewards: {
        symbol: string
        name: string
        icon: string
        value: string
      }
    }
  }
  exceedsWallet: (tokenSymbol: string) => boolean
  onHarvest: () => void
  onDeposit: (amount: string) => void
  onWithdraw: (amount: string) => void
}

/* eslint-enable @typescript-eslint/no-explicit-any */
const StakePool = (props: Props): ReactElement => {
  const { data, exceedsWallet, onHarvest, onDeposit, onWithdraw } = props
  const { t } = useTranslation()
  const classes = useStyles()
  const [depositAmount, setDepositAmount] = useState("0")
  const [withdrawAmount, setWithdrawAmount] = useState("0")

  return (
    <Grid
      component={FormControl}
      container
      direction="column"
      spacing={2}
      autoCorrect="false"
      fullWidth
      variant="outlined"
    >
      <Grid container item alignItems="center">
        <img alt="icon" src={data.token.icon} width="36" height="36" />
        <Typography variant="h4" className={classes.title}>
          {data.title}
        </Typography>
      </Grid>
      <Grid item container direction="column">
        <Grid item container component={Divider} className={classes.divider} />
      </Grid>
      <Grid item container direction="column" spacing={1}>
        <FlexRow
          justify="space-between"
          left={`${t("apy")}:`}
          right={`${data.pool.apy}%`}
        />
        <FlexRow
          justify="space-between"
          left={`${t("totalStaked")}:`}
          right={`${data.pool.stake.total} ${data.token.symbol}`}
        />
        <FlexRow
          justify="space-between"
          left={`${t("yourStake")}:`}
          right={`${data.pool.stake.user} ${data.token.symbol} ($XX.XX)`}
        />
      </Grid>
      <Grid item container direction="column">
        <Grid item container component={Divider} className={classes.divider} />
      </Grid>
      <Grid item container spacing={2}>
        <FlexRow
          justify="space-between"
          left={`${t("pendingRewards")}:`}
          right={`${data.pool.rewards.value} ${data.pool.rewards.symbol} ($XX.XX)`}
        />
        <Grid item xs>
          <Button
            fullWidth
            onClick={onHarvest}
            color="secondary"
            variant="contained"
            disableElevation
          >
            {t("harvest")}
          </Button>
        </Grid>
      </Grid>
      <Grid container item spacing={2} direction="column" component={FormGroup}>
        <Grid item container>
          <Grid
            item
            component={TokenInput}
            {...data.token}
            inputValue={depositAmount}
            label={`${t("balance")}: ${String(data.token.max)}`}
            exceedsWallet={exceedsWallet}
            disabled={data.token.isZeroBalance}
            onChange={setDepositAmount}
          />
          <Grid
            item
            xs
            component={Button}
            onClick={() => onDeposit(depositAmount)}
            color="secondary"
            variant="contained"
            disableElevation
            disabled={depositAmount == "0"}
          >
            {t("deposit")}
          </Grid>
        </Grid>
        <Grid item container>
          <Grid
            item
            component={TokenInput}
            {...data.token}
            inputValue={withdrawAmount}
            label={`${t("balance")}: ${String(data.token.max)}`}
            exceedsWallet={exceedsWallet}
            disabled={data.token.isZeroBalance}
            onChange={setWithdrawAmount}
          />
          <Grid
            item
            xs
            component={Button}
            onClick={() => onWithdraw(withdrawAmount)}
            color="secondary"
            variant="contained"
            disabled={withdrawAmount == "0"}
          >
            {t("withdraw")}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StakePool
