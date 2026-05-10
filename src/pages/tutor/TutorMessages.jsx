// src/pages/tutor/TutorMessages.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

export default function TutorMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ Scroll — pas de setState, pas de problème
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await api.get("/tutor/conversations");
      setConversations(response.data);
      if (response.data.length > 0) {
        setSelectedConversation(response.data[0]);
      }
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
      const mockConversations = [
        {
          id: 1,
          name: "Julianne V.",
          role: "student",
          lastMessage: "Sent you the Thesis Draft.pdf",
          lastMessageTime: "10:42 AM",
          avatar: null,
          online: true,
          unread: 2,
        },
        {
          id: 2,
          name: "Prof. Aristhène",
          role: "faculty",
          lastMessage: "Regarding the seminar next week...",
          lastMessageTime: "Yesterday",
          avatar: null,
          online: false,
        },
        {
          id: 3,
          name: "Marc-Louis",
          role: "faculty",
          lastMessage: "Looking forward to the peer review.",
          lastMessageTime: "Oct 22",
          avatar: "ML",
          online: false,
        },
      ];
      setConversations(mockConversations);
      setSelectedConversation(mockConversations[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId) => {
    try {
      const response = await api.get(`/tutor/conversations/${conversationId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
      const mockMessages = [
        {
          id: 1,
          senderId: 2,
          senderName: "Julianne V.",
          content: "Hello Professor, I've just uploaded the updated draft for the Comparative Literature thesis. Could you please check the citations in Section 3?",
          timestamp: "2024-10-24T10:41:00",
          type: "text",
        },
        {
          id: 2,
          senderId: 2,
          senderName: "Julianne V.",
          content: "Thesis_Draft_V4.pdf",
          timestamp: "2024-10-24T10:42:00",
          type: "file",
          fileUrl: "#",
          fileSize: "2.4 MB",
        },
        {
          id: 3,
          senderId: user?.id || 1,
          senderName: "Me",
          content: "Thank you Julianne. I will review it during my office hours this afternoon and provide feedback by tomorrow morning.",
          timestamp: "2024-10-24T10:45:00",
          type: "text",
        },
      ];
      setMessages(mockMessages);
    }
  }, [user?.id]);

  // ✅ Charger les conversations
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!cancelled) await fetchConversations();
    };
    load();
    return () => { cancelled = true; };
  }, [fetchConversations]);

  // ✅ Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (!selectedConversation) return;
    let cancelled = false;
    const load = async () => {
      if (!cancelled) await fetchMessages(selectedConversation.id);
    };
    load();
    return () => { cancelled = true; };
  }, [selectedConversation, fetchMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSending(true);
    try {
      const response = await api.post(
        `/tutor/conversations/${selectedConversation.id}/messages`,
        { content: newMessage }
      );
      setMessages(prev => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Erreur envoi message:", error);
      const tempMessage = {
        id: Date.now(),
        senderId: user?.id || 1,
        senderName: "Me",
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: "text",
      };
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date >= today) {
      return date.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    } else if (date >= yesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("fr", { day: "numeric", month: "short" });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden">
      {/* Contact List Sidebar */}
      <section className="w-96 border-r border-gray-100 bg-white flex flex-col shadow-[4px_0_20px_0_rgba(30,64,175,0.03)] z-10">
        <div className="p-6 space-y-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-primary font-['Noto_Serif']">
              Conversations
            </h2>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white shadow-lg hover:scale-105 transition-transform">
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl pl-10 py-3 text-body-md focus:ring-2 focus:ring-primary-container transition-shadow"
              placeholder="Search students or faculty..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="px-6 py-4 bg-surface-container-lowest sticky top-0 z-10">
            <span className="text-caption text-outline font-bold tracking-widest uppercase">
              Active Students
            </span>
          </div>
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors ${
                selectedConversation?.id === conv.id
                  ? "bg-blue-50/30 border-l-4 border-primary"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                {conv.avatar ? (
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg">
                    {conv.avatar}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-lg">
                    {conv.name.charAt(0)}
                  </div>
                )}
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-on-background truncate">{conv.name}</h4>
                  <span className="text-caption text-outline text-xs">{conv.lastMessageTime}</span>
                </div>
                <p className="text-caption text-secondary truncate text-xs">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Chat Area */}
      {selectedConversation ? (
        <section className="flex-1 flex flex-col bg-white">
          <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                  {selectedConversation.name.charAt(0)}
                </div>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 leading-tight">{selectedConversation.name}</h3>
                <p className="text-caption text-green-600 font-bold text-xs">
                  {selectedConversation.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">videocam</span>
              </button>
              <button className="p-2 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">call</span>
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              <button className="p-2 text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/30 hide-scrollbar">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.id;
              const showDateSeparator =
                index === 0 ||
                new Date(message.timestamp).toDateString() !==
                  new Date(messages[index - 1]?.timestamp).toDateString();
              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="px-4 py-1 rounded-full bg-white text-caption text-outline text-xs shadow-sm border border-gray-50">
                        {new Date(message.timestamp).toDateString() === new Date().toDateString()
                          ? "Today"
                          : new Date(message.timestamp).toLocaleDateString("fr", {
                              day: "numeric",
                              month: "long",
                            })}
                      </span>
                    </div>
                  )}
                  {message.type === "file" ? (
                    <div className={`flex items-end gap-3 max-w-[70%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}>
                      {!isCurrentUser && <div className="w-8"></div>}
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group cursor-pointer hover:border-primary-container transition-all">
                        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-on-background text-sm">{message.content}</p>
                          <p className="text-caption text-outline text-xs">{message.fileSize} • PDF Document</p>
                        </div>
                        <span className="material-symbols-outlined text-outline group-hover:text-primary">download</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`flex items-end gap-3 max-w-[70%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}>
                      {!isCurrentUser && (
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs">
                          {selectedConversation.name.charAt(0)}
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className={`p-3 rounded-xl ${
                          isCurrentUser
                            ? "bg-primary text-white rounded-br-none shadow-[0_10px_20px_rgba(0,40,142,0.15)]"
                            : "bg-white rounded-bl-none shadow-sm border border-gray-100"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className={`text-caption text-outline text-xs ${isCurrentUser ? "block text-right" : "block ml-1"}`}>
                          {formatTime(message.timestamp)}
                          {isCurrentUser && " • Delivered"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <footer className="p-6 bg-white border-t border-gray-100">
            <div className="bg-surface-container-low rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:border-primary-container focus-within:shadow-lg transition-all">
              <button className="p-3 text-outline hover:text-primary hover:bg-white rounded-xl transition-all">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button className="p-3 text-outline hover:text-primary hover:bg-white rounded-xl transition-all">
                <span className="material-symbols-outlined">mood</span>
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none focus:ring-0 text-body-md px-2 placeholder:text-outline/60 focus:outline-none"
                placeholder={`Type your message to ${selectedConversation.name}...`}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="bg-primary text-white p-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
            <div className="flex justify-between mt-2 px-2">
              <div className="flex gap-4">
                <span className="text-caption text-outline text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">keyboard_command_key</span>
                  + Enter to send
                </span>
              </div>
              <div className="flex gap-4">
                <button className="text-caption text-outline text-xs hover:text-primary font-bold uppercase tracking-wider">
                  Schedule Message
                </button>
              </div>
            </div>
          </footer>
        </section>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300">chat</span>
            <p className="mt-4 text-gray-500">Sélectionnez une conversation</p>
          </div>
        </div>
      )}

      {/* Contextual Info Panel */}
      {selectedConversation && (
        <section className="w-80 border-l border-gray-100 bg-white hidden xl:flex flex-col">
          <div className="p-6 text-center border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4 border-4 border-surface-container shadow-xl">
              {selectedConversation.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-on-background font-['Noto_Serif']">
              {selectedConversation.name}
            </h3>
            <p className="text-caption text-outline text-xs">
              {selectedConversation.role === "student" ? "Master of Arts, Literature" : "Faculty Member"}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                {selectedConversation.role === "student" ? "Student" : "Professor"}
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                Year 2
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
            <div>
              <h4 className="font-semibold text-outline uppercase tracking-widest text-xs mb-4">Quick Info</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                  <div>
                    <p className="text-caption text-outline text-xs">Thesis Supervisor</p>
                    <p className="font-semibold text-on-background text-sm">Dr. Marc-Louis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                  <div>
                    <p className="text-caption text-outline text-xs">Last Activity</p>
                    <p className="font-semibold text-on-background text-sm">
                      {selectedConversation.online ? "Online" : "2 minutes ago"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-outline uppercase tracking-widest text-xs">Shared Files</h4>
                <button className="text-caption text-primary text-xs font-bold">See all</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-semibold text-on-background truncate text-xs">Reading_List.pdf</p>
                    <p className="text-[10px] text-outline">Oct 12, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-100">
            <button className="w-full py-3 rounded-xl border-2 border-error/20 text-error font-bold text-caption hover:bg-error/5 transition-colors uppercase tracking-widest text-xs">
              Mute Notifications
            </button>
          </div>
        </section>
      )}
    </main>
  );
}