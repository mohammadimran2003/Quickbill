// src/constants/index.js
export const CURRENCY = {
	symbol: '৳',
	code: 'BDT',
	name: 'Taka',
};

export const formatCurrency = (amount) => {
	return `${CURRENCY.symbol} ${Number(amount).toLocaleString('en-BD')}`;
};
