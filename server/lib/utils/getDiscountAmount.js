const getDiscountAmount = (type, value, subTotal) => {
	if (type === 'FLAT') {
		return value;
	}

	return (value * subTotal) / 100;
};

export default getDiscountAmount;
