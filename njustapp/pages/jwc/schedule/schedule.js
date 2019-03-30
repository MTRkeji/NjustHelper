const app = getApp()
const njustHelperUrl = require('../../../utils/njustHelperUrl')
const {
  semester,
  colorArrays,
  weeks,
  courseSection
} = require('../../../config/constants/schedule')
const dayjs = require('../../../utils/day')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    colorArrays,
    semester,
    weeks,
    courseSection,
    index: 0,
    curWeekDates: [],
  },

  /**
   * @Doc 根据用户所选周数，计算该周对应日期
   * @param {number} 所选周数
   * @return {Array} 该周对应的日期
   */
  getWeekDateByUserPicker: weekSelected => {
    let that = this;
    const dateStorage = wx.getStorageSync("start_date");
    if (!dateStorage) return [];
    const startTime = dayjs(dateStorage)

    let dates = [];
    let curTime;
    let curTime2MonthDay;
    for (let i = 0; i < 7; i++) {
      // 根据所选周数计算出对应的Dayjs对象
      curTime = startTime.add(weekSelected * 7 + i, 'day');
      // 转为 mm/dd 格式
      curTime2MonthDay = curTime.format('MM/DD');
      dates.push(curTime2MonthDay);
    }
    return dates;
    console.log('一周的日期', dates)
  },

  /**
   * @Doc 记录用户所选周数，和该周日期，以备渲染
   */
  bindPickerChange: function(e) {
    let that = this;
    const weekSelected = e.detail.value;
    let curWeekDates = that.getWeekDateByUserPicker(weekSelected);
    that.setData({
      curWeekDates,
      index: weekSelected
    })
    that.onShow();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (wx.getStorageSync("start_date")) {
      const dateStorage = wx.getStorageSync("start_date");

      const startTime = dayjs(dateStorage)
      const nowTime = dayjs()
      // 相差周数
      const diffWeek = nowTime.diff(startTime, 'week')
      let curWeekDates;
      if (diffWeek < 0) {
        curWeekDates = that.getWeekDateByUserPicker(0);
      } else if (diffWeek > 25) {
        curWeekDates = that.getWeekDateByUserPicker(24);
      } else {
        curWeekDates = that.getWeekDateByUserPicker(diffWeek);
      }
      that.setData({
        curWeekDates,
      })
      that.setIndex()
    } else {
      that.getCourse()
    }
    wx.switchTab({
      url: './schedule',
    })
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
    const courses = wx.getStorageSync("courses");
    console.log('courses', courses)
    if (courses) {
      that.setData({
        course: courses[that.data.index]
      })
      that.setColor(courses)
    } else {
      that.getCourse()
    }
  },

  currentChange: function(e) {
    if (e.detail.source == "touch") {
      let that = this;
      const weekSelected = e.detail.current;
      let curWeekDates = that.getWeekDateByUserPicker(weekSelected);
      that.setData({
        curWeekDates,
        index: weekSelected
      })
      that.onShow();
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
    that.getCourse();
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

  /**
   * @Doc 渲染课表详情页
   */
  showCardView: function(e) {
    let that = this;
    const i = parseInt(e.currentTarget.dataset.i);
    const j = parseInt(e.currentTarget.dataset.j);
    const thiscourse = that.data.course[i][j]
    wx.showModal({
      content: thiscourse.name + '\n' + thiscourse.teacher + '\n' + thiscourse.week + '\n' + thiscourse.address,
      showCancel: false,
      success: res => console.log('用户点击确定:', res.confirm)
    });
  },

  /**
   * @Doc 拉取课表信息
   */
  getCourse: function() {
    let that = this;
    const url = njustHelperUrl.getcourse();
    const cookie = wx.getStorageSync("cookie");
    if (cookie) {
      wx.showToast({
        title: '正在导入...',
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie,
        },
        method: 'post',
        success: res => {
          that.setData({
            course: res.data.course[that.data.index],
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.setStorageSync("courses", res.data.course)
          let start_date = res.data.start_date.substring(1, res.data.start_date.length - 1).replace(/\-/g, '/')
          wx.setStorageSync("start_date", start_date)
          that.setIndex()
          that.setColor(res.data.course)
          that.onShow()
          wx.showToast({
            title: '导入课表成功！',
            duration: 1000
          });
        }
      })
    } else {
      wx.showModal({
        content: '请登录！',
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
   * @Doc 拉取课表信息
   */
  setIndex: function() {
    let that = this;
    let start_date = wx.getStorageSync("start_date")
    console.log('start_date', start_date)
    const startTime = dayjs(start_date)
    console.log('startTime', startTime)
    const nowTime = dayjs()
    console.log('nowTime', nowTime)
    // 相差周数
    const diffWeek = nowTime.diff(startTime, 'week')
    console.log('diffWeek', diffWeek)
    let curWeek;
    if (diffWeek < 0) {
      curWeek = 0;
    } else if (diffWeek >= 25) {
      curWeek = 24;
    } else {
      curWeek = diffWeek;
    }
    that.setData({
      index: curWeek,
    })
    console.log('index', curWeek)
    console.log(`今天是第${curWeek + 1}周`)
  },

  setColor: function(courses) {
    let that = this
    let m = 0
    let courseColor = {}
    for (let i = 0; i < courses.length; i++) {
      for (let j = 0; j < 6; j++) {
        for (let k = 0; k < 7; k++) {
          if (courses[i][j][k] != null) {
            let key = courses[i][j][k].name
            console.log("key:" + key)
            if (courseColor[key] == null) {
              courseColor[key] = colorArrays[m]
              m++
              console.log("key:" + key + ",value:" + courseColor[key])
            }
          }
        }
      }
    }
    that.setData({
      courseColor
    })
  }
})