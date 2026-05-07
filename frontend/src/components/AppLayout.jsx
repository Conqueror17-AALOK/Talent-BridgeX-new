import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

/**
 * AppLayout
 * Wraps all authenticated pages (dashboard, analytics, etc.)
 * - Renders the collapsible Sidebar
 * - Provides a sticky top bar with a mobile hamburger button
 * - `topBar` prop: JSX rendered inside the page-specific header area
 */
const AppLayout = ({ children, topBar }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Sticky top bar */}
        <header className="h-16 md:h-20 border-b border-border bg-white px-4 md:px-8 flex items-center gap-4 z-30 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2 -ml-2 text-secondary hover:text-primary transition-colors shrink-0"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar navigation"
            id="sidebar-hamburger"
          >
            <Menu size={20} />
          </button>

          {/* Page-specific top bar content */}
          <div className="flex-1 flex items-center justify-between min-w-0">
            {topBar}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
