import React, { ReactElement } from "react"

import { TOKENS_MAP } from "../../constants"
import { useTranslation } from "react-i18next"
import {
  Button,
  createStyles,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  makeStyles,
  OutlinedInput,
} from "@material-ui/core"

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      "& input": {
        textAlign: "right",
      },
    },
  }),
)

interface Props {
  symbol: string
  icon: string
  name: string
  max?: string
  inputValue: string
  disabled?: boolean
  onChange: (value: string) => void
  exceedsWallet: (tokenSymbol: string) => boolean
}

export default function TokenInput({
  symbol,
  icon,
  name,
  max,
  inputValue,
  disabled,
  onChange,
  exceedsWallet,
}: Props): ReactElement {
  const { t } = useTranslation()
  const classes = useStyles()

  function onClickMax(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault()
    onChange(String(max))
  }

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>): void {
    const { decimals } = TOKENS_MAP[symbol]
    const parsedValue = parseFloat("0" + e.target.value)
    const periodIndex = e.target.value.indexOf(".")
    const isValidInput = e.target.value === "" || !isNaN(parsedValue)
    const isValidPrecision =
      periodIndex === -1 || e.target.value.length - 1 - periodIndex <= decimals
    if (isValidInput && isValidPrecision) {
      // don't allow input longer than the token allows
      onChange(e.target.value)
    }
  }

  function hasError(symbol: string): boolean {
    return exceedsWallet(symbol)
  }

  return (
    <FormControl fullWidth error={hasError(symbol)}>
      <InputLabel htmlFor={`amount-${symbol}`} variant="outlined">
        {t("balance")}: {max}
      </InputLabel>
      <Grid
        container
        direction="row"
        wrap="nowrap"
        component={OutlinedInput}
        autoComplete="off"
        id={`amount-${symbol}`}
        className={classes.input}
        autoCorrect="off"
        type="text"
        label={`${t("balance")}: ${String(max)}`}
        fullWidth
        value={inputValue}
        placeholder="0"
        spellCheck="false"
        onChange={onChangeInput}
        onFocus={(
          event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
        ): void => {
          event.target.select()
        }}
        disabled={disabled ? true : false}
        startAdornment={
          <Grid
            item
            container
            wrap="nowrap"
            xs={4}
            component={InputAdornment}
            disablePointerEvents
            position="start"
          >
            <ListItemIcon>
              <img src={icon} alt="icon" />
            </ListItemIcon>
            {name}
            <Divider orientation="vertical" />
          </Grid>
        }
        endAdornment={
          max != null && (
            <Grid
              item
              container
              wrap="nowrap"
              xs
              component={InputAdornment}
              position="end"
            >
              <Button
                disableElevation
                variant="contained"
                color="secondary"
                disabled={disabled}
                onClick={onClickMax}
              >
                {t("max")}
              </Button>
            </Grid>
          )
        }
      />
      <FormHelperText variant="outlined">
        {
          hasError(symbol)
            ? t("depositBalanceExceeded")
            : String.fromCharCode(160) // &nbsp;
        }
      </FormHelperText>
    </FormControl>
  )
}
