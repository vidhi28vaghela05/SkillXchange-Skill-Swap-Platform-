import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

const MessagesList = () => {
  const [contacts, setContacts] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const [resSwap, resUnread] = await Promise.all([
          api.get('/swap/my'),
          api.get('/messages/unread/users')
        ]);
        
        const acceptedSent = resSwap.data.sent
          .filter(req => req.status === 'accepted')
          .map(req => req.toUser);
          
        const acceptedReceived = resSwap.data.received
          .filter(req => req.status === 'accepted')
          .map(req => req.fromUser);

        // Map unread counts to sender IDs
        const unreadMap = {};
        resUnread.data.forEach(item => {
          unreadMap[item._id] = item.count;
        });
        setUnreadCounts(unreadMap);

        // Combine and remove duplicates by ID
        const allContacts = [...acceptedSent, ...acceptedReceived];
        const uniqueContacts = Array.from(new Map(allContacts.map(user => [user._id, user])).values());
        
        setContacts(uniqueContacts);
      } catch (err) {
        console.error('Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();

    // High-frequency refresh every 2 seconds for a real-time feel
    const interval = setInterval(() => {
      fetchContacts();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Loading conversations...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Messages</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Chat with your accepted skill swap connections.</p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#111113] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <MessageSquare className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No conversations yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            You don't have any accepted connections to chat with. Go to the Matches page to find and connect with people!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/chat/${contact._id}`}>
                <Card className={`group flex items-center justify-between p-5 transition-all cursor-pointer ${
                  unreadCounts[contact._id] 
                    ? 'border-red-500 bg-red-500/5 ring-1 ring-red-500/20 shadow-lg shadow-red-500/5' 
                    : 'hover:border-primary-300 dark:hover:border-primary-500/50'
                }`}>
                  <div className="flex items-center gap-4 relative">
                    <div className="relative">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                        {contact.name.charAt(0)}
                      </div>
                      {unreadCounts[contact._id] && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-[#111113] rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg leading-tight">{contact.name}</h4>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">{contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {unreadCounts[contact._id] && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center justify-center min-w-[24px] shadow-lg shadow-red-500/30">
                        {unreadCounts[contact._id]} New
                      </span>
                    )}
                    <div className="text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList;
