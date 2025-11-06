export type Goal = 'Relax' | 'Focus' | 'Sleep';

export interface GeneratePayload {
  name: string;
  goal: Goal;
  mood: number;
  length: number;
  recentNotes: string[];
}

export interface GeneratedSession {
  script: string;
  reflection: string;
  microTip: string;
  audioText: string;
}

const goalIntros: Record<Goal, string> = {
  Relax: 'We will soften your day and invite calm.',
  Focus: 'We will gather your attention and land in this moment.',
  Sleep: 'We will slow down and drift toward rest.',
};

const goalBodies: Record<Goal, string[]> = {
  Relax: [
    'Notice your shoulders, let them drop. Let your breath expand gently, like waves arriving.',
    'As you breathe in, imagine a cool breeze. As you breathe out, release the weight of the last hour.',
    'Feel the support beneath you. Each exhale is a soft sigh of relief moving through the body.',
  ],
  Focus: [
    'Bring your attention to the tip of your nose. Follow the breath in a clean, unbroken line.',
    'Picture a single task glowing ahead. On each inhale, step closer. On each exhale, clear the path.',
    'Let thoughts stream past like leaves in water. Anchor gently in the rhythm of your inhale.',
  ],
  Sleep: [
    'Imagine a warm blanket of dusk settling around you. Your breath is the tide, steady and slow.',
    'Each inhale draws in moonlight. Each exhale melts tension from brow to toes.',
    'Listen for the quiet between breaths. Allow it to widen, holding you in a cradle of night.',
  ],
};

const goalClosers: Record<Goal, string> = {
  Relax: 'Carry this softness with you as you move onward.',
  Focus: 'Let the clarity stay with you as you return to your task.',
  Sleep: 'Allow this stillness to guide you into gentle sleep.',
};

const goalPrompts: Record<Goal, string[]> = {
  Relax: [
    'What can you simplify in the next hour?',
    'Which part of you feels most at ease right now?',
  ],
  Focus: [
    'What single action deserves your full attention next?',
    'Which distraction can you let go of today?',
  ],
  Sleep: [
    'What is one thing you are grateful for before you rest?',
    'Which thought can you set down until morning?',
  ],
};

const goalTips: Record<Goal, string[]> = {
  Relax: ['Unclench your jaw and rest your tongue softly.'],
  Focus: ['Relax your brow and feel your feet against the ground.'],
  Sleep: ['Dim the lights and let screens rest at least 15 minutes before bed.'],
};

const settleTemplate = 'For twenty seconds, settle in. Sit tall yet soft. Breathe in through the nose for four, hold, and breathe out slowly for six.';

export function generateSessionContent(payload: GeneratePayload): GeneratedSession {
  const { goal, name, mood, recentNotes } = payload;
  const intro = `${goalIntros[goal]} ${name ? `Hi ${name},` : 'Hi there,'} you are safe here.`;
  const body = goalBodies[goal];
  const selectedBody = body[Math.floor(Math.random() * body.length)];
  const closing = goalClosers[goal];

  const reflectionCandidates = goalPrompts[goal];
  const reflection = reflectionCandidates[Math.floor(Math.random() * reflectionCandidates.length)];
  const tip = goalTips[goal][0];
  const noteLine = recentNotes[0] ? `Remember: ${recentNotes[0]}. ` : '';

  const moodLine = mood <= 2
    ? 'Notice any heaviness with kindness. You do not need to change it; simply offer it space.'
    : 'Let your breath mirror how you would like to feel. Balanced, present, and steady.';

  const script = [
    settleTemplate,
    intro,
    noteLine + moodLine,
    selectedBody,
    'Stay with the count: in for four, hold for four, out for six. Repeat gently.',
    closing,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    script,
    reflection,
    microTip: tip,
    audioText: script,
  };
}
