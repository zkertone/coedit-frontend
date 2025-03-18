import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../stores/store";
import { Alert, Box, Button, CircularProgress, Container, IconButton, List, ListItem, ListItemText, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { fetchDocuments, createDocument, deleteDocument, Document } from "../../stores";

const DocumentListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { documents, loading, error: fetchError } = useSelector((state: RootState) => state.documents);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [documentTitle, setDocumentTitle] = useState('未命名文档');
    const [formError, setFormError] = useState('');
    const [isCreating, setIsCreating] = useState(false);

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

    return (
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
                       <ListItem 
                       key={doc.id}
                        secondaryAction={
                            <>
                            <IconButton onClick={() => navigate(`/document/${doc.id}`)}>
                                <Edit />
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
                        </ListItem>
                ))}
            </List>
        )}

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
    )
}

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