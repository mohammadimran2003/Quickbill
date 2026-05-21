import React from 'react';
import fmt from '../../utils/fmt';

const thStyle = (align = 'left') => ({
	textAlign: align,
	padding: '8px 10px',
	fontWeight: 600,
	fontSize: '11px',
	textTransform: 'uppercase',
	letterSpacing: '0.5px',
	color: '#333',
	backgroundColor: '#f5f5f5',
	borderBottom: '2px solid #ccc',
});

const tdStyle = (align = 'left', extra = {}) => ({
	textAlign: align,
	padding: '8px 10px',
	fontSize: '12px',
	borderBottom: '1px solid #e0e0e0',
	...extra,
});

const SummaryCard = ({ label, value, sub }) => (
	<div
		style={{
			border: '1px solid #ccc',
			borderRadius: '6px',
			padding: '12px 16px',
			backgroundColor: '#fafafa',
		}}>
		<div
			style={{
				fontSize: '10px',
				textTransform: 'uppercase',
				color: '#666',
				letterSpacing: '0.6px',
			}}>
			{label}
		</div>
		<div
			style={{
				fontSize: '20px',
				fontWeight: 700,
				marginTop: '4px',
				color: '#111',
			}}>
			{value}
		</div>
		{sub && (
			<div
				style={{
					fontSize: '11px',
					color: '#555',
					marginTop: '3px',
					fontWeight: 600,
				}}>
				{sub}
			</div>
		)}
	</div>
);

const StockReportPrint = React.forwardRef(
	(
		{ summary, stockDetails, topLowStockProducts, stockByCategory, dateRange },
		ref,
	) => {
		return (
			<div
				ref={ref}
				style={{
					padding: '32px',
					fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
					color: '#222',
					backgroundColor: '#fff',
					fontSize: '13px',
					lineHeight: 1.5,
				}}>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						borderBottom: '2px solid #222',
						paddingBottom: '14px',
						marginBottom: '24px',
					}}>
					<div>
						<h1
							style={{
								margin: 0,
								fontSize: '28px',
								fontWeight: 800,
								color: '#111',
							}}>
							Quickbill
						</h1>
						<p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
							Inventory Stock Report
						</p>
					</div>
					<div style={{ textAlign: 'right' }}>
						<div
							style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>
							Period
						</div>
						<div style={{ fontSize: '14px', fontWeight: 700 }}>
							{dateRange?.from || '—'} &nbsp;→&nbsp; {dateRange?.to || '—'}
						</div>
						<div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
							Generated: {new Date().toLocaleString()}
						</div>
					</div>
				</div>

				{/* Summary Statistics */}
				<div style={{ marginBottom: '28px' }}>
					<h2
						style={{
							fontSize: '15px',
							margin: '0 0 12px',
							color: '#111',
							fontWeight: 700,
						}}>
						Stock Summary
					</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: '12px',
						}}>
						<SummaryCard
							label='Total Stock Value'
							value={fmt(summary?.totalStockValue)}
						/>
						<SummaryCard
							label='Total Products'
							value={summary?.totalProducts ?? 0}
						/>
						<SummaryCard
							label='Low Stock Products'
							value={summary?.lowStockItems ?? 0}
						/>
						<SummaryCard
							label='Out of Stock Items'
							value={summary?.outOfStockItems ?? 0}
						/>
					</div>
				</div>

				{/* Main Stock Report Table */}
				<div style={{ marginBottom: '28px', pageBreakInside: 'avoid' }}>
					<h2
						style={{
							fontSize: '15px',
							margin: '0 0 12px',
							color: '#111',
							fontWeight: 700,
						}}>
						Stock Report Breakdown
					</h2>
					{!stockDetails || stockDetails.length === 0 ?
						<p style={{ color: '#888', fontSize: '12px' }}>
							No stock data recorded for this period.
						</p>
					:	<table
							style={{
								width: '100%',
								borderCollapse: 'collapse',
								fontSize: '12px',
							}}>
							<thead>
								<tr>
									<th style={thStyle('left')}>Product Name</th>
									<th style={thStyle('right')}>Opening</th>
									<th style={thStyle('right')}>Stock In</th>
									<th style={thStyle('right')}>Stock Out</th>
									<th style={thStyle('center')}>Current</th>
									<th style={thStyle('center')}>Alert Limit</th>
									<th style={thStyle('right')}>Cost Price</th>
									<th style={thStyle('right')}>Total Value</th>
									<th style={thStyle('center')}>Status</th>
								</tr>
							</thead>
							<tbody>
								{stockDetails.map((row, i) => {
									const currentStock = row.currentStock || 0;
									const costPrice = row.costPrice || 0;
									const totalValue =
										currentStock > 0 ? currentStock * costPrice : 0;
									const isLow =
										currentStock > 0 &&
										currentStock <= (row.lowStockAlert || 5);
									const isOut = currentStock <= 0;

									let statusText = 'In Stock';
									if (isOut) statusText = 'Out of Stock';
									else if (isLow) statusText = 'Low Stock';

									return (
										<tr
											key={row.productId || i}
											style={{
												backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
											}}>
											<td style={tdStyle('left', { fontWeight: 500 })}>
												{row.name}
											</td>
											<td style={tdStyle('right')}>{row.openingStock}</td>
											<td style={tdStyle('right')}>+{row.stockIn}</td>
											<td style={tdStyle('right')}>-{row.stockOut}</td>
											<td style={tdStyle('center', { fontWeight: 'bold' })}>
												{currentStock}
											</td>
											<td style={tdStyle('center')}>{row.lowStockAlert}</td>
											<td style={tdStyle('right')}>
												৳{costPrice.toLocaleString()}
											</td>
											<td style={tdStyle('right', { fontWeight: 'bold' })}>
												৳{totalValue.toLocaleString()}
											</td>
											<td style={tdStyle('center')}>
												<span
													style={{
														padding: '2px 6px',
														borderRadius: '4px',
														fontSize: '10px',
														fontWeight: 600,
													}}>
													{statusText}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					}
				</div>

				{/* Two columns: Low Stock and Stock by Category */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '24px',
						pageBreakInside: 'avoid',
					}}>
					{/* Low Stock Products */}
					<div>
						<h2
							style={{
								fontSize: '15px',
								margin: '0 0 12px',
								color: '#111',
								fontWeight: 700,
							}}>
							Top Low Stock Alert
						</h2>
						{!topLowStockProducts || topLowStockProducts.length === 0 ?
							<p style={{ color: '#888', fontSize: '12px' }}>
								No low stock products.
							</p>
						:	<table
								style={{
									width: '100%',
									borderCollapse: 'collapse',
									fontSize: '12px',
								}}>
								<thead>
									<tr>
										<th style={thStyle('left')}>Product</th>
										<th style={thStyle('center')}>Stock</th>
										<th style={thStyle('center')}>Limit</th>
									</tr>
								</thead>
								<tbody>
									{topLowStockProducts.slice(0, 5).map((row, i) => (
										<tr
											key={row.id || i}
											style={{
												backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
											}}>
											<td style={tdStyle('left', { fontWeight: 500 })}>
												{row.name}
											</td>
											<td style={tdStyle('center', { fontWeight: 'bold' })}>
												{row.stock}
											</td>
											<td style={tdStyle('center')}>
												{row.lowStockAlert || 5}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						}
					</div>

					{/* Stock by Category */}
					<div>
						<h2
							style={{
								fontSize: '15px',
								margin: '0 0 12px',
								color: '#111',
								fontWeight: 700,
							}}>
							Stock by Category
						</h2>
						{!stockByCategory || stockByCategory.length === 0 ?
							<p style={{ color: '#888', fontSize: '12px' }}>
								No category data.
							</p>
						:	<table
								style={{
									width: '100%',
									borderCollapse: 'collapse',
									fontSize: '12px',
								}}>
								<thead>
									<tr>
										<th style={thStyle('left')}>Category</th>
										<th style={thStyle('right')}>Total Stock</th>
										<th style={thStyle('right')}>Share</th>
									</tr>
								</thead>
								<tbody>
									{(() => {
										const totalStockCount = stockByCategory.reduce(
											(s, c) => s + (c.stock || 0),
											0,
										);
										return stockByCategory.map((row, i) => {
											const share =
												totalStockCount > 0 ?
													((row.stock / totalStockCount) * 100).toFixed(1)
												:	'0.0';
											return (
												<tr
													key={row.categoryId || i}
													style={{
														backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
													}}>
													<td style={tdStyle('left', { fontWeight: 500 })}>
														{row.categoryName}
													</td>
													<td
														style={tdStyle('right', {
															fontWeight: 'bold',
														})}>
														{row.stock.toLocaleString()} pcs
													</td>
													<td style={tdStyle('right')}>{share}%</td>
												</tr>
											);
										});
									})()}
								</tbody>
							</table>
						}
					</div>
				</div>

				{/* Footer */}
				<div
					style={{
						marginTop: '48px',
						borderTop: '1px solid #eee',
						paddingTop: '12px',
						textAlign: 'center',
						fontSize: '11px',
						color: '#aaa',
					}}>
					Report generated automatically by{' '}
					<strong style={{ color: '#555' }}>Quickbill Billing System</strong>{' '}
					&nbsp;·&nbsp; All monetary values are in BDT (৳) &nbsp;·&nbsp;{' '}
					{new Date().toLocaleString()}
				</div>
			</div>
		);
	},
);

StockReportPrint.displayName = 'StockReportPrint';

export default StockReportPrint;
