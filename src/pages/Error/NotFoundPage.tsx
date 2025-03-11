import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <Container sx={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <Typography variant="h1" sx={{ mb: 4 }}>404</Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>页面不存在</Typography>
            <Button component={Link} to="/" variant="contained">
                返回首页
            </Button>
        </Container>
    );
};

export default NotFoundPage; 