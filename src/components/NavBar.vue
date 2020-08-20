<template>
  <div class="NavBar">
      <v-app-bar
        color="deep-purple accent-4"
        dense
        dark
        app
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
  
        <v-toolbar-title class="my-title" @click="handleHome">Home</v-toolbar-title>
  
        <v-spacer></v-spacer>
  
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
  
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
  
        <v-menu
          left
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
  
          <v-list>
            <v-list-item
              v-for="n in 5"
              :key="n"
              @click="() => {}"
            >
              <v-list-item-title>Option {{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
  </div>
</template>

<script>
export default {
    data: () => ({
      auth: process.env.VUE_APP_MY_ENV_VARIABLE,
      videoLists: [

      ],
      pagination: {
        page: 1,
        resultsPerPage: 12,
        totalResults: 200,
        pre: '',
        next: ''
      }
    }),
    methods: {
        handleHome(){
            this.$store.dispatch('handleHomeVideoListData')
        },
        handleGapi(pageToken) {
        let vm = this
        let myPath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToke'
        if (pageToken !== '') {
          myPath = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${pageToken}`
        }
        vm.$gapi.client.request({
            'path': myPath
          }).then(function(response) {
            vm.videoLists = [ ...response.result.items ]
            // vm.pagination.totalResults = response.pageInfo.totalResults !== 'undefined' ? response.pageInfo.totalResults : 0
            vm.$set(vm.pagination, 'next', response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : '')
            vm.$set(vm.pagination, 'pre', response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : '')
          }, function(reason) {
            // console.log('Error: ' + reason.result.error.message);
          });
      }
    } 
}
</script>

<style lang="scss">
.NavBar {
    .my-title {
        cursor: pointer;
    }
}
</style>