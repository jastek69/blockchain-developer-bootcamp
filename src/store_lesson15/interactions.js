
import Web3 from 'web3'
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoaded,
    allOrdersLoaded
} from './actions'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'

export const loadWeb3 = (dispatch) => {
// const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545')
   const web3 = new Web3(window.ethereum || 'http://localhost:7545')
   dispatch(web3Loaded(web3))
    return web3
}


export const loadAccount = async (web3, dispatch) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = web3.utils.toChecksumAddress(accounts[0])
    
    // const accounts = await web3.eth.getAccounts()
    // const account = accounts[0]
    dispatch(web3AccountLoaded(account))
    return account
}

// export const loadAccount = async (web3, dispatch) => {
//     const Web3 = require("web3");
//     const ethEnabled = async () => {
//     if (window.ethereum) {
//         await window.ethereum.send('eth_requestAccounts');
//         window.web3 = new Web3(window.ethereum);
//         return true;
//     }
//     return false;
//     }
//     const accounts = await web3.eth.getAccounts();
//     console.log("account if it is connecting or not ", accounts)
//     const account = await accounts[0]
//     if(typeof account != 'undefined'){
//         dispatch(web3AccountLoaded(account))
//         return account
//     } else {
//         window.alert('Please login with MetaMask ')
//         return ethEnabled;
//         }
// }

export const loadToken = async (web3, networkId, dispatch) => {
    try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address) 
        dispatch(tokenLoaded(token))
        return token
    } catch(error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.')
      return null  
    }        
}


export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address) 
        dispatch(exchangeLoaded(exchange))
        return exchange
    } catch(error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.')
      return null  
    }        
}


export const loadAllOrders = async(exchange, dispatch) => {
// Fetch cancelled orders with "Cancel" event stream 
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' }) // setting to 'latest' will check entire blockchain 

// Format cancelled orders
    const cancelledOrders = cancelStream.map((event) => event.returnValues)

// Add cancelled orders to the redux store
    dispatch(cancelledOrdersLoaded(cancelledOrders)) // adding to the Redux state

// Fetch filled orders with the "trade" event stream
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })

// Format filled orders
    const filledOrders = tradeStream.map((event) => event.returnValues)

// Add trade orders to the redux store
    dispatch(filledOrdersLoaded(filledOrders)) // adding to the Redux state

// Load order stream -- shows all Orders from Exchange.sol
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })

// Format order stream
    const allOrders = orderStream.map((event) => event.returnValues)

// Add trade orders to the redux store
    dispatch(allOrdersLoaded(allOrders)) // adding to the Redux state
 }