import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Theme,
  Typography,
  createStyles,
  makeStyles,
  withStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import { formatBNToPercent, formatBNToString } from "../../utils"
import FlexRow from "./FlexRow"
import { TOKENS_MAP } from "../../constants"
import { UserShareType } from "../../hooks/usePoolData"
import { commify } from "@ethersproject/units"
import { useTranslation } from "react-i18next"

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: theme.spacing(2),
      borderRadius: 4,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 800],
    },
    bar: {
      borderRadius: 4,
      backgroundColor: "#1a90ff",
    },
  }),
)(LinearProgress)

const useStyles = makeStyles((theme) =>
  createStyles({
    divider: {
      margin: theme.spacing(1, 0),
      background: "none",
      borderBottom: "1px dashed",
      borderBottomColor: theme.palette.text.secondary,
    },
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
    },
    icon: {
      marginRight: theme.spacing(1),
    },
  }),
)

interface Props {
  data: UserShareType | null
}

function MyShareCard({ data }: Props): ReactElement | null {
  const { t } = useTranslation()
  const classes = useStyles()

  if (!data) return null

  const formattedData = {
    share: formatBNToPercent(data.share, 18),
    usdBalance: commify(formatBNToString(data.usdBalance, 18, 2)),
    value: commify(formatBNToString(data.value, 18, 6)),
    tokens: data.tokens.map((coin) => {
      const token = TOKENS_MAP[coin.symbol]
      return {
        symbol: token.symbol,
        icon: token.icon,
        name: token.name,
        value: commify(formatBNToString(coin.value, 18, 6)),
      }
    }),
  }

  return (
    <Box>
      <Grid container direction="column" spacing={2}>
        <Grid item container direction="column">
          <Grid item container component={Typography} variant="subtitle1">
            {t("myShare")}
          </Grid>
          <Grid item component={Divider} className={classes.divider} />
        </Grid>
        <Grid item container direction="column" spacing={1}>
          <FlexRow
            justify="space-between"
            left={`${t("poolTokens")}: `}
            right={formattedData.value}
          />
          <Grid item container xs={12}>
            <Grid
              item
              xs={12}
              component={BorderLinearProgress}
              variant="determinate"
              value={Number(formattedData.share)}
            />
            <FlexRow
              justify="center"
              right={`${formattedData.share}% ${t("ofPool")}`}
            />
          </Grid>
          <Grid item container xs md spacing={2} justify="space-evenly">
            {formattedData.tokens.map((coin) => (
              <Grid key={coin.symbol} item container direction="column" xs>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  wrap="nowrap"
                >
                  <img src={coin.icon} alt="icon" className={classes.icon} />
                  <Typography
                    variant="body1"
                    component="span"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {coin.name}
                  </Typography>
                </Grid>
                <Typography variant="body1">{coin.value}</Typography>
              </Grid>
            ))}
          </Grid>
          <FlexRow
            justify="space-between"
            left={t("usdBalance")}
            right={`$${formattedData.usdBalance}`}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default MyShareCard
