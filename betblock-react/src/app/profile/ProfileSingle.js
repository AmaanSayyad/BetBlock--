import React, {useState, useEffect} from 'react';
import {
	Paper,
	Box,
	Typography,
	Tooltip,
	IconButton,
	CircularProgress,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {copyContent} from '../util'
import {useParams} from 'react-router-dom'
import Alert from '../../common/Alert'
import Button from '../../common/Button'
import {format, parseISO} from 'date-fns'
import { publicMainnetClient, publicFujiClient, walletFujiClient } from '../ViemClient'
import { getContract } from 'viem'
import {nftAddress, nftABI} from './contractDetails';
import {truncateAddress} from '../util'
import BetblockLogo from '../../images/BetblockLogo'
import MintModal from './MintModal'
import LogoImage from '../../home/landing/gallerySample/sample0.png'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import axios from 'axios'

const contractNFT = getContract({
	address: nftAddress,
	abi: nftABI,
	publicFujiClient,
	walletFujiClient,
})

const BackgroundBox = styled(Box)(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 70%)`
}))

export default function ProfileSingle({
	...props
}) {
	const [openAlert, setOpenAlert] = useState(false)
	const [activities, setActivities] = useState([])
	const [meta, setMeta] = useState({})
	// big primary name to display
	const [mainName, setMainName] = useState('')

	// this is set after we determine what kind of NFT is owned
	const [bioExist, setBioExist] = useState(-1) // -1 for loading, 0 for no, 1 for yes
	const [openMint, setOpenMint] = useState(false)

	const [loadingProfile, setLoadingProfile] = useState(true)
	const [profile, setProfile] = useState(null)

	const {address} = useParams()

	const {primaryWallet} = useDynamicContext();

	const copyAddress = (e) => {
		copyContent(e, address);
		setOpenAlert(true)
	}

	const formattedJoin = () => {
		if (!meta?.joined) {
			return ''
		}
		return format(parseISO(meta.joined), 'PPP')
	}

	const loadNFT = async () => {
		publicFujiClient.readContract({
			address: nftAddress,
			abi: nftABI,
			functionName: 'tokenOfOwnerByIndex',
			args: [address, 0],
		}).then((res) => {
			publicFujiClient.readContract({
				address: nftAddress,
				abi: nftABI,
				functionName: 'tokenURI',
				args: [res],
			}).then((res) => {
				axios.get(process.env.REACT_APP_PINATA_GATEWAY + res.slice(7)).then((res) => {
					setProfile(res.data)
					setLoadingProfile(false)
				}).catch((err) => {
					setLoadingProfile(false)
					console.log(err)
				})
			}).catch((err) => {
				setLoadingProfile(false)
				console.log(err)
			})
		}).catch((err) => {
			setLoadingProfile(false)
			console.log(err)
		})
	}

	useEffect(() => {
		const load = async () => {
			// load activities based on address
			setActivities([])
			setMeta({joined: '2023-12-04T12:00:00Z'})
			publicMainnetClient.getEnsName({address: address}).then((res) => {
				if (res) {
					setMainName(res)
				}
				else {
					setMainName(truncateAddress(address, 7, 5))
				}
			}).catch((err) => {
				console.error(err)
				setMainName(truncateAddress(address, 7, 5))
			})
			publicFujiClient.readContract({address: nftAddress, abi: nftABI, functionName: 'balanceOf', args: [address]}).then((res) => {
				if (parseInt(res) > 0) {
					setBioExist(1)
				}
				else {
					setBioExist(0)
				}
			}).catch((err) => {
				setBioExist(0)
			})
		}
		load()
		loadNFT()
	}, [address])

	return (
		<BackgroundBox sx={{mt: 5, mb: 10}}>
			<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
				<Paper elevation={1} sx={{p: 4, width: '100%'}}>
					<Box sx={{display: 'flex'}}>
						<Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',
							width: '256px', height: '256px', borderRadius: '10px', border: (theme) => `1px solid ${theme.palette.dark.modal}`}}>
							{ loadingProfile ? <CircularProgress/> : 
							profile ? 
							<img
								src={process.env.REACT_APP_PINATA_GATEWAY + profile.image.slice(7)}
								crossOrigin='anonymous'
								alt='bbb profile'
								width={250}/> : <BetblockLogo/>
							}
						</Box>
						<Box sx={{display: 'flex', flexDirection: 'column', ml: 2}}>
							<Typography color='text.secondary'>{address}</Typography>
							<Box sx={{display: 'flex', alignItems: 'center'}}>
								<Box sx={{flex: 1, display: 'flex', alignItems: 'center'}}>
								{mainName === '' ? <CircularProgress size='1.6rem'/> : <Typography variant='h5'>{mainName}</Typography>}
								<Tooltip title={<Typography>Copy address</Typography>}>
									<IconButton onClick={(e) => copyAddress(e)} sx={{ml: 1}}><ContentCopyIcon/></IconButton>
								</Tooltip>
								</Box>
								{ bioExist === 0 && (primaryWallet?.address === address) && <Button onClick={() => setOpenMint(true)}>Mint Bio</Button>}
							</Box>

							{meta?.joined && <Typography>Joined {formattedJoin()}</Typography>}

						</Box>
					</Box>
				</Paper>
				<Paper elevation={1} sx={{p: 4, maxWidth: '750px', minWidth: '720px', mt: 3}}>
					<Box sx={{display: 'flex'}}>
						<Typography variant='h6'>Activity</Typography>
					</Box>
					<Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
						{activities.length === 0 && <Typography color='text.secondary' sx={{fontStyle: 'italic'}}>No activities yet! - Feature Coming Soon.</Typography>}
					</Box>
				</Paper>
			</Box>
			<Alert open={openAlert} setOpen={setOpenAlert} alertMessage='Copied!' />
			{(bioExist === 0 || profile ) && <MintModal open={openMint} handleClose={() => setOpenMint(false)} address={address} /> }
		</BackgroundBox>
	)
}