const ERC20ABI = require('../interfaces/abi.json')
const WETH_ABI = require('../interfaces/WETH_ABI.json')

const { BigNumber } = require('ethers')
const ETH_DECIMALS = 18

class ERC20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined || chainId === undefined) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL, chainId)>');
    }
    this.ethers     = _ethers
    this.netWorkURL = _netWorkURL
    this.provider   = new _ethers.providers.JsonRpcProvider(_netWorkURL)
    this.chainId    = chainId
  }

  Wallet = (_pvtKey) => {
    let wallet = new this.ethers.Wallet(_pvtKey, this.provider)
    return wallet
  }

  getContractName = async(_tokenContract) => {
    return await _tokenContract.name()
  }

  getContractSymbol = async(_tokenContract) => {
    return await _tokenContract.symbol()
  }

  getContractDecimals = async(_tokenContract) => {
    return await _tokenContract.decimals()
  }

  getContractBalanceOf = async(_walletAddress, _tokenContract) => {
    let balanceOf = await _tokenContract.balanceOf(_walletAddress)
    return balanceOf
  }

  getContractNameSymbol = async(_tokenContract) => {
    let name = await _tokenContract.name()
    let symbol = await _tokenContract.symbol()
    let nameSymbol = name+"("+symbol+")"
    return nameSymbol
  }

  getName = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractName(tokenContract)
  }

  getSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractSymbol(tokenContract)
  }

  getDecimals = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractDecimals(tokenContract)
  }

  getBalanceOf = async( _walletAddress, _tokenAddress ) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractBalanceOf( _walletAddress, tokenContract )
  }

  getERC20Contract = ( _tokenAddress ) => {
    return new this.ethers.Contract(_tokenAddress, ERC20ABI, this.provider)
  }

  getWETHContract = (_tokenAddress) => {
    return new this.ethers.Contract(_tokenAddress, WETH_ABI, this.provider)
  }

  getNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return await this.getContractNameSymbol( tokenContract )
  }

  getAddressNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return "" + _tokenAddress + " => " + await this.getContractNameSymbol( tokenContract )
  }

  tokenAddrToBigintAmt = async(_tokenAddress, _amount) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.tokenContractAmtToBigInt(tokenContract, _amount);
  }

  tokenContractAmtToBigInt = async( _tokenContract, _amount ) => {
    let decimals = await _tokenContract.decimals();
    let bigIntAmount = this.tokenAmtToBigint( _amount, decimals )
    return bigIntAmount
  }

  tokenAmtToBigint = (_tokenAmt, _decimals) => {
    let bigIntAmount = this.ethers.utils.parseUnits( "" + _tokenAmt, _decimals )
    return bigIntAmount
  }

  bigIntToTokenAddrAmt = async(_tokenAddress, _bigInt) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.bigIntToTokenContractAmt(tokenContract, _bigInt);
  }

  bigIntToTokenContractAmt = async( _tokenContract, _bigInt ) => {
    let decimals = await _tokenContract.decimals();
    let bigIntAmount = this.bigIntToTokenAmt( _bigInt, decimals )
    return bigIntAmount
  }

  bigIntToTokenAmt = (_bigInt, _decimals) => {
    let bigNum = BigNumber.from(_bigInt)
    let base = BigNumber.from(10)
    let expOffset = base.pow( _decimals ).toString()
    let wholePart = BigNumber.from(bigNum).div(expOffset)
    let mantissa = BigNumber.from(bigNum).mod(expOffset)
    mantissa = String(mantissa.toString()).padStart(_decimals, '0');
    mantissa = removeTrailingZeros(mantissa)
    let tokenStrAmt = wholePart + "." + mantissa
    return tokenStrAmt
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

 wrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.wrapWeiAmtByAddress(_wallet, _wethAddress, weiAmount);
    return weiAmount
  }

  unwrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.unwrapWeiAmtByAddress(_wallet, _wethAddress, weiAmount);
    return weiAmount
  }

  wrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.wrapWeiAmtByContract(_wallet, _wethContract, weiAmount);
    return weiAmount
  }

  unwrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.unwrapWeiAmtByContract(_wallet, _wethContract, weiAmount);
    return weiAmount
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  wrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    let wethContract = new this.ethers.Contract(_wethAddress, WETH_ABI, _wallet)
    await this.wrapWeiAmtByContract(_wallet, wethContract, _weiAmount);
    return wethContract
  }

  unwrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    let wethContract = this.getWETHContract(_wethAddress );
    await this.unwrapWeiAmtByContract(_wallet, wethContract, _weiAmount);
    return wethContract
  }

  wrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    /* // Ensure ethAmountInWei is a string */
    let weiAmount = "" + _weiAmount
    console.log(`TRANSACTION WRAP(${_weiAmount}) PENDING`)
    let tx = await _wethContract.connect(_wallet).deposit({ value: weiAmount });
    await tx.wait()
    console.log(`TRANSACTION WRAP(${_weiAmount}) COMPLETE`)
    return weiAmount
  }

  unwrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    /* // Ensure ethAmountInWei is a string */
    let weiAmount = "" + _weiAmount
    console.log(`TRANSACTION UN-WRAP(${_weiAmount}) PENDING`)
    let tx = await _wethContract.connect(_wallet).withdraw( weiAmount );
    await tx.wait()
    console.log(`TRANSACTION UN-WRAP(${_weiAmount}) COMPLETE`)
    return weiAmount
  }
}

function removeTrailingZeros(string){
  return string.replace(/0+$/, '');
}

module.exports = {
  ERC20Services
}
