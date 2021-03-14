import React, { ReactElement } from "react"

import { useTranslation } from "react-i18next"
import {
  createStyles,
  Divider,
  FormControl,
  FormGroup,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import TokenInput from "./TokenInput"

interface Props {
  exceedsWallet: boolean
  tokens: Array<{
    symbol: string
    name: string
    icon: string
    max: string
    inputValue: string
  }>
  onChangeTokenInputValue: (tokenSymbol: string, value: string) => void
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

export default function DepositForm(props: Props): ReactElement {
  const { t } = useTranslation()
  const { exceedsWallet, tokens, onChangeTokenInputValue } = props
  const classes = useStyles()

  return (
    <FormControl autoCorrect="false" fullWidth variant="outlined">
      <FormLabel component="legend">{t("addLiquidity")}</FormLabel>
      {exceedsWallet ? (
        <div className="error">{t("depositBalanceExceeded")}</div>
      ) : null}
      <Divider className={classes.divider} />
      <FormGroup>
        <List component="nav">
          {tokens.map((token, index) => {
            return (
              <ListItem key={index}>
                <Grid item component={ListItemIcon} xs={1}>
                  <img src={token.icon} alt="icon" />
                </Grid>
                <Grid item component={ListItemText} primary={token.name} />
                <Grid item xs={8}>
                  <TokenInput
                    {...token}
                    onChange={(value): void =>
                      onChangeTokenInputValue(token.symbol, value)
                    }
                  />
                </Grid>
              </ListItem>
            )
          })}
        </List>
      </FormGroup>
    </FormControl>
  )
}
