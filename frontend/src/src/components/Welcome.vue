<template>
  <div class="welcome-page">
    <div class="welcome-container">
      <img class="animated bounceInDown" src="../assets/microphone.png">
    
      <h1 class="animated rollIn">{{ msg }}</h1>

      <router-link to="/">Welcome</router-link><br />
      <router-link to="/dashboard">Dashboard</router-link><br />
      <router-link to="/settings">Settings</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'Speak To Me'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

html, body, .container, #app, .welcome-page{
  height: 100%;
}

.welcome-page{
  display: flex;
}

.welcome-container{
  margin: auto;
}

.welcome-page .welcome-container img{
  width: 60%;
  opacity: 0.7;
  margin-bottom: 55px;
  -webkit-animation-duration: 1.5s;
  -webkit-animation-delay: 0.5s;
}

h1{
  font-size: 4em;
  font-family: 'Reenie Beanie', cursive;
  -webkit-animation-duration: 2s;
  -webkit-animation-delay: 0,5s;
}
</style>
