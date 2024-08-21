import React, {useEffect, useState} from 'react';
import {
	Box,
	Typography,
	Modal,
	Tooltip,
	IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import {CookieAnimation} from '../lottie/LottieWraps';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 450,
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 5,
  pl: 4,
  pr: 2,
  py: 2
};

export default function InputModal({
	open,
	handleClose,
	...props
}) {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-input'>
			<Box sx={style}>
				<Box sx={{display: 'flex', alignItems: 'center'}}>
					<Box sx={{display: 'flex', flex: 1, alignItems: 'center'}}>
						<Typography variant='h6'>Oops!</Typography>
					</Box>
					<Tooltip title={<Typography>Close</Typography>}>
						<IconButton onClick={handleClose}><CloseIcon/></IconButton>
					</Tooltip>
				</Box>
				<Box sx={{display: 'flex', mt: 2}}>
					<Box sx={{display: 'flex', flexDirection: 'column', flex: 3}}>
						<Typography>This feature is temporarily disabled. The fix is on the way! We are sorry for the inconvenience.</Typography>
						<Typography sx={{mt: 2, fontWeight: 'bold'}} color='text.accent'>Here is a cookie on us</Typography>
					</Box>
					<Box sx={{flex: 1}}>
					<CookieAnimation />
					</Box>
				</Box>
			</Box>
		</Modal>
	)
}