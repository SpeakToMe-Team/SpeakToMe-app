<template>
  <div class="dashboard">
    <nav class="container-fluid">
        <router-link to="/">
        <div class="logo animated bounceInLeft">
            <img src="../assets/images/microphone.png" alt="logo">
            <p>Speak To Me</p>
        </div>
        </router-link>
        <div class="perso animated bounceInRight">
        
            <div class="settings">
                <router-link to="/settings">
                    <i class="fa fa-cogs fa-spin"></i>
                </router-link>
            </div>
            <div class="myAccount">
                <i class="fa fa-user" aria-hidden="true"></i>
            </div>
        </div>
    </nav>
    <section class="container">
        <div class="row">
            <div class="col-sm-12 col-md-8 col-lg-9">
                <article class="search col-sm-12 animated zoomInUp">
                    <i class="fa fa-microphone" aria-hidden="true"></i>
                    <input type="text" name="request">
                </article>

                <article class="result col-sm-12 animated zoomInUp">
                </article>

                <article class="recommandation col-sm-12 animated zoomInUp">
                </article>
            </div>
            
            <div class="col-sm-12 col-md-4 col-lg-3">
                <article class="help col-md-12 animated zoomInUp">
                </article>
            </div>
            
        </div>
    </section>
    <section>
        <router-link to="/">Welcome</router-link><br />
        <router-link to="/settings">Settings</router-link>
    </section>
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
    *{
        margin: 0;
        padding: 0;
    }

    nav{
        height: 65px;
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #f4f4f4;
    }
    nav a{
        text-decoration: none;
        color: inherit;
    }
    nav .logo{
        float: left;
        text-align: left;
        height: 100%;
        display: flex;
        padding: 0px 10px;
        -webkit-animation-duration: 1s;
        -webkit-animation-delay: 0s;
    }
    nav .logo img,p{
        display: inline-block;
        margin: auto;
    }
    nav .logo img{
        width: 45px;
        margin-right: 5px;
    }
    nav .logo p{
        font-family: 'Reenie Beanie', cursive;
        font-size: 27px;
        font-weight: bold; 
    }
    nav .perso{
        float: right;
        height: 100%;
        display: flex;
        -webkit-animation-duration: 1s;
        -webkit-animation-delay: 0s;
    }
    nav .perso .myAccount,.settings{
        display: inline-block;
        width: 50px;
        margin: auto;
        font-size: 25px;
        margin-right: 15px;
    }

    section{
        margin: auto;
    }

    article{
        margin-bottom: 20px;
    }

    .search{
        height: 70px;
        -webkit-animation-duration: 0.8s;
        -webkit-animation-delay: 1.5s;
        text-align: center;
        display: flex;
        border: 3px solid black;
        border-radius: 50px;
    }
    .search i,input{
        display: inline-block;
        margin: auto;
    }
    .search i{
        font-size: 30px;
        color: white;
        background-color: black;
        width: 50px;
        height: 50px;
        padding-top: 11px;
        margin-left: 11px;
        border-radius: 30px;
    }
    .search input{
        width: 83%;
        height: 100%;
        margin-right: 0;
        margin-left: 0;
        padding-right: 20px;
        border: none;
        border-radius: 0px 50px 50px 0px;
        outline:  none;
    }
    .result{
        background-color:blue;
        height: 500px;
        -webkit-animation-duration: 0.8s;
        -webkit-animation-delay: 2s;
    }
    .recommandation{
        background-color:blueviolet;
        height: 200px;
        -webkit-animation-duration: 0.8s;
        -webkit-animation-delay: 2.5s;
    }
    .help{
        background-color:brown;
        height: 500px;
        -webkit-animation-duration: 0.8s;
        -webkit-animation-delay: 3s;
    }
    
    
</style>
