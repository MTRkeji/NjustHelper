const njustHelperUrl = require('../../../utils/njustHelperUrl')
const { semester, colorArrays, weeks, courseSection } = require('../../../config/constants/schedule')

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    // 本学期开始时间数组 [yyyy, mm, dd]
    const startDate = dateStorage.slice(1, dateStorage.length - 1).split('-');
    let dates = [];
    let startTime;
    let curTime;
    let curTime2MonthDay;
    for (let i = 0; i < 7; i++) {
      // 开学日的Date对象
      startTime = new Date(startDate[0], startDate[1] - 1, startDate[2]);
      // 根据所选周数计算出对应的Date对象
      curTime = new Date(startTime.setDate(startTime.getDate() + weekSelected * 7 + i));
      // 转为 mm/dd 格式
      curTime2MonthDay = curTime.toLocaleString().split(' ')[0].slice(5);
      dates.push(curTime2MonthDay);
    }
    return dates;
  },

  /**
   * @Doc 记录用户所选周数，和该周日期，以备渲染
   */
  bindPickerChange: function (e) {
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
  onLoad: function (options) {
    let that = this;
    if (wx.getStorageSync("start_date")) {
      let curWeekDates = that.getWeekDateByUserPicker(0);
      that.setData({
        curWeekDates
      })
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
    let that = this;
    that.getCourse();
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

  /**
   * @Doc 渲染课表详情页
   */
  showCardView: function(e){
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
  getCourse: function(){
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
        url: '../../me/me',
      })
    }
  },

  /**
   * @Doc 拉取课表信息
   */
  setIndex: function(){
    let that = this;
    let start_date = wx.getStorageSync("start_date")
    start_date = new Date(wx.getStorageSync("start_date").replace(/-/g, "/"));
    const current_date = new Date();
    const days = current_date.getTime() - start_date.getTime();
    const day = parseInt(days / (1000 * 60 * 60 * 24));
    const week = parseInt(day / 7) + 1;
    console.log(`今天是第${week}周`)
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