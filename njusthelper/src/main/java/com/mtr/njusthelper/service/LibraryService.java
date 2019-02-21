package com.mtr.njusthelper.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mtr.njusthelper.utils.HtmlGetter;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LibraryService {

    public JSONObject search(String keyword){
        JSONObject argJson = new JSONObject();
        Map<String,Object> item = new HashMap<>();
        item.put("fieldCode","");
        item.put("fieldValue",keyword);
        List fieldList = new ArrayList();
        fieldList.add(item);
        item = new HashMap<>();
        item.put("fieldList",fieldList);
        List searchWords = new ArrayList();
        searchWords.add(item);
        argJson.put("searchWords",searchWords);
        argJson.put("filters",new JSONArray());
        argJson.put("limiter",new JSONArray());
        argJson.put("sortField","relevance");
        argJson.put("sortType","desc");
        argJson.put("pageSize",500);
        argJson.put("pageCount",1);
        argJson.put("locale","");
        argJson.put("first",true);
        JSONObject jsonObject = new JSONObject();
        if(keyword==""||keyword==null){
            jsonObject.put("total",0);
            jsonObject.put("content",null);
            return jsonObject;
        }
        jsonObject = HtmlGetter.getJson("http://202.119.83.14:8080/opac/ajax_search_adv.php",null,argJson);

        return jsonObject;
    }


    public JSONObject detail(String marcRecNo){
        JSONObject jsonObject = new JSONObject();
        String html = HtmlGetter.getHtml("http://202.119.83.14:8080/opac/item.php?marc_no="+marcRecNo,null,null);
        Document document = Jsoup.parse(html);
        List<Map<String,String>> item_detail = new ArrayList<>();
        //dl.booklist
        Elements elements = document.select("dl.booklist");
        for(Element item : elements) {
            //dl.booklist:nth-child(1) > dt:nth-child(1)
            String dt = item.select("dt").text();
            String dd = item.select("dd").text();
            if ((!dt.equals("")) && (dt != null) && (!dt.equals("豆瓣简介："))) {
                //System.out.println(dt + " : " + dd);
                Map<String, String> temp = new HashMap<>();
                temp.put("head",dt);
                temp.put("body",dd);
                item_detail.add(temp);
            }
        }
        jsonObject.put("detail",item_detail);

        List<Map<String,String>> gcInfo = new ArrayList<>();
        //tr.whitetext:nth-child(2)
        Elements elements1 = document.select("tr.whitetext");
        for(Element item : elements1){
            //tr.whitetext:nth-child(2) > td:nth-child(1)
            String shh = item.select("td:nth-child(1)").text();
            String tmh = item.select("td:nth-child(2)").text();
            String njq = item.select("td:nth-child(3)").text();
            String gcd = item.select("td:nth-child(4)").text();
            String skzt = item.select("td:nth-child(5)").text();
            Map<String,String> temp = new HashMap<>();
            temp.put("shh",shh);
            temp.put("tmh",tmh);
            temp.put("njq",njq);
            temp.put("gcd",gcd);
            temp.put("skzt",skzt);
            gcInfo.add(temp);
        }
        jsonObject.put("gcInfo",gcInfo);
        return jsonObject;
    }

    public JSONObject borrowed(String username,String password){
        JSONObject resultJson = new JSONObject();
        PrintWriter out = null;
        BufferedReader in = null;
        String cookie = "";
        try{
            //建立与教务处的连接
            String urlStr = "http://mc.m.5read.com/apis/user/userLogin.jspx?username="+username+"&password="+password+"&areaid=274&schoolid=528&userType=0&encPwd=0";
            URL url = new URL(urlStr);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            Map<String,List<String>> headers = urlConnection.getHeaderFields();
            List<String> cookies = headers.get("Set-Cookie");
            for(String ele : cookies){
                cookie = cookie + ele + ";";
            }
            cookie = cookie.substring(0,cookie.length()-1);

            urlStr = "http://mc.m.5read.com/api/opac/showOpacLink.jspx?newSign";
            JSONObject jsonObject = HtmlGetter.getJson(urlStr,cookie,null);
            if(jsonObject.getString("result").equals("0")){
                return jsonObject;
            }
            urlStr = jsonObject.getJSONArray("opacUrl").getJSONObject(0).getString("opaclendurl");
            //System.out.println(urlStr);
            String html = HtmlGetter.getHtml(urlStr,null,null);
            //div.tableLib:nth-child(1)
            Document document = Jsoup.parse(html);
            //#sn
            String sn = document.select("#sn").attr("value");
            resultJson.put("sn",sn);
            Elements elements = document.select("div.tableLib");
            List<Map> content = new ArrayList<>();
            for(Element element : elements){
                //.biao > p:nth-child(2)
                Map<String,Object> item = new HashMap<>();
                String title_author = element.select("div:nth-child(1)").select("p:nth-child(2)").text();
                item.put("title_author",title_author);
                //div.tableLib:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1)
                Elements elements1 = element.select("div:nth-child(2)").select("table:nth-child(1)").select("tbody:nth-child(1)").select("tr");
                List<Map<String,String>> detail = new ArrayList<>();
                String renewParam = "";
                for(Element element1 : elements1){
                    if(element1.select("th").size()>0){
                        Map<String,String> borrowDetail = new HashMap<>();
                        String th = element1.select("th").text();
                        String td = element1.select("td").text();
                        borrowDetail.put("th",th);
                        borrowDetail.put("td",td);
                        detail.add(borrowDetail);
                    }else{
                        renewParam = element1.select("td").text();
                    }
                }
                item.put("detail",detail);
                item.put("renewParam",renewParam);
                content.add(item);
            }
            resultJson.put("content",content);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try{
                if(out != null){
                    out.close();
                }
                if(in != null){
                    in.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return resultJson;
    }
}
