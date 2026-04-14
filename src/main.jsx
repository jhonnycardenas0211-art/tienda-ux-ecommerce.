import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <PayPalScriptProvider options={{ "client-id": "test", currency: "USD" }}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PayPalScriptProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
