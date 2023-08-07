// REDUX ACTIONS

// WEB3
export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

// handles TOKEN loading
export function tokenLoaded(contract) {
    return {
        type: 'TOKEN_LOADED',
        contract
    }
}

//EXCHANGE
export function exchangeLoaded(contract) {
    return {
        type: 'EXCHANGE_LOADED',
        contract
    }
}

export function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    }
}

export function filledOrdersLoaded(filledOrders) {
    return {
        type: 'FILLED_ORDERS_LOADED',
        filledOrders
    }
}

export function allOrdersLoaded(allOrders) {
    return {
        type: 'ALL_ORDERS_LOADED',
        allOrders
    }
}

// Cancel Order
export function orderCancelling() {
    return {
        type: 'ORDER_CANCELLING'
    }
}

// Add cancelled orders to the Redux data array when the event is triggered
export function orderCancelled(order) {
    return {
        type: 'ORDER_CANCELLED',
        order
    }
}


// Fill Order
export function orderFilling() {
    return {
        type: 'ORDER_FILLING'
    }
}


export function orderFilled(order) {
    return {
        type: 'ORDER_FILLED',
        order
    }
}

// BALANCES
export function etherBalanceLoaded(balance) {
    return{
        type: 'ETHER_BALANCE_LOADED',
        balance
    }
}

export function tokenBalanceLoaded(balance) {
    return{
        type: 'TOKEN_BALANCE_LOADED',
        balance
    }
}
    
export function exchangeEtherBalanceLoaded(balance) {
    return{
        type: 'EXCHANGE_ETHER_BALANCE_LOADED',
        balance
    }
}

export function exchangeTokenBalanceLoaded(balance) {
    return{
        type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
        balance
    }
}

    
export function balancesLoaded() {
    return{
        type: 'BALANCES_LOADED'
    }
}    
    
    
export function balancesLoading() {
    return{
        type: 'BALANCES_LOADING'
    }
}

export function etherDepositAmountChanged(amount) {
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function tokenDepositAmountChanged(amount) {
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}


export function tokenWithdrawAmountChanged(amount) {
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}



// Buy Orders

export function buyOrderAmountChanged(amount) {     // track amount
    return {
        type: 'BUY_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderPriceChanged(price) {       // track price
    return {
        type: 'BUY_ORDER_PRICE_CHANGED',
        price
    }
}

export function buyOrderMaking(price) {             // Track form submission
    return {
        type: 'BUY_ORDER_MAKING'
    }
}


//Generic Order
export function orderMade(order) {                  // track when the submission finished so subscribe to an event
    return {
        type: 'ORDER_MADE',
        order
    }
}


// Sell Order
export function sellOrderAmountChanged(amount) {     // track amount
    return {
        type: 'SELL_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function sellOrderPriceChanged(price) {       // track price
    return {
        type: 'SELL_ORDER_PRICE_CHANGED',
        price
    }
}

export function sellOrderMaking(price) {             // Track form submission
    return {
        type: 'SELL_ORDER_MAKING'
    }
}