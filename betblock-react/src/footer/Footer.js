import React from 'react'
import {
	Box,
	Typography
} from '@mui/material'
import BetblockLogo from '../images/BetblockLogo'

export default function Footer({...props}) {
	return (
		<footer style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '2rem'}}>
			<Box sx={{display: 'flex', alignItems: 'center'}}>
				<BetblockLogo sx={{width: '30px'}} />
				<Typography sx={{fontWeight: 'bold', ml: 1}}>betblock {new Date().getFullYear()}</Typography>
			</Box>
		</footer>
	)
}
