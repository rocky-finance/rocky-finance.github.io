import React, { ReactElement } from "react"
import { updateGasPriceCustom, updateGasPriceSelected } from "../../state/user"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { GasPrices } from "../../state/user"
import { PayloadAction } from "@reduxjs/toolkit"
import classNames from "classnames"
import { useTranslation } from "react-i18next"
import {
  FormControl,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"

export default function GasField(): ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { gasCustom, gasPriceSelected } = useSelector(
    (state: AppState) => state.user,
  )
  const { gasStandard, gasFast, gasInstant } = useSelector(
    (state: AppState) => state.application,
  )
  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{t("gas")}</FormLabel>
      <FormGroup>
        <List component="nav">
          {[GasPrices.Standard, GasPrices.Fast, GasPrices.Instant].map(
            (gasPriceConst) => {
              let priceValue
              let text
              if (gasPriceConst === GasPrices.Standard) {
                priceValue = gasStandard
                text = t("standard")
              } else if (gasPriceConst === GasPrices.Fast) {
                priceValue = gasFast
                text = t("fast")
              } else {
                priceValue = gasInstant
                text = t("instant")
              }

              return (
                <ListItem
                  button
                  key={gasPriceConst}
                  selected={gasPriceSelected === gasPriceConst}
                  onClick={(): PayloadAction<GasPrices> =>
                    dispatch(updateGasPriceSelected(gasPriceConst))
                  }
                >
                  <ListItemText
                    primary={`${String(priceValue)} ${String(text)}`}
                  />
                </ListItem>
              )
            },
          )}
          <ListItem>
            <input
              type="text"
              className={classNames({
                selected: gasPriceSelected === GasPrices.Custom,
              })}
              value={gasCustom?.valueRaw}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const value = e.target.value
                if (value && !isNaN(+value)) {
                  dispatch(updateGasPriceCustom(value))
                  if (gasPriceSelected !== GasPrices.Custom) {
                    dispatch(updateGasPriceSelected(GasPrices.Custom))
                  }
                } else {
                  dispatch(updateGasPriceSelected(GasPrices.Fast))
                }
              }}
            />
          </ListItem>
        </List>
      </FormGroup>
    </FormControl>
  )
}
