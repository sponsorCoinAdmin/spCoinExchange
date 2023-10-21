const { ERC20Services } = require('./erc20Services.js')
let erc20Services


class LogERC20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined || chainId === undefined) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL, chainId)>');
    }
    erc20Services = new ERC20Services(_ethers, _netWorkURL, chainId)

  }

  Wallet = (_pvtKey) => {
    console.log(`EXECUTING: Wallet = (_pvtKey)`)
    return erc20Services.Wallet(_pvtKey)
  }

  getContractName = async(_tokenContract) => {
    console.log(`EXECUTING: getContractName(_tokenContract)`)
    return await erc20Services.getContractName(_tokenContract) 
  }

  getContractSymbol = async(_tokenContract) => {
    console.log(`EXECUTING: getContractSymbol(_tokenContract)`)
    return await erc20Services.getContractSymbol(_tokenContract)
  }

  getContractDecimals = async(_tokenContract) => {
    console.log(`EXECUTING: getContractDecimals(_tokenContract)`)
    return await erc20Services.getContractDecimals(_tokenContract)
  }

  getContractBalanceOf = async(_walletAddress, _tokenContract) => {
    console.log(`EXECUTING: getContractBalanceOf(_walletAddress, _tokenContract)`)
    let balanceOf = await erc20Services.getBalanceOf(_walletAddress, _tokenContract)
    console.log(`WEI balanceOf ${_walletAddress} = ${balanceOf}`)
    return await balanceOf
  }

  getContractNameSymbol = async(_tokenContract) => {
    console.log(`EXECUTING:  getContractNameSymbol(_tokenContract)`)
    return await erc20Services.getContractNameSymbol(_tokenContract)
  }

  getName = async(_tokenAddress) => {
    console.log(`EXECUTING: getName(_tokenAddress)`)
    return await erc20Services.getName(_tokenAddress)
  }

  getSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getSymbol(_tokenAddress)`)
    return await erc20Services.getName(_tokenAddress)
  }

  getDecimals = async(_tokenAddress) => {
    console.log(`EXECUTING: getDecimals(_tokenAddress)`)
    return await erc20Services.getDecimals(_tokenAddress)
  }

  getBalanceOf = async( _walletAddress, _tokenAddress ) => {
    console.log(`ZZZZZ EXECUTING: getBalanceOf( _walletAddress, _tokenAddress )`)
    let balanceOf = await erc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    console.log(`QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ`)
    console.log(`WEI balanceOf ${_walletAddress} = ${balanceOf}`)
    return await balanceOf
  }

  getERC20Contract = (_tokenAddress) => {
    console.log(`EXECUTING: etERC20Contract = (_tokenAddress)`)
    return erc20Services.getERC20Contract(_tokenAddress)
  }

  getNameSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getNameSymbol(_tokenAddress)`)
    return await erc20Services.getNameSymbol(_tokenAddress)
  }

  getAddressNameSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getAddressNameSymbol(_tokenAddress)`)
    return await erc20Services.getAddressNameSymbol(_tokenAddress)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  // ToDo: Find out if this is Used
  /*
  weiAmountToCurrencyInToken = (weiAmount, decimals) => {
    return erc20Services.
  }
*/

  tokenAddrToBigintAmt = async(_tokenAddress, _amount) => {
    console.log(`EXECUTING: tokenAddrToBigintAmt(_tokenAddress, _amount)`)
    return await erc20Services.tokenAddrToBigintAmt(_tokenAddress, _amount)
  }

  tokenContractAmtToBigInt = async( _tokenContract, _amount ) => {
    console.log(`EXECUTING: tokenContractAmtToBigInt( _tokenContract, _amount )`)
    return await erc20Services.tokenContractAmtToBigInt( _tokenContract, _amount )
  }

  tokenAmtToBigint = (_tokenAmt, _decimals) => {
    console.log(`EXECUTING: tokenAmtToBigint(_tokenAmt, _decimals)`)
    return erc20Services.tokenAmtToBigint(_tokenAmt, _decimals)
  }

  bigIntToTokenAddrAmt = async(_tokenAddress, _bigInt) => {
    console.log(`EXECUTING: bigIntToTokenAddrAmt(_tokenAddress, _bigInt)`)
    return await erc20Services.bigIntToTokenAddrAmt(_tokenAddress, _bigInt)
  }

  bigIntToTokenContractAmt = async( _tokenContract, _bigInt ) => {
    console.log(`EXECUTING: bigIntToTokenContractAmt( _tokenContract, _bigInt )`)
    return await erc20Services.bigIntToTokenContractAmt( _tokenContract, _bigInt )
  }

  bigIntToTokenAmt = (_bigInt, _decimals) => {
    console.log(`EXECUTING: bigIntToTokenAmt = (_bigInt, _decimals)`)
    return erc20Services.bigIntToTokenAmt(_bigInt, _decimals)
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  wrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    console.log(`EXECUTING: wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)`)
    return await erc20Services.wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
  }

  unwrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    console.log(`EXECUTING: unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)`)
    return await erc20Services.unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
  }

  wrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    console.log(`EXECUTING: wrapEthAmtByContract(_wallet, _wethContract, _ethAmount)`)
    return await erc20Services.wrapEthAmtByContract(_wallet, _wethContract, _ethAmount)
  }

  unwrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    console.log(`EXECUTING: unwrapEthAmtByContract(_wallet, _wethContract, _ethAmount)`)
    return await erc20Services.unwrapEthAmtByContract(_wallet, _wethContract, _ethAmount)
}
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  wrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    console.log(`EXECUTING: wrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)`)
    return await erc20Services.wrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)
  }

  unwrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    console.log(`EXECUTING: unwrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)`)
    return await erc20Services.unwrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)
  }

  wrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    console.log(`EXECUTING: wrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)`)
    return await erc20Services.wrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)
  }

  unwrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    console.log(`EXECUTING: unwrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)`)
    return await erc20Services.unwrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)
  }

}

module.exports = {
  ERC20Services,
  LogERC20Services
}
