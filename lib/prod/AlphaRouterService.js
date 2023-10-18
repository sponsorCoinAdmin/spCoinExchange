require("dotenv").config();

const { AlphaRouter } = require('@uniswap/smart-order-router')
const { TradeType, Percent } = require('@uniswap/sdk-core')
const { BigNumber } = require('ethers')
const { UniTokenServices } = require('./uniTokenServices')
const { ERC20Services } = require('./erc20Services')

const UNISWAP_SWAPROUTER_02 = process.env.UNISWAP_SWAPROUTER_02
const BURN_ADDRESS = process.env.BURN_ADDRESS;

let router
let UTS
let erc20Services

class AlphaRouterService {
  constructor(_erc20Services) {
    this.erc20Services = _erc20Services
    this.ethers   = _erc20Services.ethers
    this.provider = _erc20Services.provider
    UTS = new UniTokenServices( _erc20Services )
    erc20Services = _erc20Services
    router = new AlphaRouter({ chainId: _erc20Services.chainId, provider: _erc20Services.provider})
    console.log( "DEBUG MODE OFF: AlphaRouterService()");
  }

  getExactInputStrPriceQuote = async(_tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    return getStrPriceQuote( TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals)
  }

  getExactOutputStrPriceQuote = async(_tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    return getStrPriceQuote( TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals)
  }

  getStrPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    let decimals = (_decimals === undefined) ? await erc20Services.getDecimals(_tokenAddrIn) : _decimals;
    let quote = await this.getPriceQuote( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent);
    let strPriceQuote = quote.toFixed(decimals);
    return strPriceQuote;
  }

  getExactOutputPriceQuote = async( _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    return getPriceQuote( TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent)
  }

  getExactInputPriceQuote = async( _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    return getPriceQuote( TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent)
  }

  getPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
      const route = await this.getRoute(BURN_ADDRESS, _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent);
    return route.quote
  }

  getExactInputRoute = async(_recipientAddr, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    return await getRoute(_recipientAddr, TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent)
  }

  getExactOutputRoute = async(_recipientAddr, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    return await getRoute(_recipientAddr, TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent)
  }

  getRoute = async(_recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {

    let uniTokenOut = await UTS.wrapAddrToUniToken(_tokenAddrOut)    
    let amount = await UTS.addrAmountToCurrencyInWei(_amount, _tokenAddrIn)

    let route = await router.route(
      amount,
      uniTokenOut,
      _tradeType,
      {
        recipient: _recipientAddr,
        slippageTolerance: new Percent(_slippagePercent, 100),
        deadline: Math.floor(Date.now()/1000 + 1800)
      }
    )
    return route;
  }

  getTransaction = ( _route, _walletAddress, _gasLimit ) => {
    const transaction = {
      data: _route.methodParameters.calldata,
      to: UNISWAP_SWAPROUTER_02,
      value: BigNumber.from(_route.methodParameters.value),
      from: _walletAddress,
      gasPrice: BigNumber.from(_route.gasPriceWei),
      gasLimit: this.ethers.utils.hexlify(_gasLimit)
    }
    return transaction;
  }

  ////////////////////////////////////////////////////////////////////////////////////////


   exeExactInputTransaction = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactInputAmount,
    _slippagePercent,
    _gasLimit) => {
      await this.execTransactionRoute(
        _wallet,
        TradeType.EXACT_INPUT,
        _tokenInAddr,
        _tokenOutAddr,
        _approvalAmount,
        _exactInputAmount,
        _slippagePercent,
        _gasLimit
      )
  }

  exeExactOutputTransaction = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactOutputAmount,
    _slippagePercent,
    _gasLimit) => {

      await this.execTransactionRoute(
        _wallet,
        TradeType.EXACT_OUTPUT,
        _tokenInAddr,
        _tokenOutAddr,
        _approvalAmount,
        _exactOutputAmount,
        _slippagePercent,
        _gasLimit
      )
  }

  execTransactionRoute = async(
    _wallet,
    _tradeType,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactAmount,
    _slippagePercent,
    _gasLimit) => {
      let route = await this.getRoute(
                    _wallet.address,
                    _tradeType,
                    _tokenInAddr,
                    _tokenOutAddr,
                    _exactAmount,
                    _slippagePercent
                  );

      await this.execTransaction(
        _wallet,
        route,
        _gasLimit
      )
  }

  execTransaction = async(
    _wallet,
    _route,
    _gasLimit ) => {

      const transaction = this.getTransaction(_route, _wallet.address, _gasLimit)
      const connectedWallet = _wallet.connect(this.provider)
      console.log("Pending Transaction:")
      const tradeTransaction = await connectedWallet.sendTransaction(transaction)

      await tradeTransaction.wait();
      console.log("Transaction Complete")
  }
}

module.exports = {
  AlphaRouterService,
  ERC20Services,
  UniTokenServices
}
