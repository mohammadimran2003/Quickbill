import prisma from '../lib/prisma.js';

const createPriceTier = async (req, res) => {
	console.log('Hello from price tier');
	try {
		const productId = req.params.id;

		//product ache kina check
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) {
			return res.status(404).json({
				success: false,
				message: 'Product not found',
			});
		}

		const existingTier = await prisma.priceTier.findFirst({
			where: { productId, name: req.body.name },
		});
		if (existingTier) {
			return res.status(409).json({
				success: false,
				message: 'This price tier already exists for this product',
			});
		}

		const priceTier = await prisma.priceTier.create({
			data: { ...req.body, productId, createdBy: req.user.id },
		});

		res.status(201).json({
			success: true,
			message: 'Price tiers retrieve sucessfully',
			data: priceTier,
		});
	} catch (err) {
		console.log(err, 'err price tier');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const deletePriceTier = async (req, res) => {
	try {
		const tierId = req.params.tierId;

		const priceTier = await prisma.priceTier.delete({ where: { id: tierId } });

		res.status(200).json({
			success: true,
			message: 'Price tier deleted succcessfully',
			data: priceTier,
		});
	} catch (err) {
		console.log(err, 'price tier delete err');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const editPriceTier = async (req, res) => {
	try {
		const tierId = req.params.tierId;

		const existingPriceTier = await prisma.priceTier.findUnique({
			where: {
				id: tierId,
				name: req.body.name,
			},
		});

		console.log(req.body, tierId, 'req Body');

		if (!existingPriceTier) {
			return res
				.status(404)
				.json({ success: false, message: 'Price tier not found!' });
		}

		const updatedPriceTier = await prisma.priceTier.update({
			where: {
				id: tierId,
				name: req.body.name,
			},
			data: req.body,
		});

		res.status(200).json({
			success: true,
			message: 'Price tier udpated successfully',
			data: updatedPriceTier,
		});
	} catch (err) {
		console.log(err, 'price tier edit err');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

export { createPriceTier, deletePriceTier, editPriceTier };
