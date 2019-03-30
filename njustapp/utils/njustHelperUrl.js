
var njustHelperUrl ={

  base: function () {
    
    return "https://www.mtrschool.top/";

  },

  base2: function () {

    return "https://mtrschool.top/";

  },

  api: function () {

    return this.base() + "api/";

  },

  /**
   * 模块设置
   */

  jwc: function(){
    return this.api() + "njustjwc/";
  },

  library:function(){
    return this.api() + "library/";
  },
  wechat: function () {
    return this.api() + "wechat/";
  },

  moment: function () {
    return this.api() + "moment/";
  },


  /**
   * 图书馆api
   */

  searchbook: function () {
    return this.library() + "search";
  },

  detail: function () {
    return this.library() + "detail";
  },

  borrowed: function () {
    return this.library() + "borrowed";
  },


  /**
   * 教务处api
   */

  login: function () {
    return this.jwc() + "login";
  },

  getgrade:function() {
    return this.jwc() + "getgrade";
  },

  testlogin: function() {
    return this.jwc() + "testlogin";
  },

  getcourse:function() {
    return this.jwc() + "getcourse";
  },

  getexam: function () {
    return this.jwc() + "getexam";
  },

  getclassroom: function () {
    return this.jwc() + "getclassroom";
  },


  /**
   * 微信api
   */
  wechatlogin: function () {
    return this.wechat() + "login";
  },

  wechataccountadd: function () {
    return this.wechat() + "add";
  },

  /**
   * 论坛api
   */
  post: function(){
    return this.moment() + "post"
  },

  uploadtoken: function(){
    return this.moment() + "uploadtoken"
  },

  upload: function(){
    return this.moment() + "upload"
  },

  getmoments: function(){
    return this.moment() + "getmoments"
  },

  getmomentdetail: function () {
    return this.moment() + "getmomentdetail"
  },

  postcomment: function() {
    return this.moment() + "postcomment"
  },

  getmymoments: function () {
    return this.moment() + "getmymoments"
  },

  deletemoment: function(){
    return this.moment()+"deletemoment"
  },

  getmycomments: function(){
    return this.moment()+"getmycomments"
  },

  getmycommentsnum: function () {
    return this.moment() + "getmycommentsnum"
  },

  getmymessages: function () {
    return this.moment() + "getmymessages"
  }
}

module.exports = {
  base: njustHelperUrl.base,

  base2: njustHelperUrl.base2,

  api: njustHelperUrl.api,



  jwc: njustHelperUrl.jwc,

  library: njustHelperUrl.library,

  wechat: njustHelperUrl.wechat,

  moment: njustHelperUrl.moment,



  searchbook: njustHelperUrl.searchbook,

  detail: njustHelperUrl.detail,

  borrowed: njustHelperUrl.borrowed,



  login: njustHelperUrl.login,

  getgrade: njustHelperUrl.getgrade,

  testlogin: njustHelperUrl.testlogin,

  getcourse: njustHelperUrl.getcourse,

  getexam: njustHelperUrl.getexam,

  getclassroom: njustHelperUrl.getclassroom,



  wechatlogin: njustHelperUrl.wechatlogin,

  wechataccountadd: njustHelperUrl.wechataccountadd,



  post: njustHelperUrl.post,

  uploadtoken: njustHelperUrl.uploadtoken,

  upload: njustHelperUrl.upload,

  getmoments: njustHelperUrl.getmoments,

  getmomentdetail: njustHelperUrl.getmomentdetail,

  postcomment: njustHelperUrl.postcomment,

  getmymoments: njustHelperUrl.getmymoments,
  
  deletemoment: njustHelperUrl.deletemoment,

  getmycomments: njustHelperUrl.getmycomments,

  getmycommentsnum: njustHelperUrl.getmycommentsnum,

  getmymessages: njustHelperUrl.getmymessages
}