import { tokens, EVM_REVERT } from './helpers'

const Token = artifacts.require('./Token')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Token', ([deployer, receiver, exchange]) => {  // ACCOUNTS
	const name = 'Unicorn Token'
	const symbol = 'UNI'
	const decimals = '18'
	const totalSupply = tokens(1000000).toString()
	let token

	beforeEach(async() => {
	  token = await Token.new()	
	})

describe('deployment', () => {
	it('tracks the name', async () => {
		const result = await token.name()
		result.should.equal(name)
		// Fetch token from blockchain
		// Read token name here ...
		// The token name is 'My Name'
	})

	it('tracks the symbol', async () => {
		const result = await token.symbol()
		result.should.equal(symbol)
	})

	it('tracks the decimals', async () => {
		const result = await token.decimals()
		result.toString().should.equal(decimals)
	})
	

	it('tracks the total supply', async() => {
		const result = await token.totalSupply()
		result.toString().should.equal(totalSupply.toString())
	})

	it('assigns the total supply to the deployer', async () => {
		const result = await token.balanceOf(deployer)
		result.toString().should.equal(totalSupply.toString())
	}) // assign  
 })
	
describe('sending tokens', () => {
	let result
	let amount

describe('success', () => {	
	beforeEach(async() => {
		amount = tokens(100)
		result = await token.transfer(receiver, amount, { from: deployer })
	})

  	it('transfers token balances', async () => {
  		let balanceOf  		
		balanceOf = await token.balanceOf(deployer)
		balanceOf.toString().should.equal(tokens(999900).toString())
		balanceOf = await token.balanceOf(receiver)
		balanceOf.toString().should.equal(tokens(100).toString())
	}) // describer transfer
  		
  	it('emits a Transfer event', async() => {
  		// console.log(result.logs)
  		
  		const log = result.logs[0]
  		log.event.should.eq('Transfer')
  		const event = log.args
  		event.from.toString().should.equal(deployer, 'from is correct')
  		event.to.should.equal(receiver, 'to is corect')
  		event.value.toString().should.equal(amount.toString(), 'value is correct')
  	  })
  	})
})

describe('approving tokens', () => {
	let result
	let amount

	beforeEach(async () => {
		amount = tokens(100)
		result = await token.approve(exchange, amount, { from: deployer })
	})

	describe('success',() => {
		it('allocates an allowance for delegated token spending on an exchange', async() => {
			const allowance = await token.allowance(deployer, exchange)
			allowance.toString().should.equal(amount.toString())
	  }) // allocates function

	it('emits an Approval event', async() => {
  		const log = result.logs[0]
  		log.event.should.eq('Approval')
  		const event = log.args
  		event.owner.toString().should.equal(deployer, 'owner is correct')
  		event.spender.should.equal(exchange, 'spender is corect')
  		event.value.toString().should.equal(amount.toString(), 'value is correct')
  	  })

	}) //success		

	describe('failure', () => {
		it('rejects invalid spenders', async() => {
			await token.approve(0x0, amount, { from: deployer }).should.be.rejected
		})
	}) // failure
}) //approving


describe('delegated token transfers', () => {
	let result
	let amount

	beforeEach(async () => {
		amount = tokens(100)
		await token.approve(exchange, amount, { from: deployer })
	})

describe('success', async () => {	
	beforeEach(async () => {
		result = await token.transferFrom(deployer, receiver, amount, { from: exchange })
	})

  	it('transfers token balances', async () => {
  		let balanceOf  		
		balanceOf = await token.balanceOf(deployer)
		balanceOf.toString().should.equal(tokens(999900).toString())
		balanceOf = await token.balanceOf(receiver)
		balanceOf.toString().should.equal(tokens(100).toString())
	}) // describer transfer

  	it('Resets the allowance', async() => {
			const allowance = await token.allowance(deployer, exchange)
			allowance.toString().should.equal('0')
	})

	it('emits a Transfer event', async() => {
  		const log = result.logs[0]
  		log.event.should.eq('Transfer')
  		const event = log.args
  		event.from.toString().should.equal(deployer, 'from is correct')
  		event.to.should.equal(receiver, 'to is corect')
  		event.value.toString().should.equal(amount.toString(), 'value is correct')
  	  })
})// success

describe('failure', async() => {
	it('rejects insufficient amounts', async() => {
		const invalidAmount = tokens(100000000)
		await token.transferFrom(deployer, receiver, invalidAmount, { from: exchange }).should.be.rejectedWith(EVM_REVERT)
	}) // amounts
	
	it('rejects invalid recipients', async () => {
		await token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be.rejected
	}) //recepients
	}) // failure
})
})
