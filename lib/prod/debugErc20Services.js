const { ERC20Services } = require('./erc20Services.js')
let erc20Services

class debugErc20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined || chainId === undefined) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL, chainId)>');
    }
    erc20Services = new ERC20Services(_ethers, _netWorkURL, chainId)
  }

  Wallet = (_pvtKey) => {
    console.log(`EXECUTING: Wallet(${_pvtKey})`)
    let wallet = erc20Services.Wallet(_pvtKey)
    console.log('RETURNING: wallet(', wallet, ")")
    return wallet
  }

  getContractName = async(_tokenContract) => {
    console.log(`EXECUTING: getContractName(_tokenContract)`)
    let contractName = await erc20Services.getContractName(_tokenContract)
    console.log('RETURNING: contractName = ',contractName)
    return contractName
  }

  getContractSymbol = async(_tokenContract) => {
    console.log(`EXECUTING: getContractSymbol(_tokenContract)`)
    let contractSymbol = await erc20Services.getContractSymbol(_tokenContract)
    console.log('RETURNING: contractSymbol = ',contractSymbol)
    return contractSymbol
  }

  getContractDecimals = async(_tokenContract) => {
    console.log(`EXECUTING: getContractDecimals(_tokenContract)`)
    let contractDecimals = await erc20Services.getContractDecimals(_tokenContract)
    console.log('RETURNING: contractSymbol = ',contractDecimals)
    return contractDecimals
  }

  getContractBalanceOf = async(_walletAddress, _tokenContract) => {
    console.log(`EXECUTING: getContractBalanceOf(_walletAddress, _tokenContract)`)
    let balanceOf = await erc20Services.getContractBalanceOf(_walletAddress, _tokenContract)
    console.log(`RETURNING: WEI balanceOf ${_walletAddress} = ${balanceOf}`)
    return await balanceOf
  }

  getContractNameSymbol = async(_tokenContract) => {
    console.log(`EXECUTING:  getContractNameSymbol(_tokenContract)`)
    let contractNameSymbol = await erc20Services.getContractNameSymbol(_tokenContract)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)
    return contractNameSymbol
  }

  getName = async(_tokenAddress) => {
    console.log(`EXECUTING: getName(${_tokenAddress})`)
    let contractName = await erc20Services.getName(_tokenAddress)
    console.log('RETURNING: contractName = ', contractName)
    return contractName
  }

  getSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getSymbol(${_tokenAddress})`)
    let tokenAddress = await erc20Services.getSymbol(_tokenAddress)
    console.log('RETURNING: tokenAddress = ', tokenAddress)
    return tokenAddress
  }

  getDecimals = async(_tokenAddress) => {
    console.log(`EXECUTING: getDecimals({$_tokenAddress})`)
    let tokenDecimals = await erc20Services.getDecimals(_tokenAddress)
    console.log('RETURNING: tokenDecimals = ', tokenDecimals)
    return tokenDecimals
  }

  getBalanceOf = async( _walletAddress, _tokenAddress ) => {
    console.log(`EXECUTING: getBalanceOf( {$_walletAddress}, {$_tokenAddress} )`)
    let balanceOf = await erc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    console.log(`RETURNING: WEI balanceOf walletAddress(${_walletAddress}), tokenAddress(${_tokenAddress}) = ${balanceOf}`)
    return await balanceOf
  }

  getERC20Contract = (_tokenAddress) => {
    console.log(`EXECUTING: etERC20Contract = ({$_tokenAddress})`)
    let erc20Contract = erc20Services.getERC20Contract(_tokenAddress)
    console.log('RETURNING: erc20Contract = ', erc20Contract)
    return erc20Contract
  }

  getNameSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getNameSymbol({$_tokenAddress})`)
    let nameSymbol = erc20Services.getNameSymbol(_tokenAddress)
    console.log('RETURNING: nameSymbol = ',nameSymbol)
    return nameSymbol
  }

  getAddressNameSymbol = async(_tokenAddress) => {
    console.log(`EXECUTING: getAddressNameSymbol({$_tokenAddress})`)
    let addressNameSymbol = erc20Services.getAddressNameSymbol(_tokenAddress)
    console.log('RETURNING: addressNameSymbol = ', addressNameSymbol)
    return addressNameSymbol
  }

  tokenAddrToBigintAmt = async(_tokenAddress, _amount) => {
    console.log(`EXECUTING: tokenAddrToBigintAmt({$_tokenAddress}, ${_amount})`)
    let bigInt = await erc20Services.tokenAddrToBigintAmt(_tokenAddress, _amount)
    console.log('RETURNING: addressToBigintAmt = ', bigInt)
    return bigInt
  }

  tokenContractAmtToBigInt = async( _tokenContract, _amount ) => {
    console.log(`EXECUTING: tokenContractAmtToBigInt( _tokenContract, ${_amount} )`)
    let bigInt = await erc20Services.tokenContractAmtToBigInt( _tokenContract, _amount )
    console.log('RETURNING: contractToBigintAmt = ', bigInt)
    return bigInt
  }

  tokenAmtToBigint = (_tokenAmt, _decimals) => {
    console.log(`EXECUTING: tokenAmtToBigint(${_tokenAmt}, $_walletAddress{_decimals})`)
    let bigInt = erc20Services.tokenAmtToBigint(_tokenAmt, _decimals)
    console.log('RETURNING: tokenAmtToBigint = ', bigInt)
    return bigInt
  }

  bigIntToTokenAddrAmt = async(_tokenAddress, _bigInt) => {
    console.log(`EXECUTING: bigIntToTokenAddrAmt({$_tokenAddress}, _bigInt)`)
    let tokenAmount = erc20Services.bigIntToTokenAddrAmt(_tokenAmt, _decimals)
    console.log('RETURNING: bigIntToTokenAddrAmt = ', tokenAmount)
    return tokenAmount
  }

  bigIntToTokenContractAmt = async( _tokenContract, _bigInt ) => {
    console.log(`EXECUTING: bigIntToTokenContractAmt( _tokenContract, _bigInt )`)
    let tokenAmount = erc20Services.bigIntToTokenContractAmt(tokenContract, _bigInt)
    console.log('RETURNING: bigIntToTokenContractAmt = ', tokenAmount)
    return tokenAmount
  }

  bigIntToTokenAmt = (_bigInt, _decimals) => {
    console.log(`EXECUTING: bigIntToTokenAmt = (_bigInt, _decimals)`)
    let tokenAmount = erc20Services.bigIntToTokenAmt(_bigInt, _decimals)
    console.log('RETURNING: bigIntToTokenAmt = ',tokenAmount)
    return tokenAmount
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  wrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    console.log(`EXECUTING: wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
  }

  unwrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    console.log(`EXECUTING: unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
  }

  wrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    console.log(`EXECUTING: wrapEthAmtByContract(_wallet, _wethContract, _ethAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.wrapEthAmtByContract(_wallet, _wethContract, _ethAmount)
  }

  unwrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    console.log(`EXECUTING: unwrapEthAmtByContract(_wallet, _wethContract, _ethAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.unwrapEthAmtByContract(_wallet, _wethContract, _ethAmount)
}
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  wrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    console.log(`EXECUTING: wrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.wrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)
  }

  unwrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    console.log(`EXECUTING: unwrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.unwrapWeiAmtByAddress(_wallet, _wethAddress, _weiAmount)
  }

  wrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    console.log(`EXECUTING: wrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.wrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)
  }

  unwrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    console.log(`EXECUTING: unwrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)`)
    console.log('RETURNING: contractNameSymbol = ',contractNameSymbol)

    return await erc20Services.unwrapWeiAmtByContract(_wallet, _wethContract, _weiAmount)
  }

}

module.exports = {
  ERC20Services,
  debugErc20Services
}
