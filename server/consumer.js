const amqp = require('amqplib');

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'sms_tasks';

        await channel.assertQueue(queue, { durable: true });
        console.log(`[*] 正在等待訊息進入 ${queue}...`);

        // 每次只抓一則訊息處理
        channel.prefetch(1);

        channel.consume(queue, (msg) => {
            const task = JSON.parse(msg.content.toString());
            
            console.log('-----------------------------------');
            console.log(`[簡訊處理中心] 收到新任務！`);
            console.log(`發送至: ${task.to}`);
            console.log(`內容: ${task.message}`);
            console.log(`發送者 ID: ${task.sender_id}`);
            
            // 模擬發送 API 的延遲
            setTimeout(() => {
                console.log(`[OK] 簡訊 ID ${task.id} 已成功發送至電信商。`);
                channel.ack(msg); // 告訴 RabbitMQ 這則訊息處理完了，可以從佇列刪除
            }, 1000);
        });
    } catch (error) {
        console.error('Consumer 啟動失敗:', error);
    }
}

startConsumer();