// pages/me/mymoments/mymoments.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    momentlist: [],
    scrollLeft: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let studentnum = wx.getStorageSync("username")
    if (studentnum) {
    }else{
      wx.showModal({
        content: '未登录，请先点击 “获取权限” 然后登录！',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../me',
            })
          } else {
            wx.switchTab({
              url: '../me',
            })
          }
        }
      });
      return;
    }
    let user = wx.getStorageSync("user")
    let openid = user.openid
    that.setData({
      openid: openid
    })
    wx.getSetting({
      success(res) {
        console.log("获取用户权限设置")
        if (res.authSetting['scope.userInfo']) {
          console.log("有用户信息权限")
          let userInfo = wx.getStorageSync("userInfo")
          that.setData({
            userInfo: userInfo
          })
          that.getmoments(1, that.data.openid)
        } else {
          wx.showModal({
            content: '未授权，请前往“Me”，点击“获取权限”！',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../me',
                })
              } else {
                wx.switchTab({
                  url: '../me',
                })
              }
            }
          });
        }
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
    let that = this;
    that.getmoments(1, that.data.openid)
    wx.stopPullDownRefresh()
  },
  upper(e) {
    this.onPullDownRefresh();
  },
  lower(e) {
    let that = this;
    let pageNum = that.data.nextPage;
    if (pageNum == 0) {
      that.setData({
        bottomtext: "已加载全部！"
      })
    } else {
      let url = njustHelperUrl.getmymoments()
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          pageNum: pageNum,
          pageSize: 30,
          openid: that.data.openid
        },
        method: 'post',
        success: function (res) {
          let newmomentlist = that.data.momentlist.concat(res.data.list)
          that.setData({
            momentlist: newmomentlist,
            pageNum: res.data.pageNum,
            nextPage: res.data.nextPage,
          })
        }
      });
      that.setData({
        bottomtext: "正在加载..."
      })
    }
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
  getmoments: function (pageNum, openid) {
    let that = this;
    let url = njustHelperUrl.getmymoments()
    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        pageNum: pageNum,
        pageSize: 30,
        openid: openid
      },
      method: 'post',
      success: function (res) {
        that.setData({
          momentlist: res.data.list,
          pageNum: res.data.pageNum,
          nextPage: res.data.nextPage,
        })
      }
    });
  },
  deletemoment: function(e){
    let that = this;
    let id = e.target.dataset.id;
    wx.showModal({
      content: '确定要删除此条信息？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          let deleteurl = njustHelperUrl.deletemoment()
          wx.request({
            url: deleteurl,
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              id: id,
            },
            success: function (res) {
              if (res.data.success == 1) {
                wx.showToast({
                  title: '已删除',
                })

                that.onPullDownRefresh();
              } else {
                wx.showToast({
                  title: '失败',
                })
              }
            }
          })
        }
      }
    })
  }
})