import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'sonner';
import loginUser from '../api/auth/loginUser';

// Context toiri kora holo
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const checkAuth = async () => {
		try {
			const response = await api.get('/auth/me');
			setUser(response.data.user);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const login = async (data) => {
		try {
			const response = await loginUser(data);

			console.log(response, 'login response');
			if (response?.success) {
				setUser(response.user);
				toast.success('Login successful');
				return true;
			}
			toast.error(response?.message || 'Login failed');
			return false;
		} catch (err) {
			toast.error('Something went wrong');
			return false;
		}
	};

	const logout = async () => {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
