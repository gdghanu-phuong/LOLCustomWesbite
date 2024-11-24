<template>
<div class="footer">
    <footer class="text-center bg-dark text-white pb-5">
        <div class="container pt-4">
            <div class="mb-4">
                <button type="button" class="logo-btn rounded-circle ms-1" v-for="s in social">
                    <a :href="s.link"><i :class="s.symbol"></i></a>
                </button>
            </div>
        </div>
        <div class="text-center">
            <p class="opacity-75">&copy; This work belongs to Vu Ha Phuong</p>
            <img src="https://static-prod.adweek.com/wp-content/uploads/2022/05/Riot-Games-Logo-New-5-16-22.png" alt="logo" width="200px">
        </div>
    </footer>
</div>
</template>

<script>
export default{
    name: "Footer Bar",
    //props: [link],
    data(){
        return {
            social: [
                {social: "Facebook", symbol: "fab fa-facebook", link: "https://www.facebook.com/leagueoflegends"},
                {social: "Youtube", symbol: "fab fa-youtube", link: "https://www.youtube.com/user/riotgamesinc"},
                {social: "Twitter", symbol: "fab fa-twitter", link: "https://twitter.com/leagueoflegends"},
                {social: "Instagram", symbol: "fab fa-instagram", link: "https://www.instagram.com/leagueoflegends/"},
                {social: "Reddit", symbol: "fab fa-reddit", link: "https://www.reddit.com/r/leagueoflegends/"}
            ]
        }
    }
}
</script>
