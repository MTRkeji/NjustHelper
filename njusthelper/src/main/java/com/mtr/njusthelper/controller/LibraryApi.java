package com.mtr.njusthelper.controller;

import com.alibaba.fastjson.JSONObject;
import com.mtr.njusthelper.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/library")
public class LibraryApi {
    private LibraryService libraryService;
    @Autowired
    public LibraryApi(LibraryService libraryService){
        this.libraryService = libraryService;
    }

    @RequestMapping("/search")
    public JSONObject search(@RequestBody JSONObject requestJson){
        String keyword = requestJson.getString("keyword");
        JSONObject jsonObject = libraryService.search(keyword);
        return jsonObject;
    }

    @RequestMapping("/detail")
    public JSONObject detail(@RequestBody JSONObject requestJson){
        String marcRecNo = requestJson.getString("marcRecNo");
        JSONObject jsonObject = libraryService.detail(marcRecNo);
        return jsonObject;
    }

    @RequestMapping("/borrowed")
    public JSONObject borrowed(@RequestBody JSONObject requestJson){
        String username = requestJson.getString("libusername");
        String password = requestJson.getString("libpassword");
        JSONObject jsonObject = libraryService.borrowed(username,password);
        return jsonObject;
    }
}
