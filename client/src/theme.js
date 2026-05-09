import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#00A76F',
			dark: '#007867',
			darker: '#004B50',
			contrastText: '#FFFFFF',
		},
		success: { main: '#00A76F' },
		warning: {
			main: '#FFAB00',
			contrastText: '#1C252E',
		},
		error: { main: '#B71D2B' },
		text: {
			primary: '#1C252E',
			secondary: '#637381',
		},
		background: {
			paper: '#FFFFFF',
			default: '#F9FAFB',
		},
	},
});

export default theme;
