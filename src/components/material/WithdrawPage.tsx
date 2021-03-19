import { PoolDataType, UserShareType } from "../../hooks/usePoolData"
import React, { ReactElement, useState } from "react"

import { BigNumber } from "@ethersproject/bignumber"
import { HistoricalPoolDataType } from "../../hooks/useHistoricalPoolData"
import MyActivityCard from "../MyActivityCard"
import MyShareCard from "./MyShareCard"
import NoShareContent from "../NoShareContent"
import PoolInfoCard from "./PoolInfoCard"
import { WithdrawFormState } from "../../hooks/useWithdrawFormState"
import { formatBNToPercentString } from "../../utils"
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
import AdvancedPanel from "./AdvancedPanel"
import WithdrawForm from "./WithdrawForm"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      flexGrow: 1,
    },
    bonus: {
      color: theme.palette.success.main,
    },
    warn: {
      color: theme.palette.warning.main,
    },
  }),
)

export interface ReviewWithdrawData {
  withdraw: {
    name: string
    value: string
    icon: string
  }[]
  rates: {
    name: string
    value: string
    rate: string
  }[]
  slippage: string
  priceImpact: BigNumber
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  title: string
  tokensData: Array<{
    symbol: string
    name: string
    icon: string
    inputValue: string
  }>
  reviewData: ReviewWithdrawData
  selected?: { [key: string]: any }
  poolData: PoolDataType | null
  historicalPoolData: HistoricalPoolDataType | null
  myShareData: UserShareType | null
  formStateData: WithdrawFormState
  onFormChange: (action: any) => void
  onConfirmTransaction: () => Promise<void>
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const WithdrawPage = (props: Props): ReactElement => {
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    tokensData,
    poolData,
    historicalPoolData,
    myShareData,
    onFormChange,
    formStateData,
    reviewData,
    onConfirmTransaction,
  } = props

  const onSubmit = (): void => {
    setCurrentModal("review")
  }

  const [currentModal, setCurrentModal] = useState<string | null>(null)

  const noShare =
    !myShareData || myShareData.lpTokenBalance.eq(BigNumber.from(0))

  const canWithdraw =
    !formStateData.error && !formStateData.lpTokenAmountToSpend.isZero()

  return (
    <Container maxWidth="md">
      {noShare ? (
        <NoShareContent />
      ) : (
        <Grid container direction="column" spacing={2}>
          <Grid
            item
            container
            direction="row"
            className={classes.root}
            spacing={2}
          >
            <Grid item xs={12} md container>
              <Paper variant="outlined" className={classes.paper}>
                <WithdrawForm
                  formState={formStateData}
                  tokens={tokensData}
                  onChange={onFormChange}
                />
              </Paper>
            </Grid>
            {myShareData ? (
              <Grid item xs={12} md={6} container>
                <Paper variant="outlined" className={classes.paper}>
                  <MyShareCard data={myShareData} />
                </Paper>
              </Grid>
            ) : null}
            {historicalPoolData ? (
              <Grid item xs={12} container>
                <Paper variant="outlined" className={classes.paper}>
                  <MyActivityCard historicalPoolData={historicalPoolData} />
                </Paper>
              </Grid>
            ) : null}
            {poolData ? (
              <Grid item xs={12} container>
                <Paper variant="outlined" className={classes.paper}>
                  <PoolInfoCard data={poolData} />
                </Paper>
              </Grid>
            ) : null}
          </Grid>
          <Grid container item>
            <AdvancedPanel
              actionComponent={
                <Button
                  fullWidth
                  variant="contained"
                  onClick={onSubmit}
                  disabled={!canWithdraw}
                >
                  {t("withdraw")}
                </Button>
              }
            >
              <Grid item xs>
                <Typography
                  color="inherit"
                  component="div"
                  className={
                    reviewData.priceImpact.gte(0) ? classes.bonus : classes.warn
                  }
                >
                  {reviewData.priceImpact.gte(0)
                    ? `${t("bonus")}: ${formatBNToPercentString(
                        reviewData.priceImpact,
                        18,
                        4,
                      )}`
                    : `${t("priceImpact")}: ${formatBNToPercentString(
                        reviewData.priceImpact,
                        18,
                        4,
                      )}`}
                </Typography>
              </Grid>
            </AdvancedPanel>
          </Grid>
          {/* <Modal
            isOpen={!!currentModal}
            onClose={(): void => setCurrentModal(null)}
          >
            {currentModal === "review" ? (
              <ReviewWithdraw
                data={reviewData}
                gas={gasPriceSelected}
                onConfirm={async (): Promise<void> => {
                  setCurrentModal("confirm")
                  logEvent(
                    "withdraw",
                    (poolData && { pool: poolData?.name }) || {},
                  )
                  await onConfirmTransaction?.()
                  setCurrentModal(null)
                }}
                onClose={(): void => setCurrentModal(null)}
              />
            ) : null}
            {currentModal === "confirm" ? <ConfirmTransaction /> : null}
          </Modal> */}
        </Grid>
      )}
    </Container>
  )
}

export default WithdrawPage
