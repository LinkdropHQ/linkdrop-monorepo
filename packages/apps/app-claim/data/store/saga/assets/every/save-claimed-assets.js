import { put, select } from 'redux-saga/effects'
import { mergeAssets } from 'helpers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const items = yield select(generator.selectors.items)
    const itemsToClaim = yield select(generator.selectors.itemsToClaim)
    const itemsUpdated = mergeAssets(items.concat(itemsToClaim))

    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: itemsUpdated } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 3 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  items: ({ assets: { items } }) => items,
  itemsToClaim: ({ assets: { itemsToClaim } }) => itemsToClaim
}
