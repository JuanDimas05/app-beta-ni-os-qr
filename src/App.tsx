import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfilesView } from './components/ProfilesView';
import { QRExportView } from './components/QRExportView';
import { PublicScanView } from './components/PublicScanView';
import { CommunityView } from './components/CommunityView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { ChildProfileFormModal } from './components/ChildProfileFormModal';
import { AuthModal } from './components/AuthModal';
import { ChildProfile, ForumPost, ChatMessage, UserAccount } from './types/tea';
import { INITIAL_CHILDREN, FORUM_CATEGORIES, INITIAL_POSTS, INITIAL_CHAT_MESSAGES } from './data/mockData';

export default function App() {
  // Current logged in user (parent/tutor)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('conectatea_user');
      return saved ? JSON.parse(saved) : {
        id: 'parent_usr_elena',
        name: 'Elena Ruiz',
        email: 'elena.ruiz@ejemplo.com',
        role: 'Mamá de Mateo y Sofi',
        phone: '+52 55 9182 3456',
        verifiedEmail: true,
        createdAt: '2026-03-15T10:00:00Z'
      };
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load persistent children or defaults
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    try {
      const saved = localStorage.getItem('conectatea_children');
      return saved ? JSON.parse(saved) : INITIAL_CHILDREN;
    } catch {
      return INITIAL_CHILDREN;
    }
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => {
    return childrenList[0]?.id || '';
  });

  const [currentTab, setCurrentTab] = useState<'profiles' | 'qr_export' | 'community' | 'public_scan' | 'architecture'>('profiles');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<ChildProfile | null>(null);

  // Forum and chat state
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('conectatea_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('conectatea_chat');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Check URL parameters for direct public scan link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam === 'public_scan') {
      setCurrentTab('public_scan');
      if (idParam) {
        const found = childrenList.find(c => c.qrCodeId === idParam);
        if (found) {
          setActiveChildId(found.id);
        }
      }
    }
  }, [childrenList]);

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('conectatea_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('conectatea_user');
      }
    } catch (e) {
      console.warn('User storage error:', e);
    }
  }, [currentUser]);

  // Persist children to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('conectatea_children', JSON.stringify(childrenList));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [childrenList]);

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem('conectatea_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [posts]);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem('conectatea_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [chatMessages]);

  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0] || null;

  // Handlers for profile
  const handleSaveChildProfile = (profile: ChildProfile) => {
    const existingIndex = childrenList.findIndex(c => c.id === profile.id);
    if (existingIndex >= 0) {
      const updated = [...childrenList];
      updated[existingIndex] = profile;
      setChildrenList(updated);
    } else {
      setChildrenList([...childrenList, profile]);
      setActiveChildId(profile.id);
    }
  };

  const handleEditChild = (child: ChildProfile) => {
    setChildToEdit(child);
    setIsFormModalOpen(true);
  };

  const handleAddNewChild = () => {
    setChildToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleToggleEmergencyAlert = (childIdToToggle?: string) => {
    const targetId = childIdToToggle || activeChild?.id;
    if (!targetId) return;

    setChildrenList(prev => prev.map(child => {
      if (child.id === targetId) {
        return {
          ...child,
          isAlertActive: !child.isAlertActive
        };
      }
      return child;
    }));
  };

  // Handlers for Forum & Chat
  const handleAddPost = (newPostData: Omit<ForumPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'comments'>) => {
    const newPost: ForumPost = {
      ...newPostData,
      id: 'post_' + Date.now(),
      createdAt: 'Justo ahora',
      likesCount: 1,
      commentsCount: 0,
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likesCount: p.likesCount + 1 };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [
            ...p.comments,
            {
              id: 'c_' + Date.now(),
              postId,
              authorId: 'usr_me',
              authorName: 'Elena Ruiz (Tú)',
              authorRole: 'Mamá de Mateo (7 años)',
              content: commentText,
              createdAt: 'Justo ahora',
              likesCount: 0
            }
          ]
        };
      }
      return p;
    }));
  };

  const handleSendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: 'usr_me',
      senderName: 'Elena Ruiz (Tú)',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulated empathetic response after 1.5s
    setTimeout(() => {
      const automatedReplies = [
        '¡Un abrazo enorme! La paciencia y las rutinas predecibles marcan una diferencia enorme.',
        'Nos pasó exactamente igual el mes pasado. Si necesitas el contacto del centro de integración sensorial, avísame.',
        'Mucho ánimo, no están solos en este camino. La comunidad siempre está para apoyarnos.'
      ];
      const randomReply = automatedReplies[Math.floor(Math.random() * automatedReplies.length)];

      const communityMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        senderId: 'usr_community_bot',
        senderName: 'Marcos V. (Papá de Tomás)',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(curr => [...curr, communityMsg]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeChild={activeChild}
        toggleEmergencyAlert={() => handleToggleEmergencyAlert()}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'profiles' && (
          <ProfilesView
            childrenList={childrenList}
            activeChild={activeChild}
            setActiveChild={(child) => setActiveChildId(child.id)}
            onEditChild={handleEditChild}
            onAddNewChild={handleAddNewChild}
            onNavigateToQR={(child) => {
              setActiveChildId(child.id);
              setCurrentTab('qr_export');
            }}
            onNavigateToScan={(child) => {
              setActiveChildId(child.id);
              setCurrentTab('public_scan');
            }}
            onToggleAlert={handleToggleEmergencyAlert}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'qr_export' && activeChild && (
          <QRExportView
            child={activeChild}
            childrenList={childrenList}
            onSelectChild={(c) => setActiveChildId(c.id)}
            onOpenPublicScan={(c) => {
              setActiveChildId(c.id);
              setCurrentTab('public_scan');
            }}
          />
        )}

        {currentTab === 'public_scan' && activeChild && (
          <PublicScanView
            child={activeChild}
            onBackToApp={() => setCurrentTab('profiles')}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            categories={FORUM_CATEGORIES}
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            chatMessages={chatMessages}
            onSendChatMessage={handleSendChatMessage}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'architecture' && (
          <ArchitectureDocsView />
        )}
      </main>

      {/* Edit or Add Child Profile Modal */}
      <ChildProfileFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setChildToEdit(null);
        }}
        onSave={handleSaveChildProfile}
        initialProfile={childToEdit}
        currentParent={currentUser}
      />

      {/* Parental Authentication / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* Subtle Footer conforming to Anti-Slop Discipline */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">ConectaTEA</span>
            <span aria-hidden="true">·</span>
            <span>Seguridad y Red de Crianza para Familias con TEA</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Cumplimiento RGPD & COPPA Infantil</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('architecture')}
              className="text-teal-700 hover:underline"
            >
              Arquitectura & Esquema de Datos
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
