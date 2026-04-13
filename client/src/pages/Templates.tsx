import { FileText, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useTemplateStore } from '@/store/templateStore';
import BottomNavigation from '@/components/BottomNavigation';

export default function Templates() {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleEdit = (id: number, title: string, content: string) => {
    setEditingId(id);
    setEditTitle(title);
    setEditContent(content);
  };

  const handleSave = () => {
    if (editingId !== null) {
      updateTemplate(editingId, editTitle, editContent);
      setEditingId(null);
    }
  };

  const handleAddTemplate = () => {
    if (newTitle.trim() && newContent.trim()) {
      addTemplate(newTitle, newContent);
      setNewTitle('');
      setNewContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 頂部頭部 */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold">文案範本</h1>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="w-4 h-4" />
            新增
          </Button>
        </div>
      </header>

      {/* 主內容區域 */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-4 space-y-4">
          {/* 新增表單 */}
          {isAdding && (
            <Card className="p-4 bg-card border-border border-2 border-primary">
              <h5 className="font-semibold text-foreground mb-3">新增文案</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    文案名稱
                  </label>
                  <Input
                    placeholder="例如：Google 驗證碼"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    文案內容
                  </label>
                  <textarea
                    placeholder="輸入文案內容，可使用 {code}、{orderNo} 等變數"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    className="w-full bg-input border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleAddTemplate}
                  >
                    <Check className="w-4 h-4" />
                    保存
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => {
                      setIsAdding(false);
                      setNewTitle('');
                      setNewContent('');
                    }}
                  >
                    <X className="w-4 h-4" />
                    取消
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* 文案列表 */}
          {templates.length > 0 ? (
            [...templates].reverse().map((template) => (
              <Card key={template.id} className="p-4 bg-card border-border">
                {editingId === template.id ? (
                  // 編輯模式
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">
                        文案名稱
                      </label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-input border-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1">
                        文案內容
                      </label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full bg-input border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2" onClick={handleSave}>
                        <Check className="w-4 h-4" />
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="w-4 h-4" />
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  // 顯示模式
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-semibold text-foreground">
                        {template.title}
                      </h5>
                      <div className="flex gap-2">
                        <button
                          className="text-primary hover:text-primary/80 transition-colors"
                          onClick={() => handleEdit(template.id, template.title, template.content)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          onClick={() => deleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 break-words">
                      {template.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {template.createdAt}
                    </p>
                  </>
                )}
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground text-center">
                暫無文案範本
                <br />
                <span className="text-xs">點擊上方「新增」按鈕開始撰寫文案</span>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* 底部導覽菜單 */}
      <BottomNavigation />
    </div>
  );
}
