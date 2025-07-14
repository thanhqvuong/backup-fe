import React from 'react'
import { Routes , Route } from 'react-router-dom'
import StaffRegister from './admin/StaffRegister.jsx'
const App = () => {
  return (
    <Routes>
      <Route path="/admin/register" element={<StaffRegister />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
