import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './Dashboard/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Notifications from './pages/Notifications'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/projects/:id/tasks' element={<Tasks />} />
          <Route path='/notifications' element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App