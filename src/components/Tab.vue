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
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    hash () {
      return this.id
        ? '#' + this.id
        : '#' + this.name.toLowerCase().replace(/ /g, '-')
    }
  },
  watch: {
    show () {
      if (this.isActive) {
        this.$parent.selectDefault()
      }
    }
  }
}
</script>
