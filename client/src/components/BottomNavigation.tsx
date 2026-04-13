import { useLocation } from 'wouter';
import {
  Home as HomeIcon,
  FileText,
  Send,
  History,
  Settings,
} from 'lucide-react';

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { href: '/', label: '首頁', icon: HomeIcon },
    { href: '/templates', label: '文案', icon: FileText },
    { href: '/send', label: '發送', icon: Send, isCenter: true },
    { href: '/history', label: '發送紀錄', icon: History },
    { href: '/settings', label: '設置', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around max-w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.isCenter) {
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex-1 py-3 flex flex-col items-center gap-1 -translate-y-2"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </a>
            );
          }

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-semibold">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
