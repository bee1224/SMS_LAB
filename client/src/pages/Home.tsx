import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, History, Send } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

/**
 * SMS Clone - 簡訊接收平台
 * 設計風格：移動優先 + Ionic 風格
 * 佈局：底部導覽菜單 + 頂部頭部 + 卡片內容
 * 圖示：Lucide React
 */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部頭部 */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">首頁</h1>
          <div className="text-right text-sm">
            <div>文字點數: 1413</div>
            <div>圖片點數: 0</div>
          </div>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* 大標題 */}
        <div className="px-4 pt-6 pb-4">
          <h2 className="text-3xl font-bold text-foreground mb-2">SMS200</h2>
          <p className="text-muted-foreground">Welcome to SMS200 云推短信</p>
        </div>

        {/* 內容卡片 */}
        <div className="px-4 space-y-4">
          {/* 重大訊息卡片 */}
          <Card className="overflow-hidden bg-card border-border">
            <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <MessageCircle className="w-16 h-16 text-blue-100 opacity-50" />
            </div>
            <div className="p-4">
              <h6 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                重大訊息
              </h6>
              <h5 className="text-lg font-bold text-foreground mb-2">
                📢 NCC 新制上路：企業簡訊必須附上【短信簽名】
              </h5>
              <p className="text-sm text-muted-foreground">
                全面落實實名制，防詐更安心，打造安全可信的企業簡訊環境
              </p>
            </div>
          </Card>

          {/* 快速操作卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-card border-border cursor-pointer hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">發送簡訊</p>
                  <p className="text-xs text-muted-foreground">快速發送</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-card border-border cursor-pointer hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <History className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">發送紀錄</p>
                  <p className="text-xs text-muted-foreground">查看歷史</p>
                </div>
              </div>
            </Card>
          </div>

          {/* 統計信息 */}
          <Card className="p-4 bg-card border-border">
            <h6 className="text-sm font-semibold text-foreground mb-4">今日統計</h6>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">已發送簡訊</span>
                <span className="text-lg font-bold text-primary">45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">成功率</span>
                <span className="text-lg font-bold text-green-500">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">剩餘點數</span>
                <span className="text-lg font-bold text-orange-500">1413</span>
              </div>
            </div>
          </Card>

          {/* 底部版權 */}
          <div className="text-center py-8 text-xs text-muted-foreground">
            <p>Copyright © SMS200 2026. All Rights Reserved.</p>
          </div>
        </div>
      </main>

      {/* 底部導覽菜單 */}
      <BottomNavigation />
    </div>
  );
}
