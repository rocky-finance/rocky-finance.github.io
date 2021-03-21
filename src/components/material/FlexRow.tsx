import { Grid, GridJustification, Typography } from "@material-ui/core"
import React, { ReactElement } from "react"

interface Props {
  left?: React.ReactNode
  right?: React.ReactNode
  justify?: GridJustification
  fullWidth?: boolean
}

function FlexRow({ left, right, justify, fullWidth }: Props): ReactElement {
  const leftItem: React.ReactNode =
    typeof left === "string" ? (
      <Grid item>
        <Typography variant="body1">{left}</Typography>
      </Grid>
    ) : (
      left
    )

  const rightItem: React.ReactNode =
    typeof right === "string" ? (
      <Grid item>
        <Typography variant="body1" style={{ whiteSpace: "nowrap" }}>
          {right}
        </Typography>
      </Grid>
    ) : (
      right
    )

  return (
    <Grid item container direction="column" xs={fullWidth ? 12 : "auto"}>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        wrap="nowrap"
        justify={justify ? justify : "flex-start"}
      >
        {leftItem}
        {rightItem}
      </Grid>
    </Grid>
  )
}

export default FlexRow
