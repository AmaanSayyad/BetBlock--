import React from 'react'
import {
	AppBar,
	Box,
	Typography,
	Slide,
	Link,
	useScrollTrigger,
} from '@mui/material'
import {styled} from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import Groups2Icon from '@mui/icons-material/Groups2';
import BetblockLogo from '../images/BetblockLogo'
import Button from '../common/Button'
import {useDynamicContext} from '@dynamic-labs/sdk-react-core';
import {truncateAddress} from './util'

const TopNav = styled(AppBar)(({theme}) => ({
	alignItems: 'center',
	//backgroundColor: alpha(theme.palette.dark.bg, 0.8),
	backgroundColor: theme.palette.dark.bg,
	backgroundImage: 'none',
	boxShadow: '0px 1px 2px -1px rgba(0,0,0,0.2), 0px 2px 3px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
}))

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function AppPageHeader({...props}) {

	const {user, primaryWallet, handleLogOut} = useDynamicContext()

	return (
		user ?
		<HideOnScroll {...props}>
			<TopNav>
				<Box sx={{display: 'flex', flex: 1, alignItems: 'center', mx: '10rem', py: '1rem', maxWidth: '1200px', width: '100%'}}>
					<Link sx={{display: 'flex', alignItems: 'center'}} href="/" underline='none'>
						<BetblockLogo sx={{width: '35px'}} />
						<Typography sx={{fontWeight: 'bold', fontSize: '1.2rem', ml: 1}}>betblock</Typography>
					</Link>

					<Box sx={{flex: 1, ml: '5rem'}}>
						<Button variant='text' fontSize='1rem' href='/bank' startIcon={<AttachMoneyIcon/>}>Bank</Button>
						<Button variant='text' fontSize='1rem' href='/games' startIcon={<VideogameAssetIcon/>} sx={{ml: '1rem'}}>Games</Button>
						<Button variant='text' fontSize='1rem' href='/community' startIcon={<Groups2Icon/>} sx={{ml: '1rem'}}>Community</Button>
					</Box>
					<Box sx={{mr: 1}}>
					<Button variant='text' fontSize='1rem' href={'/profile/' + primaryWallet?.address}>{user?.ens?.name ? user.ens.name : (primaryWallet?.address ? truncateAddress(primaryWallet.address) : 'Profile')}</Button>
					</Box>
					<Button fontSize='1rem' onClick={handleLogOut}>Log Out</Button>
				</Box>
			</TopNav>
		</HideOnScroll>
		:
		<React.Fragment/>
	)
}