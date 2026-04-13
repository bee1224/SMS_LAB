package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/streadway/amqp"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// --- 假資料庫邏輯 ---
var (
	memoryDB = make(map[string]string)
	mu       sync.RWMutex
)

func saveToMemory(id string, status string) {
	mu.Lock()
	defer mu.Unlock()
	memoryDB[id] = status
	fmt.Printf("[MemoryDB] ID: %s 狀態更新為: %s\n", id, status)
}

func main() {
	// 1. 初始化 MongoDB (嘗試連線，失敗不崩潰)
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://admin:password@mongodb:27017"))

	var collection *mongo.Collection
	if err == nil {
		collection = mongoClient.Database("sms_db").Collection("logs")
		fmt.Println("✅ MongoDB 已連線")
	} else {
		fmt.Println("⚠️ MongoDB 連線失敗，僅使用記憶體模式")
	}

	// 2. 連接 RabbitMQ
	rabbitAddr := os.Getenv("RABBITMQ_URL")
	if rabbitAddr == "" {
		rabbitAddr = "amqp://guest:guest@localhost:5672/" // 備用方案
	}
	conn, err := amqp.Dial("amqp://guest:guest@rabbitmq:5672/")
	if err != nil {
		log.Fatalf("無法連線到 RabbitMQ: %v", err) //如果連不上，這裡就停止並報錯
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("無法開啟 Channel: %v", err)
	}
	defer ch.Close()
	msgs, err := ch.Consume("sms_tasks", "", true, false, false, false, nil)
	if err != nil {
		log.Fatalf("❌ 無法訂閱 Queue: %v", err)
	}
	fmt.Println("[*] 系統已就緒，等待任務中...")

	for d := range msgs {
		var task map[string]interface{}
		json.Unmarshal(d.Body, &task)
		taskID := task["id"].(string)

		// 雙重寫入測試
		// (1) 寫入記憶體 Map
		saveToMemory(taskID, "PROCESSING")

		// (2) 嘗試寫入 MongoDB
		if collection != nil {
			_, _ = collection.InsertOne(context.Background(), task)
			fmt.Printf("[MongoDB] ID: %s 已存入資料庫\n", taskID)
		}

		// 模擬發送成功
		time.Sleep(100 * time.Millisecond)
		saveToMemory(taskID, "SUCCESS")
	}
}
