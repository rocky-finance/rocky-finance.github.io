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
import {
  updateTransactionDeadlineCustom,
  updateTransactionDeadlineSelected,
} from "../../state/user"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { Deadlines } from "../../state/user"
import { PayloadAction } from "@reduxjs/toolkit"
import React from "react"
import { ReactElement } from "react"
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

export default function DeadlineField(): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const {
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  } = useSelector((state: AppState) => state.user)
  return (
    <Grid
      container
      alignItems="stretch"
      direction="column"
      component={FormControl}
      fullWidth
      className={classes.root}
    >
      <FormLabel component="legend">{t("deadline")}</FormLabel>
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
              selected={transactionDeadlineSelected === Deadlines.Ten}
              onClick={(): PayloadAction<Deadlines> =>
                dispatch(updateTransactionDeadlineSelected(Deadlines.Ten))
              }
            >
              <ListItemText
                primary=">10"
                secondary={t("minutes")}
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
              selected={transactionDeadlineSelected === Deadlines.Twenty}
              onClick={(): PayloadAction<Deadlines> =>
                dispatch(updateTransactionDeadlineSelected(Deadlines.Twenty))
              }
            >
              <ListItemText
                primary="20"
                secondary={t("minutes")}
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
              selected={transactionDeadlineSelected === Deadlines.Thirty}
              onClick={(): PayloadAction<Deadlines> =>
                dispatch(updateTransactionDeadlineSelected(Deadlines.Thirty))
              }
            >
              <ListItemText
                primary="30"
                secondary={t("minutes")}
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
              value={transactionDeadlineCustom}
              placeholder="10"
              spellCheck="false"
              onClick={(): PayloadAction<Deadlines> =>
                dispatch(updateTransactionDeadlineSelected(Deadlines.Custom))
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                const value = e.target.value
                if (value && !isNaN(+value)) {
                  dispatch(updateTransactionDeadlineCustom(value))
                  if (transactionDeadlineSelected !== Deadlines.Custom) {
                    dispatch(
                      updateTransactionDeadlineSelected(Deadlines.Custom),
                    )
                  }
                } else {
                  dispatch(updateTransactionDeadlineSelected(Deadlines.Ten))
                }
              }}
              endAdornment={
                <InputAdornment position="end">{t("minutes")}</InputAdornment>
              }
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}
