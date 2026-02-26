import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Lock,
  Zap
} from 'lucide-react';

// Types
interface User {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  userEmail: string;
  title: string;
  content: string;
  createdAt: number;
}

export default function App() {
  // Auth State
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('currentUser'));
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // App State
  const [data, setData] = useState<UserData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // CRUD State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Load user data whenever userEmail changes
  useEffect(() => {
    if (userEmail) {
      const allData: UserData[] = JSON.parse(localStorage.getItem('app_data') || '[]');
      const filteredData = allData.filter(item => item.userEmail === userEmail);
      setData(filteredData.sort((a, b) => b.createdAt - a.createdAt));
    }
  }, [userEmail]);

  // --- Auth Logic ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users: User[] = JSON.parse(localStorage.getItem('app_users') || '[]');
      
      if (isLogin) {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('currentUser', email);
          setUserEmail(email);
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (users.some(u => u.email === email)) {
          setError('User already exists');
        } else {
          users.push({ email, password });
          localStorage.setItem('app_users', JSON.stringify(users));
          setIsLogin(true);
          setError('Registration successful! Please login.');
        }
      }
      setLoading(false);
    }, 500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users: User[] = JSON.parse(localStorage.getItem('app_users') || '[]');
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex > -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('app_users', JSON.stringify(users));
        setIsForgotPassword(false);
        setIsLogin(true);
        setError('Password updated! Please login.');
      } else {
        setError('User not found');
      }
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUserEmail(null);
    setData([]);
    setEmail('');
    setPassword('');
  };

  // --- CRUD Logic ---
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !userEmail) return;

    const newItem: UserData = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: userEmail,
      title: newTitle,
      content: newContent,
      createdAt: Date.now()
    };

    const allData: UserData[] = JSON.parse(localStorage.getItem('app_data') || '[]');
    const updatedAllData = [...allData, newItem];
    localStorage.setItem('app_data', JSON.stringify(updatedAllData));
    
    setData([newItem, ...data]);
    setNewTitle('');
    setNewContent('');
  };

  const handleUpdate = (id: string) => {
    const allData: UserData[] = JSON.parse(localStorage.getItem('app_data') || '[]');
    const updatedAllData = allData.map(item => 
      item.id === id ? { ...item, title: editTitle, content: editContent } : item
    );
    localStorage.setItem('app_data', JSON.stringify(updatedAllData));
    
    setData(data.map(item => item.id === id ? { ...item, title: editTitle, content: editContent } : item));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const allData: UserData[] = JSON.parse(localStorage.getItem('app_data') || '[]');
    const updatedAllData = allData.filter(item => item.id !== id);
    localStorage.setItem('app_data', JSON.stringify(updatedAllData));
    
    setData(data.filter(item => item.id !== id));
  };

  // --- Views ---
  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#f5f5f4] flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-black/5 overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-3">
                <Zap size={32} fill="currentColor" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {isForgotPassword ? 'Enter your email and a new password' : (isLogin ? 'Enter your credentials to access your data' : 'Join us to start managing your information')}
            </p>

            <form onSubmit={isForgotPassword ? handleResetPassword : handleAuth} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {!isForgotPassword ? (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isForgotPassword ? 'Update Password' : (isLogin ? <><LogIn size={20} /> Sign In</> : <><UserPlus size={20} /> Sign Up</>))}
              </button>
            </form>

            <div className="mt-8 text-center space-y-2">
              {isForgotPassword ? (
                <button 
                  onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(''); }}
                  className="text-indigo-600 font-medium hover:underline block w-full"
                >
                  Back to Sign In
                </button>
              ) : (
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-indigo-600 font-medium hover:underline block w-full"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">DataHub</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">{userEmail?.split('@')[0]}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={24} className="text-indigo-600" />
                Add New Entry
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Entry title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Content</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                    placeholder="Describe your data..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Create Record
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-slate-800">Your Records</h2>
              <span className="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {data.length} Total
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {data.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600">No records found</h3>
                  <p className="text-slate-400">Start by adding a new entry on the left.</p>
                </motion.div>
              ) : (
                data.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingId === item.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <textarea
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(item.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all"
                          >
                            <Save size={18} /> Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all"
                          >
                            <X size={18} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h4>
                          <p className="text-slate-600 whitespace-pre-wrap">{item.content}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditTitle(item.title);
                              setEditContent(item.content);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
