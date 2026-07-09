import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';

export default function AskQuestionModal() {
  const { askModalOpen, setAskModalOpen, askQuestion } = useContext(AppContext);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const titleInputRef = useRef(null);

  // Focus title input on modal load
  useEffect(() => {
    if (askModalOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [askModalOpen]);

  if (!askModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = askQuestion(title, content, tags);
    if (success) {
      setTitle('');
      setContent('');
      setTags('');
    }
  };

  const handleClose = () => {
    setAskModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content glass-panel animate-scale" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '650px',
          borderRadius: 'var(--border-radius-md)'
        }}
      >
        <button className="modal-close" onClick={handleClose} aria-label="Close Modal">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h3 style={{
          fontSize: '24px',
          marginBottom: '20px',
          background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Ask a Public Question
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question Title */}
          <div>
            <label htmlFor="question-title">Title</label>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Be specific and imagine you’re asking a question to another developer.
            </p>
            <input
              id="question-title"
              type="text"
              required
              ref={titleInputRef}
              placeholder="e.g. How to implement debounce in React using custom hooks?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Question Body */}
          <div>
            <label htmlFor="question-content">Body Details</label>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Introduce the problem, share code snippets, and describe what you've tried. (Supports standard line breaks)
            </p>
            <textarea
              id="question-content"
              required
              rows={8}
              placeholder="Explain details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                resize: 'vertical',
                lineHeight: '1.6'
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="question-tags">Tags</label>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Add up to 5 tags separated by commas to describe what your question is about.
            </p>
            <input
              id="question-tags"
              type="text"
              placeholder="e.g. react, hooks, javascript"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '10px'
          }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
