// pages/me/me.js
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (wx.getStorageSync("username")) {
      that.setData({
        name: wx.getStorageSync("name"),
        xuehao: wx.getStorageSync("username"),
        canClick: true
      })
    } else {
      that.setData({
        name: "请登录!",
        xuehao: "",
        canClick: false
      })
    }
    let bgurl = njustHelperUrl.base() + "eryuelan.jpg";
    let waveurl = njustHelperUrl.base() + "wave.gif";
    that.setData({
      bgurl: bgurl,
      waveurl: waveurl
    })
    let userInfo = wx.getStorageSync("userInfo")
    if(userInfo){
      that.setData({
        userInfo: userInfo
      })
      let commentsNumUrl = njustHelperUrl.getmycommentsnum()
      let openid = wx.getStorageSync('user').openid
      wx.request({
        url: commentsNumUrl,
        method: 'post',
        data: {
          openid: openid
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          let lastNum = wx.getStorageSync('commentsNum')
          if (lastNum != null) {
            let newNum = res.data.commentsNum - lastNum;
            that.setData({
              newNum: newNum,
            })
          }
        }
      })
    }else{
      wx.showModal({
        content: '若头像无法显示，请点击“获取权限”!',
      })
      wx.getSetting({
        success(res) {
          console.log(res.authSetting)
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                wx.setStorageSync("userInfo", res.userInfo)
                that.setData({
                  userInfo: res.userInfo
                })
                let commentsNumUrl = njustHelperUrl.getmycommentsnum()
                let openid = wx.getStorageSync('user').openid
                wx.request({
                  url: commentsNumUrl,
                  method: 'post',
                  data: {
                    openid: openid
                  },
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res) {
                    let lastNum = wx.getStorageSync('commentsNum')
                    if (lastNum != null) {
                      let newNum = res.data.commentsNum - lastNum;
                      that.setData({
                        newNum: newNum,
                      })
                    }
                  }
                })
                let addaccounturl = njustHelperUrl.wechataccountadd()
                let user = wx.getStorageSync("user")
                let studentnum = wx.getStorageSync("username")
                if(studentnum){
                  wx.request({
                    url: addaccounturl,
                    //定义传到后台的数据
                    data: {
                      //从全局变量data中获取数据
                      openid: user.openid,
                      nickname: res.userInfo.nickName,
                      avatarurl: res.userInfo.avatarUrl,
                      gender: res.userInfo.gender,
                      province: res.userInfo.province,
                      city: res.userInfo.city,
                      studentnum: studentnum
                    },
                    method: 'post', //定义传到后台接受的是post方法还是get方法
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log("调用API成功");
                      if (res.data.success == "1") { } else {
                        wx.showModal({
                          content: '系统出现错误，请稍后再试！',
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
                }
              }
            })
          }
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onShow()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  toLogin: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  toLogout: function() {
    var that = this;
    try {
      wx.removeStorageSync('username');
      wx.removeStorageSync('password');
      console.log("清理缓存成功")
      that.onShow();
    } catch (e) {
      // Do something when catch error
    }
  },
  toAbout: function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  CopyLink: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },
  showQrcode: function() {
    let zanCode = njustHelperUrl.base() + "zanCode.png";
    wx.previewImage({
      urls: [zanCode],
      current: zanCode // 当前显示图片的http链接      
    })
  },
})