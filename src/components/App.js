import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux'
import { 
        loadWeb3,
        loadAccount,
        loadToken,
        loadExchange } from '../store/interactions'
import { contractsLoadedSelector } from '../store/selectors'


class App extends Component {
 componentWillMount() {   
   this.loadBlockchainData(this.props.dispatch)
 }
 
 async loadBlockchainData(dispatch) {
  const web3 = loadWeb3(dispatch)
  // const web3 = new Web3(window.ethereum)
  const networkId = await web3.eth.net.getId()
  await loadAccount(web3, dispatch)
  const token = await loadToken(web3, networkId, dispatch)
  if(!token) {
    window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
    return 
  }
 // console.log("token", token)
  
  const exchange = await loadExchange(web3, networkId, dispatch)
  if(!exchange) {
    window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
    return
  }
} //async close

  
  render() {
        return (
        <div>
         <Navbar />
         { this.props.contractsLoaded ? <Content /> : <div className="content"></div> }
        </div>
      );
    }
  } // Class close
  
  // connect component to redux - in order to get dispatch from the props must add it to the props
 function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state)
    }
 }

 export default connect(mapStateToProps)(App);
