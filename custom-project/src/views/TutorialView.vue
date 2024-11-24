<template>
  <div class="tutorial">
    <TutorialPage :source="require('@/assets/images/earn_experience.webm')"></TutorialPage>
    <FooterBar></FooterBar>
  </div>
</template>

<script>
// @ is an alias to /src
import TutorialPage from '@/components/TutorialPage.vue';
import FooterBar from '@/components/FooterBar.vue';

export default {
  name: 'TutorialView',
  components: {
    TutorialPage,
    FooterBar
  }
}
</script>
