import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../stores/store';
import { addDocumentPermission } from '../../stores/documentSlice';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography
} from '@mui/material';

interface PermissionDialogProps {
    open: boolean;
    onClose: () => void;
    documentId: string;
}

const PermissionDialog = ({ open, onClose, documentId }: PermissionDialogProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const [targetUserId, setTargetUserId] = useState('');
    const [role, setRole] = useState('READ');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!targetUserId.trim()) {
            setError('请输入用户ID');
            return;
        }

        try {
            await dispatch(addDocumentPermission({ documentId, targetUserId, role })).unwrap();
            onClose();
        } catch (error) {
            console.error('添加权限失败:', error);
            setError('添加权限失败，请重试');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>添加文档权限</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="用户ID"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>权限级别</InputLabel>
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="权限级别"
                        >
                            <MenuItem value="READ">只读</MenuItem>
                            <MenuItem value="WRITE">读写</MenuItem>
                        </Select>
                    </FormControl>
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    添加
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionDialog; 