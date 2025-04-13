<template>
    <div class="champion-details">
        <div class="container content">
            <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <div class="image-container">
                        <img :src="champ.image" class="image" :class="{ 'zoomed': isZoomed }">
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12">
                    <h1 class="text-uppercase fw-bold text-danger text-center display-4">{{ champ.name }}</h1>
                    <h3 class="text-uppercase fst-italic text-warning text-center">{{ champ.quote }}</h3>
                    <h4>Role: <span class="text-uppercase">{{champ.role}}</span></h4>
                    <h4>Difficulty: <span class="text-uppercase">{{ champ.difficulties }}</span></h4>
                    <div class="row champ-story mt-4 d-none d-lg-block">
                        <div class="col-lg-12 col-md-12 col-sm-12">
                            <h4 class="fw-bold text-center text-uppercase">Champ story</h4>
                        </div>
                        <div class="champ-desc col-lg-12 col-md-12 col-sm-12 border border-2 border-dark rounded p-3">
                            {{champ.desc}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row champ-story mt-4 d-lg-none">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <h4 class="fw-bold text-center text-uppercase">Champ story</h4>
                </div>
                <div class="champ-desc col-lg-12 col-md-12 col-sm-12 border border-2 border-dark rounded p-3">
                    {{champ.desc}}
                </div>
            </div>
        </div>
    </div>
</template>

  <script>
  import axios from 'axios';
  export default {
    name: "ChampionDetails",
    data(){
        return {
            champ: [],
            isZoomed: false
        }
    },
    mounted(){
        this.fetchChampionData();
    },
    methods: {
        fetchChampionData() {
            const championName = this.$route.params.name;
            axios.get(`http://localhost:3000/champions?name=${championName}`)
                .then(response => {
                this.champ = response.data[0];
                })
                .catch(error => {
                console.error('Error fetching champion data:', error);
            });
        }
    }
  };
  </script>

<style scoped>
/* Styles for Tablets */
@media (min-width: 992px) {
    .image-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}

/* Styles for mobile */
@media (max-width: 991px) {
    .image-container {
        height: 100%;
    }
}

/* Styles for smaller screens */
@media (max-width: 767px) {
    .image-container {
        height: auto;
    }
}

.img {
    width: 100%;
}

.image-container {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
}

.image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.3s ease; /* Smooth transition */
}

.zoomed {
    transform: scale(1.1); /* Zoom effect */
    transform-origin: center; /* Zoom from the center */
}

.champ-desc, h1, h3, h4 {
    font-family: 'Indie Flower', cursive;
}
</style>
