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
    let that = this
    let vision = wx.getStorageSync("vision")
    if(vision == null || vision != app.globalData.vision){
      console.log(vision + "    " + app.globalData.vision)
      that.onPullDownRefresh()
      wx.setStorageSync("vision", app.globalData.vision)
    }
  },
  onShow: function() {
    var that = this;
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
        success: function(res) {
          console.log("调用API成功");
          if (res.data.success == "1") {} else {
            that.login();
          }
        },
      })
    }
    const courses = wx.getStorageSync("courses");
    if (courses) {
      that.setDay();
      that.setData({
        course: courses[that.data.index]
      })
    } else {
      that.getCourse()
    }
  },
  onPullDownRefresh: function () {
    let that = this;
    that.getCourse();
    wx.stopPullDownRefresh()
  },

  login: function() {
    try {
      const username = wx.getStorageSync('username');
      const password = wx.getStorageSync("password");
      if (username != "" && password != "") {
        // Do something with return value
        wx.showToast({
          title: '正在登录...',
          icon: 'loading',
          duration: 2000
        });
        const url = njustHelperUrl.login();
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
          success: function(res) {
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
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              });
            }
          },
          fail: function(res) {
            console.log("调用API失败");
          }
        })
      } else {
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
  },
  getCourse: function() {
    var that = this;
    const url = njustHelperUrl.getcourse();
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      wx.showToast({
        title: '正在导入...',
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getcourse',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: function(res) {
          wx.setStorageSync("courses", res.data.course)
          let start_date = res.data.start_date.substring(1, res.data.start_date.length - 1).replace(/\-/g, '/')
          wx.setStorageSync("start_date", start_date)
          that.setDay()
          that.setData({
            course: res.data.course[that.data.index],
          })
          //that.onShow()
          wx.showToast({
            title: '导入课表成功！',
            duration: 1000
          });
        }
      })
    } else {
      wx.switchTab({
        url: '../me/me',
      })
    }
  },
  setDay: function() {
    var that = this;
    let start_date = wx.getStorageSync("start_date")
    start_date = new Date(start_date)
    console.log(wx.getStorageSync("start_date"))
    console.log("start_date:"+start_date)
    var current_date = new Date();
    console.log("current_date:" + current_date)
    //var end_date = new Date(this.data.end_date.replace(/-/g, "/"));
    var days = current_date.getTime() - start_date.getTime();
    console.log("days:" + days)
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    console.log("day:" + day)
    var today = parseInt(day % 7);
    var week = parseInt(day / 7) + 1;
    if (week > 0 && week < 26) {
      that.setData({
        index: week - 1,
      })
    } else if (week > 25) {
      that.setData({
        index: 24,
      })
    } else {
      that.setData({
        index: 0,
      })
    }
    if (days < 0) {
      that.setData({
        today: -2
      })
    } else {
      that.setData({
        today: today
      })
    }
    console.log("今天是：" + that.data.today)
  }
})