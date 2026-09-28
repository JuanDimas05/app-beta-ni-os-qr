import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Search, 
  Plus, 
  CheckCircle, 
  Send, 
  Filter, 
  Sparkles, 
  Smile, 
  ShieldCheck,
  ChevronRight,
  Pin,
  X
} from 'lucide-react';
import { ForumPost, ForumCategory, ForumComment, ChatMessage, UserAccount } from '../types/tea';

interface CommunityViewProps {
  categories: ForumCategory[];
  posts: ForumPost[];
  onAddPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount' | 'comments'>) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  chatMessages: ChatMessage[];
  onSendChatMessage: (text: string) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  categories,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  chatMessages,
  onSendChatMessage,
  currentUser,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'chat'>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('cat_crianza');
  const [newPostTags, setNewPostTags] = useState('Consejos, Apoyo');
  const [chatInput, setChatInput] = useState('');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.categoryId === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    onAddPost({
      categoryId: newPostCategory,
      authorId: currentUser.id,
      authorName: `${currentUser.name} (Tú)`,
      authorRole: currentUser.role,
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      tags: newPostTags.split(',').map(t => t.trim()).filter(Boolean),
    });

    setNewPostTitle('');
    setNewPostContent('');
    setIsNewPostModalOpen(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    onAddComment(selectedPost.id, newCommentText.trim());
    setNewCommentText('');
    
    // Update local selected post view
    const updatedPost = posts.find(p => p.id === selectedPost.id);
    if (updatedPost) {
      setSelectedPost({
        ...updatedPost,
        commentsCount: updatedPost.commentsCount + 1,
        comments: [
          ...updatedPost.comments,
          {
            id: 'c_' + Date.now(),
            postId: selectedPost.id,
            authorId: currentUser.id,
            authorName: `${currentUser.name} (Tú)`,
            authorRole: currentUser.role,
            content: newCommentText.trim(),
            createdAt: 'Justo ahora',
            likesCount: 0
          }
        ]
      });
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold tracking-wide uppercase">
            <Users className="w-4 h-4" />
            <span>Espacio Seguro & Red de Apoyo Mutuo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
            Comunidad de Familias TEA
          </h1>
          <p className="text-xs text-slate-500 max-w-xl mt-0.5">
            Comparte estrategias de regulación, recomendaciones de terapeutas, adaptaciones escolares y apoyo emocional entre cuidadores.
          </p>
        </div>

        {/* Tab switch between Forum and Live Chat */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('forum')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'forum'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Foros Temáticos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chat de Familias
          </button>
        </div>
      </div>

      {activeTab === 'forum' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Categories and Search (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar temas, PEI, sensorial..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span>Categorías de Debate</span>
                <span>Temas</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Todas las categorías</span>
                <span className="text-[11px] text-slate-400">{posts.length}</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="pr-2">
                    <span className="block font-medium">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{cat.description}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{cat.postCount}</span>
                </button>
              ))}
            </div>

            {/* Safety guidelines badge */}
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-xs text-teal-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Normas de Convivencia</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Espacio regulado para familias y terapeutas. No se permite compartir diagnósticos médicos definitivos ni datos privados sin consentimiento.
              </p>
            </div>
          </div>

          {/* Right Column: Posts List or Selected Post Detail (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">
                Mostrando {filteredPosts.length} publicaciones
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Pregunta o Aporte</span>
              </button>
            </div>

            {/* Post cards */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Pin className="w-3 h-3" /> Fijado por la comunidad
                          </span>
                        )}
                        <span className="text-xs text-slate-400">{post.createdAt}</span>
                      </div>

                      <h2 className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors font-display">
                        {post.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Clean unboxed tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{post.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400 text-[11px]">{post.authorRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-teal-700 font-medium">#{post.tags.join(' #')}</span>
                  </div>

                  {/* Card footer: Likes, comments */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikePost(post.id);
                        }}
                        className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        <span className="font-mono">{post.likesCount} apoyos</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span className="font-mono">{post.commentsCount} respuestas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-teal-700 font-semibold hover:underline">
                      <span>Ver debate</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* LIVE CHAT ROOM VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
          {/* Chat room top header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Sala de Conversación Directa entre Padres
                </h3>
                <span className="text-[11px] text-slate-500">
                  Respuestas inmediatas para dudas urgentes de crianza o terapias
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">18 familias conectadas</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.senderName.includes('(Tú)')
                    ? 'ml-auto items-end'
                    : 'mr-auto items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{msg.senderName}</span>
                  <span>·</span>
                  <span className="font-mono text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.senderName.includes('(Tú)')
                      ? 'bg-teal-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input box */}
          <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe tu mensaje a la comunidad de padres..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* MODAL: POST DETAIL & REPLIES */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Debate en Foro
              </span>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-800">{selectedPost.authorName}</span>
                  <span>·</span>
                  <span className="text-[11px] text-slate-400">{selectedPost.authorRole}</span>
                  <span>·</span>
                  <span>{selectedPost.createdAt}</span>
                </div>
                <p className="text-xs text-slate-700 mt-3 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {selectedPost.content}
                </p>
              </div>

              {/* Comments Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Respuestas de la Comunidad ({selectedPost.comments.length})
                </h3>

                <div className="space-y-3">
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{comment.authorName}</span>
                          <span className="text-[11px] text-slate-400">({comment.authorRole})</span>
                          {comment.isHelpfulVerified && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> Especialista
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{comment.createdAt}</span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escribe tu recomendación o apoyo..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Responder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW POST */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Publicar Consulta o Recurso en la Comunidad
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Título de la consulta o recomendación *
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Ej: ¿Consejos para corte de cabello sensorialmente amigable?"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Detalles o Experiencia *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe la situación, edad de tu hijo/a y qué apoyos han probado..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="Sensorial, Escuela, Terapia, Rutinas"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm"
                >
                  Publicar en el Foro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
