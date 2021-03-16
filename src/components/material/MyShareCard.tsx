import React, { ReactElement } from "react"
import { formatBNToPercentString, formatBNToString } from "../../utils"

import { TOKENS_MAP } from "../../constants"
import { UserShareType } from "../../hooks/usePoolData"
import { commify } from "@ethersproject/units"
import { useTranslation } from "react-i18next"
import {
  Box,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core"

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
    share: formatBNToPercentString(data.share, 18),
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
      <Grid container direction="column" spacing={1}>
        <Grid item container direction="column">
          <Grid item container component={Typography} variant="subtitle1">
            {t("myShare")}
          </Grid>
          <Grid item component={Divider} className={classes.divider} />
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={12} component={Typography} variant="body1">
            {`${t("poolTokens")}: `} {formattedData.value}
          </Grid>
          <Typography variant="body1">
            {`${formattedData.share} ${t("ofPool")}`}
          </Typography>
        </Grid>
        <Grid item container xs md spacing={2} justify="space-between">
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
                  {`${coin.name}`}
                </Typography>
              </Grid>
              <Typography variant="body1">{`${coin.value}`}</Typography>
            </Grid>
          ))}
          <Grid item container component={Typography} variant="body1">
            {`${t("usdBalance")}: $${formattedData.usdBalance}`}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MyShareCard
