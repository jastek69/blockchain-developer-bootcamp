// Reducers - Redux Store -- handles actions; the form changing

import { findIndex } from 'lodash';
import { combineReducers } from 'redux'; 

function web3(state =  {}, action) {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    case 'ETHER_BALANCE_LOADED':
      return { ...state, balance: action.balance }
    default:
      return state
  }
}


function token(state = {}, action) {
  switch (action.type) {
    case 'TOKEN_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'TOKEN_BALANCE_LOADED':
      return { ...state, balance: action.balance }
    default:
      return state
  }
}

function exchange(state = {}, action) {
  let index, data

  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'CANCELLED_ORDERS_LOADED':
      return { ...state, cancelledOrders: { loaded: true, data: action.cancelledOrders } }
    case 'FILLED_ORDERS_LOADED':
      return { ...state, filledOrders: { loaded: true, data: action.filledOrders } }
    case 'ALL_ORDERS_LOADED':
      return { ...state, allOrders: { loaded: true, data: action.allOrders } }
    case 'ORDER_CANCELLING' :
      return { ...state, orderCancelling: true }
    case 'ORDER_CANCELLED': // Adding cancelled order to array
      return{
        ...state,
        orderCancelling: false,
        cancelledOrders: {
          ...state.cancelledOrders,
          data:[
            ...state.cancelledOrders.data,
            action.order
          ]          
        }
      } 
    case 'ORDER_FILLED':
      // Prevent duplicate orders
      index = state.filledOrders.data.findIndex(order => order.id === action.order.id)

      if(index === -1) {
        data = [...state.filledOrders.data, action.order]
      } else {
        data = state.filledOrders.data
      }

      return {
        ...state,
        orderFilling: false,
        filledOrders: {
          ...state.filledOrders,
          data
        }
      }

    case 'ORDER_FILLING':
      return { ...state, orderFilling: true }
    
  //BALANCES 
    case 'EXCHANGE_ETHER_BALANCE_LOADED':
      return { ...state, etherBalance: action.balance }
          
    case 'EXCHANGE_TOKEN_BALANCE_LOADED':
      return { ...state, tokenBalance: action.balance }  
  
    case 'BALANCES_LOADING':
      return { ...state, balancesLoading: true }    // when we call BALANCES_LOADING we set balancesLoading to true
        
    case 'BALANCES_LOADED':                         // The selector is looking for balancesLoading 
      return { ...state, balancesLoading: false }   // BALANCES_LOADED is called when the balances are loaded, so set to false
    
    case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
      return { ...state, etherDepositAmount: action.amount }

    case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
      return { ...state, etherWithdrawAmount: action.amount }

    case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
      return { ...state, tokenDepositAmount: action.amount }
  
    case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
      return { ...state, tokenWithdrawAmount: action.amount }

    case 'BUY_ORDER_AMOUNT_CHANGED':
      return { ...state, buyOrder: { ...state.buyOrder, amount: action.amount } }
    
    case 'BUY_ORDER_PRICE_CHANGED':
      return { ...state, buyOrder: { ...state.buyOrder, price: action.price} }  

    case 'BUY_ORDER_MAKING':
      return { ...state, buyOrder: { ...state.buyOrder, amount: null, price: null, making: true } }   // Clear out data to make an order so making is true

    case 'ORDER_MADE':
      // Prevent duplicate order
      index = state.allOrders.data.findIndex(order => order.id === action.order.id);

      if(index === -1) {
        data = [...state.allOrders.data, action.order]
      } else {
          data = state.allOrders.data
      }

      return {
        ...state,
        allOrders: {
          ...state.allOrders,
          data
        },
       buyOrder: {
          ...state.buyOrder,
         making: false
        },
        sellOrder: {
          ...state.sellOrder,
          making: false
        }
      }


    case 'SELL_ORDER_AMOUNT_CHANGED':
      return { ...state, sellOrder: { ...state.sellOrder, amount: action.amount } }
    
    case 'SELL_ORDER_PRICE_CHANGED':
      return { ...state, sellOrder: { ...state.sellOrder, price: action.price} }  

    case 'SELL_ORDER_MAKING':
      return { ...state, sellOrder: { ...state.sellOrder, amount: null, price: null, making: true } }   // Clear out data to make an order so making is true



    default:
      return state
  }
}


const rootReducer = combineReducers({
    web3,
    token,
    exchange
})

export default rootReducer