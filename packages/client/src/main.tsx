import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <App />
         </BrowserRouter>
      </QueryClientProvider>
   </StrictMode>
);
