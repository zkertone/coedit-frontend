import { Container, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthCard } from './authStyles';
const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username:'',
        password:'',
        confirmPassword:'',
        email:''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 密码复杂度验证
    const validatePassword = (password: string) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const conditions = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
        const metConditions = conditions.filter(condition => condition).length;
        
        return metConditions >= 3;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('密码不匹配');
            return;
        }
        if (formData.password.length < 6) {
            setError('密码长度不能少于6位');
            return;
        }

        if (!validatePassword(formData.password)) {
            setError('密码必须包含大写字母、小写字母、数字、特殊字符中的至少三种');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/api/auth/register', formData);
            
            // 注册成功（状态码 2xx）
            if (response.status >= 200 && response.status < 300) {
                // 显示成功消息
                alert('注册成功！即将跳转到登录页面。');
                
                // 跳转到登录页面并传递信息
                navigate('/login', {
                    state: {
                        username: formData.username,
                        password: formData.password
                    }
                });
            }
        } catch (error: any) {
            console.error('注册错误:', error);
            setError(error.response?.data?.message || '注册失败');
        } finally {
            setLoading(false);
        }
    }

  return (
    <Container>
      <AuthCard>
        <Typography variant="h5" component="h1" sx={{mb:3}}>
            注册 CoEdit
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{mt:3}}>
            <TextField
                label="用户名"
                fullWidth
                margin="normal"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username:e.target.value})}
            />
            <TextField
                label="密码"
                type="password"
                fullWidth
                margin="normal"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password:e.target.value})}
            />
            <TextField
                label="确认密码"
                type="password"
                fullWidth
                margin="normal"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword:e.target.value})}
            />
            <TextField
                label="邮箱"
                fullWidth
                margin="normal"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email:e.target.value})}
            />
            {error && <Typography color="error" sx={{mt:2}}>
                {error}
                </Typography>}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{mt:3, mb:2}}
                startIcon={loading && <CircularProgress size={16} />}
            >
                {loading ? '注册中...' : '注册'}
            </Button>
            <Typography variant="body2" sx={{textAlign:'center'}}>
            已有账号？ <Link to="/login">立即登录</Link>
            </Typography>
        </Box>
      </AuthCard>
    </Container>
  )
};

export default RegisterPage; 