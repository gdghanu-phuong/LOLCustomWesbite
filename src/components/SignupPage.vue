<template>
<div class="signup">
    <div class="container-fluid">
        <div class="row justify-content-center signup-form">
            <div class="col-lg-4 col-md-5 col-sm-6 bg-light rounded">
                <form class="form-inline" action="#" @submit.prevent="signUp">
                    <h1 class="text-center">Sign Up</h1>
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <input type="text" class="form-control" placeholder="first name" v-model="fname">
                                <span v-if="errors.fname">{{errors.fname}}</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6">
                                <input type="text" class="form-control" placeholder="last name" v-model="lname">
                                <span v-if="errors.lname">{{errors.lname}}</span>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12">
                                <input type="text" class="form-control" placeholder="Preferred username" v-model="username">
                                <span v-if="errors.username">{{errors.username}}</span>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 mt-3">
                                <input type="password" class="form-control" placeholder="password" v-model="password">
                                <span v-if="errors.password">{{errors.password}}</span>
                                <input type="password" class="form-control" placeholder="Confirm password" v-model="rePassword">
                                <span v-if="errors.rePassword">{{errors.rePassword}}</span>
                            </div>
                        </div>
                        <ul class="list-inline text-center">
                            <li class="list-inline-item" v-for="btn in socialBtn">
                                <button type="button" class="rounded" :class="btn.color">
                                    <i :class="btn.symbol"></i>
                                </button>
                            </li>
                        </ul>
                        <div class="text-center pb-5">
                            <button type="submit" class="p-2 w-50 rounded">Create Account</button>
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
export default{
    name: "SignupPage",
    data(){
        return {
            socialBtn: [
                {symbol:"fab fa-facebook", color: "bg-primary"},
                {symbol: "fab fa-instagram", color: "bg-danger"},
                {symbol: "fab fa-tiktok", color: "bg-light"}
            ],
            fname: "",
            lname: "",
            username: "",
            password: "",
            rePassword: "",
            errors: {}
        }
    },
    methods: {
        async signUp(){
        var result = true;
        this.errors = {};
        // define all rules
        const namePattern = /^[a-zA-Z\s]+$/;
        const usernamePattern = /^[a-zA-Z0-9._*-]+$/;
        const passwordPattern = /^[a-zA-Z0-9._*-]+$/;

        // Validate first name length
        if(this.fname.length>0){
            if (!namePattern.test(this.fname)) {
            result = false;
            this.errors.fname = "First name only contain letters.";
        }
        }else {
            result = false;
            this.errors.fname = "First name is required";
        }

        if(this.lname.length>0){
            if (!namePattern.test(this.lname)) {
            result = false;
            this.errors.lname = "Last name only contain letters.";
        }
        }else {
            result = false;
            this.errors.lname = "Last name is required";
        }

        if(this.username.length > 7 && this.username.length < 16){
            if (!usernamePattern.test(this.username)) {
            result = false;
            this.errors.username = "Username only contain letters, numbers and characters (-,_,*,.)";
            }else {
                try{
                // Check if username already exist
                    let response = await axios.get(`http://localhost:3000/users?username=${this.username}`);
                    if(response.data.length>0){
                        result=false;
                        this.errors.username = "Username already exists";
                    }
                }catch(error){
                    console.error("An error occurred while checking the username:", error);
                    result = false;
                    this.errors.username = "Error checking username. Please try again later.";
                }
            }
        }else{
            result = false;
            this.errors.username = "Username required 8-15 characters."
        }

        if(this.password.length > 7){
            if(!passwordPattern.test(this.password)){
                result = false;
                this.errors.password = "Password not valid"
            }
        }else {
            result = false;
            this.errors.password = "Password required more than 8 characters"
        }

        if(this.rePassword.trim()){
            if(this.rePassword != this.password){
            this.errors.rePassword = "Password not match"
            result = false;
            }
        }else{
            this.errors.rePassword = "Required"
            result = false;
        }


        if (result) {
            try {
                let user = await axios.post("http://localhost:3000/users", {
                    fname: this.fname,
                    lname: this.lname,
                    username: this.username,
                    password: this.password,
                    role: "user"
                });

                if (user.status === 201) {
                    alert("Your account has been successfully created! Please log in again.");
                    // Redirect to login page
                    this.$router.push({name: "login"});
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
      }
    }
}
</script>

<style scoped>
.signup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container-fluid {
    width: 100%;
    height: 100%;
    background-image: url('https://steamuserimages-a.akamaihd.net/ugc/2010328424759555731/7167A3ECE235D7D7E9CDD5E866E9C556F20C22BD/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false');
    background-repeat: no-repeat;
    background-size: cover;
}

.signup-form{
    margin-top: 5rem;
}

input {
    margin-top: 1rem;
}

input::placeholder {
    font-size: smaller;
    text-transform: capitalize;
    font-weight: bold;
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
footer {
    position: absolute;
    height: 3.5rem;
    bottom: 0;
    width: 100%;
    color: white;
    padding: 1rem;
    text-align: center;
}
</style>