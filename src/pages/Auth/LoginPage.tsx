import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../../stores/authSlice';
import axios from 'axios';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { AuthCard } from './authStyles';
import { AuthContainer } from './authStyles';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username:'',
        password:''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 如果是从注册页面跳转来的，自动填充表单
        const state = location.state as { username: string; password: string } | null;
        if (state?.username && state?.password) {
            setFormData({
                username: state.username,
                password: state.password
            });
            // 清除 location state，避免刷新页面时重复填充
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // 基础验证
        if (!formData.username.trim()) {
            setError('用户名不能为空');
            return;
        }
        
        if (!formData.password.trim()) {
            setError('密码不能为空');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);

            //存储Token并更新Redux状态
            dispatch(loginSuccess({
                user: response.data.username,
                token: {
                    accessToken: response.data.accessToken,
                }
            }));

            // 获取原始目标路径
            const from = location.state?.from?.pathname || '/';
            
            //重定向到原始请求页面或首页
            navigate(from, { replace: true });
        } catch (error) {
            setError('登录失败，请检查用户名和密码');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <Typography variant="h5" component="h1" sx={{mb:3}}>
                    登录 CoEdit
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
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{mt:3, mb:2}}
                        startIcon={loading && <CircularProgress size={16} />}
                    >
                        {loading ? '登录中...' : '登录'}
                    </Button>

                    <Link to="/register" style={{ textDecoration: 'none', color: 'primary' }}>
                        没有账号？注册
                    </Link>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};

export default LoginPage;