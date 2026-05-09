import { Button } from '@mui/material';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Logout() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<Button
			onClick={handleLogout}
			variant='contained'
			color='error'>
			Logout
		</Button>
	);
}

export default Logout;
