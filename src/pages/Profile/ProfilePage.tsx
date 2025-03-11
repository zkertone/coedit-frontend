import { Container, Typography } from '@mui/material';

const ProfilePage = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                个人资料
            </Typography>
            <Typography variant="body1">
                这里是用户的个人资料页面
            </Typography>
        </Container>
    );
};

export default ProfilePage; 