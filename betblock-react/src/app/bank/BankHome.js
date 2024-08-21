import React, {useState, useEffect, useRef} from 'react';
import {
	Box,
	Typography,
	Paper,
	Tooltip,
	CircularProgress,
	Divider
} from '@mui/material';
import {styled} from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import currency from 'currency.js'
import PolygonLogo from '../../images/PolygonLogo'
import AvalancheLogo from '../../images/AvalancheLogo'
import ChainlinkLogo from '../../images/ChainlinkLogo'
import Button from '../../common/Button'
import DisabledNoteModal from '../../common/DisabledNoteModal'
import TextFieldCurrency from '../../common/TextFieldCurrency'
import {useDynamicContext} from '@dynamic-labs/sdk-react-core';
import {publicFujiClient, walletFujiClient, publicMumbaiClient, walletMumbaiClient} from '../ViemClient'
// import {fujiCollateralAddress, fujiCollateralABI} from './contractDetails'
import {mumbaiLendingAddress, mumbaiLendingABI, fujiLendingABI, fujiLendingAddress} from './contractDetails'
import { parseEther } from 'viem'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

const BackgroundBox = styled(Box)(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 70%)`
}))

const dataBorrow = [
	//{'asset': 'LINK', 'assetLogo': <ChainlinkLogo simple={+true} />, 'balance': 0, 'apy': 0.03},
	{'asset': 'MATIC (Mumbai Testnet)', 'assetLogo': <PolygonLogo simple={+true} />, 'apy': 0.94},
	{'asset': 'AVAX (Fuji Testnet)', 'assetLogo': <AvalancheLogo simple={+true} sx={{width: '22px'}} />, 'apy': 2.05},
]

export default function BankHome({...props}) {
	const [openBorrowModal, setOpenBorrowModal] = useState(false)
	const [openWithdrawModal, setOpenWithdrawModal] = useState(false)
	const [modalType, setModalType] = useState(null)

	// balance
	const [linkBalance, setLinkBalance] = useState(-1)
	const [avaxBalance, setAvaxBalance] = useState(-1)
	const [maticBalance, setMaticBalance] = useState(-1)

	// price
	const [linkPrice, setLinkPrice] = useState(-1)
	const [avaxPrice, setAvaxPrice] = useState(-1)
	const [maticPrice, setMaticPrice] = useState(-1)

	// matic borrow stuff
	const [maticBorrowable, setMaticBorrowable] = useState(0.)
	const [maticCurrent, setMaticCurrent] = useState(0.)
	const [maticBorrowDisable, setMaticBorrowDisable] = useState(false);
	const [maticRepayDisable, setMaticRepayDisable] = useState(false);
	const [maticInput, setMaticInput] = useState('')
	// avax borrow stuff
	const [avaxBorrowable, setAvaxBorrowable] = useState(0.)
	const [avaxCurrent, setAvaxCurrent] = useState(0.)
	const [avaxBorrowDisable, setAvaxBorrowDisable] = useState(false);
	const [avaxRepayDisable, setAvaxRepayDisable] = useState(false);
	const [avaxInput, setAvaxInput] = useState('')

	const [disabledNote, setDisabledNote] = useState(false)

	const mounted = useRef(true)

	const {primaryWallet} = useDynamicContext();

	const closeModal = () => {
		setOpenBorrowModal(false)
		setOpenWithdrawModal(false)
	}

	const handleOpenBorrowModal = (asset) => {
		setOpenBorrowModal(true)
		if (asset === 'MATIC (Mumbai Testnet)') {
			setModalType('mumbai-matic')
		}
		else if (asset === 'AVAX (Fuji Testnet)') {
			setModalType('fuji-avax')
		}
	}
	const handleOpenWithdrawModal = (asset) => {
		setOpenWithdrawModal(true)
		if (asset === 'MATIC (Mumbai Testnet)') {
			setModalType('mumbai-matic')
		}
		else if (asset === 'AVAX (Fuji Testnet)') {
			setModalType('fuji-avax')
		}
	}

	// button to borrow matic
	const borrowMatic = async () => {
		setMaticBorrowDisable(true)
		try {
			let borrow = await publicMumbaiClient.simulateContract({
				address: mumbaiLendingAddress,
				abi: mumbaiLendingABI,
				functionName: 'borrowTokens',
				args: [parseEther(maticInput)]
			})
			await walletMumbaiClient.writeContract(borrow.request).catch((err) => console.log(err))
		} catch (err) {
			console.log(err.message)
		}
		setMaticBorrowDisable(false)
	}

// repay matic
	const repayMatic = async () => {
		setMaticRepayDisable(true)
		try {
			let borrow = await publicMumbaiClient.simulateContract({
				address: mumbaiLendingAddress,
				abi: mumbaiLendingABI,
				functionName: 'repayLoan',
				args: [parseEther(maticInput)]
			})
			await walletMumbaiClient.writeContract(borrow.request).catch((err) => console.log(err))
		}
		catch (err) {
			console.log(err.message)
		}
		setMaticRepayDisable(false)
	}

	// button to borrow avax
	const borrowAvax = async () => {
		setAvaxBorrowDisable(true)
		try {
			let borrow = await publicFujiClient.simulateContract({
				address: fujiLendingAddress,
				abi: fujiLendingABI,
				functionName: 'borrowTokens',
				args: [parseEther(avaxInput)]
			})
			await walletFujiClient.writeContract(borrow.request).catch((err) => console.log(err))
		} catch (err) {
			console.log(err.message)
		}
		setAvaxBorrowDisable(false)
	}

	// button to repay avax
	const repayAvax = async () => {
		setAvaxRepayDisable(true)
		try {
			let borrow = await publicFujiClient.simulateContract({
				address: fujiLendingAddress,
				abi: fujiLendingABI,
				functionName: 'repayLoan',
				args: [parseEther(avaxInput)]
			})
			await walletFujiClient.writeContract(borrow.request).catch((err) => console.log(err))
		} catch (err) {
			console.log(err.message)
		}
		setAvaxRepayDisable(false)
	}

	// load the borrow modal with numbers
	const borrowableDataLoad = async () => {
		if (primaryWallet?.address) {
			let mumbaiBorrowableVal = await publicMumbaiClient.readContract({
				address: mumbaiLendingAddress,
				abi: mumbaiLendingABI,
				functionName: 'getMaxBorrowable',
				args: [primaryWallet?.address]
			}).catch((err) => console.log(err))
			setMaticBorrowable(parseInt(mumbaiBorrowableVal) * 1E-18)

			let mumbaiBorrowBalance = await publicMumbaiClient.readContract({
				address: mumbaiLendingAddress,
				abi: mumbaiLendingABI,
				functionName: 'getBorrowerBalance',
				args: [primaryWallet?.address]
			}).catch((err) => console.log(err))
			setMaticCurrent(parseInt(mumbaiBorrowBalance) * 1E-18)

			let avaxBorrowableVal = await publicFujiClient.readContract({
				address: fujiLendingAddress,
				abi: fujiLendingABI,
				functionName: 'getMaxBorrowable',
				args: [primaryWallet?.address]
			}).catch((err) => console.log(err))
			setAvaxBorrowable(parseInt(avaxBorrowableVal) * 1E-18)

			let avaxBorrowBalance = await publicFujiClient.readContract({
				address: fujiLendingAddress,
				abi: fujiLendingABI,
				functionName: 'getBorrowerBalance',
				args: [primaryWallet?.address]
			}).catch((err) => console.log(err))
			setAvaxCurrent(parseInt(avaxBorrowBalance) * 1E-18)
		}
	}

	// get the balances
	useEffect(() => {
		mounted.current = true
		const dataPull = async () => {
			if (primaryWallet?.address) {
				publicFujiClient.getBalance({address: primaryWallet?.address}).then((res) => {
					if (mounted.current) {
						setAvaxBalance(parseInt(res) * 1E-18)
					}
				}).catch((err) => {
					if (mounted.current) {
						setAvaxBalance(0.)
					}
				})
				publicMumbaiClient.getBalance({address: primaryWallet?.address}).then((res) => {
					if (mounted.current) {
						setMaticBalance(parseInt(res) * 1E-18)
					}
				}).catch((err) => {
					if (mounted.current) {
						setMaticBalance(0.)
					}
				})

				// link price load
				publicMumbaiClient.readContract({
					address: mumbaiLendingAddress,
					abi: mumbaiLendingABI,
					functionName: 'getLatestLinkPrice'
				}).then((res) => {
					if (res) {
						setLinkPrice(parseInt(res) * 1E-8)
					}
				})

				// matic price load
				publicMumbaiClient.readContract({
					address: mumbaiLendingAddress,
					abi: mumbaiLendingABI,
					functionName: 'getLatestMaticPrice'
				}).then((res) => {
					if (res) {
						setMaticPrice(parseInt(res) * 1E-8)
					}
				})

				// fuji price load
				publicFujiClient.readContract({
					address: fujiLendingAddress,
					abi: fujiLendingABI,
					functionName: 'getLatestAvaxPrice'
				}).then((res) => {
					setAvaxPrice(parseInt(res) * 1E-8)
				})
			}
		}

		dataPull()
		borrowableDataLoad()

		return () => {
			mounted.current = false
		}
	}, [primaryWallet?.address, openBorrowModal])

	const getBalanceCell = (asset, val) => {
		if (asset === 'MATIC (Mumbai Testnet)') {
			return maticBalance < 0 ? <CircularProgress size="1.6rem" /> :
				<Typography>{currency(maticBalance, {'pattern': '#', precision: 3}).format()}</Typography>
		}
		else if (asset === 'AVAX (Fuji Testnet)') {
			return avaxBalance < 0 ? <CircularProgress size="1.6rem" /> :
				<Typography>{currency(avaxBalance, {'pattern': '#', precision: 3}).format()}</Typography>
		}
	}

	const getPriceCell = (asset, val) => {
		if (asset === 'MATIC (Mumbai Testnet)') {
			return maticPrice < 0 ? <CircularProgress size="1.6rem" /> :
				<Typography>{currency(maticPrice).format()}</Typography>
		}
		else if (asset === 'AVAX (Fuji Testnet)') {
			return avaxPrice < 0 ? <CircularProgress size="1.6rem" /> :
				<Typography>{currency(avaxPrice).format()}</Typography>
		}
	}

	const columns = [
		{field: 'asset', flex: 2, renderCell: (params) => (
			<Box sx={{display: 'flex', alignItems: 'center'}}>
				{params.row.assetLogo}
				<Typography sx={{ml: 1}}>{params.value}</Typography>
			</Box>
		), renderHeader: (params) => (
			<Box sx={{display: 'flex', flex: 1}}>
				<Typography sx={{fontSize: '0.875rem', fontWeight: 500}}>Asset</Typography>
			</Box>
		)},
		{field: 'price', 'headerName': 'Price', minWidth: 110, renderCell: (params) => (
			<Box sx={{display: 'flex', flex: 1, justifyContent: 'flex-end', mr: '20px'}}>
				{ getPriceCell(params.row.asset) }
			</Box>
		)},
		{field: 'balance', 'headerName': 'Wallet Balance', minWidth: 150, renderCell: (params) => (
			<Box sx={{display: 'flex', flex: 1, justifyContent: 'flex-end', mr: '20px'}}>
				{ getBalanceCell(params.row.asset) }
			</Box>
		), renderHeader: (params) => (
			<Box sx={{display: 'flex', flex: 1, justifyContent: 'flex-end'}}>
				<Typography sx={{fontSize: '0.875rem', fontWeight: 500}}>Wallet Balance</Typography>
			</Box>
		)},
		{field: 'apy', 'headerName': 'APY', minWidth: 90, renderCell: (params) => (
			<Box sx={{display: 'flex', flex: 1, justifyContent: 'flex-end', mr: '20px'}}>
				<Typography>{params.value}%</Typography>
			</Box>
		)},
		{field: 'Action', sortable: false, hideable: false, disableColumnMenu: true, headerName: '',
			width: 80, renderCell: (params) => (
					<Button onClick={() => handleOpenBorrowModal(params.row.asset)}>Deposit</Button>
		)},
		{field: 'Action2', sortable: false, hideable: false, disableColumnMenu: true, headerName: '',
			width: 90, renderCell: (params) => (
					<Button onClick={() => handleOpenWithdrawModal(params.row.asset)}>Withdraw</Button>
		)},
	]


	return (
		<BackgroundBox>
			<Box id='heading' sx={{mx: '20%', mt: 5, display: 'flex'}}>
				<Box sx={{flex: 1}}>
					<Typography color='text.accent' variant='h3'>The Bank</Typography>
					<Typography color='text.secondary'>Put up your assets as collateral to play</Typography>
				</Box>
				<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
					<Box sx={{display: 'flex', alignItems: 'center'}}>
						<Typography variant='h4' sx={{mr: 2}}>Total</Typography>
						<ChainlinkLogo simple={+true} sx={{height: '100%', mr: 1}} />
						<Typography variant='h4'>203,746</Typography>
					</Box>
					<Box sx={{display: 'flex', alignItems: 'center'}}>
						{linkPrice < 0 ? <CircularProgress size='1.6rem'/> : <Typography color='text.secondary'>1 LINK = {currency(linkPrice).format()}</Typography>}
						<Typography color='text.secondary' sx={{mr: 1, ml: 3}}>APY {0.03}%</Typography>
						<Tooltip title={<Typography>Add to the LINK pool and earn interest!</Typography>}>
							<Box><Button sx={{mt: 0.5}} onClick={() => setDisabledNote(true)}>Lend</Button></Box>
						</Tooltip>
					</Box>
				</Box>
			</Box>
			<Box sx={{mx: '20%', my: 5}}>
				<Box sx={{display: 'flex'}}>
					<Paper sx={{flex: 1, p: 2}} elevation={1}>
						<Typography variant='h6'>Borrow LINK</Typography>
						<Box sx={{mt: 3, display: 'flex',}}>
							<Box sx={{flex: 1, display: 'flex', justifyContent: 'center',}}>
								<Box sx={{display: 'flex', flexDirection: 'column'}}>
									<Box sx={{display: 'flex', alignItems: 'center'}}>
										<Box sx={{display: 'flex', alignItems: 'center'}}>
											<PolygonLogo simple={+true} sx={{height: '24px'}}/>
											<Typography variant='h3' sx={{ml: 0.5}}>{maticCurrent}</Typography>
										</Box>
										<Box sx={{ml: 1}}>
											<Typography>Current</Typography>
											<Typography color='text.secondary'>(Mumbai Testnet)</Typography>
										</Box>
									</Box>
									<Box sx={{display: 'flex', alignItems: 'flex-start'}}>
										<TextFieldCurrency sx={{'& .MuiInputBase-input': {padding: '8px'}}}
											handleChange={(e) => setMaticInput(e.target.value)}
											helperText={`Max borrowable: ${maticBorrowable * maticPrice}`}/>
									</Box>
								</Box>
								<Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
									<Button sx={{ml: 4}} disabled={(maticCurrent === 0) || (maticInput === '' || maticRepayDisable)} onClick={() => setDisabledNote(true)}>Repay</Button>
									<Button sx={{ml: 1, mt: 0.5}} onClick={() => setDisabledNote(true)} disabled={maticInput === '' || maticBorrowDisable}>
										Borrow
									</Button>
								</Box>
							</Box>
							<Divider orientation='vertical' flexItem />
							<Box sx={{flex: 1, display: 'flex', justifyContent: 'center',}}>
								<Box sx={{display: 'flex', flexDirection: 'column'}}>
									<Box sx={{display: 'flex', alignItems: 'center'}}>
										<Box sx={{display: 'flex', alignItems: 'center'}}>
											<AvalancheLogo simple={+true} sx={{height: '24px'}}/>
											<Typography variant='h3' sx={{ml: 0.5}}>0</Typography>
										</Box>
										<Box sx={{ml: 1}}>
											<Typography>Current</Typography>
											<Typography color='text.secondary'>(Fuji Testnet)</Typography>
										</Box>
									</Box>
									<Box sx={{display: 'flex', alignItems: 'flex-start'}}>
										<TextFieldCurrency sx={{'& .MuiInputBase-input': {padding: '8px'}}}
											handleChange={(e) => setAvaxInput(e.target.value)}
											helperText={`Max borrowable: ${avaxBorrowable * avaxPrice}`}/>
									</Box>
								</Box>
								<Box sx={{display: 'flex', flexDirection: 'column', mt: 2}}>
									<Button sx={{ml: 4}} disabled={(avaxCurrent === 0) || (avaxInput === '' || avaxRepayDisable)} onClick={() => setDisabledNote(true)}>Repay</Button>
									<Button sx={{ml: 1, mt: 0.5}} disabled={avaxInput === '' || avaxBorrowDisable} onClick={() => setDisabledNote(true)}>
										Borrow
									</Button>
								</Box>
							</Box>
						</Box>
					</Paper>
				</Box>
				<Box sx={{display: 'flex', mt: 2}}>
					<Paper sx={{flex: 1, p: 2}} elevation={1}>
						<Typography variant='h6'>Deposit Collateral</Typography>
						<Box sx={{mt: 3}}>
							<DataGrid rows={dataBorrow} columns={columns} getRowId={(r) => r.asset} hideFooter />
						</Box>
					</Paper>
				</Box>
			</Box>
			{/* <TextField value={inputValue} onChange={handleInputChange}/> */}
			{/* <Button onClick={handleSubmit}>Submit</Button> */}
			<DepositModal
				open={openBorrowModal}
				handleClose={closeModal}
				maticBalance={maticBalance}
				avaxBalance={avaxBalance}
				modalType={modalType} />
			<WithdrawModal
				open={openWithdrawModal}
				handleClose={closeModal}
				modalType={modalType}/>
			<DisabledNoteModal
				open={disabledNote}
				handleClose={() => setDisabledNote(false)}/>

		</BackgroundBox>
	)
}