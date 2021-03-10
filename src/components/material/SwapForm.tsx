import React, { ReactElement } from "react"

import { BigNumber } from "@ethersproject/bignumber"
import ToolTip from "../ToolTip"
import classNames from "classnames"
import { formatBNToString } from "../../utils"
import { formatUnits } from "@ethersproject/units"
import { useTranslation } from "react-i18next"
import {
  Box,
  Button,
  createStyles,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  OutlinedInput,
  Popover,
  Typography,
} from "@material-ui/core"

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

const useStyles = makeStyles((theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
  }),
)

function SwapForm({
  tokens,
  selected,
  inputValue,
  isSwapFrom,
  onChangeSelected,
  onChangeAmount,
}: Props): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <form noValidate autoComplete="off">
      <Typography variant="h6" color="inherit">
        {isSwapFrom ? t("from") : t("to")}
      </Typography>
      <OutlinedInput
        autoComplete="off"
        autoCorrect="off"
        type="text"
        className={classNames({ hasMaxButton: isSwapFrom })}
        value={inputValue}
        placeholder="0.0"
        spellCheck="false"
        onChange={(e): void => onChangeAmount?.(e.target.value)}
        readOnly={!isSwapFrom}
        onFocus={(e): void => {
          if (isSwapFrom) {
            e.target.select()
          }
        }}
        endAdornment={isSwapFrom ? (
          <InputAdornment position="end">
            <Button
              disableElevation
              variant="contained"
              color="secondary"
              onClick={(): void => {
                const token = tokens.find((t) => t.symbol === selected)
                if (token) {
                  onChangeAmount?.(formatUnits(token.value, token.decimals))
                }
              }}
            >
              {t("max")}
            </Button>
          </InputAdornment>
        ) : (
          undefined
        )}
      />
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
                <Box>
                  <Typography
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    {formattedShortBalance}
                  </Typography>
                  <Popover
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                      paper: classes.paper,
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <Typography>{formattedLongBalance}</Typography>
                  </Popover>
                </Box>
              ) : null}
            </ListItem>
          )
        })}
      </List>
    </form>
  )
}

export default SwapForm
