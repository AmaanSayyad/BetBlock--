import React from 'react'
import {
	Box
} from '@mui/material/'
import {
	Routes,
	Route,
	Navigate,
	useLocation
} from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import AppLandingPage from './landing/AppLandingPage';
import BankHome from './bank/BankHome';
import GameSelection from './games/GameSelection';
import GameRoulette from './games/GameRoulette';
import ProfileSingle from './profile/ProfileSingle';
import CommunityHome from './community/CommunityHome';
import NotFound from '../common/NotFound';

export default function AppPageBody ({
	...props
}) {

	let location = useLocation();

  const { user } = useDynamicContext();

    // wrapper for authentication, or protected pages
  const AuthWrapper = ({children}) => {
    if (!user) {
      return (
          <Navigate to="/" state={{from: location}} replace={true}/>
      )
    }
    return children
  }

	return (
		<Box sx={{mt: '80px'}}>
			<Routes>
				<Route path={'/'} element={<AppLandingPage />}/>
				<Route path={'/bank'} element={<AuthWrapper><BankHome/></AuthWrapper>}/>
				<Route path={'/games'} element={<AuthWrapper><GameSelection/></AuthWrapper>}/>
				<Route path={'/games/roulette/'} element={<AuthWrapper><GameRoulette/></AuthWrapper>}/>

				<Route path={'/community'} element={<AuthWrapper><CommunityHome/></AuthWrapper>}/>
				<Route path={'/profile/:address'} element={<AuthWrapper><ProfileSingle/></AuthWrapper>}/>
				
				<Route path='*' element={<AuthWrapper><NotFound/></AuthWrapper>} />
			</Routes>
		</Box>
	)
}