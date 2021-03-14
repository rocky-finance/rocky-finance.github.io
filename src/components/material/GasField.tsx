import React, { ReactElement } from "react"
import { updateGasPriceCustom, updateGasPriceSelected } from "../../state/user"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { GasPrices } from "../../state/user"
import { PayloadAction } from "@reduxjs/toolkit"
import { useTranslation } from "react-i18next"
import {
  Box,
  createStyles,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
    },
    grow: {
      flex: "1",
    },
    topRow: {
      flex: "1",
      margin: "8px 0",
    },
    input: {
      width: "100%",
    },
    nopad: {
      padding: "0",
    },
    button: {
      width: "auto",
      flex: "1",
      textAlign: "center",
    },
    primary: {
      display: "inline",
    },
    secondary: {
      fontSize: theme.typography.caption.fontSize,
    },
  }),
)

export default function GasField(): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { gasCustom, gasPriceSelected } = useSelector(
    (state: AppState) => state.user,
  )
  const { gasStandard, gasFast, gasInstant } = useSelector(
    (state: AppState) => state.application,
  )
  return (
    <Grid
      container
      alignItems="stretch"
      direction="column"
      component={FormControl}
      fullWidth
      className={classes.root}
    >
      <FormLabel component="legend">{t("gas")}</FormLabel>
      <Grid container component={FormGroup} className={classes.grow}>
        <List
          component={Box}
          display="flex"
          flexDirection="column"
          flexGrow="1"
        >
          <Grid container direction="row" className={classes.topRow}>
            <Grid
              item
              component={ListItem}
              button
              dense
              className={classes.button}
              selected={gasPriceSelected === GasPrices.Standard}
              onClick={(): PayloadAction<GasPrices> =>
                dispatch(updateGasPriceSelected(GasPrices.Standard))
              }
            >
              <ListItemText
                primary={gasStandard}
                secondary={t("standard")}
                classes={{
                  secondary: classes.secondary,
                  primary: classes.primary,
                }}
              />
            </Grid>
            <Divider light orientation="vertical" />
            <Grid
              item
              component={ListItem}
              button
              dense
              className={classes.button}
              selected={gasPriceSelected === GasPrices.Fast}
              onClick={(): PayloadAction<GasPrices> =>
                dispatch(updateGasPriceSelected(GasPrices.Fast))
              }
            >
              <ListItemText
                primary={gasFast}
                secondary={t("fast")}
                classes={{
                  secondary: classes.secondary,
                  primary: classes.primary,
                }}
              />
            </Grid>
            <Divider light orientation="vertical" />
            <Grid
              item
              component={ListItem}
              button
              dense
              className={classes.button}
              selected={gasPriceSelected === GasPrices.Instant}
              onClick={(): PayloadAction<GasPrices> =>
                dispatch(updateGasPriceSelected(GasPrices.Instant))
              }
            >
              <ListItemText
                primary={gasInstant}
                secondary={t("instant")}
                classes={{
                  secondary: classes.secondary,
                  primary: classes.primary,
                }}
              />
            </Grid>
          </Grid>
          <ListItem className={classes.nopad}>
            <OutlinedInput
              autoComplete="off"
              autoCorrect="off"
              id="amount"
              type="text"
              className={classes.input}
              value={gasCustom?.valueRaw}
              placeholder="1"
              spellCheck="false"
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
              endAdornment={
                <InputAdornment position="end">{t("feeUnit")}</InputAdornment>
              }
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}
