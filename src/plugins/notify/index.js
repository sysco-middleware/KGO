import Notifications from './Notifications.vue'
import events from './events'

export default {
  install (Vue, params = {}) {
    Vue.component('Notifications', Notifications)

    const notify = (options) => {
      if (!(options instanceof Object)) {
        throw new Error('the given options are not a object')
      }

      events.$emit('notify', options)
    }

    Vue.prototype.$notify = notify
  }
}
