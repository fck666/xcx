// pages/mine/mine.js
// 获取应用实例
const app = getApp()
const db=wx.cloud.database()
const user=db.collection('userinfo')
Page({
  data: {
    userInfo: {},
    avatarUrl:'/img/头像.png',
    name:'点击授权登录信息',
    openId:'',
    iflog:''
  },
  // 事件处理函数
  onLoad: function(options) {
    if (wx.getUserProfile) {
      var self = this
      wx.cloud.callFunction({
      name: 'login',
      complete: res => {
         var openid = res.openid
        this.setData({openId:openid})
        // 根据openid查询是否授权
        self.queryAuthByOpenid(openid)
      }
    })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if(this.data.iflog==null){
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
        }
      })
    }
      },
  queryAuthByOpenid: function (openid) {//查询数据库登录信息
    user.where({
        _openid: openid
      })
      .get({
        success:(res)=> {
          if (res.data.length != 0 ) {
            // 已经授权，可直接显示页面信息 
            this.setData({
              userInfo: res.data[0],
              name: res.data[0]._nickName,
              avatarUrl:res.data[0]._avatarUrl,
              iflog:1
            })
          }
        }
      })
  },
})