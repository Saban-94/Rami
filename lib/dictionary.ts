/* lib/dictionary.ts */
const dictionaries: Record<string, any> = {
  he: {
    title: "SabanOS | סטודיו AI",
    loading: "טוען מוח...",
    welcome: "ברוכים הבאים ל-SabanOS",
    setup_complete: "הגדרת המערכת הושלמה!",
    send: "שלח",
    placeholder: "הקלד הודעה...",
  },
  en: {
    title: "SabanOS | AI Studio",
    loading: "Loading Brain...",
    welcome: "Welcome to SabanOS",
    setup_complete: "Setup Complete!",
    send: "Send",
    placeholder: "Type a message...",
  },
};

export const getDictionary = async (lang: string) => {
  return dictionaries[lang] || dictionaries.he;
};
