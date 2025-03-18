import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../stores/store";
import { Alert, Box, Button, CircularProgress, Container, IconButton, List, ListItem, ListItemText, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Add, Delete, PersonAdd, PersonRemove } from "@mui/icons-material";
import { fetchDocuments, createDocument, deleteDocument, Document, removeDocumentPermission, fetchDocumentPermissions } from "../../stores";
import { ListItemContainer } from "./documentStyles";
import PermissionDialog from "../../components/Document/PermissionDialog";
import ErrorBoundary from "../../components/ErrorBoundary";

interface DocumentPermissionsResponse {
    documentId: string;
    permissions: Record<string, string>;
}

const DocumentListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { documents, loading, error: fetchError } = useSelector((state: RootState) => state.documents);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
    const [openDeletePermissionDialog, setOpenDeletePermissionDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [documentTitle, setDocumentTitle] = useState('未命名文档');
    const [formError, setFormError] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [documentPermissions, setDocumentPermissions] = useState<Array<{userId: string, role: string}>>([]);

    //加载文档列表
    useEffect(() => {
        dispatch(fetchDocuments());
    }, [dispatch]);

    //打开创建文档对话框
    const handleOpenCreate = () => setOpenDialog(true);

    //创建新文档
    const handleCreateDocument = async () => {
        if (!documentTitle.trim()) {
            setFormError('文档标题不能为空');
            return;
        }
        console.log('创建文档标题:', documentTitle);
        try{
            setIsCreating(true);
            const newDocument = await dispatch(createDocument(documentTitle));
            console.log('创建文档成功:', newDocument);
            navigate(`/document/${newDocument.payload.id}`);//跳转到新文档编辑界面
        } catch(error){
            console.error('创建文档失败:',error);
        } finally {
            setIsCreating(false);
            setOpenDialog(false);
        }
    };

    //在对话框打开时自动聚焦输入框
    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                const input = document.querySelector('input');
                if (input) {
                    input.focus();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [openDialog]);

    //过滤文档
    const filteredDocs = documents.filter((doc: Document) => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 处理删除确认
    const handleDeleteClick = (docId: string) => {
        setSelectedDocId(docId);
        setDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedDocId) {
            dispatch(deleteDocument(selectedDocId));
            setDeleteConfirm(false);
            setSelectedDocId('');
        }
    };

    // 处理添加权限
    const handleOpenPermission = (docId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // 阻止事件冒泡，避免触发文档点击
        setSelectedDocId(docId);
        setOpenPermissionDialog(true);
    };

    // 处理删除权限
    const handleDeletePermission = async (docId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedDocId(docId);
        setOpenDeletePermissionDialog(true);
        try {
            const result = await dispatch(fetchDocumentPermissions(docId));
            console.log('获取权限结果:', result);
            const payload = result.payload as DocumentPermissionsResponse;
            if (payload?.permissions) {
                const permissions = Object.entries(payload.permissions).map(([userId, role]) => ({
                    userId,
                    role: String(role)
                }));
                console.log('转换后的权限:', permissions);
                setDocumentPermissions(permissions);
            }
        } catch (error) {
            console.error('获取权限失败:', error);
        }
    };

    const handleDeletePermissionConfirm = () => {
        if (selectedDocId && selectedUserId) {
            dispatch(removeDocumentPermission({ documentId: selectedDocId, targetUserId: selectedUserId }));
            setOpenDeletePermissionDialog(false);
            setSelectedUserId('');
        }
    };

    return (
        <ErrorBoundary>
            <Container maxWidth="md">
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        我的文档
                    </Typography>
                    <Button 
                        variant="contained"
                        startIcon={<Add />}
                        color="primary" 
                        onClick={handleOpenCreate}>
                        创建新文档
                    </Button>
                </Box>

                {/* 创建文档对话框 */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>创建新文档</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="文档标题"
                            fullWidth
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            error={!!formError}
                            helperText={formError}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>取消</Button>
                        <Button onClick={handleCreateDocument} disabled={isCreating}>
                            {isCreating ? '创建中...' : '创建'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {filteredDocs.length === 0 && !loading && (
                    <Alert severity="info" sx={{mt: 2}}>
                        {searchTerm ? '没有匹配的文档' : '您还未创建任何文档'}
                    </Alert>
                )}
                <TextField
                    label="搜索文档"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
                {fetchError && <Alert severity="error">{fetchError}</Alert>}
                {loading ? (
                    <CircularProgress sx={{display: 'block', margin: '0 auto'}} />
                ) : (
                    <List>
                        {filteredDocs.map((doc: Document) => (
                            <ListItemContainer 
                                onClick={() => navigate(`/document/${doc.id}`)}
                                key={doc.id}
                                secondaryAction={
                                    <>
                                        <IconButton onClick={(e) => handleOpenPermission(doc.id, e)}>
                                            <PersonAdd />
                                        </IconButton>
                                        <IconButton onClick={(e) => handleDeletePermission(doc.id, e)}>
                                            <PersonRemove />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(doc.id)}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemText 
                                    primary={doc.title} 
                                    secondary={
                                        <>
                                            {`创建者: ${doc.creatorId} · 创建于${formatDate(doc.createdAt)}·最后更新于${formatDate(doc.updatedAt)}`}
                                            {doc.onlineUsers > 0 && (
                                                <span style={{color: 'gray', marginLeft: '10px'}}>
                                                    {doc.onlineUsers}人在线
                                                </span>
                                            )}
                                        </>
                                    }
                                />
                            </ListItemContainer>
                        ))}
                    </List>
                )}

                {/* 权限管理对话框 */}
                <PermissionDialog
                    open={openPermissionDialog}
                    onClose={() => setOpenPermissionDialog(false)}
                    documentId={selectedDocId}
                />

                {/* 权限删除对话框 */}
                <Dialog open={openDeletePermissionDialog} onClose={() => setOpenDeletePermissionDialog(false)}>
                    <DialogTitle>删除文档权限</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1" gutterBottom>
                            当前文档的所有用户权限：
                        </Typography>
                        <List>
                            {documentPermissions.map((permission) => (
                                <ListItem key={permission.userId}>
                                    <ListItemText
                                        primary={`用户ID: ${permission.userId}`}
                                        secondary={
                                            <Typography component="span" variant="body2">
                                                权限级别: {permission.role}
                                            </Typography>
                                        }
                                    />
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            setSelectedUserId(permission.userId);
                                            handleDeletePermissionConfirm();
                                        }}
                                    >
                                        删除
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeletePermissionDialog(false)}>关闭</Button>
                    </DialogActions>
                </Dialog>

                {/* 删除确认对话框 */}
                <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogContent>
                        确定要删除这个文档吗？此操作不可撤销。
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirm(false)}>取消</Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            删除
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ErrorBoundary>
    );
};

//格式化日期
const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default DocumentListPage;