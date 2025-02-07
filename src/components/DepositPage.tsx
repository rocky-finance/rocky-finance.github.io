import "./DepositPage.scss"

import { Button, Center } from "@chakra-ui/react"
import { PoolDataType, UserShareType } from "../hooks/usePoolData"
import React, { ReactElement, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { AppDispatch } from "../state"
import { AppState } from "../state"
import { BigNumber } from "@ethersproject/bignumber"
import ConfirmTransaction from "./ConfirmTransaction"
import DeadlineField from "./DeadlineField"
import { DepositTransaction } from "../interfaces/transactions"
import GasField from "./GasField"
import { HistoricalPoolDataType } from "../hooks/useHistoricalPoolData"
import InfiniteApprovalField from "./InfiniteApprovalField"
import LPStakingBanner from "./LPStakingBanner"
import Modal from "./Modal"
import MyActivityCard from "./MyActivityCard"
import MyShareCard from "./MyShareCard"
import { PayloadAction } from "@reduxjs/toolkit"
import PoolInfoCard from "./PoolInfoCard"
import { REFS } from "../constants"
import ReviewDeposit from "./ReviewDeposit"
import SlippageField from "./SlippageField"
import TokenInput from "./TokenInput"
import TopMenu from "./TopMenu"
import classNames from "classnames"
import { formatBNToPercentString } from "../utils"
import { logEvent } from "../utils/googleAnalytics"
import { updatePoolAdvancedMode } from "../state/user"
import { useTranslation } from "react-i18next"

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

  const dispatch = useDispatch<AppDispatch>()
  const { userPoolAdvancedMode: advanced } = useSelector(
    (state: AppState) => state.user,
  )
  const validDepositAmount = transactionData.to.totalAmount.gt(0)

  return (
    <div className="deposit">
      <TopMenu activeTab={"deposit"} />
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
                      <span>{t("totalAPY")}: </span>
                    </a>{" "}
                    <span className="value">
                      {formatBNToPercentString(
                        poolData.totalAPY
                          ? poolData.totalAPY
                          : BigNumber.from(0),
                        18,
                      )}
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
          <div className="advancedOptions">
            <span
              className="title"
              onClick={(): PayloadAction<boolean> =>
                dispatch(updatePoolAdvancedMode(!advanced))
              }
            >
              {t("advancedOptions")}
              <svg
                className={classNames("triangle", { upsideDown: advanced })}
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.8252 0C16.077 0 16.3783 0.827943 15.487 1.86207L8.80565 9.61494C8.35999 10.1321 7.63098 10.1246 7.19174 9.61494L0.510262 1.86207C-0.376016 0.833678 -0.0777447 0 1.17205 0L14.8252 0Z"
                  fill="#000000"
                />
              </svg>
            </span>
            <div className="divider"></div>
            <div className={"tableContainer" + classNames({ show: advanced })}>
              <div className="parameter">
                <InfiniteApprovalField />
              </div>
              <div className="parameter">
                <SlippageField />
              </div>
              <div className="parameter">
                <DeadlineField />
              </div>
              <div className="parameter">
                <GasField />
              </div>
            </div>
          </div>
          <Center width="100%" py={6}>
            <Button
              variant="primary"
              size="lg"
              width="240px"
              onClick={(): void => {
                setCurrentModal("review")
              }}
              disabled={!validDepositAmount}
            >
              {t("deposit")}
            </Button>
          </Center>
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
    </div>
  )
}

export default DepositPage
