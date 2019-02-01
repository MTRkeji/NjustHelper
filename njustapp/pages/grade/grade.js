// pages/grade/grade.js
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this //不要漏了这句，很重要
    var url = njustHelperUrl.getgrade();
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getgrade',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data:{
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: function (res) {
          //将获取到的json数据，存在名字叫zhihu的这个数组中
          that.setData({
            grades: res.data,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
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

  }
})