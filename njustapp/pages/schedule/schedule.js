const njustHelperUrl = require('../../utils/njustHelperUrl')
const { semester, colorArrays, weeks, courseSection } = require('../../config/constants/schedule')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    colorArrays,
    semester,
    weeks,
    courseSection,
    index: 0
  },
  bindPickerChange: function (e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value
    })
    that.onShow();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (wx.getStorageSync("start_date")) {
      console.log("执行onshowIF")
      console.log(wx.getStorageSync("start_date"))
      that.setIndex()
    } else {
      that.getCourse()
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
    let that = this;
    const courses = wx.getStorageSync("courses");
    if (courses) {
      that.setData({
        course: courses[that.data.index]
      })
    } else {
      that.getCourse()
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
    this.getCourse();
    wx.stopPullDownRefresh()
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
  showCardView: function(e){
    let that = this;
    const i = parseInt(e.currentTarget.dataset.i);
    const j = parseInt(e.currentTarget.dataset.j);
    const thiscourse = that.data.course[i][j]
    wx.showModal({
      content: thiscourse.name + '\n' + thiscourse.teacher + '\n' + thiscourse.week + '\n' + thiscourse.address,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  getCourse: function(){
    let that = this;
    const url = njustHelperUrl.getcourse();
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      wx.showToast({
        title: '正在导入...',
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getcourse',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: function (res) {
          //将获取到的json数据，存在名字叫zhihu的这个数组中
          that.setData({
            course: res.data.course[that.data.index],
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.setStorageSync("courses", res.data.course)
          wx.setStorageSync("start_date", res.data.start_date)
          that.setIndex()
          that.onShow()
          wx.showToast({
            title: '导入课表成功！',
            duration: 1000
          });
        }
      })
    } else {
      wx.switchTab({
        url: '../me/me',
      })
    }
  },
  setIndex: function(){
    console.log("执行setIndex")
    let that = this;
    let start_date = wx.getStorageSync("start_date")
    console.log(start_date)
    start_date = new Date(wx.getStorageSync("start_date").replace(/-/g, "/"));
    console.log(start_date)
    const current_date = new Date();
    console.log(current_date)
    //var end_date = new Date(this.data.end_date.replace(/-/g, "/"));
    const days = current_date.getTime() - start_date.getTime();
    const day = parseInt(days / (1000 * 60 * 60 * 24));
    console.log(day)
    const week = parseInt(day / 7) + 1;
    console.log(week)
    if (week > 0 && week < 26) {
      that.setData({
        index: week - 1
      })
    } else if (week > 25) {
      that.setData({
        index: 24
      })
    } else {
      that.setData({
        index: 0
      })
    }
  },
})