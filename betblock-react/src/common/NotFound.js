import { Box } from '@mui/material'
import {styled} from '@mui/material/styles';
import {NotFoundAnimation} from '../lottie/LottieWraps'

const BackgroundBox = styled(Box)(({theme}) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	background: `radial-gradient(ellipse at 50% 50%, ${theme.palette.bg.primary} 20%, transparent 70%)`
}))

export default function NotFound({...props}) {
	return (
		<BackgroundBox sx={{my: 10}}>
			<Box sx={{maxWidth: '750px'}}>
				<NotFoundAnimation/>
			</Box>
		</BackgroundBox>
	)
}