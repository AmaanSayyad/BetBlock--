import React, {useState, useRef, useMemo, useEffect} from 'react';
import {
	Box,
	Typography,
	Modal,
	IconButton,
	Tooltip,
	TextField,
	Slide,
	LinearProgress
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { publicFujiClient, walletFujiClient } from '../ViemClient'
import { getContract, toHex } from 'viem'
import {nftAddress, nftABI, sourceCode} from './contractDetails';
import {encryptSecretsUrls} from './ChainlinkFunctionsHelper';
import {CelebrateAnimation} from '../../lottie/LottieWraps'
import Button from '../../common/Button'
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 450,
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 5,
  pl: 4,
  pr: 2,
  py: 2
};

export default function MintModal({
	open,
	handleClose,
	address,
	...props
}) {
	const [value, setValue] = useState('')
	const [page, setPage] = useState(0)

	const [correctNetwork, setCorrectNetwork] = useState(false)

	let containerRef = useRef(null)

	const handleChange = (e) => {
		e.preventDefault()
		setValue(e.target.value)
	}

	const handleSubmit = async () => {
		setPage(1)
		const subscriptionId = 1864;

		const encryptedSecretsUrls = await encryptSecretsUrls([process.env.REACT_APP_S3_SECRET_URL]);

		const mintRequest = await publicFujiClient.simulateContract({
			address: nftAddress,
			abi: nftABI,
			functionName: 'mintRequest',
			args: [sourceCode, encryptedSecretsUrls, [value], subscriptionId],
			account: address
		});
		await walletFujiClient.writeContract(mintRequest.request)
	}

	const reset = (e) => {
		handleClose()
		setValue('')
		setPage(0)
	}

	const conditionallyClose = (e) => {
		e.preventDefault();
		if (page !== 1) {
			reset(e)
		}
	}

	useEffect(() => {
		const checkBalance = async () => {
			publicFujiClient.readContract({address: nftAddress, abi: nftABI, functionName: 'balanceOf', args: [address]}).then((res) => {
				if (parseInt(res) > 0) {
					setPage(2)
				}
			}).catch((err) => {
				
			})
		}

		const checkNetwork = async () => {
			if (window.ethereum) {
				const currentChaidId = await window.ethereum.request({method: 'eth_chainId'});
				if (currentChaidId === '0xa869') {
					setCorrectNetwork(true)
				}
				else {
					setCorrectNetwork(false)
				}
			}
		}


		const interval = setInterval(() => {
      checkBalance();
    }, 1000)
    checkNetwork();

    // // // when the component unmounts
    return () => {
       clearInterval(interval)
    }
	}, [])

	const switchNetwork = async () => {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{chainId: '0xa869'}]
		})
		window.location.reload();
	}

	return (
		<Modal
			open={open}
			onClose={conditionallyClose}
			aria-labelledby='modal-input'>
			<Box sx={style} ref={containerRef}>
				{ page === 0 &&
				<React.Fragment>
				<Box sx={{display: 'flex', alignItems: 'center'}}>
					<Box sx={{display: 'flex', flex: 1, alignItems: 'center'}}>
						<Typography variant='h6' sx={{color: (theme) => theme.palette.accent.main}}>Mint Your Bio!</Typography>
					</Box>
					<Tooltip title={<Typography>Close</Typography>}>
						<IconButton onClick={conditionallyClose}><CloseIcon/></IconButton>
					</Tooltip>
				</Box>
				<Box sx={{display: 'flex', flexDirection: 'column', mr: 2}}>
					<Typography color='text.secondary' sx={{fontStyle: 'italic'}}>Create a one-of-a-kind AI-generated NFT to represent your profile. You may only have 1 NFT, so choose your words wisely!</Typography>
				</Box>
				{ correctNetwork ? 
				<Box sx={{display: 'flex', alignItems: 'flex-start', mt: 2}}>
					<TextField
						helperText={'64 character limit. Currently ' + value.length}
						value={value}
						onChange={(e) => handleChange(e)}
						inputProps={{ maxLength: 64 }}
						fullWidth />
					<Tooltip title={<Typography>Generate NFT</Typography>}>
						<Box sx={{mt: 1}}>
							<IconButton disabled={value === ''} onClick={handleSubmit} sx={{ml: 1}}><NavigateNextIcon/></IconButton>
						</Box>
					</Tooltip>
				</Box> :

				<Box sx={{display: 'flex', alignItems: 'flex-start', mt: 2}}>
					<Button onClick={() => switchNetwork()}>Switch Network</Button>
				</Box>
				}
				</React.Fragment>
				}
				<Slide direction='left' in={page === 1} mountOnEnter unmountOnExit container={containerRef.current}>
					<Box sx={{display: 'flex', alignItems: 'stretch', flexDirection: 'column'}}>
						<Typography variant='h6'>Please do not refresh!</Typography>
						<Typography color='text.secondary'>Your NFT is being generated...</Typography>
						<Box sx={{my: 4, mr: 2}}>
							<LinearProgress color='accent'/>
						</Box>
					</Box>
				</Slide>

				<Slide direction='left' in={page === 2} mountOnEnter unmountOnExit container={containerRef.current}>
					<Box sx={{display: 'flex', flexDirection: 'column'}}>
						<Box sx={{display: 'flex', alignItems: 'center'}}>
							<Typography variant='h6' sx={{color: (theme) => theme.palette.accent.main, flex: 1}}>Completed!</Typography>
							<Tooltip title={<Typography>Close</Typography>}>
								<IconButton onClick={conditionallyClose}><CloseIcon/></IconButton>
							</Tooltip>
						</Box>						
						<Box sx={{display:'flex', my: 4, mr: 2, height: '300px', justifyContent: 'center'}}>
							<CelebrateAnimation />
						</Box>
					</Box>
				</Slide>
			</Box>
		</Modal>
	)
}