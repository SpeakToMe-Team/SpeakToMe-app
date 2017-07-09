<template>
  <div class="dashboard">    
    <h1>{{ msg }}</h1>
    <router-link to="/">Welcome 2</router-link><br />
    <router-link to="/settings">Settings</router-link><br />
    <a href="https://www.microsoft.com/cognitive-services/en-us/sign-up" target="_blank">Subscription Bing Speech API</a>
    <a href="https://docs.microsoft.com/fr-fr/azure/cognitive-services/speech/getstarted/getstartedjswebsockets" target="_blank">Bing Speech API</a>



    <table width="100%">
 
        <!--
        <tr>
            <td align="right"><a href="https://www.microsoft.com/cognitive-services/en-us/sign-up" target="_blank">Subscription</a>:</td>
            <td><input id="key" type="text" size="40" value="KEY_API"></td>
        </tr>
        -->
        <!--
        <tr>
            <td align="right">Laguage:</td>
            <td align="left">
                <select id="languageOptions">
                    <option value="zh-CN">Chinese - CN</option>
                    <option value="en-GB">English - GB</option>
                    <option value="en-US">English - US</option>
                    <option value="fr-FR" selected="selected">French - FR</option>
                    <option value="de-DE">German - DE</option>
                    <option value="it-IT">Italian - IT</option>
                    <option value="es-ES">Spanish - ES</option>
                </select>
            </td>
        </tr>
        -->
        <!--
        <tr>
            <td align="right">Format:</td>
            <td align="left">
                <select id="formatOptions">
                    <option value="Simple" selected="selected">Simple Result</option>
                    <option value="Detailed">Detailed Result</option>
                </select>
            </td>
        </tr>
        -->
        <tr>
            <td></td>
            <td>
                <button id="startBtn" disabled="disabled">Start</button>
                <button id="stopBtn" disabled="disabled">Stop</button>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>Current hypothesis: <span id="hypothesisDiv"></span></td>
        </tr>
        <tr>
            <td></td>
            <td>
                <textarea id="phraseDiv" style="width:500px;height:200px"></textarea>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>Status: <span id="statusDiv"></span></td>
        </tr>
    </table>
  </div>
  
</template>

<script>
export default {
  name: 'dashobard',
  data () {
    return {
      msg: 'Dashboard'
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
