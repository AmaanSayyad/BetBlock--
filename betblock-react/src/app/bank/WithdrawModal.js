import React, {useEffect, useState, useRef} from 'react';
import {
	Box,
	Typography,
	Modal,
	IconButton,
	Tooltip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import PolygonLogo from '../../images/PolygonLogo'
import AvalancheLogo from '../../images/AvalancheLogo'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TextFieldCurrency from '../../common/TextFieldCurrency'
import {publicMumbaiClient, publicFujiClient, walletFujiClient, walletMumbaiClient} from '../ViemClient'
import {mumbaiLendingAddress, mumbaiLendingABI, fujiLendingABI, fujiLendingAddress} from './contractDetails'
import {parseEther} from 'viem'
import Button from '../../common/Button'
import {useDynamicContext} from '@dynamic-labs/sdk-react-core';

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

export default function DepositModal({
	open,
	handleClose,
	modalType,
	...props
}) {
	const [correctNetwork, setCorrectNetwork] = useState(false)

	const [inputValue, setValue] = useState('')

	const [title, setTitle] = useState(null)
	const [errorMessage, setErrorMessage] = useState('')

	const [balance, setBalance] = useState(-1)
	const [estGas, setEstGas] = useState(-1)

	const {primaryWallet} = useDynamicContext();

	let mounted = useRef(true)

	const handleInputChange = (e) => {
		let val = e.target.value;
		setValue(val)
		setErrorMessage('')
	}

	const openDepositModal = async () => {
		setValue('')
		setErrorMessage('')
		if (modalType === 'mumbai-matic') {
			publicMumbaiClient.estimateGas({account: primaryWallet?.address}).then((res) => {
				if (mounted.current) {
					setEstGas(parseInt(res) * 1E-9)
				}
			}).catch((err) => {
				
			}).finally(() => {
				setTitle('MATIC (Mumbai Testnet) Withdraw')
			})
			publicMumbaiClient.readContract({
				address: mumbaiLendingAddress,
				abi: mumbaiLendingABI,
				functionName: 'getMaxWithdrawal',
				args: [primaryWallet?.address]
			}).then((res) => {
				setBalance(parseInt(res) * 1E-18)
			})
		}
		// update the avalanche modal
		else if (modalType === 'fuji-avax') {
			publicFujiClient.estimateGas({account: primaryWallet?.address}).then((res) => {
				if (mounted.current) {
					setEstGas(parseInt(res) * 1E-9)
				}
			}).catch((err) => {
					
			}).finally(() => {
				if (mounted.current) {
					setTitle('AVAX (Fuji Testnet) Withdraw')
				}
			})
			await publicFujiClient.readContract({
				address: fujiLendingAddress,
				abi: fujiLendingABI,
				functionName: 'getMaxWithdrawal',
				args: [primaryWallet?.address]
			}).then((res) => {
				setBalance(parseInt(res) * 1E-18)
			}).catch((err) => {
				setBalance('Something went wrong')
			})
		}
	}
		// submit matic for collateral
	const handleSubmitMatic = async () => {
		let amount = parseFloat(inputValue)
		// cannot exceed balance
		if (amount > balance) {
			setErrorMessage('Exceeding balance!')
			return
		}
		if (amount < 0) {
			setErrorMessage('Input must be non-negative')
			return
		}
		// matic lending
		let sendSim = await publicMumbaiClient.simulateContract({
			address: mumbaiLendingAddress,
			abi: mumbaiLendingABI,
			functionName: 'withdrawCollateral',
			args: [parseEther('' + inputValue)],
			account: primaryWallet?.address
		}).catch((err) => {console.log(err)})
		await walletMumbaiClient.writeContract(sendSim.request)
			.then((res) => window.location.reload())
			.catch((err) => console.log(err))
	}

	// submit matic for collateral
	const handleSubmitAvax = async () => {
		let amount = parseFloat(inputValue)
		// cannot exceed balance
		if (amount > balance) {
			setErrorMessage('Exceeding balance!')
			return
		}
		if (amount < 0) {
			setErrorMessage('Input must be non-negative')
			return
		}
		// avax lending
		let sendSim = await publicFujiClient.simulateContract({
			address: fujiLendingAddress,
			abi: fujiLendingABI,
			functionName: 'withdrawCollateral',
			args: [parseEther('' + inputValue)],
			account: primaryWallet?.address
		}).catch((err) => {console.log(err)})
		if (sendSim) {
			await walletFujiClient.writeContract(sendSim.request)
				.then((err) => window.location.reload())
				.catch((err) => console.log(err))
		}
	}

	const getCurrentNetwork = () => {
		if (modalType === 'mumbai-matic') {
			return '0x13881'
		}
		else if (modalType === 'fuji-avax') {
			return '0xa869'
		}
	}

	useEffect(() => {
		mounted.current = true
		const checkNetwork = async () => {
			let network = getCurrentNetwork()
			if (window.ethereum) {
				const currentChaidId = await window.ethereum.request({method: 'eth_chainId'});
				if (currentChaidId === network) {
					setCorrectNetwork(true)
				}
				else {
					setCorrectNetwork(false)
				}
			}
		}
		
		if (primaryWallet?.address) {
			openDepositModal()
			checkNetwork()
		}

		return () => {
			mounted.current = false
		}
	}, [open, primaryWallet?.address])

	const switchNetwork = async () => {
		let network = getCurrentNetwork()
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{chainId: network}]
		})
		window.location.reload();
	}

	const reset = (e) => {
		handleClose(e)
		setCorrectNetwork(false)
	}

	return (
		<Modal
			open={open}
			onClose={reset}
			aria-labelledby='modal-input'>
			<Box sx={style}>
				<Box sx={{display: 'flex', alignItems: 'center'}}>
					<Box sx={{display: 'flex', flex: 1, alignItems: 'center'}}>
						{modalType === 'mumbai-matic' && 	<PolygonLogo simple={+true} sx={{width: '30px', height: '30px'}} />}
						{modalType === 'fuji-avax' && <AvalancheLogo simple={+true} sx={{width: '30px'}} />}
						<Typography variant='h6' sx={{ml: 1}}>{title}</Typography>
					</Box>
					<Tooltip title={<Typography>Close</Typography>}>
						<IconButton onClick={reset}><CloseIcon/></IconButton>
					</Tooltip>
				</Box>
				{ correctNetwork ?
				<Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
					<TextFieldCurrency
						error={errorMessage !== ''}
						helperText={errorMessage}
						value={inputValue}
						handleChange={(e) => handleInputChange(e)}
						fullWidth
						dollarPrefix={false} />
					<Tooltip title={<Typography>Submit amount to withdraw</Typography>}>
						<Box>
							<IconButton
								disabled={inputValue === ''}
								onClick={() => modalType === 'mumbai-matic' ? handleSubmitMatic() : (modalType === 'fuji-avax' ? handleSubmitAvax() : console.log('You do not belong here'))}
								sx={{ml: 1}}><NavigateNextIcon/></IconButton>
						</Box>
					</Tooltip>
				</Box> :
				<Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
					<Button onClick={switchNetwork}>Switch Network</Button>
				</Box>
				}
				<Box sx={{display: 'flex', flexDirection: 'column', mt: 1}}>
					<Typography color='text.secondary' sx={{fontSize: '0.875rem'}}>{'Balance: ' + balance}</Typography>
					<Typography color='text.secondary' sx={{fontSize: '0.875rem'}}>{'Gas: ' + estGas +'gwei' }</Typography>
				</Box>
			</Box>
		</Modal>
	)
}