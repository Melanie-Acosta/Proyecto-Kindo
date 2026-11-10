import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // <-- SIN LLAVES (quitando las llaves si las tenía)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
    <App />
</React.StrictMode>,
)
