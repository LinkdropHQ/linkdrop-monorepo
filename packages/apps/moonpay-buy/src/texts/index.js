import i18next from 'i18next'
import en from './en'

i18next.init({
  lng: 'en',
  resources: {
    en: { translation: en }
  }
})

export default (key, options) => (
  i18next.t(key, options)
)
