import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

export default function ConfirmationDialog({open, setOpen, onConfirm}) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Potwierdź usunięcie przepisu</DialogTitle>
            <DialogContent>Tej operacji nie można cofnąć</DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Anuluj</Button>
                <Button onClick={handleConfirm} variant="contained">OK</Button>
            </DialogActions>
        </Dialog>
    );
}
