// pages/test/test.js
const app = getApp()
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

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
    var that = this //不要漏了这句，很重要
    if(that.testLogin()){
      var url = njustHelperUrl.getexam();
      wx.showToast({
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getexam',
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
            exams: res.data.exams,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.showToast({
            title: 'success',
            icon: 'success',
            duration: 1000
          });
        }
      })
    }
  },

  /**
   * 测试是否处于登录状态
   */
  testLogin: function() {
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      return true;
    } else {
      wx.showModal({
        content: '请登录！',
        showCancel: false
      });
      wx.switchTab({
        url: '/pages/me/me'
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

  }
})