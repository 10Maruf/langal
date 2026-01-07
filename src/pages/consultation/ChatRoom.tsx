import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Loader2,
  CheckCheck,
  Check,
  X,
  Camera,
  File,
} from "lucide-react";
import {
  getConversationMessages,
  sendMessage,
  Message,
  getAppointmentById,
  Appointment,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatRoom = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (appointmentId) {
      fetchData();
      // Poll for new messages every 5 seconds
      pollIntervalRef.current = setInterval(fetchMessages, 5000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentRes, messagesRes] = await Promise.all([
        getAppointmentById(parseInt(appointmentId!)),
        getConversationMessages(parseInt(appointmentId!)),
      ]);

      if (appointmentRes.success) {
        setAppointment(appointmentRes.data);
      }

      if (messagesRes.success) {
        // Handle paginated response - messages are in data.data for paginated or data for non-paginated
        const messagesArray = Array.isArray(messagesRes.data)
          ? messagesRes.data
          : (messagesRes.data?.data || []);
        // Reverse to show oldest first (API returns newest first)
        setMessages(messagesArray.reverse());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({
        title: "ত্রুটি",
        description: "তথ্য লোড করতে ব্যর্থ হয়েছে",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await getConversationMessages(parseInt(appointmentId!));
      if (response.success) {
        // Handle paginated response - messages are in data.data for paginated or data for non-paginated
        const messagesArray = Array.isArray(response.data)
          ? response.data
          : (response.data?.data || []);
        // Reverse to show oldest first (API returns newest first)
        setMessages(messagesArray.reverse());
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const response = await sendMessage(parseInt(appointmentId!), {
        content: newMessage.trim(),
        message_type: "text",
      });

      if (response.success) {
        setNewMessage("");
        fetchMessages();
      } else {
        toast({
          title: "ত্রুটি",
          description: response.message || "মেসেজ পাঠাতে ব্যর্থ হয়েছে",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "ত্রুটি",
        description: "সার্ভারে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (file: File, type: "image" | "document") => {
    try {
      setSending(true);
      const formData = new FormData();
      formData.append("content", type === "image" ? "📷 ছবি" : "📎 ফাইল");
      formData.append("message_type", type);
      formData.append("media", file);

      const response = await sendMessage(parseInt(appointmentId!), formData);
      if (response.success) {
        fetchMessages();
      } else {
        toast({
          title: "ত্রুটি",
          description: "ফাইল পাঠাতে ব্যর্থ হয়েছে",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "ত্রুটি",
        description: "সার্ভারে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      setShowAttachMenu(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("bn-BD", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isMyMessage = (message: Message) => {
    return message.sender_id === parseInt(user?.id || '0') || message.sender_id === user?.user_id;
  };

  const getOtherParty = (): { name?: string; avatarUrl?: string } | null => {
    if (!appointment) return null;
    const isExpert = user?.type === "expert";
    if (isExpert) {
      // Farmer side - get farmer's profile
      const profile = appointment.farmer?.profile;
      return {
        name: profile?.full_name,
        avatarUrl: profile?.profile_photo_url_full || profile?.profile_photo_url || profile?.avatar_url
      };
    }
    // Expert side - expert relation returns User model, so expert.profile works
    const profile = appointment.expert?.profile;
    return {
      name: profile?.full_name,
      avatarUrl: profile?.profile_photo_url_full || profile?.profile_photo_url || profile?.avatar_url
    };
  };

  const otherParty = getOtherParty();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-20 pt-24">
          <Loader2 className="h-10 w-10 text-green-600 animate-spin mb-3" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Chat Header */}
      <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-green-700"
          onClick={() => navigate(-1)}
        >
          <X className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10 border-2 border-white/30">
          <AvatarImage
            src={getProfilePhotoUrl(otherParty?.avatarUrl)}
          />
          <AvatarFallback className="bg-green-500 text-white">
            {otherParty?.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="font-semibold">
            {otherParty?.name || "অজানা"}
          </h2>
          <p className="text-xs text-green-100">
            {appointment?.expert?.specialization_bn || "অনলাইন"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {appointment?.consultation_type !== "chat" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-green-700"
                onClick={() => navigate(`/consultation/call/${appointmentId}`)}
              >
                <Phone className="h-5 w-5" />
              </Button>
              {appointment?.consultation_type === "video" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-green-700"
                  onClick={() => navigate(`/consultation/call/${appointmentId}`)}
                >
                  <Video className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/consultation/appointment/${appointmentId}`)}>
                অ্যাপয়েন্টমেন্ট বিস্তারিত
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/consultation/expert/${appointment?.expert?.user_id}`)}>
                বিশেষজ্ঞ প্রোফাইল
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">এখনও কোন মেসেজ নেই</p>
            <p className="text-gray-400 text-sm mt-1">কথোপকথন শুরু করুন!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.message_id}
              className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMyMessage(message)
                  ? "bg-green-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
              >
                {/* Image Message */}
                {message.message_type === "image" && message.media_url && (
                  <div className="mb-2">
                    <img
                      src={message.media_url}
                      alt="Shared image"
                      className="rounded-lg max-w-full max-h-60 object-cover cursor-pointer"
                      onClick={() => window.open(message.media_url, "_blank")}
                    />
                  </div>
                )}

                {/* Document Message */}
                {message.message_type === "document" && message.media_url && (
                  <a
                    href={message.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 mb-2 p-2 rounded-lg ${isMyMessage(message) ? "bg-green-700" : "bg-gray-100"
                      }`}
                  >
                    <File className="h-8 w-8" />
                    <span className="text-sm">ফাইল দেখুন</span>
                  </a>
                )}

                {/* Text Content */}
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}

                {/* Time & Status */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 ${isMyMessage(message) ? "text-green-100" : "text-gray-400"
                    }`}
                >
                  <span className="text-xs">{formatMessageTime(message.created_at)}</span>
                  {isMyMessage(message) && (
                    message.is_read ? (
                      <CheckCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3 sticky bottom-0">
        <div className="flex items-center gap-2">
          {/* Attachment Button */}
          <DropdownMenu open={showAttachMenu} onOpenChange={setShowAttachMenu}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-600">
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4 text-blue-500" />
                ছবি পাঠান
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <File className="h-4 w-4 text-amber-500" />
                ফাইল পাঠান
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-green-500" />
                ক্যামেরা
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, "image");
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, "document");
            }}
          />

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              placeholder="মেসেজ লিখুন..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10 rounded-full bg-gray-100 border-0 focus-visible:ring-green-500"
            />
          </div>

          {/* Send Button */}
          <Button
            size="icon"
            className="bg-green-600 hover:bg-green-700 rounded-full h-10 w-10"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
