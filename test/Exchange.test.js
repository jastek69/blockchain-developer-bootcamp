import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers'

const Token = artifacts.require('./Token')
const Exchange = artifacts.require('./Exchange')


require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {  // ACCOUNTS
	let token
	let exchange
	const feePercent = 10

	beforeEach(async() => {
	  // Deploy tokens
	  token = await Token.new()

	  // Transfer some tokens to user1
	  token.transfer(user1, tokens(100), { from: deployer })

	  // Deploy exchange
	  exchange = await Exchange.new(feeAccount, feePercent)
	})

	describe('deployment', () => {
		it('tracks fee account', async () => {
		const result = await exchange.feeAccount()
		result.should.equal(feeAccount)
		})  

		it('tracks the fee percent', async () => {
		const result = await exchange.feePercent()
		result.toString().should.equal(feePercent.toString())	
  		}) 
	}) //describe deployment


	describe('fallback', () => {
		it('reverts when Ether is sent', async () => {
			await exchange.sendTransaction({ value: 1, from: user1 }).should.be.rejectedWith(EVM_REVERT)
		})
	}) // describe fallback


	describe('depositing Ether', async () => {
		let result
		let amount

		beforeEach(async () => {
			amount  = ether(1)
			result = await exchange.depositEther({ from: user1, value: amount})	
		})

		it('tracks the Ether deposit', async() => {
			const balance = await exchange.tokens(ETHER_ADDRESS, user1)
			balance.toString().should.equal(amount.toString())
		})

		it('emits a Deposit event', async() => {
			// console.log(result.logs)
			const log = result.logs[0]
			log.event.should.eq('Deposit')
			const event = log.args
			event.token.should.equal(ETHER_ADDRESS, 'token is correct')
			event.user.should.equal(user1, 'user address is correct')
			event.amount.toString().should.equal(amount.toString(), 'amount is correct')
			event.balance.toString().should.equal(amount.toString(), 'balance is correct')
		  }) // deposit event
	}) // depositing ether

	describe('withdrawing Ether', async () => {
		let result
		// refactor ether(1) to amount
		let amount
	
		beforeEach(async () => {
			// Deposit Ether first
			amount = ether(1)
			await exchange.depositEther({ from: user1, value: amount })
		})

		describe('success', async () => {
			beforeEach(async () => {
			// Withdraw Ether
			result = await exchange.withdrawEther(amount, { from: user1})
			})

			it('withdraws Ether funds', async () => {
				const balance = await exchange.tokens(ETHER_ADDRESS, user1)
				balance.toString().should.equal('0')
			})	

			it('emits a "Withdraw" event', async () => {
			const log = result.logs[0]
			log.event.should.eq('Withdraw')
			const event = log.args
			event.token.should.equal(ETHER_ADDRESS)
			event.user.should.equal(user1)
			event.amount.toString().should.equal(amount.toString())
			event.balance.toString().should.equal('0')
		  	})

		}) // describe success

		describe('failure', async () => {
			it('rejects withdraws for insufficient balances', async () => {
				await exchange.withdrawEther(ether(100), {from : user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	}) // withdrawing ether
	

	describe('depositing tokens', () => {
		let result
		let amount

		describe('success', () => {
			beforeEach(async () => {
				amount = tokens(10)
				await token.approve(exchange.address, amount, { from: user1 })
				result = await exchange.depositToken(token.address, amount, { from: user1 })
				})

			it('tracks the token deposit', async () => {
				// Check exchange Token balance
				let balance
				balance = await token.balanceOf(exchange.address)
				balance.toString().should.equal(amount.toString())
				// Check tokens on exchange
				balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal(amount.toString())
				})

			 it('emits a Deposit event', async() => {
				// console.log(result.logs)
				const log = result.logs[0]
				log.event.should.eq('Deposit')
				const event = log.args
				event.token.should.equal(token.address, 'token is correct')
				event.user.should.equal(user1, 'user address is correct')
				event.amount.toString().should.equal(amount.toString(), 'amount is correct')
				event.balance.toString().should.equal(amount.toString(), 'balance is correct')
			  })
		}) // success
	
			describe('failure', () => {
				it('rejects Ether deposits', async () => {
					await exchange.depositToken(ETHER_ADDRESS, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
				})

				it('fails when no tokens are approved', async () => {
					// Don't approve any tokens before depositing
					await exchange.depositToken(token.address, tokens(10), { from: user1}).should.be.rejectedWith(EVM_REVERT)
				})
		   })
	}) // depositing tokens


	describe('withdrawing tokens', async () => {
		let result
		let amount

		describe('success', async () => {
			beforeEach(async () => {
				// Deposit tokens first
				amount = tokens(10)
				await token.approve(exchange.address, amount, { from: user1 })
				await exchange.depositToken(token.address, amount, { from: user1 })

				// Withdraw tokens
				result = await exchange.withdrawToken(token.address, amount, { from: user1 })
			})

			it('withdraws token funds', async () => {
				const balance = await exchange.tokens(token.address, user1)
				balance.toString().should.equal('0')			
			})

			it('emits a "Withdraw" event', async () => {
				const log = result.logs[0]
				log.event.should.eq('Withdraw')
				const event = log.args
				event.token.should.equal(token.address)
				event.user.should.equal(user1)
				event.amount.toString().should.equal(amount.toString())
				event.balance.toString().should.equal('0')
			  	})
			})

		describe('failure', async () => {
			it('rejects for Ether withdraws', async () => {
				// Attempt to withdraw tokens without depositing any first
				await exchange.withdrawToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
			
			it('fails for insufficient balances', async () => {
				// Attempt to withdraw tokens without depositing any first
				await exchange.withdrawToken(token.address, tokens(10), { from: user1 }).should.be.rejectedWith(EVM_REVERT)
			})
		})
	}) // withdraw tokens

	
	describe('checking balances', () => {
   		beforeEach(async () => {
    	await exchange.depositEther({ from: user1, value: ether(1) })
   		})

   		it('returns user balance', async () => {
     	const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
     	result.toString().should.equal(ether(1).toString())
   		})
  	}) // checking balances

  	describe('making orders', async () => {
  		let result

  		beforeEach(async () => {
  			result = await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
  		})

  		it('tracks the newly created order', async () => {
  		const orderCount = await exchange.orderCount()
  		orderCount.toString().should.equal('1')
  		const order = await exchange.orders('1')
  		order.id.toString().should.equal('1', 'id is correct')
  		order.user.should.equal(user1, 'user is correct')
  		order.tokenGet.should.equal(token.address, 'token is correct')
  		order.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
  		order.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
  		order.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
  		order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
  		})
		  
		it('emits an "Order" event', () => {
		const log = result.logs[0]
		log.event.should.eq('Order')
		const event = log.args
		event.id.toString().should.equal('1', 'id is correct')
		event.user.should.equal(user1, 'user is correct')
		event.tokenGet.should.equal(token.address, 'tokenGet is correct')
		event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
		event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
		event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
		event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
		 })
  	}) // making order

	  
  	describe('order actions', () => {

  	 	beforeEach(async () => {
  	 		// user1 deposits ether only
  	 		await exchange.depositEther({ from: user1, value: ether(1) })
  	 		//give tokens to user2
  	 		await token.transfer(user2, tokens(100), { from: deployer })
  	 		// user2 deposits tokens only
  	 		await token.approve(exchange.address, tokens(2), { from: user2 })
  	 		await exchange.depositToken(token.address, tokens(2), {from: user2 })	
  	 		// user1 makes an order to buy tokens from Ether
  	 		await exchange.makeOrder(token.address, tokens(1), ETHER_ADDRESS, ether(1), { from: user1 })
  	 	}) // deposit ether

  	 	describe('filling orders', async () => {
  	 		let result

  	 		describe('success', () => {
  	 			beforeEach(async () => {
  	 				// user2 filles order
  	 				result = await exchange.fillOrder('1', { from: user2 })
  	 			})

  	 		it('executes the trade & charges fees', async () => {
  				let balance
  	 			balance = await exchange.balanceOf(token.address, user1)
  	 			balance.toString().should.equal(tokens(1).toString(), 'user1 received tokens')
  	 			balance = await exchange.balanceOf(ETHER_ADDRESS, user2)
  	 			balance.toString().should.equal(ether(1).toString(), 'user2 received Ether')
  	 			balance = await exchange.balanceOf(ETHER_ADDRESS, user1)
  	 			balance.toString().should.equal('0', 'user1 Ether deducted')
  	 			balance = await exchange.balanceOf(token.address, user2)
  	 			balance.toString().should.equal(tokens(0.9).toString(), 'user2 tokens deducted with fee applied')
  	 			const feeAccount = await exchange.feeAccount()
  	 			balance = await exchange.balanceOf(token.address, feeAccount)
  	 			balance.toString().should.equal(tokens(0.1).toString(), 'feeAccount received fee')
  	 		}) // fees

  	 		it('updates filled orders', async () => {
  	 			const orderFilled = await exchange.orderFilled(1)
  	 			orderFilled.should.equal(true)
  	 		})

  	 		it('emits a "Trade" event', async () => {
  	 			const log = result.logs[0]
  	 		 	log.event.should.eq('Trade')
  	 		 	const event = log.args

				console.log(event.id.toString())
				event.id.toString().should.equal('1', 'id is correct')
				console.log(event.user)
	 	  	 	event.user.should.equal(user1, 'user is correct')
				console.log(event.tokenGet)
		  	 	event.tokenGet.should.equal(token.address, 'tokenGet is correct')
				console.log(event.amountGet.toString())
				event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
				console.log(event.tokenGive)
	 	  	 	event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
				console.log(event.amountGive.toString())	
	 	  	 	event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
				console.log(event.userFill)	
	 	  	 	event.userFill.should.equal(user2, 'userFill is correct')
				console.log(event.timestamp.toString())	
	 	  		event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
  	 		 })
  	 		}) // success

  	 		describe('failure', async () => {

  				it('rejects invalid order ids', async () => {
  	 				const invalidOrderId = 99999
  	 				await exchange.fillOrder(invalidOrderId, { from: user2 }).should.be.rejectedWith(EVM_REVERT)
  	 			})

  	 			it('rejects	already-filled orders', async () => {
  	 				// Fill the order
  	 				await exchange.fillOrder('1', { from: user2 }).should.be.fulfilled
  	 				// Try to fill the order
  					await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)	
  	 			})

				it('rejects cancelled orders', async () => {
					// Cancel the order
					await exchange.cancelOrder('1', { from: user1 }).should.be.fulfilled
					// Try to fill the order
					await exchange.fillOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
				})				   
  	 		}) // failure
  	 	}) // filling orders

  	 	describe('cancelling orders', () => {
  	 		let result

  	 		describe('success', async () => {
  	 			beforeEach(async () => {
  	 				result = await exchange.cancelOrder('1', { from: user1 })
  	 			})

  	 		it('updates cancelled orders', async () => {
  	 			const orderCancelled = await exchange.orderCancelled(1)
  	 			orderCancelled.should.equal(true)
  	 			})

  	 		it('emits a "Cancel" event', () => {
  	 			const log = result.logs[0]
  	 			log.event.should.eq('Cancel')
  	 			const event = log.args
  	 			event.id.toString().should.equal('1', 'id is correct')
	 	  		event.user.should.equal(user1, 'user is correct')
	 	  		event.tokenGet.should.equal(token.address, 'token is correct')
	 	  		event.amountGet.toString().should.equal(tokens(1).toString(), 'amountGet is correct')
	 	  		event.tokenGive.should.equal(ETHER_ADDRESS, 'tokenGive is correct')
	 	  		event.amountGive.toString().should.equal(ether(1).toString(), 'amountGive is correct')
	 	  		event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
  	 		})	  					
  	 		}) // success

  	 		describe('failure', ()=> {
  	 			it('rejects invalid order ids', () => {
  	 				const invalidOrderId = 99999
  	 				exchange.cancelOrder(invalidOrderId, {from: user1 }).should.be.rejectedWith(EVM_REVERT)
  	 			})

  	 			it('rejects unauthorized cancellations', async () => {
  	 				// Try to cancel the order from another user
  	 				await exchange.cancelOrder('1', { from: user2 }).should.be.rejectedWith(EVM_REVERT)
  	 			})
  	 		}) // describe failure
  	 	}) // cancelling orders
  	 }) // order actions 
})