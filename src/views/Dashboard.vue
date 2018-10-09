<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <router-link :to="{ name: 'schemas' }" class="btn btn-link">Schemas</router-link>
        <router-link :to="{ name: 'topics' }" class="btn btn-link">Topics</router-link>
      </section>
      <div class="navbar-center form-group">
        <select class="form-select" v-model="cluster">
          <option v-for="(cluster, index) of clusters" :key="index">{{cluster.name}}</option>
        </select>
      </div>
      <router-view class="navbar-section" name="navigation"></router-view>
    </header>

    <router-view class="cpp-view"></router-view>

    <Notifications />

    <div class="columns f-end" v-if="user">
      <div class="chip">
        <figure class="avatar avatar-sm" :data-initial="user.shortname" style="background-color: #5755d9;"></figure>
        {{user.name}}
        <a class="btn btn-clear" aria-label="Close" role="button" @click="unregister()"></a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState('clusters', [
      'clusters',
      'selected'
    ]),
    ...mapGetters({
      user: 'user/active'
    })
  },
  data () {
    return {
      cluster: null
    }
  },
  watch: {
    selected () {
      const selected = this.selected.name
      if (this.cluster === selected) {
        return
      }

      this.cluster = selected
    }
  },
  created () {
    this.$store.dispatch('clusters/fetch')
  },
  methods: {
    unregister () {
      this.$store.dispatch('user/clear')
      this.$router.push({ name: 'register' })
    }
  }
}
</script>
