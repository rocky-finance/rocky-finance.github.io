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

export default function DeadlineField(): ReactElement {
  const { t } = useTranslation()
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
          <ListItem>
            <input
              type="text"
              className={classNames({
                selected: transactionDeadlineSelected === Deadlines.Custom,
              })}
              placeholder="10"
              onClick={(): PayloadAction<Deadlines> =>
                dispatch(updateTransactionDeadlineSelected(Deadlines.Custom))
              }
              value={transactionDeadlineCustom}
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
            />
            &nbsp;{t("minutes")}
          </ListItem>
        </List>
      </FormGroup>
    </FormControl>
  )
}
