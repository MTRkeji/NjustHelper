// pages/me/mycomments/mycomments.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    commentlist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let studentnum = wx.getStorageSync("username")
    if (studentnum) {
    } else {
      wx.showModal({
        content: '未登录，请先点击 “获取权限” 然后登录！',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../me',
            })
          } else {
            wx.switchTab({
              url: '../me',
            })
          }
        }
      });
      return
    }
    let user = wx.getStorageSync("user")
    let openid = user.openid
    that.setData({
      openid: openid
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          let userInfo = wx.getStorageSync("userInfo")
          that.setData({
            userInfo: userInfo
          })
          that.getmycomments(that.data.openid)
        } else {
          wx.showModal({
            content: '未授权，请前往“Me”，点击“获取权限”！',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../me',
                })
              } else {
                wx.switchTab({
                  url: '../me',
                })
              }
            }
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
          wx.setStorageSync('commentsNum', res.data.commentsNum)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    that.getmycomments(that.data.openid)
    wx.stopPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getmycomments: function (openid) {
    let that = this;
    let url = njustHelperUrl.getmycomments()
    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        openid: openid
      },
      method: 'post',
      success: function (res) {
        that.setData({
          commentlist: res.data.list,
        })
      }
    });
  }
})