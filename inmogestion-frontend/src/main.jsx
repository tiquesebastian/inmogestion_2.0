import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/**
 * Punto de entrada de la aplicación React
 * Renderiza el componente App envuelto en BrowserRouter para habilitar el routing
 * BrowserRouter gestiona la navegación sin recargar la página
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
