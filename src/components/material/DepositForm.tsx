import {
  Divider,
  FormControl,
  FormGroup,
  List,
  ListItem,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core"
import React, { ReactElement } from "react"
import TokenInput from "./TokenInput"
import { useTranslation } from "react-i18next"

interface Props {
  tokens: Array<{
    symbol: string
    name: string
    icon: string
    max: string
    isZeroBalance: boolean
    inputValue: string
  }>
  onChangeTokenInputValue: (tokenSymbol: string, value: string) => void
  exceedsWallet: (tokenSymbol: string) => boolean
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
      <Typography variant="subtitle1">{t("addLiquidity")}</Typography>
      <Divider className={classes.divider} />
      <FormGroup>
        <List component="nav">
          {tokens.map((token, index) => {
            return (
              <ListItem key={index} disableGutters>
                <TokenInput
                  {...token}
                  label={`${t("balance")}: ${String(token.max)}`}
                  exceedsWallet={exceedsWallet}
                  disabled={token.isZeroBalance}
                  onChange={(value): void =>
                    onChangeTokenInputValue(token.symbol, value)
                  }
                />
              </ListItem>
            )
          })}
        </List>
      </FormGroup>
    </FormControl>
  )
}
