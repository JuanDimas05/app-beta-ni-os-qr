import React, { useState, useEffect } from 'react';
import { AlertCircle, QrCode, Plus, Eye } from 'lucide-react';
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
import { FORUM_CATEGORIES, INITIAL_POSTS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { 
  getCurrentSession, 
  getChildrenForUser, 
  saveChildrenForUser, 
  deleteChildFromCloud,
  logoutSession,
  findChildByQR,
  findChildByQRAsync,
  DEMO_USER
} from './utils/authStorage';
import { subscribeUserChildren } from './firebase';

export default function App() {
  // Current logged in user (parent/tutor) - begins with current session or null
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return getCurrentSession();
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load children profiles strictly belonging to current user (clean [] for any new account)
  const [childrenList, setChildrenList] = useState<ChildProfile[]>(() => {
    const session = getCurrentSession();
    return getChildrenForUser(session);
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => {
    const list = getChildrenForUser(getCurrentSession());
    return list[0]?.id || '';
  });

  const [publicScannedChild, setPublicScannedChild] = useState<ChildProfile | null>(null);

  const [currentTab, setCurrentTab] = useState<'profiles' | 'qr_export' | 'community' | 'public_scan' | 'architecture'>('profiles');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [childToEdit, setChildToEdit] = useState<ChildProfile | null>(null);

  const [qrCodeNotFound, setQrCodeNotFound] = useState(false);

  // Forum and chat state
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    try {
      const saved = localStorage.getItem('sisu_posts') || localStorage.getItem('conectatea_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sisu_chat') || localStorage.getItem('conectatea_chat');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Whenever currentUser changes (login, register, logout), load only THAT user's children
  // and attach real-time Firestore listener for multi-device sync
  useEffect(() => {
    if (!currentUser) {
      setChildrenList([]);
      setActiveChildId('');
      return;
    }

    // 1. Initial fast load from local user cache
    const userChildren = getChildrenForUser(currentUser);
    setChildrenList(userChildren);
    setActiveChildId(userChildren[0]?.id || '');

    // 2. Real-time Firestore sync for multi-device sync (excluding static local demo)
    if (currentUser.id !== DEMO_USER.id) {
      const unsubscribe = subscribeUserChildren(
        currentUser.id,
        (cloudChildren) => {
          if (cloudChildren && cloudChildren.length > 0) {
            setChildrenList(cloudChildren);
            setActiveChildId((prev) => {
              if (cloudChildren.some((c) => c.id === prev)) return prev;
              return cloudChildren[0]?.id || '';
            });
            // Update local cache
            try {
              localStorage.setItem(`sisu_children_${currentUser.id}`, JSON.stringify(cloudChildren));
            } catch (e) {
              console.warn('Cache error:', e);
            }
          }
        },
        (error) => {
          console.warn('[Firestore] Realtime subscription notice:', error);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser?.id]);

  // Check URL parameters for direct public scan link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const idParam = params.get('id');

    if (viewParam === 'public_scan') {
      setCurrentTab('public_scan');
      if (idParam) {
        const localFound = childrenList.find(c => c.qrCodeId === idParam || c.id === idParam) || findChildByQR(idParam);
        if (localFound) {
          setPublicScannedChild(localFound);
          setActiveChildId(localFound.id);
          setQrCodeNotFound(false);
        } else {
          // Cloud query in Firestore qr_registry so emergency scans work from ANY device or phone!
          findChildByQRAsync(idParam).then(remoteFound => {
            if (remoteFound) {
              setPublicScannedChild(remoteFound);
              setActiveChildId(remoteFound.id);
              setQrCodeNotFound(false);
            } else {
              setPublicScannedChild(null);
              setQrCodeNotFound(true);
            }
          });
        }
      } else {
        setPublicScannedChild(null);
        setQrCodeNotFound(true);
      }
    }
  }, [childrenList]);

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem('sisu_posts', JSON.stringify(posts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [posts]);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem('sisu_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [chatMessages]);

  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0] || null;

  // Handlers for profile
  const handleSaveChildProfile = (profile: ChildProfile) => {
    const profileWithParent: ChildProfile = {
      ...profile,
      parentId: currentUser?.id || profile.parentId || 'parent_custom'
    };

    const existingIndex = childrenList.findIndex(c => c.id === profile.id);
    let updated: ChildProfile[];
    if (existingIndex >= 0) {
      updated = [...childrenList];
      updated[existingIndex] = profileWithParent;
    } else {
      updated = [...childrenList, profileWithParent];
    }

    setChildrenList(updated);
    setActiveChildId(profileWithParent.id);

    if (currentUser) {
      saveChildrenForUser(currentUser, updated);
    }
  };

  const handleDeleteChildProfile = (childId: string) => {
    const childToDelete = childrenList.find(c => c.id === childId);
    const updated = childrenList.filter(c => c.id !== childId);
    setChildrenList(updated);
    if (activeChildId === childId) {
      setActiveChildId(updated[0]?.id || '');
    }
    if (currentUser) {
      saveChildrenForUser(currentUser, updated);
      deleteChildFromCloud(currentUser, childId, childToDelete?.qrCodeId);
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

    const updated = childrenList.map(child => {
      if (child.id === targetId) {
        return {
          ...child,
          isAlertActive: !child.isAlertActive
        };
      }
      return child;
    });

    setChildrenList(updated);
    if (currentUser) {
      saveChildrenForUser(currentUser, updated);
    }
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
              authorId: currentUser?.id || 'usr_me',
              authorName: currentUser ? `${currentUser.name} (Tú)` : 'Tutor (Tú)',
              authorRole: currentUser?.role || 'Familiar / Tutor',
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
      senderId: currentUser?.id || 'usr_me',
      senderName: currentUser ? `${currentUser.name} (Tú)` : 'Tutor (Tú)',
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
                    SISU · Verificación QR
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

      const displayChild = publicScannedChild || activeChild;
      if (displayChild) {
        return (
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    TEA
                  </div>
                  <span className="text-sm font-bold text-slate-900 font-display">
                    SISU · Ficha de Auxilio Público
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
                child={displayChild}
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
      />
    );
  }

  const childForPublicScan = publicScannedChild || activeChild;

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
          logoutSession();
          setCurrentUser(null);
          setChildrenList([]);
          setActiveChildId('');
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
            onDeleteChild={handleDeleteChildProfile}
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

        {currentTab === 'qr_export' && (
          activeChild ? (
            <QRExportView
              child={activeChild}
              childrenList={childrenList}
              onSelectChild={(c) => setActiveChildId(c.id)}
              onOpenPublicScan={(c) => {
                setActiveChildId(c.id);
                setCurrentTab('public_scan');
              }}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
                No tienes perfiles para generar código QR
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Para imprimir pulseras de silicona o parches termoadhesivos de auxilio, primero registra el perfil de un menor en tu cuenta.
              </p>
              <button
                onClick={handleAddNewChild}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Primer Menor</span>
              </button>
            </div>
          )
        )}

        {currentTab === 'public_scan' && (
          childForPublicScan ? (
            <PublicScanView
              child={childForPublicScan}
              onBackToApp={() => setCurrentTab('profiles')}
              currentUser={currentUser}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
                Sin Ficha Pública Activa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Aún no tienes menores registrados para simular la vista pública de emergencia que verían quienes escaneen el QR.
              </p>
              <button
                onClick={handleAddNewChild}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Primer Menor</span>
              </button>
            </div>
          )
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

      {/* Subtle Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">SISU</span>
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
