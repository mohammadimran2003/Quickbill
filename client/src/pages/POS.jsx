import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import getProducts from '../api/products_api/getProducts';
import ProductCard from '../components/pos_comp/ProductCard';
import useCartStore from '../store/cartStore';
import CartList from '../components/pos_comp/CartList';
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

function POS() {
	const addItem = useCartStore((state) => state.addItem);
	const loadMoreRef = useRef(null);

	const [searchInputValue, setSearchInputValue] = useState('');
	const [search, setSearch] = useState('');

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: ['pos-products', search],
			queryFn: ({ pageParam = 1 }) =>
				getProducts({ page: pageParam, limit: 12, search }),
			initialPageParam: 1,
			getNextPageParam: (lastPage) => {
				const { page, totalPages } = lastPage.pagination;
				return page < totalPages ? page + 1 : undefined;
			},
		});

	const debouncedSetSearch = useCallback(
		debounce((value) => {
			setSearch(value);
		}, 300),
		[],
	);

	// Intersection Observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, fetchNextPage]);

	const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

	const handleAddToCart = (product) => {
		addItem(product);
	};

	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchInputValue(value);
		debouncedSetSearch(value);
	};

	return (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: 'background.default',
			}}>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Box>
					<Button size='sm'>Brnd</Button>
					<Button size='sm'>Category</Button>
				</Box>
				<Box>
					<TextField
						placeholder='Search here'
						size='small'
						value={searchInputValue}
						onChange={handleSearch}
					/>
				</Box>
			</Box>
			<Grid
				container
				spacing={3}
				sx={{ mt: '20px' }}>
				<Grid size={8}>
					{allProducts.length > 0 ?
						<Grid
							container
							spacing={2}>
							{allProducts.map((product) => (
								<Grid
									size={3}
									key={product.id}>
									<ProductCard
										product={product}
										onAddToCart={handleAddToCart}
									/>
								</Grid>
							))}
						</Grid>
					:	<Typography>No products found</Typography>}
				</Grid>
				<Grid size={4}>
					<CartList />
				</Grid>
			</Grid>
			<Box
				ref={loadMoreRef}
				sx={{ py: 2, textAlign: 'center' }}>
				{isFetchingNextPage && <CircularProgress size={24} />}
				{!hasNextPage && allProducts.length > 0 && (
					<Typography
						variant='body2'
						color='text.secondary'>
						All products displayed
					</Typography>
				)}
			</Box>
		</Box>
	);
}
``;

export default POS;
