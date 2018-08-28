<template lang="html">
  <div class="container height-100-vh">
    <div class="columns f-center f-middle height-100">
      <div class="column col-5 col-md-10 col-xs-12">
        <div class="panel-header columns f-middle">
          <div class="column text-center">
            <h3>Set your contact information</h3>
            <p>This information is used when committing changes</p>
          </div>
        </div>

        <div class="panel">
          <div class="panel-body">
            <form class="form-horizontal" @submit.prevent="register()">
              <div class="form-group">
                <div class="col-3 col-sm-12">
                  <label class="form-label" for="input-name">Name</label>
                </div>
                <div class="col-9 col-sm-12">
                  <input class="form-input" type="text" id="input-name" placeholder="John Doe" v-model="name">
                </div>
              </div>

              <div class="form-group">
                <div class="col-3 col-sm-12">
                  <label class="form-label" for="input-email">Email</label>
                </div>
                <div class="col-9 col-sm-12">
                  <input class="form-input" type="text" id="input-email" placeholder="john@example.com" v-model="email">
                </div>
              </div>

              <div class="form-group f-end">
                <div class="col-9 col-sm-12">
                  <button submit class="btn">Save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <Notifications />
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      email: ''
    }
  },
  methods: {
    async register () {
      try {
        await this.$store.dispatch('user/register', {
          name: this.name,
          email: this.email
        })

        this.$router.push({ name: 'dashboard' })
      } catch (error) {
        this.$notify({
          message: String(error),
          type: 'error'
        })
      }
    }
  }
}
</script>
