package com.mtr.njusthelper.controller;
import com.alibaba.fastjson.JSONObject;
import com.mtr.njusthelper.service.JwcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
    /**
    @GetMapping("/test")
    public Object yzmtc(String username,String password){
        String cookie = jwcService.getVerification(username,password);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cookie",cookie);
        return jsonObject;
    }
    */

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

        JSONObject jsonObject;
        //解析前端传来的参数
        String username = requestJson.get("username").toString();
        String password = requestJson.get("password").toString();

        //登录获取Cookie
        jsonObject = jwcService.getVerification(username,password);
        return jsonObject;
    }

    @RequestMapping("/testlogin")
    public Object testLogin(@RequestBody JSONObject requestJson){

        JSONObject jsonObject = new JSONObject();
        //解析前端传来的参数
        String cookie = requestJson.get("cookie").toString();

        //登录获取Cookie
        String result = jwcService.testLogin(cookie);
        //System.out.println(result);
        jsonObject.put("success",result);
        return jsonObject;
    }
    /**成绩查询接口
     *
     * 前端带着Cookie访问
     * 获取cookie之后传入 jwcService.GradesQuary(cookies) 进行访问请求，数据检索，传回成绩 list
     * 传给前端
     *
     * @author MTR
     * @param
     * @return JSONObject
     */
    @RequestMapping("/getgrade")
    public Object getGrade(@RequestBody JSONObject requestJson){

        String cook = (String)requestJson.get("cookie");


        JSONObject jsonObject;
        jsonObject = jwcService.getGrade(cook);
        return jsonObject;
    }

    @RequestMapping("/getcourse")
    public Object getCourse(@RequestBody JSONObject requestJson){
        String cook = (String)requestJson.get("cookie");
        JSONObject jsonObject;
        jsonObject = jwcService.getCourse(cook);
        return jsonObject;
    }

    @RequestMapping("/getexam")
    public Object getExam(@RequestBody JSONObject requestJson){
        String cook = (String)requestJson.get("cookie");
        JSONObject jsonObject;
        jsonObject = jwcService.getExam(cook);
        return jsonObject;
    }
}
