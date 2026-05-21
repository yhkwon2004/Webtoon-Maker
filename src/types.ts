/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CharacterFacialSet {
  normal: string;
  happy: string;
  sad: string;
  angry: string;
  shocked: string;
}

export interface Character {
  id: string;
  name: string;
  brief: string;
  genderAge: string;
  skinTone: string;
  hairStyle: string;
  features: string;
  personality: string;
  facialSet: CharacterFacialSet;
  palettes: string[];
  keywords: string[];
  styleChoice: string;
}

export interface Outfit {
  id: string;
  name: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  color: string;
  season: string;
  situation: string;
  isDefault?: boolean;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'school' | 'street' | 'cafe' | 'sunset' | 'night' | 'fantasy' | 'office' | 'urban';
  description: string;
  colors: [string, string];
  weather?: string;
  dayNight?: 'day' | 'night' | 'sunset';
}

export interface Cut {
  id: string;
  order: number;
  compositionLayout: string; // e.g. 'extreme-closeup' | 'close-up' | 'medium-shot' | 'full-shot'
  backgroundColorStart: string;
  backgroundColorEnd: string;
  speechBubbleText: string;
  speechBubbleType: 'normal' | 'scream' | 'thought' | 'whisper' | 'none';
  characterExpression: 'normal' | 'happy' | 'sad' | 'angry' | 'shocked';
  characterPoseAsset: 'default-face' | 'pointing' | 'running' | 'crying-kneel' | 'shouting-arm' | 'surprised-hands' | 'back-looking';
  pacingSubtitle: string;
  actionLinesIntensity: 'none' | 'low' | 'high';
  assignedCharacterId?: string;
  assignedOutfitId?: string;
  backgroundPresetId: string;
  promptNotes: string;
  isRendering?: boolean;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lastModified: string;
  cuts: Cut[];
  characterIds: string[];
  outfitIds: string[];
}
