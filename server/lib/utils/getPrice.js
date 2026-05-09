function getPrice(priceTiers, basePrice, quantity) {
	const matched = priceTiers
		?.filter((t) => quantity >= t.minQty)
		?.sort((a, b) => b.minQty - a.minQty)[0];

	return matched ? matched.price : basePrice;
}

export default getPrice;
