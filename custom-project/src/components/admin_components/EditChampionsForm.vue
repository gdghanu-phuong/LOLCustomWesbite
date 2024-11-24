<template>
    <div class="cart-modal edit-form" v-if="show">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Champ</h5>
            <button type="button" class="btn-close ps-2" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Create new champ form -->
            <form @submit.prevent="editChamp">
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="champName" placeholder="Champion name">
                <span v-if="errors.champName">{{ errors.champName }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateChampName" placeholder="Update champion name">
                <span v-if="errors.updateChampName">{{ errors.updateChampName }}</span>
              </div>
              <div class="form-group pt-2">
                <select class="form-select" name="role" id="role" v-model="updateChampRole" >
                  <option value="">Update role</option>
                  <option value="Support">Support</option>
                  <option value="Tank">Tank</option>
                  <option value="Mage">Mage</option>
                  <option value="Marksman">Marksman</option>
                  <option value="Assasins">Assasins</option>
                  <option value="Fighter">Fighter</option>
                </select>
                <span v-if="errors.updateChampRole">{{ errors.updateChampRole }}</span>
                <!-- <input type="text" class="form-control" placeholder="Champion role"> -->
              </div>
              <div class="form-group pt-2">
                <select class="form-select" name="role" id="role" v-model="updateChampDifficulties" >
                  <option value="">Update difficulty</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <span v-if="errors.updateChampDifficulties">{{ errors.updateChampDifficulties }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateChampQuote" placeholder="Update Quote">
                <span v-if="errors.updateChampQuote">{{ errors.updateChampQuote }}</span>
              </div>
              <div class="form-group pt-2">
                <input type="text" class="form-control" v-model="updateChampImage" placeholder="Update Image">
                <span v-if="errors.updateChampImage">{{ errors.updateChampImage }}</span>
              </div>
              <div class="form-group pt-2">
                <textarea class="form-control" v-model="updateChampDesc" rows="3" placeholder="Update Description"></textarea>
              </div>
              <span v-if="errors.updateChampDesc">{{ errors.updateChampDesc }}</span><br>
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
    name: 'EditChampionForm',
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
        updateChampName: "",
        updateChampRole: "",
        updateChampQuote: "",
        updateChampDifficulties: "",
        updateChampImage: "",
        updateChampDesc: ""
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        async editChamp() {
            var result = true;
            this.errors = {};
            // Validate champName
            if (!this.champName) {
                result = false;
                this.errors.champName = "Name is required.";
            }

            //validate form
            if(!this.updateChampName && !this.updateChampQuote && !this.updateChampRole && !this.updateChampImage && !this.updateChampDifficulties && !this.updateChampDesc){
              result = false;
              this.errors.updateChampDesc = "You have not make any edits."
            }

            if(this.updateChampQuote.length > 50){
                result = false;
                this.errors.updateChampQuote = "Quote too long";
            }

            if(result){
                try {
                    // Fetch the champion to edit
                    let response = await axios.get(`http://localhost:3000/champions?name=${this.champName.toLowerCase()}`);
                    if (response.data.length > 0) {
                        let champ = response.data[0];
                        // Updated champion data
                        let updateChampData = {
                            name: this.updateChampName.toLowerCase() || champ.name,
                            role: this.updateChampRole || champ.role,
                            difficulties: this.updateChampDifficulties || champ.difficulties,
                            quote: this.updateChampQuote || champ.quote,
                            image: this.updateChampImage || champ.image,
                            desc: this.updateChampDesc || champ.desc
                        };
                        // Send PUT request
                        await axios.put(`http://localhost:3000/champions/${champ.id}`, updateChampData);
                        alert("Champion has been updated");
                        this.closeModal();
                        location.reload();
                    } else {
                    this.errors.champName = "Champion not found.";
                    }
                    } catch (error) {
                        console.error('Error editing champion:', error);
                        this.errors.champName = "An error occurred while editing the champion.";
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