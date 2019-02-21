// pages/library/searchbook/detail/detail.js
var njustHelperUrl = require('../../../../utils/njustHelperUrl.js')
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
    var that = this;
    that.setData({
      marcRecNo: options.marcRecNo
    })
    var url = njustHelperUrl.detail();
    wx.request({
      // url: 'http://192.168.0.104:8080/api/njustjwc/getexam',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        marcRecNo: that.data.marcRecNo,
      },
      method: 'post',
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          gcInfo:res.data.gcInfo,
          detail:res.data.detail,
        })
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