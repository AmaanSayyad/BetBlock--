import React, {useState} from 'react'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import AppPageBody from './AppPageBody'
import AppPageHeader from './AppPageHeader'
import Alert from '../common/Alert'

const evmNetworks = [
  {
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
    chainId: 43113,
    chainName: 'Avalanche Fuji',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/avax.svg"],
    name: 'Avalanche Fuji',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'AVAX',
    },
    networkId: 43113,
    rpcUrls: ['https://avalanche-fuji.drpc.org/'],    
    vanityName: 'Avalanche Fuji',
  },
]

export default function AppPage({...props}) {
  // for the alert snackbar that pops up going through authentication
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  return (
    <DynamicContextProvider 
    settings={{
    theme: 'dark',
    environmentId: process.env.REACT_APP_DYNAMIC_ENV_ID,
    multiWallet: true,
    walletConnectors: [EthereumWalletConnectors],
    siweStatement: "Hi there and welcome to betblock! Signing is free (no gas fees), and is required to verify that you are the owner of the connected wallet.",
    eventsCallbacks: {
      onLinkSuccess: (args) => {
        setAlertOpen(true)
        setAlertMessage('Successfully linked wallet')
      },
      onAuthSuccess: (args) => {
        setAlertOpen(true)
        setAlertMessage('Successfully signed in! Welcome')
      },
      onLogout: (args) => {
        setAlertOpen(true)
        setAlertMessage('Successfully logged out. See you again soon')
      },
      onUnlinkSuccess: (args) => {
        setAlertOpen(true)
        setAlertMessage('Successfully unlinked wallet')
      }},
    evmNetworks
    }}>
      <AppPageHeader />
      <AppPageBody />
      <Alert open={alertOpen} setOpen={setAlertOpen} alertMessage={alertMessage} />
    </DynamicContextProvider>
  )
}