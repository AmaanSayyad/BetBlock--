import React from 'react'
import {
	Box,
	Typography
} from '@mui/material';
import LeaderboardTable from '../community/LeaderboardTable'

export default function AppLandingPostTable({
	...props
}) {

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '400px', mx: 10, mt: 10}}>
			<Box sx={{display: 'flex', flexDirection: 'column'}}>
				<Typography variant='h4'>Leaderboard</Typography>
				<Typography color="text.secondary" gutterBottom>Your top betblock winners (beta)</Typography>
			</Box>
			<LeaderboardTable />
		</Box>
	)
}