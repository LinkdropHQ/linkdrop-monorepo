import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const items = yield select(generator.selectors.items)
    const itemsToClaim = yield select(generator.selectors.itemsToClaim)
    const itemsUpdated = items.concat(itemsToClaim)

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

// function mergeAssets (arr) {
//   return arr.reduce((res, { id: newId, count }) => {
//     var previouslyAdded = res.find(({ id: prevId }) => prevId === newId)
//     if (!previouslyAdded) {
//       return res.concat({ id: newId, count })
//     } else {
//       return res.map(({ id, count }) => {
//         if (id === previouslyAdded.id) {
//           return { id, count: count + previouslyAdded.count }
//         } else {
//           return { id, count }
//         }
//       })
//     }
//   }, [])
// }
