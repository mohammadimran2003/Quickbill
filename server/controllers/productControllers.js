import prisma from '../lib/prisma.js';

const createProduct = async (req, res) => {
	try {
		const product = await prisma.product.create({
			data: {
				...req.body,
				createdBy: req.user.id,
			},
		});

		res.status(201).json({
			success: true,
			message: 'Product created successfully',
			data: product,
		});
	} catch (err) {
		console.log(err, 'err');

		if (err.code === 'P2002') {
			return res.status(409).json({
				success: false,
				message: `${err.meta.target[0]} already exists`,
			});
		}

		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const getAllProducts = async (req, res) => {
	try {
		console.log(req.query, 'req.query');

		const {
			category = '',
			page = 1,
			brand = '',
			limit = 10,
			search = '',
			sortBy = 'createdAt',
			sortOrder = 'desc',
			productType = '',
		} = req.query;

		console.log(req.query, 'req query');

		const where = {
			...(search ?
				{
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{ barcode: { contains: search, mode: 'insensitive' } },
						{ sku: { contains: search, mode: 'insensitive' } },
					],
				}
			:	{}),
			...(category ? { categoryId: category } : {}),
			...(brand ? { brandId: brand } : {}),
			...(productType ? { productType } : {}),
		};

		const products = await prisma.product.findMany({
			where,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				category: {
					select: { name: true },
				},
				brand: {
					select: { name: true, id: true },
				},
			},
		});

		res.status(200).json({
			success: true,
			message: 'Products retrieved successfully',
			count: products.length,
			data: products,
		});
	} catch (err) {
		console.log(err, 'err');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;

		const product = await prisma.product.delete({ where: { id } });
		console.log(product, 'product');

		res.status(200).json({
			success: true,
			message: 'Product deleted successfully',
			data: product,
		});
	} catch (err) {
		console.log(err, 'err');
		res.status(500).json({ success: false, message: 'product deleted failed' });
	}
};

const getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		const product = await prisma.product.findUnique({ where: { id } });

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found!' });
		}

		res.status(200).json({
			success: true,
			message: 'product retrieved successfully',
			data: product,
		});
	} catch (err) {
		console.log(err, 'err');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const editProduct = async (req, res) => {
	try {
		const id = req.params.id;
		const existingProduct = await prisma.product.findUnique({ where: { id } });

		if (!existingProduct) {
			return res
				.status(404)
				.json({ success: false, message: 'Product not found!' });
		}

		const updatedProduct = await prisma.product.update({
			where: { id },
			data: req.body,
		});

		res.status(200).json({
			success: true,
			message: 'Product updated successfully',
			daata: updatedProduct,
		});
	} catch (err) {
		console.log(err, 'err');
		res.status(500).json({ success: false, message: 'Server internal error' });
	}
};

export {
	createProduct,
	getAllProducts,
	deleteProduct,
	getProductById,
	editProduct,
};
