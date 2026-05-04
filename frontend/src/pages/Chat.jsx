import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, Loader2, Video } from 'lucide-react';
import { motion } from 'framer-motion';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUser = async () => {
    try {
      const res = await api.get('/swap/my');
      // Find the user details from swap requests
      const allRequests = [...res.data.sent, ...res.data.received];
      const match = allRequests.find(req => 
        req.toUser._id === userId || req.fromUser._id === userId
      );
      if (match) {
        setOtherUser(match.toUser._id === userId ? match.toUser : match.fromUser);
      }
    } catch (err) {
      console.error('Failed to fetch user details');
    }
  };

  useEffect(() => {
    fetchOtherUser();
    fetchMessages();
    
    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    try {
      const newMsg = {
        _id: Date.now().toString(),
        text: inputText,
        sender: user._id || user.id, // Depending on context structure
        createdAt: new Date().toISOString()
      };
      
      // Optimistic update
      setMessages([...messages, newMsg]);
      setInputText('');
      
      await api.post(`/messages/${userId}`, { text: newMsg.text });
      fetchMessages(); // Refresh actual
    } catch (err) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-10 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-[#111113] p-4 rounded-t-2xl border border-slate-200 dark:border-white/10 flex items-center gap-4 shadow-sm z-10">
        <button 
          onClick={() => navigate('/requests')}
          className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center justify-between flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center font-black text-lg">
              {otherUser ? otherUser.name.charAt(0) : '?'}
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">
                {otherUser ? otherUser.name : 'Loading...'}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Active Connection
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => {
              const room = `swap-${[user.id || user._id, userId].sort().join('-')}`;
              api.post(`/messages/${userId}`, { text: `🎥 Join my video call: /video-call/${room}` });
              navigate(`/video-call/${room}`);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            <Video size={16} /> <span className="hidden sm:inline">Start Video Call</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 bg-slate-50 dark:bg-[#0a0a0b] border-x border-slate-200 dark:border-white/10 p-4 overflow-y-auto min-h-[50vh] flex flex-col gap-4">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-500" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-white/10">
              <Send className="text-slate-300 dark:text-slate-600" size={24} />
            </div>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold mb-1">Start the conversation!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Introduce yourself and discuss how you want to exchange skills via video call or messages.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === user._id || msg.sender === user.id;
            return (
              <motion.div 
                key={msg._id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium ${
                  isMe 
                    ? 'bg-primary-600 text-white rounded-br-sm shadow-lg shadow-primary-500/20' 
                    : 'bg-white dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-bl-sm'
                }`}>
                  {msg.text.startsWith('🎥 Join my video call:') ? (
                    <div className="flex flex-col gap-2">
                      <p>{msg.text.split(': ')[0]}</p>
                      <button 
                        onClick={() => navigate(msg.text.split(': ')[1])}
                        className={`py-2 px-4 rounded-lg font-black text-xs flex items-center justify-center gap-2 transition-all ${
                          isMe ? 'bg-white text-primary-600' : 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                        }`}
                      >
                        <Video size={14} /> Join Meeting
                      </button>
                    </div>
                  ) : (
                    msg.text
                  )}
                  <div className={`text-[9px] mt-1 text-right font-bold ${
                    isMe ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="bg-white dark:bg-[#111113] p-4 rounded-b-2xl border border-slate-200 dark:border-white/10 flex gap-3 shadow-sm">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="bg-primary-600 disabled:bg-primary-400 text-white p-3 px-5 rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
