//index.js
//获取应用实例
const app = getApp()
var njustHelperUrl = require('../../utils/njustHelperUrl.js')
const jinrishici = require('../../utils/jinrishici.js')
// 在页面中定义插屏广告
let interstitialAd = null
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    imgUrl: "",
    announcementText: "",
    animationData: {},
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
    
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-bdd7e2358625d322'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

    
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
    let schooldate = njustHelperUrl.base() + "schooldate.jpg?" + Math.random()
    that.setData({
      schoolDate: schooldate
    })
    that.getBingImage()
    let imgUrl1 = njustHelperUrl.base() + "banner1.jpg?" + Math.random()
    let imgUrl2 = njustHelperUrl.base() + "banner2.jpg?" + Math.random()
    let imgUrl3 = njustHelperUrl.base() + "banner3.jpg?" + Math.random()
    let imgUrl4 = njustHelperUrl.base() + "banner4.jpg?" + Math.random()
    that.setData({
      imgUrl: [imgUrl1, imgUrl2, imgUrl3, imgUrl4],
    })
    let noticeUrl = njustHelperUrl.getnotice();
    let adphonenumUrl = njustHelperUrl.getadphonenum();
    wx.request({
      url: noticeUrl,
      method: 'get',
      success: function (res) {
        if (res.data.text != "" && res.data.text != null) {
          that.setData({
            announcementText: res.data.text
          })
          that.initAnimation(res.data.text)
        }
      }
    })
    wx.request({
      url: adphonenumUrl,
      method: 'get',
      success: function (res) {
        if (res.data.adphonenum != "" && res.data.adphonenum != null) {
          console.log(res.data.adphonenum)
          that.setData({
            adphonenum: res.data.adphonenum
          })
        }
      }
    })
  },
  onShow: function() {
    var that = this;
    
    const courses = wx.getStorageSync("courses");
    if (courses) {
      that.setDay();
      that.setData({
        course: courses[that.data.index]
      })
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
      } else {
        that.login();
      }
    } else {
      that.loginAndGetCourse();
    }
  },
  onPullDownRefresh: function() {
    let that = this;
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
          if (res.data.success == "1") {
            wx.showToast({
              title: '正在刷新...',
              icon: 'loading',
              duration: 2000
            });
            that.getCourse();
          } else {
            that.loginAndGetCourse();
          }
        },
      })
    } else {
      that.loginAndGetCourse();
    }
    wx.stopPullDownRefresh()
  },

  loginAndGetCourse: function() {
    try {
      let that = this;
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
              that.getCourse();
            } else {
              wx.showModal({
                content: '教务处网站崩溃了！（提示：修改过密码需要重新登录！）',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              });
            }
          },
          fail: function(res) {}
        })
      } else {
      }
    } catch (e) {
      // Do something when catch error
      
    }
  },

  login: function() {
    try {
      let that = this;
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
            } else {
              wx.showModal({
                content: '教务处网站崩溃了！（提示：修改过密码需要重新登录！）',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              });
            }
          },
          fail: function(res) {}
        })
      } else {
        wx.showModal({
          content: '请登录！',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {}
          }
        });
      }
    } catch (e) {
      // Do something when catch error
      wx.showModal({
        content: '请登录！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {}
        }
      });
    }
  },
  getCourse: function() {
    var that = this;
    const url = njustHelperUrl.getcourse();
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
        let start_date = res.data.start_date.replace(/\-/g, '/')
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

  showQrcode: function (e) {
    let that = this
    let images = e.target.dataset.url
    wx.previewImage({
      urls: [images],
      current: images // 当前显示图片的http链接      
    })
    if (that.data.adphonenum != "" && that.data.adphonenum != null){
      wx.showModal({
        content: '是否电话联系商家？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: that.data.adphonenum //仅为示例，并非真实的电话号码
            })
          }
        }
      });
    }
  },

  showQrcodeBing: function () {
    let that = this
    let images = that.data.BingImage
    wx.previewImage({
      urls: [images],
      current: images // 当前显示图片的http链接      
    })
  },

  //获取必应每日一图
  getBingImage: function() {
    let that = this;
    let url = "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
    wx.request({
      url: url,
      method: 'get',
      success: function(res) {
        let uri = res.data.images[0].url
        that.setData({
          BingImage: "https://cn.bing.com" + uri
        })
        return "https://cn.bing.com" + uri
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  initAnimation: function (announcementText) {
    var that = this;
    //初始化动画
    var animation = wx.createAnimation({
      duration: 5500,
      timingFunction: 'linear'
    });
    animation.translate(-Number(announcementText.length * 12), 0).step();
    that.setData({
      animationData: animation.export()
    });

    /****************************优化部分*******************************/
    // 重新开始动画
    that.restartAnimation = setInterval(function () {
      animation.translate(255, 0).step({
        duration: 0
      });
      that.setData({
        animationData: animation.export()
      });
      // 延迟5再执行下个动画
      that.sleep(1);
      animation.translate(-Number(announcementText.length * 12), 0).step();
      that.setData({
        animationData: animation.export()
      });
    }.bind(this), 4500);
  },

  /**
   * 睡眠时间
   * @param  {Number} num 需要延迟的时间长度
   */
  sleep: function (num) {
    var nowTime = new Date();
    var exitTime = nowTime.getTime() + num;
    while (true) {
      nowTime = new Date();
      if (nowTime.getTime() > exitTime)
        return;
    }
  },
})