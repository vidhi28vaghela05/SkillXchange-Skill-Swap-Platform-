import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Activity, Settings, TrendingUp, BarChart3, ShieldCheck, Search, MoreVertical, X } from 'lucide-react';
import Card from '../components/Card';
import api from '../api/axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookmarkedUsers, setBookmarkedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (activeTab === 'skills') {
      const fetchBookmarks = async () => {
        try {
          const res = await api.get('/users/match');
          const savedIds = JSON.parse(localStorage.getItem('bookmarks') || '[]');
          const saved = res.data.filter(u => savedIds.includes(u._id));
          setBookmarkedUsers(saved);
        } catch (err) {
          console.error(err);
        }
      };
      fetchBookmarks();
    }
  }, [activeTab]);

  const stats = [
    { label: 'Total Users', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Swaps', value: '3,842', change: '+5%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Skills Listed', value: '89,210', change: '+24%', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Platform Revenue', value: '$0.00', change: 'Free', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ];

  const recentUsers = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', role: 'User', status: 'Active', date: '2 mins ago' },
    { id: 2, name: 'Sarah Miller', email: 'sarah.m@example.com', role: 'User', status: 'Pending', date: '15 mins ago' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', role: 'Moderator', status: 'Active', date: '1 hour ago' },
    { id: 4, name: 'Emma Wilson', email: 'emma.w@example.com', role: 'User', status: 'Suspended', date: '3 hours ago' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#030014] pt-14">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white dark:bg-[#0a0a0b] border-r border-slate-200 dark:border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black tracking-tight text-xl mb-10">
            <ShieldCheck size={24} /> AdminOS
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'users', name: 'Manage Users', icon: Users },
              { id: 'skills', name: 'Skills Database', icon: BookOpen },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} /> {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Real-time metrics for SkillXchange platform.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        stat.change.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{stat.label}</p>
                  </Card>
                ))}
              </div>

              {/* Charts & Tables Area */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Mock Chart Area */}
                <Card className="lg:col-span-2 p-6 flex flex-col min-h-[300px]">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">User Growth (Last 30 Days)</h3>
                  <div className="flex-1 border-b border-l border-slate-200 dark:border-white/10 relative flex items-end justify-between px-2 pb-0 pt-4">
                    {/* Fake Chart Bars */}
                    {[40, 60, 45, 80, 65, 90, 85, 100, 70, 95].map((h, i) => (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05, duration: 0.8, type: 'spring' }}
                        key={i} 
                        className="w-[6%] bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-sm"
                      ></motion.div>
                    ))}
                  </div>
                </Card>

                {/* Recent Users List */}
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Signups</h3>
                    <button className="text-primary-600 dark:text-primary-400 text-sm font-bold">View All</button>
                  </div>
                  <div className="space-y-4">
                    {recentUsers.map(u => (
                      <div key={u.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.date}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                          u.status === 'Active' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' :
                          u.status === 'Pending' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                          'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Manage Users</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">View and manage all registered accounts.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500" />
                </div>
              </div>
              <Card className="overflow-hidden !p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{user.role}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                            user.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">{user.date}</td>
                        <td className="p-4">
                          <button className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-white/10">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Favorited Profiles</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Profiles you have bookmarked from the Discovery page.</p>
                </div>
              </div>
              <Card className="overflow-hidden !p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Profile</th>
                      <th className="p-4">Skills Offered</th>
                      <th className="p-4">Skills Wanted</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {bookmarkedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-500 font-bold">
                          No favorited profiles yet. Go to Matches page and click the Heart icon!
                        </td>
                      </tr>
                    ) : (
                      bookmarkedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shadow-inner">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                                <div className="text-slate-500 dark:text-slate-400 text-xs">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {user.skillsOffered?.map(s => (
                                <span key={s} className="bg-slate-100 dark:bg-white/5 text-[10px] px-2 py-0.5 rounded font-bold text-slate-600 dark:text-slate-300">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {user.skillsWanted?.map(s => (
                                <span key={s} className="bg-primary-50 dark:bg-primary-500/10 text-[10px] px-2 py-0.5 rounded font-bold text-primary-600 dark:text-primary-400">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => setSelectedUser(user)}
                              className="text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-3 py-1.5 rounded-lg hover:scale-105 transition-transform"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Platform Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your platform preferences and notification rules.</p>
              </div>
              
              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Email Alerts</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Receive daily summary of new swaps.</p>
                    </div>
                    <div className="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">New Match Push Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Get notified immediately when a match is found.</p>
                    </div>
                    <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-white/10 pb-2">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Public Profile</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Allow unregistered users to see your skills.</p>
                    </div>
                    <div className="w-10 h-5 bg-primary-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button className="text-sm font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
