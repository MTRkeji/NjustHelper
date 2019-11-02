// pages/jwc/freeroom/freeroom.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    buildings: ["一工", "二工", "三工", "四工"],
    buildingIndex: 3,
    weeks: ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周", "第八周", "第九周", "第十周", "第十一周", "第十二周", "第十三周", "第十四周", "第十五周", "第十六周", "第十七周", "第十八周", "第十九周", "第二十周", "第二十一周", "第二十二周", "第二十三周", "第二十四周", "第二十五周"],
    weekIndex: 0,
    weekdays: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    weekdayIndex: 0,
    sessions: ["第一大节", "第二大节", "第三大节", "第四大节", "第五大节"],
    checkboxData: [{
      'name': "第一大节",
      'value': 0
    }, {
      'name': "第二大节",
      'value': 1
    }, {
      'name': "第三大节",
      'value': 2
    }, {
      'name': "第四大节",
      'value': 3
    }, {
      'name': "第五大节",
      'value': 4
    }],
    sessionIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setDay()
    if (that.testLogin()) {}
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
  bindBuildingChange: function(e) {
    this.setData({
      buildingIndex: e.detail.value
    })
  },
  bindWeekChange: function(e) {
    this.setData({
      weekIndex: e.detail.value
    })
  },
  bindWeekdayChange: function(e) {
    this.setData({
      weekdayIndex: e.detail.value
    })
  },
  bindSessionChange: function(e) {
    this.setData({
      sessionIndex: e.detail.value
    })
  },
  select: function(e) {
    var that = this //不要漏了这句，很重要
    var url = njustHelperUrl.getclassroom();
    let jxlbh;
    let zc = parseInt(e.detail.value.zc) + 1;
    let xq = parseInt(e.detail.value.xq) + 1;
    let jcList = e.detail.value.jc1
    let jc = parseInt(e.detail.value.jc) + 1;
    if (e.detail.value.jxlbh == 3) {
      jxlbh = 6;
    } else {
      jxlbh = parseInt(e.detail.value.jxlbh) + 1;
    }
    wx.showToast({
      title: '正在查询...',
      icon: 'loading',
      duration: 500
    });
    wx.request({
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        cookie: wx.getStorageSync("cookie"),
        jxlbh: jxlbh + "",
        zc: zc + "",
        xq: xq + "",
        jc: jcList
      },
      method: 'post',
      success: function(res) {
        //将获取到的json数据，存在名字叫zhihu的这个数组中
        that.setData({
          classrooms: res.data.classrooms,
          //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
        })
        var arr = [];
        for (let i = 0; i < res.data.classrooms.length / 4; i++) {
          arr.push(i)
        }
        that.setData({
          arr: arr,
        })
      }
    })
  },
  setDay: function() {
    var that = this;
    let start_date = wx.getStorageSync("start_date")
    start_date = new Date(start_date)
    var current_date = new Date();
    //var end_date = new Date(this.data.end_date.replace(/-/g, "/"));
    var days = current_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    var today = parseInt(day % 7);
    var week = parseInt(day / 7) + 1;
    if (week > 0 && week < 26) {
      that.setData({
        weekIndex: week - 1,
      })
    } else if (week > 25) {
      that.setData({
        weekIndex: 24,
      })
    } else {
      that.setData({
        weekIndex: 0,
      })
    }
    if (days < 0) {
      that.setData({
        weekdayIndex: 0
      })
    } else {
      that.setData({
        weekdayIndex: today
      })
    }
  },
  /**
   * 测试是否处于登录状态
   */
  testLogin: function() {
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      return true;
    } else {
      wx.showModal({
        content: '请登录！',
        showCancel: false
      });
      wx.switchTab({
        url: '/pages/me/me'
      })
    }
  },
})