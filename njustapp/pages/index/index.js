//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
  onShow: function(){
    if(app.globalData.cookie == null){
      console.log("读取缓存之前")
      try {
        const username = wx.getStorageSync('username');
        const password = wx.getStorageSync("password");
        console.log(username)
        console.log(password)
        if (username != "" && password != "") {
          // Do something with return value
          console.log("成功读取缓存")
          wx.showToast({
            title: 'Logging...',
            icon: 'loading',
            duration: 10000
          });
          wx.request({
            url: 'http://192.168.0.104:8080/api/njustjwc/login', //后面详细介绍
            //定义传到后台的数据
            data: {
              //从全局变量data中获取数据
              username: username,
              password: password,
            },
            method: 'post', //定义传到后台接受的是post方法还是get方法
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log("调用API成功");
              console.log(res.data.message);
              if (res.data.success == "1") {
                wx.showToast({
                  title: 'Success',
                  duration: 2000
                });
                wx.setStorage({
                  key: 'username',
                  data: res.data.username,
                }, {
                    key: 'password',
                    data: res.data.password,
                  })
                app.globalData.cookie = res.data.cookie;
                console.log(app.globalData.cookie);
                wx.switchTab({
                  url: '../index/index',
                })
              } else {
                wx.showModal({
                  content: 'Incorrect username or password! Please try again.',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    }
                  }
                });
              }
            },
            fail: function (res) {
              console.log("调用API失败");
            }
          })
        } else {
          console.log("执行else")
          wx.redirectTo({
            url: '../login/login',
          })
        }
      } catch (e) {
        // Do something when catch error
        wx.navigateTo({
          url: '../login/login',
        })
      }
    }
  },
})
