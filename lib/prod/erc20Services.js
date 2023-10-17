const ERC20ABI = require('../interfaces/abi.json')

class ERC20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined ) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL)>');
    }
    this.ethers     = _ethers
    this.netWorkURL = _netWorkURL
    this.provider   = new _ethers.providers.JsonRpcProvider(_netWorkURL)
    this.chainId    = chainId
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

  getContractBalanceOf = async(_tokenContract, _walletAddress) => {
    return await _tokenContract.balanceOf(_walletAddress)
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

  getBalanceOf = async(_tokenAddress, _walletAddress) => {
    console.log("getBalanceOf:", _tokenAddress);
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractBalanceOf(tokenContract)
  }

  getERC20Contract = (_tokenAddress) => {
    return new this.ethers.Contract(_tokenAddress, ERC20ABI, this.provider)
  }

  wallet = (_pvtKey) => {
    return new this.ethers.Wallet(_pvtKey)
  }

}

module.exports = {
  ERC20Services
}
