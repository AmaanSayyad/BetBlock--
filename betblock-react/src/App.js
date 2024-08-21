import React from 'react'
import {muiStyles} from './MUIStyles'
import HomePage from './home/HomePage';
import AppPage from './app/AppPage';
import Footer from './footer/Footer';
import axios from 'axios'
import {BrowserRouter} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const parseSubdomain = () => {
  // work with subdomains here
  let parts = window.location.hostname.split('.');
  if (parts[0] === 'www') {
    parts = parts.slice(1)
  }
  const subdomain = parts[0] === 'app' ? parts[0] : null;
  return subdomain
}

export default function App() {
  let extractedDomain = parseSubdomain()
  let theme = createTheme(muiStyles['dark'])

  let root = document.getElementById('root');
  root.style.color = theme.palette.text.primary
  root.parentNode.style.color = theme.palette.text.primary
  root.parentNode.style.backgroundColor = theme.palette.dark.bg

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {extractedDomain ? <AppPage/> : <HomePage/>}
        <Footer/>
      </ThemeProvider>
    </BrowserRouter>
  );
}