<template>
    <div class="cart-modal" v-if="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Item</h5>
                    <button type="button" class="btn-close ps-2" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <!-- delete item form -->
                    <form @submit.prevent="deleteItem">
                        <div class="form-group pt-2">
                            <select class="form-select shadow-none text-capitalize" v-model="itemType" @change="handleSelectChange">
                                <option value="">Select Type</option>
                                <option v-for="(type, index) in uniqueTypes" :value="type" :key="index">{{ type }}</option>
                            </select>
                            <span v-if="errors.itemType">{{ errors.itemType }}</span>
                        </div>
                        <div class="form-group pt-2">
                            <select class="form-select shadow-none text-capitalize" v-model="itemName">
                                <option value="">Select Item</option>
                                <option v-for="(item, index) in filteredItems" :value="item.name" :key="index">{{ item.name }}</option>
                            </select>
                            <span v-if="errors.itemName">{{ errors.itemName }}</span>
                        </div>
                        <button type="submit" class="btn btn-primary mt-2">Submit</button>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'DeleteItemForm',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            errors: {},
            itemList: [],
            filteredItems: [],
            itemType: "accessories", // Set default type as "accessories"
            itemName: ""
        };
    },
    mounted() {
        this.fetchItemsData();
    },
    computed: {
        uniqueTypes() {
            const types = this.itemList.map(item => item.type);
            return [...new Set(types)];
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        fetchItemsData() {
            axios.get('http://localhost:3000/items')
                .then(response => {
                    this.itemList = response.data;
                    this.handleSelectChange(); // Filter items based on the default type after data is fetched
                })
                .catch(error => {
                    console.error("Error fetching data: ", error);
                });
        },
        filterCategory(type) {
            if (type === '') {
                this.filteredItems = [];
            } else {
                this.filteredItems = this.itemList.filter(item => item.type === type);
            }
        },
        handleSelectChange() {
            this.filterCategory(this.itemType);
        },
        async deleteItem() {
            this.errors = {};

            if (!this.itemType) {
                this.errors.itemType = "You have to choose a type";
                return;
            }
            if (!this.itemName) {
                this.errors.itemName = "You have to choose an item";
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/items?name=${this.itemName}`);
                if (response.data.length > 0) {
                    const item = response.data[0];
                    await axios.delete(`http://localhost:3000/items/${item.id}`);
                    alert("Item has been deleted");
                    this.itemName = "";
                    this.fetchItemsData(); // Re-fetch the items to update the list
                    this.handleSelectChange(); // Ensure the list is updated based on the selected type
                    this.closeModal();
                    location.reload();
                }
            } catch (e) {
                console.error('Error deleting item:', e);
                this.errors.api = "Failed to delete item. Please try again.";
            }
        }
    }
};
</script>



<style scoped>
span{
  font-style: italic;
  font-size: 10px;
  color: red;
}
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
</style>