import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <Dialog open={true} onClose={onCancel}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm}>Confirm</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmModal;