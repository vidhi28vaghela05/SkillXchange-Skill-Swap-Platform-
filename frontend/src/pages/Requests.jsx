import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowUpRight, ArrowDownLeft, Clock, Inbox } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

const Requests = () => {
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/swap/my');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/swap/${id}/${action}`);
      fetchRequests();
    } catch (err) {
      alert(`Failed to ${action} request`);
    }
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      rejected: 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return (
      <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-bold animate-pulse">Syncing your requests...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-10">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Requests</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your incoming connections and pending invites.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Received Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <ArrowDownLeft size={18} />
              </div>
              Inbox
            </h2>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-md text-xs font-black">{requests.received.length}</span>
          </div>
          
          <div className="space-y-4">
            {requests.received.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 border-dashed">
                <Inbox className="mx-auto text-slate-200 dark:text-slate-600 mb-3" size={36} />
                <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">No incoming requests</p>
              </div>
            ) : (
              <AnimatePresence>
                {requests.received.map(req => (
                  <Card key={req._id} className="group flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg">
                        {req.fromUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-slate-200 text-base">{req.fromUser.name}</h4>
                        <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">{req.fromUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StatusBadge status={req.status} />
                          <span className="text-[9px] text-slate-300 dark:text-slate-500 font-bold flex items-center gap-1">
                            <Clock size={10} /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {req.status === 'pending' && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          onClick={() => handleAction(req._id, 'accept')} 
                          variant="accent"
                          className="flex-1 sm:flex-none !p-2 !rounded-lg"
                        >
                          <Check size={16} />
                        </Button>
                        <Button 
                          onClick={() => handleAction(req._id, 'reject')} 
                          variant="danger"
                          className="flex-1 sm:flex-none !p-2 !rounded-lg bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                    {req.status === 'accepted' && (
                      <a href={`mailto:${req.fromUser.email}`} className="flex-1 sm:flex-none">
                        <Button className="w-full sm:w-auto !p-2 px-4 !rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 text-xs">
                           Email <ArrowUpRight size={14} />
                        </Button>
                      </a>
                    )}
                  </Card>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Sent Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <ArrowUpRight size={18} />
              </div>
              Outbox
            </h2>
            <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-md text-xs font-black">{requests.sent.length}</span>
          </div>

          <div className="space-y-4">
            {requests.sent.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 border-dashed">
                <ArrowUpRight className="mx-auto text-slate-200 dark:text-slate-600 mb-3" size={36} />
                <p className="text-slate-400 dark:text-slate-500 text-sm font-bold">No sent requests</p>
              </div>
            ) : (
              <AnimatePresence>
                {requests.sent.map(req => (
                  <Card key={req._id} className="group flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-lg">
                        {req.toUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-slate-200 text-base">{req.toUser.name}</h4>
                        <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">{req.toUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StatusBadge status={req.status} />
                          <span className="text-[9px] text-slate-300 dark:text-slate-500 font-bold flex items-center gap-1">
                            <Clock size={10} /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {req.status === 'accepted' && (
                      <a href={`mailto:${req.toUser.email}`} className="mt-4 sm:mt-0 w-full sm:w-auto">
                        <Button className="w-full sm:w-auto !p-2 px-4 !rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 text-xs">
                           Email <ArrowUpRight size={14} />
                        </Button>
                      </a>
                    )}
                  </Card>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requests;
