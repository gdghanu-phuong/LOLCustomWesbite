<template>
    <div class="tutorial">
        <div class="container-fluid banner-bg w-100 mt-5 pt-5 text-white">
            <div class="row align-items-center">
                <div class="col-lg-3 col-md-3 col-sm-10 banner-content">
                    <span class="badge opacity-50 text-uppercase">Game instruction</span>
                    <h1 class="text-uppercase fw-bold fst-italic">Choose your lane</h1>
                    <p>There are five positions that make up the recommended team comp for the game. Each lane lends itself to certain kinds of champions and roles. Try them all or lock in to the lane that calls you.</p>
                </div>
                <div class="col-lg-9 col-md-8 col-sm-12 p-5">
                    <img
                    src="https://mega.com.vn/media/news/2710_maps-lol-Summoner-s-Rift.jpg"
                    alt="banner-image"
                    class="w-100"
                    >
                </div>
            </div>
        </div>
    <div class="content first-content">
        <div class="container-fluid">
            <div class="row justify-content-start">
                <div class="col-lg-2 col-md-2 col-sm-3 align-self-center">
                    <p class="rotate-text">Powering Up &mdash;</p>
                </div>
                <div class="col-lg-8 col-md-9 col-sm-9">
                    <h1 class="fw-bold fst-italic text-center text-uppercase">Power up your champ</h1>
                    <div class="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet hendrerit enim. Vivamus arcu lectus, tincidunt a feugiat at, imperdiet eu massa.</div>
                    <div class="row border border-dark p-2 mt-3">
                    <div class="col-lg-7 col-md-7 col-sm-12">
                        <div v-if="currentSrc">
                            <video v-if="currentSrc.endsWith('.webm')" controls class="w-100" autoplay>
                                <source :src="currentSrc" type="video/webm">
                                Your browser does not support the video tag.
                            </video>
                            <img v-else :src="currentSrc" class="w-100">
                        </div>
                    </div>
                    <div class="col-lg-5 col-md-5 col-sm-12 align-self-center">
                        <ul class="list-group list-group-flush">
                            <li v-for="(content, index) in contents" :key="content.title" class="list-group-item border-bottom">
                                <button @click="toggleContent(content.src)" type="button" class="btn shadow-none">
                                    <i :class="{'fas fa-plus': !content.expanded, 'fas fa-minus': content.expanded}"></i>
                                </button>
                                <span class="fw-bold text-uppercase">{{content.title}}</span><br>
                                <span class="list-content" v-if="content.expanded">
                                    {{content.content}}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isLoggedIn">
        <div class="content second-content container-fluid pt-5 text-white" :style="{backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(' + currentChamp.image + ')',backgroundSize: 'cover'}" v-if="currentChamp">
            <div class="row justify-content-start">
                <div class="col-lg-2 col-md-2 col-sm-2 align-self-end">
                    <p class="rotate-text">Champions &mdash;</p>
                </div>
                <div class="col-lg-8 col-md-8 col-sm-8 text-center">
                    <h2 class="text-uppercase fw-bold fst-italic">Meet some of</h2>
                    <h1 class="display-1 text-uppercase fw-bold fst-italic">the champs</h1>
                </div>
            </div>
            <div class="row pb-5" >
                <div class="col-lg-4 col-md-5 col-sm-10 align-self-center pb-3" v-if="currentChamp">
                    <h3 class="text-uppercase fw-bold">{{currentChamp.name}}</h3>
                    <h5 class="text-uppercase">{{currentChamp.quote}}</h5>
                    <ul class="list-unstyled">
                        <li class="text-uppercase pb-1">Difficulty &mdash; {{currentChamp.difficulties}}</li>
                        <li class="text-uppercase pb-1">
                            Role &mdash; <img :src="getRoleSymbol(currentChamp.role)" alt="symbol" width="40px">  &mdash; {{currentChamp.role}}
                        </li>
                        <li class="pb-4">{{currentChamp.desc}}</li>
                        <li>
                            <p><router-link class="discover-link" to="/champions">Discover more champions</router-link></p>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 col-sm-10 mx-auto" v-if="currentChamp">
                    <img :src="currentChamp.image" alt="first_champ" class="border border-white rounded-circle w-100 champ-image">
                </div>
                <div class="col-lg-4 col-md-12 col-sm-12 text-center" >
                    <h1 class="fst-italic">Choose your favorite champ</h1>
                    <ul class="list-inline">
                        <li class="list-inline-item pt-3" v-for="champ in champs" :key="champ.name" @click="getRelatedChamp(champ.name)">
                            <img :src="champ.image" :alt="champ.name" class="border border-white rounded-circle champ-button">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid content text-center" v-else>
        <h1>Log in to see more content.</h1>
    </div>
    </div>
</template>

<script>
import RolesData from '@/data/roles.json';
import ChampsData from '@/data/champions.json';
export default {
    name: 'TutorialPage',
    props: ['source'],
    data(){
        return {
            isLoggedIn: false,
            contents: [
                {
                    title: "Earn Experience",
                    content: "When champions earn a certain amount of experience, they level up and can unlock or strengthen abilities and raise their base stats. Gain experience by killing enemy units and champions, assisting in a kill, and destroying defense structures",
                    // src: "https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/8d49feeb42c45ac59b1d6cc1cae71d64ce0089f7.webm",
                    src: this.source,
                    expanded: false
                },
                {
                    title: "Earn gold",
                    content: "Gold is the in-game currency to buy items for your champion. Earn gold by killing enemy units and champions, assisting in a kill, destroying defense structures, and equipping gold income items.",
                    src: "https://miro.medium.com/v2/resize:fit:1358/0*t5jzkYhAfe6M7xD0.png",
                    expanded: false
                },
                {
                    title: "Shop",
                    content: "The Shop is where you can buy and sell items with gold you have earned. It can only be accessed while you are at the Fountain.",
                    src: "https://noobabble.wordpress.com/wp-content/uploads/2014/06/blue-shopkeeper.jpg?w=1200",
                    expanded: false
                }
            ],
            currentSrc: null,
            champs: ChampsData,
            rolesData: RolesData,
            currentChamp: null,
            currentRole: 0
        }
    },
    mounted(){
        this.currentSrc = this.contents[0].src;
        const userInfo = localStorage.getItem('user-info');
        if(userInfo){
            this.isLoggedIn = true;
            this.setDefaultChamp("Lillia");
        }
    },
    methods: {
        getRelatedChamp(champName){
            let champion = this.champs.find(champion => champion.name === champName);
            if (champion) {
                this.currentChamp = champion;
            } else {
                this.currentChamp = null;
            }
        },
        setDefaultChamp(champName) {
            let defaultChamp = this.champs.find(champ => champ.name === champName);
            if (defaultChamp) {
                this.currentChamp = defaultChamp;
            } else {
                console.error(`Champion '${champName}' not found in the champions list.`);
            }
        },
        getRoleSymbol: function(roleName){
            let role = this.rolesData.find(role => role.role === roleName);
            if(role){
                return `${role.image}`;
            } else {
                return "";
        }},
        toggleContent(src) {
            // Toggle the expanded state of the clicked content
            this.contents.forEach(content => {
                content.expanded = content.src === src && !content.expanded;
            });
            // Update the currentSrc based on the clicked content
            this.currentSrc = src;
        }
    }
}
</script>

<style scoped>
@media (min-width: 1200px) {
    body{
        font-size: 16px;
    }
    .rotate-text {
        font-size: 16px;
    }
}

/* Styles for Tablets */
@media (min-width: 992px){
    body{
        font-size: 14px;
    }
    .rotate-text {
        font-size: 18px;
    }

    .champ-image{
        display: block;
        height: 400px;
    }
    .champ-button{
        height: 100px;
        width: 100px;
    }
}

/*style for mobile*/
@media (min-width: 768px) and (max-width: 991px) {
    body{
        font-size: 16px;
    }
    .rotate-text {
        font-size: 16px;
    }
    .banner-content{
        margin-left: 2rem;
     }

    .champ-image{
        display: block;
        height: 400px;
    }
    .champ-button{
        width: 90px;
        height: 90px;
    }

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
    .champ-image{
        height: 500px;
        width: 500px;
    }

    .champ-button{
        width: 70px;
        height: 70px;
    }/*style for logo list*/
}

.banner-bg{
    background-image: linear-gradient(to right, #0f0c29, #302b63, #24243e);
}

.second-content{
   width: 100%;
   background-repeat: no-repeat;
   background-blend-mode: darken;
}/*style for section content two*/

.button{
    border: 1px solid black;
    width: 50%;
}
.logo-button{
    width: 15%;
    margin-bottom: 6px;
    border-radius: 50%;
    font-weight: bold;
}
.logo-button:hover{
    background-color: white;
    padding: 5px;
}/*style for button*/
.discover-link{
    text-transform: uppercase;
    font-size: 10px;
    text-decoration: none;
    color: white;
    border-top: 1px solid #00CCCC;
    border-left: 1px solid #00CCCC;
    border-right: 1px solid #00CCCC;
    padding: 1rem;
}
.discover-link:hover{
    border-radius: 1.5rem 0 1.5rem 0;
    color: white;
}


</style>