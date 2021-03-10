import React, { ReactElement } from "react"
import DeadlineField from "../DeadlineField"
import GasField from "../GasField"
import InfiniteApprovalField from "./InfiniteApprovalField"
import SlippageField from "../SlippageField"
import {
  createStyles,
  FormControl,
  FormHelperText,
  Grid,
  makeStyles,
  Paper,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { StyledChip } from "./StyledChip"
import { PayloadAction } from "@reduxjs/toolkit"
import { updateSwapAdvancedMode } from "../../state/user"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "../../state"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import classNames from "classnames"

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
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
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        {children}
        <Grid item>
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
        <Grid>
          <div className="table">
            <div className="parameter">
              <InfiniteApprovalField />
            </div>
            <FormControl>
              <FormHelperText id="slippage-helper-text">
                {t("maxSlippage")}
              </FormHelperText>
            </FormControl>
            <div className="parameter">
              <SlippageField />
            </div>
            <div className="parameter">
              <DeadlineField />
            </div>
            <div className="parameter">
              <GasField />
            </div>
          </div>
          {actionComponent}
          <div className={"error " + classNames({ showError: !!error })}>
            {error}
          </div>
        </Grid>
      ) : null}
    </Grid>
  )
}
