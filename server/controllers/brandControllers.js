import prisma from '../lib/prisma.js';

const createBrand = async (req, res) => {
	try {
		const { name } = req.body;

		// ei data ti ki db te already ache kina ta check kora
		const existingBrand = await prisma.brand.findUnique({ where: { name } });

		if (existingBrand) {
			return res
				.status(409)
				.json({ success: false, message: 'This brand already exists' });
		}

		// creat brand and push db
		const result = await prisma.brand.create({
			data: { ...req.body, createdBy: req.user.id },
		});

		res.status(201).json({
			success: true,
			message: 'Brand created successfully',
			data: result,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({ success: false, message: 'Server internal error' });
	}
};

const getAllBrands = async (req, res) => {
	try {
		const { search, isActive } = req.query;

		const where = {
			...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
			...(isActive !== undefined ? { isActive: isActive === 'true' } : {}),
		};

		const brands = await prisma.brand.findMany({
			where,
			orderBy: {
				createdAt: 'desc',
			},
		});

		res.status(200).json({
			success: true,
			message: 'brands retrieved successfully',
			count: brands.length,
			data: brands,
		});
	} catch (err) {
		console.error('Error fetching brand:', err);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch brands',
		});
	}
};

const getBrandById = async (req, res) => {
	try {
		const { id } = req.params;

		const brand = await prisma.brand.findUnique({
			where: { id },
			include: {
				_count: {
					select: { products: true },
				},
			},
		});

		if (!brand) {
			return res.status(404).json({
				success: false,
				message: 'Brand not found',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Brand retrieved successfully',
			data: brand,
		});
	} catch (err) {
		console.error('Error fetching brand:', err);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch brand',
		});
	}
};

const deleteBrand = async (req, res) => {
	try {
		const id = req.params.id;

		const result = await prisma.brand.delete({ where: { id } });

		res.status(200).json({
			success: true,
			message: 'Brand deleted successfully',
			data: result,
		});
	} catch (err) {
		console.log(err);
		if (err.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Brnd not found or already deleted',
			});
		}
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const editBrand = async (req, res) => {
	try {
		const id = req.params.id;

		const existingBrand = await prisma.brand.findUnique({ where: { id } });

		if (!existingBrand) {
			return res
				.status(404)
				.json({ success: false, message: 'Brand not found!' });
		}

		const result = await prisma.brand.update({ where: { id }, data: req.body });

		res.status(200).json({
			success: true,
			message: 'Brand updated successfully',
			data: result,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

export { createBrand, getAllBrands, getBrandById, deleteBrand, editBrand };
