const ExcelJS = require('exceljs');
const { MongoClient } = require('mongodb');

// MongoDB 連線資訊 (與 Docker 內部一致)
const url = 'mongodb://admin:password@mongodb:27017';
const client = new MongoClient(url);

app.get('/sms/export', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('sms_db');
        const collection = db.collection('logs');

        // 1. 從 MongoDB 撈取所有簡訊紀錄
        const data = await collection.find({}).toArray();

        // 2. 建立 Excel 工作簿
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SMS Logs');

        // 3. 設定表頭
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: '收件人', key: 'to', width: 15 },
            { header: '內容', key: 'message', width: 40 },
            { header: '狀態', key: 'status', width: 15 },
            { header: '時間', key: 'timestamp', width: 25 }
        ];

        // 4. 填入資料
        data.forEach(item => {
            worksheet.addRow({
                id: item.id,
                to: item.to,
                message: item.message,
                status: item.status || 'SUCCESS', // 暫時預設
                timestamp: new Date().toLocaleString()
            });
        });

        // 5. 設定 Response Header 讓瀏覽器下載檔案
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'sms_report.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        res.status(500).send('匯出失敗: ' + err.message);
    }
});