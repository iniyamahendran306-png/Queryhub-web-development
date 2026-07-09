import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function UserProfile() {
  const {
    users,
    questions,
    answers,
    currentUser,
    selectedProfileUserId,
    setActiveView,
    updateProfile,
    viewQuestion
  } = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'answers'

  const user = users.find(u => u.id === selectedProfileUserId);
  
  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>User profile not found.</p>
        <button className="btn btn-secondary" onClick={() => setActiveView('dashboard')} style={{ marginTop: '16px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  // Calculation stats
  const userQuestions = questions.filter(q => q.userId === user.id);
  const userAnswers = answers.filter(a => a.userId === user.id);
  
  // Upvotes calculations
  const questionUpvotes = userQuestions.reduce((acc, q) => acc + (q.upvotes || 0), 0);
  const answerUpvotes = userAnswers.reduce((acc, a) => acc + (a.upvotes || 0), 0);
  const totalReputation = questionUpvotes + answerUpvotes;

  const handleStartEdit = () => {
    setBioInput(user.bio || '');
    setEditMode(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateProfile(bioInput);
    setEditMode(false);
  };

  // Format Join Date
  const formatJoinDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 40px 24px', textAlign: 'left' }}>
      
      {/* Back button */}
      <button 
        onClick={() => setActiveView('dashboard')}
        className="btn btn-secondary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          marginBottom: '24px',
          borderRadius: '20px',
          fontSize: '13px'
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Dashboard
      </button>

      {/* Profile Header Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '24px'
        }}>
          {/* Avatar Graphic */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            backgroundColor: user.avatarColor || '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 800,
            color: 'white',
            boxShadow: `0 8px 24px ${user.avatarColor}40`
          }}>
            {user.username.substring(0, 2).toUpperCase()}
          </div>

          {/* User Meta info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>@{user.username}</h2>
              {isOwnProfile && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary)',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(99, 102, 241, 0.3)'
                }}>
                  You
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Member since {formatJoinDate(user.createdAt)}
            </p>

            {/* Bio Display/Form */}
            {editMode ? (
              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={250}
                  style={{ fontSize: '14px', lineHeight: '1.5' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    Save
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} style={{ padding: '8px 16px', fontSize: '13px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ maxWidth: '600px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6', fontStyle: user.bio ? 'normal' : 'italic' }}>
                  {user.bio || "This user hasn't written a biography yet."}
                </p>
                {isOwnProfile && (
                  <button 
                    onClick={handleStartEdit}
                    className="btn btn-secondary"
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '6px'
                    }}
                  >
                    Edit Biography
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px'
        }}>
          {/* Reputation */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '16px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: 'var(--primary)' }}>
              {totalReputation}
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginTop: '4px' }}>
              Total Upvotes Received
            </span>
          </div>

          {/* Questions */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '16px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>
              {userQuestions.length}
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginTop: '4px' }}>
              Questions Asked
            </span>
          </div>

          {/* Answers */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            padding: '16px',
            borderRadius: 'var(--border-radius-sm)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '24px', fontWeight: 800, color: '#f8fafc' }}>
              {userAnswers.length}
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginTop: '4px' }}>
              Answers Published
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list of User Contributions */}
      <div>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '20px'
        }}>
          <button 
            onClick={() => setActiveTab('questions')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'questions' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'questions' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Questions ({userQuestions.length})
          </button>
          <button 
            onClick={() => setActiveTab('answers')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'answers' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'answers' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            Answers ({userAnswers.length})
          </button>
        </div>

        {/* Tab Panel Content */}
        <div>
          {activeTab === 'questions' ? (
            userQuestions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '32px' }}>
                No questions asked yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    className="glass-panel" 
                    onClick={() => viewQuestion(q.id)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px', color: '#f8fafc' }}>
                      {q.title}
                    </h4>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>{q.upvotes - q.downvotes} votes</span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            userAnswers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '32px' }}>
                No answers posted yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userAnswers.map((a) => {
                  const parentQuestion = questions.find(q => q.id === a.questionId) || { title: 'Unknown Question' };
                  return (
                    <div 
                      key={a.id} 
                      className="glass-panel" 
                      onClick={() => viewQuestion(a.questionId)}
                      style={{
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Answered on: "{parentQuestion.title}"
                      </span>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        margin: '0 0 8px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {a.content}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>{a.upvotes - a.downvotes} votes</span>
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
