import { Send, Phone, FileText, ArrowRight, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from "sonner";
import { useTemplateStore } from '@/store/templateStore';
import BottomNavigation from '@/components/BottomNavigation';
import { COUNTRIES, formatPhoneNumbers, validatePhoneNumber } from '@/config/countries';

export default function SendMessage() {
  const { templates } = useTemplateStore();
  const [recipients, setRecipients] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('tw'); // 預設台灣
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const message = selectedTemplate?.content || '';

  // 格式化後的號碼列表
  const formattedNumbers = formatPhoneNumbers(recipients, selectedCountry);
  const recipientCount = formattedNumbers.length;
  const messageLength = message.length;
  const smsCount = Math.ceil(messageLength / 160) || 1;
  const totalPoints = recipientCount * smsCount;

  const handleSend = async () => {
    // 檢查是否有選取文案與號碼
    if (!selectedTemplate || formattedNumbers.length === 0) {
      alert("請選擇文案並輸入有效的電話號碼");
      return;
    }

    const payload = {
      to: formattedNumbers,        // 這是你程式碼中已經 format 好的陣列
      message: selectedTemplate.content, // 這是你從 store 拿到的文案內容
      sender_id: "admin_user"      // 暫時寫死的發送者 ID
    };

    try {
      // 這裡的 /api 會被 Vite Proxy 轉發到你的 Docker (3000 port)
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success || result.status === 'accepted') {
        alert("✅ 成功！簡訊任務已送入隊列");
      } else {
        alert("❌ 失敗：" + (result.error || "伺服器錯誤"));
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("❌ 無法連接到後端 API，請確認 Docker 是否正在執行");
    }
  };
  // 驗證號碼
  const recipientLines = recipients
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const invalidNumbers = recipientLines.filter(
    (num) => num.length > 0 && !validatePhoneNumber(num, selectedCountry)
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部頭部 */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">發送簡訊</h1>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-4 space-y-4">
          {/* 國別選擇 */}
          <Card className="p-4 bg-card border-border border-2">
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              選擇國家/地區
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {COUNTRIES.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.prefix})
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              選擇的國家將自動轉換號碼格式為國際格式
            </p>
          </Card>

          {/* 收件人輸入 - 放大版本 */}
          <Card className="p-4 bg-card border-border border-2">
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              收件人號碼
            </label>
            <textarea
              placeholder={`輸入電話號碼（每行一個）\n例如：0987654321\n0912345678`}
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              rows={6}
              className="w-full bg-input border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base font-mono"
            />
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">收件人數量：</span>
                <span className="font-semibold text-primary text-lg">
                  {recipientCount}
                </span>
              </div>
              {invalidNumbers.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-destructive mb-1">
                    ⚠️ 發現 {invalidNumbers.length} 個無效號碼：
                  </p>
                  <p className="text-xs text-destructive/80 break-words">
                    {invalidNumbers.join(', ')}
                  </p>
                </div>
              )}
              {recipientCount > 0 && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p className="text-xs font-semibold text-primary mb-1">
                    ✓ 格式化後的號碼：
                  </p>
                  <div className="text-xs text-primary/80 break-words font-mono">
                    {formattedNumbers.slice(0, 3).join('\n')}
                    {formattedNumbers.length > 3 && `\n... 等 ${formattedNumbers.length - 3} 個`}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* 文案選擇 */}
          <div>
            <h6 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              選擇文案範本
            </h6>
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`p-3 rounded-lg text-left transition-all ${selectedTemplateId === template.id
                      ? 'bg-primary text-primary-foreground border-2 border-primary'
                      : 'bg-secondary text-foreground border-2 border-transparent hover:bg-secondary/80'
                      }`}
                  >
                    <p className="font-semibold text-sm">{template.title}</p>
                    <p className="text-xs opacity-75 line-clamp-1">
                      {template.content}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      暫無已保存的文案範本
                    </p>
                    <p className="text-xs text-muted-foreground">
                      請先在「文案」頁面新增文案
                    </p>
                  </div>
                  <a href="/templates" className="flex-shrink-0 ml-4">
                    <Button size="sm" className="gap-2">
                      前往文案
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            )}
          </div>

          {/* 訊息內容預覽 */}
          {selectedTemplate && (
            <Card className="p-4 bg-card border-border">
              <label className="block text-sm font-semibold text-foreground mb-3">
                訊息內容預覽
              </label>
              <div className="bg-input border border-border rounded-lg p-3 text-foreground break-words">
                {message}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                字數：{messageLength} / 160 (需要 {smsCount} 條簡訊)
              </p>
            </Card>
          )}

          {/* 發送統計 */}
          <Card className="p-4 bg-card border-border">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">收件人數量</span>
                <span className="font-semibold text-foreground text-lg">
                  {recipientCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">每人簡訊數</span>
                <span className="font-semibold text-foreground text-lg">
                  {smsCount}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">
                  預計消耗點數
                </span>
                <span className="font-bold text-orange-500 text-2xl">
                  {totalPoints}
                </span>
              </div>
            </div>
          </Card>

          {/* 發送按鈕 */}
          <Button
            className="w-full gap-2 py-6 text-base"
            disabled={!recipients.trim() || !selectedTemplate || invalidNumbers.length > 0}
            onClick={handleSend} // 綁定點擊事件
          >
            <Send className="w-5 h-5" />
            立即發送
          </Button>
        </div>
      </main>

      {/* 底部導覽菜單 */}
      <BottomNavigation />
    </div>
  );
}
