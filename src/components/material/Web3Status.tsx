import React, { ReactElement } from "react"
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet"
import Chip from "@material-ui/core/Chip"
import ConnectWallet from "./ConnectWallet"
import Grid from "@material-ui/core/Grid"
import { useTranslation } from "react-i18next"
import { useWeb3React } from "@web3-react/core"
import { withStyles } from "@material-ui/core/styles"

// Todo: Link profile image to real account image

const StyledChip = withStyles(
  (theme) => ({
    root: {
      color: theme.palette.text.secondary,
      border: "1px dashed",
      borderColor: theme.palette.text.secondary,
      "&:hover": {
        color: theme.palette.text.primary,
        borderColor: theme.palette.text.primary,
      },
    },
    deleteIcon: {
      marginRight: theme.spacing(2),
      color: "inherit",
      "&:hover": {
        color: "inherit",
      },
    },
  }),
  { withTheme: true },
)(Chip)

interface Props {
  className: string
}

const Web3Status = (props: Props): ReactElement => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)

  const address = account ? (
    <span>
      {account.substring(0, 6)}...
      {account.substring(account.length - 4, account.length)}
    </span>
  ) : (
    <span>{t("connectWallet")}</span>
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Grid {...props}>
      <StyledChip
        onClick={handleClickOpen}
        label={address}
        deleteIcon={<AccountBalanceWalletIcon />}
        onDelete={handleClickOpen}
        variant="outlined"
      />
      <ConnectWallet onClose={handleClose} open={open} />
    </Grid>
  )
}

export default Web3Status
