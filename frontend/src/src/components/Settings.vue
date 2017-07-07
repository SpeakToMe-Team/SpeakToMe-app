<template>
  <div class="settings">
    
    <h1>{{ msg }}</h1>
    <router-link to="/">Welcome</router-link><br />
    <router-link to="/dashboard">Dashboard</router-link>
  </div>
</template>

<script>
export default {
  name: 'settings',
  data () {
    return {
      msg: 'Votre profil'
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
