import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DoNotDisturbOffIcon from '@mui/icons-material/DoNotDisturbOff'
import Link from '@mui/material/Link'

import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import { injected } from './components/wallet/connectors'
import { ERC20_ABI } from './abi/erc20'
import { AGGREGATOR_V3_INTERFACE_ABI } from './abi/aggregatorV3Interface'

const rinkebyContractAddress = '0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e'
const rinkebyPriceFeedContractAddress =
  '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export default function App() {
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React()

  const rinkebyContract = useMemo(() => {
    return active
      ? new library.eth.Contract(ERC20_ABI, rinkebyContractAddress)
      : null
  }, [library, activate])

  async function connect() {
    try {
      await activate(injected)
    } catch (err) {
      console.error(err)
    }
  }

  async function disconnect() {
    try {
      deactivate()
    } catch (err) {
      console.error(err)
    }
  }

  const hasWeb3 = window.web3

  // Tabs
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  // Dashboard
  const [yourSupplied, setYourSupplied] = useState(0)
  const [totalSupplied, setTotalSupplied] = useState(0)
  const [apy, setApy] = useState(0)
  const getYourSupplied = () => {
    rinkebyContract.methods
      .balanceOfUnderlying(account)
      .call()
      .then((yourSupplied) => {
        setYourSupplied(Number(Web3.utils.fromWei(yourSupplied)))
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const getTotalSupplied = () => {
    rinkebyContract.methods
      .getCash()
      .call()
      .then((totalSupply) => {
        setTotalSupplied(Number(Web3.utils.fromWei(totalSupply)))
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const calculateApy = async () => {
    const RinkebySecPerBlock = 15
    const RinkebyBlockPerSec = 1 / RinkebySecPerBlock
    const BlocksPerDay = 24 * 60 * 60 * RinkebyBlockPerSec
    const DaysPerYear = 365

    const SupplyRatePerBlock =
      (await rinkebyContract.methods.supplyRatePerBlock().call()) / 1e18
    const PercentAPY =
      ((((SupplyRatePerBlock / RinkebyBlockPerSec) * BlocksPerDay + 1) ^
        DaysPerYear) -
        1) *
      100

    setApy(PercentAPY)
  }
  const fetchDashboardInfo = () => {
    getYourSupplied()
    getTotalSupplied()
    calculateApy()
  }

  // Supply, Withdraw
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState('ETH')
  const [tx, setTx] = useState('')
  const getBalance = () => {
    library.eth
      .getBalance(account)
      .then((balance) => {
        setBalance(Number(Web3.utils.fromWei(balance)))
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // Supply
  const [supplyAmount, setSupplyAmount] = useState(0)
  const [supplyAmountCEth, setSupplyAmountCEth] = useState(0)

  const handleSupplyAmount = (event) => {
    const value = Number(event.target.value)
    if (value >= 0) setSupplyAmount(value)
  }
  const handleClickMaxSupplyAmount = () => {
    setSupplyAmount(balance)
  }
  const calculateCEthAmount = async () => {
    if (active) {
      const exchangeRate =
        (await rinkebyContract.methods.exchangeRateCurrent().call()) / 1e18

      const amountWithExchangeRate = (supplyAmount / exchangeRate) * 1e10
      setSupplyAmountCEth(amountWithExchangeRate)
    }
  }
  const disabledSupplyButton = useMemo(() => supplyAmount <= 0, [supplyAmount])
  const haddleSupply = () => {
    const weiValue = Web3.utils.toWei(supplyAmount.toString(), 'ether')
    handleOpenModal()
    setModalState('SUBMITTING')
    rinkebyContract.methods
      .mint()
      .send({ from: account, value: weiValue })
      .then((tx) => {
        setModalState('SUCCEEDED')
        setTx(tx.transactionHash)
        getBalance()
      })
      .catch((err) => {
        console.error(err)
        setModalState('FAILED')
      })
  }

  // Withdraw
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [ethPrice, setEthPrice] = useState(0)

  const handleWithdrawAmount = (event) => {
    const value = Number(event.target.value)
    if (value >= 0) setWithdrawAmount(value)
  }
  const handleClickMaxWithdrawAmount = () => {
    setWithdrawAmount(yourSupplied)
  }

  const disabledWithdrawButton = useMemo(
    () => withdrawAmount <= 0,
    [withdrawAmount]
  )
  const getETHPrice = () => {
    const ethPrice = new library.eth.Contract(
      AGGREGATOR_V3_INTERFACE_ABI,
      rinkebyPriceFeedContractAddress
    )

    ethPrice.methods
      .latestRoundData()
      .call()
      .then((roundData) => {
        setEthPrice(roundData.answer / 1e8)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const haddleWithdraw = async () => {
    handleOpenModal()
    setModalState('SUBMITTING')

    const exchangeRate =
      (await rinkebyContract.methods.exchangeRateCurrent().call()) / 1e18
    const amountOfCEthInWei = Number(
      Web3.utils.toWei(withdrawAmount.toString(), 'ether')
    )
    const amountCEth = amountOfCEthInWei / exchangeRate

    rinkebyContract.methods
      .redeem(amountCEth.toFixed(0))
      .send({ from: account })
      .then((tx) => {
        setModalState('SUCCEEDED')
        setTx(tx.transactionHash)
        getYourSupplied()
      })
      .catch((err) => {
        console.error(err)
        setModalState('FAILED')
      })
  }

  // Modal
  const [modalState, setModalState] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    if (active) {
      fetchDashboardInfo()

      getBalance()
      getETHPrice()
    }
  }, [active])

  useEffect(() => {
    calculateCEthAmount()
  }, [supplyAmount])

  useEffect(() => {
    if (hasWeb3) {
      connect()
    }
  }, [])

  const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }

  return (
    <Container maxWidth='lg'>
      <Modal
        hideBackdrop
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...styleModal }}>
          <h2 id='child-modal-title'>
            {modalState === 'SUBMITTING' && 'Transaction is submitting'}
            {modalState === 'SUCCEEDED' && 'Transaction submitted'}
            {modalState === 'FAILED' && 'Transaction Failed'}
          </h2>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            {modalState === 'SUBMITTING' && <CircularProgress />}
            {modalState === 'SUCCEEDED' && (
              <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />
            )}
            {modalState === 'FAILED' && (
              <DoNotDisturbOffIcon sx={{ fontSize: 48 }} />
            )}
          </Box>
          {modalState === 'SUCCEEDED' && (
            <Box sx={{ m: 1 }}>
              <Link href={`https://rinkeby.etherscan.io/tx/${tx}`}>
                View on Etherscan
              </Link>
            </Box>
          )}
          {(modalState === 'SUCCEEDED' || modalState === 'FAILED') && (
            <Button
              sx={{ minWidth: '100%' }}
              variant='contained'
              onClick={handleCloseModal}
            >
              OK
            </Button>
          )}
        </Box>
      </Modal>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label='basic tabs example'
          >
            <Tab label='Supply' {...a11yProps(0)} />
            <Tab label='Withdraw' {...a11yProps(1)} />
          </Tabs>
        </Box>

        <Box sx={{ marginTop: 3, p: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant='h5' component='div'>
                    Your Supplied
                  </Typography>
                  <Typography variant='body2' component='div'>
                    {yourSupplied} {currency}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant='h5' component='div'>
                    Total Supplied
                  </Typography>
                  <Typography variant='body2' component='div'>
                    {totalSupplied} {currency}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant='h5' component='div'>
                    APY
                  </Typography>
                  <Typography variant='body2' component='div'>
                    {apy} %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <TabPanel value={selectedTab} index={0}>
          <Container maxWidth='xs'>
            <Card sx={{ minWidth: 275, boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ textAlign: 'center' }}
                >
                  Supply
                </Typography>
                <Box component='form' noValidate autoComplete='off'>
                  <Typography
                    variant='body2'
                    component='div'
                    sx={{ textAlign: 'right', marginTop: 4 }}
                  >
                    Balance: {balance} {currency}
                  </Typography>
                  <Grid container alignItems='center' spacing={1}>
                    <Grid item>
                      <FormControl disabled>
                        <Select
                          labelId='demo-simple-select-disabled-label'
                          id='demo-simple-select-disabled'
                          value={currency}
                        >
                          <MenuItem value='ETH'>ETH</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-token'
                          value={supplyAmount}
                          onChange={handleSupplyAmount}
                          startAdornment={
                            <InputAdornment
                              position='end'
                              sx={{ marginLeft: '-10px' }}
                            >
                              <Button
                                variant='text'
                                onClick={handleClickMaxSupplyAmount}
                                disabled={!hasWeb3}
                              >
                                MAX
                              </Button>
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>
                              {currency}
                            </InputAdornment>
                          }
                          aria-describedby='outlined-token-helper-text'
                          inputProps={{
                            'aria-label': 'token',
                          }}
                          disabled={!hasWeb3}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Typography
                    variant='body2'
                    component='div'
                    sx={{ marginTop: 4, marginBottom: 6 }}
                  >
                    <Grid container alignItems='center'>
                      <Grid item xs>
                        Receiving
                      </Grid>
                      <Grid item>{supplyAmountCEth} cETH</Grid>
                    </Grid>
                  </Typography>
                  <Button
                    sx={{ minWidth: '100%' }}
                    variant='contained'
                    onClick={haddleSupply}
                    disabled={disabledSupplyButton}
                  >
                    Supply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Container maxWidth='xs'>
            <Card sx={{ minWidth: 275, boxShadow: 3 }}>
              <CardContent>
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ textAlign: 'center' }}
                >
                  Withdraw
                </Typography>
                <Box component='form' noValidate autoComplete='off'>
                  <Typography
                    variant='body2'
                    component='div'
                    sx={{ textAlign: 'right', marginTop: 4 }}
                  >
                    Deposited: {yourSupplied} {currency}
                  </Typography>
                  <Grid container alignItems='center' spacing={1}>
                    <Grid item>
                      <FormControl disabled>
                        <Select
                          labelId='demo-simple-select-disabled-label'
                          id='demo-simple-select-disabled'
                          value={currency}
                        >
                          <MenuItem value='ETH'>ETH</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-token'
                          value={withdrawAmount}
                          onChange={handleWithdrawAmount}
                          startAdornment={
                            <InputAdornment
                              position='end'
                              sx={{ marginLeft: '-10px' }}
                            >
                              <Button
                                variant='text'
                                onClick={handleClickMaxWithdrawAmount}
                                disabled={!hasWeb3}
                              >
                                MAX
                              </Button>
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>
                              {currency}
                            </InputAdornment>
                          }
                          aria-describedby='outlined-token-helper-text'
                          inputProps={{
                            'aria-label': 'token',
                          }}
                          disabled={!hasWeb3}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Typography
                    variant='body2'
                    component='div'
                    sx={{ marginTop: 4, marginBottom: 6 }}
                  >
                    <Grid container alignItems='center'>
                      <Grid item xs>
                        Receiving
                      </Grid>
                      <Grid item>
                        {withdrawAmount} {currency}
                        <span>
                          {' '}
                          ~ ${(ethPrice * withdrawAmount).toFixed(2)}
                        </span>
                      </Grid>
                    </Grid>
                  </Typography>
                  <Button
                    sx={{ minWidth: '100%' }}
                    variant='contained'
                    onClick={haddleWithdraw}
                    disabled={disabledWithdrawButton}
                  >
                    Withdraw
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </TabPanel>
      </Box>
    </Container>
  )
}
