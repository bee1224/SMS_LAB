import { History, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import BottomNavigation from '@/components/BottomNavigation';

export default function MessageHistory() {
  const records = [
    {
      id: 1,
      recipients: '5 個號碼',
      message: '您的驗證碼為：123456',
      status: 'success',
      date: '2026-04-13 10:30',
      points: 5,
    },
    {
      id: 2,
      recipients: '3 個號碼',
      message: '訂單確認通知',
      status: 'success',
      date: '2026-04-13 09:15',
      points: 3,
    },
    {
      id: 3,
      recipients: '2 個號碼',
      message: '密碼重置連結',
      status: 'pending',
      date: '2026-04-13 08:45',
      points: 2,
    },
    {
      id: 4,
      recipients: '1 個號碼',
      message: '服務異常通知',
      status: 'failed',
      date: '2026-04-12 22:30',
      points: 1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return '已發送';
      case 'pending':
        return '處理中';
      case 'failed':
        return '失敗';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部頭部 */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">發送紀錄</h1>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-4 space-y-3">
          {records.length > 0 ? (
            records.map((record) => (
              <Card key={record.id} className="p-4 bg-card border-border">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(record.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-foreground">
                        {record.recipients}
                      </p>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {getStatusText(record.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {record.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                      <p className="text-xs font-semibold text-orange-500">
                        -{record.points} 點
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <History className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">暫無發送紀錄</p>
            </div>
          )}
        </div>
      </main>

      {/* 底部導覽菜單 */}
      <BottomNavigation />
    </div>
  );
}
