import React, { ReactElement } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { PayloadAction } from "@reduxjs/toolkit"
import { updateInfiniteApproval } from "../../state/user"
import { useTranslation } from "react-i18next"
import CustomPopover from "./CustomPopover"
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@material-ui/core"

export default function InfiniteApprovalField(): ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { infiniteApproval } = useSelector((state: AppState) => state.user)

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <FormControl component="fieldset">
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                color="primary"
                checked={infiniteApproval}
                onChange={(): PayloadAction<boolean> =>
                  dispatch(updateInfiniteApproval(!infiniteApproval))
                }
              />
            }
            label={t("infiniteApproval")}
            labelPlacement="end"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />
        </FormGroup>
      </FormControl>
      <CustomPopover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
      >
        <Typography>{t("infiniteApprovalTooltip")}</Typography>
      </CustomPopover>
    </Box>
  )
}
