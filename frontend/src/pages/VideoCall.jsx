import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Maximize2, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import Button from '../components/Button';

const VideoCall = () => {
  const { roomName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    // Load Jitsi script dynamically
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName || `SkillXchange-${Math.random().toString(36).substring(7)}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user?.name || 'SkillXchange User',
          email: user?.email || ''
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        },
        configOverwrite: {
          disableDeepLinking: true,
        }
      };
      
      const api = new window.JitsiMeetExternalAPI(domain, options);
      
      api.addEventListener('videoConferenceLeft', () => {
        navigate(-1);
      });

      return () => api.dispose();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [roomName, user, navigate]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-white font-bold leading-tight">Skill Swap Session</h2>
            <p className="text-slate-400 text-xs">Room: {roomName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
            Live Call
          </div>
        </div>
      </div>

      {/* Jitsi Container */}
      <div className="flex-1 relative bg-black">
        <div ref={jitsiContainerRef} className="w-full h-full" />
        
        {/* Fallback / Loading state */}
        <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-[#0a0a0b]">
           <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-slate-400 font-bold animate-pulse">Initializing Secure Video Connection...</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
