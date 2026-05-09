import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validations/authValidation';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
	const theme = useTheme();
	const { login, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) navigate('/dashboard');
	}, [user]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data) => {
		const success = await login(data);
		console.log(success, 'login page');
		if (success) navigate('/dashboard');
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 1100,
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				boxShadow:
					'0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
				borderRadius: 3,
				overflow: 'hidden',
				backgroundColor: theme.palette.background.paper,
			}}>
			<Box
				sx={{
					flex: 1,
					p: { xs: 4, md: 6 },
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText || '#fff',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
				}}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
					<Inventory2Icon sx={{ fontSize: 42 }} />
					<Typography
						variant='h4'
						fontWeight={700}>
						QuickBill
					</Typography>
				</Box>
				<Typography
					variant='h5'
					fontWeight={700}
					mb={2}>
					Welcome back
				</Typography>
				<Typography sx={{ opacity: 0.9, lineHeight: 1.8 }}>
					Sign in to your account to access the admin portal and manage your
					products, orders, and sales efficiently.
				</Typography>
			</Box>

			<Box
				sx={{
					flex: 1,
					p: { xs: 4, md: 6 },
					backgroundColor: theme.palette.background.paper,
				}}>
				<Typography
					variant='h5'
					fontWeight={700}
					color='text.primary'
					sx={{ mb: 2 }}>
					Login
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit(onSubmit)}
					sx={{
						display: 'grid',
						gap: 2.5,
					}}>
					<TextField
						label='Email'
						type='email'
						{...register('email')}
						error={!!errors.email}
						helperText={errors.email?.message}
						fullWidth
						autoComplete='email'
					/>
					<TextField
						label='Password'
						type='password'
						{...register('password')}
						error={!!errors.password}
						helperText={errors.password?.message}
						fullWidth
						autoComplete='current-password'
					/>
					<Button
						type='submit'
						variant='contained'
						size='large'
						sx={{
							mt: 1,
							py: 1.5,
							fontWeight: 'bold',
							backgroundColor: theme.palette.primary.main,
							'&:hover': {
								backgroundColor: theme.palette.primary.dark,
							},
						}}>
						Sign in
					</Button>
				</Box>
			</Box>
		</Box>
	);
}

export default Login;
