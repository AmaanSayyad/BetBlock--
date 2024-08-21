import React from 'react'
import {
	Link as RouterLink,
} from 'react-router-dom';

const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

export const muiStyles = {
	dark: {
		components: {
			MuiLink: {
				defaultProps: {
					component: LinkBehavior,
				}
			},
			MuiButtonBase: {
      	defaultProps: {
        	LinkComponent: LinkBehavior,
      	},
    	},
		},
		palette: {
			// generally we want white
			primary: {
				main: '#fff',
				main1: '#8c8fdf',
				main2: '#c59df2',
				main3: '#ef7c71',
				gradient: 'linear-gradient(90deg, #681DDB 0%, #D82633 100%)',
			},
			dark: {
				bg: '#121212',
				card: '#282828',
				button: '#3f3f3f',
				navbar: '#575757',
				modal: '#717171',
				bgText: '#8b8b8b'
			},
			accent: { // purple
				main: '#c59df2',
				dark: '#681ddb',
				light: '#b486ed'
			},
			accent2: { // red
				main: '#ef7c71',
				dark: '#d82633',
				light: '#f9a89e'
			},
			accent3: { // blue
				main: '#8c8fdf',
				dark: '#465CCD',
				light: '#b4b3ea'
			},
			// the actual dark background
			bg: {
				light: '#1a1a1a',
				main: '#131319',
				primary: '#330e6d'
			},
			text: {
				focus: '#fff',
				accent: '#c59df2',
			},
			game: {
				green: '#14D854',
				red: '#d82633'
			},
			mode: 'dark'
		},
		typography: {
		  fontFamily: 'Roboto',
		  color: '#fff'
		}
	},
}
/*
Chainlink 465CCD - #606cd3 - #777dd9 - #8c8fdf - #a0a1e5 - #b4b3ea
Polygon 681DDB - #7e3ce0 - #9155e5 - #a36ee9 - #b486ed - #c59df2 
Avalanche D82633 - #e14947 - #e8645c - #ef7c71 - #f59287 - #f9a89e
*/