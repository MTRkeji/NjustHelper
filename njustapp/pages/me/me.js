// pages/me/me.js
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
    var that = this;
    if(wx.getStorageSync("username")){
      that.setData({
        name: wx.getStorageSync("name"),
        xuehao: wx.getStorageSync("username"),
        canClick: true
      })
    }else{
      that.setData({
        name: "请登录!",
        xuehao: "",
        canClick: false
      })
    }
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

  },

  toLogin: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  toLogout: function(){
    var that = this;
    try {
      wx.clearStorageSync();
      console.log("清理缓存成功")
      that.onShow();
    } catch (e) {
      // Do something when catch error
    }
  }
})