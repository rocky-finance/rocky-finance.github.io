import {
  Link,
  Paper,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
    },
  }),
)

function LPStakingBanner(): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Typography variant="body1" align="center">
        {t("lpMustStakeForRewards")} &lt;
        <Link
          underline="always"
          color="inherit"
          href="https://dashboard.keep.network/liquidity"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("stakeHere")}
        </Link>
        &gt;
      </Typography>
    </Paper>
  )
}

export default LPStakingBanner
