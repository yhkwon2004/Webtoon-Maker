/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Character, Outfit, BackgroundPreset, Project } from "./types";

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "char-mina",
    name: "한민아",
    brief: "밝고 명랑한 성격이지만 마음속 한구석에 비밀스러운 설렘을 깊이 숨기고 있는 천방지축 고등학생 리더.",
    genderAge: "18세 / 여성 / 슬림한 체형",
    skinTone: "투명하고 밝은 웜톤",
    hairStyle: "동글동글하고 차분하게 정돈된 어두운 브라운 단발머리",
    features: "말갛고 선명한 갈색 눈동자, 옅게 퍼진 보조개, 가벼고 얇은 눈썹",
    personality: "타인의 고민을 잘 들어주고 늘 미소를 유지하지만, 비 오는 날에는 남몰래 생각에 잠김.",
    facialSet: {
      normal: "살짝 미소를 띠며 상대를 다정하게 바라보는 표정",
      happy: "눈을 반달 모양으로 사르륵 접으며 활짝 웃는 표정",
      sad: "한 떨기 꽃처럼 가늘게 떨리며 눈가에 촉촉한 물기를 가득 머금은 아련하고 슬픈 표정",
      angry: "눈썹을 힘껏 찌푸리고 뺨을 붉히며 토라진 표정",
      shocked: "동그랗게 휘둥그레진 두 눈과 살짝 벌어져 멈칫한 입모양의 깜짝 놀란 표정"
    },
    palettes: ["#fee2e2", "#f87171", "#ea580c", "#475569", "#1e293b"],
    keywords: ["소녀", "청춘물 주인공", "단발 비주얼"],
    styleChoice: "classic-anime"
  },
  {
    id: "char-dohyeon",
    name: "강도현",
    brief: "무뚝뚝하고 차가워 보이지만 주변 사람들을 뒤에서 묵묵히 챙겨주는 마음 따뜻한 미술반 동아리 부장.",
    genderAge: "19세 / 남성 / 훤칠하고 슬림 탄탄한 체형",
    skinTone: "자연스럽고 화사한 쿨톤",
    hairStyle: "바람에 흩날릴 듯 엉성한 매력의 딥그레이 가르마 펌",
    features: "오뚝한 콧날, 날카롭게 잘 정돈된 눈썹, 귀에 작게 빛나는 귀걸이",
    personality: "매사 진지하고 말수가 적으나, 주인공을 향한 고백을 늘 벼르는 순정남.",
    facialSet: {
      normal: "살며시 시선을 빗겨 먼 곳을 무심히 바라보는 시크한 표정",
      happy: "기분 좋은 듯 한쪽 입꼬리만 슬쩍 올리며 풋 웃는 표정",
      sad: "차올라 흐르는 쓸쓸함을 참는 듯 가늘게 내리뜬 외로운 눈망울 표정",
      angry: "단호하게 눈빛을 번뜩이고 입술을 일자로 다문 성난 표정",
      shocked: "냉정한 페이스 조절을 잃고 뺨이 붉게 상기되며 황망해하는 표정"
    },
    palettes: ["#e0f2fe", "#0284c7", "#0f172a", "#d97706", "#cbd5e1"],
    keywords: ["훈남선배", "미술부장", "시크매력"],
    styleChoice: "k-webtoon-modern"
  }
];

export const DEFAULT_OUTFITS: Outfit[] = [
  {
    id: "out-uniform",
    name: "정규 단정한 청춘 교복",
    top: "화이트 세일러 셔츠 & 베이지색 가디건",
    bottom: "네이비 플리츠 스커트 / 스탠다드 네이비 교복 슬랙스",
    shoes: "깔끔한 화이트 단화와 발목 양말",
    accessories: "붉은색 스쿨 타이 / 클래식 라운드 안경",
    color: "네이비, 베이지, 화이트",
    season: "봄/가을",
    situation: "교실, 등하교길, 도서실",
    isDefault: true
  },
  {
    id: "out-hoodie",
    name: "스트릿 네온 루즈핏 후드",
    top: "파스텔 라벤더 컴피 후드티셔츠",
    bottom: "헤더그레이 이지 트레이닝 팬츠",
    shoes: "클래식 화이트 스니커즈",
    accessories: "심플한 가죽 카시오 손목시계",
    color: "라벤더, 라이트그레이",
    season: "사계절",
    situation: "카페, 동네 골목실, 정류장",
    isDefault: false
  },
  {
    id: "out-suit",
    name: "네이비 어반 오피스 포멀 슈트",
    top: "슬림핏 블랙 테일러드 칼라 자켓 & 블라우스",
    bottom: "포멀 블랙 슬림 팬츠",
    shoes: "클래식 톤 슈즈",
    accessories: "고급 라펠 브로치",
    color: "딥블랙, 차콜, 블라우스 네이비",
    season: "겨울",
    situation: "중요 면접장, 회사, 성숙한 데이트",
    isDefault: false
  }
];

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "bg-school",
    name: "벚꽃 날리는 아늑한 교실",
    type: "school",
    description: "창밖으로 벚꽃잎이 산들사들 흩날려 들어오는 채광이 화사하고 따뜻한 고등학교 교실 배경",
    colors: ["#fee2e2", "#bae6fd"],
    weather: "화창한 봄날",
    dayNight: "day"
  },
  {
    id: "bg-street",
    name: "비 내리는 정겨운 비탈 골목길",
    type: "street",
    description: "가로등 불빛이 빗물 머금은 아스팔트에 아련하게 어룽거리는 늦은 밤 감성 골목길 배경",
    colors: ["#1e293b", "#0f172a"],
    weather: "부슬부슬 내리는 봄비",
    dayNight: "night"
  },
  {
    id: "bg-cafe",
    name: "오후 햇살이 스미는 무드 카페",
    type: "cafe",
    description: "은근한 재즈 음악이 흐르고 마호가니 원목과 따사로운 조명이 드리워진 아늑한 스튜디오 카페",
    colors: ["#ffedd5", "#fed7aa"],
    weather: "완연한 안개 햇살",
    dayNight: "day"
  },
  {
    id: "bg-sunset",
    name: "이별을 부르는 붉은 노을 옥상",
    type: "sunset",
    description: "세상이 붉고 주황빛으로 타들어가며 빌딩 숲 실루엣이 등 뒤로 늘어선 드라마틱 노을 옥상 선상",
    colors: ["#fdba74", "#f43f5e"],
    weather: "짙은 주황 노을",
    dayNight: "sunset"
  },
  {
    id: "bg-fantasy",
    name: "신비롭고 몽환적인 별빛 숲속",
    type: "fantasy",
    description: "빛을 발하는 영롱한 숲속 발광 버섯들과 오로라가 밤하늘을 수놓은 아주 신비스러운 만화 속 세계",
    colors: ["#c084fc", "#3b0764"],
    weather: "환상적인 오로라 밤하늘",
    dayNight: "night"
  }
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-youth",
    title: "우리들의 비 오는 등하교 로맨스",
    description: "[1차 시놉시스] 비가 세차게 퍼붓는 여름날 정류장에 홀로 서서 눈물짓던 민아와 비밀 우산 속으로 뒤쫓아 들어온 도현 선배의 애틋한 스토리 보드.",
    createdAt: "2026-05-20T12:00:00Z",
    lastModified: "2026-05-21T05:20:00Z",
    characterIds: ["char-mina", "char-dohyeon"],
    outfitIds: ["out-uniform", "out-hoodie"],
    cuts: [
      {
        id: "cut-1",
        order: 1,
        compositionLayout: "medium-shot",
        backgroundColorStart: "#fee2e2",
        backgroundColorEnd: "#bae6fd",
        speechBubbleText: "선배, 오늘도 마중 나오실 필요는 없었어요.",
        speechBubbleType: "normal",
        characterExpression: "normal",
        characterPoseAsset: "default-face",
        pacingSubtitle: "스산한 오후, 서로 엇갈리던 학교 복도 끝에서 마주쳤다.",
        actionLinesIntensity: "none",
        assignedCharacterId: "char-mina",
        assignedOutfitId: "out-uniform",
        backgroundPresetId: "bg-school",
        promptNotes: "교실 문 옆에서 가방 끈을 꼭 쥐어잡고 머뭇거리는 소녀의 차분한 등교 샷",
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      {
        id: "cut-2",
        order: 2,
        compositionLayout: "close-up",
        backgroundColorStart: "#1e293b",
        backgroundColorEnd: "#0f172a",
        speechBubbleText: "너 왜... 우산도 없이 비오는 날 서 있는 거야?! 바보같이!",
        speechBubbleType: "scream",
        characterExpression: "angry",
        characterPoseAsset: "shouting-arm",
        pacingSubtitle: "도현 선배가 빗속을 단숨에 뚫고 달려와 숨을 헐떡이며 소리쳤다.",
        actionLinesIntensity: "high",
        assignedCharacterId: "char-dohyeon",
        assignedOutfitId: "out-hoodie",
        backgroundPresetId: "bg-street",
        promptNotes: "거센 바람에 머리가 다 젖은 채 상기되어 성난 어조로 윽박지르는 선배",
        scale: 1.1,
        offsetX: 0,
        offsetY: 5
      },
      {
        id: "cut-3",
        order: 3,
        compositionLayout: "extreme-closeup",
        backgroundColorStart: "#fdba74",
        backgroundColorEnd: "#f43f5e",
        speechBubbleText: "(어째서... 언제나 슬플 때마다 매번 선배님이 나타나 버리는 거죠?)",
        speechBubbleType: "thought",
        characterExpression: "sad",
        characterPoseAsset: "crying-kneel",
        pacingSubtitle: "눈을 질끈 감자 뺨을 기어코 타고 흘러내리는 것은 빗방울일까 눈물일까.",
        actionLinesIntensity: "low",
        assignedCharacterId: "char-mina",
        assignedOutfitId: "out-uniform",
        backgroundPresetId: "bg-sunset",
        promptNotes: "눈물이 맺혀 고개를 내린 민아의 아련함 극대화 클로즈업",
        scale: 1.25,
        offsetX: 0,
        offsetY: -10
      }
    ]
  }
];

export const POSES_3D = [
  { id: "default-face", name: "정면 눈맞춤 구도", desc: "인물의 표정을 가장 명확하게 전달하며 차분하고 정적인 순간에 알맞음." },
  { id: "pointing", name: "멀리 손짓하는 구도", desc: "특정 사물이나 연출 방향을 역동적으로 손짓하며 지시하는 다이나믹한 포즈." },
  { id: "running", name: "숨가쁘게 달리는 구도", desc: "상반신이 앞으로 기울어져 다급함과 극적 이탈감을 유발하는 포즈." },
  { id: "crying-kneel", name: "고개 떨구며 슬퍼하는 구도", desc: "시선을 깊게 하강하고 어깨를 잔뜩 가냘프게 웅크려 비장감을 유발하는 포즈." },
  { id: "shouting-arm", name: "팔을 뻗고 소리치는 구도", desc: "과감히 카메라를 향해 팔을 펼쳐 강력한 주장을 내지르는 감정 최고조 크롭 포즈." },
  { id: "surprised-hands", name: "두 손으로 입을 가린 구도", desc: "양손을 가슴이나 볼 주변에 가져가 반사적인 서스펜스/경악 상황 연출." },
  { id: "back-looking", name: "등 돌려 돌아보는 구도", desc: "뒷면 3/4 방향으로 차갑거나 잔잔하게 뒤를 흘깃 슬쩍 쳐다보는 여운 깊은 구도." }
];
