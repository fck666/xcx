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
    
    back: function () {
      var clickback = true;
       this.triggerEvent('myevent', clickback);
    }
  }
})

