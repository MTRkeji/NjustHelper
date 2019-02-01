//index.js
//获取应用实例
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
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
  onLoad: function() {

  },
  onShow: function() {
    var that = this;
    console.log("cookie:"+wx.getStorageSync("cookie"))
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {

      var url = njustHelperUrl.testlogin();
      console.log("执行testlogin")
      wx.request({
        url: url,
        data: {
          //从全局变量data中获取数据
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post', //定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          if (res.data.success == "1") {
          } else {
            that.login();
          }
        },
      })
    }else{
      that.login();
    }
  },
  login:function(){
    try {
      const username = wx.getStorageSync('username');
      const password = wx.getStorageSync("password");
      console.log(username)
      console.log(password)
      if (username != "" && password != "") {
        // Do something with return value
        console.log("成功读取缓存")
        wx.showToast({
          title: '正在登录...',
          icon: 'loading',
          duration: 10000
        });
        var url = njustHelperUrl.testlogin;
        wx.request({
          url: url,
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
            if (res.data.success == "1") {
              wx.showToast({
                title: '成功',
                duration: 2000
              });
              wx.setStorageSync("cookie", res.data.cookie);
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              wx.showModal({
                content: '用户名或密码错误，请重新输入！',
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
})