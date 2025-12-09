import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

export { queryClient }