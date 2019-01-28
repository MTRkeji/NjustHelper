package com.mtr.njusthelper.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
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
        driver.get("http://202.119.81.112:8080/");

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
            WebElement ele = null;
            try{
                //检验是否登录成功
                ele = driver.findElement(By.xpath("//*[@id=\"Top1_divLoginName\"]"));
            }catch (Exception e){
                //不成功，则点击验证码图片，刷新验证码之后重新识别
                driver.findElement(By.xpath("//*[@id=\"SafeCodeImg\"]")).click();
            }
            if(ele != null){
                //登陆成功，则跳出循环
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
        String cookie = cookies.get(0).getName()+"="+cookies.get(0).getValue()+";"+cookies.get(1).getName()+"="+cookies.get(1).getValue();
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
    public List GradesQuary(javax.servlet.http.Cookie[] cookies){
        PrintWriter out = null;
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        try{
            //建立与教务处的连接
            URL url = new URL("http://202.119.81.112:9080/njlgdx/kscj/cjcx_list");
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("accept", "*/*");
            urlConnection.setRequestProperty("connection", "Keep-Alive");
            urlConnection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            urlConnection.setRequestProperty("cookie",cookies[0].getName()+"="+cookies[0].getValue()+";"+cookies[1].getName()+"="+cookies[1].getValue());
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);

            //获取连接的输出流
            out = new PrintWriter(urlConnection.getOutputStream());
            //写入参数
            out.write("kksj=&kcxz=&kcmc=&xsfs=max");

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

        //检索数据
        List list = new ArrayList<>();
        Pattern pattern = Pattern.compile("<table id=\"dataList\".*?>[\\s\\S]*?<\\/table>");
        Matcher matcher = pattern.matcher(sb);
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
            String kkxq="";
            String kcmc="";
            String cj="";
            String xf="";
            String kcsx="";
            Map resMap = new HashMap();
            Pattern pattern2 = Pattern.compile("<td.*?>[\\s\\S]*?<\\/td>");
            Matcher matcher2 = pattern2.matcher(matcher1.group());
            for (int num=1;matcher2.find();num++){
                if(num==2){
                    kkxq = matcher2.group().replace("<td>","").replace("</td>","");
                }
                if(num==4){
                    kcmc = matcher2.group().replace("<td align=\"left\">","").replace("</td>","");
                }
                if(num==5){
                    cj = matcher2.group().replace("<td style=\" \">","").replace("</td>","");
                }
                if(num==7){
                    xf = matcher2.group().replace("<td>","").replace("</td>","");
                }
                if(num==10){
                    kcsx = matcher2.group().replace("<td>","").replace("</td>","");
                }
            }

            //将数据存入map
            resMap.put("kkxq",kkxq);
            resMap.put("kcmc",kcmc);
            resMap.put("cj",cj);
            resMap.put("xf",xf);
            resMap.put("kcsx",kcsx);
            //将map存入list列表
            list.add(resMap);
        }
        return list;
    }
}
