import {
  LogOut,
  User,
  BarChart3,
  CreditCard,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';

export default function Settings() {
  const userInfo = {
    username: 'EGBZ588',
    userType: '普通用戶',
    avatar: 'https://via.placeholder.com/64?text=User',
  };

  const menuItems = [
    {
      icon: BarChart3,
      title: '簽名申請',
      description: '申請企業簽名',
      href: '/signatureApplyPlatform',
    },
    {
      icon: BarChart3,
      title: '發送數據統計',
      description: '查看發送統計',
      href: '/message-statics',
    },
    {
      icon: CreditCard,
      title: '儲值紀錄',
      description: '查看儲值歷史',
      href: '/point-transactions',
    },
    {
      icon: BookOpen,
      title: 'API文檔',
      description: '開發者文檔',
      href: 'https://hackmd.io/yaqrkWzSTx2zsc_CZ0JJiQ',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部頭部 */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">設置</h1>
          <div className="text-right text-sm">
            <div>文字點數: 1413</div>
            <div>圖片點數: 0</div>
          </div>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* 用戶資料卡片 */}
        <Card className="m-4 p-4 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">
                {userInfo.username}
              </h3>
              <p className="text-sm text-muted-foreground">{userInfo.userType}</p>
            </div>
          </div>
        </Card>

        {/* 菜單項目 */}
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isExternal = item.external;

            const content = (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-3 bg-card border-border hover:bg-secondary transition-colors cursor-pointer">
                    {content}
                  </Card>
                </a>
              );
            }

            return (
              <a key={index} href={item.href} className="block">
                <Card className="p-3 bg-card border-border hover:bg-secondary transition-colors cursor-pointer">
                  {content}
                </Card>
              </a>
            );
          })}
        </div>

        {/* 登出按鈕 */}
        <div className="px-4 mt-6 mb-8">
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive border-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            登出
          </Button>
        </div>

        {/* 版本信息 */}
        <div className="px-4 pb-8 text-center text-xs text-muted-foreground">
          <p>SMS Clone v1.0.0</p>
          <p>© 2026 SMS200. All Rights Reserved.</p>
        </div>
      </main>

      {/* 底部導覽菜單 */}
      <BottomNavigation />
    </div>
  );
}
