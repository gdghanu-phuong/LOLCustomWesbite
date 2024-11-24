<template>
<div class="login">
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-4 col-md-5 col-sm-6 bg-light text-center rounded" id="login">
                <h1 class="text-center pt-4">Sign In</h1>
                <form ref="form" action="#" @submit.prevent="login">
                <input type="text" class="form-control" placeholder="username" v-model="username">
                <span v-if="errors.username">{{errors.username}}</span>
                <input type="password" class="form-control" placeholder="password" v-model="password">
                <span v-if="errors.password">{{errors.password}}</span>
                <ul class="list-inline text-center">
                    <li class="list-inline-item" v-for="btn in socialBtn">
                        <button type="button" class="rounded" :class="btn.color">
                            <i :class="btn.symbol"></i>
                        </button>
                    </li>
                </ul>
                <p>Haven't got account? <router-link to="/signup">Create one.</router-link></p>
                <div class="pb-4">
                    <button type="submit" class="p-2 w-50 rounded">
                        <i class="fa fa-arrow-right fa-2x"></i>
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
    <footer class="bg-dark text-white">
        <ul class="list-inline">
            <li class="list-inline-item">Support</li>
            <li class="list-inline-item ps-3">Privacy notice</li>
            <li class="list-inline-item ps-3">Terms of service</li>
        </ul>
    </footer>
    </div>
</template>

<script>
import axios from 'axios';
export default({
    name: "LoginPage",
    data(){
        return{
            socialBtn: [
                {symbol:"fab fa-facebook", color: "bg-primary"},
                {symbol: "fab fa-instagram", color: "bg-danger"},
                {symbol: "fab fa-tiktok", color: "bg-light"}
            ],
            msg: "",
            username: "",
            password: "",
            errors: {}
        }
    },
    methods: {
        async login(e){
            var result = true;
            this.errors = {};

            if(!this.username.trim()){
                result = false;
                this.errors.username = "Username is required";
            }

            if(!this.password.trim()){
                result = false;
                this.errors.password = "Password is required";
            }

            if(result){
                try{
                    let response = await axios.get(`http://localhost:3000/users?username=${this.username}`);
                    let passwordRes = await axios.get(`http://localhost:3000/users?password=${this.password}`);
                    if(response.data.length === 0 || passwordRes.data.length === 0){
                        result = false;
                        this.errors.password = "Username or password is incorrect";
                    }else{
                        localStorage.setItem("user-info", JSON.stringify(response.data[0]));
                        this.$router.push({name: "home"}).then(() => { this.$router.go(0) });
                    }
                }catch(error){
                    console.error("An error occurred while checking the credentials:", error);
                    result = false;
                    this.errors.password = "An error occurred. Please try again later";
                }
            }
        }
    }
})
</script>

<style scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container-fluid{
    height: 100%;
    width: 100%;
    background-image: url('https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-80471666c140f790f28dff68d72c384b');
    background-repeat:  no-repeat;
    background-size: cover;
}

#login{
    margin-top: 6rem;
}

input{
    margin-top: 1rem;
}
button {
    margin-top: 1rem;
}

button:hover{
    opacity: 0.8;
}
span{
    font-style: italic;
    font-size: 10px;
    color: red;
}

input::placeholder{
    font-size: smaller;
    text-transform: capitalize;
    font-weight: bold;
}

footer {
    position: absolute;
    height: 3.5rem;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
    color: white;
    padding: 1rem;
    text-align: center;
}
</style>