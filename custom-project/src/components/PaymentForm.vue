<template>
    <div class="payment">
        <div class="container content">
            <div class="row">
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <!--Screen table and mobile, change to dropdown-->
                    <button class="btn btn-dark w-100 mb-3 d-lg-none" @click="toggleDropdown">
                        {{toggleContent}} <i :class="isDropdownVisible ? 'fas fa-arrow-up': 'fas fa-arrow-down'"></i>
                    </button>
                    <div v-if="isDropdownVisible" class="dropdown d-lg-none">
                        <ul class="list-group">
                            <li v-for="(item, index) in cartItems" :key="item.name" class="list-group-item">
                                <img alt="item_image" :src="item.image" width="70px" height="70px" class="bg-light"> {{ item.name }} x {{ item.quantity }} - <strong>{{ (item.price * item.quantity).toFixed(2) }}</strong>
                            </li>
                            <li class="list-group-item fw-bold">
                                Total: {{ totalAmount }} AUD
                            </li>
                        </ul>
                    </div>
                    <!-- Screen large, display table -->
                    <table class="table d-none d-lg-table caption-top">
                        <caption class="h1 text-center">Your Order</caption>
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">No.</th>
                                <th colspan="2" scope="col">Item</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total(AUD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cartItems" :key="item.name">
                                <th scope="row">{{ index + 1 }}</th>
                                <td colspan="2">
                                    <div class="row">
                                        <div class="col-lg-3">
                                        <img alt="item_image" :src="item.image" width="70px" height="70px" class="bg-light">
                                        </div>
                                        <div class="col-lg-9">
                                            {{ item.name }}
                                        </div>
                                    </div>
                                </td>
                                <td>{{item.quantity}}</td>
                                <td>{{ (item.price * item.quantity).toFixed(2) }} </td>
                            </tr>
                            <tr class="fw-bold">
                                <th colspan="3">Your Order is</th>
                                <td colspan="2">{{ totalAmount }} AUD</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Payment form -->
                <div class="col-lg-6 col-md-12 col-sm-12">
                    <h1 class="text-center">Fill in this form to checkout</h1>
                    <form class="form-inline p-2 bg-light" action="#" @submit.prevent="checkout">
                        <div class="row">
                            <label class="fw-bold" for="name">Name </label>
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                <input type="text" class="form-control" placeholder="First name" v-model="fname">
                                <span v-if="errors.fname">{{errors.fname}}</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                <input type="text" class="form-control" placeholder="Last name" v-model="lname">
                                <span v-if="errors.lname">{{errors.lname}}</span>
                            </div>
                            <label class="fw-bold mt-3" for="Contact information">Contact Information </label>
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                <input type="text" class="form-control" placeholder="Email" v-model="email">
                                <span v-if="errors.email">{{errors.email}}</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                <input type="text" class="form-control" placeholder="Phone number" v-model="phoneNum">
                                <span v-if="errors.phoneNum">{{errors.phoneNum}}</span>
                            </div>
                            <div class="col-lg-12 col-md-12 col-sm-12 mt-3">
                                <input type="text" class="form-control" placeholder="Address" v-model="address">
                                <span v-if="errors.address">{{errors.address}}</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 mt-4">
                                <label class="fw-bold" for="paymentMethod">Select Payment Method</label><br>
                                <input type="radio" id="cash" name="paymentMethod" value="Cash" v-model="paymentMethod.method" checked>
                                <label for="cash">Cash</label><br>
                                <input type="radio" id="visa" name="paymentMethod" value="Visa" v-model="paymentMethod.method">
                                <label for="visa">Visa</label><br>
                                <input type="radio" id="mastercard" name="paymentMethod" value="MasterCard" v-model="paymentMethod.method">
                                <label for="mastercard">MasterCard</label><br>
                                <input type="radio" id="american express" name="paymentMethod" value="American Express" v-model="paymentMethod.method">
                                <label for="american express">American Express</label><br>
                            </div>
                            <div class="row" v-if="paymentMethod.method !== 'Cash'">
                                <div class="col-lg-6 col-md-6 col-sm-6 mt-3">
                                    <label for="card number">Card Number</label><br>
                                    <input type="text" class="form-control" placeholder="Card number" v-model="paymentMethod.cardNumber">
                                    <span v-if="errors.cardNumber">{{errors.cardNumber}}</span>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 mt-3">
                                    <label for="Expiry Date">Expiry Date</label><br>
                                    <input type="text" class="form-control" placeholder="MM/YY" v-model="paymentMethod.expiryDate">
                                    <span v-if="errors.expiryDate">{{errors.expiryDate}}</span>
                                </div>
                                <div class="col-lg-3 col-md-3 col-sm-3 mt-3">
                                    <label for="CVC">CVC</label><br>
                                    <input type="text" class="form-control" placeholder="CVC" v-model="paymentMethod.cvc">
                                    <span v-if="errors.cvc">{{errors.cvc}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-center pb-5">
                            <button type="submit" class="p-2 w-50 rounded mt-3">Checkout</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    name: "PaymentForm",
    data(){
        return {
            currentUser: null,
            cartItems: [],
            fname: "",
            lname: "",
            email: "",
            phoneNum: "",
            address: "",
            paymentMethod: {method: "Cash", cardNumber: "", expiryDate: "", cvc: ""},
            allPaymentMethod: [
                {
                    method: "Visa",
                    cardNumberRule: /^4[0-9]{12}(?:[0-9]{3})?$/,
                    cvcRule: /^\d{3}$/
                },
                {
                    method: "MasterCard",
                    cardNumberRule: /^5[1-5][0-9]{14}$/,
                    cvcRule: /^\d{3}$/
                },
                {
                    method: "American Express",
                    cardNumberRule: /^3[47][0-9]{13}$/,
                    cvcRule: /^\d{4}$/
                }
            ],
            errors: {},
            loading: false,
            isDropdownVisible: false,
            toggleContent: "Show order summary"
        }
    },
    mounted(){
        const userInfo = localStorage.getItem("user-info");
        if(userInfo){
            this.currentUser = JSON.parse(userInfo);
            this.loadCartItems();
        }
    },
    computed: {
        totalAmount() {
            const totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            return totalPrice.toFixed(2);
        }
    },
    methods: {
        toggleDropdown() {
            this.isDropdownVisible = !this.isDropdownVisible;
            if(this.isDropdownVisible){
                this.toggleContent = "Hide order summary";
            }else {
                this.toggleContent = "Show order summary";
            }
        },
        loadCartItems(){
            axios.get(`http://localhost:3000/users/${this.currentUser.id}`)
                .then(response =>{
                    this.cartItems = response.data.cart;
                })
                .catch(e=>{
                    console.log("Error:", e)
                })
        },
        checkout() {
            this.loading = true;
            var result = true;
            this.errors = {};
            //validate pattern
            const namePattern = /^[a-zA-Z\s]+$/;
            const emailPattern = /^\S+@\S+\.\S+$/;
            const phonePattern = /^04\d{8}$/;
            const addressPattern = /^[a-zA-Z0-9\s,.'-]+$/;
            const expiryDatePattern = /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/;
            // name validate
            if(this.fname.trim()){
                if (!namePattern.test(this.fname)) {
                    result = false;
                    this.errors.fname = "First name only contain letters.";
                }
            }else{
                result = false;
                this.errors.fname = "First name is required."
            }

            if(this.lname.trim()){
                if (!namePattern.test(this.lname)) {
                    result = false;
                    this.errors.lname = "Last name only contain letters.";
                }
            }else{
                result = false;
                this.errors.lname = "Last name is required."
            }

            // email validate
            if(this.email.trim()){
                if (!emailPattern.test(this.email)) {
                    result = false;
                    this.errors.email = "Email invalid.";
                }
            }else{
                result = false;
                this.errors.email = "Email is required."
            }

            //phone validate
            if(this.phoneNum.trim()){
                if (!phonePattern.test(this.phoneNum)) {
                    result = false;
                    this.errors.phoneNum = "Phone invalid. Should start with 04 and have 10 digits.";
                }
            }else{
                result = false;
                this.errors.phoneNum = "Phone is required."
            }

            //address validate
            if(this.address.trim()){
                if(this.address.length>50){
                    if(!addressPattern.test(this.address)){
                        result = false;
                        this.errors.address = "Address only contain numbers and letter. No special characters.";
                    }
                    result = false;
                    this.errors.address = "Address maximum 50 characters.";
                }
            }else {
                result = false;
                this.errors.address = "Address is required."
            }

            //card validate
            if(this.paymentMethod.method !== "Cash"){
                const selectedMethod = this.allPaymentMethod.find(method => method.method === this.paymentMethod.method);
                const cardNumberPattern = new RegExp(selectedMethod.cardNumberRule);
                const cvcPattern = new RegExp(selectedMethod.cvcRule);

                if(this.paymentMethod.cardNumber.trim()){
                    const cardNumberWithoutSpaces = this.paymentMethod.cardNumber.replace(/\s/g, ''); // Remove spaces
                    if(!cardNumberPattern.test(cardNumberWithoutSpaces)){
                        result = false;
                        this.errors.cardNumber = "Card number is invalid";
                    }
                }else {
                    result = false;
                    this.errors.cardNumber = "Card number is required";
                }

                if(this.paymentMethod.expiryDate.trim()){
                    if(!expiryDatePattern.test(this.paymentMethod.expiryDate)){
                        result = false;
                        this.errors.expiryDate = "Expiry Date is invalid. Format should be DD/MM"
                    }
                }else {
                    result = false;
                    this.errors.expiryDate = "Expiry Date is required";
                }

                if(this.paymentMethod.cvc.trim()){
                    if(!cvcPattern.test(this.paymentMethod.cvc)){
                        result = false;
                        this.errors.cvc = "CVC is invalid."
                    }
                }else{
                    result = false;
                    this.errors.cvc = "CVC is required"
                }
            }

            if (result) {
                // Reset form
                this.fname = "";
                this.lname = "";
                this.email = "";
                this.phoneNum = "";
                this.address = "";
                this.paymentMethod = {method: "Cash", cardNumber: "", expiryDate: "", cvc: ""};
                this.clearCartItems();
                alert("Order success!");
                this.loading = true;
                setTimeout(() => {
                    this.$router.push({ name: "loading" }).then(() => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$router.push({ name: "confirm" });
                    }, 2000);
                    });
                }, 500);
            }
        },
        clearCartItems() {
            axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, { cart: [] })
            .then(response => {
                // Clear cartItems array
                this.cartItems = [];
            })
            .catch(error => {
                console.error("Error clearing cart items:", error);
            });
        }
    }
}
</script>

<style scoped>

span{
    font-style: italic;
    font-size: 10px;
    color: red;
}

.payment {
    margin-top: 20px;
}

.dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
}


</style>