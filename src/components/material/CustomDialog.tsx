import React from "react"
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog, { DialogProps } from "@material-ui/core/Dialog"
import MuiDialogTitle from "@material-ui/core/DialogTitle"
import MuiDialogContent from "@material-ui/core/DialogContent"
import MuiDialogActions from "@material-ui/core/DialogActions"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"

const styles = (theme: Theme) =>
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

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent)

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)

interface CustomDialogProps extends DialogProps {
  title?: string
  action?: React.ReactNode
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const CustomDialog = React.forwardRef(function CustomDialog(
  inProps: CustomDialogProps,
  ref,
) {
  const { title, action, children, onClose, ...other } = inProps
  const { t } = useTranslation()

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      ref={ref}
      {...other}
    >
      {title && (
        <DialogTitle id="customized-dialog-title" onClose={onClose}>
          {title}
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        {action}
        <Button autoFocus onClick={onClose} color="primary" variant="contained">
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default CustomDialog
