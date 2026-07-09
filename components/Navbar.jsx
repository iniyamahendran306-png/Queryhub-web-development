import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const {
    currentUser,
    searchTerm,
    setSearchTerm,
    setLoginModalOpen,
    setAskModalOpen,
    setActiveView,
    logout,
    viewProfile
  } = useContext(AppContext);

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      margin: '16px 24px 24px 24px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => {
          setActiveView('dashboard');
          setSearchTerm('');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
          <path d="M16 8C11.58 8 8 11.58 8 16C8 18.25 8.93 20.28 10.42 21.75L9 24.5C8.75 25 9.12 25.5 9.68 25.38L13.12 24.62C14.03 24.87 15 25 16 25C20.42 25 24 21.42 24 17C24 12.58 20.42 8 16 8ZM17 21H15V19H17V21ZM18.07 15.65C17.67 16.14 17 16.5 17 17.5H15C15 16 15.82 15.07 16.47 14.53C16.82 14.24 17 13.97 17 13.5C17 12.67 16.33 12 15.5 12C14.67 12 14 12.67 14 13.5H12C12 11.57 13.57 10 15.5 10C17.43 10 19 11.57 19 13.5C19 14.39 18.57 15.03 18.07 15.65Z" fill="white"/>
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '22px',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(90deg, #f8fafc 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Ask<span style={{ color: '#a855f7' }}>Flow</span>
        </span>
      </div>

      {/* Search Input */}
      <div style={{
        position: 'relative',
        flex: 1,
        maxWidth: '480px'
      }}>
        <input
          type="text"
          placeholder="Search questions, code, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingLeft: '44px',
            borderRadius: '24px',
            fontSize: '14px',
            height: '42px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        />
        <svg 
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }}
          width="18" 
          height="18" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      {/* User Session Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {currentUser ? (
          <>
            <button 
              className="btn btn-primary" 
              onClick={() => setAskModalOpen(true)}
              style={{
                height: '40px',
                padding: '0 16px',
                borderRadius: '20px'
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Ask</span>
            </button>

            {/* Profile trigger */}
            <div 
              onClick={() => viewProfile(currentUser.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'var(--transition-smooth)',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: currentUser.avatarColor || '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                @{currentUser.username}
              </span>
            </div>

            {/* Logout button */}
            <button 
              onClick={logout}
              className="btn btn-secondary"
              title="Logout"
              style={{
                width: '40px',
                height: '40px',
                padding: 0,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={() => setLoginModalOpen(true)}
            style={{
              height: '40px',
              padding: '0 20px',
              borderRadius: '20px'
            }}
          >
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
