<template>
    <div class="cart-modal border border-dark rounded p-3 bg-light" v-if="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="fas fa-shopping-cart me-2"></i>
                    <h4 class="modal-title">CART</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-secondary">
                        <thead class="table-dark text-white">
                            <tr>
                                <th scope="col">No.</th>
                                <th scope="col">Item</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Total Price (AUD)</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cartItems" :key="item.name">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>
                                    <img alt="item_image" :src="item.image" width="50px" height="50px" class="bg-light">
                                    {{ item.name }}
                                </td>
                                <td>
                                    <input type="number" v-model.number="item.quantity" @blur="validateQuantity(item)" min="1" class="form-control shadow-none">
                                </td>
                                <td>{{ (item.price * item.quantity).toFixed(2) }} </td>
                                <td>
                                    <button type="button" class="btn text-primary text-decoration-underline" @click="removeCartItem(item)">remove</button>
                                </td>
                            </tr>
                            <tr class="fw-bold">
                                <th colspan="3">Total:</th>
                                <td colspan="2">{{ totalAmount }} AUD</td>
                            </tr>
                        </tbody>
                    </table>
                    <span v-if="error && cartItems.length === 0">{{error}}</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-dark me-2" @click="proceedPayment">Proceed to payment</button>
                    <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CartModal',
    data(){
        return{
            error: ""
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        cartItems: {
            type: Array,
            required: true
        },
        currentUser: {
            type: Object,
            required: true
        }
    },
    computed: {

        totalAmount() {
            const totalPrice = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            return totalPrice.toFixed(2);
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        removeCartItem(item) {
            const updatedCart = this.cartItems.filter(cartItem => cartItem.name !== item.name);
            axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, {
                cart: updatedCart
            }).then(response => {
                this.$emit('update-cart', response.data.cart);
                this.$emit('item-removed', item.name);
            }).catch(error => {
                console.error("Error removing item from cart: ", error);
            });
        },
        validateQuantity(item) {
            if (!Number.isInteger(item.quantity)) {
                item.quantity = item.quantity.toFixed(0);
            } else if (item.quantity === 0) {
                this.removeCartItem(item);
            } else {
                this.updateCart();
            }
        },
        updateCart() {
            axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, {
                cart: this.cartItems
            }).then(response => {
                this.$emit('update-cart', response.data.cart);
            }).catch(error => {
                console.error("Error updating cart: ", error);
            });
        },
        proceedPayment(){
            if (this.cartItems.length === 0) {
                this.error = "Your cart is empty";
            } else {
                setTimeout(() => {
                    this.$router.push({ name: "loading" }).then(() => {
                    setTimeout(() => {
                        this.loading = false;
                        this.$router.push({name: "payment"});
                    }, 1000);
                    });
                }, 500);
            }
        }
    }
}
</script>

<style scoped>
.cart-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background-color: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

span{
    font-style: italic;
    color: red;
}
</style>
