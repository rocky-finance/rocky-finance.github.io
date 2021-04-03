import React, { ReactElement } from "react"
import CustomDialog from "./CustomDialog"
import { Typography } from "@material-ui/core"
import { useTranslation } from "react-i18next"

interface Props {
  open: boolean
  onClose: () => void
}

function ConfirmTransaction({ open, onClose }: Props): ReactElement {
  const { t } = useTranslation()

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Typography variant="body1" component="span">
        {t("confirmTransaction")}
      </Typography>
    </CustomDialog>
  )
}

export default ConfirmTransaction
