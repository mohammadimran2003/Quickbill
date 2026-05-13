import prisma from '../lib/prisma.js';

const createCategory = async (req, res) => {
	try {
		const { name } = req.body;
		const existingCategory = await prisma.category.findUnique({
			where: { name },
		});

		if (existingCategory) {
			return res.status(409).json({
				message: 'Category with this name already exists',
			});
		}

		const result = await prisma.category.create({
			data: { ...req.body, createdBy: req.user.id },
		});

		return res.status(201).json({
			success: true,
			message: 'Category created successfully',
			data: result,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const getAllCategories = async (req, res) => {
	try {
		const { search = '', isActive } = req.query;

		const where = {
			...(search ?
				{ OR: [{ name: { contains: search, mode: 'insensitive' } }] }
			:	{}),
			...(isActive !== undefined ? { isActive: isActive === 'true' } : {}),
		};

		const categories = await prisma.category.findMany({
			where,
			orderBy: {
				createdAt: 'desc',
			},
		});

		res.status(200).json({
			success: true,
			message: 'Categories retrieved successfully',
			count: categories.length,
			data: categories,
		});
	} catch (err) {
		console.error('Error fetching categories:', err);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch categories',
		});
	}
};

const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;

		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				_count: {
					select: { products: true },
				},
			},
		});

		if (!category) {
			return res.status(404).json({
				success: false,
				message: 'Category not found',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Category retrieved successfully',
			data: category,
		});
	} catch (err) {
		console.error('Error fetching category:', err);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch category',
		});
	}
};

const deleteCategory = async (req, res) => {
	try {
		const result = await prisma.category.delete({
			where: { id: req.params.id },
		});

		res.status(200).json({
			success: true,
			message: 'Category deleted successfully',
			data: result,
		});
	} catch (err) {
		console.log(err, 'err');

		if (err.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Category not found or already deleted',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Something went wrong while deleting',
		});
	}
};

const editCategory = async (req, res) => {
	try {
		const data = req.body;
		const id = req.params.id;

		const existingCategory = await prisma.category.findUnique({
			where: { id },
		});

		if (!existingCategory) {
			return res
				.status(404)
				.json({ success: false, message: 'Category not found!' });
		}

		const result = await prisma.category.update({
			where: { id },
			data,
		});

		res.status(200).json({
			success: true,
			message: 'Category updated succesfully',
			data: result,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

export {
	createCategory,
	getAllCategories,
	getCategoryById,
	deleteCategory,
	editCategory,
};
