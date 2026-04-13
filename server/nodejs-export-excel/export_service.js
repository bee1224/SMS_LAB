const express = require('express');
const { MongoClient } = require('mongodb');
const ExcelJS = require('exceljs');

const app = express();
const port = 3001;
const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password@mongodb:27017';

app.get('/download-excel', async (req, res) => {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const data = await client.db('sms_db').collection('logs').find({}).toArray();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('簡訊紀錄');
        
        sheet.columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: '號碼', key: 'to', width: 15 },
            { header: '狀態', key: 'status', width: 12 }
        ];

        data.forEach(d => sheet.addRow(d));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).send(err.message);
    } finally {
        await client.close();
    }
});

app.listen(port, () => console.log(`Excel Export Service running on port ${port}`));