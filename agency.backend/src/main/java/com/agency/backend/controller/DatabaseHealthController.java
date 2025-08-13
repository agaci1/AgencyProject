package com.agency.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class DatabaseHealthController {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseHealthController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> checkDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            String databaseProductName = connection.getMetaData().getDatabaseProductName();
            String databaseProductVersion = connection.getMetaData().getDatabaseProductVersion();
            String url = connection.getMetaData().getURL();
            
            response.put("status", "UP");
            response.put("database", databaseProductName);
            response.put("version", databaseProductVersion);
            response.put("url", url);
            response.put("message", "Database connection successful");
            
            logger.info("Database health check passed - {} {}", databaseProductName, databaseProductVersion);
            
            return ResponseEntity.ok(response);
            
        } catch (SQLException e) {
            logger.error("Database health check failed", e);
            
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            response.put("errorCode", e.getErrorCode());
            response.put("sqlState", e.getSQLState());
            response.put("message", "Database connection failed");
            
            return ResponseEntity.status(503).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("application", "agency-backend");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
} 