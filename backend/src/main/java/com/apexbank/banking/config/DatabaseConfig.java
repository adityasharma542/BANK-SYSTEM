package com.apexbank.banking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    public static boolean IS_USING_MYSQL = false;
    public static String DB_STATUS_MESSAGE = "Persistent File Database";

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/banking_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUser;

    @Value("${spring.datasource.password:root}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        System.out.println("🔍 Testing connection to MySQL Database (" + mysqlUrl + ") with user '" + mysqlUser + "'...");

        try {
            // Attempt short connection test to local MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword);
            conn.close();
            
            IS_USING_MYSQL = true;
            DB_STATUS_MESSAGE = "MySQL Relational DB (Port 3306)";
            System.out.println("✅ [MySQL Database] Connected successfully to MySQL!");

            DriverManagerDataSource mysqlDataSource = new DriverManagerDataSource();
            mysqlDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            mysqlDataSource.setUrl(mysqlUrl);
            mysqlDataSource.setUsername(mysqlUser);
            mysqlDataSource.setPassword(mysqlPassword);
            return mysqlDataSource;

        } catch (Exception e) {
            IS_USING_MYSQL = false;
            DB_STATUS_MESSAGE = "Persistent File Database (Saved on Disk)";
            System.out.println("⚠️ [MySQL Notice]: MySQL not connected (" + e.getMessage() + ")");
            System.out.println("💡 [Active Data Store]: Using Persistent Relational File Database (banking_db.mv.db). All employee data will be permanently saved to disk!");

            // Ensure data directory exists
            File dataDir = new File("./data");
            if (!dataDir.exists()) {
                dataDir.mkdirs();
            }

            DriverManagerDataSource h2FileDataSource = new DriverManagerDataSource();
            h2FileDataSource.setDriverClassName("org.h2.Driver");
            h2FileDataSource.setUrl("jdbc:h2:file:./data/banking_db;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE;MODE=MySQL");
            h2FileDataSource.setUsername("sa");
            h2FileDataSource.setPassword("");
            return h2FileDataSource;
        }
    }
}
