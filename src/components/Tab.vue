<template>
  <section v-if="isActive" :id="hash">
    <slot />
  </section>
</template>

<script>
export default {
  props: {
    id: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    default: {
      type: Boolean
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  created () {
    if (this.default) {
      this.isActive = true
    }
  },
  computed: {
    hash () {
      return this.id
        ? '#' + this.id
        : '#' + this.name.toLowerCase().replace(/ /g, '-')
    }
  }
}
</script>
