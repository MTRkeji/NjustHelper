// pages/jwc/cengke/cengke.js
const app = getApp()
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (that.testLogin()) {}
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

  },


  inputTyping: function(e) {
    var that = this //不要漏了这句，很重要
    that.setData({
      inputVal: e.detail.value
    });
  },
  search: function(e) {
    let that = this
    var url = njustHelperUrl.getcengke();
    wx.showToast({
      title: '正在搜索...',
      icon: 'loading',
      duration: 15000
    });
    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        cookie: wx.getStorageSync("cookie"),
        //name: that.data.inputVal,
        name: e.detail.value.name,
        teacher: e.detail.value.teacher
      },
      method: 'post',
      success: function(res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          courses: res.data.courses,
          //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
        })
        console.log(res.data.courses)
        wx.showToast({
          title: '成功！',
          duration: 1000
        });
      }
    })
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
})