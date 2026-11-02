export type AffirmationTheme = {
  /** Used as the section anchor, e.g. /blog/affirmations#focus */
  id: string;
  title: string;
  intro: string;
  items: string[];
};

export const affirmationThemes: AffirmationTheme[] = [
  {
    id: "motivation",
    title: "Morning Affirmations for Motivation",
    intro:
      "Need help reaching a goal (financial or otherwise)? Feeling a little “blah” and lacking in motivation? Repeating a morning affirmation or two for motivation can definitely help you with that. Here are some to get you started:",
    items: [
      "I have the tools and abilities I need to succeed at everything I put my mind to.",
      "I am unstoppable.",
      "I can be and do whatever I want.",
      "Any obstacles in my way motivate me to learn and grow.",
      "Every day I am getting closer to achieving my goals and dreams.",
      "I have the power to achieve anything I desire.",
      "I finish what I put my mind to and set aside and let go of whatever does not serve me.",
      "I have overcome obstacles before and will overcome whatever is in my way.",
      "Not everything is easy, but I will push through and persevere because my goals and dreams are worth it.",
      "The hardest part of any journey is taking the first step, and today I will take that step.",
    ],
  },
  {
    id: "stress",
    title: "Morning Affirmations for Stress",
    intro:
      "Whether you’re stressed about your finances, your job, or just life in general, morning affirmations can help here, too. Try out one of these affirmations to calm yourself if you’re feeling particularly stressed out:",
    items: [
      "I feel centered and at peace.",
      "I am relaxed and free of stress.",
      "I choose how to respond to situations, and I choose to respond from a place of peace.",
      "I have overcome stressful situations in the past and will overcome them again.",
      "I am equipped to handle stressful situations calmly.",
      "There are some things I cannot control or change, and that is OK.",
      "As I exhale, stress leaves my body.",
      "I have the skills to deal with whatever comes my way.",
      "My body and mind are relaxed.",
      "I take everything one step at a time.",
    ],
  },
  {
    id: "abundance",
    title: "Morning Affirmations for Abundance",
    intro:
      "When we live in a state of lack, we tend to stay stuck there. Try out these morning affirmations for abundance to get yourself out of a scarcity mindset and into one of abundance:",
    items: [
      "Abundance is all around me.",
      "I am worthy to receive.",
      "I deserve abundance and prosperity in all its forms.",
      "My life is overflowing with opportunities.",
      "I am a magnet that attracts endless abundance.",
      "I am on my way to financial freedom.",
      "I see abundance everywhere I look.",
      "I am living a life full of abundance.",
      "I have an endless supply of ideas and the power to make them come true.",
      "I am financially abundant, and money flows to me easily.",
    ],
  },
  {
    id: "focus",
    title: "Morning Affirmations for Focus",
    intro:
      "If you find yourself lacking focus, you’re not alone – many people are feeling that lately. Do you drift from one project to another, unsuccessfully multi-task, or generally just feel scattered? These morning affirmations could be the key to unlocking your focus:",
    items: [
      "I easily maintain my focus on my goals.",
      "I stay focused on my goals and get the results I dream of.",
      "My mind is clear and focused.",
      "I eliminate distractions and get into the flow state naturally.",
      "I am alert, attentive, and focused at all times.",
      "I stay present and in the moment at all times.",
      "I choose what I focus my attention on.",
      "My focus is sharp, consistent, and unwavering.",
      "I have the focus I need to get things done.",
      "Nothing can get in my way or distract me from my goals.",
    ],
  },
  {
    id: "gratitude",
    title: "Morning Affirmations for Gratitude",
    intro:
      "By focusing on the blessings that you already have, you can open doors to even more abundance. Go ahead and be grateful for and enjoy the life that you have right now, and use these morning affirmations to help you do so:",
    items: [
      "I am grateful to be alive.",
      "I am grateful for all of the blessings that I have.",
      "I am fortunate to have so many people in my life who love me.",
      "I am thankful for the food and clean water I have access to today and every day.",
      "I am grateful for all of the wonderful things that have happened in my life, and look forward to many more.",
      "Every day there are more and more things to be grateful for.",
      "Today is a new chance for more opportunities, more abundance, and more things to be grateful for.",
      "I am grateful to everyone who has helped me get to where I am today.",
      "I am grateful for what I have and for what is to come.",
      "I am grateful for my beautiful, wonderful, rich life.",
    ],
  },
];
