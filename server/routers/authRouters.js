import express from 'express';
import {
	register,
	login,
	logout,
	getMe,
} from '../controllers/authControllers.js';
import verifyToken from '../middlewares/verifyToken.js';
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', verifyToken, getMe);

export default authRouter;
