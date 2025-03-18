import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';

export interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    onlineUsers: number;
    creatorId: string;
    permissions: {
        userId: string;
        role: string;
    }[];
}

interface DocumentState {
    documents: Document[];
    currentDocument: Document | null;
    loading: boolean;
    error: string | null;
}

const initialState: DocumentState = {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null,
};

export const fetchDocuments = createAsyncThunk(
    'documents/fetchAll',
    async () => {
        try {
            const response = await api.get('/documents');
            return response.data;
        } catch (error) {
            console.error('获取文档列表失败:', error);
            throw error;
        }
    }
);

export const createDocument = createAsyncThunk(
    'documents/create',
    async (title: string) => {
        // 只传递标题
        const documentData = {
            title
        };

        const response = await api.post('/documents', documentData);
        return response.data;
    }
);

export const deleteDocument = createAsyncThunk(
    'documents/delete',
    async (id: string) => {
        await api.delete(`/documents/${id}`);
        return { id };
    }
);

export const fetchDocument = createAsyncThunk(
    'documents/fetchOne',
    async (id: string) => {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    }
);

export const updateDocument = createAsyncThunk(
    'documents/update',
    async (document: Document) => {
        const response = await api.put(`/documents/${document.id}`, document);
        return response.data;
    }
);

//文档权限
export const addDocumentPermission = createAsyncThunk(
    'documents/addPermission',
    async ({ documentId, targetUserId, role }: { documentId: string; targetUserId: string; role: string }) => {
        try {
            await api.post(`/documents/${documentId}/permissions`, {
                targetUserId,
                role
            });
            return { documentId, targetUserId, role };
        } catch (error) {
            console.error('添加文档权限失败:', error);
            throw error;
        }
    }
);

export const removeDocumentPermission = createAsyncThunk(
    'documents/deletePermission',
    async ({ documentId, targetUserId }: { documentId: string; targetUserId: string }) => {
        try {
            await api.delete(`/documents/${documentId}/permissions/${targetUserId}`);
            return { documentId, targetUserId };
        } catch (error) {
            console.error('删除文档权限失败:', error);
            throw error;
        }
    }
);

// 获取当前文档全部权限
export const fetchDocumentPermissions = createAsyncThunk(
    'documents/fetchPermissions',
    async (documentId: string) => {
        try {
            const response = await api.get(`/documents/${documentId}/permissions`);
            return {
                documentId,
                permissions: response.data
            };
        } catch (error) {
            console.error('获取文档权限失败:', error);
            throw error;
        }
    }
);

const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.documents = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '加载失败';
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                state.documents.unshift(action.payload);//在列表头部添加新文档
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                state.documents = state.documents.filter(doc => doc.id !== action.payload.id);
            })
            .addCase(fetchDocument.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.currentDocument = action.payload;
            })
            .addCase(fetchDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || '加载文档失败';
            })
            .addCase(addDocumentPermission.fulfilled, (_state, action) => {
                console.log('文档权限添加成功:', action.payload);
            })
            .addCase(addDocumentPermission.rejected, (_state, action) => {
                console.error('文档权限添加失败:', action.error);
            })
            .addCase(removeDocumentPermission.fulfilled, (_state, action) => {
                console.log('文档权限删除成功:', action.payload);
            })
            .addCase(removeDocumentPermission.rejected, (_state, action) => {
                console.error('文档权限删除失败:', action.error);
            })
            .addCase(fetchDocumentPermissions.fulfilled, (state, action) => {
                const { documentId, permissions } = action.payload;
                const document = state.documents.find(doc => doc.id === documentId);
                if (document) {
                    document.permissions = Object.entries(permissions).map(([userId, role]) => ({
                        userId,
                        role: role as string
                    }));
                }
            })
            .addCase(fetchDocumentPermissions.rejected, (_state, action) => {
                console.error('获取文档权限失败:', action.error);
            });
    }
});

export default documentSlice.reducer;
        
