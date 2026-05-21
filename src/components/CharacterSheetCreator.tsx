/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, ArrowLeft, ArrowRight, Palette, User, 
  Layers, Smile, AlertCircle, RefreshCw, BadgeCheck, HelpCircle
} from "lucide-react";
import { Character } from "../types";
import { motion } from "motion/react";

interface CharacterSheetCreatorProps {
  onSaveCharacter: (character: Character) => void;
  onCancel: () => void;
}

export default function CharacterSheetCreator({
  onSaveCharacter,
  onCancel
}: CharacterSheetCreatorProps) {
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [genderAge, setGenderAge] = useState("18세 / 여성 / 스탠다드 체형");
  const [skinTone, setSkinTone] = useState("투명하고 맑은 웜톤");
  const [hairStyle, setHairStyle] = useState("찰랑이는 어두운 브라운 단발머리");
  const [features, setFeatures] = useState("눈망울이 동글동글하고 밝음");
  const [personality, setPersonality] = useState("다정다감하지만 고독을 즐김");
  const [styleChoice, setStyleChoice] = useState("classic-anime");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSheet, setGeneratedSheet] = useState<Character | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleGenerateSheetWithAI = async () => {
    if (!name.trim()) return;
    setIsGenerating(true);
    setGeneratedSheet(null);

    try {
      const response = await fetch("/api/character-sheet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          characterBrief: `${brief}. ${genderAge}. ${skinTone}. ${hairStyle}. ${features}. ${personality}`, 
          styleSeed: styleChoice 
        })
      });
      const data = await response.json();
      if (data.success && data.character) {
        // Complete the object with generated info
        const charResult: Character = {
          id: `char-cust-${Date.now()}`,
          name: data.character.name || name,
          brief: data.character.brief || brief || "기획된 웹툰 전용 주인공",
          genderAge: data.character.genderAge || genderAge,
          skinTone: data.character.skinTone || skinTone,
          hairStyle: data.character.hairStyle || hairStyle,
          features: data.character.features || features,
          personality: data.character.personality || personality,
          facialSet: data.character.facialSet || {
            normal: "생긋 웃고 있는 친근한 표정",
            happy: "가장 즐겁고 해맑게 소리치며 미소 짓는 표정",
            sad: "눈물 한 방울이 고일 것 같이 아련하게 울컥하는 표정",
            angry: "입술을 꽉 깨물고 위협적으로 치켜보는 진지한 표정",
            shocked: "동그랗게 휘둥그레진 긴장된 놀람 의사 표정"
          },
          palettes: data.character.palettes && data.character.palettes.length ? data.character.palettes : ["#fee2e2", "#1e3a8a", "#f59e0b", "#10b981", "#ef4444"],
          keywords: data.character.keywords && data.character.keywords.length ? data.character.keywords : ["신비형", "청춘이야기", "개성파"],
          styleChoice: data.character.styleChoice || styleChoice
        };
        setGeneratedSheet(charResult);
        setIsDone(true);
      } else {
        throw new Error(data.error || "Generation payload error");
      }
    } catch (err) {
      console.error(err);
      // Offline / Error fallback
      const fallbackResult: Character = {
        id: `char-cust-fb-${Date.now()}`,
        name: name,
        brief: brief || "신비주의를 표방한 신규 기획 주인공",
        genderAge: genderAge,
        skinTone: skinTone,
        hairStyle: hairStyle,
        features: features,
        personality: personality,
        facialSet: {
          normal: "상냥하고 평온하지만 깊은 생각에 들어간 표정",
          happy: "아이같이 입을 활짝 열고 기분 좋게 미소 짓는 표정",
          sad: "말없이 한없이 아득한 곳을 바라보는 쓸쓸하고 애잔한 표정",
          angry: "눈살을 강하게 가로지르며 결의에 차서 고집 있게 쳐다보는 표정",
          shocked: "예상치 못한 조우에 입을 꾹 깨문 당황스러움 가득한 표정"
        },
        palettes: ["#e0f2fe", "#0284c7", "#f43f5e", "#fda4af", "#0f172a"],
        keywords: [styleChoice, "감성디렉터", "시그니처"],
        styleChoice: styleChoice
      };
      setGeneratedSheet(fallbackResult);
      setIsDone(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToPlatform = () => {
    if (generatedSheet) {
      onSaveCharacter(generatedSheet);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* Navigation back and header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4 shrink-0">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> <span>대시보드로 복귀</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 border border-indigo-500/20 rounded-full font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI CHARACTER DRAFTER v2.0
          </div>
        </div>

        {/* Setup Split Screen */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left panel Inputs setup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" /> 캐릭터 정체성 기획
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">인물 설정 기틀 위에 AI 토큰 및 페이셜 세트를 구축합니다.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">캐릭터 이름</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                  placeholder="예: 정우, 김이나"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">그림체/작画 스타일 선택</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setStyleChoice("classic-anime")}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      styleChoice === "classic-anime"
                        ? "border-indigo-500 bg-indigo-500/5 text-slate-100"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-bold text-white">클래식 로맨스 (소녀만화)</span>
                    <span className="text-[10px] text-slate-500">눈빛이 영롱하며 감미로운 감성 작화</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyleChoice("k-webtoon-modern")}
                    className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      styleChoice === "k-webtoon-modern"
                        ? "border-indigo-500 bg-indigo-500/5 text-slate-100"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-bold text-white font-sans">K-Webtoon 트렌드 (실사풍)</span>
                    <span className="text-[10px] text-slate-500">인물이 세밀하며 트렌디하고 화려한 작화</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">주요 특징 (핵심 단어 위주)</label>
                <textarea
                  className="w-full h-16 px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none"
                  placeholder="인물의 핵심 분위기나 매력포인트 (예: 쾌활하지만 생각이 많은, 비오는 날 정류장에 있는 고스룩 마니아)"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">성별 및 체형 특징</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs"
                    value={genderAge}
                    onChange={(e) => setGenderAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">헤어스타일 묘사</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs"
                    value={hairStyle}
                    onChange={(e) => setHairStyle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">피부 톤 지정</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs"
                    value={skinTone}
                    onChange={(e) => setSkinTone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">얼굴 고유특징</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSheetWithAI}
              id="btn-trigger-ai-character-sheet"
              disabled={!name.trim() || isGenerating}
              className={`w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Gemini가 시트를 렌더링하는 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-indigo-200" />
                  <span>시트 생성 &amp; 성격 매핑 실행</span>
                </>
              )}
            </button>
          </div>

          {/* Right panel output rendering */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-between shadow-lg">
            
            {/* Upper output header */}
            <div className="bg-slate-950/50 border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-indigo-400" /> 생성 가동 결과지
              </span>
              {isDone && (
                <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] rounded font-bold uppercase tracking-widest">
                  Active Sync
                </div>
              )}
            </div>

            {/* Inner dynamic viewports */}
            <div className="p-6 flex-1 flex flex-col justify-center">
              {!isDone ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-950/80 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">왼쪽 설정값을 입력하고 우등 생성 버튼을 누르세요.</h4>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    본 시스템은 작화 도구의 일체형 원클릭 사양 조정을 돕고자, 인성 정보에 맞는 완벽한 감정 묘사와 일관성 컬러 배치를 세부 계산합니다.
                  </p>
                </div>
              ) : generatedSheet ? (
                <div className="space-y-6">
                  {/* Generative Visual Header */}
                  <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <div className="w-14 h-14 rounded-full bg-indigo-950 border border-indigo-700/60 p-1 flex items-center justify-center">
                      {/* Generative dynamic visual SVG */}
                      <svg className="w-12 h-12" viewBox="0 0 32 32">
                        <circle cx="16" cy="15" r="9" fill={generatedSheet.palettes[0] || "#fed7aa"} />
                        <path d="M 16,5 L 12,12 L 20,12 Z" fill="#1e293b" />
                        <circle cx="13" cy="14" r="1.5" fill="#0f172a" />
                        <circle cx="19" cy="14" r="1.5" fill="#0f172a" />
                        <path d="M 14,19 Q 16,21 18,19" stroke="#0f172a" strokeWidth="1.5" fill="none" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {generatedSheet.name}
                        <span className="text-xs text-slate-400 font-mono font-medium">({generatedSheet.genderAge})</span>
                      </h4>
                      {/* Palette renderer bubbles */}
                      <div className="flex gap-1.5">
                        {generatedSheet.palettes.map((hex, idx) => (
                          <span
                            key={idx}
                            className="w-4.5 h-4.5 rounded-full border border-slate-950 shrink-0 shadow-sm"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Descriptions blocks */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-500 block mb-1">인물 시놉시스 최종 정제</span>
                      <p className="text-slate-300 leading-relaxed bg-slate-950/20 p-2.5 rounded-lg border border-slate-850">
                        {generatedSheet.brief}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/20 p-2.5 rounded-lg border border-slate-850">
                        <span className="font-bold text-slate-500 block mb-1">헤어 / 피부 지시어</span>
                        <span className="text-slate-300">{generatedSheet.hairStyle} ({generatedSheet.skinTone})</span>
                      </div>
                      <div className="bg-slate-950/20 p-2.5 rounded-lg border border-slate-850">
                        <span className="font-bold text-slate-500 block mb-1">특이점 / 성격 조형</span>
                        <span className="text-slate-300">{generatedSheet.personality}</span>
                      </div>
                    </div>

                    {/* Facial set rendering */}
                    <div>
                      <span className="font-bold text-slate-500 block mb-1.5">감정별 지시 시그니처 표정 묘사</span>
                      <div className="space-y-1.5">
                        {Object.entries(generatedSheet.facialSet).map(([emotion, description]) => (
                          <div key={emotion} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-800/40">
                            <span className="font-mono text-indigo-400 uppercase font-semibold">{emotion}:</span>
                            <span className="text-slate-300 truncate max-w-xs">{description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Bottom saving action trigger */}
            <div className="bg-slate-950/50 border-t border-slate-800/80 px-6 py-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {isDone ? "원고 창작 프로젝트에 직접 주입할 수 있습니다." : "프레임 매핑 데이터 생성 대기"}
              </span>
              <button
                onClick={handleSaveToPlatform}
                id="btn-save-character-to-dashboard"
                disabled={!isDone || !generatedSheet}
                className="px-5 py-2 bg-indigo-600 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BadgeCheck className="w-4 h-4 text-emerald-200" />
                <span>나머지 시트 저장 및 적용</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
