import { useState } from 'react'
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

export default function BasicTabs() {
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [type] = useState('ETH')

  // Supply
  const [tokenSupply, setTokenSupply] = useState(0.0)
  const handleTokenSupply = (event) => {
    setTokenSupply(event.target.value)
  }
  const handleClickMaxTokenSupply = () => {
    console.log(tokenSupply)
  }
  const haddleSupply = () => {
    console.log(tokenSupply)
  }

  // Withdraw
  const [tokenWithdraw, setTokenWithdraw] = useState(0.0)
  const handleTokenWithdraw = (event) => {
    setTokenWithdraw(event.target.value)
  }
  const handleClickMaxTokenWithdraw = () => {
    console.log(tokenWithdraw)
  }
  const haddleWithdraw = () => {
    console.log(tokenWithdraw)
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
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
                    0 ETH
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
                    0 ETH
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
                    0 ETH
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <TabPanel value={value} index={0}>
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
                    Balance: 102 ETH
                  </Typography>
                  <Grid container alignItems='center' spacing={1}>
                    <Grid item>
                      <FormControl disabled>
                        <Select
                          labelId='demo-simple-select-disabled-label'
                          id='demo-simple-select-disabled'
                          value={type}
                        >
                          <MenuItem value='ETH'>ETH</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-token'
                          value={tokenSupply}
                          onChange={handleTokenSupply}
                          startAdornment={
                            <InputAdornment
                              position='end'
                              sx={{ marginLeft: '-10px' }}
                            >
                              <Button
                                variant='text'
                                onClick={handleClickMaxTokenSupply}
                              >
                                MAX
                              </Button>
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>ETH</InputAdornment>
                          }
                          aria-describedby='outlined-token-helper-text'
                          inputProps={{
                            'aria-label': 'token',
                          }}
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
                      <Grid item>0 ETH</Grid>
                    </Grid>
                  </Typography>
                  <Button
                    sx={{ minWidth: '100%' }}
                    variant='contained'
                    onClick={haddleSupply}
                  >
                    Supply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Container>
        </TabPanel>

        <TabPanel value={value} index={1}>
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
                    Balance: 102 ETH
                  </Typography>
                  <Grid container alignItems='center' spacing={2}>
                    <Grid item>
                      <FormControl disabled>
                        <Select
                          labelId='demo-simple-select-disabled-label'
                          id='demo-simple-select-disabled'
                          value={type}
                        >
                          <MenuItem value='ETH'>ETH</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs>
                      <FormControl variant='outlined'>
                        <OutlinedInput
                          id='outlined-adornment-token'
                          value={tokenWithdraw}
                          onChange={handleTokenWithdraw}
                          startAdornment={
                            <InputAdornment
                              position='end'
                              sx={{ marginLeft: '-10px' }}
                            >
                              <Button
                                variant='text'
                                onClick={handleClickMaxTokenWithdraw}
                              >
                                MAX
                              </Button>
                            </InputAdornment>
                          }
                          endAdornment={
                            <InputAdornment position='end'>ETH</InputAdornment>
                          }
                          aria-describedby='outlined-token-helper-text'
                          inputProps={{
                            'aria-label': 'token',
                          }}
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
                      <Grid item>0 ETH</Grid>
                    </Grid>
                  </Typography>
                  <Button
                    sx={{ minWidth: '100%' }}
                    variant='contained'
                    onClick={haddleWithdraw}
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
