// pages/mtr/detail/detail.js
const app = getApp();
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pid: 0,
    placeholder: "评论：",
    inputShowed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postid: options.id
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
    this.getthismoment()
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
    this.getthismoment()
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

  postcomment: function(e){
    let that = this;
    let url = njustHelperUrl.postcomment();
    let user = wx.getStorageSync("user");
    let openid = user.openid;
    let thismoment = that.data.thismoment
    let postid = thismoment.id;
    let pid = that.data.pid;
    wx.request({
      url: url,
      method: 'post',
      data: {
        openid: openid,
        postid: postid,
        content: e.detail.value.comment,
        pid: pid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res){
        if(res.data.success == 1){
          wx.showToast({
            title: '成功',
            duration: 1000
          });
          that.setData({
            inputVal: ''
          })
          that.getthismoment()
        }else{
          wx.showToast({
            title: '失败',
            duration: 1000
          });
        }
      }
    })
  },

  getthismoment: function(){
    let that = this
    let postid = that.data.postid
    let getmomentdetail = njustHelperUrl.getmomentdetail()
    wx.request({
      url: getmomentdetail,
      data: {
        postid: postid,
      },
      method: 'get',
      success: function (res) {
        that.setData({
          thismoment: res.data.moment
        })
      }
    })
  },
  showQrcode: function (e) {
    let pictures = e.target.dataset.urls;
    let picture = e.target.dataset.url;
    wx.previewImage({
      urls: pictures,
      current: picture // 当前显示图片的http链接      
    })
  },
  setpid: function(e){
    this.setData({
      pid: e.target.dataset.item.id,
      placeholder: "回复@" + e.target.dataset.item.weaccount.nickname+":",
      inputShowed: true
    })
  },
  setcomment: function (e) {
    this.setData({
      pid: 0,
      placeholder: '评论 :',
      inputShowed: true
    })
  },
})