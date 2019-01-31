// pages/login/login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: "",
    password: "",
    message: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
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
  //处理accountInput的触发事件
  accountInput: function(e) {
    var username = e.detail.value; //从页面获取到用户输入的用户名/邮箱/手机号
    if (username != '') {
      this.setData({
        account: username
      }); //把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理pwdBlurt的触发事件
  pwdBlur: function(e) {
    var pwd = e.detail.value; //从页面获取到用户输入的密码
    if (pwd != '') {
      this.setData({
        password: pwd
      }); //把获取到的密码赋值给全局变量Date中的password
    }
  },
  //处理login的触发事件
  login: function(e) {
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 5000
    });
    wx.request({
      url: 'http://192.168.0.104:8080/api/njustjwc/login', //后面详细介绍
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        username: this.data.account,
        password: this.data.password,
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
  }
})