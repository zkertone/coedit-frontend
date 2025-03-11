import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const DocumentPage = () => {
    const { id } = useParams();

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                文档编辑页面
            </Typography>
            <Typography variant="body1">
                文档 ID: {id}
            </Typography>
        </Container>
    );
};

export default DocumentPage; 