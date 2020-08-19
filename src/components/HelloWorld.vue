<template>
  <v-container>
    <v-row no-gutters>
        <v-col
          v-for="n in videoLists"
          :key="n.id"
          cols="12"
          sm="4"
        >
          <v-card
            max-width="344"
            max-height="100%"
            class="mx-auto mt-8"
          >
            <v-list-item>
              <v-list-item-avatar color="grey"></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{ n.snippet.localized.title }}</v-list-item-title>
                <v-list-item-subtitle> by {{ n.snippet.channelTitle }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
        
            <div ></div>
            <v-img
              v-html="n.player.embedHtml"
              :src="n.snippet.thumbnails.standard.url"
            ></v-img>
        
            <v-card-text>
              <span class="d-inline-block text-truncate"
        style="max-width: 80%;">
                {{ n.snippet.localized.description }}
              </span>
              <span class="d-inline-block text-truncate"
        style="max-width: 80%;">
                長度：{{ n.snippet.description }}
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="deep-purple accent-4"
              >
                Watch
              </v-btn>
              <v-btn
                text
                color="deep-purple accent-4"
              >
                SAVE
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <!-- <v-card
            class="pa-2"
            outlined
            tile
          >

            
          </v-card> -->
        </v-col>
      </v-row>
      <div class="text-center mt-6">
        <v-pagination
          v-model="pagination.page"
          :length="pagination.totalResults"
          :total-visible="7"
          @next="handleNext"
          @previous="handlePrevious"
        ></v-pagination>
      </div>
  </v-container>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'HelloWorld',

    data: () => ({
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
    created () {
      let vm = this
      
      this.$gapi.load('client', vm.start);
    },
    mounted () {
      // axios.get('https://www.googleapis.com/youtube/v3/', {
      //   params: {
      //     part: 'snippet',
      //     id: '7lCDEYXw3mM',
      //     type: 'video',
      //     videoCaption: 'closedCaption',
      //     key: 'AIzaSyA_cYzDKmEzhehhpJiMDV3J5N-Q4OV6yB8'
      //   }
      // }).then((result)=>{
      //   console.log(result)
      // })
      
    },
    watch: {
      videoLists: function (val) {
        console.log(val)
      }
    },
    methods: {
      start() {

        let vm = this
        // 2. Initialize the JavaScript client library.
        vm.$gapi.client.init({
          'apiKey': 'AIzaSyA_cYzDKmEzhehhpJiMDV3J5N-Q4OV6yB8'
        }).then(function() {
          // 3. Initialize and make the API request.
          return vm.$gapi.client.request({
            'path': 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW',
          })
        }).then(function(response) {
          console.log(response.result);
          vm.videoLists = [ ...response.result.items ]
          vm.pagination.totalResults = response.pageInfo.totalResults !== 'undefined' ? response.pageInfo.totalResults : 0
          vm.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : ''
          vm.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : ''
          console.log(vm.pagination)
        }, function(reason) {
          // console.log('Error: ' + reason.result.error.message);
        });
      },
      handleNext(page){
        
        let vm = this
        vm.$gapi.client.request({
            'path': `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${vm.pagination.next}`,
          }).then(function(response) {
            vm.videoLists = [ ...response.result.items ]
            // vm.pagination.totalResults = response.pageInfo.totalResults !== 'undefined' ? response.pageInfo.totalResults : 0
            vm.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : ''
            vm.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : ''
          }, function(reason) {
            // console.log('Error: ' + reason.result.error.message);
          });
      },
      handlePrevious(){
        let vm = this
        vm.$gapi.client.request({
            'path': `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${vm.pagination.pre}`,
          }).then(function(response) {
            vm.videoLists = [ ...response.result.items ]
            // vm.pagination.totalResults = response.pageInfo.totalResults !== 'undefined' ? response.pageInfo.totalResults : 0
            vm.pagination.next = response.nextPageToken !== 'undefined' ? response.nextPageToken : ''
            vm.pagination.pre = response.prevPageToken !== 'undefined' ? response.prevPageToken : ''
          }, function(reason) {
            // console.log('Error: ' + reason.result.error.message);
          });
      }
    }
  }
</script>
