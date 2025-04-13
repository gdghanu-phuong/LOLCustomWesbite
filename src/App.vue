<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <div class="logo">
          <span class="navbar-brand">
            <img src="@/assets/images/logo.png" alt="company_logo" width="100" height="30">
          </span>
          <span class="navbar-brand ps-3" href="#">
            <img src="@/assets/images/lol_logo.png" alt="game_logo" width="70" height="60">
          </span>
        </div>
        <hr>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/tutorial" exact-active-class="active">Tutorial</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/champions" exact-active-class="active">Champions</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/shop" exact-active-class="active">Shop</router-link>
            </li>
          </ul>
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="d-flex nav-item">
              <router-link class="nav-link" to="/login" v-if="!isLoggedIn" exact-active-class="active">Log In</router-link>
              <span v-else class="nav-link">{{ username }}</span>
            </li>
            <li class="d-flex nav-item">
              <router-link class="nav-link" to="/signup" v-if="!isLoggedIn" exact-active-class="active">Sign Up</router-link>
              <span v-else class="nav-link" @click="logout">Log Out</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view/>
</template>

<script>
export default{
    data(){
        return{
            isLoggedIn: false,
            username: ""
        }
    },
    mounted(){
        const userInfo = localStorage.getItem('user-info');
        if(userInfo){
            this.isLoggedIn = true;
            this.username = JSON.parse(userInfo).username;
        }
    },
    methods: {
        logout(){
            localStorage.removeItem('user-info');
            this.isLoggedIn = false;
            this.username = "";
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-item{
    margin-left: 2rem;
    text-transform: uppercase;
    border-bottom: 3px solid transparent;
}
.nav-item:hover {
    border-bottom: 3px solid #00CCCC;
}
.nav-link {
  color: white;
}

.navbar {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.navbar-nav .nav-link.active {
  color: #00CCCC;
}

</style>