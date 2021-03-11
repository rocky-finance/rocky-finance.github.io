import React, { ReactElement } from "react"

import { BigNumber } from "@ethersproject/bignumber"
import { formatBNToString } from "../../utils"
import { formatUnits } from "@ethersproject/units"
import { useTranslation } from "react-i18next"
import CustomPopover from "./CustomPopover"
import {
  Box,
  Button,
  createStyles,
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  OutlinedInput,
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
    helper: {
      marginLeft: theme.spacing(1),
    },
    input: {
      width: "100%",
    },
    paper: {
      padding: theme.spacing(1),
    },
    divider: {
      margin: theme.spacing(1, 0),
      background: "none",
      borderBottom: "1px dashed",
      borderBottomColor: theme.palette.text.secondary,
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

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  return (
    <FormControl autoCorrect="false" fullWidth variant="outlined">
      <FormLabel component="legend">
        {isSwapFrom ? t("from") : t("to")}
      </FormLabel>
      <Divider className={classes.divider} />
      <FormGroup>
        <List component="nav">
          {tokens.map(({ symbol, value, icon, name, decimals }) => {
            const formattedShortBalance = formatBNToString(value, decimals, 6)
            const formattedLongBalance = formatBNToString(value, decimals)
            return (
              <Box key={symbol}>
                <ListItem
                  button
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
                      <CustomPopover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                      >
                        <Typography>{formattedLongBalance}</Typography>
                      </CustomPopover>
                    </Box>
                  ) : null}
                </ListItem>
                {/* <Divider className={classes.divider} light /> */}
              </Box>
            )
          })}
        </List>
        <FormControl>
          <FormHelperText className={classes.helper} id="amount-helper-text">
            {t("amount")}
          </FormHelperText>
          <OutlinedInput
            autoComplete="off"
            autoCorrect="off"
            id="amount"
            type="text"
            className={classes.input}
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
            endAdornment={
              isSwapFrom ? (
                <InputAdornment position="end">
                  <Button
                    disableElevation
                    variant="contained"
                    color="secondary"
                    onClick={(): void => {
                      const token = tokens.find((t) => t.symbol === selected)
                      if (token) {
                        onChangeAmount?.(
                          formatUnits(token.value, token.decimals),
                        )
                      }
                    }}
                  >
                    {t("max")}
                  </Button>
                </InputAdornment>
              ) : undefined
            }
          />
        </FormControl>
      </FormGroup>
    </FormControl>
  )
}

export default SwapForm
