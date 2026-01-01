
import { Language } from './types';

export const translations = {
  welcome: {
    title: { en: 'Applications', ar: 'التطبيقات' },
    subtitle: { en: 'Select a tool to begin', ar: 'اختر أداة للبدء' },
    randomizer: { en: 'Randomizer', ar: 'المختار العشوائي' },
    randomizerDesc: { en: 'Pick names or items by chance. Effortless and beautiful.', ar: 'اختر أسماء أو عناصر بالصدفة. سهلة وجميلة.' },
    questionTest: { en: 'Question Tests', ar: 'اختبارات الأسئلة' },
    questionTestDesc: { en: 'Add questions and answers. Test your knowledge randomly.', ar: 'أضف أسئلة وأجوبة. اختبر معلوماتك عشوائياً.' },
    calendar: { en: 'Calendar', ar: 'التقويم' },
    calendarDesc: { en: 'Organize your days with tasks and highlights.', ar: 'نظم أيامك بالمهام والتمييز.' },
    openTool: { en: 'Open Tool', ar: 'افتح الأداة' },
    startTest: { en: 'Start Test', ar: 'ابدأ الاختبار' },
    getProductive: { en: 'Plan Your Month', ar: 'خطط لشهرك' },
  },
  sidebar: {
    suite: { en: 'SUITE', ar: 'الجناح' },
    new: { en: 'New', ar: 'جديد' },
    merge: { en: 'Merge', ar: 'دمج' },
    inventory: { en: 'Inventory', ar: 'المخزون' },
    noLists: { en: 'No lists found', ar: 'لم يتم العثور على قوائم' },
    settings: { en: 'Settings', ar: 'الإعدادات' },
    rename: { en: 'Rename', ar: 'إعادة تسمية' },
    delete: { en: 'Delete', ar: 'حذف' },
  },
  settings: {
    title: { en: 'App Settings', ar: 'إعدادات التطبيق' },
    appearance: { en: 'Appearance', ar: 'المظهر' },
    darkMode: { en: 'Dark Mode', ar: 'الوضع الداكن' },
    darkModeDesc: { en: 'Easy on the eyes in the dark', ar: 'مريح للعين في الظلام' },
    themeColor: { en: 'Theme Color', ar: 'لون السمة' },
    language: { en: 'Language', ar: 'اللغة' },
    behavior: { en: 'Behavior', ar: 'السلوك' },
    autoReset: { en: 'Auto-Reset Pool', ar: 'إعادة تعيين تلقائية' },
    autoResetDesc: { en: 'Restart when pool is empty', ar: 'إعادة البدء عندما تفرغ القائمة' },
    showTimestamps: { en: 'Show Timestamps', ar: 'إظهار الطوابع الزمنية' },
    showTimestampsDesc: { en: 'See when each item was picked', ar: 'رؤية متى تم اختيار كل عنصر' },
    showTimer: { en: 'Global Timer', ar: 'المؤقت العام' },
    showTimerDesc: { en: 'Floating focus tool in header', ar: 'أداة تركيز عائمة في الأعلى' },
    save: { en: 'Save Changes', ar: 'حفظ التغييرات' },
  },
  calendar: {
    title: { en: 'Planner', ar: 'المخطط' },
    highlight: { en: 'Highlight', ar: 'تمييز' },
    removeHighlight: { en: 'Remove Highlight', ar: 'إزالة التمييز' },
    tasks: { en: 'Tasks for {date}', ar: 'مهام {date}' },
    addTask: { en: 'Add Task', ar: 'أضف مهمة' },
    placeholder: { en: 'Task description...', ar: 'وصف المهمة...' },
    noTasks: { en: 'No tasks for this day.', ar: 'لا توجد مهام لهذا اليوم.' },
    prev: { en: 'Prev', ar: 'السابق' },
    next: { en: 'Next', ar: 'التالي' },
  },
  timer: {
    start: { en: 'Start', ar: 'ابدأ' },
    pause: { en: 'Pause', ar: 'إيقاف مؤقت' },
    reset: { en: 'Reset', ar: 'إعادة تعيين' },
    focusTime: { en: 'Focus Time', ar: 'وقت التركيز' },
    pomodoro: { en: 'Pomodoro', ar: 'بومودورو' },
    shortBreak: { en: 'Short Break', ar: 'استراحة قصيرة' },
    longBreak: { en: 'Long Break', ar: 'استراحة طويلة' },
    finished: { en: 'Time is up!', ar: 'انتهى الوقت!' },
    globalToggle: { en: 'Timer Widget', ar: 'أداة المؤقت' },
  },
  randomizer: {
    available: { en: 'available', ar: 'متاح' },
    aiBoost: { en: 'AI Boost', ar: 'دعم الذكاء الاصطناعي' },
    thinking: { en: 'Thinking...', ar: 'جاري التفكير...' },
    picking: { en: 'Picking...', ar: 'جاري الاختيار...' },
    selected: { en: 'Selected', ar: 'تم الاختيار' },
    pickNext: { en: 'PICK NEXT', ar: 'اختر التالي' },
    pickName: { en: 'PICK NAME', ar: 'اختر اسماً' },
    addName: { en: 'Add name...', ar: 'أضف اسماً...' },
    pool: { en: 'Pool', ar: 'المستودع' },
    log: { en: 'Log', ar: 'السجل' },
    empty: { en: 'Empty', ar: 'فارغ' },
    noPicks: { en: 'No picks', ar: 'لا يوجد اختيارات' },
  },
  questions: {
    left: { en: 'questions left', ar: 'أسئلة متبقية' },
    startTest: { en: 'START TEST', ar: 'ابدأ الاختبار' },
    randomReview: { en: 'Random Review', ar: 'مراجعة عشوائية' },
    viewAnswer: { en: 'VIEW ANSWER', ar: 'عرض الإجابة' },
    newQuestion: { en: 'New Question', ar: 'سؤال جديد' },
    qPlaceholder: { en: 'The question...', ar: 'السؤال...' },
    aPlaceholder: { en: 'The answer...', ar: 'الإجابة...' },
    pool: { en: 'Question Pool', ar: 'مستودع الأسئلة' },
    log: { en: 'Test Log', ar: 'سجل الاختبار' },
    examMode: { en: 'Exam Mode', ar: 'وضع الامتحان' },
    questionOf: { en: 'Question {n} of {total}', ar: 'سؤال {n} من {total}' },
    correct: { en: 'Correct!', ar: 'صحيح!' },
    incorrect: { en: 'Incorrect Answer', ar: 'إجابة خاطئة' },
    testComplete: { en: 'Test Complete!', ar: 'اكتمل الاختبار!' },
    finalScore: { en: 'Final Score', ar: 'النتيجة النهائية' },
    backToPool: { en: 'BACK TO POOL', ar: 'العودة للمستودع' },
  },
  app: {
    emptyStateTitle: { en: 'Pick an application to begin', ar: 'اختر تطبيقاً للبدء' },
    emptyStateDesc: { en: 'Select an existing list from the sidebar or create a new one to get started with your {mode}.', ar: 'اختر قائمة موجودة من الشريط الجانبي أو أنشئ قائمة جديدة للبدء في {mode}.' },
    createNew: { en: 'CREATE NEW LIST', ar: 'إنشاء قائمة جديدة' },
  }
};

export const t = (path: string, lang: Language, params?: Record<string, any>) => {
  const keys = path.split('.');
  let current: any = translations;
  for (const key of keys) {
    if (current[key]) current = current[key];
    else return path;
  }
  let str = current[lang] || current['en'] || path;
  if (params) {
    Object.keys(params).forEach(key => {
      str = str.replace(`{${key}}`, params[key]);
    });
  }
  return str;
};
