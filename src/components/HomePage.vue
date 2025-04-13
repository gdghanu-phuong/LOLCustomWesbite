<template>
  <div class="home">
    <div class="container-fluid banner-bg">
        <div class="banner-image">
            <div class="row">
                <div class="col-12 text-center">
                    <img
                    :src="bannerImg"
                    alt="banner_image"
                    class="w-75"
                    >
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid content">
    <div class="row">
        <div class="col-lg-2 col-md-3 col-sm-3">
            <p class="rotate-text">About the game &mdash;</p>
        </div>
        <div class="col-lg-8 col-md-7 col-sm-7 align-self-center text-center">
            <h2 class="text-uppercase fst-italic">What is...</h2>
            <h1 class="text-uppercase fst-italic">League of Legeneds?</h1>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-lg-3 col-md-3 col-sm-5 mt-3" v-for="(content,index) in contents">
        <div class="card mt-3 text-center">
            <img :src= "content.image" class="card-img-top" :alt="content.alt">
            <div class="card-body">
            <h5 class="card-title text-uppercase fw-bold">{{content.title}}</h5>
            <p class="card-text" :class="{ 'collapsed': !content.showMore }">{{content.desc}}</p>
            <p class="card-text">
            <button @click="toggleShowMore(index)" class="btn btn-outline-info shadow-none">
                {{ content.showMore ? 'Show Less' : 'Show More' }}
            </button>
            </p>
            </div>
            <div class="card-footer fst-italic">{{content.footer}}</div>
        </div>
    </div>
</div>
    <div class="container-fluid content" v-if="isLoggedIn">
        <div class="row">
            <div class="col-lg-2 col-md-2 col-sm-3">
                <p class="rotate-text">Champions &mdash;</p>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-7 text-center">
                <h2 class="text-uppercase fst-italic">Choose your</h2>
                <h1 class="text-uppercase fst-italic fw-bold display-1">Champions</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet hendrerit enim. Vivamus arcu lectus, tincidunt a feugiat at, imperdiet eu massa.</p>
                <router-link to="/champions"><button type="button" class="btn btn-outline-success shadow-none">Discover more Champions</button></router-link>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-lg-6 col-md-12 col-sm-12 text-center">
                <ul class="list-inline">
                    <li class="list-inline-item" @click="getRelatedChamp(role.role, index)" v-for="(role,index) in rolesData" :key = "role.role">
                        <button type="button" class="btn shadow-none">
                        <img :src="role.image"
                        :alt="role.role"
                        class="logo-btn champion-btn"
                        :class="{'current-role' : currentRole === index}"
                        >
                        </button>
                    </li>
                </ul>
                <div v-if="currentChamp">
                    <h1 class="text-uppercase fw-bold">{{currentChamp.role}}</h1>
                    <p class="fst-italic" >{{currentChamp.short_desc}}</p>
                    <p>{{ currentChamp.full_desc }}</p>
                </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 text-center" v-if="currentChamp">
                <img :key="currentChamp.champ_pic" :src="currentChamp.champ_pic" alt="champions_pic" class="champion-picture">
                <h2 class="text-uppercase fw-bold">{{currentChamp.champ_name}}</h2>
                <p class="text-capitalize">{{currentChamp.champ_desc}}</p>
            </div>
        </div>
    </div>
    <div class="container-fluid content text-center" v-else>
        <h1>Log in to see more content.</h1>
    </div>
    </div>
  </div>
</template>

<script>
import RolesData from '@/data/roles.json';
export default {
  name: 'HomePage',
  data() {
  return {
    isLoggedIn: false,
    bannerImg: "https://portforward.com/league-of-legends/league-of-legends-header-small.webp",
    contents: [
      {
        image: "https://www.digitaltrends.com/wp-content/uploads/2023/06/League-of-Legends-Arena.jpg?fit=1753%2C985&p=1",
        alt: "league-of-legends",
        title: "What is League of Legends?",
        desc:"League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other's base. Choose from over 140 champions to make epic plays, secure kills, and take down towers as you battle your way to victory.",
        footer: "Established in 2009",
        showMore: false
      },
      {
        image:"https://image.shutterstock.com/image-photo/image-260nw-2340252573.jpg",
        alt: "riot logo",
        title: "Developer",
        desc: "Riot Games was founded in 2006 to create games and experiences that make it better to be a player. In 2009, we launched our debut title, League of Legends, which has gone on to be one of the most-played PC games in the world.",
        footer: "Check our website",
        showMore: false
      },
      {
        image: "https://mega.com.vn/media/news/2710_maps-lol-Summoner-s-Rift.jpg",
        alt: "map for the game",
        title: "Summoner's Rift",
        desc: "The newest and most venerated battleground is known as Summoner's Rift. Traverse down on of three different paths in order to attack your enemy at their weakest point.",
        footer: "Learn how to play LOL",
        showMore: false
      },
      {
        image: "https://imageio.forbes.com/specials-images/imageserve/659d701c9e57476a2b36e746/LOL-Patch-14-1-key-art/960x0.png?format=png&width=960",
        alt: "update",
        title: "Season 2024 update",
        desc: "Morbi quis bibendum enim, eget rhoncus libero. Sed a erat cursus, vestibulum risus vel, efficitur mi. Phasellus ac suscipit libero.",
        footer: "Check for new updates",
        showMore: false
      }
    ],
    rolesData: RolesData,
    currentChamp: null,
    currentRole: 0
    }
  },
  mounted(){
    //check login
    const userInfo = localStorage.getItem('user-info');
    if(userInfo){
        this.isLoggedIn = true;
        this.currentChamp = this.rolesData[0];
    }
  },
  methods: {
    getRelatedChamp(roleName, index){
      this.currentRole = index;
      let role = this.rolesData.find(role=>role.role===roleName);
      if(role){
        this.currentChamp = role;
      }else{
        this.currentChamp = null;
      }
    },
    //method to toggle showMore button
    toggleShowMore(index){
      this.contents[index].showMore = !this.contents[index].showMore;
    }
  }
}
</script>

<style scoped>
/* Import and use styles from an external CSS file */
/* Styles for Desktop (Large Screens) */
/* Styles for Desktop (Large Screens) */
@media (min-width: 1200px) {
    body{
        font-size: 16px;
    }
    .rotate-text {
        font-size: 20px;
    }
    .champ-full-desc {
        display: block;
    }

    .champion-picture{
        width: 75%;
        height: auto;
    }
    .champion-btn{
        width: 4rem;
    }/*style for logo list*/
}

/* Styles for Tablets */
@media (min-width: 992px) {
    body{
        font-size: 14px;
    }
    .rotate-text {
        font-size: 18px;
    }
    .card-title{
        font-size: 12px;
    }
    .champ-full-desc {
        display: none;
    }
    .champion-picture{
        height: 700px;
        width: 600px;
    }
    .champion-btn{
        width: 3rem;
    }/*style for logo list*/
}

/*style for mobile*/
@media (min-width: 768px) and (max-width: 991px) {
    body{
        font-size: 16px;
    }
    .rotate-text {
        font-size: 16px;
    }
    .card-title{
        font-size: 10px;
    }
    .champ-full-desc {
        display: none; /* not display full desc on mobile size */
    }
    .champion-picture{
        height: 650px;
        width: 600px;
    }
    .champion-btn{
        width: 4rem;
    }/*style for logo list*/
}

@media (min-width: 576px) and (max-width: 767px){
    body{
        font-size: 14px;
    }
    .rotate-text {
        font-size: 14px;
    }
    .champ-full-desc {
        display: none;
    }
    .champion-picture{
        height: 500px;
        width: 500px;
    }

    .champion-btn{
        width: 3.5rem;
    }/*style for logo list*/
}

.banner-bg{
    z-index: 0;
    position: relative;
    width: 100%;
    background-image: linear-gradient(to right, #0f0c29, #302b63, #24243e);
}
.banner-image{
    top: 5rem;
    z-index: 1;
    position: relative;
}/*banner image at the top style*/


/*style for card and show more button*/
.card {
    width: 100%;
    height: 100%;
}

.card-text.collapsed {
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 80px; /* Initial height, adjust as needed */
}

.card-text.collapsed + button {
    display: block;
}

.card-text.collapsed + button:hover {
    text-decoration: underline;
    cursor: pointer;
}


.card-img-top{
    height: 10rem;
}


/*style for logo button hover*/
.current-role{
    opacity: 100;
}


</style>
