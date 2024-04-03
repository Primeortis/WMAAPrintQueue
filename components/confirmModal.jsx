import {useState} from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <Dialog open={true} onClose={onCancel}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

const ExtraConfirmModal = ({ message, onConfirm, onCancel, confirmPhrase }) => {
    let [confirmField, setConfirmField] = useState("")
    
    return (
        <Dialog open={true} onClose={onCancel}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <p>{message}</p>
                <p>Type <em>{confirmPhrase}</em> to confirm</p>
                <TextField label="Confirmation" variant="outlined" value={confirmField} onChange={(e)=>setConfirmField(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} disabled={confirmField!=confirmPhrase}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};
export {ExtraConfirmModal};
export default ConfirmModal;