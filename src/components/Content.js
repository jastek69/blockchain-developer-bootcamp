import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exchangeSelector } from '../store/selectors'
import { loadAllOrders, subscribeToEvents } from '../store/interactions'
import OrderBook from './OrderBook'
import Trades from './Trades' // NOTE: with ES6 Default export same as React so can't use {}  e.g. Component is a named export 
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import NewOrder from './NewOrder'


class Content extends Component {
  componentWillMount() {   
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    const { dispatch, exchange } = props // refactor of this.exchange.props
    await loadAllOrders(exchange, dispatch) // Note: exchange is in the redux store and fetched out with a selector "exchange" - see import above
    await subscribeToEvents(exchange, dispatch)
  }

render() {
    return (
        <div className="content">
            <div className="vertical-split">
              <Balance />  
               
               
              <NewOrder />


              
            </div>
            <OrderBook />
            <div className="vertical-split">
              <PriceChart />
              <MyTransactions />
            </div>
            <Trades />                
          </div>
        )
      }
}

// connect component to redux - in order to get dispatch from the props must add it to the props
function mapStateToProps(state) {
    return {
      exchange: exchangeSelector(state)
     }
  }    
    
export default connect(mapStateToProps)(Content)
   
