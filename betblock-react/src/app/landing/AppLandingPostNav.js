import React, {useState, useRef, useEffect} from 'react'
import {
	Box,
	Typography,
	CircularProgress
} from '@mui/material';
import HoverSelectionCard from '../../common/HoverSelectionCard'
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
	BankAnimation,
	GameAnimation,
	CommunityAnimation
} from '../../lottie/LottieWraps'
import PolygonLogo from '../../images/PolygonLogo'
import AvalancheLogo from '../../images/AvalancheLogo'
import ChainlinkLogo from '../../images/ChainlinkLogo'
import {publicMumbaiClient, publicFujiClient} from '../ViemClient'
import {pricingMumbaiAddress, pricingMumbaiABI, pricingFujiAddress, pricingFujiABI} from '../contractDetailsPricing'
import currency from 'currency.js'

export default function AppLandingPostNav({...props}) {
	let bankRef = useRef()
	let communityRef = useRef()
	let gameRef = useRef()

	const [linkPrice, setLinkPrice] = useState(-1);
	const [avaxPrice, setAvaxPrice] = useState(-1);
	const [maticPrice, setMaticPrice] = useState(-1);

	useEffect(() => {
		const loadPrice = async () => {
			// link price load
			publicMumbaiClient.readContract({
				address: pricingMumbaiAddress,
				abi: pricingMumbaiABI,
				functionName: 'getLatestLinkPrice'
			}).then((res) => {
				if (res) {
					setLinkPrice(parseInt(res) * 1E-8)
				}
			})

			// matic price load
			publicMumbaiClient.readContract({
				address: pricingMumbaiAddress,
				abi: pricingMumbaiABI,
				functionName: 'getLatestMaticPrice'
			}).then((res) => {
				if (res) {
					setMaticPrice(parseInt(res) * 1E-8)
				}
			})

			// avax price load
			publicFujiClient.readContract({
				address: pricingFujiAddress,
				abi: pricingFujiABI,
				functionName: 'getLatestAvaxPrice'
			}).then((res) => {
				setAvaxPrice(parseInt(res) * 1E-8)
			})

			// avax price load
			setAvaxPrice(0.)
		}

		if (bankRef.current) {
			bankRef.current.goToAndStop(100, true);
			bankRef.current.setSpeed(2)
		}
		if (gameRef.current) {
			gameRef.current.goToAndStop(114, true);
			gameRef.current.setSpeed(2);
		}
		
		if (communityRef.current) {
			communityRef.current.goToAndStop(124, true);
			communityRef.current.setSpeed(2)	
		}
		loadPrice();
		
	}, [])

	return (
		<Grid container spacing={2} sx={{mt: '5rem', mx: 10, }}>
			<Grid md={4} sm={12} onMouseEnter={() => bankRef.current.goToAndPlay()} onMouseLeave={() => bankRef.current.goToAndStop(100, true)}>
				<HoverSelectionCard href="/bank" heading="Bank" subheading="Access Your Gateway to Game Funds">
					<Box sx={{display: 'flex'}}>
						<Box sx={{flex: 1, mt: 1}}>
							<Box sx={{display: 'flex', flexDirection: 'column'}}>
								<Box sx={{display: 'flex', mt: 1, alignItems: 'center'}}>
									<ChainlinkLogo sx={{width: '25px', height: '100%'}} id='link' simple={+true} />
									{ linkPrice < 0 ? <CircularProgress size={'1rem'} sx={{ml: 2}}/> :
									<Typography sx={{fontSize: '1.2rem', ml: 2}}>{currency(linkPrice).format()}</Typography>
									}
								</Box>
								<Box sx={{display: 'flex', mt: 1, alignItems: 'center'}}>
									<PolygonLogo sx={{width: '25px', height: '100%'}} id='matic' simple={+true} />
									{ maticPrice < 0 ? <CircularProgress size={'1rem'} sx={{ml: 2}}/> :
										<Typography sx={{fontSize: '1.2rem', ml: 2}}>{currency(maticPrice).format()}</Typography>
									}
								</Box>
								<Box sx={{display: 'flex', mt: 1, alignItems: 'center'}}>
									<AvalancheLogo sx={{width: '25px', height: '100%'}} id='avax' simple={+true} />
									{ avaxPrice < 0 ? <CircularProgress size={'1rem'} sx={{ml: 2}}/> :
										<Typography sx={{fontSize: '1.2rem', ml: 2}}>{currency(avaxPrice).format()}</Typography>
									}
								</Box>
							</Box>
						</Box>
						<Box sx={{flex: 1}}>
							<BankAnimation ref={bankRef} autoplay={false} />
						</Box>
					</Box>
				</HoverSelectionCard>
			</Grid>
			<Grid md={4} sm={12} onMouseEnter={() => gameRef.current.goToAndPlay(0)} onMouseLeave={() => gameRef.current.goToAndStop(100, true)}>
				<HoverSelectionCard href='/games' heading="Games" subheading="Dive into your Gaming Escape">
					<Box sx={{display: 'flex'}}>
						<Box sx={{flex: 1, py: 2}}>
							<Typography>Ready to play?</Typography>
							<Typography sx={{mt: 1}}>Test your luck in Roulette or Slots</Typography>
						</Box>
						<Box sx={{flex: 1}}>
							<GameAnimation ref={gameRef} autoplay={false} />
						</Box>
					</Box>
				</HoverSelectionCard>
			</Grid>
			<Grid md={4} sm={12} onMouseEnter={() => communityRef.current.goToAndPlay(0)} onMouseLeave={() => communityRef.current.goToAndStop(100, true)}>
				<HoverSelectionCard href='/community' heading='Community' subheading='Forge Connections in Collective Play'>
					<Box sx={{display: 'flex'}}>
						<Box sx={{flex: 1, py: 2}}>
							<Typography>Check out other users on betblock!</Typography>
							<Typography sx={{mt: 1, fontSize: '1.6rem'}}>1,001,231 users</Typography>
						</Box>
						<Box sx={{flex: 1}}>
							<CommunityAnimation ref={communityRef} autoplay={false} />
						</Box>
					</Box>
				</HoverSelectionCard>
			</Grid>
		</Grid>
	)
}