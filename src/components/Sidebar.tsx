import { 
  LayoutDashboard, 
  FolderKanban, 
  Calendar, 
  Layers, 
  Archive, 
  CreditCard, 
  Box, 
  ShoppingCart, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  LogOut,
  User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MenuItem = 
  | "Dashboard" 
  | "Projects" 
  | "Calendar" 
  | "Material Usage" 
  | "Archives" 
  | "Unpaid Projects" 
  | "Inventory" 
  | "POS" 
  | "Settings" 
  | "Admin Panel" 
  | "Reports";

interface SidebarProps {
  activeItem: MenuItem;
  onItemClick: (item: MenuItem) => void;
}

const MENU_ITEMS: { icon: any; label: MenuItem; badge?: number }[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: FolderKanban, label: "Projects" },
  { icon: Calendar, label: "Calendar" },
  { icon: Layers, label: "Material Usage" },
  { icon: Archive, label: "Archives" },
  { icon: CreditCard, label: "Unpaid Projects", badge: 14 },
  { icon: Box, label: "Inventory" },
  { icon: ShoppingCart, label: "POS" },
  { icon: Settings, label: "Settings" },
  { icon: ShieldCheck, label: "Admin Panel" },
  { icon: BarChart3, label: "Reports" },
];

export default function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 overflow-hidden border-2 border-slate-700">
            <div className="flex flex-col items-center justify-center text-slate-900">
              <span className="text-2xl font-black leading-none">LJ</span>
              <span className="text-[8px] font-bold tracking-widest uppercase">Prints</span>
            </div>
          </div>
          <h1 className="font-black text-lg tracking-tight uppercase">LJ PRINTS</h1>
          <p className="text-[10px] text-slate-400 font-medium">boyd@gmail.com</p>
          <span className="mt-2 inline-block px-3 py-0.5 bg-slate-800 text-slate-400 text-[9px] font-bold rounded-full uppercase tracking-widest border border-slate-700">
            SUBADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => onItemClick(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
              activeItem === item.label 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className={cn(
                "transition-colors",
                activeItem === item.label ? "text-white" : "text-slate-500 group-hover:text-white"
              )} />
              {item.label}
            </div>
            {item.badge && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                activeItem === item.label ? "bg-white/20 text-white" : "bg-red-500/20 text-red-400"
              )}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl text-sm font-bold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all border border-slate-700/50">
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
