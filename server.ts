import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized Gemini Client");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY provided or it's a placeholder. Offline fallback will be active.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: Test Server Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!ai });
  });

  // API 2: Prompt Enhancement Engine
  app.post("/api/prompt-engine/enhance", async (req, res) => {
    const { storyIdea, modelType = "gemini-3.5-flash" } = req.body;
    if (!storyIdea) {
      return res.status(400).json({ error: "Story idea is required" });
    }

    if (!ai) {
      // Elegant deterministic offline-fallback
      return res.json({
        success: true,
        offline: true,
        originalPrompt: storyIdea,
        enhancedPrompt: `[MOCK ENHANCED] ${storyIdea}. High quality webtoon style, detailed anime linework, dramatic ambient shadows, dynamic webtoon framing.`,
        characterDetails: "Focuses on the active character in the current scene.",
        outfitDetails: "Webtoon style standard clean casual fit.",
        backgroundDetails: "Atmospheric comic background reflecting the story mood.",
        cameraAngle: "Medium Shot (눈높이 정면 촬영)",
        lighting: "자연스러우며 극적인 측면 하이라이트",
        visualStyle: "Modern Webtoon Style (K-Webtoon)",
        dialogueText: "여기에 메인 대사를 입력하세요...",
        actionLinesIntensity: "low",
        speedBubbleType: "normal"
      });
    }

    try {
      const systemPrompt = `You are a professional Webtoon Prompt Director. 
Convert a simplified Korean story idea into highly specified prompts and compositional layouts for webtoon artists/AI image engines.
Return the output in clean JSON format matching the schema requested. Keep descriptions in Korean where helpful for the artist.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          originalPrompt: { type: Type.STRING },
          enhancedPrompt: { type: Type.STRING, description: "Highly-detailed rendering prompt in English/Korean for visual consistency" },
          characterDetails: { type: Type.STRING, description: "Detailed physical/pose/expression directives" },
          outfitDetails: { type: Type.STRING, description: "Specific outfit style, layers, colors" },
          backgroundDetails: { type: Type.STRING, description: "Scenery elements, environment details, weather" },
          cameraAngle: { type: Type.STRING, description: "Camera perspective, e.g. Extreme Close Up, Low Angle, Eye Level" },
          lighting: { type: Type.STRING, description: "Shading mood, light source, colors" },
          visualStyle: { type: Type.STRING, description: "Webtoon art style description" },
          dialogueText: { type: Type.STRING, description: "An estimated dialog speech text appropriate for this dramaturgy" },
          actionLinesIntensity: { type: Type.STRING, description: "Intensity level of action lines or framing speedlines: 'none' | 'low' | 'high'" },
          speechBubbleType: { type: Type.STRING, description: "Type of dialog delivery: 'normal' | 'scream' | 'thought' | 'whisper'" }
        },
        required: ["originalPrompt", "enhancedPrompt", "characterDetails", "backgroundDetails", "cameraAngle", "dialogueText"]
      };

      const result = await ai.models.generateContent({
        model: modelType,
        contents: `Analyze and enhance this story concept into webtoon scene directives: "${storyIdea}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.7,
        }
      });

      if (result.text) {
        const enrichedData = JSON.parse(result.text.trim());
        res.json({ success: true, ...enrichedData });
      } else {
        throw new Error("No response text from Gemini API");
      }
    } catch (err: any) {
      console.error("Gemini enhancement error:", err);
      res.status(500).json({ error: "Gemini operation failed", details: err?.message || err });
    }
  });

  // API 3: Character Sheet Creator
  app.post("/api/character-sheet/generate", async (req, res) => {
    const { name, characterBrief, styleSeed = "classic-anime", modelType = "gemini-3.5-flash" } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Character Name is required" });
    }

    if (!ai) {
      // Elegant offline-fallback
      return res.json({
        success: true,
        offline: true,
        character: {
          name,
          brief: characterBrief || "새로운 웹툰 주인공",
          genderAge: "20대 초반",
          skinTone: "밝은 아몬드 톤",
          hairStyle: "단정하고 세련된 네이비 블루 계열의 스트레이트 헤어",
          features: "다정다감한 눈빛, 살짝 올라간 입꼬리, 이지적인 눈썹",
          personality: "활발하지만 내면에는 말 못할 비밀을 지닌 인물",
          facialSet: {
            normal: "생긋 웃고 있는 친근한 표정",
            happy: "한 가득 웃음을 머금은 활발한 표정",
            sad: "눈물이 맺힐 듯 시선을 아래로 내린 아련하고 슬픈 표정",
            angry: "눈썹을 찌푸리며 입을 꾹 다문 결의에 찬 표정",
            shocked: "눈이 둥그렇게 커지며 입을 살짝 벌린 놀란 표정"
          },
          palettes: ["#e2e8f0", "#1e3a8a", "#f59e0b", "#10b981", "#ef4444"],
          keywords: ["일관성", "명랑만화 주인공", "선명한 이목구비"],
          styleChoice: styleSeed
        }
      });
    }

    try {
      const systemPrompt = `You are a Character Designer for major webtoon syndicates. 
Given a short narrative and a name, output a beautiful, highly detailed Character Asset Specification Sheet in JSON. 
Keep all textual content neatly in Korean.`;

      const csSchema = {
        type: Type.OBJECT,
        properties: {
          character: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              brief: { type: Type.STRING },
              genderAge: { type: Type.STRING, description: "Age, gender and physique metadata" },
              skinTone: { type: Type.STRING },
              hairStyle: { type: Type.STRING },
              features: { type: Type.STRING, description: "Eye shape, eyelashes, scars, jewelry" },
              personality: { type: Type.STRING },
              facialSet: {
                type: Type.OBJECT,
                properties: {
                  normal: { type: Type.STRING },
                  happy: { type: Type.STRING },
                  sad: { type: Type.STRING },
                  angry: { type: Type.STRING },
                  shocked: { type: Type.STRING }
                },
                required: ["normal", "happy", "sad", "angry", "shocked"]
              },
              palettes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5 hex colors matching their aesthetic palette"
              },
              keywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-5 AI generation keywords or tokens"
              },
              styleChoice: { type: Type.STRING }
            },
            required: ["name", "genderAge", "hairStyle", "features", "facialSet", "palettes", "keywords"]
          }
        },
        required: ["character"]
      };

      const result = await ai.models.generateContent({
        model: modelType,
        contents: `Create character sheets for: Name = "${name}", Description = "${characterBrief || "명랑하고 활력이 넘치는 인물"}", Art style = "${styleSeed}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: csSchema,
          temperature: 0.8,
        }
      });

      if (result.text) {
        const sheetData = JSON.parse(result.text.trim());
        res.json({ success: true, ...sheetData });
      } else {
        throw new Error("No response content from Gemini client.");
      }
    } catch (err: any) {
      console.error("Gemini Character Sheet error:", err);
      res.status(500).json({ error: "Gemini server process failed", details: err?.message || err });
    }
  });

  // API 4: Canvas Composition Dynamic Renderer
  // This calculates precise gradients, layout angles, stylized visual paths for the cartoon rendering
  app.post("/api/canvas/render-cut", async (req, res) => {
    const { 
      characterName, 
      characterExpression = "normal", 
      outfitName = "default", 
      backgroundType = "school", 
      customDescription = "",
      poseType = "default-face",
      modelType = "gemini-3.5-flash"
    } = req.body;

    if (!ai) {
      // Extremely creative deterministic color codes and styling based on backgrounds
      const bgColors: Record<string, [string, string]> = {
        school: ["#fef08a", "#bae6fd"],
        street: ["#1e293b", "#0f172a"],
        cafe: ["#fed7aa", "#ffedd5"],
        sunset: ["#fdba74", "#f43f5e"],
        night: ["#1e1b4b", "#03001e"],
        fantasy: ["#c084fc", "#3b0764"],
        office: ["#cbd5e1", "#475569"],
        urban: ["#fda4af", "#701a75"]
      };

      const selectedBGs = bgColors[backgroundType] || ["#f3f4f6", "#e5e7eb"];
      
      return res.json({
        success: true,
        offline: true,
        backgroundColorStart: selectedBGs[0],
        backgroundColorEnd: selectedBGs[1],
        characterPoseAsset: poseType,
        characterExpression: characterExpression,
        backgroundType: backgroundType,
        compositionLayout: "cinematic-horizontal-pacing",
        actionLinesIntensity: customDescription.includes("다이나믹") || customDescription.includes("달려") || customDescription.includes("충격") ? "high" : "low",
        speechBubbleText: customDescription ? `${customDescription.substring(0, 30)}...!` : "세상의 끝에서, 우리가 마주 선 순간.",
        speechBubbleType: characterExpression === "angry" || characterExpression === "shocked" ? "scream" : "normal",
        pacingSubtitle: `[${characterName || "주인공"}]의 눈빛빛이 흔들린다.`,
        colors: [selectedBGs[0], selectedBGs[1], "#1e293b"]
      });
    }

    try {
      const composePromptPayload = `
        Compose a comic book frame graphics layout directive based on:
        - Character Name: ${characterName || "Unnamed"}
        - Expression: ${characterExpression}
        - Current Apparel: ${outfitName}
        - Selected Background Theme: ${backgroundType}
        - Action Pose: ${poseType}
        - Scenarist prompt notes: "${customDescription}"
      `;

      const layoutSchema = {
        type: Type.OBJECT,
        properties: {
          backgroundColorStart: { type: Type.STRING, description: "A highly cinematic atmospheric color hex to color the scene start gradient" },
          backgroundColorEnd: { type: Type.STRING, description: "A highly atmospheric color hex to blend background gradients" },
          characterPoseAsset: { type: Type.STRING, description: "Direct positioning layout: 'extreme-closeup' | 'close-up' | 'medium-shot' | 'full-shot'" },
          characterExpression: { type: Type.STRING },
          backgroundType: { type: Type.STRING },
          compositionLayout: { type: Type.STRING, description: "Pacing format (e.g. 'high-action-diagonal' | 'establishing-landscape' | 'dramatic-low-angle')" },
          actionLinesIntensity: { type: Type.STRING, description: "Intensity: 'none' | 'low' | 'high'" },
          speechBubbleText: { type: Type.STRING, description: "A dramatic Korean comic dialogue matching this scenario state" },
          speechBubbleType: { type: Type.STRING, description: "Bubble styling: 'normal' | 'scream' | 'thought' | 'whisper'" },
          pacingSubtitle: { type: Type.STRING, description: "Action direction text in caption box (e.g. '빗속에서 우뚝 선 채로...')" },
          colors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Cohesive color guide, 3 items"
          }
        },
        required: ["backgroundColorStart", "backgroundColorEnd", "characterPoseAsset", "speechBubbleText", "actionLinesIntensity", "pacingSubtitle"]
      };

      const result = await ai.models.generateContent({
        model: modelType,
        contents: composePromptPayload,
        config: {
          systemInstruction: "You are a visual design layouts director for Kakao & Naver-grade webtoon cells. Return structured card composition properties in JSON.",
          responseMimeType: "application/json",
          responseSchema: layoutSchema,
          temperature: 0.7,
        }
      });

      if (result.text) {
        const layoutData = JSON.parse(result.text.trim());
        res.json({ success: true, ...layoutData });
      } else {
        throw new Error("Empty response from AI layout manager.");
      }
    } catch (error: any) {
      console.error("Gemini Canvas render error:", error);
      res.status(500).json({ error: "Rendering computation failed", details: error?.message || error });
    }
  });

  // Integrations for Vite dev vs prod distribution
  if (process.env.NODE_ENV !== "production") {
    console.log("Loading Vite Dev Mode server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Loading Production built distribution server assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webtoon Creator Studio Server booting hot state at http://localhost:${PORT}`);
  });
}

startServer();
