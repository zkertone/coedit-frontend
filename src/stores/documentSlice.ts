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
            // console.log('文档列表响应:', response.data);
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
        
        // console.log('创建文档请求数据:', JSON.stringify(documentData));
        
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
            });
    }
});

export default documentSlice.reducer;
        
