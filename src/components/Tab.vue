<template>
  <section v-show="isActive && show" :id="hash" :class="[body]">
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
      isActive: false,
      body: this.$parent.body
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
