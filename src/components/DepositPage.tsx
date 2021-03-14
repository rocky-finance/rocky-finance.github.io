import { PoolDataType, UserShareType } from "../hooks/usePoolData"
import React, { ReactElement, useState } from "react"
import ConfirmTransaction from "./ConfirmTransaction"
import { DepositTransaction } from "../interfaces/transactions"
import { HistoricalPoolDataType } from "../hooks/useHistoricalPoolData"
import LPStakingBanner from "./LPStakingBanner"
import Modal from "./Modal"
import MyActivityCard from "./MyActivityCard"
import MyShareCard from "./MyShareCard"
import PoolInfoCard from "./PoolInfoCard"
import { REFS } from "../constants"
import ReviewDeposit from "./ReviewDeposit"
import classNames from "classnames"
import { formatBNToPercentString } from "../utils"
import { logEvent } from "../utils/googleAnalytics"
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
import AdvancedPanel from "./material/AdvancedPanel"
import DepositForm from "./material/DepositForm"
import { BigNumber } from "@ethersproject/bignumber"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  title: string
  onConfirmTransaction: () => Promise<void>
  onChangeTokenInputValue: (tokenSymbol: string, value: string) => void
  tokens: Array<{
    symbol: string
    name: string
    icon: string
    max: string
    inputValue: string
  }>
  exceedsWallet: boolean
  selected?: { [key: string]: any }
  poolData: PoolDataType | null
  historicalPoolData: HistoricalPoolDataType | null
  myShareData: UserShareType | null
  transactionData: DepositTransaction
}

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

/* eslint-enable @typescript-eslint/no-explicit-any */
const DepositPage = (props: Props): ReactElement => {
  const { t } = useTranslation()
  const classes = useStyles()
  const {
    tokens,
    exceedsWallet,
    poolData,
    historicalPoolData,
    myShareData,
    transactionData,
    onChangeTokenInputValue,
    onConfirmTransaction,
  } = props

  const [currentModal, setCurrentModal] = useState<string | null>(null)
  const validDepositAmount = transactionData.to.totalAmount.gt(0)

  return (
    <Container maxWidth="md" className="deposit">
      {myShareData?.lpTokenBalance.gt(0) && <LPStakingBanner />}
      <Grid container direction="column" spacing={2}>
        <Grid
          item
          container
          direction="row"
          className={classes.root}
          spacing={2}
        >
          <Grid item xs={12} sm container>
            <Paper variant="outlined" className={classes.paper}>
              <DepositForm
                exceedsWallet={exceedsWallet}
                tokens={tokens}
                onChangeTokenInputValue={onChangeTokenInputValue}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4} container>
            <Paper variant="outlined" className={classes.paper}>
              <MyShareCard data={myShareData} />
              <div
                style={{
                  display: myShareData ? "block" : "none",
                }}
                className="divider"
              ></div>{" "}
              <MyActivityCard historicalPoolData={historicalPoolData} />
              <div
                style={{
                  display: historicalPoolData ? "block" : "none",
                }}
                className="divider"
              ></div>{" "}
              <PoolInfoCard data={poolData} />
            </Paper>
          </Grid>
        </Grid>
        <Grid container item>
          <AdvancedPanel
            actionComponent={
              <Button
                fullWidth
                variant="contained"
                onClick={(): void => {
                  setCurrentModal("review")
                }}
                disabled={!validDepositAmount}
              >
                {t("deposit")}
              </Button>
            }
          >
            <Grid item xs>
              <Typography
                color="inherit"
                component="div"
                className={
                  transactionData.priceImpact.gte(0)
                    ? classes.bonus
                    : classes.warn
                }
              >
                {transactionData.priceImpact.gte(0)
                  ? `${t("bonus")}: ${formatBNToPercentString(
                      transactionData.priceImpact,
                      18,
                      4,
                    )}`
                  : `${t("priceImpact")}: ${formatBNToPercentString(
                      transactionData.priceImpact,
                      18,
                      4,
                    )}`}
              </Typography>
            </Grid>
            {poolData?.keepApr && (
              <Grid item xs>
                <Typography color="inherit" component="div">
                  <a
                    href={REFS.TRANSACTION_INFO}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{`${t("totalAPY")}: `}</span>
                  </a>
                  <span className="value">
                    {formatBNToPercentString(
                      poolData.totalAPY
                        ? poolData.totalAPY
                        : BigNumber.from(0),
                      18,
                    )}
                  </span>
                </Typography>
              </Grid>
            )}
          </AdvancedPanel>
        </Grid>
      </Grid>
      <Modal
        isOpen={!!currentModal}
        onClose={(): void => setCurrentModal(null)}
      >
        {currentModal === "review" ? (
          <ReviewDeposit
            transactionData={transactionData}
            onConfirm={async (): Promise<void> => {
              setCurrentModal("confirm")
              logEvent("deposit", (poolData && { pool: poolData?.name }) || {})
              await onConfirmTransaction?.()
              setCurrentModal(null)
            }}
            onClose={(): void => setCurrentModal(null)}
          />
        ) : null}
        {currentModal === "confirm" ? <ConfirmTransaction /> : null}
      </Modal>
    </Container>
  )
}

export default DepositPage
