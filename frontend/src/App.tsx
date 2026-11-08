import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import EstimatePage from './pages/EstimatePage'
import InsightsPage from './pages/InsightsPage'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingPage />} path="/" />
        <Route element={<EstimatePage />} path="/estimate" />
        <Route element={<InsightsPage />} path="/insights" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
