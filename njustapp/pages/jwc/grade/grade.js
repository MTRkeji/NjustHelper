// pages/grade/grade.js
const app = getApp()
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
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
    var that = this //不要漏了这句，很重要
    if (that.testLogin()) {
      var url = njustHelperUrl.getgrade();
      wx.showToast({
        title: '正在导入...',
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        // url: 'http://192.168.0.104:8080/api/njustjwc/getgrade',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: function(res) {
          //将获取到的json数据，存在名字叫zhihu的这个数组中
          that.setData({
            grades: res.data,
            //res代表success函数的事件对，data是固定的，stories是是上面json数据中stories
          })
          wx.showToast({
            title: '导入成绩成功！',
            duration: 1000
          });
        }
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
    this.onShow();
    wx.stopPullDownRefresh();
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

  checkboxChange: function(e) {
    let that = this;
    let checkedList = e.detail.value;
    let grades = that.data.grades;
    let selectCreditAll = 0;
    let selectGradeAll = 0;
    let selectGPAAll = 0;
    for (let k = 0; k < grades.list.length; k++) {
      let selectCredit = 0;
      let selectGrade = 0;
      let selectGPA = 0;
      let allList = grades.list[k].data;
      for (let j = 0; j < allList.length; j++) {
        for (let i = 0; i < checkedList.length; i++) {
          if (allList[j].kcmc == checkedList[i]) {
            selectCredit = selectCredit + parseFloat(allList[j].xf);
            selectGrade = selectGrade + parseFloat(allList[j].xf) * that.processGrade(allList[j].grade)
            selectGPA = selectGPA + parseFloat(allList[j].GP) * parseFloat(allList[j].xf)

            selectCreditAll = selectCreditAll + parseFloat(allList[j].xf);
            selectGradeAll = selectGradeAll + parseFloat(allList[j].xf) * that.processGrade(allList[j].grade)
            selectGPAAll = selectGPAAll + parseFloat(allList[j].GP) * parseFloat(allList[j].xf)
          }
        }
      }
      grades.list[k].sumBxXf = selectCredit;
      grades.list[k].avgBxGrade = (selectGrade / selectCredit).toFixed(2);
      grades.list[k].avgBxGP = (selectGPA / selectCredit).toFixed(2);

    }
    grades.summarizing.sumBxXf = selectCreditAll;
    grades.summarizing.avgBxGrade = (selectGradeAll / selectCreditAll).toFixed(2);
    grades.summarizing.avgBxGP = (selectGPAAll / selectCreditAll).toFixed(2);
    that.setData({
      grades: grades
    })
  },

  //计算成绩
  processGrade: function(cj) {
    if (cj == "优秀") {
      cj = "90";
    }
    if (cj == "免修") {
      cj = "89";
    }
    if (cj == "良好") {
      cj = "80";
    }
    if (cj == "中等") {
      cj = "70";
    }
    if (cj == "及格") {
      cj = "60";
    }
    if (cj == "通过") {
      cj = "60";
    }
    if (cj == "合格") {
      cj = "60";
    }
    if (cj == "不及格") {
      cj = "0";
    }
    if (cj == "不合格") {
      cj = "0";
    }
    if (cj == "不通过") {
      cj = "0";
    }
    if (cj == "请评教") {
      cj = "0";
    }
    return parseFloat(cj);
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