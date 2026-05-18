import { useFormContext, Controller } from 'react-hook-form';
import { Grid, TextField, Autocomplete, Chip } from '@mui/material';
import FormSection from './FormSection';

const MediaMetadataSection = () => {
	const { control } = useFormContext();

	return (
		<FormSection title='Media & Metadata'>
			<Grid size={6}>
				<Controller
					name='images'
					control={control}
					render={({ field }) => (
						<TextField
							label='Product Images'
							fullWidth
							variant='outlined'
							multiline
							rows={3}
							value={field.value?.join('\n') ?? ''}
							onChange={(event) =>
								field.onChange(
									event.target.value
										.split('\n')
										.map((url) => url.trim())
										.filter(Boolean),
								)
							}
							placeholder='https://example.com/image1.jpg&#10;https://example.com/image2.jpg'
							size='small'
							helperText='Enter one image URL per line'
						/>
					)}
				/>
			</Grid>

			<Grid size={6}>
				<Controller
					name='tags'
					control={control}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							multiple
							freeSolo
							disablePortal
							sx={{ width: '100%' }}
							options={[]}
							value={value || []}
							onChange={(event, newValue) => onChange(newValue)}
							renderTags={(tagValue, getTagProps) =>
								tagValue.map((option, index) => {
									const { key, ...tagProps } = getTagProps({ index });
									return (
										<Chip
											key={key}
											variant='outlined'
											label={option}
											size='small'
											{...tagProps}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Tags'
									size='small'
									placeholder='Type and press Enter'
								/>
							)}
						/>
					)}
				/>
			</Grid>
		</FormSection>
	);
};

export default MediaMetadataSection;
