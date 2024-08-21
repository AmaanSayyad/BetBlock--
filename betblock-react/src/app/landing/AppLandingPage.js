import React from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import DynamicAuth from './DynamicAuth'
import AppLandingPost from './AppLandingPost'

export default function AppLandingPage ({
	...props
}) {
	const {user} = useDynamicContext();

	return (
		user ? <AppLandingPost/> : <DynamicAuth />
	)
}