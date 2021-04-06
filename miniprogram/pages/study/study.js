var intt; 
 var audioCxt;
 var util=require('../../utils/util');
//动画
var audioAnimation;
audioCxt = wx.createInnerAudioContext();
audioCxt.loop=true;
audioCxt.src = 'https://img.houzi8.com/audio/preview/2020/12/18/f4d9be0a8d647b1963d3b832630033dc.mp3';
const db=wx.cloud.database()
const user=db.collection('userinfo')
const record=db.collection('study_data')
Page({
  data: {
    //用户数据
    openId:'',
    //计时器
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    timecount:'开始学',
    cost: 0,
    flag: 1,
    endtime: "",
    showhour: '00',
    showminute: '00',
    showsecond: '00',
    showstopView:true,
    showresetView:true,
    showresumeView:true,
    //开始时间
    starttime:'',
    //分数
    score:'',
   //播放器
    audioAnimation : null,
    //音乐是不是开始
    music_on : true,
    //音乐是不是在播放
    music_playing :false
  }, 
  //播放按钮事件
  playmusic : function(){
    if(this.data.music_playing==false){
    audioCxt.play();
    //图片添加css样式，旋转样式
    this.setData({
      music_on: true,
      music_playing: true
    })
  }else{
    audioCxt.pause();
    this.setData({ 
      music_on: true,
      music_playing:false
    })
  }
  },
  onLoad: function(e){
    showstopView:(e.showstopView==true?true:false);
    showresetView:(e.showresetView==true?true:false);
  }
,
  onShow: function () {
    wx.showToast({
      //TODO 看书没有这个弹窗
      title: '使用手机学习将不会对您的行为进行监督',
      icon: 'none',
      duration: 2000     
    })  
  },
  //开始
  start: function () {
    var TIME=util.formatTime(new Date())
    if(this.data.timecount=='开始学'){
      this.setData({
      timecount:'00:00:00',
      showstopView: false,
      showresetView:false,
      starttime:TIME
   })
   var that = this;
    //暂停
    clearInterval(intt);
    //时间重置
   
    intt = setInterval(function () { that.timer() }, 50);
  }else {
    
  }
  },
  //继续
  resume:function(){
    this.setData({
      showstopView: false,
      showresetView:false,
      showresumeView:true,
      timecount:this.data.timecount
   })
    var that = this;
    //暂停
    clearInterval(intt);
    //时间重置
    intt = setInterval(function () { that.timer() }, 50);
  }
  ,
  //暂停
  stop: function () {
    this.setData({
    showstopView:true,
    showresumeView:false
    })
    clearInterval(intt);
  },
  //停止
  Reset: function () {
    this.setData({
      showresumeView: false,
      showstopView: true,
      music_on: true,
      music_playing:false
    })
      clearInterval(intt);
      audioCxt.pause();
      var timecount=this.data.timecount
      var timeshow=timecount.match(/[0-9]{2}/g)
      var number=timeshow[0]+timeshow[1]+timeshow[2]
      var truescore
      if(number=='000000'){
          truescore=0
      }else{
          truescore=number.match(/[1-9]\d*$/g)
      }
      var scorenum=Number(truescore)
      if(scorenum>600){
        this.setData({
       score:parseInt(scorenum/600)
      })
      }else{
        this.setData({
          score:0
      })
    }
    wx.showModal({
      title: '这就学完了？',
      content: '您确定要结束本次学习？',
      success:(res) =>{
        if (res.confirm) {  
          var self = this
          wx.cloud.callFunction({
            name: 'login',
            complete: res => {// 根据openid查询是否授权
               var openid = res.openid
               this.setData({openId:openid})
              self.writeintodb(openid)
            }
          })
          //TODO 时长+得分 写入数据库
      }
    }
  })
},
writeintodb: function(openid){
  user.where({
    _openid: openid
  }).get({
    success:(res)=> {
      if (res.data.length != 0 ) {
        // 已经授权，可直接显示页面信息 
        record.add({
          data: {
          _openid:this.openId,
          _study_time:this.data.timecount,
          _start_time:this.data.starttime,
          _get_score:this.data.score
          }
        }).then(res => console.log(res))
        wx.navigateTo({
          url: '/pages/finish/finish?time='+this.data.timecount+'&score='+this.data.score
        })
      }
    },fail: res=>{
      wx.getUserProfile({
        desc: '用于登录, 获得奖励, 排名', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            name: res.userInfo.nickName,
            avatarUrl:res.userInfo.avatarUrl
          })
          //写入数据库
            user.add({
              data: {
              _openid:this.openId,
              _nickName: res.userInfo.nickName,
              _avatarUrl:res.userInfo.avatarUrl,
              }
            }).then(res => console.log(res))
            record.add({
              data: {
              _openid:this.openId,
              _study_time:this.data.timecount,
              _start_time:this.data.starttime,
              _get_score:this.data.score
              }
            }).then(res => console.log(res))
            wx.navigateTo({
              url: '/pages/finish/finish?time='+this.data.timecount+'&score='+this.data.score
            })
          }
        })
    }
  })
}
,
  iscanceled: function(){
    var that = this;
          clearInterval(intt);
          that.setData({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
          timecount: '00:00:00',
          showhour: '00',
          showminute: '00',
          showsecond: '00'
    })
  }
,
  timer: function () {
    var that = this;
    that.setData({
      millisecond: that.data.millisecond + 5
    })
    if (that.data.millisecond == 100 && that.data.second+1<10) {
      that.setData({
        millisecond: 0,
        second: that.data.second + 1,
        showsecond: '0'+String(that.data.second+1)
      })
    }
    if (that.data.millisecond == 100 && that.data.second+1>=10) {
      that.setData({
        millisecond: 0,
        second: that.data.second + 1,
        showsecond:String(that.data.second+1<60?that.data.second+1:'00')
      })
    }
    if (that.data.second == 60 && that.data.minute+1<10) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1,
        showminute: '0'+String(that.data.minute+1)
      })
    }
    if (that.data.second == 60 && that.data.minute+1>=10) {
      that.setData({
        second: 0,
        minute: data.minute + 1,
        showminute:String(that.data.minute+1<60?that.data.minute+1:'00')
      })
    }
    if (that.data.minute == 60 && that.data.hour+1<10) {
      that.setData({
        minute: 0,
        hour: that.data.hour + 1,
        showhour: '0'+String(that.data.hour+1)
       
      })
    }
    if (that.data.minute == 60 && that.data.hour+1>=10) {
      that.setData({
        minute: 0,
        hour: that.data.hour + 1,
        showhour: String(that.data.hour+1)
      })
    }
    that.setData({
      timecount:that.data.showhour + ":" + that.data.showminute + ":" + that.data.showsecond
    })
  },
getclickback: function(event) {

    if(event.detail==true){
      if(this.data.timecount=='开始学'){
        wx.showModal({
          title: '您还没有开始学习',
          content: '确定要离开？',
          success: function (res) {
            if (res.confirm) {  
              wx.navigateBack({
                delta: 1,
              })
      }
    }
  })
}else{
         this.Reset();
      }
  }
}
})