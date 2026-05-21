/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Splash from "./components/Splash";
import MainPage from "./components/MainPage";
import CharacterSheetCreator from "./components/CharacterSheetCreator";
import Workspace from "./components/Workspace";
import { Project, Character, Outfit, BackgroundPreset } from "./types";
import { 
  DEFAULT_PROJECTS, 
  DEFAULT_CHARACTERS, 
  DEFAULT_OUTFITS, 
  BACKGROUND_PRESETS 
} from "./data";

export default function App() {
  const [view, setView] = useState<"splash" | "main" | "character-creator" | "workspace">("splash");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Loaded database states
  const [projects, setProjects] = useState<Project[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundPreset[]>(BACKGROUND_PRESETS);
  
  // Navigation active selection
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Initialize and Seed storage
  useEffect(() => {
    // 1. Restore/Authenticate user if saved
    const savedEmail = localStorage.getItem("webtoon_studio_user");
    if (savedEmail) {
      setUserEmail(savedEmail);
    }

    // 2. Load or seed projects
    const storedProjects = localStorage.getItem("webtoon_studio_projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      localStorage.setItem("webtoon_studio_projects", JSON.stringify(DEFAULT_PROJECTS));
      setProjects(DEFAULT_PROJECTS);
    }

    // 3. Load or seed characters
    const storedCharacters = localStorage.getItem("webtoon_studio_characters");
    if (storedCharacters) {
      setCharacters(JSON.parse(storedCharacters));
    } else {
      localStorage.setItem("webtoon_studio_characters", JSON.stringify(DEFAULT_CHARACTERS));
      setCharacters(DEFAULT_CHARACTERS);
    }

    // 4. Load or seed outfits
    const storedOutfits = localStorage.getItem("webtoon_studio_outfits");
    if (storedOutfits) {
      setOutfits(JSON.parse(storedOutfits));
    } else {
      localStorage.setItem("webtoon_studio_outfits", JSON.stringify(DEFAULT_OUTFITS));
      setOutfits(DEFAULT_OUTFITS);
    }
  }, []);

  // Sync state helpers to persistent local Storage
  const persistProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem("webtoon_studio_projects", JSON.stringify(updated));
  };

  const persistCharacters = (updated: Character[]) => {
    setCharacters(updated);
    localStorage.setItem("webtoon_studio_characters", JSON.stringify(updated));
  };

  const persistOutfits = (updated: Outfit[]) => {
    setOutfits(updated);
    localStorage.setItem("webtoon_studio_outfits", JSON.stringify(updated));
  };

  // ROUTER HANDLERS
  const handleOnboardComplete = (email: string) => {
    setUserEmail(email);
    setView("main");
  };

  const handleCreateProject = (title: string, desc: string) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title,
      description: desc,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      characterIds: characters.map(c => c.id),
      outfitIds: outfits.map(o => o.id),
      cuts: [
        {
          id: `cut-init-${Date.now()}`,
          order: 1,
          compositionLayout: "medium-shot",
          backgroundColorStart: "#cbd5e1",
          backgroundColorEnd: "#fdba74",
          speechBubbleText: "드디어 우리 차례인가...!",
          speechBubbleType: "normal",
          characterExpression: "happy",
          characterPoseAsset: "default-face",
          pacingSubtitle: "기회의 장이 드디어 위태로운 노을 위에 개방된다.",
          actionLinesIntensity: "none",
          backgroundPresetId: backgrounds[0]?.id || "bg-school",
          assignedCharacterId: characters[0]?.id || "char-mina",
          assignedOutfitId: outfits[0]?.id || "out-uniform",
          promptNotes: "상기되어 기뻐서 외치고 있는 기획 씬"
        }
      ]
    };
    const updatedList = [newProj, ...projects];
    persistProjects(updatedList);
    setSelectedProjectId(newProj.id);
    setView("workspace");
  };

  const handleDeleteProject = (projectId: string) => {
    const filtered = projects.filter(p => p.id !== projectId);
    persistProjects(filtered);
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView("workspace");
  };

  const handleUpdateProject = (updated: Project) => {
    const mapped = projects.map(p => p.id === updated.id ? updated : p);
    persistProjects(mapped);
  };

  const handleSaveCharacter = (newChar: Character) => {
    const updated = [newChar, ...characters];
    persistCharacters(updated);
    setView("main");
  };

  const handleAddOutfit = (newOutfit: Outfit) => {
    const updated = [newOutfit, ...outfits];
    persistOutfits(updated);
  };

  const handleLogOut = () => {
    localStorage.removeItem("webtoon_studio_user");
    localStorage.removeItem("webtoon_studio_nickname");
    setUserEmail(null);
    setView("splash");
  };

  // Setup sample Outfit trigger to extend wardrobe if they want
  const handleOutfitOnDemand = () => {
    const sampleOutfit: Outfit = {
      id: `out-cust-${Date.now()}`,
      name: `캐주얼 스포티 러너 웨어`,
      top: "네온 오렌지 트랙 짚업 자켓",
      bottom: "언더 레이어 블랙 쇼츠",
      shoes: "그레이 에어 포스 런닝화",
      accessories: "화이트 나일론 헤어 밴드",
      color: "오렌지, 블랙",
      season: "여름",
      situation: "야외 조깅, 달리기 시합, 정원 운동"
    };
    handleAddOutfit(sampleOutfit);
    alert("새 의상 '스포티 러너 웨어'가 옷장에 수납되었습니다!");
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-600/30">
      {view === "splash" && (
        <Splash onOnboardComplete={handleOnboardComplete} />
      )}

      {view === "main" && (
        <MainPage
          userEmail={userEmail || "anonymous@studio.com"}
          projects={projects}
          characters={characters}
          outfits={outfits}
          backgrounds={backgrounds}
          onCreateProject={handleCreateProject}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onOpenCharacterSheetCreator={() => setView("character-creator")}
          onOpenOutfitForm={handleOutfitOnDemand}
          onLogOut={handleLogOut}
        />
      )}

      {view === "character-creator" && (
        <CharacterSheetCreator
          onSaveCharacter={handleSaveCharacter}
          onCancel={() => setView("main")}
        />
      )}

      {view === "workspace" && selectedProjectId && (
        (() => {
          const currentProj = projects.find(p => p.id === selectedProjectId);
          if (!currentProj) {
            setView("main");
            return null;
          }
          return (
            <Workspace
              project={currentProj}
              characters={characters}
              outfits={outfits}
              backgrounds={backgrounds}
              onBackToDashboard={() => {
                setSelectedProjectId(null);
                setView("main");
              }}
              onUpdateProject={handleUpdateProject}
            />
          );
        })()
      )}
    </div>
  );
}
