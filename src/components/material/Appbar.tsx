import React, { ReactElement } from "react"
import { Link, useLocation } from "react-router-dom"

import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Grid from "@material-ui/core/Grid"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"
import logo from "../../assets/icons/logo.svg"
import Web3Status from "../../components/material/Web3Status"
import Brightness7OutlinedIcon from '@material-ui/icons/Brightness7Outlined'
import Brightness4Icon from '@material-ui/icons/Brightness4';

const StyledTabs = withStyles(
  (theme) => ({
    root: {
      alignSelf: "stretch",
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    indicator: {
      height: "3px",
      backgroundColor: theme.palette.text.primary,
    },
    scroller: {
      display: "inline-flex",
      justifyContent: "center",
    },
    fixed: {
      borderBottom: "1px dashed",
      borderBottomColor: theme.palette.text.secondary,
    },
  }),
  { withTheme: true },
)(Tabs)

const useStyles = makeStyles((theme) => ({
  tab: {
    "&.Mui-selected": {
      fontWeight: "bold",
    },
  },
  themer: {
    marginLeft: theme.spacing(2),
  },
}))

interface AppbarProps {
  onToggleDark: () => void
}

export default function Appbar(props: AppbarProps): ReactElement<AppbarProps> {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const currentTab = location.pathname

  return (
    <AppBar position="relative" color="inherit" elevation={0}>
      <Grid container component={Toolbar} direction="row" wrap="nowrap">
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <img className="logo" alt="logo" src={logo} />
            </IconButton>
            <Typography variant="h6" color="inherit">
              rocky.finance
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="stretch"
          value={currentTab}
          centered
          component={StyledTabs}
        >
          <Tab
            label={t("swap")}
            component={Link}
            to="/"
            value="/"
            centerRipple
            className={classes.tab}
          />
          <Tab
            label={t("deposit")}
            component={Link}
            to="deposit"
            value="/deposit"
            centerRipple
            className={classes.tab}
          />
          <Tab
            label={t("withdraw")}
            component={Link}
            to="withdraw"
            value="/withdraw"
            centerRipple
            className={classes.tab}
          />
          <Tab
            label={t("risk")}
            component={Link}
            to="risk"
            value="/risk"
            centerRipple
            className={classes.tab}
          />
        </Grid>
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap">
            <Web3Status />
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={props.onToggleDark}
              className={classes.themer}
            >
              {theme.palette.type === "dark"
                ? <Brightness4Icon />
                : <Brightness7OutlinedIcon />
              }
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  )
}
