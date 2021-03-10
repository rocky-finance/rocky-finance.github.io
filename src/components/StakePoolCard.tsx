import "./StakePoolCard.scss"
import React, { ReactElement, useState } from "react"
import Button from "./Button"
import TokenInput from "./TokenInput"
import { useTranslation } from "react-i18next"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  title: string
  onHarvest: () => void
  onDeposit: (amount: string) => void
  onWithdraw: (amount: string) => void
  token: {
    symbol: string
    name: string
    icon: string
    max: string
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
const StakePool = (props: Props): ReactElement => {
  const { t } = useTranslation()
  const [depositAmount, setDepositAmount] = useState("0")
  const [withdrawAmount, setWithdrawAmount] = useState("0")

  return (
    <div className="stakePoolCard">
      <div className="form">
        <div className="harvest">
          <Button onClick={props.onHarvest} size="small" kind="ternary">
            {t("harvest")}
          </Button>
        </div>
        <img className="icon" alt="icon" src={props.token.icon} />
        <h3 className="bold">{props.title}</h3>
        <div className="transactionInfoItem">
          <span className="label bold">{t("apy")}: </span>
          <span className="value">12.32%</span>
        </div>
        <div className="transactionInfoItem">
          <span className="label bold">{t("totalStake")}: </span>
          <span className="value">8,000,234 {props.token.symbol}</span>
        </div>
        <div className="transactionInfoItem">
          <span className="label bold">{t("yourStake")}: </span>
          <span className="value">100 {props.token.symbol} ($24.52)</span>
        </div>

        <div className="transactionInfoItem">
          <span className="label bold">{t("pendingRewards")}: </span>
          <span className="value">0.003 ROCKY ($1.52)</span>
        </div>
        <div className="divider"></div>
        <div className="actions">
          <div className="transactionInfoItem">
            <TokenInput
              {...props.token}
              icon=""
              inputValue={depositAmount}
              disableSymbol={true}
              max="100"
              onChange={setDepositAmount}
            />
            <div className="actionButton">
              <Button
                onClick={() => props.onDeposit(depositAmount)}
                size="full"
                kind="secondary"
                disabled={depositAmount == "0"}
              >
                {t("deposit")}
              </Button>
            </div>
          </div>
          <div className="transactionInfoItem">
            <TokenInput
              {...props.token}
              icon=""
              inputValue={withdrawAmount}
              disableSymbol={true}
              max="100"
              onChange={setWithdrawAmount}
            />
            <div className="actionButton">
              <Button
                onClick={() => props.onWithdraw(withdrawAmount)}
                size="full"
                kind="secondary"
                disabled={withdrawAmount == "0"}
              >
                {t("withdraw")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StakePool
