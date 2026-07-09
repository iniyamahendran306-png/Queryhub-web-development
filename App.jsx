import React, { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import AskQuestionModal from './components/AskQuestionModal';
import QuestionCard from './components/QuestionCard';
import QuestionDetail from './components/QuestionDetail';
import UserProfile from './components/UserProfile';

export default function App() {
  const {
    questions,
    activeView,
    searchTerm,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    setAskModalOpen,
    notification,
    setSearchTerm
  } = useContext(AppContext);

  // Get all unique tags from all questions
  const allTags = Array.from(
    new Set(questions.flatMap((q) => q.tags || []))
  ).slice(0, 15); // limit to top 15 tags

  // Filter and sort questions
  const filteredQuestions = questions
    .filter((q) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchTag = !selectedTag || q.tags.includes(selectedTag);
      
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'votes') {
        const votesA = (a.upvotes || 0) - (a.downvotes || 0);
        const votesB = (b.upvotes || 0) - (b.downvotes || 0);
        return votesB - votesA;
      }
      // Wait, answer count sort requires calculating answer counts
      if (sortBy === 'answers') {
        // AppContext handles answer count helper but we can calculate directly
        // We will load answers from localStorage inside AppContext, but we can access questions or write a simple sorting
        // Actually, we can count it using a selector if we had answers. But we can just use custom sorting.
        // Let's query answers count. AppContext has answers.
        // Let's use answers state inside context or fallback
        // We can access answers here by importing or using localStorage
        const getAnswersCount = (qId) => {
          const savedAnswers = localStorage.getItem('askflow_answers');
          if (!savedAnswers) return 0;
          try {
            const parsed = JSON.parse(savedAnswers);
            return parsed.filter((a) => a.questionId === qId).length;
          } catch {
            return 0;
          }
        };
        return getAnswersCount(b.id) - getAnswersCount(a.id);
      }
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top sticky glass navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px 40px 24px',
        display: activeView === 'dashboard' ? 'grid' : 'block',
        gridTemplateColumns: activeView === 'dashboard' ? '1fr 300px' : 'none',
        gap: '32px'
      }}>
        
        {/* VIEW: Dashboard (Main list) */}
        {activeView === 'dashboard' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Feed Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '0 8px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  margin: 0,
                  background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'left'
                }}>
                  Top Questions
                </h1>
                
                {/* Active filters display */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Showing {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
                  </span>
                  {selectedTag && (
                    <span 
                      onClick={() => setSelectedTag(null)}
                      className="tag"
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        color: '#f9a8d4',
                        borderColor: 'rgba(236, 72, 153, 0.2)',
                        padding: '2px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>#{selectedTag}</span>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  )}
                  {searchTerm && (
                    <span 
                      onClick={() => setSearchTerm('')}
                      className="tag"
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#a5b4fc',
                        borderColor: 'rgba(99, 102, 241, 0.2)',
                        padding: '2px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Search: "{searchTerm}"</span>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Sort triggers */}
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <button
                  onClick={() => setSortBy('recent')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: sortBy === 'recent' ? 'var(--primary)' : 'transparent',
                    color: sortBy === 'recent' ? '#fff' : 'var(--text-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy('votes')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: sortBy === 'votes' ? 'var(--primary)' : 'transparent',
                    color: sortBy === 'votes' ? '#fff' : 'var(--text-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Votes
                </button>
                <button
                  onClick={() => setSortBy('answers')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: sortBy === 'answers' ? 'var(--primary)' : 'transparent',
                    color: sortBy === 'answers' ? '#fff' : 'var(--text-secondary)',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  Answers
                </button>
              </div>
            </div>

            {/* Questions Feed list */}
            {filteredQuestions.length === 0 ? (
              <div className="glass-panel" style={{
                padding: '64px 32px',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '4px' }}>No questions match your criteria</h3>
                  <p style={{ fontSize: '14px', maxWidth: '400px' }}>Try searching something else, clearing filters, or ask a brand new question to start a discussion!</p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setAskModalOpen(true)}
                  style={{ borderRadius: '20px', padding: '8px 20px', marginTop: '8px' }}
                >
                  Ask a Question
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredQuestions.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* VIEW: Dashboard Sidebar */}
        {activeView === 'dashboard' && (
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            
            {/* Filter by tags */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                Popular Tags
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <span
                      key={tag}
                      onClick={() => setSelectedTag(isSelected ? null : tag)}
                      className="tag"
                      style={{
                        background: isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.08)',
                        color: isSelected ? '#fff' : '#a5b4fc',
                        borderColor: isSelected ? 'var(--primary)' : 'rgba(99, 102, 241, 0.15)',
                        fontSize: '11px',
                        padding: '4px 10px'
                      }}
                    >
                      #{tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Promo/Info Widget */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.2)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: '#f8fafc' }}>
                Welcome to AskFlow! 🌌
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
                AskFlow is a community for software engineers, designers, and tech enthusiasts. Ask questions, reply to other users, and upvote high-quality answers.
              </p>
              <ul style={{ fontSize: '12px', color: 'var(--text-muted)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--success)' }}>✔</span> Persisted in LocalStorage
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--success)' }}>✔</span> Custom Markdown Renderer
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--success)' }}>✔</span> High-End Glassmorphism
                </li>
              </ul>
            </div>
          </aside>
        )}

        {/* VIEW: Question Details page */}
        {activeView === 'question-detail' && <QuestionDetail />}

        {/* VIEW: User Profile dashboard */}
        {activeView === 'profile' && <UserProfile />}
      </main>

      {/* Global Modals */}
      <LoginModal />
      <AskQuestionModal />

      {/* Toast Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            )}
            {notification.type === 'error' && (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
