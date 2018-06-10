import Vue from 'vue'
import Router from 'vue-router'
import Store from './store'

import Dashboard from './views/Dashboard.vue'

import SchemaDashboard from './views/schemas/Dashboard.vue'
import SchemaNavigation from './views/schemas/Navigation.vue'
import SchemaEmptyPanel from './views/schemas/Empty.vue'
import SchemaPanel from './views/schemas/Panel.vue'
import SchemaNewPanel from './views/schemas/New.vue'

import TopicsDashboard from './views/topics/Dashboard.vue'
import TopicsNavigation from './views/topics/Navigation.vue'
import TopicsInfo from './views/topics/Info.vue'
import TopicsPanel from './views/topics/Panel.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      component: Dashboard,
      children: [
        {
          path: '/schemas',
          components: {
            default: SchemaDashboard,
            navigation: SchemaNavigation
          },
          children: [
            {
              path: '',
              name: 'schemas',
              component: SchemaEmptyPanel
            },
            {
              name: 'new/schema',
              path: 'new',
              component: SchemaNewPanel
            },
            {
              name: 'schema',
              path: ':subject',
              component: SchemaPanel
            }
          ]
        },
        {
          path: '/topics',
          components: {
            default: TopicsDashboard,
            navigation: TopicsNavigation
          },
          children: [
            {
              path: '',
              name: 'topics',
              component: TopicsInfo
            },
            {
              path: ':topic',
              name: 'topic',
              component: TopicsPanel
            }
          ]
        },
        {
          path: '/topologies',
          children: [
            {
              path: '',
              name: 'topologies'
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(async function (to, from, next) {
  const hasActiveConfig = Store.getters['config/hasActive']
  if (!hasActiveConfig) {
    await Store.dispatch('config/fetch')
  }

  next()
})

export default router
