'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileAudio, Loader2, CheckCircle2, XCircle, Copy, Download, Trash2, Mic, Moon, Sun } from 'lucide-react';

export default function MeetingMinutesGenerator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih rekaman rapat terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Upload failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = result?.data?.summary || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = result?.data?.summary || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notulen-rapat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900' 
        : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-orange-50'
    } p-4 sm:p-8 relative overflow-hidden`}>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float ${
          darkMode ? 'bg-teal-400' : 'bg-teal-300'
        }`} style={{ animationDelay: '0s', animationDuration: '20s' }}></div>
        <div className={`absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 animate-float ${
          darkMode ? 'bg-orange-500' : 'bg-coral-300'
        }`} style={{ animationDelay: '5s', animationDuration: '25s' }}></div>
        <div className={`absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full blur-3xl opacity-15 animate-float ${
          darkMode ? 'bg-cyan-400' : 'bg-cyan-300'
        }`} style={{ animationDelay: '10s', animationDuration: '30s' }}></div>
        
        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={darkMode ? "#14b8a6" : "#0d9488"} stopOpacity="0.5" />
              <stop offset="100%" stopColor={darkMode ? "#f97316" : "#ea580c"} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q250,50 500,100 T1000,100" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-wave" />
          <path d="M0,200 Q250,150 500,200 T1000,200" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-wave-delayed" />
        </svg>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-800 text-teal-400 hover:bg-slate-700' 
            : 'bg-white text-orange-600 hover:bg-gray-50'
        }`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300 ${
            darkMode 
              ? 'bg-gradient-to-br from-teal-600 to-cyan-700' 
              : 'bg-gradient-to-br from-teal-500 to-orange-500'
          }`}>
            <Mic className="w-10 h-10 text-white animate-pulse-slow" />
          </div>
          <h1 className={`text-5xl font-bold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`} style={{ fontFamily: '"Space Mono", monospace' }}>
            Generator Notulen Rapat
          </h1>
          <p className={`text-lg ${
            darkMode ? 'text-teal-300' : 'text-teal-700'
          }`}>
            Unggah rekaman rapat Anda dan dapatkan notulen rapat yang dihasilkan AI
          </p>
        </div>

        {/* Main Card */}
        <div className={`rounded-3xl shadow-2xl p-6 sm:p-8 border backdrop-blur-sm transition-all duration-500 animate-slide-up ${
          darkMode 
            ? 'bg-slate-800/80 border-slate-700' 
            : 'bg-white/90 border-teal-100'
        }`}>
          {/* Upload Area */}
          <div className="mb-6">
            <label className={`group relative flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              darkMode 
                ? 'border-slate-600 hover:border-teal-500 hover:bg-slate-700/50' 
                : 'border-gray-300 hover:border-teal-500 hover:bg-teal-50/50'
            }`}>
              <div className="text-center">
                {file ? (
                  <div className="space-y-3 animate-scale-in">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${
                      darkMode 
                        ? 'bg-gradient-to-br from-teal-900 to-cyan-900' 
                        : 'bg-gradient-to-br from-teal-100 to-orange-100'
                    }`}>
                      <FileAudio className={`w-10 h-10 ${
                        darkMode ? 'text-teal-400' : 'text-teal-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{file.name}</p>
                      <p className={`text-xs mt-1 ${
                        darkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClear();
                      }}
                      className={`inline-flex items-center gap-1 text-xs transition-colors ${
                        darkMode 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Hapus
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg ${
                      darkMode 
                        ? 'bg-gradient-to-br from-teal-900 to-cyan-900' 
                        : 'bg-gradient-to-br from-teal-100 to-orange-100'
                    }`}>
                      <Upload className={`w-10 h-10 ${
                        darkMode ? 'text-teal-400' : 'text-teal-600'
                      }`} />
                    </div>
                    <p className={`text-base font-semibold mb-1 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Klik untuk mengunggah atau seret dan lepas
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Rekaman rapat dalam format MP3, WAV, M4A atau format audio lainnya
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-4 rounded-xl font-bold disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
              darkMode 
                ? 'bg-gradient-to-r from-teal-600 to-orange-600 text-white disabled:from-slate-700 disabled:to-slate-700 hover:shadow-teal-500/50' 
                : 'bg-gradient-to-r from-teal-500 to-orange-500 text-white disabled:from-gray-300 disabled:to-gray-400 hover:shadow-xl'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Membuat Notulen Rapat...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Unggah & Buat Notulen
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className={`mt-6 p-4 border rounded-xl flex items-start gap-3 animate-shake ${
              darkMode 
                ? 'bg-red-950/50 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <XCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`} />
              <div>
                <p className={`font-semibold ${
                  darkMode ? 'text-red-300' : 'text-red-900'
                }`}>Error</p>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-red-400' : 'text-red-700'
                }`}>{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={`mt-6 p-6 rounded-xl border animate-pulse-border ${
              darkMode 
                ? 'bg-gradient-to-r from-teal-950/50 to-cyan-950/50 border-teal-800' 
                : 'bg-gradient-to-r from-teal-50 to-orange-50 border-teal-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className={`w-5 h-5 animate-spin ${
                  darkMode ? 'text-teal-400' : 'text-teal-600'
                }`} />
                <span className={`font-semibold ${
                  darkMode ? 'text-teal-300' : 'text-teal-900'
                }`}>Menganalisis rapat dan membuat notulen...</span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${
                darkMode ? 'bg-slate-700' : 'bg-teal-200'
              }`}>
                <div className={`h-full animate-progress ${
                  darkMode 
                    ? 'bg-gradient-to-r from-teal-600 to-orange-600' 
                    : 'bg-gradient-to-r from-teal-500 to-orange-500'
                }`}></div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="mt-6 space-y-4 animate-fade-in-up">
              <div className={`p-4 border rounded-xl flex items-center gap-3 ${
                darkMode 
                  ? 'bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border-emerald-800' 
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              }`}>
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                  darkMode ? 'text-emerald-400' : 'text-green-600'
                }`} />
                <span className={`font-semibold ${
                  darkMode ? 'text-emerald-300' : 'text-green-900'
                }`}>Notulen rapat berhasil dibuat!</span>
              </div>

              <div className={`rounded-xl border overflow-hidden ${
                darkMode 
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <div className={`flex items-center justify-between px-4 py-3 border-b ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-white/50 border-gray-200'
                }`}>
                  <h3 className={`font-bold flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <FileAudio className={`w-4 h-4 ${
                      darkMode ? 'text-teal-400' : 'text-teal-600'
                    }`} />
                    Notulen Rapat
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={`p-2 rounded-lg transition-all group ${
                        darkMode 
                          ? 'hover:bg-slate-700' 
                          : 'hover:bg-white'
                      }`}
                      title="Salin ke clipboard"
                    >
                      {copied ? (
                        <CheckCircle2 className={`w-4 h-4 ${
                          darkMode ? 'text-emerald-400' : 'text-green-600'
                        }`} />
                      ) : (
                        <Copy className={`w-4 h-4 transition-colors ${
                          darkMode 
                            ? 'text-slate-400 group-hover:text-teal-400' 
                            : 'text-gray-600 group-hover:text-teal-600'
                        }`} />
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className={`p-2 rounded-lg transition-all group ${
                        darkMode 
                          ? 'hover:bg-slate-700' 
                          : 'hover:bg-white'
                      }`}
                      title="Unduh notulen"
                    >
                      <Download className={`w-4 h-4 transition-colors ${
                        darkMode 
                          ? 'text-slate-400 group-hover:text-teal-400' 
                          : 'text-gray-600 group-hover:text-teal-600'
                      }`} />
                    </button>
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`} style={{ fontFamily: '"Courier New", monospace' }}>
                    {result?.data?.summary || 'Notulen tidak tersedia'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`text-center mt-8 text-sm ${
          darkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          <p>🔒 Rekaman rapat Anda diproses dengan aman dan tidak disimpan secara permanen</p>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -10px) rotate(5deg);
          }
          50% {
            transform: translate(-5px, 5px) rotate(-5deg);
          }
          75% {
            transform: translate(-10px, -5px) rotate(3deg);
          }
        }

        @keyframes wave {
          0% {
            d: path("M0,100 Q250,50 500,100 T1000,100");
          }
          50% {
            d: path("M0,100 Q250,150 500,100 T1000,100");
          }
          100% {
            d: path("M0,100 Q250,50 500,100 T1000,100");
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }

        .animate-wave-delayed {
          animation: wave 10s ease-in-out infinite;
          animation-delay: -5s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${darkMode ? '#1e293b' : '#f1f5f9'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#14b8a6' : '#0d9488'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? '#0d9488' : '#0f766e'};
        }
      `}</style>
    </div>
  );
}