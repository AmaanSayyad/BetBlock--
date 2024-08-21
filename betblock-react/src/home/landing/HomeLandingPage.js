import React from 'react'
import {
	Box,
	Typography,
	Divider,
	Paper,
} from '@mui/material'
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import BlockNetwork from './BlockNetwork'
import ArtGallery from './ArtGallery'
import PolygonLogo from '../../images/PolygonLogo'
import ChainlinkLogo from '../../images/ChainlinkLogo'
import AvalancheLogo from '../../images/AvalancheLogo'

const GradBox = styled(Box)(({theme}) => ({
	backgroundImage: 'linear-gradient(170deg, #121212 40%, #330e6d 55%, #121212 70%)'
}))

export default function HomeLandingPage ({
	...props
}) {
	return (
		<React.Fragment>
			<Box sx={{display: 'flex', mt: '10rem', minHeight: '400px', mx: '10rem', justifyContent: 'center', mb: '3rem'}}>
				<Box sx={{maxWidth: '800px'}}>
					<Typography sx={{fontSize: '3.75rem', color: (theme) => theme.palette.text.accent}}>Revolutionize Gaming</Typography>
					<Typography sx={{fontSize: '3.75rem'}}>One Block at a Time</Typography>
					<Typography sx={{color: (theme) => theme.palette.text.secondary, fontSize: '1.5rem', mt: 2}}>Join our betblock community and start playing!</Typography>
				</Box>
				<Box sx={{minWidth: '400px'}}>
					<BlockNetwork/>
				</Box>
			</Box>
			<Divider />
			<GradBox sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', pt: '3rem'}}>
				<Paper elevation={3} sx={{display: 'flex', flexDirection: 'column', pt: '2rem', alignItems: 'center', maxWidth: '900px'}}>
					<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Typography sx={{fontSize: '3rem'}}>Morph Your Journey with GenAI</Typography>
						<Typography sx={{color: (theme) => theme.palette.text.secondary, fontSize: '1.2rem', mt: 1}}>
							Every time you play, you change your NFT profile based on the outcomes
						</Typography>
					</Box>
					<Box sx={{minHeight: '400px', minWidth: '55rem'}}>
						<ArtGallery />
					</Box>
				</Paper>

				<Box sx={{display: 'flex', mt: '8rem', mb: '5rem', maxWidth: '900px'}}>
					<Grid container spacing={2} sx={{width: '15rem'}}>
						<Grid xs={12} md={12}>
						<ChainlinkLogo id='chain' sx={{width: '100%', height: '100%'}} />
						</Grid>
						<Grid xs={12} md={12}>
						<PolygonLogo sx={{width: '100%', height: '100%'}} id='matic' />
						</Grid>
						<Grid xs={12} md={12} sx={{display: 'flex', alignItems: 'center'}}>
						<AvalancheLogo sx={{width: '100%',}} id='avax' />
						</Grid>
					</Grid>
					<Box sx={{ml: 3, textAlign: 'right'}}>
						<Typography sx={{fontSize: '3rem', mt: 1}}>Enjoy an Integrated Experience</Typography>
						<Typography sx={{color: (theme) => theme.palette.text.secondary, fontSize: '1.2rem', mt: 1}}>
							Lend & play on supported blockchains
						</Typography>
					</Box>
				</Box>
			</GradBox>
		</React.Fragment>
	)
}