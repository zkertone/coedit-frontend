import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';

const RequireAuth = () => {
    const location = useLocation();
    const token = useSelector((state: RootState) => state.auth.token);

    if (!token) {
        // 将用户重定向到登录页面，但保存他们试图访问的页面路径
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 如果token存在，则渲染子组件
    return <Outlet />;
};

export default RequireAuth;