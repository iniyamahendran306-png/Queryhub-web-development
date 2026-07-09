import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function QuestionCard({ question }) {
  const {
    currentUser,
    getUserById,
    getQuestionAnswersCount,
    voteQuestion,
    viewQuestion,
    viewProfile,
    setSelectedTag
  } = useContext(AppContext);

  const author = getUserById(question.userId);
  const answerCount = getQuestionAnswersCount(question.id);
  
  // Format Date nicely
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const hasUpvoted = question.upvotedBy?.includes(currentUser?.id);
  const hasDownvoted = question.downvotedBy?.includes(currentUser?.id);

  const netVotes = question.upvotes - question.downvotes;

  return (
    <article 
      className="glass-card animate-fade" 
      style={{
        display: 'flex',
        gap: '20px',
        padding: '24px',
        marginBottom: '16px',
        textAlign: 'left'
      }}
    >
      {/* Vote Panel (Left side) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        minWidth: '44px'
      }}>
        {/* Upvote */}
        <button 
          onClick={() => voteQuestion(question.id, 'up')}
          style={{
            background: 'transparent',
            border: 'none',
            color: hasUpvoted ? 'var(--success)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Upvote question"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={hasUpvoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>

        {/* Vote count */}
        <span style={{
          fontSize: '16px',
          fontWeight: 700,
          color: netVotes > 0 ? 'var(--text-primary)' : netVotes < 0 ? 'var(--error)' : 'var(--text-muted)'
        }}>
          {netVotes}
        </span>

        {/* Downvote */}
        <button 
          onClick={() => voteQuestion(question.id, 'down')}
          style={{
            background: 'transparent',
            border: 'none',
            color: hasDownvoted ? 'var(--error)' : 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="Downvote question"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={hasDownvoted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Title */}
        <h2 
          onClick={() => viewQuestion(question.id)}
          style={{
            fontSize: '19px',
            lineHeight: '1.4',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          {question.title}
        </h2>

        {/* Description snippet */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.6'
        }}>
          {question.content.replace(/```[\s\S]*?```/g, '[Code Block]')}
        </p>

        {/* Tags, Info & Meta */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '6px'
        }}>
          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {question.tags.map((tag) => (
              <span 
                key={tag} 
                className="tag"
                onClick={() => setSelectedTag(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author and Date Meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            {/* Answer count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{answerCount} {answerCount === 1 ? 'answer' : 'answers'}</span>
            </div>

            {/* Author */}
            <div 
              onClick={() => viewProfile(author.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: author.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {author.username.substring(0, 2).toUpperCase()}
              </div>
              <span>@{author.username}</span>
            </div>

            {/* Date */}
            <span>{formatDate(question.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
