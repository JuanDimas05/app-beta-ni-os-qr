import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { ProfilesView } from './components/ProfilesView';
import { QRExportView } from './components/QRExportView';
import { PublicScanView } from './components/PublicScanView';
import { CommunityView } from './components/CommunityView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';
import { ChildProfileFormModal } from './components/ChildProfileFormModal';
import { AuthModal } from './components/AuthModal';
import { AuthScreen } from './components/AuthScreen';
import { ChildProfile, ForumPost, ChatMessage, UserAccount } from './types/tea';
import { INITIAL_CHILDREN, FORUM_CATEGORIES, INITIAL_POSTS, INITIAL_CHAT_MESSAGES } from './data/mockData';

export default function App() {
  // Current logged in user (parent/tutor) - starts strictly as null (no auto-login)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const isSessionActive = localStorage.getItem('conectatea_session_active');
      const saved = localStorage.getItem('conectatea_user');
      if (isSessionActive === 'true' && saved) {
        return JSON.parse(saved);
      }
      return null;
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

  const [qrCodeNotFound, setQrCodeNotFound] = useState(false);

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
        const found = childrenList.find(c => c.qrCodeId === idParam || c.id === idParam);
        if (found) {
          setActiveChildId(found.id);
          setQrCodeNotFound(false);
        } else {
          setQrCodeNotFound(true);
        }
      } else {
        setQrCodeNotFound(false);
      }
    }
  }, [childrenList]);

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('conectatea_user', JSON.stringify(currentUser));
        localStorage.setItem('conectatea_session_active', 'true');
      } else {
        localStorage.removeItem('conectatea_user');
        localStorage.removeItem('conectatea_session_active');
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

  // If user is not logged in, enforce Login / Register screen obligatorily
  if (!currentUser) {
    if (currentTab === 'public_scan') {
      if (qrCodeNotFound) {
        return (
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    TEA
                  </div>
                  <span className="text-sm font-bold text-slate-900 font-display">
                    ConectaTEA · Verificación QR
                  </span>
                </div>
                <button
                  onClick={() => setCurrentTab('profiles')}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  Acceso Padres / Registro
                </button>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">Código QR No Encontrado</h2>
                <p className="text-xs text-slate-600 mb-6">
                  El código escaneado no corresponde a ningún menor activo o el enlace fue desactivado. Por estrictos protocolos de privacidad de menores, no es posible explorar otros perfiles.
                </p>
                <button
                  onClick={() => setCurrentTab('profiles')}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Ir al Acceso de Padres / Registro
                </button>
              </div>
            </main>
          </div>
        );
      }

      if (activeChild) {
        return (
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    TEA
                  </div>
                  <span className="text-sm font-bold text-slate-900 font-display">
                    ConectaTEA · Ficha de Auxilio Público
                  </span>
                </div>
                <button
                  onClick={() => setCurrentTab('profiles')}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  Acceso Padres / Registro
                </button>
              </div>
            </header>

            <main className="flex-1 p-2 sm:p-4">
              <PublicScanView
                child={activeChild}
                onBackToApp={() => setCurrentTab('profiles')}
                currentUser={null}
              />
            </main>
          </div>
        );
      }
    }

    return (
      <AuthScreen
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentTab('profiles');
        }}
        onOpenPublicScanDemo={() => {
          setCurrentTab('public_scan');
        }}
      />
    );
  }

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
        onLogout={() => {
          setCurrentUser(null);
          setCurrentTab('profiles');
        }}
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
            currentUser={currentUser}
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
