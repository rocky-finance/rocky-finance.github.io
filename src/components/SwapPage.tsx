import React, { ReactElement, useState } from "react"
import { formatBNToPercentString, formatBNToString } from "../utils"
import { BigNumber } from "@ethersproject/bignumber"

import ReviewSwap from "./material/ReviewSwap"
import SwapForm from "./material/SwapForm"
import { isHighPriceImpact } from "../utils/priceImpact"
import { logEvent } from "../utils/googleAnalytics"
import { useActiveWeb3React } from "../hooks"
import { useTranslation } from "react-i18next"
import {
  Button,
  Container,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core"
import SwapHorizontalCircleIcon from "@material-ui/icons/SwapHorizontalCircle"
import { StyledChip } from "./material/StyledChip"
import AdvancedPanel from "./material/AdvancedPanel"
import ConfirmTransaction from "./material/ConfirmTransaction"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
    },
    warning: {
      padding: theme.spacing(2),
      flexGrow: 1,
      backgroundColor: theme.palette.error.main,
    },
  }),
)

interface Props {
  tokens: Array<{
    symbol: string
    name: string
    value: BigNumber
    icon: string
    decimals: number
  }>
  exchangeInfo: {
    from: string
    to: string
    rate: BigNumber
    priceImpact: BigNumber
  }
  error: string | null
  fromState: { symbol: string; value: string }
  toState: { symbol: string; value: string }
  onChangeFromToken: (tokenSymbol: string) => void
  onChangeFromAmount: (amount: string) => void
  onChangeToToken: (tokenSymbol: string) => void
  onConfirmTransaction: () => Promise<void>
  onClickReverseExchangeDirection: () => void
}

const SwapPage = (props: Props): ReactElement => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const {
    tokens,
    exchangeInfo: exchangeInfo,
    error,
    fromState,
    toState,
    onChangeFromToken,
    onChangeFromAmount,
    onChangeToToken,
    onConfirmTransaction,
    onClickReverseExchangeDirection,
  } = props

  const [currentModal, setCurrentModal] = useState<string | null>(null)
  const classes = useStyles()

  const formattedPriceImpact = formatBNToPercentString(
    exchangeInfo.priceImpact,
    18,
  )
  const formattedExchangeRate = formatBNToString(exchangeInfo.rate, 18, 4)

  return (
    <Container maxWidth="md">
      <Grid container direction="column" spacing={2}>
        <Grid
          item
          container
          direction="row"
          className={classes.root}
          spacing={2}
        >
          <Grid item xs={12} md={6} container>
            <Paper variant="outlined" className={classes.paper}>
              <SwapForm
                isSwapFrom={true}
                tokens={tokens}
                onChangeSelected={onChangeFromToken}
                onChangeAmount={onChangeFromAmount}
                selected={fromState.symbol}
                inputValue={fromState.value}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} container>
            <Paper variant="outlined" className={classes.paper}>
              <SwapForm
                isSwapFrom={false}
                tokens={tokens}
                onChangeSelected={onChangeToToken}
                selected={toState.symbol}
                inputValue={toState.value}
              />
            </Paper>
          </Grid>
        </Grid>
        {account && isHighPriceImpact(exchangeInfo.priceImpact) ? (
          <Grid container item>
            <Paper variant="outlined" className={classes.warning}>
              <Typography>
                {t("highPriceImpact", {
                  rate: formattedPriceImpact,
                })}
              </Typography>
            </Paper>
          </Grid>
        ) : null}
        <Grid container item>
          <AdvancedPanel
            error={error}
            actionComponent={
              <Button
                fullWidth
                variant="contained"
                onClick={(): void => {
                  setCurrentModal("review")
                }}
                disabled={!!error || +toState.value <= 0}
              >
                {t("swap")}
              </Button>
            }
          >
            <Grid item xs>
              <StyledChip
                onClick={onClickReverseExchangeDirection}
                label={`${exchangeInfo.from}/${exchangeInfo.to}`}
                icon={<SwapHorizontalCircleIcon />}
                variant="outlined"
              />
            </Grid>
            <Grid item className="cost" xs={1}>
              <Typography color="inherit" component="div" align="center">
                {`${t("price")}: ${formattedExchangeRate}`}
              </Typography>
            </Grid>
          </AdvancedPanel>
        </Grid>
      </Grid>
      {currentModal === "review" && (
        <ReviewSwap
          open
          onClose={(): void => setCurrentModal(null)}
          onConfirm={async (): Promise<void> => {
            setCurrentModal("confirm")
            logEvent("swap", {
              from: fromState.symbol,
              to: toState.symbol,
            })
            await onConfirmTransaction?.()
            setCurrentModal(null)
          }}
          data={{
            from: fromState,
            to: toState,
            exchangeInfo: exchangeInfo,
          }}
        />
      )}
      {currentModal === "confirm" && (
        <ConfirmTransaction open onClose={(): void => setCurrentModal(null)} />
      )}
    </Container>
  )
}
export default SwapPage
