// pages/iborrowed/iborrowed.js
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
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
    let libusername = wx.getStorageSync("libusername");
    let libpassword = wx.getStorageSync("libpassword");
    if (libusername && libpassword) {
      var url = njustHelperUrl.borrowed();
      wx.request({
        url: url,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          libusername: libusername,
          libpassword: libpassword,
        },
        method: 'post', //定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.result == "0") {
            wx.showModal({
              content: '用户名或密码错误，请重新输入！',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          } else{
            that.setData({
              content: res.data.content,
            })
          }
        },
        fail: function (res) {
          console.log("调用API失败");
        }
      })
    } else {
      wx.showModal({
        content: '请点击借书证录入正确信息！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
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