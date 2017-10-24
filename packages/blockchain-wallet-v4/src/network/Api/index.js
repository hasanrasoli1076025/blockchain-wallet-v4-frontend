import data from './data'
import options from './options'
import settings from './settings'
import wallet from './wallet'

export const BLOCKCHAIN_INFO = 'https://blockchain.info/'
export const API_BLOCKCHAIN_INFO = 'https://api.blockchain.info/'
export const API_CODE = '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'

const api = ({ rootUrl = BLOCKCHAIN_INFO, apiUrl = API_BLOCKCHAIN_INFO, apiCode = API_CODE } = {}) => ({
  ...data({ rootUrl, apiUrl, apiCode }),
  ...options({ rootUrl, apiUrl, apiCode }),
  ...settings({ rootUrl, apiUrl, apiCode }),
  ...wallet({ rootUrl, apiUrl, apiCode })
})

console.log(api())

export default api
