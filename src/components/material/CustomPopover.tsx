import { Popover, createStyles, makeStyles } from "@material-ui/core"
import React, { ReactElement } from "react"

const useStyles = makeStyles((theme) =>
  createStyles({
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: theme.spacing(1),
    },
  }),
)

interface Props {
  onClose: () => void
  open: boolean
  anchorEl: HTMLElement | null
  children: React.ReactNode
}

export default function CustomPopover(props: Props): ReactElement {
  const { children, onClose, open, anchorEl } = props
  const classes = useStyles()

  return (
    <Popover
      id="mouse-over-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      disableRestoreFocus
    >
      {children}
    </Popover>
  )
}
