<template>
  <div>
    <nav :class="[nav]">
      <ul class="tab tab-block">
        <li
          v-for="(tab, index) in tabs"
          class="tab-item c-hand"
          :class="{'active': tab.isActive}"
          :key="index">
          <a @click="selectTab(tab.hash)">{{tab.name}}</a>
        </li>
      </ul>
    </nav>
    <div :class="[body]">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nav: { // Nav class
      type: String
    },
    body: { // Body class
      type: String
    }
  },
  data () {
    return {
      active: '',
      tabs: []
    }
  },
  created () {
    this.tabs = this.$children
  },
  mounted () {
    // TODO: load active tab from url/localstorage

    const hasDefaultTab = this.tabs.find((tab) => tab.isActive)
    if (!hasDefaultTab) this.selectTab(this.tabs[0].hash)
  },
  methods: {
    selectTab (hash) {
      this.active = hash

      for (let tab of this.tabs) {
        tab.isActive = false

        if (tab.hash === hash) {
          tab.isActive = true
        }
      }
    }
  }
}
</script>
