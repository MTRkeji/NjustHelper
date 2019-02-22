package com.mtr.njusthelper.utils;

import com.alibaba.fastjson.JSONObject;
import org.springframework.boot.jackson.JsonObjectDeserializer;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class HtmlGetter {
    //获取网页源码
    public static String getHtml(String thisUrl, String cookies, String arg){


        PrintWriter out = null;
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        try{
            //建立与教务处的连接
            URL url = new URL(thisUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            if(cookies!=null){
                urlConnection.setRequestProperty("Cookie",cookies);
            }

            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);

            //获取连接的输出流
            out = new PrintWriter(urlConnection.getOutputStream());
            //写入参数
            if(arg!=null){
                out.write(arg);
            }

            out.flush();

            //获取返回的数据流
            in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            //数据处理
            String line = "";
            while((line = in.readLine())!=null){
                sb.append(line);
            }
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
        String result = sb.toString();
        return result;
    }
    public static JSONObject getJson(String thisUrl, String cookies, Object arg){


        PrintWriter out = null;
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        try{
            //建立与教务处的连接
            URL url = new URL(thisUrl);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestProperty("Content-Type", "application/json");
            urlConnection.setRequestMethod("POST");
            if(cookies!=null){
                urlConnection.setRequestProperty("Cookie",cookies);
            }

            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);

            //获取连接的输出流
            out = new PrintWriter(urlConnection.getOutputStream());
            //写入参数
            if(arg!=null){
                out.write(arg.toString());
            }

            out.flush();

            //获取返回的数据流
            in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            //数据处理
            String line = "";
            while((line = in.readLine())!=null){
                sb.append(line);
            }
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
        String result = sb.toString();
        JSONObject jsonObject = JSONObject.parseObject(result);
        return jsonObject;
    }
}
