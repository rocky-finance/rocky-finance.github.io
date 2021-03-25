import {
  Divider,
  Grid,
  Paper,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../state"
import { AppState } from "../../state"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import DeadlineField from "./DeadlineField"
import GasField from "./GasField"
import InfiniteApprovalField from "./InfiniteApprovalField"
import { PayloadAction } from "@reduxjs/toolkit"
import SlippageField from "./SlippageField"
import { StyledChip } from "./StyledChip"
import classNames from "classnames"
import { updateSwapAdvancedMode } from "../../state/user"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    group: {
      padding: theme.spacing(1),
    },
    margin: {
      marginBottom: theme.spacing(2),
    },
    advanced: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(0, 1),
    },
  }),
)

interface Props {
  children?: React.ReactNode | undefined
  actionComponent?: React.ReactNode | undefined
  error?: string | null
}

export default function AdvancedPanel(props: Props): ReactElement {
  const { children, actionComponent, error } = props
  const { t } = useTranslation()
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { userSwapAdvancedMode: advanced } = useSelector(
    (state: AppState) => state.user,
  )

  return (
    <Grid
      container
      direction="column"
      component={Paper}
      variant="outlined"
      className={classes.paper}
    >
      <Grid
        container
        item
        direction="row"
        alignItems="center"
        className={classes.margin}
      >
        {children}
        <Grid item container xs justify="flex-end">
          <StyledChip
            onClick={(): PayloadAction<boolean> =>
              dispatch(updateSwapAdvancedMode(!advanced))
            }
            label={t("advancedOptions")}
            deleteIcon={advanced ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            onDelete={(): PayloadAction<boolean> =>
              dispatch(updateSwapAdvancedMode(!advanced))
            }
            variant="outlined"
          />
        </Grid>
      </Grid>
      {advanced ? (
        <Grid
          item
          container
          component={Paper}
          variant="outlined"
          className={classes.advanced}
        >
          <InfiniteApprovalField />
          <Divider light />
          <Grid container item direction="row" justify="space-between">
            <Grid item xs={12} md={4} className={classes.group}>
              <SlippageField />
            </Grid>
            <Grid item xs={12} md={4} className={classes.group}>
              <DeadlineField />
            </Grid>
            <Grid item xs={12} md={4} className={classes.group}>
              <GasField />
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      <Grid container direction="row" justify="center">
        {actionComponent}
        <div className={"error " + classNames({ showError: !!error })}>
          {error}
        </div>
      </Grid>
    </Grid>
  )
}
