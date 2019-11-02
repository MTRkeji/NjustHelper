// pages/me/mymessages/mymessages.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    messagelist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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
          that.getmymessages(that.data.openid)
        } else {
          wx.showModal({
            content: '未授权，请点击确定，打开用户信息权限！',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    wx.getSetting({
                      success(res) {
                        // res.authSetting = {
                        //   "scope.userInfo": true,
                        //   "scope.userLocation": true
                        // }
                        if (res.authSetting['scope.userInfo']) {
                          wx.getUserInfo({
                            success(res) {
                              const userInfo = res.userInfo
                              const nickName = userInfo.nickName
                              const avatarUrl = userInfo.avatarUrl
                              const gender = userInfo.gender // 性别 0：未知、1：男、2：女
                              const province = userInfo.province
                              const city = userInfo.city
                              const country = userInfo.country
                              wx.setStorageSync("userInfo", userInfo)
                            }
                          })
                          that.getmymessages(that.data.openid)
                        } else {
                          wx.switchTab({
                            url: '../index/index',
                          })
                        }
                      }
                    })
                  }
                })
              } else {
                wx.switchTab({
                  url: '../index/index',
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
    that.getmymessages(that.data.openid)
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
  getmymessages: function (openid) {
    let that = this;
    let url = njustHelperUrl.getmymessages()
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
          messagelist: res.data.list,
        })
      }
    });
  }
})