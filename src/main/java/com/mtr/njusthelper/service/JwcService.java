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

@Service
public class JwcService {
    public byte[] takeScreenshot(WebDriver driver) throws IOException {
        byte[] screenshot = null;
        screenshot = ((TakesScreenshot)driver).getScreenshotAs(OutputType.BYTES);
        return screenshot;
    }


    public BufferedImage createElementImage(WebDriver driver,
                                            WebElement webElement, int width, int heigth)throws IOException{
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(
                takeScreenshot(driver)));
        Point point = webElement.getLocation();
        BufferedImage croppedImage = originalImage.getSubimage(point.getX(),point.getY(),width,heigth);
        return croppedImage;
    }

    public WebDriver getDriver(){
        System.setProperty("webdriver.chrome.driver","chromedriver.exe");
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("headless");
        WebDriver driver = new ChromeDriver(chromeOptions);
        return driver;
    }


    public String getVerification(String username, String password){

        WebDriver driver = getDriver();
        Dimension dimension = new Dimension(1034,617);
        driver.manage().window().setSize(dimension);
        String result = null;
        driver.get("http://202.119.81.112:8080/");
        ITesseract instance = new Tesseract();
        URL url1 = ClassLoader.getSystemResource("tessdata");
        String tesspath = url1.getPath().substring(1);
        instance.setDatapath(tesspath);
        while(true){
            File imageFile = new File("F:\\BlockheadmanSu\\research_study\\njusthelper\\src\\main\\resources\\static\\yzm"+username+".png");
            try{
                imageFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
            WebElement element = driver.findElement(By.xpath("//*[@id=\"SafeCodeImg\"]"));
            try{
                BufferedImage image = createElementImage(driver,element,64,28);
                ImageIO.write(image,"png",imageFile);
            } catch (IOException e) {
                e.printStackTrace();
            }
            try{
                ImageIO.scanForPlugins();
                result = instance.doOCR(imageFile);
            } catch (TesseractException e) {
                e.printStackTrace();
            }
            result = result.replaceAll("[^a-z^A-Z^0-9]", "");
            driver.findElement(By.xpath("//*[@id=\"userAccount\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"userAccount\"]")).sendKeys(username);
            driver.findElement(By.xpath("//*[@id=\"userPassword\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"userPassword\"]")).sendKeys(password);
            driver.findElement(By.xpath("//*[@id=\"RANDOMCODE\"]")).clear();
            driver.findElement(By.xpath("//*[@id=\"RANDOMCODE\"]")).sendKeys(result);
            driver.findElement(By.xpath("//*[@id=\"btnSubmit\"]")).click();
            WebElement ele = null;
            try{
                ele = driver.findElement(By.xpath("//*[@id=\"Top1_divLoginName\"]"));
            }catch (Exception e){
                driver.findElement(By.xpath("//*[@id=\"SafeCodeImg\"]")).click();
            }
            if(ele != null){
                break;
            }
        }
        Set<Cookie> set = driver.manage().getCookies();
        List<Cookie> cookies = new ArrayList<>();
        for (Cookie cookie:set) {
            cookies.add(cookie);
        }
        String cookie = cookies.get(0).getName()+"="+cookies.get(0).getValue()+";"+cookies.get(1).getName()+"="+cookies.get(1).getValue();
        return cookie;
    }


    public List GradesQuary(javax.servlet.http.Cookie[] cookies){
        PrintWriter out = null;
        BufferedReader in = null;
        StringBuffer sb = new StringBuffer();
        try{
            URL url = new URL("http://202.119.81.112:9080/njlgdx/kscj/cjcx_list");
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("accept", "*/*");
            urlConnection.setRequestProperty("connection", "Keep-Alive");
            urlConnection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
            urlConnection.setRequestProperty("cookie",cookies[0].getName()+"="+cookies[0].getValue()+";"+cookies[1].getName()+"="+cookies[1].getValue());
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);
            out = new PrintWriter(urlConnection.getOutputStream());
            out.write("kksj=&kcxz=&kcmc=&xsfs=max");
            out.flush();
            in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
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
            resMap.put("kkxq",kkxq);
            resMap.put("kcmc",kcmc);
            resMap.put("cj",cj);
            resMap.put("xf",xf);
            resMap.put("kcsx",kcsx);
            list.add(resMap);
        }
        return list;
    }
}
