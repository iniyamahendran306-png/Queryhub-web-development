import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import MarkdownRenderer from './MarkdownRenderer';

export default function QuestionDetail() {
  const {
    questions,
    answers,
    currentUser,
    selectedQuestionId,
    setActiveView,
    getUserById,
    voteQuestion,
    voteAnswer,
    addAnswer,
    deleteQuestion,
    viewProfile,
    setLoginModalOpen
  } = useContext(AppContext);

  const [answerContent, setAnswerContent] = useState('');

  const question = questions.find(q => q.id === selectedQuestionId);
  if (!question) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Question not found.</p>
        <button className="btn btn-secondary" onClick={() => setActiveView('dashboard')} style={{ marginTop: '16px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const author = getUserById(question.userId);
  const questionAnswers = answers.filter(a => a.questionId === question.id);

  // Format Date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePostAnswer = (e) => {
    e.preventDefault();
    const success = addAnswer(question.id, answerContent);
    if (success) {
      setAnswerContent('');
    }
  };

  const isOwner = currentUser?.id === question.userId;
  
  const hasUpvotedQuestion = question.upvotedBy?.includes(currentUser?.id);
  const hasDownvotedQuestion = question.downvotedBy?.includes(currentUser?.id);
  const questionNetVotes = question.upvotes - question.downvotes;

  return (
    <div className="animate-fade" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px 40px 24px', textAlign: 'left' }}>
      
      {/* Back navigation */}
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

      {/* Main Question Box */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', display: 'flex', gap: '24px' }}>
        
        {/* Votes Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '48px' }}>
          <button 
            onClick={() => voteQuestion(question.id, 'up')}
            style={{
              background: 'transparent',
              border: 'none',
              color: hasUpvotedQuestion ? 'var(--success)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill={hasUpvotedQuestion ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          
          <span style={{ fontSize: '18px', fontWeight: 800 }}>
            {questionNetVotes}
          </span>
          
          <button 
            onClick={() => voteQuestion(question.id, 'down')}
            style={{
              background: 'transparent',
              border: 'none',
              color: hasDownvotedQuestion ? 'var(--error)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill={hasDownvotedQuestion ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        {/* Content Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header & Title */}
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, lineHeight: '1.3', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
              {question.title}
            </h1>
            
            {/* Meta info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>Asked {formatDate(question.createdAt)}</span>
              
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

              {isOwner && (
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this question?")) {
                      deleteQuestion(question.id);
                    }
                  }}
                  className="btn btn-danger"
                  style={{
                    padding: '3px 10px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    height: '24px'
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

          {/* Description Content */}
          <MarkdownRenderer content={question.content} />

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            {question.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Answers</span>
          <span style={{
            fontSize: '13px',
            background: 'rgba(255,255,255,0.06)',
            padding: '4px 10px',
            borderRadius: '12px',
            color: 'var(--text-secondary)'
          }}>{questionAnswers.length}</span>
        </h3>

        {questionAnswers.length === 0 ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No answers yet. Be the first to reply!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {questionAnswers.map((answer) => {
              const answerAuthor = getUserById(answer.userId);
              const hasUpvotedAnswer = answer.upvotedBy?.includes(currentUser?.id);
              const hasDownvotedAnswer = answer.downvotedBy?.includes(currentUser?.id);
              const answerNetVotes = answer.upvotes - answer.downvotes;

              return (
                <div key={answer.id} className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '20px' }}>
                  
                  {/* Answer Votes */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '40px' }}>
                    <button 
                      onClick={() => voteAnswer(answer.id, 'up')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: hasUpvotedAnswer ? 'var(--success)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '6px',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={hasUpvotedAnswer ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    </button>
                    
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>
                      {answerNetVotes}
                    </span>
                    
                    <button 
                      onClick={() => voteAnswer(answer.id, 'down')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: hasDownvotedAnswer ? 'var(--error)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '6px',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={hasDownvotedAnswer ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>

                  {/* Answer Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div 
                        onClick={() => viewProfile(answerAuthor.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          fontWeight: 500
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: answerAuthor.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {answerAuthor.username.substring(0, 2).toUpperCase()}
                        </div>
                        <span>@{answerAuthor.username}</span>
                      </div>
                      <span>Answered {formatDate(answer.createdAt)}</span>
                    </div>

                    <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.04)' }} />

                    <MarkdownRenderer content={answer.content} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Answer Form */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Your Answer</h3>
        {currentUser ? (
          <form onSubmit={handlePostAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea
              required
              rows={6}
              placeholder="Write your answer here. Support markdown styling, like code blocks with ```..."
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              style={{
                resize: 'vertical',
                lineHeight: '1.6'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Post Answer
              </button>
            </div>
          </form>
        ) : (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              You must be signed in to post an answer to this question.
            </p>
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="btn btn-primary"
              style={{
                padding: '10px 24px',
                borderRadius: '20px'
              }}
            >
              Sign In to Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
