import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage'
import HomePage from './pages/Home/HomePage'
import RegisterPage from './pages/Auth/RegisterPage'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
