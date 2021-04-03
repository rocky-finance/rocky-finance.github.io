import {
  Divider,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import TokenInput from "./TokenInput"
import { WithdrawFormState } from "../../hooks/useWithdrawFormState"
import { useTranslation } from "react-i18next"

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  formState: WithdrawFormState
  tokens: Array<{
    symbol: string
    name: string
    icon: string
    inputValue: string
  }>
  onChange: (action: any) => void
}

const useStyles = makeStyles((theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(2, 0),
    },
    controlContainer: {
      padding: theme.spacing(2, 0),
    },
    helper: {
      marginLeft: theme.spacing(1),
    },
    flex: {
      flex: 1,
    },
    input: {
      flex: 1,
      "& input": {
        textAlign: "right",
      },
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

export default function WithdrawForm(props: Props): ReactElement {
  const { t } = useTranslation()
  const { formState, tokens, onChange } = props
  const classes = useStyles()

  const [withdrawToken, setWithdrawToken] = React.useState("ALL")

  return (
    <FormControl autoCorrect="false" fullWidth variant="outlined">
      <Typography variant="subtitle1">{t("withdraw")}</Typography>
      <Divider className={classes.divider} />
      <Grid container component={FormGroup}>
        <Grid item container spacing={1} className={classes.controlContainer}>
          <Grid item container xs={6} direction="column">
            <FormControl>
              <InputLabel id="select-type-label" variant="outlined">
                {t("to")}
              </InputLabel>
              <Select
                labelId="select-type-label"
                id="select-type"
                value={withdrawToken}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                  setWithdrawToken(event.target.value as string)
                  onChange({
                    fieldName: "withdrawType",
                    value: event.target.value as string,
                  })
                }}
                label={t("to")}
                variant="outlined"
              >
                <MenuItem value="ALL">{t("combo")}</MenuItem>
                {tokens.map((token) => (
                  <MenuItem key={token.symbol} value={token.symbol}>
                    <ListItemIcon>
                      <img src={token.icon} alt="icon" />
                    </ListItemIcon>
                    {token.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container xs={6} direction="column">
            <FormControl className={classes.flex}>
              <InputLabel variant="outlined">
                {t("withdrawPercentage")}
              </InputLabel>
              <OutlinedInput
                className={classes.input}
                autoComplete="off"
                autoCorrect="off"
                type="text"
                label={t("withdrawPercentage")}
                fullWidth
                value={formState.percentage ? formState.percentage : ""}
                placeholder="0.0"
                spellCheck="false"
                endAdornment="%"
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                  onChange({
                    fieldName: "percentage",
                    value: e.currentTarget.value,
                  })
                }
                onFocus={(
                  event: React.FocusEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >,
                ): void => {
                  event.target.select()
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <List component="nav">
          {tokens.map((token, index) => {
            return (
              <ListItem key={index} disableGutters>
                <TokenInput
                  {...token}
                  onChange={(value): void =>
                    onChange({
                      fieldName: "tokenInputs",
                      value: value,
                      tokenSymbol: token.symbol,
                    })
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </Grid>
      <FormHelperText variant="outlined">
        {formState.error && `${formState.error.message}`}
      </FormHelperText>
    </FormControl>
  )
}
