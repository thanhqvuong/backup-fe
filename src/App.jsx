import React from 'react'
import { Routes , Route } from 'react-router-dom'
import StaffRegister from './admin/StaffRegister.jsx'
import StaffLogin from './admin/StaffLogin.jsx'
const App = () => {
  return (
    <Routes>
      {/*Routes của admin*/}
      <Route path="/admin/register" element={<StaffRegister />} />
      <Route path="/admin/login" element={<StaffLogin />} />

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
