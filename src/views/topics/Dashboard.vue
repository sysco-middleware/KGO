<template>
  <div class="columns">
    <div class="column col-4">
      <ul class="menu">
        <li class="menu-item">
          <div class="tile tile-centered">
            <div class="tile-content">
              {{total}} Topics
            </div>
          </div>
        </li>
        <li class="divider"></li>

        <paginate name="topics" :list="topicsAsArray" :per="5" tag="div">
          <li class="menu-item" v-for="{name, format} of paginated('topics')" :key="name">
            <div class="menu-badge" v-show="format">
              <label class="label label-rounded label-primary text-uppercase">{{format}}</label>
            </div>
            <router-link :to="{ name: 'topic', params: { topic: name }}" active-class="active" class="c-hand">
              {{name}}
            </router-link>
          </li>
        </paginate>

        <li class="menu-item">
          <paginate-links
            class="pagination flex-center"
            for="topics"
            :per="5"

            :show-step-links="true"
            :step-links="{
              next: 'Next',
              prev: 'Previous'
            }"

            :classes="{
              'li': ['page-item', 'c-hand']
            }">
          </paginate-links>
        </li>

        <div v-if="total <= 0" class="empty">
          <p class="empty-title h5">You have no topics</p>
          <p class="empty-subtitle">Please create a topic.</p>
        </div>
      </ul>
    </div>
    <div class="column col-8">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapState('topics', [
      'topics'
    ]),
    total () {
      return Object.keys(this.topics).length // Get the total ammount of keys since topics is a object
    },
    topicsAsArray () {
      const keys = Object.keys(this.topics)
      let array = []

      for (let name of keys) {
        array.push({
          ...this.topics[name],
          name
        })
      }

      return array
    }
  },
  data () {
    return {
      paginate: ['topics']
    }
  },
  async created () {
    await this.$store.dispatch('topics/fetchAll')
  },
  methods: {
  }
}
</script>
