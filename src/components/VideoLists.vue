<template>
  <v-container>
    <v-row no-gutters>
        <v-col
          v-for="(n, index) in videoLists"
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
              <v-btn  :color="n.isLike ? 'red' : 'grey'" @click="handleLike(index)" icon>
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
          @input="handleSpecificPage"
        ></v-pagination>
      </div>
  </v-container>
</template>

<script>
  export default {
    name: 'VideoLists',

    data: () => ({

    }),
    created () {
      this.start()
    },
    mounted () {

      
    },
    computed: {
      videoLists () {
        return this.$store.getters.videoLists
      },
      pagination () {
        return this.$store.getters.pagination
      }
    },
    methods: {
      start() {
        let vm = this
        // 2. Initialize the JavaScript client library.
        this.$store.dispatch('initVideoListData')
      },
      handleSpecificPage(targetPage){
        this.$store.dispatch('handleSpecificPage', targetPage)
      },
      handleNext(page){
        this.$store.dispatch('handleNextVideoListData')
      },
      handlePrevious(){
        this.$store.dispatch('handlePreVideoListData')
      },
      handleLike(cardIndex){
        this.$store.dispatch('handleLike', cardIndex)
      }
    }
  }
</script>
