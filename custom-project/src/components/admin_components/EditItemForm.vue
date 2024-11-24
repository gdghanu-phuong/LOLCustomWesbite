<template>
    <div class="cart-modal edit-form" v-if="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Item</h5>
            <button type="button" class="btn-close ps-2" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Create new champ form -->
            <form @submit.prevent="editItem">
              <div class="form-group pt-2">
                <select class="form-select shadow-none text-capitalize" v-model="itemType" @change="handleSelectChange">
                    <option value="">Select Type</option>
                    <option v-for="(type, index) in uniqueTypes" :value="type" :key="index">{{ type }}</option>
                </select>
                <span v-if="errors.itemType">{{ errors.itemType }}</span>
                <!-- <input type="text" class="form-control" placeholder="Champion role"> -->
              </div>
              <div class="form-group pt-2">
                <select class="form-select shadow-none text-capitalize" v-model="itemName">
                    <option value="">Select Item</option>
                    <option v-for="(item, index) in filteredItems" :value="item.name" :key="index">{{ item.name }}</option>
                </select>
                <span v-if="errors.itemName">{{ errors.itemName }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateItemType" placeholder="Update Item Type">
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateItemName" placeholder="Update Item Name">
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateItemImage" placeholder="Update Image">
              </div>
              <div class="form-group pt-2">
                <input type="number" class="form-control" v-model="updateItemPrice" rows="3" placeholder="Update Price">
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
    name: 'EditItemForm',
    props: {
        show: {
        type: Boolean,
        required: true
        }
    },
    data(){
        return {
        errors: {},
        itemList: [],
        filteredItems: [],
        itemType: "",
        itemName: "",
        updateItemType: "",
        updateItemName: "",
        updateItemPrice: "",
        updateItemImage: ""
        }
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
        async editItem(){
            var result = true;
            this.errors = {};
            // Validate type and name
            if (!this.itemType) {
                result = false;
                this.errors.itemType = "You need to choose type.";
            }
            if (!this.itemName) {
                result = false;
                this.errors.itemName = "You need to choose item.";
            }


            if(result){
                try {
                    // Fetch the champion to edit
                    let response = await axios.get(`http://localhost:3000/items?name=${this.itemName}`);
                    if (response.data.length > 0) {
                        let item = response.data[0];
                        // Updated champion data
                        let updateItemData = {
                            type: this.updateItemType.toLowerCase() || item.type,
                            name: this.updateItemName || item.name,
                            price: this.updateItemPrice || item.price,
                            image: this.updateItemImage || item.image
                        };
                        // Send PUT request
                        await axios.put(`http://localhost:3000/items/${item.id}`, updateItemData);
                        alert("Item has been updated");
                        this.fetchItemsData();
                        this.closeModal();
                        location.reload();
                    }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
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