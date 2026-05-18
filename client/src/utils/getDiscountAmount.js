const getDiscountAmount = (type, value, price) => {
	if (type === 'FLAT') {
		return value;
	}

	return (value * price) / 100;
};

export default getDiscountAmount;
