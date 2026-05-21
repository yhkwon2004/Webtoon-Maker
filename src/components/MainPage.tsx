/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Project, Character, Outfit, BackgroundPreset 
} from "../types";
import { 
  Sparkles, Plus, Palette, BookOpen, Layers, Image, 
  Settings, UserCheck, Calendar, ArrowRight, Video,
  Trash2, UserPlus, Heart, LogOut, CheckCircle, Smartphone, Sliders
} from "lucide-react";
import { motion } from "motion/react";

interface MainPageProps {
  userEmail: string;
  projects: Project[];
  characters: Character[];
  outfits: Outfit[];
  backgrounds: BackgroundPreset[];
  onCreateProject: (title: string, desc: string) => void;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenCharacterSheetCreator: () => void;
  onOpenOutfitForm: () => void;
  onLogOut: () => void;
}

export default function MainPage({
  userEmail,
  projects,
  characters,
  outfits,
  backgrounds,
  onCreateProject,
  onSelectProject,
  onDeleteProject,
  onOpenCharacterSheetCreator,
  onOpenOutfitForm,
  onLogOut
}: MainPageProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "characters" | "outfits" | "backgrounds" | "mypage">("projects");
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const writerNickname = localStorage.getItem("webtoon_studio_nickname") || "초고속웹툰작가";

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateProject(newTitle, newDesc);
    setNewTitle("");
    setNewDesc("");
    setShowNewProjModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Platform Header */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-md shadow-indigo-600/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">PLATFORM STUDIO</span>
              <h1 className="text-lg font-bold text-slate-100 -mt-0.5 tracking-tight truncate">웹툰 컷 생성 엔진</h1>
            </div>
          </div>

          {/* Quick Header Right User Badging */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{writerNickname} 작가님</span>
              <span className="text-[11px] font-mono text-slate-500">{userEmail}</span>
            </div>
            <button
              onClick={onLogOut}
              id="btn-nav-logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Welcome Hero Board */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 100% 일체형 스마트 AI 프레임 제작 스튜디오
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">프롬프트 기반 일관성 웹툰 완결실</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-1">
              캐릭터 에셋 정보, 의상 레이아웃 및 3D 포즈 레이블 기반을 활용하여 완벽한 조화를 이루는 장면 카드를 일괄 제작 및 렌더링하세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowNewProjModal(true)}
              id="btn-hero-new-project"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-slate-100 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              <Plus className="w-4.5 h-4.5" /> <span>새 원고 만들기</span>
            </button>
            <button
              onClick={onOpenCharacterSheetCreator}
              id="btn-hero-new-character"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-indigo-300 text-sm font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4.5 h-4.5 text-indigo-400" /> <span>AI 캐릭터 생성</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center border-b border-slate-800 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("projects")}
            id="tab-btn-projects"
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" /> <span>내 원고 프로젝트 ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("characters")}
            id="tab-btn-characters"
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "characters"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Palette className="w-4.5 h-4.5" /> <span>캐릭터 시트 ({characters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("outfits")}
            id="tab-btn-outfits"
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "outfits"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4.5 h-4.5" /> <span>코스튬 아카이브 ({outfits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("backgrounds")}
            id="tab-btn-backgrounds"
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "backgrounds"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Image className="w-4.5 h-4.5" /> <span>배경 스테이지 ({backgrounds.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("mypage")}
            id="tab-btn-mypage"
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "mypage"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserCheck className="w-4.5 h-4.5" /> <span>작가 설정실</span>
          </button>
        </div>

        {/* Tab Panel Content renders dynamically */}
        <div className="flex-1 min-h-[400px]">
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-grid">
              {projects.length === 0 ? (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                  <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm font-medium">진행 중인 웹툰 원고가 없습니다.</p>
                  <button
                    onClick={() => setShowNewProjModal(true)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
                  >
                    새 프로젝트 생성하기
                  </button>
                </div>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden card-transition p-5 flex flex-col justify-between h-56 relative group shadow-sm hover:shadow-indigo-500/5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md font-semibold">
                          {proj.cuts.length} CUTS
                        </span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`'${proj.title}' 프로젝트를 삭제하시겠습니까?`)) {
                                onDeleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-100 tracking-tight line-clamp-1 mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {proj.description || "상세 시놉시스 내용이 정의되어 있지 않습니다."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        수정: {new Date(proj.lastModified).toLocaleDateString("ko-KR")}
                      </span>
                      <button
                        onClick={() => onSelectProject(proj.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <span>작업실 입장</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "characters" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">일인칭 기획 캐릭터 프로필 목록</h3>
                <button
                  onClick={onOpenCharacterSheetCreator}
                  className="px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> <span>인물 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="characters-grid">
                {characters.map((char) => (
                  <div
                    key={char.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
                  >
                    {/* Character aesthetic badge indicator */}
                    <div className="absolute top-4 right-4 flex gap-1 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                      {char.palettes.slice(0, 4).map((col, idx) => (
                        <span key={idx} className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col }} />
                      ))}
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      {/* Generative stylized face avatar box */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 overflow-hidden flex flex-col items-center justify-center relative shrink-0">
                        {/* Render simple cute SVG character placeholder with matching skin and hair colors */}
                        <svg className="w-12 h-12" viewBox="0 0 40 40">
                          {/* Face layer */}
                          <circle cx="20" cy="18" r="11" fill={char.skinTone.includes("밝") ? "#fed7aa" : "#f59e0b"} />
                          {/* Hair layer back */}
                          <circle cx="20" cy="15" r="10" fill={char.hairStyle.includes("블루") ? "#1e3a8a" : char.hairStyle.includes("그레이") ? "#4b5563" : "#3f200f"} />
                          {/* Cute simple features */}
                          <circle cx="16" cy="17" r="1.5" fill="#1e293b" />
                          <circle cx="24" cy="17" r="1.5" fill="#1e293b" />
                          <path d="M 18,21 Q 20,23 22,21" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                        <div className="absolute bottom-0 text-[9px] font-mono font-semibold px-1 py-0.5 w-full text-center bg-slate-950/80 text-fuchsia-400 capitalize truncate">
                          {char.styleChoice === "classic-anime" ? "Anime" : "K-Webtoon"}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                          {char.name}
                          <span className="text-[11px] font-medium text-slate-500 font-mono">{char.genderAge}</span>
                        </h4>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {char.keywords.map((key, idx) => (
                            <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md">
                              #{key}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 border border-slate-800/60 p-3 rounded-lg mb-4 line-clamp-2">
                      {char.brief}
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] lg:text-xs">
                      <div>
                        <span className="font-semibold text-indigo-400">헤어스타일:</span>{" "}
                        <span className="text-slate-400">{char.hairStyle}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-indigo-400">얼굴특징:</span>{" "}
                        <span className="text-slate-400">{char.features}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold text-indigo-400">대표성격:</span>{" "}
                        <span className="text-slate-300">{char.personality}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">기초 표현 감정 세트 (AI 뼈대 매핑용)</span>
                      <div className="grid grid-cols-5 gap-1 text-[10px] text-center">
                        <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/40 text-slate-300">
                          <div className="font-mono text-indigo-400 font-bold mb-0.5">평온</div>
                          <span className="line-clamp-1">{char.facialSet.normal}</span>
                        </div>
                        <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/40 text-slate-300">
                          <div className="font-mono text-emerald-400 font-bold mb-0.5">미소</div>
                          <span className="line-clamp-1">{char.facialSet.happy}</span>
                        </div>
                        <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/40 text-slate-300">
                          <div className="font-mono text-sky-400 font-bold mb-0.5">슬픔</div>
                          <span className="line-clamp-1">{char.facialSet.sad}</span>
                        </div>
                        <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/40 text-slate-300">
                          <div className="font-mono text-rose-400 font-bold mb-0.5">분노</div>
                          <span className="line-clamp-1">{char.facialSet.angry}</span>
                        </div>
                        <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800/40 text-slate-300">
                          <div className="font-mono text-fuchsia-400 font-bold mb-0.5">놀람</div>
                          <span className="line-clamp-1">{char.facialSet.shocked}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "outfits" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">분리 관리식 의상 / 코스튬 사출고</h3>
                <button
                  onClick={onOpenOutfitForm}
                  className="px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> <span>의상 추가</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="outfits-grid">
                {outfits.map((out) => (
                  <div
                    key={out.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-full">
                          {out.situation}
                        </span>
                        {out.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> 기본 착용
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-slate-100 tracking-tight leading-snug mb-3">
                        {out.name}
                      </h4>

                      <div className="space-y-2 text-xs bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">상의:</span>
                          <span className="text-slate-300 font-medium">{out.top}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">하의:</span>
                          <span className="text-slate-300 font-medium">{out.bottom}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">핵심 소품:</span>
                          <span className="text-slate-300 font-medium">{out.accessories || "없음"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">대표 신발:</span>
                          <span className="text-slate-300 font-medium">{out.shoes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
                      <span>계절: {out.season}</span>
                      <span>주요 배색: {out.color}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "backgrounds" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">일괄 기획 전용 배경 프리셋 라이브러리</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="backgrounds-grid">
                {backgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden card-transition"
                  >
                    {/* Atmospheric color gradient mock container rendering backdrop mood */}
                    <div
                      className="h-28 relative flex items-end p-4"
                      style={{
                        background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})`
                      }}
                    >
                      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold border border-slate-800 uppercase">
                        {bg.dayNight === "day" ? "☀️ 낮" : bg.dayNight === "sunset" ? "🌇 노을" : "🌙 밤"} • {bg.type}
                      </div>

                      <span className="z-10 text-[10px] font-mono tracking-wider px-2 py-0.5 bg-slate-950/80 text-sky-200 border border-slate-800/80 rounded-md">
                        {bg.weather || "표준 날씨 대기"}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="text-sm font-bold text-white mb-2">{bg.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed text-line-clamp-2">
                        {bg.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "mypage" && (
            <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold font-mono">
                  {writerNickname[0] || "작"}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{writerNickname} 작가님</h4>
                  <span className="text-xs text-indigo-400 font-mono">Platform Creator / {userEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block mb-1">참여 활성 원고</span>
                  <span className="text-lg font-bold text-white font-mono">{projects.length}개</span>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 block mb-1">작화 내역 컷 총합</span>
                  <span className="text-lg font-bold text-indigo-400 font-mono">
                    {projects.reduce((sum, p) => sum + p.cuts.length, 0)} CUTS
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">스튜디오 환경 설정</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                    <span className="text-slate-300">작업 중 오토 세이브 활성</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-bold">자동 동기화 적용 중</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                    <span className="text-slate-300">작화 프레임 규격 프리셋</span>
                    <span className="text-slate-400 font-mono text-[11px]">800px (네이버/카카오 웹툰 표준)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800/40">
                    <span className="text-slate-300">AI 보정 어시스턴트 모델</span>
                    <span className="text-slate-400 font-mono text-[11px]">gemini-3.5-flash (기본 탑재)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New Project Creation Dialog Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative"
          >
            <h3 className="text-lg font-bold text-white mb-2">새 웹툰 프로젝트 만들기</h3>
            <p className="text-xs text-slate-400 mb-6">시리즈 제목과 시놉시스 에피소드 기본 골격을 정의하세요.</p>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">작품 제목 / 편명</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  placeholder="예: 우리들의 푸른 소설 주말편"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">대표 시놉시스 및 연출 메모</label>
                <textarea
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 h-24 resize-none"
                  placeholder="예: 비가 갑자기 내리는 등굣길, 우산이 없던 여주인공과 남주인공의 짧은 복도 아이 콘택트 연출"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  취소기각
                </button>
                <button
                  type="submit"
                  id="btn-dialog-project-submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
                >
                  프로젝트 발행
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
