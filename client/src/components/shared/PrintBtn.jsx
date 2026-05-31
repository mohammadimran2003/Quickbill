import { Button, Tooltip } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

function PrintBtn({ onHandlePrint }) {
  return (
    <Tooltip title="Print Invoice">
      <Button
        variant="outlined"
        startIcon={<PrintIcon />}
        onClick={onHandlePrint}
      >
        Print
      </Button>
    </Tooltip>
  );
}

export default PrintBtn;
