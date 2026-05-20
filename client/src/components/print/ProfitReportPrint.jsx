import React from 'react';
import fmt from '../../utils/fmt';

const RANK_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

// ─── Reusable helpers ──────────────────────────────────────────────────────────

const thStyle = (align = 'left') => ({
	textAlign: align,
	padding: '7px 10px',
	fontWeight: 600,
	fontSize: '11px',
	textTransform: 'uppercase',
	letterSpacing: '0.5px',
	color: '#555',
	backgroundColor: '#f5f5f5',
	borderBottom: '2px solid #e0e0e0',
});

const tdStyle = (align = 'left', extra = {}) => ({
	textAlign: align,
	padding: '7px 10px',
	fontSize: '12px',
	borderBottom: '1px solid #eee',
	...extra,
});

const SummaryCard = ({ label, value, sub, accentColor }) => (
	<div
		style={{
			border: `1px solid ${accentColor}55`,
			borderLeft: `4px solid ${accentColor}`,
			borderRadius: '6px',
			padding: '12px 16px',
			backgroundColor: `${accentColor}08`,
		}}>
		<div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#777', letterSpacing: '0.6px' }}>
			{label}
		</div>
		<div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: '#1a1a1a' }}>
			{value}
		</div>
		{sub && (
			<div style={{ fontSize: '11px', color: accentColor, marginTop: '3px', fontWeight: 600 }}>
				{sub}
			</div>
		)}
	</div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const ProfitReportPrint = React.forwardRef(
	({ summary, chartData, profitableProducts, profitByCategory, dateRange }, ref) => {
		const totalRevenue = summary?.totalRevenue || 0;
		const totalProfit = summary?.totalProfit || 0;
		const totalCostPrice = summary?.totalCostPrice || 0;

		const profitMargin =
			totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
		const markupPct =
			totalCostPrice > 0 ? ((totalProfit / totalCostPrice) * 100).toFixed(1) : '0.0';

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

				{/* ── Header ─────────────────────────────────────────────────────── */}
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
						<h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#111' }}>
							Quickbill
						</h1>
						<p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
							Profit &amp; Margin Analysis Report
						</p>
					</div>
					<div style={{ textAlign: 'right' }}>
						<div style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>
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

				{/* ── Summary Cards ───────────────────────────────────────────────── */}
				<div style={{ marginBottom: '28px' }}>
					<h2 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', borderLeft: '4px solid #00A76F', paddingLeft: '10px' }}>
						Summary
					</h2>
					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
						<SummaryCard
							label='Total Revenue'
							value={fmt(totalRevenue)}
							accentColor='#00A76F'
						/>
						<SummaryCard
							label='Total Orders'
							value={summary?.totalOrders ?? '—'}
							accentColor='#1565C0'
						/>
						<SummaryCard
							label='Total Profit'
							value={fmt(totalProfit)}
							sub={`${profitMargin}% Gross Margin`}
							accentColor='#FFAB00'
						/>
						<SummaryCard
							label='Total Cost (COGS)'
							value={fmt(totalCostPrice)}
							sub={`${markupPct}% Markup`}
							accentColor='#B71D2B'
						/>
					</div>
				</div>

				{/* ── Profit Trend Table ──────────────────────────────────────────── */}
				{chartData && chartData.length > 0 && (
					<div style={{ marginBottom: '28px', pageBreakInside: 'avoid' }}>
						<h2 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', borderLeft: '4px solid #0284C7', paddingLeft: '10px' }}>
							Profit Trend Overview
						</h2>
						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
							<thead>
								<tr>
									<th style={thStyle('left')}>Date</th>
									<th style={thStyle('right')}>Orders</th>
									<th style={thStyle('right')}>Revenue</th>
									<th style={thStyle('right')}>Cost</th>
									<th style={thStyle('right')}>Net Profit</th>
									<th style={thStyle('right')}>Margin %</th>
								</tr>
							</thead>
							<tbody>
								{chartData.map((row, i) => {
									const margin =
										row.revenue > 0
											? ((row.profit / row.revenue) * 100).toFixed(1)
											: '0.0';
									const cost = (row.revenue || 0) - (row.profit || 0);
									return (
										<tr
											key={row.date || i}
											style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
											<td style={tdStyle('left', { fontWeight: 500 })}>{row.date}</td>
											<td style={tdStyle('right')}>{row.orders}</td>
											<td style={tdStyle('right')}>{fmt(row.revenue)}</td>
											<td style={tdStyle('right', { color: '#666' })}>{fmt(cost)}</td>
											<td style={tdStyle('right', { fontWeight: 700, color: '#00A76F' })}>
												{fmt(row.profit)}
											</td>
											<td style={tdStyle('right')}>
												<span
													style={{
														backgroundColor: Number(margin) >= 20 ? '#E8F8F2' : '#FFF8E1',
														color: Number(margin) >= 20 ? '#00A76F' : '#FFAB00',
														padding: '2px 7px',
														borderRadius: '999px',
														fontSize: '11px',
														fontWeight: 700,
													}}>
													{margin}%
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{/* ── Most Profitable Products ─────────────────────────────────────── */}
				<div style={{ marginBottom: '28px', pageBreakInside: 'avoid' }}>
					<h2 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', borderLeft: '4px solid #FFAB00', paddingLeft: '10px' }}>
						Most Profitable Products (Top {(profitableProducts || []).length})
					</h2>
					{!profitableProducts || profitableProducts.length === 0 ? (
						<p style={{ color: '#888', fontSize: '12px' }}>No product data for this period.</p>
					) : (
						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
							<thead>
								<tr>
									<th style={thStyle('center')}>#</th>
									<th style={thStyle('left')}>Product Name</th>
									<th style={thStyle('right')}>Qty Sold</th>
									<th style={thStyle('right')}>Revenue</th>
									<th style={thStyle('right')}>Cost</th>
									<th style={thStyle('right')}>Net Profit</th>
									<th style={thStyle('right')}>Margin %</th>
								</tr>
							</thead>
							<tbody>
								{profitableProducts.map((p, i) => (
									<tr
										key={p.productId || i}
										style={{
											backgroundColor: i === 0 ? '#FFFDE7' : i % 2 === 0 ? '#fff' : '#fafafa',
										}}>
										<td style={tdStyle('center', { fontWeight: 700 })}>
											{RANK_LABELS[i] ?? `${i + 1}th`}
										</td>
										<td style={tdStyle('left', { fontWeight: i < 3 ? 700 : 500 })}>
											{p.name}
										</td>
										<td style={tdStyle('right')}>{p.quantitySold?.toLocaleString()}</td>
										<td style={tdStyle('right')}>{fmt(p.totalRevenue)}</td>
										<td style={tdStyle('right', { color: '#888' })}>{fmt(p.totalCost)}</td>
										<td style={tdStyle('right', { fontWeight: 700, color: '#00A76F' })}>
											{fmt(p.netProfit)}
										</td>
										<td style={tdStyle('right')}>
											<span
												style={{
													backgroundColor:
														p.profitMargin >= 35
															? '#E8F8F2'
															: p.profitMargin >= 20
															? '#E3F2FD'
															: p.profitMargin >= 10
															? '#FFF8E1'
															: '#FFEBEE',
													color:
														p.profitMargin >= 35
															? '#00A76F'
															: p.profitMargin >= 20
															? '#0284C7'
															: p.profitMargin >= 10
															? '#FFAB00'
															: '#B71D2B',
													padding: '2px 7px',
													borderRadius: '999px',
													fontSize: '11px',
													fontWeight: 700,
												}}>
												{p.profitMargin}%
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				{/* ── Profit by Category ───────────────────────────────────────────── */}
				<div style={{ pageBreakInside: 'avoid' }}>
					<h2 style={{ fontSize: '15px', margin: '0 0 12px', color: '#333', borderLeft: '4px solid #A78BFA', paddingLeft: '10px' }}>
						Profit by Category
					</h2>
					{!profitByCategory || profitByCategory.length === 0 ? (
						<p style={{ color: '#888', fontSize: '12px' }}>No category data for this period.</p>
					) : (
						<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
							<thead>
								<tr>
									<th style={thStyle('left')}>Category</th>
									<th style={thStyle('right')}>Revenue</th>
									<th style={thStyle('right')}>Cost</th>
									<th style={thStyle('right')}>Net Profit</th>
									<th style={thStyle('right')}>Margin %</th>
									<th style={thStyle('right')}>Revenue Share</th>
								</tr>
							</thead>
							<tbody>
								{(() => {
									const totalCatRevenue = profitByCategory.reduce(
										(s, c) => s + (c.totalRevenue || 0),
										0,
									);
									return profitByCategory.map((cat, i) => {
										const share =
											totalCatRevenue > 0
												? ((cat.totalRevenue / totalCatRevenue) * 100).toFixed(1)
												: '0.0';
										return (
											<tr
												key={cat.categoryId || i}
												style={{
													backgroundColor: i === 0 ? '#F3E8FF' : i % 2 === 0 ? '#fff' : '#fafafa',
												}}>
												<td style={tdStyle('left', { fontWeight: i === 0 ? 700 : 500 })}>
													{cat.categoryName}
												</td>
												<td style={tdStyle('right')}>{fmt(cat.totalRevenue)}</td>
												<td style={tdStyle('right', { color: '#888' })}>{fmt(cat.totalCost)}</td>
												<td
													style={tdStyle('right', {
														fontWeight: 700,
														color: cat.netProfit >= 0 ? '#00A76F' : '#B71D2B',
													})}>
													{fmt(cat.netProfit)}
												</td>
												<td style={tdStyle('right')}>
													<span
														style={{
															backgroundColor:
																cat.profitMargin >= 20 ? '#E8F8F2' : '#FFF8E1',
															color: cat.profitMargin >= 20 ? '#00A76F' : '#FFAB00',
															padding: '2px 7px',
															borderRadius: '999px',
															fontSize: '11px',
															fontWeight: 700,
														}}>
														{cat.profitMargin}%
													</span>
												</td>
												<td style={tdStyle('right', { color: '#555' })}>{share}%</td>
											</tr>
										);
									});
								})()}
							</tbody>
							{/* Totals row */}
							<tfoot>
								<tr style={{ backgroundColor: '#f0f0f0', fontWeight: 700, borderTop: '2px solid #ccc' }}>
									<td style={tdStyle('left', { fontWeight: 700 })}>Total</td>
									<td style={tdStyle('right', { fontWeight: 700 })}>
										{fmt(profitByCategory.reduce((s, c) => s + (c.totalRevenue || 0), 0))}
									</td>
									<td style={tdStyle('right', { fontWeight: 700, color: '#888' })}>
										{fmt(profitByCategory.reduce((s, c) => s + (c.totalCost || 0), 0))}
									</td>
									<td style={tdStyle('right', { fontWeight: 700, color: '#00A76F' })}>
										{fmt(profitByCategory.reduce((s, c) => s + (c.netProfit || 0), 0))}
									</td>
									<td style={tdStyle('right')}>—</td>
									<td style={tdStyle('right')}>100%</td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>

				{/* ── Footer ──────────────────────────────────────────────────────── */}
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
					<strong style={{ color: '#555' }}>Quickbill Billing System</strong> &nbsp;·&nbsp;
					All monetary values are in BDT (৳) &nbsp;·&nbsp;
					{new Date().toLocaleString()}
				</div>
			</div>
		);
	},
);

ProfitReportPrint.displayName = 'ProfitReportPrint';

export default ProfitReportPrint;
