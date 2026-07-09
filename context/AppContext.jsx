import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Seed data
const INITIAL_USERS = [
  {
    id: 'u1',
    username: 'alex_dev',
    email: 'alex@example.com',
    password: 'password123',
    avatarColor: '#6366f1',
    bio: 'Frontend Architect. Love building fluid glassmorphic web apps and learning new standards.',
    createdAt: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'u2',
    username: 'sarah_m',
    email: 'sarah@example.com',
    password: 'password123',
    avatarColor: '#ec4899',
    bio: 'UI/UX Designer & CSS whisperer. Passionate about color theory and accessibility.',
    createdAt: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'u3',
    username: 'code_ninja',
    email: 'ninja@example.com',
    password: 'password123',
    avatarColor: '#10b981',
    bio: 'Backend Engineer. Databases, microservices, and high-performance algorithms are my jam.',
    createdAt: new Date('2026-03-01').toISOString(),
  }
];

const INITIAL_QUESTIONS = [
  {
    id: 'q1',
    title: 'How can I achieve smooth 60fps animations with React and CSS grid?',
    content: `I'm building a dashboard layout using CSS Grid where items can expand and contract.
However, when updating state in React to resize the grid items, I see noticeable jank (fps drops to ~30-40).

Here is a snippet of my component:
\`\`\`jsx
const [expanded, setExpanded] = useState(false);
return (
  <div className="grid-container" style={{ gridTemplateColumns: expanded ? '2fr 1fr' : '1fr 1fr' }}>
    <div className="item" onClick={() => setExpanded(!expanded)}>Click to toggle</div>
    <div className="item">Sidebar</div>
  </div>
);
\`\`\`

Is there a way to animate CSS grid tracks smoothly, or should I use a different layout approach (e.g. absolute positioning with transforms)?`,
    userId: 'u2',
    tags: ['react', 'css', 'animation', 'performance'],
    upvotes: 24,
    downvotes: 1,
    upvotedBy: ['u1', 'u3'], // track user upvotes
    downvotedBy: [],
    createdAt: new Date('2026-07-05T14:30:00Z').toISOString(),
  },
  {
    id: 'q2',
    title: 'What is the best way to handle user authentication in a serverless application?',
    content: `I am developing a Jamstack application using React/Vite on the frontend and AWS Lambda functions on the backend.
Since there's no persistent server session:

1. Should I use JWT stored in HttpOnly cookies, or in local storage?
2. How do I handle token refresh without introducing complex server architecture?
3. Are third-party providers like Auth0 or Clerk worth the cost for small-to-medium hobby projects?

Would love to hear some best practices and architectural advice.`,
    userId: 'u1',
    tags: ['serverless', 'auth', 'security', 'aws'],
    upvotes: 18,
    downvotes: 0,
    upvotedBy: ['u2'],
    downvotedBy: [],
    createdAt: new Date('2026-07-06T09:15:00Z').toISOString(),
  },
  {
    id: 'q3',
    title: 'Why does a JavaScript closure retain access to its outer scope?',
    content: `I understand *how* to use closures, but I want to understand *why* they work under the hood. 

Specifically:
- What happens in the JavaScript engine memory when an outer function returns, but the inner function still accesses its variables?
- Does the garbage collector skip the entire lexical environment of the outer function?
- Is there a performance overhead we should worry about when creating thousands of closures?

Any deep technical insights would be highly appreciated!`,
    userId: 'u3',
    tags: ['javascript', 'engine', 'closures'],
    upvotes: 31,
    downvotes: 0,
    upvotedBy: ['u1', 'u2'],
    downvotedBy: [],
    createdAt: new Date('2026-07-07T11:00:00Z').toISOString(),
  }
];

const INITIAL_ANSWERS = [
  {
    id: 'a1',
    questionId: 'q1',
    content: `Animating CSS grid tracks directly (\`grid-template-columns\`) is notoriously bad for performance because it triggers a full browser **layout** (reflow) pass on every single frame. 

For 60fps animations, you should rely strictly on CSS transitions or animations that utilize **compositor-only properties** like \`transform\` and \`opacity\`.

Here is the FLIP (First, Last, Invert, Play) technique workaround:
1. Capture the initial coordinates of the grid item.
2. Toggle your state class (letting the browser lay out the grid instantly).
3. Capture the final coordinates.
4. Apply a \`transform\` matching the difference, and transition it back to \`0\`.

Alternatively, check out libraries like \`framer-motion\` which handle layout animations using FLIP automatically under the hood with excellent performance.`,
    userId: 'u1',
    upvotes: 15,
    downvotes: 0,
    upvotedBy: ['u2', 'u3'],
    downvotedBy: [],
    createdAt: new Date('2026-07-05T15:10:00Z').toISOString(),
  },
  {
    id: 'a2',
    questionId: 'q1',
    content: `I agree with Alex. To expand on this, the browser performs **Recalculate Style -> Layout -> Paint -> Composite**. 

Since CSS Grid resizing alters the layout boundary, you're asking the CPU to recalculate the size and position of every single element in that subtree. 

If your dashboard layout is relatively simple, you can achieve a similar visual outcome using a flexbox container and transitioning the \`flex-grow\` property, though that also triggers layout. If you want absolute butter-smooth transition, absolute positioning with \`transform: translate3d()\` is the gold standard!`,
    userId: 'u3',
    upvotes: 8,
    downvotes: 1,
    upvotedBy: ['u1'],
    downvotedBy: ['u2'],
    createdAt: new Date('2026-07-05T16:45:00Z').toISOString(),
  },
  {
    id: 'a3',
    questionId: 'q2',
    content: `For serverless applications, **JWT in HttpOnly, SameSite=Strict cookies** is generally the most secure choice because it shields your tokens from Cross-Site Scripting (XSS) attacks. If you store them in LocalStorage, any malicious script or dependency package has instant access to them.

Regarding token refresh:
- You can set up a \`/refresh\` Lambda endpoint that reads the HttpOnly refresh token cookie, validates it, and issues a new access token.
- Keep the access token short-lived (e.g. 15 minutes) and the refresh token longer-lived (e.g. 7 days).

For hobby projects, Clerk has an incredibly generous free tier (up to 10k monthly active users) and saves you weeks of work handling password resets, OAuth providers, and session management. I'd highly recommend it over rolling your own AWS Cognito setup, which is famously painful to configure.`,
    userId: 'u3',
    upvotes: 12,
    downvotes: 0,
    upvotedBy: ['u1'],
    downvotedBy: [],
    createdAt: new Date('2026-07-06T10:30:00Z').toISOString(),
  },
  {
    id: 'a4',
    questionId: 'q3',
    content: `Great question! Here is how the JavaScript engine (V8, JavaScriptCore, etc.) handles this under the hood:

### 1. The Lexical Environment
Every function execution context has an associated **Lexical Environment**. This environment contains the local bindings (variables, functions, arguments) and a reference to its outer (parent) lexical environment.

### 2. Execution & Scope Chain
Normally, when a function returns, its execution context is popped off the call stack. However, in JavaScript, functions are first-class objects. If you return an inner function that references variables from the outer scope, the inner function maintains a hidden property (usually referred to as \`[[Scopes]]\`).

### 3. Garbage Collection Mechanics
The Garbage Collector (GC) uses **reachability analysis**. 
- The returned inner function is reachable (assigned to some variable in the global scope, for example).
- The inner function's \`[[Scopes]]\` reference points to the outer function's Lexical Environment.
- Because there is a path of active references from the root to the outer Lexical Environment, the GC **cannot** free that memory.
- However, modern JS engines are smart: they analyze which outer variables are *actually* referenced. Variables in the outer scope that are NOT used by the inner function are eligible for GC!

### 4. Overhead
Yes, creating thousands of closures holds onto scope memory, which can lead to memory bloat if they aren't released. Always nullify references to the inner function when you're done with them!`,
    userId: 'u1',
    upvotes: 22,
    downvotes: 0,
    upvotedBy: ['u2', 'u3'],
    downvotedBy: [],
    createdAt: new Date('2026-07-07T12:15:00Z').toISOString(),
  }
];

export const AppProvider = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('askflow_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('askflow_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('askflow_answers');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('askflow_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI Navigation states
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'question-detail', 'profile'
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  
  // Filtering and searching states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'votes', 'answers'

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [askModalOpen, setAskModalOpen] = useState(false);

  // Notification
  const [notification, setNotification] = useState(null);

  // Persist data on state changes
  useEffect(() => {
    localStorage.setItem('askflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('askflow_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('askflow_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('askflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('askflow_current_user');
    }
  }, [currentUser]);

  // Toast notifications
  const triggerNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auth Operations
  const login = (usernameOrEmail, password) => {
    const foundUser = users.find(
      u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      setLoginModalOpen(false);
      triggerNotification(`Welcome back, @${foundUser.username}!`, 'success');
      return true;
    } else {
      triggerNotification('Invalid username/email or password', 'error');
      return false;
    }
  };

  const register = (username, email, password) => {
    // Simple validations
    if (username.length < 3) {
      triggerNotification('Username must be at least 3 characters long', 'error');
      return false;
    }
    if (!email.includes('@')) {
      triggerNotification('Please enter a valid email address', 'error');
      return false;
    }
    if (password.length < 6) {
      triggerNotification('Password must be at least 6 characters long', 'error');
      return false;
    }

    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if (usernameExists) {
      triggerNotification('Username is already taken', 'error');
      return false;
    }
    if (emailExists) {
      triggerNotification('Email is already registered', 'error');
      return false;
    }

    // Helper for random soft color for user avatar
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
      id: 'u_' + Date.now(),
      username,
      email,
      password,
      avatarColor: randomColor,
      bio: 'Just joined the AskFlow community!',
      createdAt: new Date().toISOString(),
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setLoginModalOpen(false);
    triggerNotification(`Account created! Welcome, @${username}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    triggerNotification('Logged out successfully', 'info');
    if (activeView === 'profile' && selectedProfileUserId === currentUser?.id) {
      setActiveView('dashboard');
    }
  };

  const updateProfile = (bio) => {
    if (!currentUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, bio };
      }
      return u;
    });
    setUsers(updatedUsers);
    setCurrentUser(prev => ({ ...prev, bio }));
    triggerNotification('Profile updated successfully!', 'success');
  };

  // Q&A Operations
  const askQuestion = (title, content, tagsString) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      triggerNotification('Please log in to ask a question', 'error');
      return false;
    }
    if (!title.trim() || !content.trim()) {
      triggerNotification('Title and Description are required', 'error');
      return false;
    }

    // Parse tags (comma separated, lowercase, alphanumeric, remove #)
    const tags = tagsString
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/#/g, ''))
      .filter(t => t.length > 0);

    const newQuestion = {
      id: 'q_' + Date.now(),
      title: title.trim(),
      content: content.trim(),
      userId: currentUser.id,
      tags: tags.length > 0 ? tags : ['general'],
      upvotes: 1,
      downvotes: 0,
      upvotedBy: [currentUser.id],
      downvotedBy: [],
      createdAt: new Date().toISOString(),
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setAskModalOpen(false);
    triggerNotification('Question published successfully!', 'success');
    
    // Auto-navigate to the new question
    setSelectedQuestionId(newQuestion.id);
    setActiveView('question-detail');
    return true;
  };

  const addAnswer = (questionId, content) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      triggerNotification('Please log in to post an answer', 'error');
      return false;
    }
    if (!content.trim()) {
      triggerNotification('Answer content cannot be empty', 'error');
      return false;
    }

    const newAnswer = {
      id: 'a_' + Date.now(),
      questionId,
      content: content.trim(),
      userId: currentUser.id,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      createdAt: new Date().toISOString(),
    };

    setAnswers(prev => [...prev, newAnswer]);
    triggerNotification('Answer submitted!', 'success');
    return true;
  };

  const deleteQuestion = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.userId !== currentUser?.id) {
      triggerNotification('Unauthorized action', 'error');
      return;
    }

    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setAnswers(prev => prev.filter(a => a.questionId !== questionId));
    triggerNotification('Question deleted', 'info');
    setActiveView('dashboard');
  };

  // Upvote / Downvote logic
  const voteQuestion = (questionId, voteType) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      triggerNotification('Please log in to vote', 'error');
      return;
    }

    const userId = currentUser.id;

    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== questionId) return q;

        let upvotedBy = [...(q.upvotedBy || [])];
        let downvotedBy = [...(q.downvotedBy || [])];

        const hasUpvoted = upvotedBy.includes(userId);
        const hasDownvoted = downvotedBy.includes(userId);

        if (voteType === 'up') {
          if (hasUpvoted) {
            // Remove upvote
            upvotedBy = upvotedBy.filter(id => id !== userId);
          } else {
            // Add upvote, remove downvote if any
            upvotedBy.push(userId);
            downvotedBy = downvotedBy.filter(id => id !== userId);
          }
        } else if (voteType === 'down') {
          if (hasDownvoted) {
            // Remove downvote
            downvotedBy = downvotedBy.filter(id => id !== userId);
          } else {
            // Add downvote, remove upvote if any
            downvotedBy.push(userId);
            upvotedBy = upvotedBy.filter(id => id !== userId);
          }
        }

        return {
          ...q,
          upvotedBy,
          downvotedBy,
          upvotes: upvotedBy.length,
          downvotes: downvotedBy.length,
        };
      })
    );
  };

  const voteAnswer = (answerId, voteType) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      triggerNotification('Please log in to vote', 'error');
      return;
    }

    const userId = currentUser.id;

    setAnswers(prev =>
      prev.map(a => {
        if (a.id !== answerId) return a;

        let upvotedBy = [...(a.upvotedBy || [])];
        let downvotedBy = [...(a.downvotedBy || [])];

        const hasUpvoted = upvotedBy.includes(userId);
        const hasDownvoted = downvotedBy.includes(userId);

        if (voteType === 'up') {
          if (hasUpvoted) {
            upvotedBy = upvotedBy.filter(id => id !== userId);
          } else {
            upvotedBy.push(userId);
            downvotedBy = downvotedBy.filter(id => id !== userId);
          }
        } else if (voteType === 'down') {
          if (hasDownvoted) {
            downvotedBy = downvotedBy.filter(id => id !== userId);
          } else {
            downvotedBy.push(userId);
            upvotedBy = upvotedBy.filter(id => id !== userId);
          }
        }

        return {
          ...a,
          upvotedBy,
          downvotedBy,
          upvotes: upvotedBy.length,
          downvotes: downvotedBy.length,
        };
      })
    );
  };

  // Helper selectors
  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || {
      username: 'anonymous',
      avatarColor: '#64748b',
      bio: 'A shadow in the digital workspace.'
    };
  };

  const getQuestionAnswersCount = (questionId) => {
    return answers.filter(a => a.questionId === questionId).length;
  };

  const viewProfile = (userId) => {
    setSelectedProfileUserId(userId);
    setActiveView('profile');
  };

  const viewQuestion = (questionId) => {
    setSelectedQuestionId(questionId);
    setActiveView('question-detail');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        questions,
        answers,
        currentUser,
        activeView,
        selectedQuestionId,
        selectedProfileUserId,
        searchTerm,
        selectedTag,
        sortBy,
        loginModalOpen,
        askModalOpen,
        notification,
        
        setActiveView,
        setSelectedQuestionId,
        setSelectedProfileUserId,
        setSearchTerm,
        setSelectedTag,
        setSortBy,
        setLoginModalOpen,
        setAskModalOpen,
        
        login,
        register,
        logout,
        updateProfile,
        askQuestion,
        addAnswer,
        deleteQuestion,
        voteQuestion,
        voteAnswer,
        
        getUserById,
        getQuestionAnswersCount,
        viewProfile,
        viewQuestion,
        triggerNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
