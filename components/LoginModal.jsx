import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

export default function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, register } = useContext(AppContext);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const initialInputRef = useRef(null);

  // Focus the first input on load
  useEffect(() => {
    if (loginModalOpen) {
      setTimeout(() => {
        initialInputRef.current?.focus();
      }, 50);
    }
  }, [loginModalOpen, isSignUp]);

  if (!loginModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!"); // Fallback notification
        return;
      }
      register(username, email, password);
    } else {
      login(username, password);
    }
  };

  const handleClose = () => {
    setLoginModalOpen(false);
    // Reset form
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content glass-panel animate-scale" 
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: 'var(--border-radius-md)'
        }}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Close Modal">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '28px'
        }}>
          <button 
            onClick={() => setIsSignUp(false)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: !isSignUp ? '2px solid var(--primary)' : '2px solid transparent',
              color: !isSignUp ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsSignUp(true)}
            style={{
              flex: 1,
              padding: '12px',
              background: 'transparent',
              border: 'none',
              borderBottom: isSignUp ? '2px solid var(--primary)' : '2px solid transparent',
              color: isSignUp ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username (needed for login/signup) */}
          <div>
            <label htmlFor="auth-username">
              {isSignUp ? 'Username' : 'Username or Email'}
            </label>
            <input
              id="auth-username"
              type="text"
              required
              ref={initialInputRef}
              placeholder={isSignUp ? 'e.g. coder_max' : 'Enter username or email'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Email (only for signup) */}
          {isSignUp && (
            <div>
              <label htmlFor="auth-email">Email Address</label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="e.g. max@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password (only for signup) */}
          {isSignUp && (
            <div>
              <label htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              padding: '14px',
              fontSize: '15px',
              marginTop: '10px'
            }}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Hint */}
        {!isSignUp && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: 'var(--border-radius-sm)',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            <strong>Demo Credentials:</strong> alex_dev / password123
          </div>
        )}
      </div>
    </div>
  );
}
