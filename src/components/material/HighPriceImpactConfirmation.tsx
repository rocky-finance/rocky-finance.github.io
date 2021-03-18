import React, { ReactElement } from "react"

import { useTranslation } from "react-i18next"
import { Box, Checkbox, FormControlLabel, Typography } from "@material-ui/core"

interface Props {
  checked: boolean
  onCheck: () => void
}
export default function HighPriceImpactConfirmation({
  checked,
  onCheck,
}: Props): ReactElement {
  const { t } = useTranslation()
  return (
    <Box>
      <Typography>{t("highPriceImpactConfirmation")}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onCheck}
            name="confirm"
            color="primary"
          />
        }
        label={t("iConfirm")}
      />
    </Box>
  )
}
