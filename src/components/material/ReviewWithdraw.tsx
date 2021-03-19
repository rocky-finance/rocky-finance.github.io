import React, { ReactElement, useState } from "react"

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
import ReviewTransaction from "./ReviewTransaction"
import { ReviewWithdrawData } from "./WithdrawPage"

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
  data: ReviewWithdrawData
  onClose: () => void
  onWithdraw: () => void
}

function ReviewSwap({ onClose, onWithdraw, data, open }: Props): ReactElement {
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
      title={t("reviewWithdrawal")}
      action={
        <Button
          disabled={needsConfirm && !confirmed}
          onClick={onWithdraw}
          color="secondary"
          variant="contained"
        >
          {t("confirmWithdraw")}
        </Button>
      }
      onClose={onClose}
    >
      <Grid item container direction="column" xs>
        <Typography gutterBottom>{t("youWillReceive")}</Typography>
        {data.withdraw.map((token) => (
          <Grid
            key={token.name}
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <img src={token.icon} alt="icon" className={classes.icon} />
              <Typography variant="body1">{token.value}</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              {token.name}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item component={Divider} className={classes.divider} />
      <Grid item container direction="column" xs>
        <Typography gutterBottom>{t("rates")}</Typography>
        {data.rates.map((token) => (
          <Grid
            key={token.name}
            item
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
          >
            <Grid item container direction="row">
              <img src={token.icon} alt="icon" className={classes.icon} />
              <Typography variant="body1">1 {token.name} =</Typography>
            </Grid>
            <Grid
              item
              component={Typography}
              variant="body1"
              style={{ whiteSpace: "nowrap" }}
            >
              ${token.value}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item component={Divider} className={classes.divider} />
    </ReviewTransaction>
  )
}

export default ReviewSwap
