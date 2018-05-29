<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <a href="#" class="btn btn-link">Docs</a>
        <a href="#" class="btn btn-link">Examples</a>
      </section>
      <section class="navbar-center">
        <!-- centered logo or brand -->
      </section>
      <section class="navbar-section">
        <button class="btn">Export Schemas</button>
      </section>
    </header>

    <div class="columns cpp-schemas">
      <div class="column col-4">
        <ul class="menu">
          <li class="menu-item">
            <div class="tile tile-centered">
              <div class="tile-content">
                5 Schemas
              </div>

              <button class="btn float-right">New</button>
            </div>
          </li>
          <li class="divider"></li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.2</label>
            </div>
            <a href="#menus" class="active">events</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">commands</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">emails</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.2</label>
            </div>
            <a href="#menus">reddit_posts</a>
          </li>
          <li class="menu-item">
            <div class="menu-badge">
              <label class="label label-rounded label-primary">v.1</label>
            </div>
            <a href="#menus">reddit_posts-keys</a>
          </li>
          <li class="menu-item">
            <ul class="pagination flex-center">
              <li class="page-item disabled">
                <a href="#" tabindex="-1">Previous</a>
              </li>
              <li class="page-item active">
                <a href="#">1</a>
              </li>
              <li class="page-item">
                <a href="#">2</a>
              </li>
              <li class="page-item">
                <a href="#">3</a>
              </li>
              <li class="page-item">
                <span>...</span>
              </li>
              <li class="page-item">
                <a href="#">12</a>
              </li>
              <li class="page-item">
                <a href="#">Next</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="column col-8">
        <SchemaPanel />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
import SchemaPanel from '@/components/schema/Panel.vue'

export default {
  name: 'dashboard',
  components: {
    SchemaPanel
  },
  computed: {
    ...mapState('subjects', {
      subjects: 'availible',
      info: 'info'
    })
  },
  watch: {
    subjects () {
      for (let subject of this.subjects) {
        this.$store.dispatch('subjects/fetchLatest', subject)
      }
    }
  },
  async created () {
    await this.$store.dispatch('subjects/fetchAvailible')
  }
}
</script>
