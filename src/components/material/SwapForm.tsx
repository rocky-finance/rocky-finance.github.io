import React, { ReactElement } from "react"

import { BigNumber } from "@ethersproject/bignumber"
import Button from "../Button"
import ToolTip from "../ToolTip"
import classNames from "classnames"
import { formatBNToString } from "../../utils"
import { formatUnits } from "@ethersproject/units"
import { useTranslation } from "react-i18next"
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"

interface Props {
  isSwapFrom: boolean
  tokens: Array<{
    name: string
    value: BigNumber
    icon: string
    symbol: string
    decimals: number
  }>
  selected: string
  inputValue: string
  onChangeSelected: (tokenSymbol: string) => void
  onChangeAmount?: (value: string) => void
}

function SwapForm({
  tokens,
  selected,
  inputValue,
  isSwapFrom,
  onChangeSelected,
  onChangeAmount,
}: Props): ReactElement {
  const { t } = useTranslation()

  return (
    <div>
      <div>
        <h4>{isSwapFrom ? t("from") : t("to")}</h4>
        <div>
          <input
            autoComplete="off"
            autoCorrect="off"
            type="text"
            className={classNames({ hasMaxButton: isSwapFrom })}
            value={inputValue}
            placeholder="0.0"
            spellCheck="false"
            onChange={(e): void => onChangeAmount?.(e.target.value)}
            onFocus={(e: React.ChangeEvent<HTMLInputElement>): void => {
              if (isSwapFrom) {
                e.target.select()
              }
            }}
            readOnly={!isSwapFrom}
          />
          {isSwapFrom ? (
            <div>
              <Button
                size="small"
                kind="ternary"
                onClick={(): void => {
                  const token = tokens.find((t) => t.symbol === selected)
                  if (token && onChangeAmount) {
                    onChangeAmount(formatUnits(token.value, token.decimals))
                  }
                }}
              >
                {t("max")}
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <List component="nav">
        {tokens.map(({ symbol, value, icon, name, decimals }) => {
          const formattedShortBalance = formatBNToString(value, decimals, 6)
          const formattedLongBalance = formatBNToString(value, decimals)
          return (
            <ListItem
              button
              key={symbol}
              selected={selected === symbol}
              onClick={(): void => onChangeSelected(symbol)}
            >
              <ListItemIcon>
                <img src={icon} alt="icon" />
              </ListItemIcon>
              <ListItemText primary={name} />
              {isSwapFrom ? (
                <span>
                  <ToolTip content={formattedLongBalance}>
                    {formattedShortBalance}
                  </ToolTip>
                </span>
              ) : null}
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

export default SwapForm
