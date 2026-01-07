import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  MessageCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getAppointmentById,
  Appointment,
  startCall,
  endCall,
  Call,
} from "@/services/consultationService";
import { getProfilePhotoUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Agora RTC types (will be loaded dynamically)
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    AgoraRTC: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const VideoCallPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [callData, setCallData] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Media controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Agora client and tracks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localTracksRef = useRef<{ audioTrack: any; videoTrack: any }>({
    audioTrack: null,
    videoTrack: null,
  });
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  useEffect(() => {
    if (connected) {
      durationIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [connected]);

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await getAppointmentById(parseInt(appointmentId!));
      if (response.success) {
        setAppointment(response.data);
      } else {
        setError("অ্যাপয়েন্টমেন্ট তথ্য লোড করতে ব্যর্থ হয়েছে");
      }
    } catch (err) {
      console.error("Error fetching appointment:", err);
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const initializeAgora = async () => {
    try {
      // Load Agora SDK dynamically
      if (!window.AgoraRTC) {
        const script = document.createElement("script");
        script.src = "https://download.agora.io/sdk/release/AgoraRTC_N.js";
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Create client
      clientRef.current = window.AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      // Set up event handlers
      clientRef.current.on("user-published", handleUserPublished);
      clientRef.current.on("user-unpublished", handleUserUnpublished);
      clientRef.current.on("user-left", handleUserLeft);

      return true;
    } catch (err) {
      console.error("Error initializing Agora:", err);
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUserPublished = async (remoteUser: any, mediaType: string) => {
    await clientRef.current.subscribe(remoteUser, mediaType);

    if (mediaType === "video") {
      const remoteVideoTrack = remoteUser.videoTrack;
      if (remoteVideoRef.current) {
        remoteVideoTrack.play(remoteVideoRef.current);
      }
    }

    if (mediaType === "audio") {
      const remoteAudioTrack = remoteUser.audioTrack;
      remoteAudioTrack.play();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUserUnpublished = (remoteUser: any, mediaType: string) => {
    if (mediaType === "video" && remoteVideoRef.current) {
      remoteVideoRef.current.innerHTML = "";
    }
  };

  const handleUserLeft = () => {
    toast({
      title: "কল শেষ",
      description: "অপর পক্ষ কল থেকে বের হয়ে গেছেন",
    });
    handleEndCall();
  };

  const startCallSession = async () => {
    try {
      setConnecting(true);

      // Clean up any existing connection before starting a new one
      // This prevents UID_CONFLICT errors when rejoining
      if (clientRef.current) {
        try {
          // Close existing tracks first
          if (localTracksRef.current.audioTrack) {
            localTracksRef.current.audioTrack.close();
            localTracksRef.current.audioTrack = null;
          }
          if (localTracksRef.current.videoTrack) {
            localTracksRef.current.videoTrack.close();
            localTracksRef.current.videoTrack = null;
          }
          // Leave channel if connected
          await clientRef.current.leave();
        } catch (cleanupErr) {
          console.log("Cleanup before join (expected if not connected):", cleanupErr);
        }
        clientRef.current = null;
      }

      // Initialize Agora (creates fresh client)
      const initialized = await initializeAgora();
      if (!initialized) {
        throw new Error("Agora SDK লোড করতে ব্যর্থ হয়েছে");
      }

      // Get call token from server
      // Convert consultation_type to call_type format
      let callType = appointment?.consultation_type || "video";
      if (callType === "video_call") callType = "video";
      if (callType === "audio_call") callType = "audio";

      const response = await startCall({
        appointment_id: parseInt(appointmentId!),
        call_type: callType,
      });

      if (!response.success) {
        throw new Error(response.message || "কল শুরু করতে ব্যর্থ হয়েছে");
      }

      setCallData(response.data);

      // Map backend response keys to what we need
      const agora_channel = response.data.channel_name || response.data.agora_channel;
      const agora_token = response.data.token || response.data.agora_token;
      const agora_app_id = (response.data.app_id || response.data.agora_app_id)?.toString().trim();

      // Use UID 0 for automatic assignment by Agora server
      // This avoids UID_CONFLICT when the same user rejoins
      const uid = 0;

      console.log('Agora Connection Debug:', {
        appId: agora_app_id,
        channel: agora_channel,
        tokenLength: agora_token?.length,
        uid: uid,
        originalUid: user?.id
      });

      if (!agora_app_id) {
        throw new Error("Agora App ID পাওয়া যায়নি। দয়া করে অ্যাডমিনের সাথে যোগাযোগ করুন।");
      }

      // Join channel
      await clientRef.current.join(
        agora_app_id,
        agora_channel,
        agora_token,
        uid
      );

      // Create local tracks - always create both audio and video
      // This allows users to toggle video on/off during the call
      const isVideoCall = appointment?.consultation_type === "video";

      try {
        localTracksRef.current.videoTrack = await window.AgoraRTC.createCameraVideoTrack();
        if (localVideoRef.current) {
          localTracksRef.current.videoTrack.play(localVideoRef.current);
        }
        // If it's an audio call, start with video disabled
        if (!isVideoCall) {
          localTracksRef.current.videoTrack.setEnabled(false);
          setIsVideoOff(true);
        }
      } catch (videoErr) {
        console.warn("Could not access camera:", videoErr);
        localTracksRef.current.videoTrack = null;
        setIsVideoOff(true);
      }

      localTracksRef.current.audioTrack = await window.AgoraRTC.createMicrophoneAudioTrack();

      // Publish tracks - only publish enabled tracks
      // For audio calls, only publish audio track initially
      // Video track can be published later when user enables it
      const tracksToPublish = [];
      tracksToPublish.push(localTracksRef.current.audioTrack);

      // Only publish video track if it's a video call and track exists
      if (isVideoCall && localTracksRef.current.videoTrack) {
        tracksToPublish.push(localTracksRef.current.videoTrack);
      }

      await clientRef.current.publish(tracksToPublish);

      setConnected(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error starting call:", err);
      toast({
        title: "ত্রুটি",
        description: err.message || "কল শুরু করতে ব্যর্থ হয়েছে",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (callData?.call_id) {
        await endCall(callData.call_id);
      }
    } catch (err) {
      console.error("Error ending call:", err);
    } finally {
      cleanup();
      navigate(-1);
    }
  };

  const cleanup = () => {
    // Stop duration counter
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }

    // Close local tracks
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.close();
    }
    if (localTracksRef.current.videoTrack) {
      localTracksRef.current.videoTrack.close();
    }

    // Leave channel
    if (clientRef.current) {
      clientRef.current.leave();
    }

    setConnected(false);
  };

  const toggleMute = () => {
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localTracksRef.current.videoTrack) {
      if (isVideoOff) {
        // Enabling video - need to publish if not already published
        localTracksRef.current.videoTrack.setEnabled(true);
        // Check if track is not published yet (for audio calls that started without video)
        try {
          // Try to publish the video track if it wasn't published initially
          if (clientRef.current && !localTracksRef.current.videoTrack._published) {
            await clientRef.current.publish([localTracksRef.current.videoTrack]);
          }
        } catch (err) {
          console.warn("Video track already published or error:", err);
        }
        if (localVideoRef.current) {
          localTracksRef.current.videoTrack.play(localVideoRef.current);
        }
      } else {
        // Disabling video
        localTracksRef.current.videoTrack.setEnabled(false);
      }
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real implementation, you would change the audio output device
  };

  const switchCamera = async () => {
    if (localTracksRef.current.videoTrack) {
      const devices = await window.AgoraRTC.getCameras();
      if (devices.length > 1) {
        const currentDevice = localTracksRef.current.videoTrack.getTrackLabel();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nextDevice = devices.find((d: any) => d.label !== currentDevice);
        if (nextDevice) {
          await localTracksRef.current.videoTrack.setDevice(nextDevice.deviceId);
        }
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getOtherParty = (): { name?: string; avatarUrl?: string } | null => {
    if (!appointment) return null;
    const isExpert = user?.type === "expert";
    if (isExpert) {
      // Farmer side - get farmer's profile
      const farmerProfile = appointment.farmer?.profile;
      return {
        name: farmerProfile?.full_name,
        avatarUrl: farmerProfile?.profile_photo_url_full || farmerProfile?.profile_photo_url || farmerProfile?.avatar_url
      };
    }
    // Expert side - expert relation returns User model, so expert.profile works
    const expertProfile = appointment.expert?.profile;
    return {
      name: expertProfile?.full_name,
      avatarUrl: expertProfile?.profile_photo_url_full || expertProfile?.profile_photo_url || expertProfile?.avatar_url
    };
  };

  const otherParty = getOtherParty();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-green-500 animate-spin mx-auto mb-3" />
          <p className="text-white">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-white mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Full Screen) */}
        <div
          ref={remoteVideoRef}
          className="absolute inset-0 bg-gray-800 flex items-center justify-center"
        >
          {!connected && (
            <div className="text-center">
              <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-gray-700">
                <AvatarImage
                  src={getProfilePhotoUrl(otherParty?.avatarUrl)}
                />
                <AvatarFallback className="bg-gray-700 text-white text-4xl">
                  {otherParty?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-white text-xl font-semibold mb-2">
                {otherParty?.name || "অজানা"}
              </h2>
              {connecting ? (
                <p className="text-gray-400">সংযোগ হচ্ছে...</p>
              ) : (
                <p className="text-gray-400">কল শুরু করতে নিচের বাটনে ক্লিক করুন</p>
              )}
            </div>
          )}
        </div>

        {/* Local Video (Small) - Always show for camera toggle */}
        <div
          ref={localVideoRef}
          className="absolute top-4 right-4 w-32 h-44 bg-gray-700 rounded-xl overflow-hidden shadow-lg z-10"
        >
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>

        {/* Call Duration */}
        {connected && (
          <div className="absolute top-4 left-4 bg-black/50 rounded-full px-4 py-2 z-10">
            <p className="text-white text-sm font-mono">{formatDuration(callDuration)}</p>
          </div>
        )}

        {/* Mute Indicator */}
        {isMuted && connected && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 rounded-full px-3 py-1 z-10">
            <p className="text-white text-xs flex items-center gap-1">
              <MicOff className="h-3 w-3" /> মিউট
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900/90 backdrop-blur-lg py-6 px-4">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-14 w-14 rounded-full ${isMuted ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            onClick={toggleMute}
            disabled={!connected}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </Button>

          {/* Video Toggle - Always show for all call types */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-14 w-14 rounded-full ${isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            onClick={toggleVideo}
            disabled={!connected}
          >
            {isVideoOff ? (
              <VideoOff className="h-6 w-6 text-white" />
            ) : (
              <Video className="h-6 w-6 text-white" />
            )}
          </Button>

          {/* Start/End Call Button */}
          {!connected ? (
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
              onClick={startCallSession}
              disabled={connecting}
            >
              {connecting ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : (
                <Phone className="h-8 w-8 text-white" />
              )}
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-8 w-8 text-white" />
            </Button>
          )}

          {/* Switch Camera - Always show */}
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={switchCamera}
            disabled={!connected || isVideoOff}
          >
            <RotateCcw className="h-6 w-6 text-white" />
          </Button>

          {/* Chat Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={() => navigate(`/consultation/chat/${appointmentId}`)}
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={toggleSpeaker}
          >
            {isSpeakerOn ? (
              <Volume2 className="h-5 w-5 mr-1" />
            ) : (
              <VolumeX className="h-5 w-5 mr-1" />
            )}
            {isSpeakerOn ? "স্পিকার চালু" : "স্পিকার বন্ধ"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPage;
