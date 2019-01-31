package com.mtr.njusthelper.service;


import com.alibaba.fastjson.JSONObject;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.commons.collections.map.HashedMap;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


//教务处service
@Service
public class JwcService {

    //截图函数
    public byte[] takeScreenshot(WebDriver driver) throws IOException {
        byte[] screenshot = null;
        screenshot = ((TakesScreenshot)driver).getScreenshotAs(OutputType.BYTES);
        return screenshot;
    }


    //获取验证码图片
    public BufferedImage createElementImage(WebDriver driver,
                                            WebElement webElement, int width, int heigth)throws IOException{
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(
                takeScreenshot(driver)));
        Point point = webElement.getLocation();
        BufferedImage croppedImage = originalImage.getSubimage(point.getX(),point.getY(),width,heigth);
        return croppedImage;
    }

    //获取Chromedriver引擎
    public WebDriver getDriver(){
        System.setProperty("webdriver.chrome.driver","chromedriver.exe");
        //设置为无头浏览器（静默模式）
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("headless");
        WebDriver driver = new ChromeDriver(chromeOptions);
        return driver;
    }


    //测试cookie是否有效
    public String testLogin(String cookies){
        JSONObject jsonObject = new JSONObject();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        System.out.println(domain);
        String html = getHtml("http://"+domain+":9080/njlgdx/framework/main.jsp",cookies,null);

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
    public String getVerification(String username, String password){

        //获取driver
        WebDriver driver = getDriver();
        Dimension dimension = new Dimension(1034,617);
        driver.manage().window().setSize(dimension);

        String result = null;

        //访问登录界面
        driver.get("http://202.119.81.113:8080/");

        //配置tesseract插件
        ITesseract instance = new Tesseract();
        URL url1 = ClassLoader.getSystemResource("tessdata");
        String tesspath = url1.getPath().substring(1);
        instance.setDatapath(tesspath);
        while(true){

            //验证码图片保存的文件
            File imageFile = new File("src\\main\\resources\\static\\yzm"+username+".png");
            try{
                imageFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }

            //获取验证码图片元素
            WebElement element = driver.findElement(By.xpath("//*[@id=\"SafeCodeImg\"]"));


            try{
                //获取图片流
                BufferedImage image = createElementImage(driver,element,64,28);
                //写入文件
                ImageIO.write(image,"png",imageFile);
            } catch (IOException e) {
                e.printStackTrace();
            }
            try{
                //利用OCR自动识别，获取返回的结果result
                ImageIO.scanForPlugins();
                result = instance.doOCR(imageFile);
            } catch (TesseractException e) {
                e.printStackTrace();
            }
            //字符串处理
            result = result.replaceAll("[^a-z^A-Z^0-9]", "");

            //driver操控输入用户名，密码，验证码
            driver.findElement(By.xpath("//*[@id=\"userAccount\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"userAccount\"]")).sendKeys(username);
            driver.findElement(By.xpath("//*[@id=\"userPassword\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"userPassword\"]")).sendKeys(password);
            driver.findElement(By.xpath("//*[@id=\"RANDOMCODE\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"RANDOMCODE\"]")).sendKeys(result);
            driver.findElement(By.xpath("//*[@id=\"btnSubmit\"]")).click();

            try{
                //检验是否登录成功
                String errorText = driver.findElement(By.xpath("/html/body/form/div/div/div[2]/div[1]/font")).getText();
                driver.findElement(By.xpath("//*[@id=\"SafeCodeImg\"]")).click();
                System.out.println("错误信息："+errorText);
                if(errorText.equals("该帐号不存在或密码错误,请联系管理员!")){
                    return "errorInput";
                }
            }catch (Exception e){
                //成功
                break;
            }
        }

        //获取登陆成功后的cookie
        Set<Cookie> set = driver.manage().getCookies();

        //处理cookie，存入cookies列表
        List<Cookie> cookies = new ArrayList<>();
        for (Cookie cookie:set) {
            cookies.add(cookie);
        }
        //处理cookie之后，存入字符串，并返回
        String cookie = "";
        for(int i = 0;i<cookies.size();i++){
            if(i < (cookies.size()-1)){
                cookie = cookie+cookies.get(i)+";";
            }else{
                cookie = cookie+cookies.get(i);
            }
        }
        //String cookie = cookies.get(0).getName()+"="+cookies.get(0).getValue()+";"+cookies.get(1).getName()+"="+cookies.get(1).getValue();
        return cookie;
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
        System.out.println(domain);
        String html = getHtml("http://"+domain+":9080/njlgdx/kscj/cjcx_list",cookies,"kksj=&kcxz=&kcmc=&xsfs=max");
        //检索数据
        System.out.println(html);
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
            Map<String,Object> everyXq = new HashedMap();
            everyXq.put("xq",middleList.get(i).get(0).get("kkxq"));
            everyXq.put("data",middleList.get(i));
            everyXq = summarize(middleList.get(i),everyXq);
            resultList.add(everyXq);
        }
        if(resultList.isEmpty()){
            jsonObject.put("success","0");
        }else {
            jsonObject.put("success", "1");
            jsonObject.put("list", resultList);

            Map<String, Object> tempMap = new HashedMap();
            tempMap = summarize(list, tempMap);
            jsonObject.put("summarizing", tempMap);
        }
        return jsonObject;
    }

    //计算绩点
    public String caculateGP(String cj){
        String jd="";
        if(cj.equals("良好")){
            cj = "80";
        }
        if(cj.equals("优秀")){
            cj = "90";
        }
        if(cj.equals("中等")){
            cj = "70";
        }
        if(cj.equals("及格")){
            cj = "60";
        }
        if(cj.equals("不及格")){
            cj = "0";
        }
        if(cj.compareTo("60")>=0){
            jd = "1.0";
        }else{
            jd = "0.0";
        }
        if(cj.compareTo("64")>=0){
            jd = "1.5";
        }
        if(cj.compareTo("68")>=0){
            jd = "2.0";
        }
        if(cj.compareTo("72")>=0){
            jd = "2.3";
        }
        if(cj.compareTo("75")>=0){
            jd = "2.7";
        }
        if(cj.compareTo("78")>=0){
            jd = "3.0";
        }
        if(cj.compareTo("82")>=0){
            jd = "3.3";
        }
        if(cj.compareTo("85")>=0){
            jd = "3.7";
        }
        if(cj.compareTo("90")>=0){
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
        List<Map<String,Map<String,Map<String,String>>>> everyWeek = new ArrayList<>();
        int length = cookies.length();
        String domain = cookies.substring(length-14);
        System.out.println(domain);
        for(int i = 0;i<25;i++){
            String html = getHtml("http://"+domain+":9080/njlgdx/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL",cookies,"zc="+(i+1));
            Document document1 = Jsoup.parse(html);
            //#kbtable > tbody:nth-child(1) > tr:nth-child(2)
            Elements elements1 = document1.select("#kbtable").select("tbody:nth-child(1)").select("tr");
            Map<String,Map<String,Map<String,String>>> everyClass = new HashedMap();
            for(int w = 1;w<elements1.size()-1;w++) {
                Map<String,Map<String,String>> courseM = new HashedMap();
                Elements elements2 = elements1.get(w).getElementsByAttributeValue("style","display: none;");
                for(int j = 0;j<elements2.size();j++){
                    Map<String,String> temp = new HashedMap();
                    String value = elements2.get(j).text();
                    String[] courseZip = value.split(" ");

                    if(courseZip.length >1 && courseZip!=null){
                        temp.put("name",courseZip[0]);
                        temp.put("teacher",courseZip[1]);
                        temp.put("week",courseZip[2]);
                        if(courseZip.length>3){
                            temp.put("address",courseZip[3]);
                        }else{
                            temp.put("address","未知");
                        }
                        courseM.put("weekday"+(j+1),temp);
                    }else{
                        courseM.put("weekday"+(j+1),null);
                    }
                }
                everyClass.put("lesson"+w,courseM);
            }
            everyWeek.add(everyClass);
        }
        if(everyWeek.get(1).isEmpty()){
            jsonObject.put("success","0");
        }else {
            jsonObject.put("course", everyWeek);
            jsonObject.put("success", "1");
        }
        return jsonObject;
    }


    //获取网页源码
    public String getHtml(String postUrl, String cookies, String arg){


        PrintWriter out = null;
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        try{
            //建立与教务处的连接
            URL url = new URL(postUrl);
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded");
            urlConnection.setUseCaches(false);
            urlConnection.setRequestProperty("Connection", "Keep-Alive");
            urlConnection.setRequestProperty("Cookie",cookies);
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);

            //获取连接的输出流
            out = new PrintWriter(urlConnection.getOutputStream());
            //写入参数
            if(arg!=null){
                out.write(arg);
                System.out.println("写入数据成功");
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
            if(tempCj.equals("中等")){
                tempCj = "70";
            }
            if(tempCj.equals("及格")){
                tempCj = "60";
            }
            if(tempCj.equals("不及格")){
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
}

