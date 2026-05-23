import { Chip, IconButton, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useUserColumns = ({ onEditClick, onResetPasswordClick, onToggleStatusClick }) => {
	return [
		{ header: 'Name', accessorKey: 'name', enableSorting: true },
		{ header: 'Email', accessorKey: 'email', enableSorting: true },
		{
			header: 'Role',
			accessorKey: 'role',
			cell: ({ getValue }) => {
				const role = getValue();
				const roleColors = {
					ADMIN: 'error',
					MANAGER: 'warning',
					SALESMAN: 'info',
				};
				return (
					<Chip
						label={role}
						size='small'
						color={roleColors[role] || 'default'}
					/>
				);
			},
			enableSorting: true,
		},
		{
			header: 'Status',
			accessorKey: 'isActive',
			cell: ({ getValue }) => (
				<Chip
					label={getValue() ? 'Active' : 'Inactive'}
					size='small'
					color={getValue() ? 'success' : 'error'}
				/>
			),
			enableSorting: false,
		},
		{
			header: 'Created At',
			accessorKey: 'createdAt',
			cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
			enableSorting: true,
		},
		{
			header: 'Actions',
			id: 'actions',
			cell: ({ row }) => (
				<Stack direction='row' spacing={1}>
					<Tooltip title='Edit'>
						<IconButton
							size='small'
							color='primary'
							onClick={() => onEditClick(row.original)}>
							<EditIcon fontSize='small' />
						</IconButton>
					</Tooltip>

					<Tooltip title='Reset Password'>
						<IconButton
							size='small'
							color='info'
							onClick={() => onResetPasswordClick(row.original)}>
							<LockResetIcon fontSize='small' />
						</IconButton>
					</Tooltip>

					<Tooltip title={row.original.isActive ? 'Deactivate' : 'Activate'}>
						<IconButton
							size='small'
							color={row.original.isActive ? 'error' : 'success'}
							onClick={() => onToggleStatusClick(row.original)}>
							{row.original.isActive ? (
								<BlockIcon fontSize='small' />
							) : (
								<CheckCircleIcon fontSize='small' />
							)}
						</IconButton>
					</Tooltip>
				</Stack>
			),
		},
	];
};

export default useUserColumns;
