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
import java.util.List;

@RestController
@RequestMapping("/api/njustjwc")
public class JwcApi {
    private JwcService jwcService;
    @Autowired
    public JwcApi(JwcService jwcService){
        this.jwcService = jwcService;
    }
    @GetMapping("/test")
    public Object yzmtc(String username,String password){
        String cookie = jwcService.getVerification(username,password);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cookie",cookie);
        return jsonObject;
    }

    @RequestMapping("/login")
    public Object Login(@RequestBody JSONObject requestJson){
        String username = requestJson.get("username").toString();
        String password = requestJson.get("password").toString();
        String cookie = jwcService.getVerification(username,password);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("cookie",cookie);
        return jsonObject;
    }

    @RequestMapping("/cjcx")
    public Object Cjcx(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        JSONObject jsonObject = new JSONObject();
        List list = jwcService.GradesQuary(cookies);
        for(int i = 0;i<list.size();i++){
            jsonObject.put("grades",list);
        }
        return jsonObject;
    }
}
