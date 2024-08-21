import React from 'react'
import {
	Alert,
	Snackbar
} from '@mui/material';

const StyledAlert = React.forwardRef(function StyledAlert(props, ref) {
  return <Alert elevation={6} ref={ref} variant="filled" {...props} sx={{color: (theme) => theme.palette.text.primary}} />;
});

export default function CustomAlert({
	open,
	setOpen,
	alertMessage = '',
	autoHideDuration = 1500,
	severity = 'success',
	...props
}) {
	return (
		<Snackbar
	    open={open}
	    autoHideDuration={autoHideDuration}
	    onClose={() => setOpen(false)}>
	    <StyledAlert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
	        {alertMessage}
	    </StyledAlert>
	  </Snackbar>
  )
}