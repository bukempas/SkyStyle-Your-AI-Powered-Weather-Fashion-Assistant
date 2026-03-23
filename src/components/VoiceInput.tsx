import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';
import { cn } from '../utils';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsProcessing(true);
          try {
            const text = await transcribeAudio(base64Audio);
            onTranscription(text);
          } catch (error) {
            console.error('Transcription failed:', error);
          } finally {
            setIsProcessing(false);
          }
        };
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={cn(
          "p-3 rounded-full transition-all duration-300 flex items-center justify-center",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
            : "bg-blue-500 hover:bg-blue-600",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : isRecording ? (
          <Square className="w-6 h-6 text-white fill-current" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
      {isRecording && <span className="text-sm font-medium text-red-500">Recording...</span>}
      {isProcessing && <span className="text-sm font-medium text-blue-500">Transcribing...</span>}
    </div>
  );
};
