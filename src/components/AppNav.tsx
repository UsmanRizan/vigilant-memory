import { LogOut } from 'lucide-react';
import type { View } from '@/src/types/order';

interface AppNavProps {
  view: View;
  isAdmin: boolean;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

export function AppNav({ view, isAdmin, onNavigate, onLogout }: AppNavProps) {
  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black">
      <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tighter font-mono hover:opacity-70 transition-opacity"
        >
          PURE WHITE
        </button>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[10px] font-bold font-mono hover:underline underline-offset-4"
          >
            COLLECTION
          </button>
          <button
            type="button"
            onClick={() => onNavigate('order-form')}
            className="text-[10px] font-bold font-mono hover:underline underline-offset-4"
          >
            ORDER
          </button>
          {isAdmin && (
            <>
              <div className="w-px h-4 bg-black/20" />
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className={`text-[10px] font-bold font-mono px-2 py-1 transition-colors ${
                    view === 'admin' ? 'active-invert' : 'hover-invert'
                  }`}
                >
                  ADMIN
                </button>
                <button type="button" onClick={onLogout} className="p-1 hover:opacity-50 transition-opacity" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
