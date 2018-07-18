<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <router-link :to="{ name: 'schemas' }" class="btn btn-link">Schemas</router-link>
        <router-link :to="{ name: 'topics' }" class="btn btn-link">Topics</router-link>
        <router-link :to="{ name: 'topologies' }" class="btn btn-link">Topologies</router-link>
      </section>
      <section class="navbar-center">
        <!-- centered logo or brand -->
      </section>
      <router-view class="navbar-section" name="navigation"></router-view>
    </header>

    <router-view class="cpp-view"></router-view>

    <!-- <div class="toast toast-primary toast-notification">
      <button class="btn btn-clear float-right"></button>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
export default {
}
</script>
