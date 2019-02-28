package com.mtr.njusthelper.service;


import com.alibaba.fastjson.JSONObject;
import com.mtr.njusthelper.utils.HtmlGetter;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


//教务处service
@Service
public class JwcService {
    @Value("${start_date}")
    private String start_date;

    //测试cookie是否有效
    public String testLogin(String cookies){
        JSONObject jsonObject = new JSONObject();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        //System.out.println(domain);
        String html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/framework/main.jsp",cookies,null);

        Pattern pattern = Pattern.compile("<div id=\"Top1_divLoginName\".*?>[\\s\\S]*?</div>");
        Matcher matcher = pattern.matcher(html);
        if(matcher.find()){
            return "1";
        }
        return "0";
    }

    /**登录service
     *
     * 根据controller传来的参数进行登录，并返回登陆成功之后的cookie
     *
     * @author MTR
     * @param username
     * @param password
     * @return cookie
     *
     */
    public JSONObject getVerification(String username, String password){
        JSONObject jsonObject = new JSONObject();
        String passwordMd5 = encryption(password);
        //System.out.println(passwordMd5);
        String urlString = "http://202.119.81.113:9080/njlgdx/xk/LoginToXk";
        String arg = "method=verify&USERNAME="+username+"&PASSWORD="+passwordMd5;
        //System.out.println(urlString);
        String cookie = "";
        PrintWriter out = null;
        String domain = null;
        String name = null;
        String ssuccess = null;
        try{
            //建立与教务处的连接
            URL url = new URL(urlString);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);
            urlConnection.setInstanceFollowRedirects(false);
            //获取连接的输出流
            out = new PrintWriter(urlConnection.getOutputStream());
            //写入参数
            if(arg!=null){
                out.write(arg);
                //System.out.println("写入数据成功");
            }

            out.flush();

            //获取返回的数据流
            cookie = urlConnection.getHeaderField("Set-Cookie");
            //System.out.println(cookie);
            String location = urlConnection.getHeaderField("Location");
            if(location!=null){
                domain = location.substring(7,21);
                cookie = cookie+";domain="+domain;
                String html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/framework/main.jsp",cookie,null);
                Pattern pattern = Pattern.compile("<div id=\"Top1_divLoginName\".*?>([\\s\\S]*?)</div>");
                Matcher matcher = pattern.matcher(html);
                if(matcher.find()){
                    String result = matcher.group(1);
                    name = result.substring(0,result.length()-14);
                }
                ssuccess = "1";
                jsonObject.put("cookie",cookie);
                jsonObject.put("name",name);
                jsonObject.put("username",username);
                jsonObject.put("password",password);
            }else{
                ssuccess = "0";
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(out != null){
                out.close();
            }
        }
        //获取登陆成功后的cookie



        jsonObject.put("success",ssuccess);


        return jsonObject;
    }

    /**考试查询service
     *
     * 根据controller传来的cookie，带着cookie访问教务处考试查询界面。
     * 用正则匹配需要的数据，取出数据返回给controller
     *
     * @param cookies
     * @return
     */
    public JSONObject getExam(String cookies){
        JSONObject jsonObject = new JSONObject();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        //System.out.println(domain);
        String html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/xsks/xsksap_query?Ves632DSdyV=NEW_XSD_KSBM",cookies,null);
        Pattern pattern = Pattern.compile("<option selected.*?>([\\s\\S]*?)</option>");
        Matcher matcher = pattern.matcher(html);
        String xq="";
        while (matcher.find()){
            xq = matcher.group(1);
        }


        String html1 = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/xsks/xsksap_list",cookies,"xnxqid="+xq);
        //检索数据
        Document document = Jsoup.parse(html1);
        //#dataList > tbody:nth-child(1) > tr:nth-child(1)
        Elements elements = document.select("#dataList").select("tbody:nth-child(1)").select("tr");
        //th.Nsb_r_list_thb:nth-child(4)
        List<Map<String,String>> examList = new ArrayList<>();
        for(int i = 1;i<elements.size();i++){
            Elements elements1 = elements.get(i).getElementsByTag("td");
            Map<String,String> elemMap = new HashMap<>();
            elemMap.put("name",elements1.get(3).text());
            elemMap.put("time",elements1.get(4).text());
            elemMap.put("address",elements1.get(5).text());
            elemMap.put("num",elements1.get(6).text());
            examList.add(elemMap);
        }
        jsonObject.put("exams", examList);
        jsonObject.put("success", "1");
        return jsonObject;
    }

    /**成绩查询service
     *
     * 根据controller传来的cookie，带着cookie访问教务处成绩查询界面。
     * 用正则匹配需要的数据，取出数据返回给controller
     *
     * @param cookies
     * @return
     */
    public JSONObject getGrade(String cookies){
        JSONObject jsonObject = new JSONObject();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        //System.out.println(domain);
        String html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/kscj/cjcx_list",cookies,"kksj=&kcxz=&kcmc=&xsfs=max");
        //检索数据
        //System.out.println(html);
        List<Map> list = new ArrayList<>();
        Pattern pattern = Pattern.compile("<table id=\"dataList\".*?>[\\s\\S]*?<\\/table>");
        Matcher matcher = pattern.matcher(html);
        String table = "";
        if(matcher.find()){
            table = matcher.group();
        }
        Pattern pattern1 = Pattern.compile("<tr.*?>[\\s\\S]*?<\\/tr>");
        Matcher matcher1 = pattern1.matcher(table);
        int count = 0;
        while(matcher1.find()){
            if(count==0){
                count=1;
                continue;
            }
            Map<String,String> resMap = new HashMap();
            Pattern pattern2 = Pattern.compile("<td.*?>[\\s\\S]*?<\\/td>");
            Matcher matcher2 = pattern2.matcher(matcher1.group());
            for (int num=1;matcher2.find();num++){
                if(num==2){
                    resMap.put("kkxq",matcher2.group().replace("<td>","").replace("</td>",""));
                }
                if(num==4){
                    resMap.put("kcmc",matcher2.group().replace("<td align=\"left\">","").replace("</td>",""));
                }
                if(num==5){
                    Pattern pattern3 = Pattern.compile("<td style=.*?>");
                    Matcher matcher3 = pattern3.matcher(matcher2.group());
                    if(matcher3.find()){
                        String grade = matcher3.group();
                        if(grade.equals("<td style=\" \">")){
                            resMap.put("grade",matcher2.group().replace("<td style=\" \">","").replace("</td>",""));
                        }else{
                            resMap.put("grade",matcher2.group().replace("<td style=\" color:red;\">","").replace("</td>",""));
                        }
                    }
                    resMap.put("GP",caculateGP(resMap.get("grade")));
                }
                if(num==7){
                    resMap.put("xf",matcher2.group().replace("<td>","").replace("</td>",""));
                }
                if(num==10){
                    resMap.put("kcsz",matcher2.group().replace("<td>","").replace("</td>",""));
                }
            }
            //将map存入list列表
            list.add(resMap);

        }

        List<Map> resultList = new ArrayList<>();

        List<List<Map>> middleList = new ArrayList<>();
        String flag = "";
        int index = 0;
        for(int i = list.size()-1;i>=0;i--){
            if(list.get(i).get("kkxq").equals(flag)){
                middleList.get(index-1).add(list.get(i));
            }else{
                flag = (String)list.get(i).get("kkxq");
                List<Map> tempList = new ArrayList<>();
                tempList.add(list.get(i));
                middleList.add(tempList);
                index++;
            }
        }

        for(int i = 0;i<middleList.size();i++){
            Map<String,Object> everyXq = new HashMap<>();
            everyXq.put("xq",middleList.get(i).get(0).get("kkxq"));
            everyXq.put("data",middleList.get(i));
            everyXq = summarize(middleList.get(i),everyXq);
            resultList.add(everyXq);
        }
        jsonObject.put("success", "1");
        jsonObject.put("list", resultList);

        Map<String, Object> tempMap = new HashMap();
        tempMap = summarize(list, tempMap);
        jsonObject.put("summarizing", tempMap);
        return jsonObject;
    }

    //计算绩点
    public String caculateGP(String cj){
        String jd="";

        if(cj.equals("优秀")){
            cj = "90";
        }
        if(cj.equals("免修")){
            cj = "89";
        }
        if(cj.equals("良好")){
            cj = "80";
        }
        if(cj.equals("中等")){
            cj = "70";
        }
        if(cj.equals("及格")){
            cj = "60";
        }
        if(cj.equals("通过")){
            cj = "60";
        }
        if(cj.equals("合格")){
            cj = "60";
        }
        if(cj.equals("不及格")){
            cj = "0";
        }
        if(cj.equals("不合格")){
            cj = "0";
        }
        if(cj.equals("不通过")){
            cj = "0";
        }
        if(cj.equals("请评教")){
            cj = "0";
        }
        Double cjNum = Double.parseDouble(cj);
        if(cjNum>=60){
            jd = "1.0";
        }else{
            jd = "0.0";
        }
        if(cjNum>=64){
            jd = "1.5";
        }
        if(cjNum>=68){
            jd = "2.0";
        }
        if(cjNum>=72){
            jd = "2.3";
        }
        if(cjNum>=75){
            jd = "2.7";
        }
        if(cjNum>=78){
            jd = "3.0";
        }
        if(cjNum>=82){
            jd = "3.3";
        }
        if(cjNum>=85){
            jd = "3.7";
        }
        if(cjNum>=90){
            jd = "4.0";
        }
        return jd;
    }


    /**课表查询
     *
     * 带着cookie访问教务处课表界面，
     * 通过jsoup解析网页获取课程信息
     * 每个课程存至一个map
     * 爬取课表信息，一共25周，每周7天，一天6节课
     * 结构存储
     *
     *
     */
    public JSONObject getCourse(String cookies){
        JSONObject jsonObject = new JSONObject();
        List<List<List<Map<String,String>>>> everyWeek = new ArrayList<>();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        //System.out.println(domain);
        for(int i = 0;i<25;i++){
            String html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL",cookies,"zc="+(i+1));
            Document document1 = Jsoup.parse(html);
            //#kbtable > tbody:nth-child(1) > tr:nth-child(2)
            Elements elements1 = document1.select("#kbtable").select("tbody:nth-child(1)").select("tr");
            List<List<Map<String,String>>> everyClass = new ArrayList<>();
            for(int w = 1;w<elements1.size()-1;w++) {
                List<Map<String,String>> courseM = new ArrayList<>();
                Elements elements2 = elements1.get(w).getElementsByAttributeValue("style","display: none;");
                for(int j = 0;j<elements2.size();j++){
                    Map<String,String> temp = new HashMap();
                    String value = elements2.get(j).text();
                    String[] courseZip = value.split(" ");

                    if(courseZip.length >1 && courseZip!=null){
                        temp.put("name",courseZip[0]);
                        String teacher = elements2.get(j).getElementsByAttributeValue("title","老师").text();
                        String week = elements2.get(j).getElementsByAttributeValue("title","周次(节次)").text();
                        String address = elements2.get(j).getElementsByAttributeValue("title","教室").text();
                        if(teacher!=null){
                            temp.put("teacher",teacher);
                        }else{
                            temp.put("teacher","未知");
                        }
                        if(week!=null){
                            temp.put("week",week);
                        } else{
                            temp.put("week","未知");
                        }
                        if(address!=null){
                            temp.put("address",address);
                        }else{
                            temp.put("address","未知");
                        }
                        courseM.add(temp);
                    }else{
                        courseM.add(null);
                    }
                }
                everyClass.add(courseM);
            }
            everyWeek.add(everyClass);
        }



        jsonObject.put("start_date",start_date);
        jsonObject.put("course", everyWeek);
        jsonObject.put("success", "1");
        return jsonObject;
    }

    /**空闲教室查询
     *
     * 带着cookie访问教务处教室借用界面，
     * 通过jsoup解析网页获取教室信息
     * 教室信息存入List
     *
     *
     */
    public JSONObject getClassroom(String cookies,String jxlbh,String zc,String xq,String jc){
        JSONObject jsonObject = new JSONObject();
        List<String> crList = new ArrayList<>();
        String html;
        String xnxqh="";
        String startJc = "";
        String endJc = "";
        if(jc.equals("1")){
            startJc = "01";
            endJc = "03";
        }else if(jc.equals("2")){
            startJc = "04";
            endJc = "05";
        }else if(jc.equals("3")){
            startJc = "06";
            endJc = "07";
        }else if(jc.equals("4")){
            startJc = "08";
            endJc = "10";
        }else if(jc.equals("5")){
            startJc = "11";
            endJc = "12";
        }


        int length = cookies.length();
        String domain = cookies.substring(length-14);
        //System.out.println(domain);
        html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/kbxx/jsjy_query",cookies,null);
        //检索数据
        //System.out.println(html);
        //#xnxqh > option:nth-child(7)
        Pattern pattern = Pattern.compile("<select id=\"xnxqh\".*?>.*?<option.*?selected.*?>([\\s\\S]*?)</option>");
        Matcher matcher = pattern.matcher(html);
        while (matcher.find()){
            xnxqh = matcher.group(1);
        }

        Document document2 = Jsoup.parse(html);
        Elements elements2 = document2.select("#xnxqh").select("option");
        for(Element element:elements2){
            if(element.getElementsByAttribute("selected").size()!=0){
                xnxqh = element.text();
            }
        }


        String arg = "typewhere=jszq&xnxqh="+xnxqh+"&xqbh=01&jxqbh=&jxlbh="+jxlbh+"&jsbh=&bjfh=%3D&rnrs=&jszt=5&zc="+zc+"&zc2="+zc+"&xq="+xq+"&xq2="+xq+"&jc="+startJc+"&jc2="+endJc;
        html = HtmlGetter.getHtml("http://"+domain+":9080/njlgdx/kbxx/jsjy_query2",cookies,arg);
        //#dataList > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)
        Document document = Jsoup.parse(html);
        Elements elements = document.select("#dataList").select("tbody:nth-child(1)").select("tr");
        for(int i = 2;i<elements.size()-2;i++){
            //#dataList > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)
            Elements elements1 = elements.get(i).select("td:nth-child(1)");
            String tempResult = elements1.text();
            String classroom;
            Pattern pattern1 = Pattern.compile("(.*?)\\(");
            Matcher matcher1 = pattern1.matcher(tempResult);
            while (matcher1.find()){
                classroom = matcher1.group(1);
                crList.add(classroom);
            }
        }
        jsonObject.put("classrooms",crList);
        return jsonObject;
    }


    //汇总数据，计算学分，均分，GPA等
    public Map<String,Object> summarize(List<Map> list,Map<String,Object> map){
        double sumAllXf=0; //全部总学分
        double sumBxXf = 0;  //必修总学分
        double countAll = 0;  //sum（学分×成绩） 全部
        double countBx = 0;  //sum（学分×成绩） 必修
        double avgAllGrade = 0;  //全部平均成绩
        double avgBxGrade = 0;  //必修平均成绩
        double countAllGP = 0;  //sum（绩点×成绩） 全部
        double countBxGP = 0;  //sum（绩点×成绩） 必修
        double avgAllGP = 0;  //全部GPA
        double avgBxGP = 0;  //必修GPA
        for(int j = 0;j<list.size();j++){
            String tempCj = (String)list.get(j).get("grade");
            if(tempCj.equals("良好")){
                tempCj = "80";
            }
            if(tempCj.equals("优秀")){
                tempCj = "90";
            }
            if(tempCj.equals("免修")){
                tempCj = "89";
            }
            if(tempCj.equals("中等")){
                tempCj = "70";
            }
            if(tempCj.equals("及格")){
                tempCj = "60";
            }
            if(tempCj.equals("通过")){
                tempCj = "60";
            }
            if(tempCj.equals("合格")){
                tempCj = "60";
            }
            if(tempCj.equals("不及格")){
                tempCj = "0";
            }
            if(tempCj.equals("不合格")){
                tempCj = "0";
            }
            if(tempCj.equals("不通过")){
                tempCj = "0";
            }
            if(tempCj.equals("请评教")){
                tempCj = "0";
            }
            sumAllXf = sumAllXf + Double.parseDouble(String.valueOf(list.get(j).get("xf")));
            countAll = countAll + Double.parseDouble(String.valueOf(list.get(j).get("xf")))*Double.parseDouble(tempCj);
            countAllGP = countAllGP + Double.parseDouble(String.valueOf(list.get(j).get("GP")))*Double.parseDouble(String.valueOf(list.get(j).get("xf")));
            if(String.valueOf(list.get(j).get("kcsz")).equals("必修")){
                sumBxXf = sumBxXf + Double.parseDouble(String.valueOf(list.get(j).get("xf")));
                countBx = countBx + Double.parseDouble(String.valueOf(list.get(j).get("xf")))*Double.parseDouble(tempCj);
                countBxGP = countBxGP + Double.parseDouble(String.valueOf(list.get(j).get("GP")))*Double.parseDouble(String.valueOf(list.get(j).get("xf")));
            }
        }
        avgAllGrade = countAll/sumAllXf;
        avgBxGrade = countBx/sumBxXf;
        avgAllGP = countAllGP/sumAllXf;
        avgBxGP = countBxGP/sumBxXf;
        map.put("sumAllXf",sumAllXf+"");
        map.put("sumBxXf",sumBxXf+"");
        map.put("avgAllGrade",String.format("%.2f",avgAllGrade));
        map.put("avgBxGrade",String.format("%.2f",avgBxGrade));
        map.put("avgAllGP",String.format("%.2f",avgAllGP));
        map.put("avgBxGP",String.format("%.2f",avgBxGP));
        return map;
    }


    //MD5加密 32位
    public String encryption(String plainText) {
        String re_md5 = new String();
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(plainText.getBytes());
            byte b[] = md.digest();

            int i;

            StringBuffer buf = new StringBuffer("");
            for (int offset = 0; offset < b.length; offset++) {
                i = b[offset];
                if (i < 0)
                    i += 256;
                if (i < 16)
                    buf.append("0");
                buf.append(Integer.toHexString(i));
            }

            re_md5 = buf.toString().toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return re_md5;
    }
}

