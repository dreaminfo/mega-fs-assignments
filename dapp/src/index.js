import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import CssBaseline from '@mui/material/CssBaseline'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider)
}

function getRinkebyLibrary() {
  return new Web3(
    'https://rinkeby.infura.io/v3/0b7a01e8b9444344a93356e49a2aca78'
  )
}

const Web3ReactRinkebyProvider = createWeb3ReactRoot('rinkeby')

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactRinkebyProvider getLibrary={getRinkebyLibrary}>
        <App />
      </Web3ReactRinkebyProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
