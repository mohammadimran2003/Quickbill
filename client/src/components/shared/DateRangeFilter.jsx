import React, { useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function DateRangeFilter({ onFilterChange }) {
	const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
	const [toDate, setToDate] = useState(dayjs());
	const [groupBy, setGroupBy] = useState('daily');

	const handleSearch = () => {
		if (fromDate && toDate) {
			onFilterChange({
				startDate: fromDate.format('YYYY-MM-DD'),
				endDate: toDate.format('YYYY-MM-DD'),
				groupBy,
			});
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box
				sx={{
					p: 2,
					bgcolor: 'background.paper',
					borderRadius: 1,
					boxShadow: 1,
				}}>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						gap: 2,
					}}>
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							gap: 2,
							flex: '1 1 auto',
						}}>
						<DatePicker
							label='From Date'
							value={fromDate}
							onChange={(newValue) => setFromDate(newValue)}
							slotProps={{ textField: { size: 'small' } }}
							sx={{ flex: '1 1 160px', minWidth: 160 }}
						/>
						<DatePicker
							label='To Date'
							value={toDate}
							onChange={(newValue) => setToDate(newValue)}
							minDate={fromDate || undefined}
							slotProps={{ textField: { size: 'small' } }}
							sx={{ flex: '1 1 160px', minWidth: 160 }}
						/>
					</Box>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							flexShrink: 0,
						}}>
						<TextField
							select
							label='Group By'
							value={groupBy}
							onChange={(e) => setGroupBy(e.target.value)}
							size='small'
							sx={{ minWidth: 130 }}>
							<MenuItem value='daily'>Daily</MenuItem>
							<MenuItem value='weekly'>Weekly</MenuItem>
							<MenuItem value='monthly'>Monthly</MenuItem>
						</TextField>
						<Button
							variant='contained'
							onClick={handleSearch}
							sx={{ height: 40, minWidth: 100, flexShrink: 0 }}>
							Filter
						</Button>
					</Box>
				</Box>
			</Box>
		</LocalizationProvider>
	);
}
