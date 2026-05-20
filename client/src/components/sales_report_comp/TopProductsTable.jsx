import React from 'react';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Box,
} from '@mui/material';
import fmt from '../../utils/fmt';

function TopProductsTable({ products }) {
	return (
		<TableContainer
			component={Paper}
			sx={{ p: 2, borderRadius: 2, height: '100%' }}>
			<Box sx={{ mb: 2 }}>
				<Typography
					variant='h6'
					fontWeight={700}
					color='primary.main'>
					Top Selling Products
				</Typography>
			</Box>
			<Table size='small'>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 700 }}>
							Qty Sold
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 700 }}>
							Revenue
						</TableCell>
						<TableCell
							align='right'
							sx={{ fontWeight: 700 }}>
							Profit
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!products || products.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								align='center'
								sx={{ py: 3, color: 'text.secondary' }}>
								No data available
							</TableCell>
						</TableRow>
					) : (
						products.map((row, i) => (
							<TableRow
								key={row.productId || i}
								sx={{
									bgcolor:
										i % 2 === 0 ? 'background.default' : 'action.hover',
								}}>
								<TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
								<TableCell align='right'>{row.quantity}</TableCell>
								<TableCell align='right'>{fmt(row.revenue)}</TableCell>
								<TableCell
									align='right'
									sx={{
										color: row.profit >= 0 ? 'success.main' : 'error.main',
										fontWeight: 600,
									}}>
									{fmt(row.profit)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default TopProductsTable;
