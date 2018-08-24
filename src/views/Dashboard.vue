<template>
  <div class="container">
    <header class="navbar">
      <section class="navbar-section">
        <router-link :to="{ name: 'schemas' }" class="btn btn-link">Schemas</router-link>
        <router-link :to="{ name: 'topics' }" class="btn btn-link">Topics</router-link>
        <!-- <router-link :to="{ name: 'topologies' }" class="btn btn-link">Topologies</router-link> -->
      </section>
      <section class="navbar-center">
        <!-- Middle -->
      </section>
      <router-view class="navbar-section" name="navigation"></router-view>
    </header>

    <router-view class="cpp-view"></router-view>

    <Notifications />
  </div>
</template>

<script>
export default {
}
</script>
