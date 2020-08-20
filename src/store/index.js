import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: process.env.VUE_APP_MY_ENV_VARIABLE,
    videoLists: [

    ],
    pagination: {
      page: 1,
      resultsPerPage: 12,
      totalResults: 100,
      pre: '',
      next: ''
    }
  },
  getters: {
    videoLists: state => {
      return state.videoLists
    },
    pagination: state => {
      return state.pagination
    }
  },
  mutations: {
    initVideoListData (state) {
      let vm = this._vm
      vm.$gapi.load('client', function(){
        vm.$gapi.client.init({
          'apiKey': state.auth
        }).then(function() {
          // 3. Initialize and make the API request.
          return vm.$gapi.client.request({
            'path': 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW',
          })
        }).then(function(response) {
          
          state.videoLists = [ ...response.result.items ]
          state.pagination.totalResults = response.result.pageInfo.totalResults !== 'undefined' ? response.result.pageInfo.totalResults : 0
          state.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : '';
          state.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : '';
        }, function(reason) {
          // console.log('Error: ' + reason.result.error.message);
        });
      });
    },
    handleGapi(state, direction) {
      let vm = this._vm
      let pageToken = ''
      let myPath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToke'
      if (direction === 'next') {
        pageToken = state.pagination.next
        myPath = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${pageToken}`
      } else if (direction === 'pre') {
        pageToken = state.pagination.pre
        myPath = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${pageToken}`
      } else {

      }
      vm.$gapi.client.request({
          'path': myPath
        }).then(function(response) {
          state.videoLists = [ ...response.result.items ]
          state.pagination.totalResults = response.result.pageInfo.totalResults !== 'undefined' ? response.result.pageInfo.totalResults : 0
          state.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : '';
          state.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : '';
        }, function(reason) {
          // console.log('Error: ' + reason.result.error.message);
        });
    }
  },
  actions: {
    initVideoListData (context) {
      context.commit('initVideoListData')
    },
    handleHomeVideoListData (context) {
      if (context.state.pagination.next !== '') {
        context.commit('handleGapi')
      }
    },
    handleNextVideoListData (context) {
      if (context.state.pagination.next !== '') {
        context.commit('handleGapi', 'next')
      }
    },
    handlePreVideoListData (context) {
      if (context.state.pagination.pre !== '') {
        context.commit('handleGapi', 'pre')
      }
    }
  },
  modules: {
  }
})
