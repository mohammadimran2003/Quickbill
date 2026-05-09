import z from 'zod';

const validatorsMiddleware = (schema) => (req, res, next) => {
	const result = schema.safeParse(req.body);

	if (!result.success) {
		return res.status(400).json({
			success: false,
			message: 'Validation error',
			errors: result.error.issues.map((issue) => ({
				field: issue.path[0],
				message: issue.message,
			})),
		});
	}

	req.body = result.data;
	next();
};
export default validatorsMiddleware;
