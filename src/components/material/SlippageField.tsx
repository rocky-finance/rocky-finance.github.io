import {
  Box,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  createStyles,
  makeStyles,
} from "@material-ui/core"
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
      display: "inline",
      fontSize: theme.typography.caption.fontSize,
    },
  }),
)

export default function SlippageField(): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { slippageCustom, slippageSelected } = useSelector(
    (state: AppState) => state.user,
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
      <FormLabel component="legend">{t("maxSlippage")}</FormLabel>
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
              selected={slippageSelected === Slippages.OneTenth}
              onClick={(): PayloadAction<Slippages> =>
                dispatch(updateSlippageSelected(Slippages.OneTenth))
              }
            >
              <ListItemText
                primary="0.1"
                secondary="%"
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
              selected={slippageSelected === Slippages.One}
              onClick={(): PayloadAction<Slippages> =>
                dispatch(updateSlippageSelected(Slippages.One))
              }
            >
              <ListItemText
                primary="1.0"
                secondary="%"
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
              selected={slippageSelected === Slippages.Three}
              onClick={(): PayloadAction<Slippages> =>
                dispatch(updateSlippageSelected(Slippages.Three))
              }
            >
              <ListItemText
                primary="3.0"
                secondary="%"
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
              value={slippageCustom?.valueRaw}
              placeholder="0.0"
              spellCheck="false"
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
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}
