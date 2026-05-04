import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import MessagesList from './pages/MessagesList';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-[#030014] transition-colors duration-300 relative text-slate-900 dark:text-white">
            <Navbar />
            <main className="min-h-screen relative z-10">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
                <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
                <Route path="/messages" element={<PrivateRoute><MessagesList /></PrivateRoute>} />
                <Route path="/chat/:userId" element={<PrivateRoute><Chat /></PrivateRoute>} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
