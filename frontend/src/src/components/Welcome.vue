<template>
  <div class="welcome">
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <router-link to="/">Welcome</router-link><br />
    <router-link to="/dashboard">Dashboard</router-link><br />
    <router-link to="/settings">Settings</router-link>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Welcome to your Smart Speech Assistant'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
