// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    startimg: '/img/4.png',
    ranklist:''
  },
  // 事件处理函数
  onReady(){
    this.setData({ranklist:"榜单"});
  },
  touchstart(){
    this.setData({startimg:'/img/5.png'})
  },
  beginstudy() {
    wx.showActionSheet({
        itemList: ['使用手机学习','手机？我才不用'],      
        success: function (res) {
          if (!res.cancel) {
            switch(res.tapIndex){
              case 0:{ 
                wx.navigateTo({url: '../study/study'});
              break;
            }
              case 1:{
                wx.showModal({
                  title: '温馨提示',
                  content: '不使用手机学习将对您的手机行为进行监督，您可以接受吗？',
                  success: function (res) {
                    if (res.confirm) {  
                       wx.navigateTo({url: '../study/study'});//TODO 新的看书包
                    } 
                  }
                })
              break;
            }
          };
        } 
      }
    })
    this.setData({startimg:'/img/4.png'})
  },
  showranklist(){
    wx.navigateTo({url: '../ranklist/ranklist'});
  }
})
