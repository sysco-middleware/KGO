import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import SchemaPanel from './views/schema/Panel.vue'
import NewSchemaPanel from './views/schema/New.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/schemas',
      name: 'schemas',
      component: Dashboard,
      children: [
        {
          name: 'schema',
          path: ':subject',
          component: SchemaPanel
        },
        {
          name: 'new/schema',
          path: 'new',
          component: NewSchemaPanel
        }
      ]
    }
  ]
})
