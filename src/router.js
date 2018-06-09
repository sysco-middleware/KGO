import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './views/Dashboard.vue'

import SchemaDashboard from './views/schemas/Dashboard.vue'
import SchemaEmptyPanel from './views/schemas/Empty.vue'
import SchemaPanel from './views/schemas/Panel.vue'
import SchemaNewPanel from './views/schemas/New.vue'

import TopicsDashboard from './views/topics/Dashboard.vue'
import TopicsInfo from './views/topics/Info.vue'
import TopicsPanel from './views/topics/Panel.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      component: Dashboard,
      children: [
        {
          path: '/schemas',
          component: SchemaDashboard,
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
          component: TopicsDashboard,
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
