/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Mail, Lock, User, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SplashProps {
  onOnboardComplete: (userEmail: string) => void;
}

export default function Splash({ onOnboardComplete }: SplashProps) {
  const [phase, setPhase] = useState<"logo" | "auth">("logo");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("yhkwon2004@gmail.com");
  const [password, setPassword] = useState("password123");
  const [nickname, setNickname] = useState("웹툰어시공부");
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 2.5 seconds splash intro
    const timer = setTimeout(() => {
      // If user info is already saved, can auto login.
      const savedUser = localStorage.getItem("webtoon_studio_user");
      if (savedUser) {
        onOnboardComplete(savedUser);
      } else {
        setPhase("auth");
      }
    }, 2400);
    return () => clearTimeout(timer);
  }, [onOnboardComplete]);

  const handleGuestEntry = () => {
    setGuestLoading(true);
    setTimeout(() => {
      localStorage.setItem("webtoon_studio_user", "yhkwon2004@gmail.com");
      localStorage.setItem("webtoon_studio_nickname", "초고속웹툰작가");
      onOnboardComplete("yhkwon2004@gmail.com");
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    if (isSignUp && !nickname) {
      setErrorMsg("작가 필명을 입력해주세요.");
      return;
    }

    localStorage.setItem("webtoon_studio_user", email);
    localStorage.setItem("webtoon_studio_nickname", nickname);
    onOnboardComplete(email);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans select-none text-slate-100">
      {/* Decorative blurry nodes representing a neon blueprint sheet */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl" />

      <AnimatePresence mode="wait">
        {phase === "logo" ? (
          <motion.div
            key="logo-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center z-10"
            id="splash-container"
          >
            {/* Visual Logo Ring */}
            <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-dashed border-indigo-500/30 rounded-full animate-spin [animation-duration:15s]" />
              <div className="absolute inset-2 border border-dashed border-fuchsia-400/40 rounded-full animate-spin [animation-duration:8s] reverse" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 via-sky-100 to-indigo-100 mb-2">
              WEBTOON CREATOR
            </h1>
            <p className="text-indigo-400 font-mono tracking-widest text-xs uppercase mb-16">
              AI-Powered Layout Studio
            </p>

            <div className="flex flex-col items-center gap-2">
              <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-indigo-500 to-fuchsia-400"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-2">Checking active sandbox environment...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md z-10"
            id="auth-card"
          >
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-xl mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">웹툰 크리에이터 가입 &amp; 시작</h2>
              <p className="text-xs text-slate-400 mt-1">프롬프트와 구성 구도를 통한 나만의 웹툰 작업실</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">작가 필명 / 스튜디오명</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="예: 냥이작가, 골목스튜디오"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">이메일 주소</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {!isSignUp && (
                  <div className="text-right mt-1.5">
                    <span className="text-[11px] text-slate-500 hover:text-indigo-400 cursor-pointer">
                      비밀번호를 분실했나요?
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="btn-auth-submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSignUp ? "신규 작가 등록하기" : "보안 로그인하기"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <span className="relative px-3 bg-slate-900/95 text-[10px] uppercase font-mono text-slate-500">OR</span>
            </div>

            {/* Quick Guest Bypass (Pristine Creator UX) */}
            <button
              onClick={handleGuestEntry}
              id="btn-guest-bypass"
              disabled={guestLoading}
              className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {guestLoading ? (
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>체험용 게스트 계정으로 원클릭 시작</span>
                </>
              )}
            </button>

            <div className="text-center mt-6 text-xs">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg("");
                }}
                className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                id="btn-toggle-auth-mode"
              >
                {isSignUp ? "이미 동반 작가 계정이 있나요? 로그인하기" : "아직 회원이 아니신가요? 30초 회원가입"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
