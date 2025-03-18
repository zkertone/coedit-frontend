import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import RealTimeEditor from '../components/Editor/RealTimeEditor';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../stores/store';
import { fetchDocument } from '../../stores/documentSlice';

const DocumentEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { currentDocument, loading, error } = useSelector((state: RootState) => state.documents);

    useEffect(() => {
        if (id) {
            dispatch(fetchDocument(id));
        }
    }, [id, dispatch]);

    if (!id) return null;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h4" component="h1">
                    {currentDocument?.title || '加载中...'}
                </Typography>
            </Box>
            <RealTimeEditor docId={id} />
        </Container>
    );
};

export default DocumentEditPage; 