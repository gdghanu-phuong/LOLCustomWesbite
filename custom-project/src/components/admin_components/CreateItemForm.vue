<template>
    <div class="cart-modal" v-if="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new Item</h5>
            <button type="button" class="btn-close ps-2" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Create new champ form -->
            <form @submit.prevent="createItem">
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="itemType" placeholder="Item type">
                <span v-if="errors.itemType">{{ errors.itemType }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="itemName" placeholder="Item Name">
                <span v-if="errors.itemName">{{ errors.itemName }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="number" class="form-control" v-model="itemPrice" placeholder="Item Price">
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="itemImage" placeholder="Item Image">
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
    name: 'CreateItemForm',
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        errors: {},
        itemType: "",
        itemName: "",
        itemPrice: "",
        itemImage: ""
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      async createItem() {
        var result = true;
        this.errors = {};

        if(this.itemType.trim()){
          if(this.itemType.length > 20){
            result = false;
            this.errors.itemType = "Item type cant be too long.";
          }
        }else {
          result = false;
          this.errors.itemType = "Item type is required.";
        }

        if (this.itemName.length > 0){
          try{
            //check if item has already exist
            let response = await axios.get(`http://localhost:3000/items?name=${this.itemName}`);
            if(response.data.length > 0){
              result = false;
              this.errors.itemName = "This item has already exist";
            }
          }catch(e){
            console.error("An error occurred: ", error);
            result = false;
            this.errors.itemName = "Error.";
          }
        }else {
          result = false;
          this.errors.itemName = "Name is required.";
        }

        if(!this.itemPrice.trim()){
          this.itemPrice = 0;
        }

        if(result){
          try {
            await axios.post('http://localhost:3000/items', {
              type: this.itemType.toLowerCase(),
              name: this.itemName,
              price: parseFloat(this.itemPrice).toFixed(2),
              image: this.itemImage
            });
            alert("New item has been added");
            this.closeModal();
            location.reload();
          } catch (error) {
            console.error("An error occurred: ", error);
            alert("Error adding item: " + error.message);
          }
        }
      }
    }
  };
  </script>

  <style scoped>
  span {
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
