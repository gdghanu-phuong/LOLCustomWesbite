<template>
    <div class="champions">
        <div class="container content bg-dark rounded text-white">
            <div class="row py-3">
                <div class="col-lg-3 col-md-3 col-sm-3 text-center">
                    <h1 class="text-uppercase fst-italic">{{title}}</h1>
                </div>
            </div>
        </div>
        <div class="container content">
            <div class="row justify-content-center">
                <div class="col-lg-6 col-md-6 col-sm-12 text-center">
                    <h2 class="text-uppercase fst-italic">{{subtitle}}</h2>
                    <h1 class="text-uppercase fst-italic fw-bold display-1">{{title}}</h1>
                    <p class="fst-italic">{{content}}</p>
                </div>
            </div>
            <div class="container-fluid border border-info rounded" v-if="isLoggedIn">
                <div class="row py-2">
                    <div class="col-lg-4 col-md-4 col-sm-3">
                        <input type="text" list="champList" class="border border-info shadow-none h-100 w-100" placeholder="Search" v-model="obj.name" >
                        <datalist id="champList">
                            <option v-for="champ in filteredChamp" :value="champ.name"></option>
                        </datalist>
                    </div>
                    <div class="col-lg-4 col-md-3 col-sm-5">
                        <select class="form-select rounded-0 me-2 shadow-none border border-info" v-model="obj.difficulties">
                            <option value="">All Difficulties</option>
                            <option v-for="difficult in diffRate" :value="difficult">{{difficult}}</option>
                        </select>
                    </div>
                    <div class="col-lg-4 col-md-5 col-sm-4 mx-auto my-auto">
                        <select class="form-select rounded-0 me-2 shadow-none border border-info" v-model="obj.role">
                            <option value="">All</option>
                            <option v-for="role in rolesData" :value="role.role">{{role.role}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid" v-if="isLoggedIn">
            <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-6" v-for="champ in paginatedChamps">
                    <div class="card w-100 my-4" @click="navigateToChampionDetail(champ.name)">
                        <img :src="champ.image" alt="champ" class="card-img-top" height="282px" width="250px">
                        <div class="card-body">
                            <p class="card-title text-uppercase fw-bold">{{champ.name}}</p>
                            <p class="card-text">{{champ.quote}}</p>
                            <p class="border-top border-secondary"></p>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 text-center">
                                    <p class="card-text border-end border-secondary fw-bold">
                                        <img :src="getRoleSymbol(champ.role)" alt="symbol" width="40px"><br>
                                        {{champ.role}}
                                    </p>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 text-center mt-2">
                                    <p class="card-text">
                                        <span class="fw-bold">Difficulty</span><br>
                                        <span class="text-uppercase">{{champ.difficulties}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="filteredChamp.length === 0" class="col-12 text-center">
                    <p class="text-danger">No champions match the selected criteria.</p>
                </div>
                <!-- Pagination -->
                <div class="col-lg-12 text-center mt-4">
                    <nav aria-label="Page navigation">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link shadow-none" @click="prevPage" :disabled="currentPage === 1">Previous</button>
                            </li>
                            <li class="page-item" v-for="pageNumber in pageCount" :key="pageNumber" :class="{ active: currentPage === pageNumber }">
                                <button class="page-link shadow-none" @click="gotoPage(pageNumber)">{{ pageNumber }}</button>
                            </li>
                            <li class="page-item" :class="{ disabled: currentPage === pageCount }">
                                <button class="page-link shadow-none" @click="nextPage" :disabled="currentPage === pageCount">Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container-fluid text-center" v-else>
            <h1>Log in to see more content.</h1>
        </div>
        <div class="float-buttons" v-if="isAdmin">
            <CreateChampionForm class="mt-4" :show="showCreateForm" @close="showCreateForm = false"></CreateChampionForm>
            <DeleteChampionForm class="mt-4" :show="showDeleteForm" @close="showDeleteForm = false"></DeleteChampionForm>
            <EditChampionForm class="mt-4" :show="showEditForm" @close="showEditForm = false"></EditChampionForm>
            <button @click="showCreateForm = true; showDeleteForm = false; showEditForm = false" class="btn btn-success me-3">Create</button>
            <button @click="showDeleteForm = true; showCreateForm = false; showEditForm = false" class="btn btn-danger me-3">Delete</button>
            <button @click="showEditForm = true; showDeleteForm = false; showCreateForm = false" class="btn btn-primary">Edit</button>
        </div>
        </div>
</template>


<script>
import axios from 'axios';
import RolesData from '@/data/roles.json';
//import ChampsData from '@/data/champions.json';
import CreateChampionForm from '@/components/admin_components/CreateChampionsForm.vue'
import DeleteChampionForm from '@/components/admin_components/DeleteChampionsForm.vue'
import EditChampionForm from '@/components/admin_components/EditChampionsForm.vue'
export default {
    name: 'ChampionsPage',
    components: {
        CreateChampionForm,
        DeleteChampionForm,
        EditChampionForm
    },
    data(){
        return {
            isLoggedIn: false,
            isAdmin: false,
            champs: [],
            rolesData: RolesData,
            diffRate: ['Low','Medium','High'],
            title: 'Champions',
            subtitle: "Choose your",
            content: "More than 100 champions, you'll find a perfect match with your playstyle. Master them, or master them all.",
            obj: {name: '', role: '', difficulties: ''},
            // pagination
            perPage: 8,
            currentPage: 1,
            //show component only for admin
            showCreateForm: false,
            showDeleteForm: false,
            showEditForm: false
        }
    },
    mounted() {
        const userInfo = JSON.parse(localStorage.getItem('user-info'));
        if (userInfo) {
            this.isLoggedIn = true;
            this.isAdmin = userInfo.role === 'admin';
            this.fetchChampionsData();
        }
    },
    methods:{
        fetchChampionsData(){
            axios.get('http://localhost:3000/champions')
            .then(response =>{
                this.champs = response.data.sort((a, b) => a.name.localeCompare(b.name));
            })
            .catch(error => {
                console.error('Error fetching champions data:', error);
            });
        },
        getRoleSymbol(roleName) {
            let role = this.rolesData.find(role => role.role === roleName);
            return role ? role.image : "";
        },
        // set the clicked page
        // Navigate to the previous page
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        // Navigate to the next page
        nextPage() {
            if (this.currentPage < this.pageCount) {
                this.currentPage++;
            }
        },
        // Navigate to a specific page
        gotoPage(pageNumber) {
            this.currentPage = pageNumber;
        },
        // Navigate to the champion detail route
        navigateToChampionDetail(champName) {
           this.$router.push({ name: 'ChampionDetail', params: { name: champName } });
        }
    },
    computed: {
        // Calculate the total number of pages
        pageCount() {
            return Math.ceil(this.filteredChamp.length / this.perPage);
        },
        // Filter champions based on current page
        paginatedChamps() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredChamp.slice(start, end);
        },
         //returns the data according to the page number
         getChamps(){
            let current = this.currentPage * this.perPage;
            let start = current - this.perPage;
            return this.filteredChamp.slice(start, current);
        },
        filteredChamp(){
            return this.champs.filter(champ =>
                champ.name.toLowerCase().match(this.obj.name.toLowerCase()) &&
                champ.role.toLowerCase().match(this.obj.role.toLowerCase()) &&
                champ.difficulties.toLowerCase().match(this.obj.difficulties.toLowerCase())
            );
        },
    }
}
</script>


<style scoped>

/* Styles for Tablets */
@media (min-width: 992px) {
    body{
        font-size: 13px;
    }

    .card-title{
        font-size: 30px;
    }

    .card-text{
        font-size: 16px;
    }

    .card{
    height: 95%;
}

}

/*style for mobile*/
@media (min-width: 768px) and (max-width: 991px) {
    body{
        font-size: 14px;
    }

    .card-title{
        font-size: 20px;
    }

    .card-text{
        font-size: 14px;
    }

    .card{
        height: 90%;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    body{
        font-size: 14px;
    }
    .card-title{
        font-size: 18px;
    }

    .card-text{
        font-size: 13px;
    }
    .card{
        height: 90%;
    }
    .card-img-top{
        height: 250px;
    }
}

input:focus{
    outline: none;
}
.card:hover {
  transform: scale(1.05);
}

.float-buttons {
    position: fixed;
    bottom: 10px;
    z-index: 1000; /* Ensure it's above other content */
}
</style>