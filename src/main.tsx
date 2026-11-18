import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register VitePWA Service Worker for caching, offline fallback, and auto-updates
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('bsg-sw-update-available'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('bsg-sw-offline-ready'));
  },
});

window.addEventListener('bsg-sw-apply-update', () => {
  void updateSW(true);
});

createRoot(document.getElementById('root')!).render(<App />);
