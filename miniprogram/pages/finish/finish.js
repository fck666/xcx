// pages/finish/finish.js
Page({
  data: {
    time:'',
    score:'',
    save:'',
    score:''
  },
  onLoad :function(event) {
    var timecount=event.time
    var score=event.score
    var realtime=timecount.match(/[0-9]{2}/g)
    var showtime=realtime[0]+'时'+realtime[1]+'分'+realtime[2]+'秒'
    if(score>=1){
      this.setData({
     time:showtime,
     score:'本次学习获得'+score+'积分',
     save:'学习时长已保存'
    })
    }else{
      this.setData({
        time:showtime,
        score:'学习时长未达6分钟,无法获得积分',
        save:''
    })
  }
  },
 close: function(event) {
      wx.switchTab({
        url: '/pages/index/index',
      })
}
})