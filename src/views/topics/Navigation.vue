<template>
  <div>
    <button v-if="selected" class="btn">Export Topic</button>
  </div>
</template>

<script>
export default {
  watch: {
    '$route.params' () {
      const {params} = this.$route
      this.selected = params.topic
    }
  },
  data () {
    const {params} = this.$route
    return {
      selected: params.topic
    }
  }
}
</script>
