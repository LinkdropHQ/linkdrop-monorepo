import cryptocompare from 'cryptocompare'
const API_KEY = '4c427ce26e4acbc49958a5ccd6de4cd0a2d2d4d059c99d2e880141cbf368177e'
cryptocompare.setApiKey(API_KEY)

export default async ({ symbol }) => {
  try {
    return (await cryptocompare.price(symbol, ['USD'])).USD
  } catch {
    return 0
  }
}
