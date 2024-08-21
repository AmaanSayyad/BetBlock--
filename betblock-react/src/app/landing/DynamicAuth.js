import React from 'react'
import {
	Box,
	Typography,
	Tooltip
} from '@mui/material/';
import { styled } from '@mui/material/styles';
import WalletIcon from '@mui/icons-material/Wallet';
import InfoIcon from '@mui/icons-material/Info';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import Button from '../../common/Button'
import BetblockLogo from '../../images/BetblockLogo'

const BoxBackground = styled(Box)(({theme}) => ({
	//background: `radial-gradient(farthest-corner at 80px 250px, ${theme.palette.bg.primary}, ${theme.palette.dark.bg} 60%)`
	background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 70%)`
}))

export default function DynamicAuth ({...props}) {
	const { setShowAuthFlow } = useDynamicContext();
	return (
  	<BoxBackground sx={{py: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
  		<Box id='landing-heading' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
  			<Box sx={{display: 'flex', alignItems: 'center'}}>
  				<Typography sx={{fontSize: '2.4rem', fontWeight: 'bold', mr: 2}}>Welcome to</Typography>
  				<Box sx={{display: 'flex', alignItems: 'center'}}>
  				<BetblockLogo sx={{width: '45px'}}/>
  				<Typography sx={{fontSize: '2.4rem', fontWeight: 'bold', ml: 1}}>betblock!</Typography>
  				</Box>
  			</Box>  			
  			<Typography sx={{color: (theme) => theme.palette.text.secondary, mt: 1}}>Please connect your wallet to proceed.</Typography>
  		</Box>
  		<Box id='landing-action' sx={{mt: '1rem'}}>
  			<Button onClick={() => setShowAuthFlow(true)} endIcon={<WalletIcon/>} fontSize='1.1rem'>Connect Wallet</Button>
  		</Box>
  		<Tooltip title={<Typography>Welcome to betblock! We are glad you are here. Connect your wallet to proceed! Go to your profile to mint your unique NFT. **Note: this experience is not mobile-optimized and runs on Mumbai & Fuji Testnet</Typography>}>
	  		<Box sx={{display: 'flex', mt: '1rem', color: (theme) => theme.palette.text.secondary}}>
	  			<Typography>First time user?</Typography>
	  			<InfoIcon sx={{ml: 1}} />
	  		</Box>
  		</Tooltip>
  	</BoxBackground>
	)
}