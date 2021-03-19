import React, { ReactElement } from "react"
import { formatDeadlineToNumber } from "../../utils"

import { AppState } from "../../state/index"
import { formatGasToString } from "../../utils/gas"
import { formatSlippageToString } from "../../utils/slippage"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import CustomDialog from "./CustomDialog"
import { CustomDialogProps } from "./CustomDialog"

import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import HighPriceImpactConfirmation from "./HighPriceImpactConfirmation"

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
      backgroundColor: theme.palette.error.main,
    },
  }),
)

interface Props extends CustomDialogProps {
  needsConfirm: boolean
  confirmed: boolean
  onConfirm: () => void
  children: React.ReactNode
}

function ReviewTransaction(inProps: Props): ReactElement {
  const { needsConfirm, confirmed, onConfirm, children, ...other } = inProps
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
  
  const deadline = formatDeadlineToNumber(
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  )

  return (
    <CustomDialog
      maxWidth="xs"
      fullWidth
      {...other}
    >
      <Grid container direction="column" spacing={2}>
        {children}
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
        {needsConfirm && (
          <Paper variant="outlined" className={classes.paper}>
            <HighPriceImpactConfirmation
              checked={confirmed}
              onCheck={onConfirm}
            />
          </Paper>
        )}
      </Grid>
    </CustomDialog>
  )
}

export default ReviewTransaction
