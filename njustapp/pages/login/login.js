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
          wx.setStorageSync("name", res.data.name);
          wx.getUserInfo({
            success(res) {
              wx.setStorageSync("userInfo", res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
              let addaccounturl = njustHelperUrl.wechataccountadd()
              let user = wx.getStorageSync("user")
              let studentnum = wx.getStorageSync("username")
              wx.request({
                url: addaccounturl,
                //定义传到后台的数据
                data: {
                  //从全局变量data中获取数据
                  openid: user.openid,
                  nickname: res.userInfo.nickName,
                  avatarurl: res.userInfo.avatarUrl,
                  gender: res.userInfo.gender,
                  province: res.userInfo.province,
                  city: res.userInfo.city,
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
            }
          })
          wx.switchTab({
            url: '../me/me',
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
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {

        } else {
          wx.showModal({
            content: '请先点击 “获取权限” 进行授权！',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../me/me',
                })
              } else {
                wx.switchTab({
                  url: '../me/me',
                })
              }
            }
          });
          return;
        }
      }
    })
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