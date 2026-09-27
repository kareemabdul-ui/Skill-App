import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";

/**
 * SKILL — Single-file MVP
 * ---------------------------------------------------------
 * Drop this file into an Expo React Native project as App.tsx.
 *
 * This MVP intentionally keeps the product in ONE FILE:
 * - Home
 * - Discover / adaptive skill quiz
 * - Learn / courses / lessons
 * - Compete / challenges
 * - Profile / XP / ranks
 * - Nova smart-tutor UI
 *
 * No API keys are stored here. Real authentication, database,
 * payments and server-side AI should be connected later through
 * a secure backend.
 */

type Tab = "Home" | "Discover" | "Learn" | "Compete" | "Profile";
type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  color: string;
  level: SkillLevel;
  progress: number;
  lessons: number;
  minutes: number;
  tags: string[];
};

const COLORS = {
  bg: "#070811",
  panel: "#10121E",
  panel2: "#151829",
  glass: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.10)",
  text: "#F6F7FF",
  muted: "#969AB2",
  primary: "#6D5CFF",
  cyan: "#42E8FF",
  green: "#25E0A2",
  pink: "#FF5FA2",
  orange: "#FF9A62",
  yellow: "#FFD166",
  danger: "#FF5577",
};

const INITIAL_SKILLS: Skill[] = [
  {
    id: "coding",
    name: "Coding",
    category: "Digital",
    icon: "</>",
    description: "Build websites, apps and ideas with code.",
    color: "#5F6FFF",
    level: "Beginner",
    progress: 18,
    lessons: 24,
    minutes: 165,
    tags: ["Logic", "Building", "Technology"],
  },
  {
    id: "design",
    name: "Graphic Design",
    category: "Creative",
    icon: "◇",
    description: "Turn ideas into visual systems people remember.",
    color: "#D66BFF",
    level: "Beginner",
    progress: 8,
    lessons: 20,
    minutes: 135,
    tags: ["Visual", "Creative", "Branding"],
  },
  {
    id: "video",
    name: "Video Editing",
    category: "Creative",
    icon: "▶",
    description: "Create short-form videos that hold attention.",
    color: "#FF6E86",
    level: "Beginner",
    progress: 32,
    lessons: 22,
    minutes: 150,
    tags: ["Storytelling", "Media", "Creator"],
  },
  {
    id: "speaking",
    name: "Public Speaking",
    category: "Communication",
    icon: "◉",
    description: "Speak clearly, confidently and persuasively.",
    color: "#42E8FF",
    level: "Beginner",
    progress: 12,
    lessons: 18,
    minutes: 110,
    tags: ["Confidence", "Communication", "Leadership"],
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    category: "Career",
    icon: "↗",
    description: "Turn problems into ideas, experiments and businesses.",
    color: "#25E0A2",
    level: "Beginner",
    progress: 5,
    lessons: 26,
    minutes: 180,
    tags: ["Business", "Strategy", "Building"],
  },
  {
    id: "writing",
    name: "Writing",
    category: "Creative",
    icon: "✦",
    description: "Write stories, posts and ideas that land.",
    color: "#FFD166",
    level: "Beginner",
    progress: 22,
    lessons: 18,
    minutes: 120,
    tags: ["Storytelling", "Communication", "Creative"],
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    category: "Career",
    icon: "⌁",
    description: "Understand attention, audiences and growth.",
    color: "#FF9A62",
    level: "Beginner",
    progress: 10,
    lessons: 25,
    minutes: 175,
    tags: ["Growth", "Business", "Creator"],
  },
  {
    id: "finance",
    name: "Personal Finance",
    category: "Career",
    icon: "₹",
    description: "Build practical money habits and financial thinking.",
    color: "#4DD6A4",
    level: "Beginner",
    progress: 4,
    lessons: 16,
    minutes: 100,
    tags: ["Money", "Life", "Planning"],
  },
  {
    id: "critical",
    name: "Critical Thinking",
    category: "Mind",
    icon: "◎",
    description: "Question assumptions and reason through problems.",
    color: "#9E8BFF",
    level: "Beginner",
    progress: 15,
    lessons: 19,
    minutes: 125,
    tags: ["Logic", "Reasoning", "Decision"],
  },
  {
    id: "chess",
    name: "Chess",
    category: "Mind",
    icon: "♞",
    description: "Train pattern recognition, planning and decision-making.",
    color: "#B8B9C8",
    level: "Beginner",
    progress: 28,
    lessons: 30,
    minutes: 210,
    tags: ["Strategy", "Logic", "Focus"],
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "You have a completely free afternoon. What sounds most exciting?",
    options: [
      ["Build something", ["coding", "entrepreneurship", "design"]],
      ["Create something", ["video", "writing", "design"]],
      ["Solve something", ["critical", "chess", "coding"]],
      ["Lead or persuade", ["speaking", "marketing", "entrepreneurship"]],
    ],
  },
  {
    question: "Which feeling do you want more of?",
    options: [
      ["Being creative", ["design", "video", "writing"]],
      ["Feeling smarter", ["critical", "chess", "coding"]],
      ["Feeling confident", ["speaking", "entrepreneurship"]],
      ["Understanding how things work", ["coding", "finance", "marketing"]],
    ],
  },
  {
    question: "Which project sounds coolest?",
    options: [
      ["Launch a tiny app", ["coding", "entrepreneurship"]],
      ["Make a cinematic edit", ["video", "design"]],
      ["Give a powerful presentation", ["speaking", "writing"]],
      ["Solve a tricky strategy problem", ["critical", "chess"]],
    ],
  },
  {
    question: "What would you rather improve?",
    options: [
      ["My ability to explain ideas", ["speaking", "writing", "marketing"]],
      ["My ability to make things", ["coding", "design", "video"]],
      ["My decisions", ["critical", "chess", "finance"]],
      ["My ability to create opportunities", ["entrepreneurship", "marketing", "finance"]],
    ],
  },
  {
    question: "Pick a creator archetype.",
    options: [
      ["The Builder", ["coding", "entrepreneurship"]],
      ["The Artist", ["design", "video", "writing"]],
      ["The Strategist", ["chess", "critical", "finance"]],
      ["The Communicator", ["speaking", "marketing", "writing"]],
    ],
  },
];

const CHALLENGES = [
  {
    title: "60-Second Pitch",
    skill: "Public Speaking",
    reward: 120,
    time: "10 min",
    description: "Pitch an idea in one minute without reading a script.",
  },
  {
    title: "Build a Landing Page",
    skill: "Coding",
    reward: 180,
    time: "25 min",
    description: "Sketch the first screen of an app you would actually use.",
  },
  {
    title: "Edit the Moment",
    skill: "Video Editing",
    reward: 150,
    time: "20 min",
    description: "Turn raw footage into a 15-second story with a beginning, middle and end.",
  },
  {
    title: "Problem Hunter",
    skill: "Entrepreneurship",
    reward: 100,
    time: "12 min",
    description: "Find three annoying problems people around you have today.",
  },
];

const NAV = [
  { key: "Home" as Tab, icon: "⌂" },
  { key: "Discover" as Tab, icon: "✦" },
  { key: "Learn" as Tab, icon: "◫" },
  { key: "Compete" as Tab, icon: "⚡" },
  { key: "Profile" as Tab, icon: "◉" },
];

function GlassCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}) {
  const content = (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

function Pill({
  children,
  color = COLORS.primary,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <View style={[styles.pill, { borderColor: `${color}55`, backgroundColor: `${color}16` }]}>
      <Text style={[styles.pillText, { color }]}>{children}</Text>
    </View>
  );
}

function ProgressBar({ value, color = COLORS.primary }: { value: number; color?: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [xp, setXp] = useState(1240);
  const [streak, setStreak] = useState(7);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm Nova. Ask me anything about a skill you're learning. I’ll keep explanations clear and practical.",
    },
  ]);

  const level = Math.floor(xp / 500) + 1;
  const rank = xp >= 3000 ? "Visionary" : xp >= 2000 ? "Builder" : xp >= 1000 ? "Explorer" : "Starter";
  const nextLevelXp = level * 500;
  const levelProgress = ((xp % 500) / 500) * 100;

  const recommendation = useMemo(() => {
    const sorted = Object.entries(quizScores).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return skills.slice(0, 4);
    const ids = sorted.map(([id]) => id);
    return ids.map((id) => skills.find((s) => s.id === id)).filter(Boolean) as Skill[];
  }, [quizScores, skills]);

  const addXp = (amount: number) => {
    setXp((v) => v + amount);
  };

  const completeLesson = (skillId: string) => {
    setSkills((current) =>
      current.map((s) =>
        s.id === skillId
          ? {
              ...s,
              progress: Math.min(100, s.progress + 7),
              level:
                s.progress + 7 >= 80
                  ? "Expert"
                  : s.progress + 7 >= 55
                  ? "Advanced"
                  : s.progress + 7 >= 30
                  ? "Intermediate"
                  : "Beginner",
            }
          : s
      )
    );
    addXp(50);
    setLessonOpen(false);
    Alert.alert("Lesson complete ⚡", "+50 XP added to your profile.");
  };

  const answerQuiz = (skillIds: string[]) => {
    setQuizScores((current) => {
      const next = { ...current };
      skillIds.forEach((id) => (next[id] = (next[id] || 0) + 1));
      return next;
    });

    if (quizIndex >= QUIZ_QUESTIONS.length - 1) {
      setQuizFinished(true);
      addXp(100);
    } else {
      setQuizIndex((v) => v + 1);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScores({});
    setQuizFinished(false);
  };

  const sendMentor = () => {
    const clean = mentorInput.trim();
    if (!clean) return;
    setMentorMessages((m) => [
      ...m,
      { role: "user", text: clean },
      {
        role: "assistant",
        text:
          "Great question. For the MVP I'm running a local tutor response. In production, this exact message will go to the secure server-side AI mentor and use your current skill, level and lesson context.",
      },
    ]);
    setMentorInput("");
  };

  const renderHome = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>THURSDAY • DAY {streak}</Text>
          <Text style={styles.heroTitle}>Good evening,{"\n"}builder.</Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => setTab("Profile")}>
          <Text style={styles.avatarText}>S</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.missionCard}>
        <View style={styles.missionGlow} />
        <View style={styles.rowBetween}>
          <Pill color={COLORS.green}>TODAY'S MISSION</Pill>
          <Text style={styles.muted}>+100 XP</Text>
        </View>
        <Text style={styles.missionTitle}>Teach something in 60 seconds.</Text>
        <Text style={styles.body}>
          Pick a topic you understand and explain it like your friend has never heard of it.
        </Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setSelectedSkill(skills.find((s) => s.id === "speaking") || null);
            setLessonOpen(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Start mission →</Text>
        </Pressable>
      </GlassCard>

      <View style={styles.statRow}>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
          <Text style={styles.statLabel}>TOTAL XP</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>{streak}🔥</Text>
          <Text style={styles.statLabel}>DAY STREAK</Text>
        </GlassCard>
        <GlassCard style={styles.statCard}>
          <Text style={styles.statValue}>#{level}</Text>
          <Text style={styles.statLabel}>{rank.toUpperCase()}</Text>
        </GlassCard>
      </View>

      <SectionTitle title="Continue learning" action="See all" onPress={() => setTab("Learn")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {skills.filter((s) => s.progress > 0).slice(0, 4).map((skill) => (
          <GlassCard
            key={skill.id}
            style={styles.skillMini}
            onPress={() => {
              setSelectedSkill(skill);
              setLessonOpen(true);
            }}
          >
            <View style={[styles.skillIcon, { backgroundColor: `${skill.color}22` }]}>
              <Text style={[styles.skillIconText, { color: skill.color }]}>{skill.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{skill.name}</Text>
            <Text style={styles.muted}>{skill.level}</Text>
            <ProgressBar value={skill.progress} color={skill.color} />
            <Text style={styles.progressText}>{skill.progress}% complete</Text>
          </GlassCard>
        ))}
      </ScrollView>

      <SectionTitle title="For you" action="Discover" onPress={() => setTab("Discover")} />
      <GlassCard onPress={() => setTab("Discover")}>
        <View style={styles.rowBetween}>
          <View style={styles.recommendationOrb}>
            <Text style={styles.orbText}>✦</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.smallCaps}>PERSONALIZED</Text>
            <Text style={styles.cardTitle}>Find a skill that fits you</Text>
            <Text style={styles.body}>A short adaptive experience → your personal Skill Map.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </GlassCard>

      <SectionTitle title="Your next level" />
      <GlassCard>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.smallCaps}>LEVEL {level}</Text>
            <Text style={styles.cardTitle}>{rank}</Text>
          </View>
          <Text style={styles.xpText}>{xp}/{nextLevelXp} XP</Text>
        </View>
        <ProgressBar value={levelProgress} color={COLORS.cyan} />
        <Text style={styles.muted}>{Math.max(0, nextLevelXp - xp)} XP until your next rank.</Text>
      </GlassCard>
    </ScrollView>
  );

  const renderDiscover = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageKicker}>DISCOVER</Text>
      <Text style={styles.pageTitle}>Find what{"\n"}fits you.</Text>
      <Text style={styles.pageSubtitle}>
        Don't pick a skill because everyone else is learning it. Discover where your curiosity points.
      </Text>

      {!quizFinished ? (
        <GlassCard style={styles.quizCard}>
          <View style={styles.rowBetween}>
            <Pill color={COLORS.cyan}>FIND YOUR SKILL</Pill>
            <Text style={styles.muted}>{quizIndex + 1}/{QUIZ_QUESTIONS.length}</Text>
          </View>
          <ProgressBar value={((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100} color={COLORS.cyan} />
          <Text style={styles.quizQuestion}>{QUIZ_QUESTIONS[quizIndex].question}</Text>
          {QUIZ_QUESTIONS[quizIndex].options.map(([label, ids]) => (
            <Pressable key={label} style={styles.optionButton} onPress={() => answerQuiz(ids as string[])}>
              <Text style={styles.optionText}>{label}</Text>
              <Text style={styles.optionArrow}>→</Text>
            </Pressable>
          ))}
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.resultHero}>
            <Pill color={COLORS.green}>YOUR SKILL MAP</Pill>
            <Text style={styles.resultTitle}>Curiosity has a pattern.</Text>
            <Text style={styles.body}>
              These are areas that matched your answers. Explore them—your first choice doesn't have to be permanent.
            </Text>
            <Pressable style={styles.secondaryButton} onPress={resetQuiz}>
              <Text style={styles.secondaryButtonText}>Retake discovery</Text>
            </Pressable>
          </GlassCard>

          {recommendation.slice(0, 6).map((skill, index) => (
            <GlassCard
              key={skill.id}
              style={styles.resultSkill}
              onPress={() => {
                setSelectedSkill(skill);
                setLessonOpen(true);
              }}
            >
              <View style={[styles.rankBadge, { borderColor: skill.color }]}>
                <Text style={[styles.rankText, { color: skill.color }]}>0{index + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{skill.name}</Text>
                <Text style={styles.muted}>{skill.category} • {skill.description}</Text>
                <View style={styles.tagRow}>
                  {skill.tags.slice(0, 2).map((tag) => <Pill key={tag} color={skill.color}>{tag}</Pill>)}
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </GlassCard>
          ))}
        </>
      )}

      <SectionTitle title="Explore categories" />
      <View style={styles.categoryGrid}>
        {["Mind", "Digital", "Creative", "Career", "Communication"].map((category, i) => (
          <GlassCard key={category} style={styles.categoryCard}>
            <Text style={styles.categoryNumber}>0{i + 1}</Text>
            <Text style={styles.cardTitle}>{category}</Text>
            <Text style={styles.muted}>{skills.filter((s) => s.category === category).length || 0} skills</Text>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );

  const renderLearn = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageKicker}>LEARN</Text>
      <Text style={styles.pageTitle}>Build skills{"\n"}in small moves.</Text>
      <Text style={styles.pageSubtitle}>5–10 minute lessons. Clear progression. Real practice.</Text>

      <GlassCard style={styles.aiBanner} onPress={() => setMentorOpen(true)}>
        <View style={styles.novaAvatar}><Text style={styles.novaText}>N</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallCaps}>NOVA • SMART TUTOR</Text>
          <Text style={styles.cardTitle}>Need help with something?</Text>
          <Text style={styles.muted}>Ask Nova to explain it differently.</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </GlassCard>

      <SectionTitle title="Your skills" />
      {skills.map((skill) => (
        <GlassCard
          key={skill.id}
          style={styles.learnRow}
          onPress={() => {
            setSelectedSkill(skill);
            setLessonOpen(true);
          }}
        >
          <View style={[styles.skillIconSmall, { backgroundColor: `${skill.color}20` }]}>
            <Text style={[styles.skillIconText, { color: skill.color }]}>{skill.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{skill.name}</Text>
              <Text style={[styles.levelText, { color: skill.color }]}>{skill.level}</Text>
            </View>
            <ProgressBar value={skill.progress} color={skill.color} />
            <Text style={styles.progressText}>{skill.progress}% • {skill.lessons} lessons • {skill.minutes} min</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </GlassCard>
      ))}
    </ScrollView>
  );

  const renderCompete = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageKicker}>COMPETE</Text>
      <Text style={styles.pageTitle}>Prove what{"\n}you can do.</Text>
      <Text style={styles.pageSubtitle}>Challenges turn learning into something real.</Text>

      <GlassCard style={styles.challengeHero}>
        <Pill color={COLORS.orange}>WEEKLY DROP</Pill>
        <Text style={styles.challengeHeroTitle}>The Creator Sprint</Text>
        <Text style={styles.body}>Complete one practical challenge this week and submit your work.</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.muted}>1,284 participants</Text>
          <Text style={styles.xpText}>+500 XP</Text>
        </View>
        <Pressable
          style={styles.primaryButton}
          onPress={() => Alert.alert("Competition", "Competition submission flow is ready to connect to the backend.")}
        >
          <Text style={styles.primaryButtonText}>View challenge</Text>
        </Pressable>
      </GlassCard>

      <SectionTitle title="Quick challenges" />
      {CHALLENGES.map((challenge) => (
        <GlassCard
          key={challenge.title}
          style={styles.challengeRow}
          onPress={() => {
            addXp(0);
            Alert.alert(challenge.title, `${challenge.description}\n\nReward: +${challenge.reward} XP`);
          }}
        >
          <View style={styles.challengeIcon}><Text style={styles.challengeIconText}>⚡</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{challenge.title}</Text>
            <Text style={styles.muted}>{challenge.skill} • {challenge.time}</Text>
            <Text style={styles.body}>{challenge.description}</Text>
          </View>
          <Pill color={COLORS.yellow}>+{challenge.reward}</Pill>
        </GlassCard>
      ))}

      <SectionTitle title="Leaderboard" />
      {["You", "Maya", "Arjun", "Leo"].map((name, index) => (
        <View key={name} style={styles.leaderRow}>
          <Text style={styles.leaderRank}>{index + 1}</Text>
          <View style={styles.leaderAvatar}><Text style={styles.leaderInitial}>{name[0]}</Text></View>
          <Text style={styles.leaderName}>{name}</Text>
          <Text style={styles.leaderXp}>{[xp, 1510, 1430, 1370][index]} XP</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.profileHeader}>
        <View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>S</Text></View>
        <Text style={styles.profileName}>Still</Text>
        <Text style={styles.muted}>Explorer • Level {level}</Text>
        <View style={styles.tagRowCenter}>
          <Pill color={COLORS.primary}>{rank}</Pill>
          <Pill color={COLORS.green}>{streak} day streak</Pill>
        </View>
      </View>

      <GlassCard>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.smallCaps}>LEVEL {level}</Text>
            <Text style={styles.cardTitle}>{xp.toLocaleString()} XP</Text>
          </View>
          <Text style={styles.xpText}>{Math.round(levelProgress)}%</Text>
        </View>
        <ProgressBar value={levelProgress} color={COLORS.primary} />
      </GlassCard>

      <SectionTitle title="Skill portfolio" />
      <GlassCard>
        {skills.filter((s) => s.progress >= 20).map((skill, index, arr) => (
          <View key={skill.id} style={[styles.portfolioRow, index === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={[styles.portfolioIcon, { color: skill.color }]}>{skill.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{skill.name}</Text>
              <Text style={styles.muted}>{skill.level} • {skill.progress}%</Text>
            </View>
            <Text style={styles.muted}>›</Text>
          </View>
        ))}
      </GlassCard>

      <SectionTitle title="Your proof" />
      <GlassCard>
        <Text style={styles.cardTitle}>Certificates & projects</Text>
        <Text style={styles.body}>Completed work will appear here as a shareable portfolio.</Text>
        <Pressable style={styles.secondaryButton} onPress={() => Alert.alert("Portfolio", "Portfolio and certificate storage will connect to the backend in the production build.")}>
          <Text style={styles.secondaryButtonText}>Open portfolio</Text>
        </Pressable>
      </GlassCard>

      <SectionTitle title="Settings" />
      <GlassCard>
        {["Account", "Notifications", "Privacy & safety", "Parent settings"].map((item) => (
          <Pressable key={item} style={styles.settingsRow} onPress={() => setProfileOpen(true)}>
            <Text style={styles.cardTitle}>{item}</Text>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </GlassCard>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.container}>
        {tab === "Home" && renderHome()}
        {tab === "Discover" && renderDiscover()}
        {tab === "Learn" && renderLearn()}
        {tab === "Compete" && renderCompete()}
        {tab === "Profile" && renderProfile()}

        <View style={styles.bottomNav}>
          {NAV.map((item) => {
            const active = tab === item.key;
            return (
              <Pressable key={item.key} style={styles.navItem} onPress={() => setTab(item.key)}>
                <View style={[styles.navIcon, active && styles.navIconActive]}>
                  <Text style={[styles.navIconText, active && styles.navIconTextActive]}>{item.icon}</Text>
                </View>
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.key}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.floatingMentor} onPress={() => setMentorOpen(true)}>
          <Text style={styles.floatingMentorText}>N</Text>
        </Pressable>
      </View>

      <Modal visible={lessonOpen} animationType="slide" transparent onRequestClose={() => setLessonOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selectedSkill && (
              <>
                <View style={styles.rowBetween}>
                  <Pill color={selectedSkill.color}>{selectedSkill.level.toUpperCase()}</Pill>
                  <Pressable onPress={() => setLessonOpen(false)}><Text style={styles.close}>×</Text></Pressable>
                </View>
                <Text style={styles.modalTitle}>{selectedSkill.name}</Text>
                <Text style={styles.body}>{selectedSkill.description}</Text>
                <Text style={styles.sectionLabel}>Today's 7-minute lesson</Text>
                <GlassCard style={styles.lessonPreview}>
                  <Text style={styles.smallCaps}>LESSON 01</Text>
                  <Text style={styles.cardTitle}>Understand the core idea</Text>
                  <Text style={styles.body}>
                    Learn one useful concept, see a practical example, then prove you understood it with a tiny challenge.
                  </Text>
                  <ProgressBar value={35} color={selectedSkill.color} />
                </GlassCard>
                <Pressable style={styles.primaryButton} onPress={() => completeLesson(selectedSkill.id)}>
                  <Text style={styles.primaryButtonText}>Complete lesson +50 XP</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton} onPress={() => setMentorOpen(true)}>
                  <Text style={styles.secondaryButtonText}>Ask Nova for help</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={mentorOpen} animationType="slide" transparent onRequestClose={() => setMentorOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.mentorSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.rowBetween}>
              <View style={styles.row}>
                <View style={styles.novaAvatarSmall}><Text style={styles.novaText}>N</Text></View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.cardTitle}>Nova</Text>
                  <Text style={styles.muted}>Smart Tutor</Text>
                </View>
              </View>
              <Pressable onPress={() => setMentorOpen(false)}><Text style={styles.close}>×</Text></Pressable>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 18 }}>
              {mentorMessages.map((message, index) => (
                <View
                  key={index}
                  style={[
                    styles.messageBubble,
                    message.role === "user" ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                value={mentorInput}
                onChangeText={setMentorInput}
                placeholder="Ask Nova..."
                placeholderTextColor={COLORS.muted}
                style={styles.mentorInput}
                multiline
              />
              <Pressable style={styles.sendButton} onPress={sendMentor}>
                <Text style={styles.sendText}>↑</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={profileOpen} animationType="fade" transparent onRequestClose={() => setProfileOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.smallModal}>
            <Text style={styles.modalTitle}>Settings</Text>
            <Text style={styles.body}>
              Production settings will connect to real authentication, privacy controls, notifications and parent features.
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => setProfileOpen(false)}>
              <Text style={styles.primaryButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onPress}>
          <Text style={styles.sectionAction}>{action} →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 125 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: COLORS.muted, fontSize: 11, letterSpacing: 1.8, fontWeight: "800", marginBottom: 7 },
  heroTitle: { color: COLORS.text, fontSize: 34, lineHeight: 37, fontWeight: "900", letterSpacing: -1.2 },
  avatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: COLORS.panel2, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  avatarText: { color: COLORS.cyan, fontWeight: "900", fontSize: 18 },
  card: { backgroundColor: COLORS.glass, borderWidth: 1, borderColor: COLORS.border, borderRadius: 22, padding: 16, marginBottom: 12, overflow: "hidden" },
  missionCard: { minHeight: 220, backgroundColor: "#101426" },
  missionGlow: { position: "absolute", width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(109,92,255,0.15)", right: -60, top: -60 },
  pill: { borderWidth: 1, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start" },
  pillText: { fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  muted: { color: COLORS.muted, fontSize: 12, lineHeight: 18 },
  body: { color: "#B7B9CA", fontSize: 13, lineHeight: 20, marginTop: 8 },
  missionTitle: { color: COLORS.text, fontSize: 24, fontWeight: "900", marginTop: 18, letterSpacing: -0.5 },
  primaryButton: { backgroundColor: COLORS.primary, minHeight: 50, borderRadius: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, marginTop: 18 },
  primaryButtonText: { color: "#fff", fontSize: 14, fontWeight: "900" },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: COLORS.border, minHeight: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 12 },
  secondaryButtonText: { color: COLORS.text, fontSize: 13, fontWeight: "800" },
  statRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  statCard: { flex: 1, padding: 13, borderRadius: 18 },
  statValue: { color: COLORS.text, fontSize: 17, fontWeight: "900" },
  statLabel: { color: COLORS.muted, fontSize: 8, fontWeight: "900", letterSpacing: 1, marginTop: 5 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 11 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: "900", letterSpacing: -0.3 },
  sectionAction: { color: COLORS.cyan, fontSize: 11, fontWeight: "800" },
  skillMini: { width: 170, marginRight: 10, padding: 14 },
  skillIcon: { width: 45, height: 45, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 13 },
  skillIconSmall: { width: 48, height: 48, borderRadius: 15, alignItems: "center", justifyContent: "center", marginRight: 12 },
  skillIconText: { fontSize: 18, fontWeight: "900" },
  cardTitle: { color: COLORS.text, fontSize: 14, fontWeight: "850" },
  progressTrack: { height: 5, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", marginTop: 11 },
  progressFill: { height: "100%", borderRadius: 4 },
  progressText: { color: COLORS.muted, fontSize: 9, marginTop: 7 },
  recommendationOrb: { width: 50, height: 50, borderRadius: 18, backgroundColor: "rgba(109,92,255,0.16)", borderWidth: 1, borderColor: "rgba(109,92,255,0.3)", alignItems: "center", justifyContent: "center" },
  orbText: { color: COLORS.primary, fontSize: 22 },
  arrow: { color: COLORS.muted, fontSize: 26, marginLeft: 10 },
  smallCaps: { color: COLORS.muted, fontSize: 9, letterSpacing: 1.2, fontWeight: "900", marginBottom: 4 },
  xpText: { color: COLORS.cyan, fontSize: 12, fontWeight: "900" },
  pageKicker: { color: COLORS.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginTop: 5, marginBottom: 8 },
  pageTitle: { color: COLORS.text, fontSize: 35, lineHeight: 37, fontWeight: "900", letterSpacing: -1.3 },
  pageSubtitle: { color: COLORS.muted, fontSize: 13, lineHeight: 20, marginTop: 10, marginBottom: 18 },
  quizCard: { backgroundColor: "#0F1524", padding: 18 },
  quizQuestion: { color: COLORS.text, fontSize: 22, lineHeight: 28, fontWeight: "850", marginTop: 22, marginBottom: 14 },
  optionButton: { minHeight: 58, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.035)", marginTop: 9, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionText: { color: COLORS.text, fontSize: 14, fontWeight: "750" },
  optionArrow: { color: COLORS.cyan, fontSize: 18 },
  resultHero: { backgroundColor: "#101A22" },
  resultTitle: { color: COLORS.text, fontSize: 26, fontWeight: "900", marginTop: 15 },
  resultSkill: { flexDirection: "row", alignItems: "center" },
  rankBadge: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center", marginRight: 13 },
  rankText: { fontSize: 12, fontWeight: "900" },
  tagRow: { flexDirection: "row", gap: 6, marginTop: 8 },
  tagRowCenter: { flexDirection: "row", gap: 7, marginTop: 10 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryCard: { width: "48%", minHeight: 100 },
  categoryNumber: { color: COLORS.primary, fontSize: 10, fontWeight: "900", marginBottom: 18 },
  aiBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#121321" },
  novaAvatar: { width: 48, height: 48, borderRadius: 17, backgroundColor: "rgba(66,232,255,0.13)", borderWidth: 1, borderColor: "rgba(66,232,255,0.35)", alignItems: "center", justifyContent: "center", marginRight: 13 },
  novaAvatarSmall: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(66,232,255,0.13)", alignItems: "center", justifyContent: "center" },
  novaText: { color: COLORS.cyan, fontSize: 18, fontWeight: "900" },
  learnRow: { flexDirection: "row", alignItems: "center" },
  levelText: { fontSize: 9, fontWeight: "900", letterSpacing: 0.7 },
  challengeHero: { backgroundColor: "#18141C", borderColor: "rgba(255,154,98,0.18)" },
  challengeHeroTitle: { color: COLORS.text, fontSize: 27, fontWeight: "900", marginTop: 15, marginBottom: 2 },
  challengeRow: { flexDirection: "row", alignItems: "center" },
  challengeIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: "rgba(255,209,102,0.10)", alignItems: "center", justifyContent: "center", marginRight: 12 },
  challengeIconText: { color: COLORS.yellow, fontSize: 18 },
  leaderRow: { flexDirection: "row", alignItems: "center", minHeight: 62, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  leaderRank: { color: COLORS.muted, width: 25, fontWeight: "900" },
  leaderAvatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.panel2, alignItems: "center", justifyContent: "center", marginRight: 10 },
  leaderInitial: { color: COLORS.cyan, fontWeight: "900" },
  leaderName: { color: COLORS.text, fontSize: 13, fontWeight: "800", flex: 1 },
  leaderXp: { color: COLORS.muted, fontSize: 11, fontWeight: "800" },
  profileHeader: { alignItems: "center", marginBottom: 18 },
  bigAvatar: { width: 82, height: 82, borderRadius: 30, backgroundColor: "rgba(109,92,255,0.18)", borderWidth: 1, borderColor: "rgba(109,92,255,0.4)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  bigAvatarText: { color: COLORS.primary, fontSize: 30, fontWeight: "900" },
  profileName: { color: COLORS.text, fontSize: 25, fontWeight: "900" },
  portfolioRow: { flexDirection: "row", alignItems: "center", minHeight: 62, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  portfolioIcon: { width: 35, fontSize: 17, fontWeight: "900" },
  settingsRow: { minHeight: 52, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bottomNav: { position: "absolute", bottom: Platform.OS === "ios" ? 14 : 10, left: 14, right: 14, height: 70, borderRadius: 25, backgroundColor: "rgba(17,19,31,0.93)", borderWidth: 1, borderColor: "rgba(255,255,255,0.13)", flexDirection: "row", alignItems: "center", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.45, shadowRadius: 18, elevation: 15 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navIcon: { width: 35, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  navIconActive: { backgroundColor: "rgba(109,92,255,0.18)" },
  navIconText: { color: COLORS.muted, fontSize: 17 },
  navIconTextActive: { color: COLORS.primary },
  navLabel: { color: COLORS.muted, fontSize: 8, fontWeight: "800", marginTop: 2 },
  navLabelActive: { color: COLORS.text },
  floatingMentor: { position: "absolute", right: 22, bottom: Platform.OS === "ios" ? 95 : 91, width: 48, height: 48, borderRadius: 18, backgroundColor: COLORS.cyan, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.bg, shadowColor: COLORS.cyan, shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  floatingMentorText: { color: COLORS.bg, fontSize: 18, fontWeight: "950" },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: "#0E101B", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 32, borderWidth: 1, borderColor: COLORS.border, maxHeight: "88%" },
  mentorSheet: { backgroundColor: "#0E101B", borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: Platform.OS === "ios" ? 28 : 18, height: "82%", borderWidth: 1, borderColor: COLORS.border },
  smallModal: { margin: 20, backgroundColor: "#10121E", borderRadius: 26, padding: 22, borderWidth: 1, borderColor: COLORS.border },
  modalHandle: { width: 42, height: 4, borderRadius: 3, backgroundColor: "#36394A", alignSelf: "center", marginBottom: 18 },
  close: { color: COLORS.muted, fontSize: 30, lineHeight: 30 },
  modalTitle: { color: COLORS.text, fontSize: 29, fontWeight: "900", marginTop: 16 },
  sectionLabel: { color: COLORS.text, fontSize: 12, fontWeight: "900", marginTop: 22, marginBottom: 8, letterSpacing: 0.5 },
  lessonPreview: { backgroundColor: "rgba(255,255,255,0.035)" },
  messageBubble: { maxWidth: "88%", padding: 13, borderRadius: 18, marginBottom: 9 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "rgba(66,232,255,0.08)", borderWidth: 1, borderColor: "rgba(66,232,255,0.12)" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "rgba(109,92,255,0.20)" },
  messageText: { color: COLORS.text, fontSize: 13, lineHeight: 19 },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  mentorInput: { flex: 1, minHeight: 48, maxHeight: 100, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.045)", color: COLORS.text, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13 },
  sendButton: { width: 48, height: 48, borderRadius: 17, backgroundColor: COLORS.cyan, alignItems: "center", justifyContent: "center" },
  sendText: { color: COLORS.bg, fontSize: 21, fontWeight: "900" },
});

