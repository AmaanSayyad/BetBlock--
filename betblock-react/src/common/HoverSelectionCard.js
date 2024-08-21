import {
	Typography,
	Card,
	CardContent,
	Link,
} from '@mui/material';
import {styled} from '@mui/material/styles';

const HoverCard = styled(Card, {
	shouldForwardProp: (props) => props !== 'disabled'})(({theme, disabled}) => ({
	border: '1px solid transparent',
	'&:hover': {
		...(!disabled && {backgroundColor: theme.palette.action.hover}),
		cursor: disabled ? 'not-allowed' : 'pointer',
	}
}))

const LinkWrapper = ({condition, href, children}) => {
	return (
		condition ?
		<Link sx={{textDecoration: 'none'}} href={href}>
			{children}
		</Link> : children
	)
}

export default function HoverSelectionCard({
	heading,
	subheading,
	href,
	disabled = false,
	...props
}) {
	return (
		<LinkWrapper condition={!disabled && href} href={href}>
			<HoverCard disabled={disabled}>
				<CardContent sx={{width: '100%'}}>
					{subheading && <Typography color="text.secondary" gutterBottom>{subheading}</Typography>}
					{heading && <Typography variant="h5" color={disabled ? 'text.disabled' :"text.accent"}>{heading}</Typography>}
					{props.children}
				</CardContent>
			</HoverCard>
		</LinkWrapper>
	)
}