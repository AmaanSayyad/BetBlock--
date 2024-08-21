import React from 'react'
import {
	Box,
} from '@mui/material'
import {
	Routes,
	Route
} from 'react-router-dom';
import HomePageHeader from './HomePageHeader'
import HomeLandingPage from './landing/HomeLandingPage'
import HomeAboutPage from './about/HomeAboutPage'
import NotFound from '../common/NotFound';

export default function HomePage({
	...props
}) {
	return (
		<Box sx={{display: 'flex', flexDirection: 'column'}}>
			<HomePageHeader />
			<Routes>
				<Route path='/' exact element={<HomeLandingPage />} />
				<Route path='/about' element={<HomeAboutPage />} />
				<Route path='*' element={<NotFound/>} />
			</Routes>
		</Box>
	)
}