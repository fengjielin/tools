package com.gzzj;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/**
 * 启动程序
 * 
 * @author examSys
 */
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class ExamSysApplication
{
    public static void main(String[] args)
    {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(ExamSysApplication.class, args);
        System.out.println("启动成功 \n");
    }
}
