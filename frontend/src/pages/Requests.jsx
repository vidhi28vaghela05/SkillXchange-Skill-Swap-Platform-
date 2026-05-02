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
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">Requests</h1>
        <p className="text-slate-500 text-lg font-medium">Manage your incoming connections and pending invites.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Received Requests */}
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                <ArrowDownLeft size={24} />
              </div>
              Inbox
            </h2>
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-black">{requests.received.length}</span>
          </div>
          
          <div className="space-y-6">
            {requests.received.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                <Inbox className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">No incoming requests</p>
              </div>
            ) : (
              <AnimatePresence>
                {requests.received.map(req => (
                  <Card key={req._id} className="group !p-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                        {req.fromUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">{req.fromUser.name}</h4>
                        <p className="text-slate-400 text-sm font-semibold">{req.fromUser.email}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <StatusBadge status={req.status} />
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                            <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {req.status === 'pending' && (
                      <div className="flex gap-3 w-full sm:w-auto">
                        <Button 
                          onClick={() => handleAction(req._id, 'accept')} 
                          variant="accent"
                          className="flex-1 sm:flex-none !p-3 !rounded-xl"
                        >
                          <Check size={20} />
                        </Button>
                        <Button 
                          onClick={() => handleAction(req._id, 'reject')} 
                          variant="danger"
                          className="flex-1 sm:flex-none !p-3 !rounded-xl bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                        >
                          <X size={20} />
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Sent Requests */}
        <div className="space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <ArrowUpRight size={24} />
              </div>
              Outbox
            </h2>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-sm font-black">{requests.sent.length}</span>
          </div>

          <div className="space-y-6">
            {requests.sent.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                <ArrowUpRight className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 font-bold">No sent requests</p>
              </div>
            ) : (
              <AnimatePresence>
                {requests.sent.map(req => (
                  <Card key={req._id} className="group !p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-xl">
                        {req.toUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">{req.toUser.name}</h4>
                        <p className="text-slate-400 text-sm font-semibold">{req.toUser.email}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <StatusBadge status={req.status} />
                          <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                            <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
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
