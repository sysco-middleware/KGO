import Vue from 'vue'
import Router from 'vue-router'

import SchemaDashboard from './views/schema/Dashboard.vue'
import EmptyPanel from './views/schema/Empty.vue'
import SchemaPanel from './views/schema/Panel.vue'
import NewSchemaPanel from './views/schema/New.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/schemas',
      name: 'schemas',
      component: SchemaDashboard,
      children: [
        {
          path: '',
          component: EmptyPanel
        },
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
