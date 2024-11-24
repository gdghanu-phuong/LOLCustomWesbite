<template>
    <div class="cart-modal" v-if="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Champ</h5>
            <button type="button" class="btn-close ps-2" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- delete champ form -->
            <form @submit.prevent="deleteChamp">
              <div class="form-group pt-2">
                  <input type="text" list="champList" class="h-100 w-100" placeholder="Select Champ" v-model="champName" >
                    <datalist id="champList">
                        <option v-for="(champ, index) in champs" :value="champ.name"></option>
                    </datalist>
                <span v-if="errors.champName">{{ errors.champName }}</span>
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
    name: 'DeleteChampionForm',
    props: {
      show: {
        type: Boolean,
        required: true
      }
    },
    data(){
      return {
        errors: {},
        champs: [],
        champName: ""
      }
    },
    mounted(){
      this.fetchItemsData();
    },
    methods: {
      fetchItemsData() {
        axios.get('http://localhost:3000/champions')
            .then(response => {
                this.champs = response.data.sort((a, b) => a.name.localeCompare(b.name));;
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
        },
      closeModal() {
        this.$emit('close');
      },
      //delete new champ to db
      async deleteChamp() {
        this.errros = {};
        if(this.champName.length > 0){
            try{
                let response = await axios.get(`http://localhost:3000/champions?name=${this.champName}`);
                if(response.data.length > 0){
                    let champ = response.data[0];
                    await axios.delete(`http://localhost:3000/champions/${champ.id}`);
                    alert("Champ has been delete");
                    location.reload();
                  }
            }catch(e){
                console.error('Error deleting champion:', error);
                this.errors.champName = 'An error occurred while deleting the champion.';
            }
        }else{
            this.errors.champName = "Name is required";
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