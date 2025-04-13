<template>
  <div class="home">
    <HomePage></HomePage>
    <FooterBar></FooterBar>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/HomePage.vue';
import FooterBar from '@/components/FooterBar.vue';

export default {
  name: 'HomeView',
  components: {
    HomePage,
    FooterBar
  }
}
</script>

