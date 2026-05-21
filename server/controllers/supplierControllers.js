import prisma from '../lib/prisma.js';

const createSuppliser = async (req, res) => {
	try {
		const { name, phone, email, address, note, isActive } = req.body;
		const createdBy = req.userId;

		const existingSupplier = await prisma.supplier.findFirst({
			where: {
				name: name,
			},
		});

		if (existingSupplier) {
			return res
				.status(400)
				.json({ success: false, message: 'Supplier already exists' });
		}

		const supplier = await prisma.supplier.create({
			data: {
				name,
				phone,
				email,
				address,
				note,
				isActive,
				createdBy,
			},
		});

		res.status(201).json({
			success: true,
			message: 'Supplier created successfully',
			data: supplier,
		});
	} catch (err) {
		console.log(err, 'create supplier err');

		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const getSuppliers = async (req, res) => {
	try {
		const { search, isActive, page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;
		const pageNum = Number(page);
		const limitNum = Number(limit);
		const skipNum = (pageNum - 1) * limitNum;
		const where = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ phone: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
			];
		}

		if (isActive !== undefined && isActive !== '') {
			where.isActive = isActive === 'true';
		}

		const suppliers = await prisma.supplier.findMany({
			where,
			include: {
				purchases: {
					include: {
						items: true,
					},
				},
			},
			orderBy: {
				[sortBy]: sortOrder,
			},
			skip: skipNum,
			take: limitNum,
		});

		const total = await prisma.supplier.count({ where });

		res.status(200).json({
			success: true,
			message: 'Suppliers retrieved successfully',
			count: total,
			data: suppliers,
		});
	} catch (err) {
		console.log(err, 'get suppliers err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const getSupplierById = async (req, res) => {
	try {
		const { id } = req.params;
		const supplier = await prisma.supplier.findUnique({
			where: { id },
		});
		res.status(200).json({
			success: true,
			message: 'Supplier retrieved successfully',
			data: supplier,
		});
	} catch (err) {
		console.log(err, 'get supplier err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const updateSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, phone, email, address, note, isActive } = req.body;
		const supplier = await prisma.supplier.update({
			where: { id },
			data: {
				name,
				phone,
				email,
				address,
				note,
				isActive,
			},
		});
		res.status(200).json({
			success: true,
			message: 'Supplier updated successfully',
			data: supplier,
		});
	} catch (err) {
		console.log(err, 'update supplier err');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

const deleteSupplier = async (req, res) => {
	try {
		const { id } = req.params;
		await prisma.supplier.delete({
			where: { id },
		});
		res.status(200).json({ message: 'Supplier deleted successfully' });
	} catch (err) {
		console.log(err, 'delete suppler successfully');
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
};

export {
	createSuppliser,
	getSuppliers,
	updateSupplier,
	deleteSupplier,
	getSupplierById,
};
