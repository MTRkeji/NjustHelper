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
    console.log("cookie:" + wx.getStorageSync("cookie"))
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
          if (res.data.success == "1") {
          } else {
            that.login();
          }
        },
      })
    }
    var courses = wx.getStorageSync("courses");
    if (courses) {
      that.setDay();
      that.setData({
        course: courses[that.data.index]
      })
    } else {
      that.getCourse()
    }
  },
  login: function() {
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
          duration: 2000
        });
        var url = njustHelperUrl.login();
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
  },
  getCourse: function () {
    var that = this;
    var url = njustHelperUrl.getcourse();
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
        success: function (res) {
          //将获取到的json数据，存在名字叫zhihu的这个数组中
          that.setData({
            course: res.data.course[that.data.index],
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.setStorageSync("courses", res.data.course)
          wx.setStorageSync("start_date", res.data.start_date)
          that.setDay()
          that.onShow()
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
    var start_date = wx.getStorageSync("start_date")
    console.log(start_date)
    var start_date = new Date(wx.getStorageSync("start_date").replace(/-/g, "/"));
    console.log(start_date)
    var current_date = new Date();
    console.log(current_date)
    //var end_date = new Date(this.data.end_date.replace(/-/g, "/"));
    var days = current_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    var today = parseInt(day % 7);
    console.log(day)
    var week = parseInt(day / 7) + 1;
    console.log(week)
    if (week > 0 && week < 26) {
      that.setData({
        index: week - 1,
        today: today
      })
    } else if (week > 25) {
      that.setData({
        index: 24,
        today: 6
      })
    } else {
      that.setData({
        index: 0,
        today: -1
      })
    }
    console.log("今天是："+that.data.today)
  }
})