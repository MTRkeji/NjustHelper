package com.mtr.njusthelper.controller;
import com.alibaba.fastjson.JSONObject;
import com.mtr.njusthelper.service.JwcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

//教务处API接口
@RestController
@RequestMapping("/api/njustjwc")
public class JwcApi {
    private JwcService jwcService;
    @Autowired
    public JwcApi(JwcService jwcService){
        this.jwcService = jwcService;
    }

    //测试接口
    @GetMapping("/test")
    public Object yzmtc(String username,String password){
        String cookie = jwcService.getVerification(username,password);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cookie",cookie);
        return jsonObject;
    }

    /**登录接口
     *
     * 前端传 username，password字段
     * 调用 jwcService.getVerification(username,password) 登录教务处获取Cookie
     * 将Cookie传回前端。
     *
     * @param requestJson
     * @return JSONObject
     * @author MTR
     */
    @RequestMapping("/login")
    public Object Login(@RequestBody JSONObject requestJson){

        JSONObject jsonObject = new JSONObject();
        //解析前端传来的参数
        String username = requestJson.get("username").toString();
        String password = requestJson.get("password").toString();

        //登录获取Cookie
        String cookie = jwcService.getVerification(username,password);
        System.out.println(cookie);
        if(cookie == "errorInput"){
            jsonObject.put("success","0");
        }else{
            jsonObject.put("success","1");
            jsonObject.put("cookie",cookie);
            jsonObject.put("username",username);
            jsonObject.put("password",password);
        }
        return jsonObject;
    }

    /**成绩查询接口
     *
     * 前端带着Cookie访问
     * 获取cookie之后传入 jwcService.GradesQuary(cookies) 进行访问请求，数据检索，传回成绩 list
     * 传给前端
     *
     * @author MTR
     * @param request
     * @return JSONObject
     */
    @RequestMapping("/getgrade")
    public Object getGrade(HttpServletRequest request){

        //获取cookie
        Cookie[] cookies = request.getCookies();

        JSONObject jsonObject;
        jsonObject = jwcService.getGrade(cookies);
        return jsonObject;
    }

    @RequestMapping("/getcourse")
    public Object getCourse(HttpServletRequest request){
        //获取cookie
        Cookie[] cookies = request.getCookies();

        JSONObject jsonObject;
        jsonObject = jwcService.getCourse(cookies);
        return jsonObject;
    }
}
