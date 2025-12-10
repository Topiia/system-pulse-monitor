// Basic check if we need to remove App.css or other defaults.
// I'll overwrite App.jsx next, so I'll leave App.css for now but unused.
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <App />
)
