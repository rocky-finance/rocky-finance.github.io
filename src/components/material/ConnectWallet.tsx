import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  IconButton,
  Link,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  makeStyles,
  withStyles,
} from "@material-ui/core"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { injected, walletconnect, walletlink } from "../../connectors"
import CloseIcon from "@material-ui/icons/Close"
import MuiDialogTitle from "@material-ui/core/DialogTitle"
import React from "react"
import { ReactElement } from "react"
import coinbasewalletIcon from "../../assets/icons/coinbasewallet.svg"
import { logEvent } from "../../utils/googleAnalytics"
import metamaskIcon from "../../assets/icons/metamask.svg"
import { useTranslation } from "react-i18next"
import walletconnectIcon from "../../assets/icons/walletconnect.svg"

const titleStyles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })

export interface DialogTitleProps extends WithStyles<typeof titleStyles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(titleStyles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const useStyles = makeStyles((theme) => ({
  group: {
    minWidth: "300px",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: "2em",
    height: "2em",
    marginLeft: theme.spacing(2),
    "& img": {
      width: "100%",
      height: "100%",
    },
  },
  actions: {
    padding: theme.spacing(1, 2),
    display: "flex",
    justifyContent: "space-between",
  },
}))

const wallets = [
  {
    name: "MetaMask",
    icon: metamaskIcon,
    connector: injected,
  },
  {
    name: "Wallet Connect",
    icon: walletconnectIcon,
    connector: walletconnect,
  },
  {
    name: "Coinbase Wallet",
    icon: coinbasewalletIcon,
    connector: walletlink,
  },
]

interface Props {
  onClose: () => void
  open: boolean
}

function ConnectWallet({ onClose, open }: Props): ReactElement {
  const { t } = useTranslation()
  const { activate } = useWeb3React()
  const classes = useStyles()

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {t("connectWallet")}
      </DialogTitle>
      <DialogContent dividers>
        <ButtonGroup
          orientation="vertical"
          color="inherit"
          variant="text"
          className={classes.group}
        >
          {wallets.map((wallet, index) => (
            <Button
              className={classes.button}
              key={index}
              onClick={(): void => {
                activate(wallet.connector, undefined, true).catch((error) => {
                  if (error instanceof UnsupportedChainIdError) {
                    void activate(wallet.connector) // a little janky...can't use setError because the connector isn't set
                  } else {
                    // TODO: handle error
                  }
                })
                logEvent("change_wallet", { name: wallet.name })
                onClose()
              }}
            >
              <span>{wallet.name}</span>
              <Icon className={classes.icon}>
                <img src={wallet.icon} alt="icon" className="icon" />
              </Icon>
            </Button>
          ))}
        </ButtonGroup>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Typography gutterBottom>{t("dontHaveWallet")}</Typography>
        <Typography gutterBottom>
          <Link href="https://ethereum.org/en/wallets/" target="blank">
            {t("getWallet")}
          </Link>
        </Typography>
      </DialogActions>
    </Dialog>
  )
}

export default ConnectWallet
