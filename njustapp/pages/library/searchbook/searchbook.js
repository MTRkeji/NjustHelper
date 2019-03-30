// pages/searchbook/searchbook.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    inputShowed: false,
    inputVal: ""
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    var that = this //不要漏了这句，很重要
    that.setData({
      inputVal: e.detail.value
    });
    
    var url = njustHelperUrl.searchbook();
    wx.request({
      // url: 'http://192.168.0.104:8080/api/njustjwc/getexam',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        keyword: that.data.inputVal,
      },
      method: 'post',
      success: function (res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        if(res.data.total!=0){
          that.setData({
            total: res.data.total,
            result: res.data.content
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
        }else{
          that.setData({
            total: "",
            result: []
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
        }
      }
    })
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