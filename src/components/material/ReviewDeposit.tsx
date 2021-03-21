import React, { ReactElement, useState } from "react"
import { formatBNToPercentString, formatBNToString } from "../../utils"
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
import { DepositTransaction } from "../../interfaces/transactions"
import { commify } from "@ethersproject/units"
import ReviewTransaction from "./ReviewTransaction"
import FlexRow from "./FlexRow"

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
  onDeposit: () => void
  data: DepositTransaction
}

function ReviewDeposit(props: Props): ReactElement {
  const { onClose, onDeposit, data, open } = props
  const { t } = useTranslation()
  const classes = useStyles()

  const [confirmed, setConfirmed] = useState(false)
  const needsConfirm = isHighPriceImpact(data.priceImpact)

  return (
    <ReviewTransaction
      needsConfirm={needsConfirm}
      confirmed={confirmed}
      onConfirm={(): void => setConfirmed((prevState) => !prevState)}
      open={open}
      title={t("reviewDeposit")}
      action={
        <Button
          disabled={needsConfirm && !confirmed}
          onClick={onDeposit}
          color="secondary"
          variant="contained"
          disableElevation
        >
          {t("confirmDeposit")}
        </Button>
      }
      onClose={onClose}
    >
      <Grid item container direction="column" xs>
        <Typography gutterBottom>{t("depositing")}</Typography>
        {data.from.items.map(({ token, amount }) => (
          <FlexRow
            key={token.symbol}
            justify="space-between"
            left={
              <Grid item container>
                <img src={token.icon} alt="icon" className={classes.icon} />
                <Typography variant="body1">
                  {commify(formatBNToString(amount, token.decimals))}
                </Typography>
              </Grid>
            }
            right={token.symbol}
          />
        ))}
        <FlexRow
          justify="space-between"
          left={t("total")}
          right={commify(formatBNToString(data.from.totalAmount, 18))}
        />
      </Grid>
      <Grid item component={Divider} className={classes.divider} />
      <Grid item container direction="column" xs>
        <Typography gutterBottom>{t("receiving")}</Typography>
        <FlexRow
          justify="space-between"
          left={
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
          }
          right={data.to.item.token.symbol}
        />
        <FlexRow
          justify="space-between"
          left={t("shareOfPool")}
          right={formatBNToPercentString(data.shareOfPool, 18)}
        />
      </Grid>
      <Grid item component={Divider} className={classes.divider} />
      <Grid item container direction="column" xs>
        <Typography gutterBottom>{t("rates")}</Typography>
        {[...data.from.items, data.to.item].map(
          ({ token, singleTokenPriceUSD }) => (
            <FlexRow
              key={token.symbol}
              justify="space-between"
              left={
                <Grid item container>
                  <img src={token.icon} alt="icon" className={classes.icon} />
                  <Typography variant="body1">1 {token.symbol} =</Typography>
                </Grid>
              }
              right={`$${commify(
                formatBNToString(singleTokenPriceUSD, 18, 2),
              )}`}
            />
          ),
        )}
      </Grid>
      <Grid item component={Divider} className={classes.divider} />
    </ReviewTransaction>
  )
}

export default ReviewDeposit
