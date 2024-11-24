<template>
    <div class="shop">
        <div class="container-fluid content">
            <div class="row mb-4">
                <div class="col-md-12 col-sm-12 mb-5" v-if="isScreenSize">
                    <h1>Category</h1>
                    <select class="form-select shadow-none text-capitalize" @change="handleSelectChange">
                        <option value="-1">All Items</option>
                        <option v-for="(type, index) in uniqueTypes" :value="type" :key="index">{{ type }}</option>
                    </select>
                </div>
                <div class="col-lg-4" v-else>
                    <h1>Category</h1>
                    <ul class="list-group">
                        <li @click="filterCategory('All', -1)" class="list-group-item" :class="{ current: isClicked === -1 }">
                            All Items
                        </li>
                        <li v-for="(type, index) in uniqueTypes" @click="filterCategory(type, index)" :key="index" class="list-group-item text-capitalize" :class="{ current: isClicked === index }">
                            {{ type }}
                        </li>
                    </ul>
                </div>
                <div class="col-lg-8 col-md-12 col-sm-12" v-if="isLoggedIn">
                    <h1 class="text-capitalize">{{ title }}</h1>
                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-6" v-for="item in filteredItems" :key="item.name">
                            <div class="card my-4">
                                <img class="card-img-top" :src="item.image" height="229px" width="229px" alt="Card image">
                                <div class="card-body">
                                    <h4 class="card-title">{{ item.name }}</h4>
                                    <p class="card-text text-muted">AUD {{ item.price }}</p>
                                    <button type="button" class="rounded shadow-none" @click="addItemToCart(item)">
                                        <i class="fas fa-cart-plus"></i>
                                        Add to Cart
                                    </button>
                                </div>
                                <div class="card-footer">
                                    <button type="button" class="btn shadow-none" @click="toggleVote(item)">
                                        <i class="fas fa-heart" :class="{ 'text-danger': isVoted(item) }"></i>
                                        <span class="vote-count">{{ getVoteCount(item.name) }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="float-button" v-if="isLoggedIn">
                    <CartModal
                        class="mt-4 w-75"
                        :show="showCart"
                        :cartItems="cartItems"
                        :currentUser="currentUser"
                        @close="showCart = false"
                        @update-cart="updateCartItems"
                        @item-removed="handleItemRemoved"
                    ></CartModal>
                    <button @click="showCart = true" class="btn btn-info text-white">
                        <i class="fas fa-shopping-cart"></i>
                        View Your Cart
                    </button>
                </div>
                <div class="col-lg-8 col-md-12 col-sm-12 text-center" v-else>
                    <h1>Log in to see more content.</h1>
                </div>
                <div class="float-buttons" v-if="isAdmin">
                    <CreateItemForm class="mt-4" :show="showCreateForm" @close="showCreateForm = false"></CreateItemForm>
                    <DeleteItemForm class="mt-4" :show="showDeleteForm" @close="showDeleteForm = false"></DeleteItemForm>
                    <EditItemForm class="mt-4" :show="showEditForm" @close="showEditForm = false"></EditItemForm>
                    <button @click="showCreateForm = true; showDeleteForm = false; showEditForm = false" class="btn btn-success me-3">Create</button>
                    <button @click="showDeleteForm = true; showCreateForm = false; showEditForm = false" class="btn btn-danger me-3">Delete</button>
                    <button @click="showEditForm = true; showDeleteForm = false; showCreateForm = false" class="btn btn-primary">Edit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CreateItemForm from './admin_components/CreateItemForm.vue';
import DeleteItemForm from './admin_components/DeleteItemForm.vue';
import EditItemForm from './admin_components/EditItemForm.vue';
import CartModal from './CartModal.vue';

export default {
    name: 'ShopPage',
    components: {
        CreateItemForm,
        DeleteItemForm,
        EditItemForm,
        CartModal
    },
    data() {
        return {
            isLoggedIn: false,
            isAdmin: false,
            itemList: [],
            filteredItems: [],
            title: 'All Items',
            isClicked: -1,
            isScreenSize: false,
            votedItems: [],
            currentUser: null,
            voteCounts: {},
            showCart: false,
            cartItems: [],
            // admin
            showCreateForm: false,
            showDeleteForm: false,
            showEditForm: false
        };
    },
    mounted() {
        const userInfo = localStorage.getItem('user-info');
        if (userInfo) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(userInfo);
            this.isAdmin = this.currentUser.role === 'admin';
            this.loadVotedItems();
            this.loadCartItems();
        }
        this.fetchItemsData();
        this.loadVoteCounts();
        this.isScreenSize = this.checkScreenSize();
        window.addEventListener('resize', () => {
            this.isScreenSize = this.checkScreenSize();

        });
    },
    computed: {
        uniqueTypes() {
            const types = this.itemList.map(item => item.type);
            return [...new Set(types)];
        }
    },
    methods: {
        fetchItemsData() {
            axios.get('http://localhost:3000/items')
                .then(response => {
                    this.itemList = response.data.map(item => ({ ...item, isAdded: false, quantity: 0 }));
                    this.filteredItems = this.itemList;
                })
                .catch(error => {
                    console.error("Error fetching data: ", error);
                });
        },
        checkScreenSize() {
            return window.innerWidth < 992;
        },
        handleSelectChange(event) {
            const selectedType = event.target.value;
            this.filterCategory(selectedType, this.uniqueTypes.indexOf(selectedType));
        },
        filterCategory(type, index) {
            this.isClicked = index;
            if (type === 'All') {
                this.title = 'All Items';
                this.filteredItems = this.itemList;
            } else {
                this.title = type;
                this.filteredItems =  this.itemList.filter(item => item.type === type);
            }
        },
        isVoted(item) {
            return this.votedItems.includes(item.name);
        },
        toggleVote(item) {
            if (this.isVoted(item)) {
                this.removeVote(item.name);
            } else {
                this.addVote(item.name);
            }
        },
        addVote(itemName) {
            const voteData = {
                username: this.currentUser.username,
                item_name: itemName
            };
            axios.post('http://localhost:3000/votes', voteData)
                .then(response => {
                    this.votedItems.push(itemName);
                    this.loadVoteCounts();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        removeVote(itemName) {
            axios.get(`http://localhost:3000/votes?username=${this.currentUser.username}&item_name=${itemName}`)
                .then(response => {
                    if (response.data.length) {
                        const voteId = response.data[0].id;
                        axios.delete(`http://localhost:3000/votes/${voteId}`)
                            .then(() => {
                                this.voteCounts[itemName] = (this.voteCounts[itemName] || 0) - 1;
                                this.votedItems = this.votedItems.filter(item => item !== itemName);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        },
        loadVotedItems() {
            axios.get(`http://localhost:3000/votes?username=${this.currentUser.username}`)
                .then(response => {
                    this.votedItems = response.data.map(vote => vote.item_name);
                })
                .catch(error => {
                    console.error(error);
                });
        },
        loadVoteCounts() {
            axios.get('http://localhost:3000/votes')
                .then(response => {
                    const counts = response.data.reduce((acc, vote) => {
                        acc[vote.item_name] = (acc[vote.item_name] || 0) + 1;
                        return acc;
                    }, {});
                    this.voteCounts = counts;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getVoteCount(itemName) {
            return this.voteCounts[itemName] || 0;
        },
        loadCartItems() {
            axios.get(`http://localhost:3000/users/${this.currentUser.id}`)
                .then(response => {
                    this.cartItems = response.data.cart;
                    this.cartItems.forEach(cartItem => {
                        const item = this.itemList.find(item => item.name === cartItem.name);
                        if (item) {
                            item.isAdded = true;
                            item.quantity = cartItem.quantity; // Set the quantity from the cart
                        }
                    });
                })
                .catch(error => {
                    console.error("Error loading cart items: ", error);
                });
        },
        addItemToCart(item) {
            const existingCartItem = this.cartItems.find(cartItem => cartItem.name === item.name);
            if (existingCartItem) {
                // Item already exists in the cart, update its quantity
                existingCartItem.quantity++;
                // Update the cart in the backend
                axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, {
                    cart: this.cartItems
                }).then(response => {
                    this.cartItems = response.data.cart;
                    // Update quantity in itemList
                    const itemInList = this.itemList.find(listItem => listItem.name === item.name);
                    if (itemInList) {
                        itemInList.quantity++;
                        alert("This item has already in the cart. Add more!");
                    }
                }).catch(error => {
                    console.error("Error updating cart: ", error);
                });
            } else {
                // Item is not in the cart, add it with quantity 1
                item.quantity = 1;
                axios.patch(`http://localhost:3000/users/${this.currentUser.id}`, {
                    cart: [...this.cartItems, item]
                }).then(response => {
                    this.cartItems = response.data.cart;
                    // Update isAdded and quantity in itemList
                    const itemInList = this.itemList.find(listItem => listItem.name === item.name);
                    if (itemInList) {
                        itemInList.isAdded = true;
                        itemInList.quantity = 1;
                        alert("Item added!");
                    }
                }).catch(error => {
                    console.error("Error adding item to cart: ", error);
                });
            }
        },
        updateCartItems(newCart) {
            this.cartItems = newCart;
            this.itemList.forEach(item => {
                const cartItem = this.cartItems.find(cartItem => cartItem.name === item.name);
                if (cartItem) {
                    item.isAdded = true;
                    item.quantity = cartItem.quantity; // Update the quantity from the cart
                } else {
                    item.isAdded = false;
                    item.quantity = 0; // Reset quantity if not in cart
                }
            });
        },
        handleItemRemoved(itemName) {
            const item = this.itemList.find(listItem => listItem.name === itemName);
            if (item) {
                item.isAdded = false;
                item.quantity = 0; // Reset quantity when removed
            }
        }
    }
};
</script>

<style scoped>
button:focus {
    outline: none;
}

.card {
    height: 500px;
}


.current {
    background-color: #00CCCC;
    color: white;
}

.float-button {
    position: fixed;
    bottom: 70px;
    left: 2px;
    z-index: 1000;
}

.float-buttons {
    position: fixed;
    bottom: 10px;
    z-index: 1000;
}
</style>
