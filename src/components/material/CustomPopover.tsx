import React, { ReactElement } from "react"
import { createStyles, makeStyles, Popover } from "@material-ui/core"

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
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      onClose={onClose}
      disableRestoreFocus
    >
      {children}
    </Popover>
  )
}
