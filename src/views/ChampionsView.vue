<template>
  <div class="champions">
    <ChampionsPage></ChampionsPage>
    <FooterBar></FooterBar>
  </div>
</template>

<script>
// @ is an alias to /src
import ChampionsPage from '@/components/ChampionsPage.vue';
import FooterBar from '@/components/FooterBar.vue';

export default {
  name: 'ChampionsView',
  components: {
    ChampionsPage,
    FooterBar
  }
}
</script>
