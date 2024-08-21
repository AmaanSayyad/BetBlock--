import React from 'react'
import {
	Box,
	Typography,
	Card,
	CardContent,
} from '@mui/material'

export default function HomeAboutPage ({
	...props
}) {
	return (
		<React.Fragment>
			<Box sx={{display: 'flex', flexDirection: 'column', mt: '10rem', mx: '10rem', justifyContent: 'center', mb: '3rem'}}>
				<Typography sx={{fontSize: '3rem'}}>How It Works</Typography>
			</Box>
			<Box sx={{display: 'flex', flexDirection: 'column', mt: '10rem', mx: '10rem', justifyContent: 'center', mb: '3rem'}}>
				<Typography sx={{fontSize: '3rem'}}>The Team</Typography>
				<Typography sx={{fontSize: '1.2rem', color: (theme) => theme.palette.text.secondary}}>The duo that put it all together</Typography>
				<Box sx={{display: 'flex', mt: 2}}>
				<Card sx={{mr: 2, flex: 1}}>
					<CardContent sx={{display: 'flex'}}>
						<Box sx={{width: '200px', height: '200px', backgroundColor: 'grey'}}></Box>
						<Box sx={{flex: 1, ml: 2}}>
							<Typography>Brimigs</Typography>	
						</Box>
					</CardContent>
				</Card>
				<Card sx={{ml: 2, flex: 1}}>
					<CardContent sx={{display: 'flex'}}>
						<Box sx={{width: '200px', height: '200px', backgroundColor: 'grey'}}></Box>
						<Box sx={{flex: 1, ml: 2}}>
							<Typography>Amaan</Typography>	
						</Box>
					</CardContent>
				</Card>
				</Box>
			</Box>
		</React.Fragment>
	)
}