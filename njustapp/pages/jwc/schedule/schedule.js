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

  getAllWeekDate: function() {
    let that = this;
    const dateStorage = wx.getStorageSync("start_date");
    if (!dateStorage) return [];
    const startTime = dayjs(dateStorage)

    let dates = [];
    let curTime;
    let curTime2MonthDay;
    for (let w = 0; w < 25; w++) {
      for (let i = 0; i < 7; i++) {
        // 根据所选周数计算出对应的Dayjs对象
        curTime = startTime.add(w * 7 + i, 'day');
        // 转为 mm/dd 格式
        curTime2MonthDay = curTime.format('MM/DD');
        dates.push(curTime2MonthDay);
      }
    }
    that.setData({
      WeekDates: dates
    })
  },

  /**
   * @Doc 记录用户所选周数，和该周日期，以备渲染
   */
  bindPickerChange: function(e) {
    let that = this;
    const weekSelected = e.detail.value;
    that.setData({
      index: weekSelected
    })
  },

  startChange: function(e) {
    let that = this;
    const weekSelected = e.detail.value;
    that.setData({
      start: weekSelected
    })
  },

  endChange: function(e) {
    let that = this;
    const weekSelected = e.detail.value;
    that.setData({
      end: weekSelected
    })
  },
  hideModal: function() {
    let that = this;
    that.setData({
      showModal: false
    })
  },

  addActivity: function(e) {
    var that = this //不要漏了这句，很重要
    let name = e.detail.value.name;
    if (name == null || name == "") {
      wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
        duration: 2000
      })
    } else {
      let address = e.detail.value.address;
      let teacher = e.detail.value.teacher;
      let start = e.detail.value.start;
      let end = e.detail.value.end;
      let week = that.data.semester[start] + "-" + that.data.semester[end]
      let courseIndex = that.data.courseIndex;
      let dayIndex = that.data.dayIndex;
      const courses = wx.getStorageSync("courses");
      for (let i = start; i <= end; i++) {
        if (courses[i][courseIndex][dayIndex]) {
          wx.showModal({
            content: "与其他课程/活动冲突！\n课程/活动：" + courses[i][courseIndex][dayIndex].name + "\n周次：" + courses[i][courseIndex][dayIndex].week,
            confirmText: "关闭",
            showCancel: false,
            success: res => {}
          });
          return;
        }
      }
      for (let i = start; i <= end; i++) {
        courses[i][courseIndex][dayIndex] = {
          "name": name,
          "address": address,
          "teacher": teacher,
          "week": week
        }
      }
      that.setColor(courses)
      that.setData({
        courses: courses
      })
      wx.setStorageSync("courses", courses)
      that.setData({
        showModal: false
      })
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (wx.getStorageSync("start_date")) {
      that.setIndex()
      const courses = wx.getStorageSync("courses");
      if (courses) {
        that.setData({
          courses: courses
        })
        if (wx.getStorageSync("courseColor")) {
          let courseColor = wx.getStorageSync("courseColor")
          that.setData({
            courseColor: courseColor
          })
        } else {
          that.setColor(courses)
        }
      } else {
        that.getCourse()
      }

    } else {
      that.getCourse()
    }
    that.getAllWeekDate();
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
    let that = this;
    wx.showModal({
      content: "刷新将会清空手动添加的课程或事件，是否确定刷新？",
      showCancel: true,
      success: res => {
        if (res.confirm) {
          that.getCourse();
          that.getAllWeekDate();
          wx.stopPullDownRefresh()
        }
      }
    });
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
    const w = parseInt(e.currentTarget.dataset.w);
    const i = parseInt(e.currentTarget.dataset.i);
    const j = parseInt(e.currentTarget.dataset.j);
    const thiscourse = that.data.courses[w][i][j];
    if (thiscourse) {
      wx.showModal({
        content: thiscourse.name + '\n' + thiscourse.teacher + '\n' + thiscourse.week + '\n' + thiscourse.address,
        showCancel: true,
        cancelText: "删除",
        cancelColor: "#FF0000",
        confirmText: "关闭",
        success: res => {
          if (res.cancel) {
            wx.showModal({
              content: '确定要删除此项内容？',
              showCancel: true,
              confirmColor: "#FF0000",
              success: res => {
                if (res.confirm) {
                  let courses = that.data.courses;
                  courses[w][i][j] = null;
                  that.setData({
                    courses: courses
                  })
                  wx.setStorageSync("courses", courses)
                }
              }
            })
          }
        }
      });
    } else {
      that.setData({
        showModal: true,
        courseIndex: i,
        dayIndex: j
      })
    }
  },

  /**
   * @Doc 拉取课表信息
   */
  getCourse: function() {
    let that = this;
    if (that.testLogin()) {
      const url = njustHelperUrl.getcourse();
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
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: res => {
          that.setData({
            course: res.data.course,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.setStorageSync("courses", res.data.course)
          let start_date = res.data.start_date.replace(/\-/g, '/')
          wx.setStorageSync("start_date", start_date)
          that.setIndex()
          that.setColor(res.data.course)
          that.onLoad()
          wx.showToast({
            title: '导入课表成功！',
            duration: 1000
          });
        }
      })
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
    wx.setStorageSync("courseColor", courseColor)
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