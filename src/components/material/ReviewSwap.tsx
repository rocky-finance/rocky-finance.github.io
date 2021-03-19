import React, { ReactElement, useState } from "react"
import { formatBNToString } from "../../utils"

import { BigNumber } from "@ethersproject/bignumber"
import { TOKENS_MAP } from "../../constants"
import { isHighPriceImpact } from "../../utils/priceImpact"
import { useTranslation } from "react-i18next"
import {
  Button,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle"
import ReviewTransaction from "./ReviewTransaction"

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
  onSwap: () => void
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

function ReviewSwap({ onClose, onSwap, data, open }: Props): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()
  
  const [
    confirmed,
    setConfirmed,
  ] = useState(false)
  
  const fromToken = TOKENS_MAP[data.from.symbol]
  const toToken = TOKENS_MAP[data.to.symbol]
  const needsConfirm = isHighPriceImpact(data.exchangeInfo.priceImpact)
  
  const swapRate = () => {
    console.log("TODO: ReviewSwap.swapRate")
  }

  return (
    <ReviewTransaction
      needsConfirm={needsConfirm}
      confirmed={confirmed}
      onConfirm={(): void =>
        setConfirmed((prevState) => !prevState)
      }
      open={open}
      title={t("reviewSwap")}
      action={
        <Button
          disabled={needsConfirm && !confirmed}
          onClick={onSwap}
          color="secondary"
          variant="contained"
        >
          {t("confirmSwap")}
        </Button>
      }
      onClose={onClose}
    >
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
    </ReviewTransaction>
  )
}

export default ReviewSwap
