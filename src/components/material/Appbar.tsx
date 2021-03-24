import React, { ReactElement } from "react"
import { Link, useLocation } from "react-router-dom"

import { Box, makeStyles, useTheme, withStyles } from "@material-ui/core"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Grid from "@material-ui/core/Grid"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import { useTranslation } from "react-i18next"
import { ReactComponent as Logo } from "../../assets/icons/logo.svg"
import Web3Status from "../../components/material/Web3Status"
import Brightness7OutlinedIcon from "@material-ui/icons/Brightness7Outlined"
import Brightness4Icon from "@material-ui/icons/Brightness4"

const StyledTabs = withStyles(
  (theme) => ({
    root: {
      justifyContent: "center",
      flexBasis: "100%",
      marginBottom: "-1px",
    },
    scroller: {
      flexGrow: 0,
    },
    indicator: {
      height: "3px",
      backgroundColor: theme.palette.text.primary,
    },
    flexContainer: {
      height: "100%",
    },
  }),
  { withTheme: true },
)(Tabs)

const useStyles = makeStyles((theme) => ({
  tabcontainer: {
    alignSelf: "stretch",
    borderBottom: "1px dashed",
    borderBottomColor: theme.palette.text.secondary,
    margin: theme.spacing(0, 2),
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
  tab: {
    fontWeight: "bold",
  },
  themer: {
    marginLeft: theme.spacing(2),
    color: theme.palette.text.secondary,
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  icon: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  logo: {
    fill: theme.palette.text.primary,
  },
}))

interface AppbarProps {
  onToggleDark: () => void
  routes: string[]
}

export default function Appbar(props: AppbarProps): ReactElement<AppbarProps> {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()
  const location = useLocation()
  const currentTab = location.pathname

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Grid container component={Toolbar} direction="row">
        <Grid item xs={6} sm>
          <Grid container alignItems="center" wrap="nowrap">
            <IconButton edge="start" color="inherit" className={classes.icon}>
              <Logo className={classes.logo} />
            </IconButton>
          </Grid>
        </Grid>
        <Box clone order={{ xs: 3, md: 2 }}>
          <Grid xs={12} md={8} item container className={classes.tabcontainer}>
            <StyledTabs
              value={currentTab}
              variant="scrollable"
              scrollButtons="on"
            >
              {props.routes.map((value) => {
                return (
                  <Tab
                    key={value}
                    label={t(value)}
                    component={Link}
                    to={`/${value}`}
                    value={`/${value}`}
                    centerRipple
                    classes={{ selected: classes.tab }}
                  />
                )
              })}
            </StyledTabs>
          </Grid>
        </Box>
        <Box clone order={{ xs: 2, md: 3 }}>
          <Grid item xs={6} sm>
            <Grid
              container
              alignItems="center"
              wrap="nowrap"
              justify="flex-end"
            >
              <Web3Status />
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={props.onToggleDark}
                className={classes.themer}
              >
                {theme.palette.type === "dark" ? (
                  <Brightness4Icon />
                ) : (
                  <Brightness7OutlinedIcon />
                )}
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </AppBar>
  )
}
