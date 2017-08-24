<template>
  <div class="welcome-page">
    <div class="welcome-container">
      
    
      <div> 
        <img class="logo animated bounceInDown" src="../assets/images/microphone.png">
      </div>
      <h1 class="animated rollIn">{{ msg }}</h1>

      <div class="temp">
      <router-link to="/">Welcome</router-link><br />
      <router-link to="/dashboard">Dashboard</router-link><br />
      <router-link to="/settings">Settings</router-link><br />
      </div>

      <div>
        <img class="authen animated fadeIn" src="../assets/images/googleAuth.png" alt="google authentificator">
      </div>
    </div>
  </div>
</template>



<script>
/*
import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketio from 'vue-socket.io'

var ioInstance = io('http://127.0.0.1.nip.io', { 'path': '/speech2text/socket.io' })
Vue.use(VueSocketio, ioInstance)
*/
export default {
  name: 'welcome',
  data () {
    return {
      msg: 'SpeakToMe'
    }
  }
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html, body, .container, #app{
  height: 100%;
}
</style>

<style scoped>
.welcome-page{
  height: 100%;
  display: flex;
  text-align: center;
}

.welcome-container{
  margin: auto;
}

.logo{
  width: 60%;
  opacity: 0.5;
  -webkit-animation-duration: 2s;
  -webkit-animation-delay: 1s;
}

h1{
  -webkit-animation-duration: 1.5s;
  -webkit-animation-delay: 0,5s;
  padding: 30px 0px;
  margin-bottom: 60px;
}

.authen{
  width: 40%;
  -webkit-animation-duration: 8s;
  -webkit-animation-delay: 3s;
}

.temp{
  position: fixed;
  top: 0px;
  left: 0px;
}

</style>
