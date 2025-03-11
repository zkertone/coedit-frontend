import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import HomePage from './pages/Home/HomePage'
import RegisterPage from './pages/Auth/RegisterPage'
import RequireAuth from './pages/components/RequireAuth'
import ReverseAuth from './pages/components/ReverseAuth'
import DocumentPage from './pages/Document/DocumentPage'
import NotFoundPage from './pages/Error/NotFoundPage'
import ProfilePage from './pages/Profile/ProfilePage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/*开放路由*/}
      <Route element={<ReverseAuth />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/*需要认证的路由*/}  
      <Route element={<RequireAuth />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/document/:id" element={<DocumentPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/*错误路由*/}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
