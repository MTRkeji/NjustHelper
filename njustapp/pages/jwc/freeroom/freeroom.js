// pages/jwc/freeroom/freeroom.js
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildings: ["一工", "二工", "三工","四工"],
    buildingIndex: 0,
    weeks: ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周", "第八周", "第九周", "第十周", "第十一周", "第十二周", "第十三周", "第十四周", "第十五周", "第十六周", "第十七周", "第十八周", "第十九周", "第二十周", "第二十一周", "第二十二周", "第二十三周", "第二十四周", "第二十五周"],
    weekIndex: 0,
    weekdays: ["周一","周二","周三","周四","周五","周六","周日"],
    weekdayIndex: 0,
    sessions: ["第一大节","第二大节","第三大节","第四大节","第五大节"],
    sessionIndex: 0,
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
  bindBuildingChange: function (e) {
    console.log('picker jxl 发生选择改变，携带值为', e.detail.value);

    this.setData({
      buildingIndex: e.detail.value
    })
  },
  bindWeekChange: function (e) {
    console.log('picker jxl 发生选择改变，携带值为', e.detail.value);

    this.setData({
      weekIndex: e.detail.value
    })
  },
  bindWeekdayChange: function (e) {
    console.log('picker jxl 发生选择改变，携带值为', e.detail.value);

    this.setData({
      weekdayIndex: e.detail.value
    })
  },
  bindSessionChange: function (e) {
    console.log('picker jxl 发生选择改变，携带值为', e.detail.value);

    this.setData({
      sessionIndex: e.detail.value
    })
  },
  select: function (e) {
    var that = this //不要漏了这句，很重要
    var url = njustHelperUrl.getclassroom();
    let jxlbh;
    if (that.data.buildingIndex==3){
      jxlbh = 6;
    }else{
      jxlbh = parseInt(that.data.buildingIndex)+1;
    }
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      wx.showToast({
        title: '正在查询...',
        icon: 'loading',
        duration: 500
      });
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getgrade',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie: wx.getStorageSync("cookie"),
          jxlbh: jxlbh + "",
          zc: that.data.weekIndex + 1 + "",
          xq: that.data.weekdayIndex + 1 + "",
          jc: that.data.sessionIndex + 1 + "",
        },
        method: 'post',
        success: function (res) {
          //将获取到的json数据，存在名字叫zhihu的这个数组中
          console.log(res.data.classrooms.length)
          that.setData({
            classrooms:res.data.classrooms,
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
    } else {
      wx.switchTab({
        url: '../me/me',
      })
    }
  },
})