import React from 'react'
import {
	Box,
	Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import AppLandingPostNav from './AppLandingPostNav'
import AppLandingPostTable from './AppLandingPostTable'

const BackgroundBox = styled(Box)(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	// background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 50%)`
	backgroundImage: 'linear-gradient(185deg, #121212 25%, #330e6d 45%, #121212 65%)'
}))

export default function AppLandingPost({...props}) {

	return (
		<BackgroundBox sx={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '5rem'}}>
				<Typography variant='h3' gutterBottom color="text.accent">Welcome to the Hub</Typography>
				<Typography variant='h5'>Begin your journey</Typography>
			</Box>

			<AppLandingPostNav/>
			<AppLandingPostTable/>
		</BackgroundBox>
	)
}