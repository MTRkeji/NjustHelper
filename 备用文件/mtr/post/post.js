// pages/mtr/post/post.js
const app = getApp()
var njustHelperUrl = require('../../../utils/njustHelperUrl.js')
const qiniuUploader = require("../../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    files: [],
    index: 0,
    picker: ['综合','提问', '二手交易','失物/寻物','资源分享'],
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
    let uploadtokenurl = njustHelperUrl.uploadtoken();
    wx.request({
      url: uploadtokenurl,
      method: 'get',
      success: function(res) {
        that.setData({
          uploadtoken: res.data.uptoken,
          imgUrl: res.data.imgUrl
        })
      }
    })

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
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  // 删除图片
  deleteImg: function(e) {
    var that = this;
    var files = that.data.files;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          files.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          files: files,
        });
      }
    })
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  post: function(e) {
    let that = this;
    if (e.detail.value.title == '' || e.detail.value.title == null || e.detail.value.content == '' || e.detail.value.content==null){
      wx.showModal({
        title: '提示',
        content: '标题和内容不能为空！',
      })
      return
    }
    let posturl = njustHelperUrl.post();
    let uploadtokenurl = njustHelperUrl.uploadtoken();
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    if (that.data.picker[that.data.index]!='综合'){
      title = '[' + that.data.picker[that.data.index] + ']' + title;
    }
    let label = e.detail.value.label;
    let files = that.data.files;
    let user = wx.getStorageSync("user");
    let openid = user.openid;
    wx.request({
      url: posturl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        openid: openid,
        title: title,
        content: content,
        label: label,
      },
      method: 'post',
      success: function(res) {
        if (res.data.success == 1) {
          let uploadurl = njustHelperUrl.upload();
          let postid = res.data.postid;
          let tempFilePaths = that.data.files;
          for (let i = 0; i < tempFilePaths.length; i++) {
            qiniuUploader.upload(tempFilePaths[i], (res) => {
              // 每个文件上传成功后,处理相关的事情
              // 其中 info 是文件上传成功后，服务端返回的json，形式如
              // {
              //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
              //    "key": "gogopher.jpg"
              //  }
              // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
              wx.request({
                url: uploadurl,
                header: {
                  'Content-Type': 'application/json'
                },
                method: 'post',
                data: {
                  postid: postid,
                  picurl: res.imageURL
                },
                success: function(res) {
                  if (res.data.success == 1) {
                    console.log("上传服务器成功");
                  }
                }
              })
              console.log('file url is: ' + res.fileUrl);
            }, (error) => {
              console.log('error: ' + error);
            }, {
              region: 'ECN',
              domain: that.data.imgUrl, // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
              // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
              uptoken: that.data.uploadtoken, // 由其他程序生成七牛 uptoken
              uptokenURL: uploadtokenurl, // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
            }, (res) => {
              console.log('上传进度', res.progress)
              console.log('已经上传的数据长度', res.totalBytesSent)
              console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
            }, () => {
              // 取消上传
            }, () => {
              // `before` 上传前执行的操作
            }, (err) => {
              // `complete` 上传接受后执行的操作(无论成功还是失败都执行)
            });
          }
          wx.showToast({
            title: '发送成功',
          })
          wx.switchTab({
            url: '../../mtr/mtr',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '发送失败',
          })
        }
      }
    })
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})