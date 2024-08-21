import React, {useState, useEffect, useRef} from 'react'
import {
	Box,
	Typography,
	InputBase,
	Paper,
	Autocomplete
} from '@mui/material';
import LeaderboardTable from './LeaderboardTable'
import ArtGallery from '../../home/landing/ArtGallery'
import {styled, alpha} from '@mui/material/styles';
import { isAddress } from 'viem'
import {normalize} from 'viem/ens'
import {useNavigate} from 'react-router-dom'
import {publicMainnetClient} from '../ViemClient'

const BackgroundBox = styled(Box)(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 70%)`
}))

const SearchField = styled(InputBase)(({theme}) => ({
  borderRadius: 100,
  border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
  color: alpha(theme.palette.text.primary, 0.7),
  backgroundColor: theme.palette.dark.card,
  '&:hover': {
    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
    color: theme.palette.text.primary,
  }, 
  '& .MuiInputBase-input': {
    padding: '4px 12px'
  }
}))

export default function CommunityHome({
	...props
}) {

	const [searchInput, setSearchInput] = useState('')
	const [searchOptions, setSearchOptions] = useState([])
	const [searchOpen, setSearchOpen] = useState(false)
	const [searchLoading, setSearchLoading] = useState(false)

	let navigate = useNavigate()

	let timerId = useRef(null);

	const handleChange = (newValue) => {
		navigate('/profile/' + newValue.address)
	}

  useEffect(() => {
    let active = true;

    const handleInputChange = async () => {
			if (!searchInput || searchInput === '') {
				setSearchOptions([])
				return
			}

			clearTimeout(timerId.current);
			setSearchLoading(true)
			setSearchOptions([])
			timerId.current = setTimeout(async() => {
				setSearchLoading(true)
				if (isAddress(searchInput)) {
					setSearchOptions([{name: searchInput, address: searchInput}])
				}
				else {
					let newValLower = searchInput.toLowerCase();
					if (!newValLower.endsWith('.')) {
						let ensAttempt = newValLower.endsWith('.eth') ? newValLower : (newValLower + '.eth')

						await publicMainnetClient.getEnsAddress({name: normalize(ensAttempt)}).then((res) => {
							if (res) {
								setSearchOptions([{name: ensAttempt, address: res}])
							}
							else {
								setSearchOptions([])
							}
						}).catch((err) => {
							console.error('Error fetching ENS address:', err);
							setSearchOptions([]);
						})
					}
				}
				setSearchLoading(false)
			}, 500)
		}

    if (active) {
      handleInputChange()
    }
    return () => {
      active = false
    }
  }, [searchInput])

	return (
		<BackgroundBox sx={{mt: 5, pb: 10}}>
			<Box sx={{width: '50%'}}>
				<Autocomplete
					value={null}
					open={searchOpen}
					onOpen={() => setSearchOpen(true)}
					onClose={() => setSearchOpen(false)}
					options={searchOptions}
					filterOptions={(x) => x}
					getOptionLabel={(x) => x.name}
					noOptionsText="No address result"
					loading={searchLoading}
					onChange={(e, newValue) => {handleChange(newValue)}}
					onInputChange={(e, newInputVal) => {setSearchInput(newInputVal)}}
					renderInput={(params) => {
						return (
							<Box ref={params.InputProps.ref}>
							<SearchField
								fullWidth
								inputProps={{...params.inputProps}}
								placeholder='Search address or ENS of player' />
							</Box>
						)}
					}
					renderOption={(props, option) => {
            return (
              <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                <Typography sx={{ml: 1}}>{option.name}</Typography>
              </Box>
              )}}/>
			</Box>

			<Box sx={{height: '400px', minWidth: '55rem', mt: 4}}>
				<Typography variant='h6' sx={{ml: 4}}>Featured Profiles</Typography>
				<ArtGallery/>
			</Box>
			<Paper elevation={1} sx={{mt: '24px', width: '50%', minHeight: '500px', zIndex: 5}}>
				<Box sx={{display: 'flex', mx: 2, mt: 4}}>
					<Typography variant='h6'>Leaderboard</Typography>
				</Box>
				<Box sx={{m: 1}}>
					<LeaderboardTable/>
				</Box>
			</Paper>
		</BackgroundBox>
	)
}