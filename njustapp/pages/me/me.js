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
    }
  },

  onGotUserInfo: function (e) {
    var that = this;
    if(e.detail.errMsg.indexOf('ok')!=-1){
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success(res) {
                wx.setStorageSync("userInfo", res.userInfo)
                that.setData({
                  userInfo: res.userInfo
                })
              }
            })
          }
        }
      })
      wx.navigateTo({
        url: '../login/login',
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

  toLogout: function() {
    var that = this;
    try {
      wx.clearStorage();
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