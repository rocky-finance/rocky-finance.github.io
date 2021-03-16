import { POOL_FEE_PRECISION, TOKENS_MAP } from "../../constants"
import React, { ReactElement } from "react"
import { formatBNToPercentString, formatBNToString } from "../../utils"

import { PoolDataType } from "../../hooks/usePoolData"
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
  data: PoolDataType | null
}

export default function PoolInfoCard({ data }: Props): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()

  const swapFee = data?.swapFee
    ? formatBNToPercentString(data.swapFee, POOL_FEE_PRECISION)
    : null
  const adminFee = data?.adminFee
    ? formatBNToPercentString(data.adminFee, POOL_FEE_PRECISION)
    : null
  const formattedData = {
    name: data?.name,
    swapFee,
    virtualPrice: data?.virtualPrice
      ? commify(formatBNToString(data.virtualPrice, 18, 5))
      : null,
    reserve: data?.reserve
      ? commify(formatBNToString(data.reserve, 18, 2))
      : "0",
    adminFee: swapFee && adminFee ? `${adminFee} of ${swapFee}` : null,
    poolAPY: data?.poolAPY
      ? `${commify(formatBNToString(data.poolAPY, 18, 2))}%`
      : "0%",
    rewardAPY: data?.rewardAPY
      ? `${commify(formatBNToString(data.rewardAPY, 18, 2))}%`
      : "0%",
    volume: data?.volume,
    tokens:
      data?.tokens.map((coin) => {
        const token = TOKENS_MAP[coin.symbol]
        return {
          symbol: token.symbol,
          name: token.name,
          icon: token.icon,
          percent: coin.percent,
          value: commify(formatBNToString(coin.value, 18, 6)),
        }
      }) || [],
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item container direction="column" spacing={1} xs={6}>
          <Grid item container direction="column">
            <Grid item container component={Typography} variant="subtitle1">
              {formattedData.name}
            </Grid>
            <Grid item component={Divider} className={classes.divider} />
          </Grid>
          <Grid item container>
            <Grid item xs={12} component={Typography} variant="body1">
              {`${t("fee")}: `} {formattedData.swapFee}
            </Grid>
            <Grid item xs={12} component={Typography} variant="body1">
              {`${t("virtualPrice")}: `} {formattedData.virtualPrice}
            </Grid>
            <Grid item xs={12} component={Typography} variant="body1">
              {`${t("totalLocked")}: `} {formattedData.reserve}
            </Grid>
            {/* <Grid item xs={12} component={Typography} variant="body1">
              {`${t("totalAPY")}: `} {formattedData.poolAPY}
            </Grid> */}
            <Grid item xs={12} component={Typography} variant="body1">
              {`${t("poolAPY")}: `} {formattedData.poolAPY}
            </Grid>
            <Grid item xs={12} component={Typography} variant="body1">
              {`${t("rewardAPY")}: `} {formattedData.rewardAPY}
            </Grid>
            {/* <Grid item xs={12} component={Typography} variant="body1">
              {`${t("dailyVolume")}: `} {formattedData.volume}
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item container direction="column" spacing={1} xs={6}>
          <Grid item container direction="column">
            <Grid item container component={Typography} variant="subtitle1">
              {t("currencyReserves")}
            </Grid>
            <Grid item component={Divider} className={classes.divider} />
          </Grid>
          <Grid item container xs md spacing={2} justify="space-between">
            {formattedData.tokens.map((token) => (
              <Grid key={token.symbol} item container direction="column" xs>
                <Grid
                  item
                  container
                  direction="row"
                  alignItems="center"
                  wrap="nowrap"
                >
                  <img src={token.icon} alt="icon" className={classes.icon} />
                  <Typography
                    variant="body1"
                    component="span"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {`${token.name} ${token.percent}`}
                  </Typography>
                </Grid>
                <Typography variant="body1">{`${token.value}`}</Typography>
              </Grid>
            ))}
            <Grid item xs={12} component={Typography} variant="body1">
              {`$${formattedData.reserve} ${t("inTotal")}`}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
