<template>
  <v-app>
    <NavBar/>
    <v-main>
      
      <VideoLists/>
    </v-main>
    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import VideoLists from './components/VideoLists';
import NavBar from './components/NavBar';

export default {
  name: 'App',

  components: {
    VideoLists,
    NavBar
  },

  data: () => ({
    //
  }),
};
</script>
