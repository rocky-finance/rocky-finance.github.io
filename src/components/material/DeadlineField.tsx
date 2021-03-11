import React, { ReactElement } from "react"
import {
  updateTransactionDeadlineCustom,
  updateTransactionDeadlineSelected,
} from "../../state/user"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../../state"
import { AppState } from "../../state/index"
import { Deadlines } from "../../state/user"
import { PayloadAction } from "@reduxjs/toolkit"
import { useTranslation } from "react-i18next"
import {
  createStyles,
  FormControl,
  FormGroup,
  FormLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core"

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      width: "100%",
    },
    nopad: {
      padding: "0",
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
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend">{t("deadline")}</FormLabel>
      <FormGroup>
        <List component="nav">
          <ListItem
            button
            selected={transactionDeadlineSelected === Deadlines.Ten}
            onClick={(): PayloadAction<Deadlines> =>
              dispatch(updateTransactionDeadlineSelected(Deadlines.Ten))
            }
          >
            <ListItemText primary={`>10 ${t("minutes")}`} />
          </ListItem>
          <ListItem
            button
            selected={transactionDeadlineSelected === Deadlines.Twenty}
            onClick={(): PayloadAction<Deadlines> =>
              dispatch(updateTransactionDeadlineSelected(Deadlines.Twenty))
            }
          >
            <ListItemText primary={`20 ${t("minutes")}`} />
          </ListItem>
          <ListItem
            button
            selected={transactionDeadlineSelected === Deadlines.Thirty}
            onClick={(): PayloadAction<Deadlines> =>
              dispatch(updateTransactionDeadlineSelected(Deadlines.Thirty))
            }
          >
            <ListItemText primary={`30 ${t("minutes")}`} />
          </ListItem>
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
      </FormGroup>
    </FormControl>
  )
}
