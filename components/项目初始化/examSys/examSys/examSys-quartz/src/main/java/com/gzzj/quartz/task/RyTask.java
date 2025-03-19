package com.gzzj.quartz.task;

import org.springframework.stereotype.Component;
import com.gzzj.common.utils.StringUtils;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 定时任务调度测试
 * 
 * @author examSys
 */
@Component("ryTask")
public class RyTask
{

    public void ryMultipleParams(String s, Boolean b, Long l, Double d, Integer i)
    {
        System.out.println(StringUtils.format("执行多参方法： 字符串类型{}，布尔类型{}，长整型{}，浮点型{}，整形{}", s, b, l, d, i));
    }

    public void ryParams(String params)
    {

    }

    public void ryNoParams()
    {
        System.out.println("执行无参方法");

    }


}
