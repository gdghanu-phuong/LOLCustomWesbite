<template>
    <div class="signup">
        <SignupPage></SignupPage>
    </div>
  </template>

  <script>
  // @ is an alias to /src
  import SignupPage from '@/components/SignupPage.vue';

  export default {
    name: 'SignupView',
    components: {
      SignupPage
    }
  }
  </script>

