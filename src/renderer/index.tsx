import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

// Import Tauri bridge to set up window.electron compatibility
import './lib/tauri-bridge';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
