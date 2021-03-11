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
import TokenInput from "./TokenInput"
import classNames from "classnames"
import { formatBNToPercentString } from "../utils"
import { logEvent } from "../utils/googleAnalytics"
import { useTranslation } from "react-i18next"
import { Button, Container } from "@material-ui/core"
import AdvancedPanel from "./material/AdvancedPanel"

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

/* eslint-enable @typescript-eslint/no-explicit-any */
const DepositPage = (props: Props): ReactElement => {
  const { t } = useTranslation()
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

      <div className="content">
        <div className="left">
          <div className="form">
            <h3>{t("addLiquidity")}</h3>
            {exceedsWallet ? (
              <div className="error">{t("depositBalanceExceeded")}</div>
            ) : null}
            {tokens.map((token, index) => (
              <div key={index}>
                <TokenInput
                  {...token}
                  onChange={(value): void =>
                    onChangeTokenInputValue(token.symbol, value)
                  }
                />
                {index === tokens.length - 1 ? (
                  ""
                ) : (
                  <div className="divider"></div>
                )}
              </div>
            ))}
            <div className={classNames("transactionInfoContainer", "show")}>
              <div className="transactionInfo">
                {poolData?.keepApr && (
                  <div className="transactionInfoItem">
                    <a
                      href={REFS.TRANSACTION_INFO}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{`KEEP APR:`}</span>
                    </a>{" "}
                    <span className="value">
                      {formatBNToPercentString(poolData.keepApr, 18)}
                    </span>
                  </div>
                )}
                <div className="transactionInfoItem">
                  {transactionData.priceImpact.gte(0) ? (
                    <span className="bonus">{`${t("bonus")}: `}</span>
                  ) : (
                    <span className="slippage">{t("priceImpact")}</span>
                  )}
                  <span
                    className={
                      "value " +
                      (transactionData.priceImpact.gte(0)
                        ? "bonus"
                        : "slippage")
                    }
                  >
                    {" "}
                    {formatBNToPercentString(
                      transactionData.priceImpact,
                      18,
                      4,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
          />
        </div>
        <div className="infoPanels">
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
        </div>
        <Modal
          isOpen={!!currentModal}
          onClose={(): void => setCurrentModal(null)}
        >
          {currentModal === "review" ? (
            <ReviewDeposit
              transactionData={transactionData}
              onConfirm={async (): Promise<void> => {
                setCurrentModal("confirm")
                logEvent(
                  "deposit",
                  (poolData && { pool: poolData?.name }) || {},
                )
                await onConfirmTransaction?.()
                setCurrentModal(null)
              }}
              onClose={(): void => setCurrentModal(null)}
            />
          ) : null}
          {currentModal === "confirm" ? <ConfirmTransaction /> : null}
        </Modal>
      </div>
    </Container>
  )
}

export default DepositPage
