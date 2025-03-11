import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { RootState } from "../../stores/store"

const ReverseAuth = () => {
    const {token} = useSelector((state:RootState) => state.auth);
    return token ? <Navigate to="/" replace/> : <Outlet />;
};

export default ReverseAuth;