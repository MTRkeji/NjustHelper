// pages/mtr/mtr.js
const app = getApp();
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    ChannelTabCur: 0,
    scrollLeft: 0,
    channelscrollLeft: 0,
    Tablist: ["最新", "热门"],
    ChannelTablist: ["综合", '提问', '二手交易', '失物/寻物', '资源分享'],
    momentlist: [],
    inputShowed: false,
    inputVal: ""
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
    let that = this;
    let studentnum = wx.getStorageSync("username")
    if(studentnum){
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            let userInfo = wx.getStorageSync("userInfo")
            if (userInfo) {
              that.setData({
                userInfo: userInfo
              })
            } else {
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
                    success: function (res) {
                      console.log("调用API成功");
                      if (res.data.success == "1") { } else {
                        wx.showModal({
                          content: '系统出现错误，请稍后再试！',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                            }
                          }
                        });
                      }
                    },
                    fail: function (res) {
                      console.log("调用API失败");
                    }
                  })
                }
              })
            }
            that.getmoments(1, that.data.inputVal, that.data.TabCur)
          } else {
            wx.showModal({
              content: '未授权，请前往“Me”，点击“获取权限”！',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../me/me',
                  })
                } else {
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }
            });
          }
        }
      })
    }else{
      wx.showModal({
        content: '未登录，请先点击 “获取权限” 然后登录！',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../me/me',
            })
          } else {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      });
    }
  },

  inputTyping: function(e) {
    var that = this //不要漏了这句，很重要
    that.setData({
      inputVal: e.detail.value
    });
    that.getmoments(1, that.data.inputVal, that.data.TabCur)
    let pageNum = that.data.nextPage;
    if (pageNum == 0) {
      that.setData({
        bottomtext: "没有更多了！"
      })
    }
  },
  search: function() {
    let that = this
    that.getmoments(1, that.data.inputVal, that.data.TabCur)
    let pageNum = that.data.nextPage;
    if (pageNum == 0) {
      that.setData({
        bottomtext: "没有更多了！"
      })
    }
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
    let that = this;
    that.getmoments(1, that.data.inputVal, that.data.TabCur)
    wx.stopPullDownRefresh()
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
  tabSelectChannel(e) {
    let that = this
    let channel = that.data.ChannelTablist[e.currentTarget.dataset.id]
    let searchval = that.data.inputVal;
    let value = channel + searchval;
    if (channel == '综合') {
      that.getmoments(1, that.data.inputVal, that.data.TabCur)
    } else {
      that.getmoments(1, value, that.data.TabCur)
    }
    let pageNum = that.data.nextPage;
    if (pageNum == 0) {
      that.setData({
        bottomtext: "没有更多了！"
      })
    }
    that.setData({
      ChannelTabCur: e.currentTarget.dataset.id,
      channelscrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  tabSelect(e) {
    let that = this;
    let tabcur = e.currentTarget.dataset.id;
    let channel = that.data.ChannelTablist[that.data.ChannelTabCur]
    let searchval = that.data.inputVal;
    let value = channel + searchval;
    if (channel == '综合') {
      that.getmoments(1, that.data.inputVal, tabcur)
    } else {
      that.getmoments(1, value, tabcur)
    }
    that.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
    })
  },
  addpost: function() {
    wx.navigateTo({
      url: 'post/post',
    })
  },
  upper(e) {
    this.onPullDownRefresh();
  },
  lower(e) {
    let that = this;
    let pageNum = that.data.nextPage;
    let tabcur = that.data.TabCur;
    if (pageNum == 0) {
      that.setData({
        bottomtext: "已加载全部！"
      })
    } else {
      let url = njustHelperUrl.getmoments()
      let searchval = that.data.inputVal;
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          pageNum: pageNum,
          pageSize: 30,
          searchval: searchval,
          sort: tabcur
        },
        method: 'post',
        success: function(res) {
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
  getmoments: function(pageNum, searchval, tabcur) {
    let that = this;
    let url = njustHelperUrl.getmoments()
    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        pageNum: pageNum,
        pageSize: 30,
        searchval: searchval,
        sort: tabcur
      },
      method: 'post',
      success: function(res) {
        that.setData({
          momentlist: res.data.list,
          pageNum: res.data.pageNum,
          nextPage: res.data.nextPage,
        })
      }
    });
  }
})