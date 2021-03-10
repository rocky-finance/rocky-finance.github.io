import { withStyles } from "@material-ui/core/styles"
import Chip from "@material-ui/core/Chip"

export const StyledChip = withStyles(
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
