import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Cancle from './pages/Cancle'
import Carts from './pages/Carts'
import Success from './pages/Success'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'


function App() {



  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <Navbar />
          <Routes>
            <Route index element={<Carts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path='success' element={< Success />} />
            <Route path='cancle' element={<Cancle />} /> */}
          </Routes>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>


  )
}

export default App
