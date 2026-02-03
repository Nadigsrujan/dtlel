
import React, { useState, useEffect } from 'react';
import { User, UserRole, Submission, LedgerEntry, AccessLog } from './types';
import Sidebar from './components/Sidebar';
import StudentDashboard from './views/StudentDashboard';
import FacultyDashboard from './views/FacultyDashboard';
import DraftEditor from './views/DraftEditor';
import VerificationPortal from './views/VerificationPortal';
import ControlPanel from './views/ControlPanel';
import Login from './views/Login';
import LandingPage from './views/LandingPage';
import { supabase } from './lib/supabase';
import { useCallback } from 'react';

const DEFAULT_USER: User = {
  id: 'u-temp',
  name: 'Guest User',
  email: '',
  role: 'STUDENT',
  institution: 'Global Tech University'
};

const INITIAL_LOGS: AccessLog[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000).toISOString(), entity: 'AI Analysis Service', purpose: 'Semantic Similarity Check', resourceId: 'Draft: Intro to AI' },
  { id: 'log-2', timestamp: new Date(Date.now() - 7200000).toISOString(), entity: 'System Auditor', purpose: 'Ledger Synchronization', resourceId: 'Hash: a7f2...8e11' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(DEFAULT_USER);
  const [activeView, setActiveView] = useState<'HOME' | 'DRAFT' | 'VERIFY' | 'LEDGER' | 'CONTROL_PANEL'>('HOME');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const handleLogin = useCallback((userData: User) => {
    setUser(prev => {
      // Avoid redundant state updates
      if (prev.id === userData.id && prev.role === userData.role) return prev;
      return userData;
    });
    setIsAuthenticated(true);
    setShowLanding(false);
    localStorage.setItem('userSession', JSON.stringify(userData));

    // Load data based on role upon login
    if (userData.role === 'FACULTY' || userData.role === 'ADMIN') {
      const instSubmissions = localStorage.getItem(`inst_submissions_${userData.institution}`);
      const instLedger = localStorage.getItem(`inst_ledger_${userData.institution}`);
      if (instSubmissions) setSubmissions(JSON.parse(instSubmissions));
      else setSubmissions([]);
      if (instLedger) setLedger(JSON.parse(instLedger));
      else setLedger([]);
    } else {
      const userSubmissions = localStorage.getItem(`submissions_${userData.email}`);
      const userLedger = localStorage.getItem(`ledger_${userData.email}`);
      if (userSubmissions) setSubmissions(JSON.parse(userSubmissions));
      else setSubmissions([]);
      if (userLedger) setLedger(JSON.parse(userLedger));
      else setLedger([]);
    }
  }, []);

  const handleLogout = useCallback(async (shouldSignOutFromSupabase = true) => {
    if (shouldSignOutFromSupabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setUser(DEFAULT_USER);
    setSubmissions([]);
    setLedger([]);
    localStorage.removeItem('userSession');
    setActiveView('HOME');
    setShowLanding(true);
  }, []);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return;
    }

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata.role as UserRole) || 'STUDENT',
          institution: session.user.user_metadata.institution || 'Global Tech University'
        };
        handleLogin(userData);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata.role as UserRole) || 'STUDENT',
          institution: session.user.user_metadata.institution || 'Global Tech University'
        };
        handleLogin(userData);
      } else if (event === 'SIGNED_OUT') {
        handleLogout(false); // Don't call signOut again to avoid loop
      }
    });

    return () => subscription.unsubscribe();
  }, [handleLogin, handleLogout]);

  const saveToLedger = (entry: LedgerEntry) => {
    const newLedger = [entry, ...ledger];
    setLedger(newLedger);

    // Save to institutional ledger if user belongs to one
    if (user.institution) {
      const savedInstLedger = localStorage.getItem(`inst_ledger_${user.institution}`);
      const instLedger = savedInstLedger ? JSON.parse(savedInstLedger) : [];
      const updatedInstLedger = [entry, ...instLedger];
      localStorage.setItem(`inst_ledger_${user.institution}`, JSON.stringify(updatedInstLedger));
    }

    // Save to personal ledger
    if (user.email) {
      localStorage.setItem(`ledger_${user.email}`, JSON.stringify(newLedger));
    }
  };

  const addSubmission = (sub: Submission) => {
    const newSubmissions = [sub, ...submissions];
    setSubmissions(newSubmissions);

    // Save to institutional submissions
    if (user.institution) {
      const savedInstSubs = localStorage.getItem(`inst_submissions_${user.institution}`);
      const instSubs = savedInstSubs ? JSON.parse(savedInstSubs) : [];
      const updatedInstSubs = [sub, ...instSubs];
      localStorage.setItem(`inst_submissions_${user.institution}`, JSON.stringify(updatedInstSubs));
    }

    // Save to personal submissions
    if (user.email) {
      localStorage.setItem(`submissions_${user.email}`, JSON.stringify(newSubmissions));
    }

    const newLog: AccessLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entity: 'AI Analysis Service',
      purpose: 'Initial Integrity Check',
      resourceId: sub.title
    };
    setAccessLogs(prev => [newLog, ...prev]);
  };

  const deleteSubmission = (id: string) => {
    const newSubmissions = submissions.filter(s => s.id !== id);
    setSubmissions(newSubmissions);
    if (user.email) {
      localStorage.setItem(`submissions_${user.email}`, JSON.stringify(newSubmissions));
    }
  };

  const toggleRole = () => {
    const newRole: UserRole = user.role === 'STUDENT' ? 'FACULTY' : 'STUDENT';
    const newUser = { ...user, role: newRole };
    setUser(newUser);
    localStorage.setItem('userSession', JSON.stringify(newUser));
    setActiveView('HOME');
  };

  // Show Landing Page for unauthenticated users who haven't clicked "Get Started"
  if (showLanding && !isAuthenticated) {
    return <LandingPage onLogin={() => setShowLanding(false)} />;
  }

  // Show Login Page after user clicks "Get Started" on landing
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onBack={() => setShowLanding(true)} />;
  }

  return (
    <div className="flex min-h-screen relative max-w-[100vw] overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        user={user}
        activeView={activeView}
        onViewChange={setActiveView}
        onToggleRole={toggleRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 min-w-0 relative z-10 transition-all duration-700 p-8">
        {/* Premium Header with Glassmorphism */}
        <header className="main-header sticky top-0 z-40 backdrop-blur-xl border-b transition-all duration-700 rounded-2xl mb-8"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)'
          }}>
          <div className="w-full mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-1 px-3 py-1 bg-accent-gradient rounded-full" />
              <div>
                <h2 className="text-xl font-black tracking-tight text-text-primary">
                  {activeView === 'HOME' ? 'Institutional Dashboard' :
                    activeView === 'DRAFT' ? 'Draft Analysis' :
                      activeView === 'VERIFY' ? 'Verification Portal' :
                        activeView === 'LEDGER' ? 'Audit Ledger' : 'Control Panel'}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Secured by Guardian AI Neural Network</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-text-primary capitalize">{user.name}</span>
                <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">{user.role}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-accent-gradient p-[1px]">
                <div className="w-full h-full rounded-2xl flex items-center justify-center font-bold text-accent-primary"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-error/10 text-text-tertiary hover:text-error transition-all" title="Sign Out">
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
          {activeView === 'HOME' && (
            user.role === 'STUDENT' ? (
              <StudentDashboard submissions={submissions} onViewDrafts={() => setActiveView('DRAFT')} />
            ) : (
              <FacultyDashboard submissions={submissions} ledger={ledger} />
            )
          )}

          {activeView === 'DRAFT' && (
            <DraftEditor
              onSave={(sub) => {
                addSubmission(sub);
                saveToLedger({
                  hash: sub.hash,
                  submissionId: sub.id,
                  timestamp: new Date().toISOString(),
                  actor: user.name,
                  action: 'DRAFT_CHECK'
                });
              }}
              onToggleSidebar={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />
          )}

          {activeView === 'VERIFY' && (
            <VerificationPortal submissions={submissions} ledger={ledger} />
          )}

          {activeView === 'CONTROL_PANEL' && user.role === 'STUDENT' && (
            <ControlPanel
              user={user}
              submissions={submissions}
              accessLogs={accessLogs}
              onDeleteRequest={deleteSubmission}
            />
          )}

          {activeView === 'LEDGER' && (
            <div className="card-premium animate-scale-in" style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
              overflow: 'hidden'
            }}>
              <div className="p-6 flex justify-between items-center" style={{
                background: 'var(--surface-glass)',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                    background: 'var(--accent-gradient)'
                  }}>
                    <i className="fa-solid fa-link text-white"></i>
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Immutable Audit Ledger
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Cryptographically secured transaction log
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/10 border border-success/20" style={{
                  color: 'var(--success)',
                }}>
                  GTU-Mainnet-01
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{
                      background: 'var(--surface-glass)',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Timestamp</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Hash</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Action</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry, i) => (
                      <tr key={i} className="group transition-all" style={{
                        borderBottom: '1px solid var(--border-subtle)'
                      }}>
                        <td className="px-6 py-4 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-mono truncate max-w-[200px]" style={{ color: 'var(--accent-primary)' }}>
                          {entry.hash}
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                          {entry.action}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10" style={{
                            color: 'var(--success)'
                          }}>
                            <i className="fa-solid fa-check-circle mr-1.5"></i>
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                    {ledger.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                              background: 'var(--surface-glass)',
                              border: '1px solid var(--border-subtle)'
                            }}>
                              <i className="fa-solid fa-database text-2xl" style={{ color: 'var(--text-tertiary)' }}></i>
                            </div>
                            <p style={{ color: 'var(--text-tertiary)' }}>No transactions recorded yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
