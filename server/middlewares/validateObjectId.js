// middlewares/validateObjectId.js
const validateObjectId = (req, res, next) => {
	const id = req.params.id;

	if (!id.match(/^[0-9a-fA-F]{24}$/)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid ID format',
		});
	}

	next();
};

export default validateObjectId;
