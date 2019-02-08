
var njustHelperUrl ={

  base: function () {
    
    return "https://www.mtrschool.top/api/njustjwc/";
    // return "http://192.168.0.104:8080/api/njustjwc/";

  },

  login: function () {
    return this.base() + "login";
  },

  getgrade:function() {
    return this.base() + "getgrade";
  },

  testlogin: function() {
    return this.base() + "testlogin";
  },

  getcourse:function() {
    return this.base() + "getcourse";
  }
}
module.exports = {
  base: njustHelperUrl.base,

  login: njustHelperUrl.login,

  getgrade: njustHelperUrl.getgrade,

  testlogin: njustHelperUrl.testlogin,

  getcourse: njustHelperUrl.getcourse
}