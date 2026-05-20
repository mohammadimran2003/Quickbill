import React from 'react';
import fmt from '../../utils/fmt';

const SalesReportPrint = React.forwardRef(
	({ summary, chartData, products, customers, dateRange }, ref) => {
		return (
			<div
				ref={ref}
				style={{
					padding: '30px',
					fontFamily: 'system-ui, -apple-system, sans-serif',
					color: '#333',
					backgroundColor: '#fff',
				}}>
				{/* Report Header */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						borderBottom: '1px solid #4e4e59	',
						paddingBottom: '15px',
						marginBottom: '25px',
					}}>
					<div>
						<h1 style={{ margin: 0, fontSize: '26px', color: 'primary.main' }}>
							Quickbill
						</h1>
						<p style={{ margin: '5px 0 0', fontSize: '14px', color: '#666' }}>
							Sales & Revenue Analysis Report
						</p>
					</div>
					<div style={{ textAlign: 'right' }}>
						<h3 style={{ margin: 0, fontSize: '16px' }}>Date Range</h3>
						<p
							style={{
								margin: '5px 0 0',
								fontSize: '13px',
								fontWeight: 600,
								color: 'text.secondary',
							}}>
							{dateRange.from || '—'} to {dateRange.to || '—'}
						</p>
					</div>
				</div>

				{/* Summary Statistics */}
				<div style={{ marginBottom: '30px' }}>
					<h2
						style={{
							fontSize: '18px',
							borderBottom: '1px solid #ddd',
							paddingBottom: '8px',
							marginBottom: '15px',
						}}>
						Summary
					</h2>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: '15px',
						}}>
						<div
							style={{
								border: '1px solid #ddd',
								padding: '12px',
								borderRadius: '4px',
								backgroundColor: '#f9f9f9',
							}}>
							<span
								style={{
									fontSize: '11px',
									textTransform: 'uppercase',
									color: '#666',
								}}>
								Total Revenue
							</span>
							<div
								style={{
									fontSize: '18px',
									fontWeight: 'bold',
									marginTop: '5px',
									color: 'text.primary',
								}}>
								{fmt(summary?.totalRevenue)}
							</div>
						</div>
						<div
							style={{
								border: '1px solid #ddd',
								padding: '12px',
								borderRadius: '4px',
								backgroundColor: '#f9f9f9',
							}}>
							<span
								style={{
									fontSize: '11px',
									textTransform: 'uppercase',
									color: '#666',
								}}>
								Total Orders
							</span>
							<div
								style={{
									fontSize: '18px',
									fontWeight: 'bold',
									marginTop: '5px',
								}}>
								{summary?.totalOrders ?? 0}
							</div>
						</div>
						<div
							style={{
								border: '1px solid #ddd',
								padding: '12px',
								borderRadius: '4px',
								backgroundColor: '#f9f9f9',
							}}>
							<span
								style={{
									fontSize: '11px',
									textTransform: 'uppercase',
									color: '#666',
								}}>
								Total Profit
							</span>
							<div
								style={{
									fontSize: '18px',
									fontWeight: 'bold',
									marginTop: '5px',
									color: 'text.secondary',
								}}>
								{fmt(summary?.totalProfit)}
							</div>
						</div>
						<div
							style={{
								border: '1px solid #ddd',
								padding: '12px',
								borderRadius: '4px',
								backgroundColor: '#f9f9f9',
							}}>
							<span
								style={{
									fontSize: '11px',
									textTransform: 'uppercase',
									color: '#666',
								}}>
								Avg Order Value
							</span>
							<div
								style={{
									fontSize: '18px',
									fontWeight: 'bold',
									marginTop: '5px',
								}}>
								{fmt(summary?.avgOrderValue?.toFixed(2))}
							</div>
						</div>
					</div>
				</div>

				{/* Sales Overview / Grouped Details */}
				<div style={{ marginBottom: '30px', pageBreakAfter: 'auto' }}>
					<h2
						style={{
							fontSize: '18px',
							borderBottom: '1px solid #ddd',
							paddingBottom: '8px',
							marginBottom: '15px',
						}}>
						Sales Overview
					</h2>
					<table
						style={{
							width: '100%',
							borderCollapse: 'collapse',
							fontSize: '12px',
						}}>
						<thead>
							<tr
								style={{
									backgroundColor: '#f1f1f1',
									borderBottom: '2px solid #ddd',
								}}>
								<th
									style={{
										textAlign: 'left',
										padding: '8px',
										fontWeight: 600,
									}}>
									Date
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Orders
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Revenue
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Profit
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Cash
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Card
								</th>
								<th
									style={{
										textAlign: 'right',
										padding: '8px',
										fontWeight: 600,
									}}>
									Mobile Banking
								</th>
							</tr>
						</thead>
						<tbody>
							{chartData.length === 0 ?
								<tr>
									<td
										colSpan={7}
										style={{
											textAlign: 'center',
											padding: '15px',
											color: '#888',
										}}>
										No data available
									</td>
								</tr>
							:	chartData.map((row, i) => (
									<tr
										key={row.date}
										style={{
											borderBottom: '1px solid #eee',
											backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
										}}>
										<td style={{ padding: '8px' }}>{row.date}</td>
										<td style={{ textAlign: 'right', padding: '8px' }}>
											{row.orders}
										</td>
										<td style={{ textAlign: 'right', padding: '8px' }}>
											{fmt(row.revenue)}
										</td>
										<td
											style={{
												textAlign: 'right',
												padding: '8px',
												color: 'text.primary',
												fontWeight: 600,
											}}>
											{fmt(row.profit)}
										</td>
										<td style={{ textAlign: 'right', padding: '8px' }}>
											{fmt(row.paymentBreakdown?.CASH || 0)}
										</td>
										<td style={{ textAlign: 'right', padding: '8px' }}>
											{fmt(row.paymentBreakdown?.CARD || 0)}
										</td>
										<td style={{ textAlign: 'right', padding: '8px' }}>
											{fmt(row.paymentBreakdown?.MOBILE_BANKING || 0)}
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</div>

				{/* Top Products and Top Customers section */}
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '25px',
						marginTop: '20px',
						pageBreakInside: 'avoid',
					}}>
					{/* Top Selling Products */}
					<div>
						<h2
							style={{
								fontSize: '16px',
								borderBottom: '1px solid #ddd',
								paddingBottom: '8px',
								marginBottom: '15px',
							}}>
							Top Selling Products
						</h2>
						<table
							style={{
								width: '100%',
								borderCollapse: 'collapse',
								fontSize: '12px',
							}}>
							<thead>
								<tr
									style={{
										backgroundColor: '#f1f1f1',
										borderBottom: '1px solid #ddd',
									}}>
									<th
										style={{
											textAlign: 'left',
											padding: '8px',
											fontWeight: 600,
										}}>
										Product Name
									</th>
									<th
										style={{
											textAlign: 'right',
											padding: '8px',
											fontWeight: 600,
										}}>
										Qty
									</th>
									<th
										style={{
											textAlign: 'right',
											padding: '8px',
											fontWeight: 600,
										}}>
										Revenue
									</th>
									<th
										style={{
											textAlign: 'right',
											padding: '8px',
											fontWeight: 600,
										}}>
										Profit
									</th>
								</tr>
							</thead>
							<tbody>
								{!products || products.length === 0 ?
									<tr>
										<td
											colSpan={4}
											style={{
												textAlign: 'center',
												padding: '15px',
												color: '#888',
											}}>
											No products recorded
										</td>
									</tr>
								:	products.map((row, i) => (
										<tr
											key={row.productId || i}
											style={{
												borderBottom: '1px solid #eee',
												backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
											}}>
											<td style={{ padding: '8px', fontWeight: 500 }}>
												{row.name}
											</td>
											<td style={{ textAlign: 'right', padding: '8px' }}>
												{row.quantity}
											</td>
											<td style={{ textAlign: 'right', padding: '8px' }}>
												{fmt(row.revenue)}
											</td>
											<td
												style={{
													textAlign: 'right',
													padding: '8px',
													color: 'text.primary',
													fontWeight: 600,
												}}>
												{fmt(row.profit)}
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>

					{/* Top Customers */}
					<div>
						<h2
							style={{
								fontSize: '16px',
								borderBottom: '1px solid #ddd',
								paddingBottom: '8px',
								marginBottom: '15px',
							}}>
							Top Customers
						</h2>
						<table
							style={{
								width: '100%',
								borderCollapse: 'collapse',
								fontSize: '12px',
							}}>
							<thead>
								<tr
									style={{
										backgroundColor: '#f1f1f1',
										borderBottom: '1px solid #ddd',
									}}>
									<th
										style={{
											textAlign: 'left',
											padding: '8px',
											fontWeight: 600,
										}}>
										Customer Name
									</th>
									<th
										style={{
											textAlign: 'center',
											padding: '8px',
											fontWeight: 600,
										}}>
										Phone
									</th>
									<th
										style={{
											textAlign: 'center',
											padding: '8px',
											fontWeight: 600,
										}}>
										Orders
									</th>
									<th
										style={{
											textAlign: 'right',
											padding: '8px',
											fontWeight: 600,
										}}>
										Spent
									</th>
								</tr>
							</thead>
							<tbody>
								{!customers || customers.length === 0 ?
									<tr>
										<td
											colSpan={4}
											style={{
												textAlign: 'center',
												padding: '15px',
												color: '#888',
											}}>
											No customers recorded
										</td>
									</tr>
								:	customers.map((row, i) => (
										<tr
											key={row.customerId || i}
											style={{
												borderBottom: '1px solid #eee',
												backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
											}}>
											<td style={{ padding: '8px', fontWeight: 500 }}>
												{row.name}
											</td>
											<td style={{ textAlign: 'center', padding: '8px' }}>
												{row.phone || 'N/A'}
											</td>
											<td style={{ textAlign: 'center', padding: '8px' }}>
												{row.orders}
											</td>
											<td
												style={{
													textAlign: 'right',
													padding: '8px',
													fontWeight: 600,
												}}>
												{fmt(row.totalSpent)}
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				</div>

				{/* Footer */}
				<div
					style={{
						marginTop: '50px',
						borderTop: '1px solid #eee',
						paddingTop: '15px',
						textAlign: 'center',
						fontSize: '11px',
						color: '#888',
					}}>
					Report generated automatically by Quickbill Billing System on{' '}
					{new Date().toLocaleString()}. All values are shown in BDT. Page 1 of
					1.
				</div>
			</div>
		);
	},
);

SalesReportPrint.displayName = 'SalesReportPrint';

export default SalesReportPrint;
