import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import theme from './theme.js';
import { ThemeProvider } from '@mui/material';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'sonner';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<Toaster
				richColors
				position='top-right'
			/>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<App />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>,
);
