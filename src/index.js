import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/fira-code";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { prefetchLeetCode } from './hooks/useLeetcodeData';
import { prefetchProjects } from './hooks/useProjectsData';

const queryClient = new QueryClient();
prefetchLeetCode(queryClient);
prefetchProjects(queryClient);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
);

export { queryClient }