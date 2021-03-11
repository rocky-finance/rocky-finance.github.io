import React, { ReactElement } from "react"
import {
  Slippages,
  updateSlippageCustom,
  updateSlippageSelected,
} from "../../state/user"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { PayloadAction } from "@reduxjs/toolkit"
import { useTranslation } from "react-i18next"
import {
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"

export default function SlippageField(): ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { slippageCustom, slippageSelected } = useSelector(
    (state: AppState) => state.user,
  )
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{t("maxSlippage")}</FormLabel>
      <FormGroup>
        <List component="nav">
          <ListItem
            button
            selected={slippageSelected === Slippages.OneTenth}
            onClick={(): PayloadAction<Slippages> =>
              dispatch(updateSlippageSelected(Slippages.OneTenth))
            }
          >
            <ListItemText primary="0.1%" />
          </ListItem>
          <ListItem
            button
            selected={slippageSelected === Slippages.One}
            onClick={(): PayloadAction<Slippages> =>
              dispatch(updateSlippageSelected(Slippages.One))
            }
          >
            <ListItemText primary="1.0%" />
          </ListItem>
          <ListItem
            button
            selected={slippageSelected === Slippages.Three}
            onClick={(): PayloadAction<Slippages> =>
              dispatch(updateSlippageSelected(Slippages.Three))
            }
          >
            <ListItemText primary="3.0%" />
          </ListItem>
          <ListItem>
            <input
              value={slippageCustom?.valueRaw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const value = e.target.value
                if (value && !isNaN(+value)) {
                  dispatch(updateSlippageCustom(value))
                  if (slippageSelected !== Slippages.Custom) {
                    dispatch(updateSlippageSelected(Slippages.Custom))
                  }
                } else {
                  dispatch(updateSlippageSelected(Slippages.OneTenth))
                }
              }}
            />
            &nbsp;%
          </ListItem>
        </List>
      </FormGroup>
    </FormControl>
  )
}
