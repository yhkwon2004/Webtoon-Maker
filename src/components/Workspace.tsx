/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Project, Cut, Character, Outfit, BackgroundPreset 
} from "../types";
import { 
  ChevronUp, ChevronDown, Plus, Copy, Trash2, ArrowLeft, Sparkles, 
  Layers, Smile, Image, Compass, Save, Edit3, Speech, Check, 
  Maximize2, Play, Volume2, Wand2, RefreshCw, ZoomIn, ZoomOut, Eye,
  Smartphone, Monitor, Tablet, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { POSES_3D } from "../data";

interface WorkspaceProps {
  project: Project;
  characters: Character[];
  outfits: Outfit[];
  backgrounds: BackgroundPreset[];
  onBackToDashboard: () => void;
  onUpdateProject: (updatedProject: Project) => void;
}

export default function Workspace({
  project,
  characters,
  outfits,
  backgrounds,
  onBackToDashboard,
  onUpdateProject
}: WorkspaceProps) {
  const [selectedCutId, setSelectedCutId] = useState<string | null>(
    project.cuts.length > 0 ? project.cuts[0].id : null
  );

  // Responsive Workspace Views for Tablet & Mobile (Tabs: 'canvas' | 'assets' | 'properties')
  const [mobileActivePanel, setMobileActivePanel] = useState<"canvas" | "assets" | "properties">("canvas");

  // Local helper state for action loadings
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [isRenderingCut, setIsRenderingCut] = useState(false);
  const [notification, setNotification] = useState("");

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const selectedCut = project.cuts.find(c => c.id === selectedCutId) || project.cuts[0];

  useEffect(() => {
    if (project.cuts.length > 0 && !selectedCutId) {
      setSelectedCutId(project.cuts[0].id);
    }
  }, [project, selectedCutId]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // 1. ADD NEW CUT/FRAME
  const handleAddCut = () => {
    const nextOrder = project.cuts.length + 1;
    const newCut: Cut = {
      id: `cut-${Date.now()}`,
      order: nextOrder,
      compositionLayout: "medium-shot",
      backgroundColorStart: "#e2e8f0",
      backgroundColorEnd: "#cbd5e1",
      speechBubbleText: "새로운 대사를 입력해주세요...",
      speechBubbleType: "normal",
      characterExpression: "normal",
      characterPoseAsset: "default-face",
      pacingSubtitle: `[신규 장면] 시간과 장소를 연출하는 서사 단추입니다.`,
      actionLinesIntensity: "none",
      backgroundPresetId: backgrounds[0]?.id || "bg-school",
      assignedCharacterId: characters[0]?.id || "char-mina",
      assignedOutfitId: outfits[0]?.id || "out-uniform",
      promptNotes: "새 컷에 관한 간략한 시놉시스"
    };

    const updated = {
      ...project,
      lastModified: new Date().toISOString(),
      cuts: [...project.cuts, newCut]
    };
    onUpdateProject(updated);
    setSelectedCutId(newCut.id);
    showToast("새 컷 프레임이 추가되었습니다.");
  };

  // 2. DELETE SELECTIVE CUT
  const handleDeleteCut = (cutId: string) => {
    if (project.cuts.length <= 1) {
      showToast("최소 1개 이상의 원고 컷 패널이 상주해야 합니다.");
      return;
    }
    const filteredCuts = project.cuts.filter(c => c.id !== cutId).map((c, idx) => ({
      ...c,
      order: idx + 1
    }));
    const nextSelect = filteredCuts[0]?.id || null;

    onUpdateProject({
      ...project,
      lastModified: new Date().toISOString(),
      cuts: filteredCuts
    });
    setSelectedCutId(nextSelect);
    showToast("컷 프레임이 정리되었습니다.");
  };

  // 3. DUPLICATE STANDARD CUT
  const handleDuplicateCut = (cut: Cut) => {
    const dupCut: Cut = {
      ...cut,
      id: `cut-dup-${Date.now()}`,
      order: project.cuts.length + 1
    };
    onUpdateProject({
      ...project,
      lastModified: new Date().toISOString(),
      cuts: [...project.cuts, dupCut]
    });
    setSelectedCutId(dupCut.id);
    showToast("프레임 컷이 성공적으로 복제되었습니다.");
  };

  // 4. CHANGE FRAME ORDER (UP & DOWN)
  const handleMoveOrder = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === project.cuts.length - 1) return;

    const newCuts = [...project.cuts];
    const swapTarget = direction === "up" ? idx - 1 : idx + 1;
    const temp = newCuts[idx];
    newCuts[idx] = newCuts[swapTarget];
    newCuts[swapTarget] = temp;

    const updatedCuts = newCuts.map((c, i) => ({
      ...c,
      order: i + 1
    }));

    onUpdateProject({
      ...project,
      lastModified: new Date().toISOString(),
      cuts: updatedCuts
    });
    showToast("스토리 컷 순서를 재구성했습니다.");
  };

  // 5. HELPER: UPDATE INDIVIDUAL CUT ATTRIBUTE
  const updateActiveCutFields = (fields: Partial<Cut>) => {
    if (!selectedCutId) return;
    const updatedCuts = project.cuts.map(c => {
      if (c.id === selectedCutId) {
        return { ...c, ...fields };
      }
      return c;
    });
    onUpdateProject({
      ...project,
      lastModified: new Date().toISOString(),
      cuts: updatedCuts
    });
  };

  // 6. SERVER-SIDE OPTIMIZATIONS: GEMINI PROMPT ENHANCEMENT ENGINE
  const handleEnhancePromptWithAI = async () => {
    if (!selectedCut) return;
    setIsEnhancingPrompt(true);

    try {
      const response = await fetch("/api/prompt-engine/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          storyIdea: selectedCut.promptNotes || "비오는 날 정류장에서 슬퍼하고 소리 치는 장면" 
        })
      });
      const data = await response.json();
      if (data.success) {
        updateActiveCutFields({
          promptNotes: data.enhancedPrompt || selectedCut.promptNotes,
          speechBubbleText: data.dialogueText || selectedCut.speechBubbleText,
          pacingSubtitle: data.pacingSubtitle || `교차 연출: ${data.cameraAngle || ""}, ${data.lighting || ""}`,
        });
        showToast("🪄 Gemini 보정 엔진: 연출 구도가 극대화 보정되었습니다!");
      }
    } catch (e) {
      console.error(e);
      showToast("보정 API 호출 실패. 실시간 로컬 조절로 대체합니다.");
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // 7. SERVER-SIDE OPTIMIZATIONS: GEMINI CANVAS COMPOSITION RENDERER
  const handleRenderCutWithAI = async () => {
    if (!selectedCut) return;
    setIsRenderingCut(true);

    // Set cut as rendering
    const cutsPreLoading = project.cuts.map(c => {
      if (c.id === selectedCutId) return { ...c, isRendering: true };
      return c;
    });
    onUpdateProject({ ...project, cuts: cutsPreLoading });

    const activeChar = characters.find(ch => ch.id === selectedCut.assignedCharacterId);
    const activeOutfit = outfits.find(ot => ot.id === selectedCut.assignedOutfitId);
    const activeBG = backgrounds.find(b => b.id === selectedCut.backgroundPresetId);

    try {
      const response = await fetch("/api/canvas/render-cut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: activeChar?.name || "한민아",
          characterExpression: selectedCut.characterExpression,
          outfitName: activeOutfit?.name || "standard",
          backgroundType: activeBG?.type || "school",
          customDescription: selectedCut.promptNotes || "",
          poseType: selectedCut.characterPoseAsset
        })
      });

      const data = await response.json();
      if (data.success) {
        updateActiveCutFields({
          backgroundColorStart: data.backgroundColorStart,
          backgroundColorEnd: data.backgroundColorEnd,
          speechBubbleText: data.speechBubbleText,
          speechBubbleType: data.speechBubbleType || selectedCut.speechBubbleType,
          pacingSubtitle: data.pacingSubtitle,
          actionLinesIntensity: data.actionLinesIntensity || selectedCut.actionLinesIntensity,
          characterPoseAsset: data.characterPoseAsset || selectedCut.characterPoseAsset,
          isRendering: false
        });
        showToast("⚡ AI 원클릭 작화 렌더링이 완성되었습니다.");
      }
    } catch (e) {
      console.error(e);
      // Remove loading status
      updateActiveCutFields({ isRendering: false });
      showToast("렌더링 실패. 클라이언트 벡터 생성 모드로 보존합니다.");
    } finally {
      setIsRenderingCut(false);
    }
  };

  // 8. CUSTOM HIGH-FIDELITY VECTOR COMIC ART COMPILER
  // Dynamically outputs custom animated SVGs/Elements styled exactly to state properties
  const renderCutCardArt = (cut: Cut) => {
    const activeChar = characters.find(ch => ch.id === cut.assignedCharacterId) || characters[0];
    const activeOutfit = outfits.find(ot => ot.id === cut.assignedOutfitId) || outfits[0];
    const activeBG = backgrounds.find(bg => bg.id === cut.backgroundPresetId) || backgrounds[0];

    // Determine facial expression stroke parameters
    let mouthPath = "M 13,20 Q 16,23 19,20"; // Smile / Normal
    let eyeLeft = "M 10,14 L 14,14";
    let eyeRight = "M 18,14 L 22,14";
    let cheekBlush = false;
    let extraEmotionalFX = null;

    if (cut.characterExpression === "happy") {
      mouthPath = "M 12,19 Q 16,24 20,19";
      eyeLeft = "M 10,16 Q 12,12 14,16";
      eyeRight = "M 18,16 Q 20,12 22,16";
      cheekBlush = true;
    } else if (cut.characterExpression === "sad") {
      mouthPath = "M 13,21 Q 16,18 19,21"; // Sad frown
      eyeLeft = "M 10,13 Q 12,15 14,13";
      eyeRight = "M 18,13 Q 20,15 22,13";
      extraEmotionalFX = (
        <g fill="#bae6fd" className="animate-bounce">
          <circle cx="10" cy="18" r="1.5" />
          <circle cx="21" cy="19" r="1.5" />
        </g>
      );
    } else if (cut.characterExpression === "angry") {
      mouthPath = "M 12,21 L 20,21"; // Tight row
      eyeLeft = "M 9,16 L 13,13";
      eyeRight = "M 23,16 L 19,13";
      extraEmotionalFX = (
        <g stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 5,6 L 9,9" />
          <path d="M 27,6 L 23,9" />
        </g>
      );
    } else if (cut.characterExpression === "shocked") {
      mouthPath = "M 14,21 Q 16,24 18,21 Z"; // O mouth
      eyeLeft = "M 12,14 A 2,2 0 1,1 12.01,14";
      eyeRight = "M 20,14 A 2,2 0 1,1 20.01,14";
      cheekBlush = true;
      extraEmotionalFX = (
        <g stroke="#f43f5e" strokeWidth="1" strokeDasharray="1" fill="none">
          <circle cx="16" cy="17" r="11" />
        </g>
      );
    }

    // Determine layout offsets of character inside frame bounding box
    const scaleFactor = cut.scale || 1.0;
    const offX = cut.offsetX || 0;
    const offY = cut.offsetY || 0;

    // Determine custom color styling for apparel
    const clothingBaseColor = activeOutfit?.color.includes("네이비") ? "#1e3a8a" : activeOutfit?.color.includes("라벤더") ? "#c084fc" : "#0f172a";

    // 3D pose composition skeleton vector rendering
    const renderPoseSkeleton = () => {
      switch (cut.characterPoseAsset) {
        case "pointing":
          return (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
              {/* Spine */}
              <line x1="20" y1="20" x2="20" y2="35" />
              {/* Pointing arm */}
              <line x1="20" y1="22" x2="35" y2="15" />
              <line x1="35" y1="15" x2="39" y2="15" strokeWidth="3" />
              {/* Back arm resting */}
              <line x1="20" y1="22" x2="10" y2="28" />
              <line x1="10" y1="28" x2="8" y2="36" />
            </g>
          );
        case "running":
          return (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" className="animate-pulse">
              {/* Leaning torso */}
              <line x1="18" y1="20" x2="24" y2="34" />
              {/* Dynamic legs running */}
              <line x1="24" y1="34" x2="15" y2="44" />
              <line x1="24" y1="34" x2="32" y2="40" />
              <line x1="32" y1="40" x2="28" y2="48" />
              {/* Running arms forward and back */}
              <line x1="20" y1="23" x2="32" y2="18" />
              <line x1="20" y1="23" x2="8" y2="28" />
            </g>
          );
        case "crying-kneel":
          return (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
              {/* Sagging spine */}
              <line x1="20" y1="20" x2="16" y2="32" />
              {/* Hands covering face */}
              <line x1="16" y1="20" x2="13" y2="15" />
              <line x1="13" y1="15" x2="14" y2="12" />
              {/* Kneeling legs */}
              <line x1="16" y1="32" x2="8" y2="34" />
              <line x1="8" y1="34" x2="12" y2="36" />
            </g>
          );
        case "shouting-arm":
          return (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="1">
              {/* Direct front spine */}
              <line x1="20" y1="20" x2="20" y2="36" />
              {/* Both arms raised yelling outward */}
              <line x1="20" y1="22" x2="34" y2="14" />
              <line x1="20" y1="22" x2="6" y2="14" />
            </g>
          );
        case "surprised-hands":
          return (
            <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
              <line x1="20" y1="20" x2="20" y2="35" />
              {/* Hands touching cheeks */}
              <line x1="20" y1="23" x2="13" y2="18" />
              <line x1="13" y1="18" x2="14" y2="14" />
              <line x1="20" y1="23" x2="27" y2="18" />
              <line x1="27" y1="18" x2="26" y2="14" />
            </g>
          );
        case "back-looking":
          return (
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
              {/* Spine facing away */}
              <line x1="20" y1="20" x2="22" y2="36" />
              {/* Lower shoulder outlines */}
              <line x1="22" y1="23" x2="10" y2="25" />
              <line x1="22" y1="23" x2="32" y2="24" />
            </g>
          );
        default:
          return (
            <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8">
              {/* Normal standing portrait shoulder skeletal joint */}
              <line x1="20" y1="20" x2="20" y2="38" />
              <line x1="20" y1="23" x2="10" y2="25" />
              <line x1="20" y1="23" x2="30" y2="25" />
            </g>
          );
      }
    };

    return (
      <div 
        className="w-full relative overflow-hidden transition-all duration-300 select-none flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${cut.backgroundColorStart || "#e2e8f0"}, ${cut.backgroundColorEnd || "#cbd5e1"})`,
          aspectRatio: "3/4"
        }}
        id={`frame-stage-${cut.id}`}
      >
        {/* Dynamic Action Lines Overlays */}
        {cut.actionLinesIntensity === "high" && (
          <div className="absolute inset-0 z-10 pointer-events-none opacity-45 mix-blend-overlay animate-pulse bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(255,255,255,0.85)_100%)]">
            <svg className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" opacity="0.6">
              <line x1="0" y1="0" x2="80" y2="80" />
              <line x1="100%" y1="0" x2="calc(100% - 80px)" y2="80" />
              <line x1="0" y1="100%" x2="80" y2="calc(100% - 80px)" />
              <line x1="100%" y1="100%" x2="calc(100% - 80px)" y2="calc(100% - 80px)" />
              <line x1="50%" y1="0" x2="50%" y2="60" />
              <line x1="50%" y1="100%" x2="50%" y2="calc(100% - 60px)" />
            </svg>
          </div>
        )}
        {cut.actionLinesIntensity === "low" && (
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-20 mix-blend-color-dodge">
            {/* Speed dots or action overlay stripes */}
            <div className="w-full h-full bg-repeating-linear bg-gradient-to-tr from-transparent via-slate-100/10 to-transparent" />
          </div>
        )}

        {/* Dynamic Background presets overlays visual details e.g: School classroom elements, Night lights */}
        <div className="absolute inset-0 opacity-15 pointer-events-none select-none">
          {activeBG?.type === "school" && (
            <svg className="w-full h-full text-indigo-900" fill="none" stroke="currentColor" strokeWidth="2">
              {/* Classroom windows outline */}
              <rect x="10%" y="10%" width="30%" height="40%" />
              <line x1="25%" y1="10%" x2="25%" y2="50%" />
              <line x1="10%" y1="30%" x2="40%" y2="30%" />
              {/* Petals falling */}
              <circle cx="20%" cy="30%" r="3" fill="#fda4af" />
              <circle cx="70%" cy="15%" r="2" fill="#fda4af" />
              <circle cx="85%" cy="40%" r="4" fill="#fda4af" />
            </svg>
          )}
          {activeBG?.type === "street" && (
            <svg className="w-full h-full text-slate-800" fill="currentColor">
              {/* Dynamic Streetlights */}
              <circle cx="20%" cy="20%" r="15" fill="#fef08a" opacity="0.3" />
              <rect x="18%" y="20%" width="4" height="80%" fill="#475569" />
              {/* Falling rain streaks */}
              <svg className="w-full h-full text-sky-400/50" stroke="currentColor" strokeWidth="1">
                <line x1="10%" y1="5%" x2="8%" y2="25%" />
                <line x1="50%" y1="15%" x2="48%" y2="40%" />
                <line x1="85%" y1="8%" x2="83%" y2="28%" />
                <line x1="30%" y1="35%" x2="28%" y2="60%" />
                <line x1="75%" y1="45%" x2="73%" y2="70%" />
              </svg>
            </svg>
          )}
          {activeBG?.type === "cafe" && (
            <svg className="w-full h-full text-amber-900" fill="none" stroke="currentColor" strokeWidth="1.5">
              {/* Coffee table cup silhouette outline */}
              <circle cx="80%" cy="85%" r="12" />
              <path d="M 80,75 L 80,70 Q 82,68 84,70 Q 86,72 84,75" />
              <line x1="50%" y1="80%" x2="90%" y2="80%" strokeWidth="3" />
            </svg>
          )}
          {activeBG?.type === "sunset" && (
            <svg className="w-full h-full text-amber-500" fill="currentColor">
              {/* Big setting sun */}
              <circle cx="50%" cy="60%" r="40" opacity="0.2" fill="#f59e0b" />
              {/* Distant mountains/buildings */}
              <path d="M 0,80 L 30,65 L 60,75 L 80,68 L 100,74 L 100,100 L 0,100 Z" opacity="0.3" fill="#1e1b4b" />
            </svg>
          )}
          {activeBG?.type === "fantasy" && (
            <svg className="w-full h-full text-indigo-400" fill="currentColor">
              {/* Radiant particles & stars */}
              <polygon points="12,5 15,9 20,10 16,13 18,18 12,15 6,18 8,13 4,10 9,9" className="animate-spin" opacity="0.3" />
              <circle cx="80%" cy="20%" r="3" />
              <circle cx="20%" cy="70%" r="5" className="animate-ping" />
              <circle cx="65%" cy="55%" r="2" />
            </svg>
          )}
        </div>

        {/* Dynamic Character Layout Canvas block */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{
            transform: `scale(${scaleFactor}) translate(${offX}px, ${offY}px)`
          }}
        >
          {/* Animated composite anime figure rendering */}
          <div className="w-44 h-56 relative flex items-center justify-center">
            
            {/* Simple Dynamic Visual Shadow */}
            <div className="absolute bottom-4 w-28 h-6 bg-black/15 blur-md rounded-full pointer-events-none" />

            {/* Core Cartoon Vector Wrapper */}
            <svg className="w-40 h-52 drop-shadow-xl" viewBox="0 0 40 50">
              
              {/* Hair Base Back Draft */}
              <circle 
                cx="20" 
                cy="14" 
                r="7.5" 
                fill={activeChar?.palettes[1] || "#3b82f6"} 
              />

              {/* Character Costume Shirt Body base */}
              <path 
                d="M 12,25 C 10,34 9,48 9,50 L 31,50 C 31,48 30,34 28,25 Z" 
                fill={clothingBaseColor} 
              />
              {/* Collar details */}
              <path d="M 16,25 L 20,30 L 24,25" stroke="#ffffff" strokeWidth="1" fill="none" />

              {/* Neck segment */}
              <rect x="18.5" y="21" width="3" height="4" fill={activeChar?.skinTone.includes("맑") ? "#ffedd5" : "#f59e0b"} />

              {/* Head / Face circle */}
              <circle 
                cx="20" 
                cy="16" 
                r="6.5" 
                fill={activeChar?.skinTone.includes("맑") ? "#fed7aa" : "#f59e0b"} 
              />

              {/* Facial features expression drawer */}
              <g stroke="#1e293b" strokeWidth="0.8" strokeLinecap="round" fill="none">
                {/* Dynamic Eyebrows & Eyes */}
                <path d={eyeLeft} />
                <path d={eyeRight} />
                
                {/* Rosy blush cheeks */}
                {cheekBlush && (
                  <g fill="#f43f5e" opacity="0.4" stroke="none">
                    <circle cx="15.5" cy="17.5" r="1.2" />
                    <circle cx="24.5" cy="17.5" r="1.2" />
                  </g>
                )}

                {/* Mouth vector path */}
                <path d={mouthPath} fill={cut.characterExpression === "shocked" ? "#f43f5e" : "none"} />
              </g>

              {/* Hair strands front top layer with specific signature coloring */}
              <path 
                d="M 12.5,13 Q 20,8 27.5,13 Q 24,15 20,13 Q 16,15 12.5,13 Z" 
                fill={activeChar?.palettes[1] || "#1e3a8a"} 
              />
              <path 
                d="M 12,13 L 13.5,19 M 28,13 L 26.5,19" 
                stroke={activeChar?.palettes[1] || "#1e3a8a"} 
                strokeWidth="2" 
                strokeLinecap="round" 
              />

              {/* Extra emotion visuals (tears, angry red marks) */}
              {extraEmotionalFX}

              {/* 3D Skeleton Pose Overlay lines */}
              {renderPoseSkeleton()}
            </svg>
          </div>
        </div>

        {/* Dialog bubble overlay section */}
        {cut.speechBubbleType !== "none" && (
          <div className="absolute top-4 left-4 right-4 z-30 select-none flex justify-center">
            {cut.speechBubbleType === "scream" ? (
              // Jagged violent scream background bubble
              <div className="bg-white border-2 border-slate-900 text-slate-900 font-extrabold text-[11px] px-3 py-2 max-w-[90%] shadow-lg relative speech-jagged">
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-900" />
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-white" />
                <p className="line-clamp-2 leading-tight tracking-tight text-center">{cut.speechBubbleText}</p>
              </div>
            ) : cut.speechBubbleType === "thought" ? (
              // Cloud bubble outline
              <div className="bg-slate-50/95 text-slate-800 border border-slate-300 font-medium text-[11px] px-3.5 py-2 rounded-2xl max-w-[90%] shadow-md text-center rounded-br-none font-sans relative">
                <div className="absolute -bottom-2 right-4 w-2.5 h-2.5 bg-slate-50 border-r border-b border-slate-300 rounded-full" />
                <p className="line-clamp-2 leading-relaxed">{cut.speechBubbleText}</p>
              </div>
            ) : cut.speechBubbleType === "whisper" ? (
              // Dashed quiet bubble
              <div className="bg-white/90 backdrop-blur-sm border border-dashed border-slate-400 text-slate-500 text-[10px] px-3 py-1.5 rounded-xl max-w-[85%] text-center italic relative">
                <p className="line-clamp-2">{cut.speechBubbleText}</p>
              </div>
            ) : (
              // Standard professional white balloon
              <div className="bg-white text-slate-900 font-medium text-[11px] px-4 py-2 rounded-full max-w-[90%] shadow-md border border-slate-200/80 text-center relative">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white" />
                <p className="line-clamp-2 leading-snug">{cut.speechBubbleText}</p>
              </div>
            )}
          </div>
        )}

        {/* Narrative caption box at secondary visual priority */}
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none select-none">
          <div className="bg-slate-950/80 border border-slate-800/80 px-2.5 py-1.5 rounded text-[10px] text-slate-300 leading-snug shadow">
            <span className="text-amber-400 font-bold mr-1.5">NARRATIVE</span>
            {cut.pacingSubtitle}
          </div>
        </div>

        {/* Frame Spinner Render Indicator */}
        {cut.isRendering && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center z-40">
            <RefreshCw className="w-10 h-10 animate-spin text-indigo-400 mb-3" />
            <span className="text-xs font-mono font-semibold text-white animate-pulse">Rendering K-Webtoon cell...</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 text-white flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Subheading Nav */}
      <div className="bg-slate-900 border-b border-slate-800/70 py-3.5 px-6 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            id="btn-workspace-back"
            className="p-1 px-2.5 py-1.5 text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> <span>목록으로</span>
          </button>
          
          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />
          
          <div className="hidden sm:block">
            <span className="text-[10px] text-indigo-400 font-mono tracking-wider font-bold">ACTIVE STORYBOARD MODULE</span>
            <h3 className="text-sm font-bold text-slate-200 truncate -mt-1">{project.title}</h3>
          </div>
        </div>

        {/* Dynamic Responsive Workspace Panel Selector (for Mobile & Tablet viewports) */}
        <div className="flex xl:hidden items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setMobileActivePanel("assets")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              mobileActivePanel === "assets"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            에셋고 ({characters.length})
          </button>
          <button
            onClick={() => setMobileActivePanel("canvas")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              mobileActivePanel === "canvas"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            원고 캔버스
          </button>
          <button
            onClick={() => setMobileActivePanel("properties")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              mobileActivePanel === "properties"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            속성/AI편집
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddCut}
            id="btn-quick-add-cut"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> <span>컷 추가</span>
          </button>
        </div>
      </div>

      {/* Main 3-Section Studio Core */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        
        {/* PANEL A: LEFT ASSET PANEL (Hidden on non-excel under mobile active state) */}
        <aside 
          className={`w-80 border-r border-slate-800/80 bg-slate-900 flex-col shrink-0 overflow-y-auto p-5 space-y-6 ${
            mobileActivePanel === "assets" ? "flex absolute inset-0 z-30 bg-slate-900 w-full" : "hidden xl:flex"
          }`}
          id="panel-assets-drawer"
        >
          {/* Character Quick assign */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">1. 대상 등장 캐릭터</span>
            <div className="space-y-2">
              {characters.map(char => {
                const isAssigned = selectedCut?.assignedCharacterId === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => updateActiveCutFields({ assignedCharacterId: char.id })}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                      isAssigned 
                        ? "border-indigo-500 bg-indigo-500/5 text-white" 
                        : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <Smile className={`w-4 h-4 ${isAssigned ? "text-indigo-400" : "text-slate-500"}`} />
                      </div>
                      <span className="text-xs font-bold truncate">{char.name}</span>
                    </div>
                    {isAssigned && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Outfit Wardrobes selector */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">2. 코스튬 의상 락커</span>
            <div className="grid grid-cols-1 gap-2">
              {outfits.map(out => {
                const isAssigned = selectedCut?.assignedOutfitId === out.id;
                return (
                  <button
                    key={out.id}
                    onClick={() => updateActiveCutFields({ assignedOutfitId: out.id })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isAssigned 
                        ? "border-indigo-500 bg-indigo-500/5 text-slate-100" 
                        : "border-slate-800 bg-slate-950/30 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="truncate max-w-[140px]">{out.name}</span>
                      {isAssigned && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-1">상의: {out.top}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background presets assigning */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">3. 배경 장소 스테이지</span>
            <div className="grid grid-cols-2 gap-2">
              {backgrounds.map(bg => {
                const isAssigned = selectedCut?.backgroundPresetId === bg.id;
                return (
                  <button
                    key={bg.id}
                    onClick={() => updateActiveCutFields({ backgroundPresetId: bg.id })}
                    className={`p-2 rounded-xl text-left border cursor-pointer text-xs transition-all relative overflow-hidden h-14 flex flex-col justify-end ${
                      isAssigned 
                        ? "border-indigo-400 ring-1 ring-indigo-400" 
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})`
                    }}
                  >
                    <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
                    <span className="relative z-10 text-[10px] font-bold text-white tracking-tight leading-tight line-clamp-1 truncate w-full">
                      {bg.name.replace(" 날리는 아늑한 ", " ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Poses skeleton shortcuts */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">4. 3D 카메라 &amp; 포즈 구도</span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {POSES_3D.map(ps => {
                const isSelected = selectedCut?.characterPoseAsset === ps.id;
                return (
                  <button
                    key={ps.id}
                    onClick={() => updateActiveCutFields({ characterPoseAsset: ps.id as any })}
                    className={`w-full p-2 rounded-lg text-left text-xs cursor-pointer transition-all border ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-500/10 text-white font-bold"
                        : "border-slate-800 bg-slate-950/20 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{ps.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PANEL B: CENTER SCROLLABLE WEBTOON CANVAS (Widescreen Focus) */}
        <main 
          className={`flex-1 bg-slate-950 overflow-y-auto p-4 md:p-8 relative min-w-0 ${
            mobileActivePanel === "canvas" ? "flex" : "hidden xl:flex"
          } flex-col items-center`}
          ref={canvasContainerRef}
          id="panel-scroll-canvas"
        >
          {/* Scroll instruction banner */}
          <div className="text-center text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-6">
            <span>↓ Naver/Kakao 800px Standard Filmstrip Scroll Viewport ↓</span>
          </div>

          {/* Scrollable vertical wrapper container */}
          <div className="w-full max-w-[420px] bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col gap-5 relative">
            
            {project.cuts.map((cut, idx) => {
              const isActive = cut.id === selectedCutId;
              return (
                <div
                  key={cut.id}
                  onClick={() => setSelectedCutId(cut.id)}
                  className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer relative group ${
                    isActive 
                      ? "border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.01]" 
                      : "border-slate-800/80 hover:border-slate-700 scale-100"
                  }`}
                >
                  {/* Dynamic Cut Visual Card Art */}
                  {renderCutCardArt(cut)}

                  {/* Cut Floating Control Drawer on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-30 bg-slate-900/90 backdrop-blur px-2 py-1 rounded-xl border border-slate-700/80">
                    <span className="text-[10px] font-bold font-mono text-indigo-400 mr-2">#{idx + 1} CUT</span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveOrder(idx, "up");
                      }}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="위로 이동"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveOrder(idx, "down");
                      }}
                      disabled={idx === project.cuts.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                      title="아래로 이동"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateCut(cut);
                      }}
                      className="p-1 text-slate-450 hover:text-indigo-400"
                      title="컷 복제"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCut(cut.id);
                      }}
                      className="p-1 text-slate-450 hover:text-rose-400"
                      title="컷 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Add button inside filmstrip */}
            <button
              onClick={handleAddCut}
              className="py-6 border border-dashed border-slate-800 hover:border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-slate-500 hover:text-indigo-400"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-semibold">새로운 씬/컷 프레임 배치</span>
            </button>
          </div>
        </main>

        {/* PANEL C: RIGHT ATTRIBUTE & AI GEMINI CONTROLS EDITING PANEL (Hidden on non-excel under mobile state) */}
        <aside 
          className={`w-96 border-l border-slate-800/80 bg-slate-900 shrink-0 overflow-y-auto p-5 flex-col space-y-5 ${
            mobileActivePanel === "properties" ? "flex absolute inset-0 z-30 bg-slate-900 w-full" : "hidden xl:flex"
          }`}
          id="panel-controls-attribute"
        >
          {selectedCut ? (
            <div className="space-y-5">
              
              {/* Heading specifications */}
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-fuchsia-400 font-mono tracking-wider font-bold">ATTRIBUTES CONSOLE</span>
                <h4 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>선택된 {selectedCut.order}번 프레임 편집</span>
                  <span className="text-xs font-mono text-slate-500">ID: {selectedCut.id.slice(0, 7)}</span>
                </h4>
              </div>

              {/* CORE AI GEMINI ASSISTANT FEATURE BLOCKS */}
              <div className="bg-gradient-to-tr from-slate-950 via-indigo-950/20 to-slate-950 border border-indigo-500/15 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Gemini-3.5 연출 보조 AI 엔진</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">스토리 단초 / 간단 묘사 입력</label>
                    <textarea
                      className="w-full h-16 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none placeholder-slate-700"
                      placeholder="비 내리는 저물녘 골목길 신이 나며, 남주인공이 여주에게 우산을 건네는 연출"
                      value={selectedCut.promptNotes}
                      onChange={(e) => updateActiveCutFields({ promptNotes: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleEnhancePromptWithAI}
                      disabled={isEnhancingPrompt}
                      id="btn-ai-prompt-enhance"
                      className="py-1.5 px-2 bg-slate-850 hover:bg-slate-800 disabled:opacity-40 text-[10px] font-bold text-indigo-300 rounded-lg flex items-center justify-center gap-1 border border-slate-800 cursor-pointer"
                    >
                      {isEnhancingPrompt ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>🪄 구도 보정</span>
                    </button>
                    
                    <button
                      onClick={handleRenderCutWithAI}
                      disabled={isRenderingCut}
                      id="btn-ai-cut-render"
                      className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-[10px] font-bold text-white rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isRenderingCut ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>⚡ 작화 렌더링</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Character Face & Emotion shortcuts inside attribute */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400">인물 감정 표현 (Expression)</label>
                <div className="grid grid-cols-5 gap-1 text-[11px]">
                  {["normal", "happy", "sad", "angry", "shocked"].map(em => {
                    const isSelected = selectedCut.characterExpression === em;
                    return (
                      <button
                        key={em}
                        onClick={() => updateActiveCutFields({ characterExpression: em as any })}
                        className={`py-1 rounded border text-center font-bold capitalize cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-indigo-500 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        {em === "normal" ? "평온" : em === "happy" ? "웃음" : em === "sad" ? "슬픔" : em === "angry" ? "성남" : "놀람"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Speech bubble dialogue modifiers */}
              <div className="space-y-3 bg-slate-950/30 p-3.5 rounded-xl border border-slate-850">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">말풍선 대사 (Speech text)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                    value={selectedCut.speechBubbleText}
                    onChange={(e) => updateActiveCutFields({ speechBubbleText: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">말풍선 형태</label>
                    <select
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs"
                      value={selectedCut.speechBubbleType}
                      onChange={(e) => updateActiveCutFields({ speechBubbleType: e.target.value as any })}
                    >
                      <option value="normal">표준형 (대화)</option>
                      <option value="scream">폭발형 (외침)</option>
                      <option value="thought">구름형 (생각)</option>
                      <option value="whisper">점선형 (독백)</option>
                      <option value="none">말풍선 미배치</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">속화선 강도</label>
                    <select
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-xs"
                      value={selectedCut.actionLinesIntensity}
                      onChange={(e) => updateActiveCutFields({ actionLinesIntensity: e.target.value as any })}
                    >
                      <option value="none">속화선 없음</option>
                      <option value="low">약함 (속도감)</option>
                      <option value="high">강함 (쇼크/타격)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subtitle pacing label */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">장면 묘사 자막 (Narrative)</label>
                <input
                  type="text"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs"
                  value={selectedCut.pacingSubtitle}
                  onChange={(e) => updateActiveCutFields({ pacingSubtitle: e.target.value })}
                />
              </div>

              {/* Canvas scaling properties manually */}
              <div className="space-y-2 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">구도 입자 미세 조절 (Manual Offset)</span>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>크기 비율 (Scale): {(selectedCut.scale || 1.0).toFixed(2)}x</span>
                    <div className="flex gap-1">
                      <button onClick={() => updateActiveCutFields({ scale: Math.max(0.5, (selectedCut.scale || 1.0) - 0.05) })} className="p-1 px-1.5 bg-slate-950/80 rounded border border-slate-800"><ZoomOut className="w-3 h-3" /></button>
                      <button onClick={() => updateActiveCutFields({ scale: Math.min(2.0, (selectedCut.scale || 1.0) + 0.05) })} className="p-1 px-1.5 bg-slate-950/80 rounded border border-slate-800"><ZoomIn className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <label className="block text-[10px] text-slate-550 mb-0.5">X 오프셋: {selectedCut.offsetX || 0}px</label>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      className="w-full accent-indigo-500 h-1"
                      value={selectedCut.offsetX || 0}
                      onChange={(e) => updateActiveCutFields({ offsetX: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-550 mb-0.5">Y 오프셋: {selectedCut.offsetY || 0}px</label>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      className="w-full accent-indigo-500 h-1"
                      value={selectedCut.offsetY || 0}
                      onChange={(e) => updateActiveCutFields({ offsetY: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Frame delete trigger buttons */}
              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => handleDuplicateCut(selectedCut)}
                  className="flex-1 py-1.5 bg-slate-950/80 hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-350 border border-slate-800 text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> <span>장면 복제</span>
                </button>
                <button
                  onClick={() => handleDeleteCut(selectedCut.id)}
                  className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/20 text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> <span>장면 제외</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-xs text-slate-500">편집 중인 만화 씬이 없습니다.</span>
            </div>
          )}
        </aside>

      </div>

    </div>
  );
}
