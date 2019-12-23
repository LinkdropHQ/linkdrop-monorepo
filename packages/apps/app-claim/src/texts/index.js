import i18next from 'i18next'
import ru from './ru'
import en from './en'

i18next.init({
  lng: 'en',
  resources: {
    ru: { translation: ru },
    en: { translation: en }
  }
})

export default (key, options) => (
  i18next.t(key, options)
)
