const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const { timeStamp } = require('console');

const app = express();
const port = 3000;

// 設定限制為 50MB (這對一萬筆甚至十萬筆都綽綽有餘)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 模擬訊息佇列連線
let channel;
async function connectRabbitMQ() {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    try {
        // 1. 建立連線
        const connection = await amqp.connect(rabbitUrl);
        
        // 2. 監聽錯誤（這對容器環境很重要，因為 MQ 可能會重啟）
        connection.on('error', (err) => console.error('MQ Connection Error', err));

        // 3. 建立 Channel
        channel = await connection.createChannel();
        
        // 4. 宣告佇列
        await channel.assertQueue('sms_tasks', { durable: true });
        
        console.log('✅ 已成功連線至 RabbitMQ');
    } catch (error) {
        console.error('❌ 無法連線至 RabbitMQ:', error.message);
        // 如果失敗，5 秒後重試（因為容器啟動順序可能會有秒差）
        setTimeout(connectRabbitMQ, 5000);
    }
}

// 提交簡訊發送請求的 API 端點
app.post('/sms/send', async (req, res) => {
    const { to, message, sender_id } = req.body;

    // 強制轉成陣列，不管使用者傳一筆還是多筆都能處理
    const phoneList = Array.isArray(to) ? to : [to];

    if (phoneList.length === 0 || !message) {
        return res.status(400).json({ status: 'error', message: '參數錯誤' });
    }
    // 1. 先快速回傳「收到請求」
    res.status(202).json({ status: 'accepted', total: phoneList.length })
    // 2. 在背景慢慢跑迴圈，不影響 API 回應速度
    setImmediate(() => {
        // 迴圈：把每個人都變成一個獨立任務丟進 MQ
        phoneList.forEach(phone => {
            const task = {
                id: Math.random().toString(36).substring(7),
                to: phone,
                message: message,
                sender_id: sender_id || 'System',
                timeStamp: new Date().toISOString()
            };

            // 丟進倉庫
            channel.sendToQueue('sms_tasks', Buffer.from(JSON.stringify(task)), { persistent: true });
        });
    })


    console.log(`[API] 已拆解並提交 ${phoneList.length} 則任務至佇列`);
});

// 查詢簡訊狀態的 API 端點 (模擬從資料庫查詢)
app.get('/sms/status/:message_id', (req, res) => {
    const messageId = req.params.message_id;
    // 實際應用中應從資料庫查詢狀態
    res.json({
        message_id: messageId,
        status: 'DELIVERED',
        delivery_time: new Date().toISOString()
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Node.js API 層已啟動，監聽連接埠 ${port}`);
    connectRabbitMQ();
});
