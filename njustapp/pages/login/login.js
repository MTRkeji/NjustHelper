// pages/login/login.js
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },

  //处理login的触发事件
  login: function(e) {
    var that = this;
    wx.showToast({
      title: '正在登录...',
      icon: 'loading',
      duration: 2000
    });

    var url = njustHelperUrl.login();
    var username = e.detail.value.username;
    var password = e.detail.value.password;

    wx.request({
      url: url,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        username: username,
        password: password,
      },
      method: 'post', //定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.success == "1") {
          wx.showToast({
            title: '成功',
            duration: 2000
          });
          wx.setStorage({
            key: 'username',
            data: username,
          })
          wx.setStorage({
            key: 'password',
            data: password,
          })
          wx.setStorageSync("cookie", res.data.cookie);
          wx.setStorageSync("name", res.data.name);
          wx.getUserInfo({
            success(res) {
              wx.setStorageSync("userInfo", res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
              let wechatloginUrl = njustHelperUrl.wechatlogin()
              let addaccounturl = njustHelperUrl.wechataccountadd()
              let userInfo = res.userInfo
              let studentnum = wx.getStorageSync("username")
              wx.login({
                success(res) {
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: addaccounturl,
                      data: {
                        code: res.code,
                        nickname: userInfo.nickName,
                        avatarurl: userInfo.avatarUrl,
                        gender: userInfo.gender,
                        province: userInfo.province,
                        city: userInfo.city,
                        studentnum: studentnum
                      },
                      method: 'post', //定义传到后台接受的是post方法还是get方法
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function(res) {
                        console.log("调用API成功");
                        if (res.data.success == "1") {} else {
                          wx.showModal({
                            content: '系统出现错误，请稍后再试！',
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
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })
            }
          })
          wx.switchTab({
            url: '../me/me',
          })
        } else {
          wx.hideToast()
          wx.showModal({
            content: '用户名或密码错误，请重新输入！（提示：本小程序对密码中的特殊字符支持还不完善，可以登录教务处修改为简单密码再来尝试，抱歉！）',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {}
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
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

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
})