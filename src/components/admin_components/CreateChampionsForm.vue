<template>
    <div class="cart-modal create-form" v-if="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new Champ</h5>
            <button type="button" class="btn-close ps-2" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Create new champ form -->
            <form @submit.prevent="createNewChamp">
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="champName" placeholder="Champion name">
                <span v-if="errors.champName">{{ errors.champName }}</span>
              </div>
              <div class="form-group pt-2">
                <select class="form-select" name="role" id="role" v-model="champRole" >
                  <option value="">Choose a role</option>
                  <option value="Support">Support</option>
                  <option value="Tank">Tank</option>
                  <option value="Mage">Mage</option>
                  <option value="Marksman">Marksman</option>
                  <option value="Assasins">Assasins</option>
                  <option value="Fighter">Fighter</option>
                </select>
                <span v-if="errors.champRole">{{ errors.champRole }}</span>
                <!-- <input type="text" class="form-control" placeholder="Champion role"> -->
              </div>
              <div class="form-group pt-2">
                <select class="form-select" name="role" id="role" v-model="champDifficulties" >
                  <option value="">Choose difficulty</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <span v-if="errors.champDifficulties">{{ errors.champDifficulties }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="champQuote" placeholder="Quote">
                <span v-if="errors.champQuote">{{ errors.champQuote }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="champImage" placeholder="Image URL">
                <span v-if="errors.champImage">{{ errors.champImage }}</span>
              </div>
              <div class="form-group pt-2">
                <textarea class="form-control" v-model="champDesc" rows="3" placeholder="Description(optional)"></textarea>
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
    name: 'CreateChampionForm',
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    data(){
      return {
        errors: {},
        champName: "",
        champRole: "",
        champDifficulties: "",
        champImage: "",
        champQuote: "",
        champDesc: ""
      }
    },
    methods: {
      closeModal() {
        this.$emit('close');
      },
      //add new champ to db
      async createNewChamp(e){
        var result = true;
        this.errors = {};

        //validate for champions name
        if(this.champName.length > 0){
          try{
            //check if champ has already exist
            let response = await axios.get(`http://localhost:3000/champions?name=${this.champName}`);
            if(response.data.length > 0){
              result = false;
              this.errors.champName = "This champion has already exist";
            }
          }catch(e){
            console.error("An error occurred: ", error);
            result = false;
            this.errors.champName = "Error.";
          }
        }else {
          result = false;
          this.errors.champName = "Name is required";
        }
        // validate all the field
        if(!this.champImage.trim()){
          result = false;
          this.errors.champImage = "This field is required."
        }
        if(!this.champRole.trim()){
          result = false;
          this.errors.champRole = "This field is required."
        }
        if(!this.champDifficulties.trim()){
          result = false;
          this.errors.champDifficulties = "This field is required."
        }

        // validate for quote
        if(this.champQuote.trim()){
          if(this.champQuote.length > 50)
          {
            result = false;
            this.errors.champQuote = "Quote too long."
          }
        }else{
          result = false;
          this.errors.champQuote = "This field is required."
        }

        if(result){
          try{
              await axios.post("http://localhost:3000/champions", {
                name: this.champName.toLowerCase(),
                role: this.champRole,
                difficulties: this.champDifficulties,
                quote: this.champQuote.toUpperCase(),
                image: this.champImage,
                desc: this.champDesc
              });
            this.closeModal();
            alert("New champ has been add");
            location.reload();
          }catch(e){
            console.error("An error occurred: ", e)
          }
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
