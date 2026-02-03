import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  user: User;
  activeView: string;
  onViewChange: (view: any) => void;
  onToggleRole: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onViewChange, onToggleRole, isCollapsed, onToggleCollapse }) => {

  const menuItems = [
    { id: 'HOME', icon: 'fa-house', label: 'Dashboard' },
    { id: 'DRAFT', icon: 'fa-pen-to-square', label: 'Draft Analysis' },
    { id: 'VERIFY', icon: 'fa-certificate', label: 'Verification' },
    { id: 'LEDGER', icon: 'fa-link', label: 'Audit Ledger' },
  ];

  if (user.role === 'STUDENT') {
    menuItems.push({ id: 'CONTROL_PANEL', icon: 'fa-user-shield', label: 'Control Panel' });
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 288 }}
      className="sidebar-container relative min-h-screen flex flex-col backdrop-blur-xl border-r z-40 transition-all duration-300"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderColor: 'var(--glass-border)'
      }}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-24 w-6 h-6 bg-accent-gradient rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg z-50 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className={`flex items-center gap-4 mb-12 group cursor-pointer ${isCollapsed ? 'justify-center' : ''}`} onClick={() => onViewChange('HOME')}>
          <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent-primary/20 group-hover:scale-110 transition-transform shrink-0"
            style={{ background: 'var(--accent-gradient)' }}>
            <i className="fa-solid fa-shield-halved text-xl"></i>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-black text-xl tracking-tighter" style={{ color: 'var(--text-primary)' }}>GUARDIAN</span>
              <span className="text-[10px] font-black tracking-[0.3em] -mt-1" style={{ color: 'var(--accent-primary)' }}>INTEGRITY</span>
            </motion.div>
          )}
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all relative group ${isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-2xl shadow-lg shadow-accent-primary/20"
                    style={{ background: 'var(--accent-gradient)' }}
                  />
                )}
                <i className={`fa-solid ${item.icon} w-5 z-10 shrink-0 ${isActive ? 'text-white' : 'text-accent-primary'}`}></i>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="z-10 tracking-tight whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto p-6 space-y-6 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
        <div className={`glass rounded-2xl p-4 relative overflow-hidden group ${isCollapsed ? 'w-12 h-12 flex items-center justify-center p-0' : 'p-5'}`}
          style={{ borderColor: 'var(--glass-border)' }}>
          <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          {!isCollapsed ? (
            <>
              <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-3">Context Engine</p>
              <button
                onClick={onToggleRole}
                className="w-full text-[11px] font-bold py-3 rounded-xl border hover:border-accent-primary/50 transition-all text-text-primary flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
              >
                <i className="fa-solid fa-shuffle text-accent-primary" />
                Switch to {user.role === 'STUDENT' ? 'Faculty' : 'Student'}
              </button>
            </>
          ) : (
            <button
              onClick={onToggleRole}
              className="text-accent-primary z-10"
              title={`Switch to ${user.role === 'STUDENT' ? 'Faculty' : 'Student'}`}
            >
              <i className="fa-solid fa-shuffle" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
          {!isCollapsed && (
            <span className="text-[10px] text-text-tertiary font-mono whitespace-nowrap">On-Prem Node Active</span>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;