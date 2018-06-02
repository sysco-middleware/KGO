<template>
  <div>
    <nav :class="[nav]">
      <ul class="tab tab-block">
        <li
          v-for="(tab, index) in tabs"
          v-show="tab.show"
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
    nav: String, // Nav class
    body: String, // Body class
    remember: Boolean,
    name: String,
    prefix: {
      type: String,
      default: 'tabs-'
    }
  },
  data () {
    return {
      default: '',
      active: '',
      tabs: []
    }
  },
  created () {
    this.tabs = this.$children
  },
  mounted () {
    const activeTab = this.findActive()
    const defaultTab = this.findDefault()

    this.default = defaultTab
    this.selectTab(activeTab || defaultTab)
  },
  methods: {
    selectTab (hash) {
      this.active = hash

      if (this.remember && this.name) {
        localStorage[this.prefix + this.name] = hash
      }

      for (let tab of this.tabs) {
        tab.isActive = false

        if (tab.hash === hash) {
          tab.isActive = true
        }
      }
    },
    selectDefault () {
      this.selectTab(this.default)
    },
    findDefault () {
      let defaultTab = this.tabs.find((tab) => tab.default)
      if (!defaultTab) {
        defaultTab = this.tabs[0].hash
      }

      return defaultTab
    },
    findActive () {
      const storedHash = localStorage[this.prefix + this.name]
      const activeTab = this.tabs.find((tab) => tab.hash === storedHash && tab.show)
      return activeTab ? activeTab.hash : null
    }
  }
}
</script>
