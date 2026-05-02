import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

const MessagesList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/swap/my');
        
        const acceptedSent = res.data.sent
          .filter(req => req.status === 'accepted')
          .map(req => req.toUser);
          
        const acceptedReceived = res.data.received
          .filter(req => req.status === 'accepted')
          .map(req => req.fromUser);

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
                <Card className="group flex items-center justify-between p-5 hover:border-primary-300 dark:hover:border-primary-500/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg leading-tight">{contact.name}</h4>
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-bold">{contact.email}</p>
                    </div>
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={20} />
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
