import "./Web3Status.scss"

import React, { ReactElement, useState } from "react"

import { withStyles } from "@material-ui/core/styles"
import ConnectWallet from "../ConnectWallet"
import Modal from "../Modal"
import { useTranslation } from "react-i18next"
import { useWeb3React } from "@web3-react/core"
import Chip from "@material-ui/core/Chip"
import Grid from "@material-ui/core/Grid"
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet"

// Todo: Link profile image to real account image

const StyledChip = withStyles(
  (theme) => ({
    root: {
      color: theme.palette.text.primary,
      border: "1px dashed",
      borderColor: theme.palette.text.primary,
      "& svg.MuiChip-deleteIcon": {
        color: theme.palette.text.primary,
      },
      "&:hover": {
        color: "white",
        borderColor: "white",
        "& svg.MuiChip-deleteIcon": {
          color: "white",
        },
      },
    },
  }),
  { withTheme: true },
)(Chip)

const Web3Status = (): ReactElement => {
  const { account } = useWeb3React()
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()

  const address = account ? (
    <span>
      {account.substring(0, 6)}...
      {account.substring(account.length - 4, account.length)}
    </span>
  ) : (
    <span>{t("connectWallet")}</span>
  )

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  return (
    <Grid>
      <StyledChip
        onClick={handleModalOpen}
        label={address}
        deleteIcon={<AccountBalanceWalletIcon />}
        onDelete={handleModalOpen}
        variant="outlined"
      />
      <Modal isOpen={modalOpen} onClose={(): void => setModalOpen(false)}>
        <ConnectWallet onClose={(): void => setModalOpen(false)} />
      </Modal>
    </Grid>
  )
}

export default Web3Status
