import React, { ReactElement, useState } from "react"
import {
  formatBNToPercentString,
  formatBNToString,
  formatDeadlineToNumber,
} from "../../utils"
import { AppState } from "../../state/index"
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
import HighPriceImpactConfirmation from "./HighPriceImpactConfirmation"
import { DepositTransaction } from "../../interfaces/transactions"
import { commify } from "@ethersproject/units"

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
  data: DepositTransaction
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
  const isHighPriceImpactTxn = isHighPriceImpact(data.priceImpact)
  const deadline = formatDeadlineToNumber(
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  )

  return (
    <CustomDialog
      open={open}
      title={t("reviewDeposit")}
      action={
        <Button
          disabled={isHighPriceImpactTxn && !hasConfirmedHighPriceImpact}
          onClick={onConfirm}
          color="secondary"
          variant="contained"
        >
          {t("confirmDeposit")}
        </Button>
      }
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="column" xs>
          <Typography gutterBottom>{t("depositing")}</Typography>
          {data.from.items.map(({ token, amount }) => (
            <Grid
              key={token.symbol}
              item
              container
              direction="row"
              alignItems="center"
              wrap="nowrap"
            >
              <Grid item container direction="row">
                <img src={token.icon} alt="icon" className={classes.icon} />
                <Typography variant="body1">
                  {commify(formatBNToString(amount, token.decimals))}
                </Typography>
              </Grid>
              <Grid
                item
                component={Typography}
                variant="body1"
                style={{ whiteSpace: "nowrap" }}
              >
                {token.symbol}
              </Grid>
            </Grid>
          ))}
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <Typography variant="body1">{t("total")}</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {commify(formatBNToString(data.from.totalAmount, 18))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item component={Divider} className={classes.divider} />
        <Grid item container direction="column" xs>
          <Typography gutterBottom>{t("receiving")}</Typography>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <img
                src={data.to.item.token.icon}
                alt="icon"
                className={classes.icon}
              />
              <Typography variant="body1">
                {commify(
                  formatBNToString(
                    data.to.item.amount,
                    data.to.item.token.decimals,
                  ),
                )}
              </Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {data.to.item.token.symbol}
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <Typography variant="body1">{t("shareOfPool")}</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {formatBNToPercentString(data.shareOfPool, 18)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item component={Divider} className={classes.divider} />
        <Grid item container direction="column" xs>
          <Typography gutterBottom>{t("rates")}</Typography>
          {[...data.from.items, data.to.item].map(
            ({ token, singleTokenPriceUSD }) => (
              <Grid
                key={token.symbol}
                item
                container
                direction="row"
                alignItems="center"
                wrap="nowrap"
              >
                <Grid item container direction="row">
                  <img src={token.icon} alt="icon" className={classes.icon} />
                  <Typography variant="body1">1 {token.symbol} =</Typography>
                </Grid>
                <Grid
                  item
                  component={Typography}
                  variant="body1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  ${commify(formatBNToString(singleTokenPriceUSD, 18, 2))}
                </Grid>
              </Grid>
            ),
          )}
        </Grid>
        <Grid item component={Divider} className={classes.divider} />
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
