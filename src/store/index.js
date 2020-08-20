import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: process.env.VUE_APP_MY_ENV_VARIABLE,
    pageDefaultSetting: {
      perPage: 20,
      totalData: 100,
      pageStart: 0
    },
    videoLists: [

    ],
    currentVideoLists: [

    ],
    pagination: {
      page: 1,
      resultsPerPage: 12,
      totalResults: 100,
      pre: '',
      next: ''
    },
    isLikes: {

    }
  },
  getters: {
    videoLists: state => {
      return state.currentVideoLists
    },
    pagination: state => {
      return state.pagination
    }
  },
  mutations: {
    initVideoListData (state) {
      let vm = this._vm,
          pageStart = state.pageDefaultSetting.pageStart,
          pageEnd = pageStart + state.pageDefaultSetting.perPage;
      state.pagination.totalResults = state.pageDefaultSetting.totalData / state.pageDefaultSetting.perPage;
      vm.$gapi.load('client', function(){
        vm.$gapi.client.init({
          'apiKey': state.auth
        }).then(function() {
          // 3. Initialize and make the API request.
          return vm.$gapi.client.request({
            'path': `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=${state.pageDefaultSetting.totalData}&regionCode=TW`,
          })
        }).then(function(response) {
          response.result.items.forEach((element, index) => {
            state.videoLists[index] = { ...element, isLike: false}
          });

          state.currentVideoLists = [ ...state.videoLists.slice(pageStart, pageEnd) ]
          state.pagination.pre = pageStart
          state.pagination.next = pageStart + 1
          // state.pagination.totalResults = response.result.pageInfo.totalResults !== 'undefined' ? response.result.pageInfo.totalResults : 0
          // state.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : '';
          // state.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : '';
        }, function(reason) {
          // console.log('Error: ' + reason.result.error.message);
        });
      });
    },
    handleGapi(state, targetPage) {
      let vm = this._vm,
          pageStart = state.pageDefaultSetting.pageStart = targetPage - 1,
          pageEnd = pageStart + state.pageDefaultSetting.perPage;

      state.currentVideoLists = [ ...state.videoLists.slice(pageStart, pageEnd) ]

          // state.pagination.pre = pageStart
          // state.pagination.next = pageStart + 1


      
      // let myPath = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToke'
      // if (direction === 'next') {
      //   pageToken = state.pagination.next
      //   myPath = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${pageToken}`
      // } else if (direction === 'pre') {
      //   pageToken = state.pagination.pre
      //   myPath = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status,player,statistics&chart=mostPopular&maxResults=12&regionCode=TW&pageToken=${pageToken}`
      // } else {

      // }
      // vm.$gapi.client.request({
      //     'path': myPath
      //   }).then(function(response) {
      //     state.videoLists = [ ...response.result.items ]
      //     state.pagination.totalResults = response.result.pageInfo.totalResults !== 'undefined' ? response.result.pageInfo.totalResults : 0
      //     state.pagination.next = response.result.nextPageToken !== 'undefined' ? response.result.nextPageToken : '';
      //     state.pagination.pre = response.result.prevPageToken !== 'undefined' ? response.result.prevPageToken : '';
      //   }, function(reason) {

      //   });
    },
    handleLike (state, cardIndex) {
      
      this._vm.$set(state.videoLists[cardIndex], 'isLike', true)
      console.log(state.videoLists[cardIndex].isLike)
      // if (cardState.isIDExist) {
      //   state.isLikes[cardState.cardID] = !state.isLikes[cardState.cardID]
      // } else {
      //   state.isLikes[cardState.cardID] = true
      // }
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
    handleSpecificPage (context, targetPage) {
      context.commit('handleGapi', targetPage)
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
    },
    handleLike (context, cardIndex) {
      context.commit('handleLike', cardIndex)
    }
  },
  modules: {
  }
})
