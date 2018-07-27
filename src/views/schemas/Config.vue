<template>
  <div class="form-group">
    <label class="form-label">Schema uses the <span v-if="usesGlobalCompatibility">global</span> compatibility level <b>[{{usedCompatibility}}]</b><br>Change compatibility level to:</label>
    <select class="form-select" v-model="config.compatibility" @change="compatibilityLevelChange">
      <option class="c-hand" value="NONE">None</option>
      <option class="c-hand" value="FULL">Full</option>
      <option class="c-hand" value="FORWARD">Forward</option>
      <option class="c-hand" value="BACKWARD">Backward</option>
    </select>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState('schemas', [
      'global'
    ])
  },
  data () {
    return {
      usesGlobalCompatibility: '',
      usedCompatibility: ''
    }
  },
  async created () {
    await this.$store.dispatch('schemas/fetchGlobalConfig')

    this.usedCompatibility = this.config.compatibility || this.global.config.compatibility
    this.usesGlobalCompatibility = !this.config.compatibility
  },
  methods: {
    compatibilityLevelChange () {
      this.$emit('update:config', this.config)
    }
  }
}
</script>
