import React, { ReactElement, useState } from "react"
import { formatBNToString, formatDeadlineToNumber } from "../../utils"

import { AppState } from "../../state/index"
import { BigNumber } from "@ethersproject/bignumber"
import { TOKENS_MAP } from "../../constants"
import { formatGasToString } from "../../utils/gas"
import { formatSlippageToString } from "../../utils/slippage"
import { isHighPriceImpact } from "../../utils/priceImpact"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import CustomDialog from "./CustomDialog"
import {
  Button,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle"
import HighPriceImpactConfirmation from "./HighPriceImpactConfirmation"

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      margin: theme.spacing(1, 0),
      background: "none",
      borderBottom: "1px dashed",
      borderBottomColor: theme.palette.text.secondary,
    },
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
      backgroundColor: theme.palette.error.main,
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
)

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  data: {
    from: { symbol: string; value: string }
    to: { symbol: string; value: string }
    exchangeInfo: {
      from: string
      to: string
      rate: BigNumber
      priceImpact: BigNumber
    }
  }
}

function ReviewSwap({ onClose, onConfirm, data, open }: Props): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    slippageCustom,
    slippageSelected,
    gasPriceSelected,
    gasCustom,
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  } = useSelector((state: AppState) => state.user)
  const { gasStandard, gasFast, gasInstant } = useSelector(
    (state: AppState) => state.application,
  )
  const [
    hasConfirmedHighPriceImpact,
    setHasConfirmedHighPriceImpact,
  ] = useState(false)
  const fromToken = TOKENS_MAP[data.from.symbol]
  const toToken = TOKENS_MAP[data.to.symbol]
  const isHighPriceImpactTxn = isHighPriceImpact(data.exchangeInfo.priceImpact)
  const deadline = formatDeadlineToNumber(
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  )

  const swapRate = () => {
    console.log("TODO: ReviewSwap.swapRate")
  }

  return (
    <CustomDialog
      open={open}
      title={t("reviewSwap")}
      action={
        <Button
          disabled={!hasConfirmedHighPriceImpact}
          onClick={onConfirm}
          color="secondary"
          variant="contained"
        >
          {t("confirmSwap")}
        </Button>
      }
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="column" xs>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <img src={fromToken.icon} alt="icon" className={classes.icon} />
              <Typography variant="body1">{data.from.value}</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {data.from.symbol}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs>
          <ArrowDownwardIcon />
        </Grid>
        <Grid item container direction="column" xs>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <img src={toToken.icon} alt="icon" className={classes.icon} />
              <Typography variant="body1">{data.to.value}</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {data.to.symbol}
            </Grid>
          </Grid>
        </Grid>
        <Grid item component={Divider} className={classes.divider} />
        <Grid item container alignItems="center">
          <Grid item xs>
            <Typography variant="body1" component="span">
              {t("price")}
            </Typography>
            <Button size="small" onClick={swapRate}>
              <SwapHorizontalCircleIcon />
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              {`${formatBNToString(data.exchangeInfo.rate, 18, 4)} ${
                data.exchangeInfo.from
              }/${data.exchangeInfo.to}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center">
          <Grid item component={Typography} variant="body1">
            {t("gas")}
          </Grid>
          <Grid item container alignItems="center" xs justify="flex-end">
            <Typography variant="body1">
              {`${formatGasToString(
                { gasStandard, gasFast, gasInstant },
                gasPriceSelected,
                gasCustom,
              )} GWEI`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center">
          <Grid item component={Typography} variant="body1">
            {t("maxSlippage")}
          </Grid>
          <Grid item container alignItems="center" xs justify="flex-end">
            <Typography variant="body1">
              {formatSlippageToString(slippageSelected, slippageCustom)}%
            </Typography>
          </Grid>
        </Grid>
        <Grid item container alignItems="center">
          <Grid item component={Typography} variant="body1">
            {t("deadline")}
          </Grid>
          <Grid item container alignItems="center" xs justify="flex-end">
            <Typography variant="body1">
              {`${deadline} ${t("minutes")}`}
            </Typography>
          </Grid>
        </Grid>
        {isHighPriceImpactTxn && (
          <Paper variant="outlined" className={classes.paper}>
            <HighPriceImpactConfirmation
              checked={hasConfirmedHighPriceImpact}
              onCheck={(): void =>
                setHasConfirmedHighPriceImpact((prevState) => !prevState)
              }
            />
          </Paper>
        )}
      </Grid>
    </CustomDialog>
  )
}

export default ReviewSwap
