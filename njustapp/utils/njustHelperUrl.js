
var njustHelperUrl ={

  base: function () {
    
    return "https://www.mtrschool.top/api/";
    // return "http://192.168.0.104:8080/api/njustjwc/";

  },

  jwc: function(){
    return this.base() + "njustjwc/";
  },

  library:function(){
    return this.base() + "library/";
  },

  searchbook: function () {
    return this.library() + "search";
  },

  detail: function () {
    return this.library() + "detail";
  },

  borrowed: function () {
    return this.library() + "borrowed";
  },

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
}

module.exports = {
  base: njustHelperUrl.base,

  jwc: njustHelperUrl.jwc,

  library: njustHelperUrl.library,

  searchbook: njustHelperUrl.searchbook,

  detail: njustHelperUrl.detail,

  borrowed: njustHelperUrl.borrowed,

  login: njustHelperUrl.login,

  getgrade: njustHelperUrl.getgrade,

  testlogin: njustHelperUrl.testlogin,

  getcourse: njustHelperUrl.getcourse,

  getexam: njustHelperUrl.getexam,
  getclassroom: njustHelperUrl.getclassroom
}