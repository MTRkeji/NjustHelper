//index.js
//获取应用实例
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
const jinrishici = require('../../utils/jinrishici.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    imgUrl: "",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    let that = this
    let vision = wx.getStorageSync("vision")
    if (vision == null || vision != app.globalData.vision) {
      wx.setStorageSync("vision", app.globalData.vision)
      that.onPullDownRefresh()
    }
    jinrishici.load(result => {
      // 下面是处理逻辑示例
      that.setData({
        jinrishici: result.data.content,
        shiciauthor: result.data.origin.author
      })
    })
    that.getBingImage()
    let imgUrl1 = that.data.BingImage
    let imgUrl2 = njustHelperUrl.base() + "banner2.jpg"
    let imgUrl3 = njustHelperUrl.base() + "banner3.jpg"
    let imgUrl4 = njustHelperUrl.base() + "banner4.jpg"
    that.setData({
      imgUrl: [imgUrl1, imgUrl2, imgUrl3, imgUrl4]
    })
  },
  onShow: function() {
    var that = this;
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      var url = njustHelperUrl.testlogin();
      wx.request({
        url: url,
        data: {
          //从全局变量data中获取数据
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post', //定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.success == "1") {} else {
            that.login();
          }
        },
      })
    }
    const courses = wx.getStorageSync("courses");
    if (courses) {
      that.setDay();
      that.setData({
        course: courses[that.data.index]
      })
    } else {
      that.getCourse()
    }
  },
  onPullDownRefresh: function() {
    let that = this;
    that.getCourse();
    wx.stopPullDownRefresh()
  },

  login: function() {
    try {
      const username = wx.getStorageSync('username');
      const password = wx.getStorageSync("password");
      if (username != "" && password != "") {
        // Do something with return value
        wx.showToast({
          title: '正在登录...',
          icon: 'loading',
          duration: 2000
        });
        const url = njustHelperUrl.login();
        wx.request({
          url: url,
          //定义传到后台的数据
          data: {
            //从全局变量data中获取数据
            username: username,
            password: password,
          },
          method: 'post', //定义传到后台接受的是post方法还是get方法
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function(res) {
            if (res.data.success == "1") {
              wx.showToast({
                title: '成功',
                duration: 1000
              });
              wx.setStorageSync("cookie", res.data.cookie);
              wx.switchTab({
                url: '../index/index',
              })
            } else {
              wx.showModal({
                content: '教务处网站崩溃了！',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                  }
                }
              });
            }
          },
          fail: function(res) {
          }
        })
      } else {

      }
    } catch (e) {
      // Do something when catch error
      wx.showModal({
        content: '请登录！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
          }
        }
      });
    }
  },
  getCourse: function() {
    var that = this;
    const url = njustHelperUrl.getcourse();
    if (wx.getStorageSync("cookie") != "" && wx.getStorageSync("cookie") != null) {
      wx.showToast({
        title: '正在导入...',
        icon: 'loading',
        duration: 3000
      });
      wx.request({
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          cookie: wx.getStorageSync("cookie"),
        },
        method: 'post',
        success: function(res) {
          wx.setStorageSync("courses", res.data.course)
          let start_date = res.data.start_date.substring(1, res.data.start_date.length - 1).replace(/\-/g, '/')
          wx.setStorageSync("start_date", start_date)
          that.setDay()
          that.setData({
            course: res.data.course[that.data.index],
          })
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
        success: function(res) {
          if (res.confirm) {
          }
        }
      });
    }
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
        index: week - 1,
      })
    } else if (week > 25) {
      that.setData({
        index: 24,
      })
    } else {
      that.setData({
        index: 0,
      })
    }
    if (days < 0) {
      that.setData({
        today: -2
      })
    } else {
      that.setData({
        today: today
      })
    }
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

  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      towerList: list
    })
  },

  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },

  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },

  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.towerList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        towerList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        towerList: list
      })
    }
  },
  getBingImage:function(){
    let that = this;
    let url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
    wx.request({
      url: url,
      method: 'get',
      success: function(res){
        let uri = res.data.images[0].url
        console.log("https://cn.bing.com" + uri)
        that.setData({
          BingImage: "https://cn.bing.com"+uri
        })
        return "https://cn.bing.com" + uri
      }
    })
  }
})