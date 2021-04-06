const app = getApp()
Component({
  properties: {
    navigationBarTitle: {
      type: String,
      value: ''
    },
  },

  data: {
    statusBarHeight: app.globalData.statusBarHeight
  },

  methods: {
    
  }
})