import {
  Checkbox,
  FormControlLabel,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../state"
import { AppState } from "../../state"
import CustomDialog from "./CustomDialog"
import { REFS } from "../../constants"
import { updateDontShowRisk } from "../../state/user"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      fontWeight: "bold",
    },
  }),
)

function RiskDialog(): ReactElement {
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const classes = useStyles()

  const { dontShowRisk } = useSelector((state: AppState) => state.user)
  const [showRiskDialog, setShowRiskDialog] = useState(!dontShowRisk)

  const [checked, setChecked] = React.useState(false)

  const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateDontShowRisk(event.target.checked))
    setChecked(event.target.checked)
  }

  return (
    <CustomDialog
      title={t("risk")}
      close={t("accept")}
      open={showRiskDialog}
      onClose={() => {
        setShowRiskDialog(false)
      }}
      maxWidth="sm"
      fullWidth
    >
      <Typography variant="body1" gutterBottom>
        {t("riskIntro")} <a href={REFS.CONTRACT_INFO}>{t("riskIntro2")}</a>{" "}
        {t("riskIntro3")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t("audits")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("riskAudits")} <a href={REFS.AUDITS_INFO}>{t("riskAudits2")}</a>
        {"."}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("riskAudits3")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("riskAudits4")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t("adminKeys")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("riskAdminKeys")}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t("lossOfPeg")}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t("riskLossOfPeg")}
      </Typography>
      <FormControlLabel
        className={classes.label}
        control={
          <Checkbox
            checked={checked}
            onChange={onCheck}
            name="confirm"
            color="primary"
          />
        }
        label={t("dontShow")}
      />
    </CustomDialog>
  )
}

export default RiskDialog
