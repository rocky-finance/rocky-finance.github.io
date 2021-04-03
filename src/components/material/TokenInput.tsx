import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  OutlinedInput,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import { TOKENS_MAP } from "../../constants"
import { useTranslation } from "react-i18next"

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
  label?: string
  inputValue: string
  disabled?: boolean
  onChange: (value: string) => void
  exceedsWallet?: (tokenSymbol: string) => boolean
}

export default function TokenInput({
  label,
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
    const parsedValue = parseFloat("0" + String(max))
    const isValidInput = !isNaN(parsedValue) && parsedValue != 0
    if (isValidInput) updateValue(String(max))
    else updateValue("")
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
      updateValue(e.target.value)
    }
  }

  function updateValue(v: string): void {
    inputValue = v
    onChange(v)
  }

  function hasError(symbol: string): boolean {
    return exceedsWallet ? exceedsWallet(symbol) : false
  }

  return (
    <FormControl fullWidth error={hasError(symbol)}>
      {label && (
        <InputLabel htmlFor={`amount-${symbol}`} variant="outlined">
          {label}
        </InputLabel>
      )}
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
        label={label}
        fullWidth
        value={inputValue}
        placeholder="0.0"
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
