// pages/login/login.js
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  //处理login的触发事件
  login: function(e) {
    var that = this;
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 2000
    });
    var url=njustHelperUrl.login();
    wx.request({
      url: url,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        username: e.detail.value.username,
        password: e.detail.value.password,
      },
      method: 'post', //定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log("调用API成功");
        if (res.data.success == "1") {
          wx.showToast({
            title: '成功',
            duration: 2000
          });
          wx.setStorage({
            key: 'username',
            data: res.data.username,
          })
          wx.setStorage({
            key: 'password',
            data: res.data.password,
          })
          wx.setStorageSync("cookie", res.data.cookie);
          wx.switchTab({
            url: '../index/index',
          })
        } else {
          wx.showModal({
            content: '用户名或密码错误，请重新输入！',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
        }
      },
      fail: function(res) {
        console.log("调用API失败");
      }
    })
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
})