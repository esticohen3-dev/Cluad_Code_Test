// ============================================================
//  כל פרטי הטיול נמצאים כאן. כדי לעדכן את האתר – משנים רק את הקובץ הזה.
//  All trip details live here. To update the site, edit only this file.
//  ערך null = עוד לא ידוע / לא נסגר.
// ============================================================

const TRIP = {
  // ---- חיבור לטופס ולטבלה של Google (מה שטלאור מוסיף מהאתר) ----
  // formUrl: הקישור לטופס Google Forms (כפתור "שליחה" > קישור)
  // sheetCsvUrl: הקישור לטבלה בפורמט CSV (קובץ > שיתוף > פרסום באינטרנט > CSV)
  formUrl: null,
  sheetCsvUrl: null,

  title: "הטיול שלנו לתאילנד",
  subtitle: "ים, חול, פאד תאי וזיכרונות 🌴",

  // תאריכים בפורמט "YYYY-MM-DD", לדוגמה "2027-02-10"
  startDate: "2027-08-07",
  endDate: "2027-08-26",

  travelers: [
    { name: "אסתי", emoji: "🌺" },
    { name: "טלאור", emoji: "🌴" },
    { name: "אן", emoji: "🐚" },
    { name: "ניב", emoji: "🏄" },
  ],

  // טיסות – כל כיוון מורכב מכמה קטעים (legs). זמנים מקומיים.
  flights: [
    {
      label: "טיסת הלוך",
      summary: "תל אביב → דובאי → פוקט",
      note: "עצירה בדובאי של 2:35 שעות",
      legs: [
        { date: "2027-08-07", from: "תל אביב", fromCode: "TLV", to: "דובאי", toCode: "DXB",
          departTime: "15:50", arriveTime: "20:05", airline: "flydubai", flightNumber: "FZ 1082", duration: "3:15" },
        { date: "2027-08-07", from: "דובאי", fromCode: "DXB", to: "פוקט", toCode: "HKT",
          departTime: "22:40", arriveTime: "08:10 (+1)", airline: "Emirates", flightNumber: "EK 390", duration: "6:30" },
      ],
    },
    {
      label: "טיסת חזור",
      summary: "בנגקוק → דובאי → תל אביב",
      note: "⚠️ ההמראה מבנגקוק ב-03:40 לפנות בוקר – יוצאים לשדה בערב של 25.8. עצירה בדובאי של 5:15 שעות",
      legs: [
        { date: "2027-08-26", from: "בנגקוק", fromCode: "BKK", to: "דובאי", toCode: "DXB",
          departTime: "03:40", arriveTime: "06:50", airline: "Emirates", flightNumber: "EK 371", duration: "6:10" },
        { date: "2027-08-26", from: "דובאי", fromCode: "DXB", to: "תל אביב", toCode: "TLV",
          departTime: "12:05", arriveTime: "14:35", airline: "flydubai", flightNumber: "FZ 1081", duration: "3:30" },
      ],
    },
  ],

  // התחנות לפי הסדר. confirmed: true = סגור, false = עוד לא סגור
  stops: [
    { name: "פוקט", emoji: "🏝️", nights: null, confirmed: true, note: "נוחתים כאן ב-8.8" },
    { name: "עוד לא נקבע", emoji: "❓", nights: null, confirmed: false, note: "האמצע של הטיול – עוד פתוח" },
    { name: "בנגקוק", emoji: "🏙️", nights: null, confirmed: true, note: "טסים הביתה בלילה של 25.8" },
  ],

  // מלונות – לכל תחנה. status: "not-booked" | "considering" | "booked"
  hotels: [
    { stop: "פוקט", status: "not-booked", name: null, checkIn: null, checkOut: null, link: null },
    { stop: "בנגקוק", status: "not-booked", name: null, checkIn: null, checkOut: null, link: null },
  ],

  // מסלול יומי. type: "stay" (יום רגיל) | "move" (יום מעבר) | "flight"
  // דוגמה: { date: "2027-02-10", place: "פוקט", type: "flight", title: "נחיתה בפוקט", items: ["צ'ק-אין במלון", "שקיעה בחוף"] }
  days: [
    { date: "2027-08-07", place: "בדרך", type: "flight", title: "יוצאים לדרך!", items: ["15:50 המראה מתל אביב לדובאי", "22:40 טיסה מדובאי לפוקט"] },
    { date: "2027-08-08", place: "פוקט", type: "flight", title: "נחיתה בפוקט 🏝️", items: ["08:10 נחיתה בפוקט", "צ'ק-אין במלון ומנוחה"] },
    { date: "2027-08-25", place: "בנגקוק", type: "move", title: "יום אחרון בבנגקוק", items: ["יוצאים לשדה התעופה בערב / בלילה"] },
    { date: "2027-08-26", place: "בדרך הביתה", type: "flight", title: "טסים הביתה", items: ["03:40 המראה מבנגקוק לדובאי", "12:05 טיסה מדובאי לתל אביב", "14:35 נחיתה בתל אביב 🏠"] },
  ],

  // אטרקציות ורעיונות לפי עיר. planned: true = בתוכנית, false = רק רעיון
  attractions: [
    { city: "פוקט", name: "חוף קאטה", emoji: "🏖️", planned: false, note: "חוף רגוע ויפה, מעולה לשחייה" },
    { city: "פוקט", name: "שיט לאיי פי פי", emoji: "🚤", planned: false, note: "טיול יום לאיים ולמפרץ מאיה" },
    { city: "פוקט", name: "הבודהה הגדול", emoji: "🛕", planned: false, note: "תצפית מדהימה על האי" },
    { city: "פוקט", name: "העיר העתיקה של פוקט", emoji: "🎨", planned: false, note: "בתים צבעוניים, קפה ושוק לילה ביום ראשון" },
    { city: "בנגקוק", name: "הארמון הגדול ו-וואט פו", emoji: "👑", planned: false, note: "לבוא מוקדם, לבוש צנוע" },
    { city: "בנגקוק", name: "שוק צ'אטוצ'אק", emoji: "🛍️", planned: false, note: "השוק הענק של סופ\"ש" },
    { city: "בנגקוק", name: "שייט בנהר צ'או פראיה", emoji: "⛴️", planned: false, note: "דרך כיפית לראות את העיר" },
    { city: "בנגקוק", name: "רחוב יאוורט – צ'יינה טאון", emoji: "🍜", planned: false, note: "אוכל רחוב בערב" },
  ],
};
