// ============================================================
//  כל פרטי הטיול נמצאים כאן. כדי לעדכן את האתר – משנים רק את הקובץ הזה.
//  All trip details live here. To update the site, edit only this file.
//  ערך null = עוד לא ידוע / לא נסגר.
// ============================================================

const TRIP = {
  title: "הטיול שלנו לתאילנד",
  subtitle: "ים, חול, פאד תאי וזיכרונות 🌴",

  // תאריכים בפורמט "YYYY-MM-DD", לדוגמה "2027-02-10"
  startDate: null,
  endDate: null,

  travelers: [
    { name: "אסתי", emoji: "🌺" },
    { name: "טלאור", emoji: "🌴" },
    { name: "אן", emoji: "🐚" },
    { name: "ניב", emoji: "🏄" },
  ],

  flights: [
    {
      label: "טיסת הלוך",
      from: "ישראל", fromCode: "TLV",
      to: "פוקט", toCode: "HKT",
      date: null, departTime: null, arriveTime: null,
      airline: null, flightNumber: null, stops: null,
    },
    {
      label: "טיסת חזור",
      from: "בנגקוק", fromCode: "BKK",
      to: "ישראל", toCode: "TLV",
      date: null, departTime: null, arriveTime: null,
      airline: null, flightNumber: null, stops: null,
    },
  ],

  // התחנות לפי הסדר. confirmed: true = סגור, false = עוד לא סגור
  stops: [
    { name: "פוקט", emoji: "🏝️", nights: null, confirmed: true, note: "נוחתים כאן" },
    { name: "עוד לא נקבע", emoji: "❓", nights: null, confirmed: false, note: "האמצע של הטיול – עוד פתוח" },
    { name: "בנגקוק", emoji: "🏙️", nights: null, confirmed: true, note: "טסים הביתה מכאן" },
  ],

  // מלונות – לכל תחנה. status: "not-booked" | "considering" | "booked"
  hotels: [
    { stop: "פוקט", status: "not-booked", name: null, checkIn: null, checkOut: null, link: null },
    { stop: "בנגקוק", status: "not-booked", name: null, checkIn: null, checkOut: null, link: null },
  ],

  // מסלול יומי. type: "stay" (יום רגיל) | "move" (יום מעבר) | "flight"
  // דוגמה: { date: "2027-02-10", place: "פוקט", type: "flight", title: "נחיתה בפוקט", items: ["צ'ק-אין במלון", "שקיעה בחוף"] }
  days: [],

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
