import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Settings } from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border flex flex-col">
      <div className="p-6 border-b border-light-border dark:border-dark-border">
        <h1 className="text-2xl font-bold text-primary">Gamebridge</h1>
        <p className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
          Admin Panel
        </p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

