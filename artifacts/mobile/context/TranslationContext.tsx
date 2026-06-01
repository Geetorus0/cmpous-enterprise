import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ta" | "te" | "hi" | "ml" | "ur" | "kn";

type Translations = Record<string, string>;

const TRANSLATIONS: Record<Locale, Translations> = {
  en: {
    // General / Auth
    "aec": "AEC",
    "clg_name": "Al-Ameen Engineering College",
    "developed_by": "Developed by Geetorus",
    "welcome_back": "Welcome Back",
    "sign_in_sub": "Sign in to your campus account",
    "email": "Email Address",
    "password": "Password",
    "sign_in": "Sign In",
    "quick_login": "Quick Demo Login",
    "biometric_unlock": "Unlock with Biometrics",
    "sign_out": "Sign Out",

    // Roles
    "student": "Student",
    "parent": "Parent",
    "faculty": "Faculty",
    "hod": "HOD",
    "admin": "Admin",

    // Dashboard Header
    "good_morning": "Good Morning,",
    "classes_today": "classes today",
    "in_campus": "In Campus",
    "out_campus": "Out of Campus",
    "current_active": "LIVE NOW",
    "schedule": "Today's Schedule",
    "notifications": "Notifications",
    "quick_stats": "Quick Statistics",

    // Dashboard Metrics
    "cgpa": "CGPA",
    "gpa": "GPA",
    "fees_due": "Fees Due",
    "arrears": "Arrears",
    "scholarship": "Scholarship",
    "attendance": "Attendance",
    "overall": "Overall",
    "subjects": "Subjects",
    "students": "Students",
    "sections": "Sections",

    // Attendance
    "present": "Present",
    "absent": "Absent",
    "late": "Late",
    "subject_wise": "Subject-wise Attendance",
    "eligible": "Eligible for examinations",
    "low_attendance": "Attendance is below 75%",
    "take_attendance": "Take Attendance",
    "absentees_only": "Mark Absentees Only",
    "bulk_absent": "Bulk Absent Mode",
    "submit_attendance": "Submit Attendance",
    "attendance_saved": "Attendance submitted and synced!",
    "offline_warning": "No Internet. Saving to offline queue...",
    "syncing": "Syncing with cloud...",

    // Academic Reports
    "academic_records": "Academic Records",
    "semester_marks": "Semester Marks",
    "internal_marks": "Internal Assessment",
    "marks_table": "Marks Summary",
    "download_marksheet": "Download Marksheet",
    "downloading": "Downloading...",
    "ca_marks": "Continuous Assessment",
    "exam_results": "Examination Results",

    // Fees Management
    "fee_details": "Fee Records",
    "total_fees": "Total Fees",
    "pending_amount": "Pending Amount",
    "paid_amount": "Paid Amount",
    "pay_online": "Pay Online",
    "payment_history": "Payment History",
    "payment_success": "Payment Successful",
    "payment_receipt": "Receipt Downloaded",
    "due_date": "Due Date",
    "pay_now": "Pay Now",

    // Quick Actions
    "quick_actions": "Quick Actions",
    "bonafide": "Bonafide Certificate",
    "leave_req": "Leave Request",
    "submit_complaint": "Submit Complaint",
    "study_materials": "Study Materials",
    "placements": "Placements Hub",
    "ai_assistant": "AI Campus Assistant",
    "transport": "Live Bus Tracker",
    "library": "Library Catalog",
    "hostel": "Hostel Management",

    // AI Assistant
    "ai_greeting": "How can I help you today?",
    "ai_placeholder": "Ask about fees, attendance, or tasks...",
    "ai_suggest_fees": "What is my pending fee?",
    "ai_suggest_att": "Is my attendance safe?",
    "ai_suggest_exam": "Show my CA1 marks",

    // Miscellaneous
    "lang_switcher": "Language / மொழி",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "Save",
    "cancel": "Cancel",
    "reason": "Reason",
    "apply": "Apply",
    "success": "Success",
  },
  ta: {
    // General / Auth
    "aec": "ஏஇசி",
    "clg_name": "அல்-அமீன் பொறியியல் கல்லூரி",
    "developed_by": "கீடோரஸ் உருவாக்கியது",
    "welcome_back": "நல்வரவு",
    "sign_in_sub": "உங்கள் கல்லூரி கணக்கில் உள்நுழையவும்",
    "email": "மின்னஞ்சல் முகவரி",
    "password": "கடவுச்சொல்",
    "sign_in": "உள்நுழைக",
    "quick_login": "டெமோ விரைவு உள்நுழைவு",
    "biometric_unlock": "பयोமெட்ரிக் மூலம் திறக்கவும்",
    "sign_out": "வெளியேறு",

    // Roles
    "student": "மாணவர்",
    "parent": "பெற்றோர்",
    "faculty": "ஆசிரியர்",
    "hod": "துறைத் தலைவர்",
    "admin": "நிர்வாகி",

    // Dashboard Header
    "good_morning": "காலை வணக்கம்,",
    "classes_today": "இன்றைய வகுப்புகள்",
    "in_campus": "வளாகத்தினுள்",
    "out_campus": "வளாகத்திற்கு வெளியே",
    "current_active": "தற்போது நடப்பவை",
    "schedule": "இன்றைய கால அட்டவணை",
    "notifications": "அறிவிப்புகள்",
    "quick_stats": "விரைவான புள்ளிவிவரங்கள்",

    // Dashboard Metrics
    "cgpa": "சிஜிபிஏ",
    "gpa": "ஜிபிஏ",
    "fees_due": "கட்டண நிலுவை",
    "arrears": "அரியர்ஸ்",
    "scholarship": "உதவித்தொகை",
    "attendance": "வருகைப்பதிவு",
    "overall": "ஒட்டுமொத்த",
    "subjects": "பாடங்கள்",
    "students": "மாணவர்கள்",
    "sections": "பிரிவுகள்",

    // Attendance
    "present": "வந்தார்",
    "absent": "வரவில்லை",
    "late": "தாமதம்",
    "subject_wise": "பாடம் வாரியான வருகை",
    "eligible": "தேர்வு எழுத தகுதியானவர்",
    "low_attendance": "வருகை 75% க்கும் குறைவாக உள்ளது",
    "take_attendance": "வருகைப்பதிவு செய்",
    "absentees_only": "வராதவர்களை மட்டும் குறிக்கவும்",
    "bulk_absent": "மொத்தமாக வரவில்லை குறித்தல்",
    "submit_attendance": "வருகைப்பதிவை சமர்ப்பி",
    "attendance_saved": "வருகைப்பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    "offline_warning": "இணைய இணைப்பு இல்லை. ஆஃப்லைனில் சேமிக்கப்படுகிறது...",
    "syncing": "கிளவுட் உடன் ஒத்திசைக்கப்படுகிறது...",

    // Academic Reports
    "academic_records": "கல்விப் பதிவுகள்",
    "semester_marks": "செமஸ்டர் மதிப்பெண்கள்",
    "internal_marks": "உள் மதிப்பீடு",
    "marks_table": "மதிப்பெண் சுരുக்கம்",
    "download_marksheet": "மதிப்பெண் பட்டியலை பதிவிறக்கு",
    "downloading": "பதிவிறக்கப்படுகிறது...",
    "ca_marks": "தொடர் மதிப்பீட்டு மதிப்பெண்",
    "exam_results": "தேர்வு முடிவுகள்",

    // Fees Management
    "fee_details": "கட்டணப் பதிவுகள்",
    "total_fees": "மொத்த கட்டணம்",
    "pending_amount": "நிலுவை தொகை",
    "paid_amount": "செலுத்திய தொகை",
    "pay_online": "ஆன்லைனில் செலுத்தவும்",
    "payment_history": "கட்டణ வரலாறு",
    "payment_success": "கட்டணம் வெற்றிகரமாக செலுத்தப்பட்டது",
    "payment_receipt": "ரசீது பதிவிறக்கம் செய்யப்பட்டது",
    "due_date": "கடைசி தேதி",
    "pay_now": "இப்போது செலுத்துக",

    // Quick Actions
    "quick_actions": "விரைவுச் செயல்பாடுகள்",
    "bonafide": "போனஃபைட் சான்றிதழ்",
    "leave_req": "விடுப்பு விண்ணப்பம்",
    "submit_complaint": "புகார் சமர்ப்பி",
    "study_materials": "பாடப் பொருட்கள்",
    "placements": "வேலைவாய்ப்பு மையம்",
    "ai_assistant": "செயற்கை நுண்ணறிவு உதவியாளர்",
    "transport": "நேரடி பேருந்து கண்காணிப்பு",
    "library": "நூலகக் பட்டியல்",
    "hostel": "விடுதி மேலாண்மை",

    // AI Assistant
    "ai_greeting": "நான் உங்களுக்கு இன்று எவ்வாறு உதவ முடியும்?",
    "ai_placeholder": "கட்டணம், வருகைப்பதிவு பற்றி கேளுங்கள்...",
    "ai_suggest_fees": "எனது நிலுவை கட்டணம் எவ்வளவு?",
    "ai_suggest_att": "எனது வருகைப்பதிவு போதுமானதா?",
    "ai_suggest_exam": "எனது CA1 மதிப்பெண்களைக் காட்டு",

    // Miscellaneous
    "lang_switcher": "மொழி / Language",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "சேமி",
    "cancel": "ரத்துசெய்",
    "reason": "காரணம்",
    "apply": "விண்ணப்பி",
    "success": "வெற்றி",
  },
  te: {
    // General / Auth
    "aec": "ఏఈసీ",
    "clg_name": "అల్-అమీన్ ఇంజనీరింగ్ కాలేజ్",
    "developed_by": "గీటోరస్ ద్వారా అభివృద్ధి చేయబడింది",
    "welcome_back": "స్వాగతం",
    "sign_in_sub": "మీ క్యాంపస్ ఖాతాకు లాగిన్ చేయండి",
    "email": "ఈమెయిల్ చిరునామా",
    "password": "పాస్‌వర్డ్",
    "sign_in": "లాగిన్",
    "quick_login": "త్వరిత డెమో లాగిన్",
    "biometric_unlock": "బయోమెట్రిక్‌తో అన్‌లాక్ చేయండి",
    "sign_out": "లాగ్ అవుట్",

    // Roles
    "student": "విద్యార్థి",
    "parent": "తల్లిదండ్రులు",
    "faculty": "ఫ్యాకల్టీ",
    "hod": "హెచ్‌ఓడి",
    "admin": "అడ్మిన్",

    // Dashboard Header
    "good_morning": "శుభోదయం,",
    "classes_today": "ఈరోజు తరగతులు",
    "in_campus": "క్యాంపస్ లోపల",
    "out_campus": "క్యాంపస్ వెలుపల",
    "current_active": "ఇప్పుడు ప్రత్యక్షంగా",
    "schedule": "ఈనాటి షెడ్యూల్",
    "notifications": "నోటిఫికేషన్లు",
    "quick_stats": "త్వరిత గణాంకాలు",

    // Dashboard Metrics
    "cgpa": "సిజిపిఎ",
    "gpa": "ಜಿಪಿಎ",
    "fees_due": "ఫీజు బకాయి",
    "arrears": "అరియర్స్",
    "scholarship": "స్కాలర్‌షిప్",
    "attendance": "హాజరు",
    "overall": "మొత్తం",
    "subjects": "సబ్జెక్టులు",
    "students": "విద్యార్థులు",
    "sections": "విభాగాలు",

    // Attendance
    "present": "హాజరయ్యారు",
    "absent": "హాజరు కాలేదు",
    "late": "ఆలస్యం",
    "subject_wise": "సబ్జెక్టుల వారీగా హాజరు",
    "eligible": "ಪರೀಕ್ಷೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದಾರೆ",
    "low_attendance": "ಹಾಜರಾತಿ ಶೇ. 75 ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದೆ",
    "take_attendance": "హాజరు తీసుకోండి",
    "absentees_only": "ಹಾಜರಾಗದವರನ್ನು ಮಾತ್ರ ಗುರುತಿಸಿ",
    "bulk_absent": "ಬಲ್ಕ್ ಗೈರುಹಾಜರಿ ಮೋಡ್",
    "submit_attendance": "హాಜರಾತಿ ಸಲ್ಲಿಸಿ",
    "attendance_saved": "ಹಾಜರಾತಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ ಮತ್ತು ಸಿಂಕ್ ಆಗಿದೆ!",
    "offline_warning": "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    "syncing": "ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",

    // Academic Reports
    "academic_records": "ಅಕಡಮಿಕ್ ರಿಕಾರ್ಡುలు",
    "semester_marks": "ಸೆಮಿಸ್ಟರ್ ಮಾರ್కులు",
    "internal_marks": "ಅಂತర్గత అంచనా",
    "marks_table": "మార్కుల సారాంశం",
    "download_marksheet": "మార్క్‌షీట్ డౌన్‌లోడ్ చేయండి",
    "downloading": "డౌన్‌లోడ్ అవుతోంది...",
    "ca_marks": "ನಿರಂತರ ಮೌಲ್ಯಮಾಪನ",
    "exam_results": "ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು",

    // Fees Management
    "fee_details": "Fee Records",
    "total_fees": "మొత్తం ఫీజు",
    "pending_amount": "బకాయి మొత్తం",
    "paid_amount": "చెల్లించిన మొత్తం",
    "pay_online": "ఆన్‌లైన్‌లో చెల్లించండి",
    "payment_history": "చెల్లింపుల చరిత్ర",
    "payment_success": "చెల్లింపు విజయవంతమైంది",
    "payment_receipt": "ರಶೀದಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ",
    "due_date": "గడువు తేదీ",
    "pay_now": "ఇప్పుడే చెల్లించండి",

    // Quick Actions
    "quick_actions": "త్వరిత చర్యలు",
    "bonafide": "బోనాఫైడ్ సర్టిఫికೇట్",
    "leave_req": "సెలవు దరఖాస్తు",
    "submit_complaint": "ದೂರು ಸಲ್ಲಿಸಿ",
    "study_materials": "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು",
    "placements": "ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಹಬ್",
    "ai_assistant": "AI ಕ್ಯಾಂಪಸ್ ಸಹಾಯಕ",
    "transport": "ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕರ್",
    "library": "ಗ್ರಂಥಾಲಯ ಕ್ಯಾಟಲಾಗ್",
    "hostel": "ಹಾಸ್ಟೆಲ್ ನಿರ್ವಹಣೆ",

    // AI Assistant
    "ai_greeting": "ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
    "ai_placeholder": "ಶುಲ್ಕ, ಹಾಜರಾತಿ ಅಥವಾ ಕಾರ್ಯಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    "ai_suggest_fees": "ನನ್ನ ಬಾಕಿ ಶುಲ್ಕ ಎಷ್ಟು?",
    "ai_suggest_att": "ನನ್ನ ಹಾಜರಾತಿ ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?",
    "ai_suggest_exam": "ನನ್ನ CA1 ಅಂಕಗಳನ್ನು ತೋರಿಸಿ",

    // Miscellaneous
    "lang_switcher": "Language / ഭാഷ",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "ಉಳಿಸು",
    "cancel": "ರದ್ದುಗೊಳಿಸು",
    "reason": "ಕಾರಣ",
    "apply": "ಅನ್ವಯಿಸು",
    "success": "ಯಶಸ್ಸು",
  },
  hi: {
    // General / Auth
    "aec": "एईसी",
    "clg_name": "अल-अमीन इंजीनियरिंग कॉलेज",
    "developed_by": "गीटोरस द्वारा विकसित",
    "welcome_back": "आपका स्वागत है",
    "sign_in_sub": "अपने कैंपस खाते में लॉग इन करें",
    "email": "ईमेल पता",
    "password": "पासवर्ड",
    "sign_in": "लॉग इन करें",
    "quick_login": "त्वरित डेमो लॉगिन",
    "biometric_unlock": "बायोमेट्रिक से अनलॉक करें",
    "sign_out": "लॉग आउट करें",

    // Roles
    "student": "छात्र",
    "parent": "अभिभावक",
    "faculty": "संकाय",
    "hod": "विभागाध्यक्ष",
    "admin": "एडमिन",

    // Dashboard Header
    "good_morning": "शुभ प्रभात,",
    "classes_today": "आज की कक्षाएं",
    "in_campus": "कैंपस में",
    "out_campus": "कैंपस से बाहर",
    "current_active": "अभी लाइव",
    "schedule": "आज की अनुसूची",
    "notifications": "सूचनाएं",
    "quick_stats": "त्वरित आँकड़े",

    // Dashboard Metrics
    "cgpa": "सीजीपीए",
    "gpa": "जीपीए",
    "fees_due": "देय शुल्क",
    "arrears": "बकाया",
    "scholarship": "छात्रवृत्ति",
    "attendance": "उपस्थिति",
    "overall": "कुल",
    "subjects": "विषय",
    "students": "छात्र",
    "sections": "वर्ग",

    // Attendance
    "present": "उपस्थित",
    "absent": "अनुपस्थित",
    "late": "विलंब",
    "subject_wise": "विषयवार उपस्थिति",
    "eligible": "परीक्षा के लिए पात्र",
    "low_attendance": "उपस्थिति 75% से कम है",
    "take_attendance": "उपस्थिति लें",
    "absentees_only": "केवल अनुपस्थित चिह्नित करें",
    "bulk_absent": "थोक अनुपस्थिति मोड",
    "submit_attendance": "उपस्थिति जमा करें",
    "attendance_saved": "उपस्थिति दर्ज और सिंक हो गई!",
    "offline_warning": "इंटरनेट नहीं है। ऑफ़लाइन कतार में सहेजा जा रहा है...",
    "syncing": "क्लाउड के साथ सिंक हो रहा है...",

    // Academic Reports
    "academic_records": "अकादमिक रिकॉर्ड",
    "semester_marks": "सेमेस्टर अंक",
    "internal_marks": "आंतरिक मूल्यांकन",
    "marks_table": "अंक सारांश",
    "download_marksheet": "मार्क्सशीट डाउनलोड करें",
    "downloading": "डाउनलोड हो रहा है...",
    "ca_marks": "सतत मूल्यांकन",
    "exam_results": "परीक्षा परिणाम",

    // Fees Management
    "fee_details": "शुल्क विवरण",
    "total_fees": "कुल शुल्क",
    "pending_amount": "बकाया राशि",
    "paid_amount": "भुगतान की गई राशि",
    "pay_online": "ऑनलाइन भुगतान करें",
    "payment_history": "भुगतान इतिहास",
    "payment_success": "भुगतान सफल रहा",
    "payment_receipt": "रसीद डाउनलोड हो गई",
    "due_date": "नियत तारीख",
    "pay_now": "अभी भुगतान करें",

    // Quick Actions
    "quick_actions": "त्वरित कार्रवाई",
    "bonafide": "बोनाफाइड प्रमाणपत्र",
    "leave_req": "छुट्टी का अनुरोध",
    "submit_complaint": "शिकायत दर्ज करें",
    "study_materials": "अध्ययन सामग्री",
    "placements": "प्लेसमेंट हब",
    "ai_assistant": "एआई कैंपस सहायक",
    "transport": "लाइव बस ट्रैकर",
    "library": "पुस्तकालय सूची",
    "hostel": "छात्रावास प्रबंधन",

    // AI Assistant
    "ai_greeting": "आज मैं आपकी क्या सहायता कर सकता हूँ?",
    "ai_placeholder": "शुल्क, उपस्थिति या कार्यों के बारे में पूछें...",
    "ai_suggest_fees": "मेरा बकाया शुल्क कितना है?",
    "ai_suggest_att": "क्या मेरी उपस्थिति सुरक्षित है?",
    "ai_suggest_exam": "मेरे CA1 अंक दिखाएं",

    // Miscellaneous
    "lang_switcher": "भाषा / Language",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "सहेजें",
    "cancel": "रद्द करें",
    "reason": "कारण",
    "apply": "लागू करें",
    "success": "सफलता",
  },
  ml: {
    // General / Auth
    "aec": "എഇസി",
    "clg_name": "അൽ-അമീൻ എഞ്ചിനീയറിംഗ് കോളേജ്",
    "developed_by": "ഗീറ്റോരസ് വികസിപ്പിച്ചത്",
    "welcome_back": "സ്വാഗതം",
    "sign_in_sub": "നിങ്ങളുടെ കാമ്പസ് അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യുക",
    "email": "ഇമെയിൽ വിലാസം",
    "password": "പാസ്‌വേഡ്",
    "sign_in": "ലോഗിൻ ചെയ്യുക",
    "quick_login": "ദ്രുത ഡെമോ ലോഗിൻ",
    "biometric_unlock": "ബയോമെട്രിക് ഉപയോഗിച്ച് അൺലോക്ക് ചെയ്യുക",
    "sign_out": "Log Out",

    // Roles
    "student": "വിദ്യാർത്ഥി",
    "parent": "രക്ഷിതാവ്",
    "faculty": "ഫാക്കൽറ്റി",
    "hod": "HOD",
    "admin": "അഡ്മിൻ",

    // Dashboard Header
    "good_morning": "ശുഭദിനം,",
    "classes_today": "ഇന്നത്തെ ക്ലാസുകൾ",
    "in_campus": "കാമ്പസിനുള്ളിൽ",
    "out_campus": "കാമ്പസിന് പുറത്ത്",
    "current_active": "ഇപ്പോൾ ലൈവ്",
    "schedule": "ഇന്നത്തെ ഷെഡ്യൂൾ",
    "notifications": "അറിയിപ്പുകൾ",
    "quick_stats": "ദ്രുത സ്ഥിതിവിവരക്കണക്കുകൾ",

    // Dashboard Metrics
    "cgpa": "സി.ജി.പി.എ",
    "gpa": "ജി.പി.എ",
    "fees_due": "ഫീസ് കുടിശ്ശിക",
    "arrears": "അരിയേഴ്സ്",
    "scholarship": "സ്കോളർഷിപ്പ്",
    "attendance": "ഹാജർ",
    "overall": "ആകെ",
    "subjects": "വിഷയങ്ങൾ",
    "students": "വിദ്യാർത്ഥികൾ",
    "sections": "സെക്ഷനുകൾ",

    // Attendance
    "present": "ഹാജരുണ്ട്",
    "absent": "ഹാജരില്ല",
    "late": "വൈകി",
    "subject_wise": "വിഷയ അടിസ്ഥാനത്തിലുള്ള ഹാജർ",
    "eligible": "പരീക്ഷയ്ക്ക് യോഗ്യതയുണ്ട്",
    "low_attendance": "ഹാജർ 75 ശതമാനത്തിൽ താഴെയാണ്",
    "take_attendance": "ഹാജർ രേഖപ്പെടുത്തുക",
    "absentees_only": "ഹാജരില്ലാത്തവരെ മാത്രം അടയാളപ്പെടുത്തുക",
    "bulk_absent": "ബൾക്ക് ആബ്‌സെൻ്റ് മോഡ്",
    "submit_attendance": "ഹാജർ സമർപ്പിക്കുക",
    "attendance_saved": "ഹാജർ സമർപ്പിക്കുകയും സമന്വയിപ്പിക്കുകയും ചെയ്തു!",
    "offline_warning": "ഇൻ്റർനെറ്റ് ഇല്ല. ഓഫ്‌ലൈൻ ക്യൂവിലേക്ക് സംരക്ഷിക്കുന്നു...",
    "syncing": "ക്ലൗഡുമായി സമന്വയിപ്പിക്കുന്നു...",

    // Academic Reports
    "academic_records": "അക്കാദമിക് റെക്കോർഡുകൾ",
    "semester_marks": "സെമസ്റ്റർ മാർക്കുകൾ",
    "internal_marks": "ആന്തരിക വിലയിരുത്തൽ",
    "marks_table": "മാർക്ക് സംഗ്രഹം",
    "download_marksheet": "മാർക്ക്ഷീറ്റ് ഡൗൺಲೋಡ್ ചെയ്യുക",
    "downloading": "ഡൗൺಲೋഡ് ചെയ്യുന്നു...",
    "ca_marks": "തുടർച്ചയായ വിലയിരുത്തൽ",
    "exam_results": "പരീക്ഷാ ഫലങ്ങൾ",

    // Fees Management
    "fee_details": "ഫീസ് വിവരങ്ങൾ",
    "total_fees": "ആകെ ഫീസ്",
    "pending_amount": "കുടിശ്ശിക തുക",
    "paid_amount": "അടച്ച തുക",
    "pay_online": "ഓൺലൈനായി അടയ്ക്കുക",
    "payment_history": "പേയ്‌മെൻ്റ് ചരിത്രം",
    "payment_success": "പേയ്‌മെൻ്റ് വിജയിച്ചു",
    "payment_receipt": "രസീത് ഡൗൺಲೋഡ് ചെയ്തു",
    "due_date": "അവസാന തീയതി",
    "pay_now": "ഇപ്പോൾ അടയ്ക്കുക",

    // Quick Actions
    "quick_actions": "ദ്രുത നടപടികൾ",
    "bonafide": "ബോണഫൈഡ് സർട്ടിഫിക്കറ്റ്",
    "leave_req": "അവധി അപേക്ഷ",
    "submit_complaint": "പരാതി സമർപ്പിക്കുക",
    "study_materials": "പഠന സാമഗ്രികൾ",
    "placements": "പ്ലേസ്‌മെൻ്റ് ഹബ്",
    "ai_assistant": "AI കാമ്പസ് സഹായി",
    "transport": "ലൈവ് ബസ് ട്രാക്കർ",
    "library": "ലൈബ്രറി കാറ്റലೋಗ്",
    "hostel": "ഹോസ്റ്റൽ മാനേജ്‌മെൻ്റ്",

    // AI Assistant
    "ai_greeting": "ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?",
    "ai_placeholder": "ഫീസ്, ഹാജർ, അല്ലെങ്കിൽ ടാസ്കുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    "ai_suggest_fees": "എൻ്റെ കുടിശ്ശിക ഫീസ് എത്രയാണ്?",
    "ai_suggest_att": "എൻ്റെ ഹാജർ സുരക്ഷിതമാണോ?",
    "ai_suggest_exam": "എൻ്റെ CA1 മാർക്കുകൾ കാണിക്കുക",

    // Miscellaneous
    "lang_switcher": "ഭാഷ / Language",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "സംരക്ഷിക്കുക",
    "cancel": "റദ്ദാക്കുക",
    "reason": "കാരണം",
    "apply": "അപേക്ഷിക്കുക",
    "success": "വിജയം",
  },
  ur: {
    // General / Auth
    "aec": "اے ای سی",
    "clg_name": "الامین انجینئرنگ کالج",
    "developed_by": "Geetorus کا تیار کردہ",
    "welcome_back": "خوش آمدید",
    "sign_in_sub": "اپنے کیمپس اکاؤنٹ میں لاگ ان کریں",
    "email": "ای میل ایڈریس",
    "password": "پاس ورڈ",
    "sign_in": "لاگ ان کریں",
    "quick_login": "فوری ڈیمو لاگ ان",
    "biometric_unlock": "بایومیٹرک سے انلاک کریں",
    "sign_out": "لاگ آؤٹ",

    // Roles
    "student": "طالب علم",
    "parent": "والدین",
    "faculty": "اساتذہ",
    "hod": "HOD",
    "admin": "ایڈمن",

    // Dashboard Header
    "good_morning": "صبح بخیر،",
    "classes_today": "آج کی کلاسز",
    "in_campus": "کیمپس کے اندر",
    "out_campus": "کیمپس سے باہر",
    "current_active": "ابھی لائیو",
    "schedule": "آج کا شیڈول",
    "notifications": "اطلاعات",
    "quick_stats": "فوری اعداد و شمار",

    // Dashboard Metrics
    "cgpa": "سی جی پی اے",
    "gpa": "جی پی اے",
    "fees_due": "واجب الادا فیس",
    "arrears": "بقایا جات",
    "scholarship": "اسکالرشپ",
    "attendance": "حاضری",
    "overall": "مجموعی طور پر",
    "subjects": "مضامین",
    "students": "طلبا",
    "sections": "سیکشنز",

    // Attendance
    "present": "حاضر",
    "absent": "غیر حاضر",
    "late": "تاخیر",
    "subject_wise": "مضمون وار حاضری",
    "eligible": "امتحانات کے اہل",
    "low_attendance": "حاضری 75 فیصد سے کم ہے",
    "take_attendance": "حاضری لیں",
    "absentees_only": "صرف غیر حاضر نشان زد کریں",
    "bulk_absent": "بلک غیر حاضر موڈ",
    "submit_attendance": "حاضری جمع کروائیں",
    "attendance_saved": "حاضری جمع اور سنک ہو گئی!",
    "offline_warning": "انٹرنیٹ نہیں ہے۔ آف لائن قطار میں محفوظ کیا جا رہا ہے...",
    "syncing": "کلاؤڈ کے ساتھ مطابقت پذیری ہو رہی ہے...",

    // Academic Reports
    "academic_records": "تعلیمی ریکارڈ",
    "semester_marks": "سمسٹر مارکس",
    "internal_marks": "داخلی تشخیص",
    "marks_table": "مارکس کا خلاصہ",
    "download_marksheet": "مارک شیٹ ڈاؤن لوڈ کریں",
    "downloading": "ڈاؤن لوڈ ہو رہا ہے...",
    "ca_marks": "مستقل تشخیص",
    "exam_results": "امتحان کے نتائج",

    // Fees Management
    "fee_details": "فیس کا ریکارڈ",
    "total_fees": "کل فیس",
    "pending_amount": "بقایا رقم",
    "paid_amount": "ادا شدہ رقم",
    "pay_online": "آن لائن ادائیگی کریں",
    "payment_history": "ادائیگیوں کی تاریخ",
    "payment_success": "ادائیگی کامیاب رہی",
    "payment_receipt": "رسید ڈاؤن لوڈ ہو گئی",
    "due_date": "آخری تاریخ",
    "pay_now": "ابھی ادائیگی کریں",

    // Quick Actions
    "quick_actions": "فوری اقدامات",
    "bonafide": "بونافائیڈ سرٹیفکیٹ",
    "leave_req": "رخصت کی درخواست",
    "submit_complaint": "شکایت درج کریں",
    "study_materials": "مطالعاتی مواد",
    "placements": "پلیسمنٹ ہب",
    "ai_assistant": "اے آئی کیمپس اسسٹنٹ",
    "transport": "لائیو بس ٹریکر",
    "library": "لائبریری کیٹلاگ",
    "hostel": "ہاسٹل مینجمنٹ",

    // AI Assistant
    "ai_greeting": "آج میں آپ کی کیا مدد کر سکتا ہوں؟",
    "ai_placeholder": "فیس، حاضری یا کاموں کے بارے میں پوچھیں...",
    "ai_suggest_fees": "میری بقایا فیس کتنی ہے؟",
    "ai_suggest_att": "کیا میری حاضری محفوظ ہے؟",
    "ai_suggest_exam": "میرے CA1 مارکس دکھائیں",

    // Miscellaneous
    "lang_switcher": "زبان / Language",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "محفوظ کریں",
    "cancel": "منسوخ کریں",
    "reason": "وجہ",
    "apply": "درخواست کریں",
    "success": "کامیابی",
  },
  kn: {
    // General / Auth
    "aec": "ಎಇಸಿ",
    "clg_name": "ಅಲ್-ಅಮೀನ್ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು",
    "developed_by": "ಗೀಟೋರಸ್ ಅಭಿವೃದ್ಧಿಪಡಿಸಿದೆ",
    "welcome_back": "ಸುಸ್ವಾಗತ",
    "sign_in_sub": "ನಿಮ್ಮ ಕ್ಯಾಂಪಸ್ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ",
    "email": "ಇಮೇಲ್ ವಿಳಾಸ",
    "password": "ಪಾಸ್ವರ್ಡ್",
    "sign_in": "ಲಾಗಿನ್ ಮಾಡಿ",
    "quick_login": "ತ್ವರಿತ ಡೆಮೊ ಲಾಗಿನ್",
    "biometric_unlock": "ಬಯೋಮೆಟ್ರಿಕ್‌ನೊಂದಿಗೆ ಅನ್‌ಲಾಕ್ ಮಾಡಿ",
    "sign_out": "ಲಾಗ್ ಔಟ್ ಮಾಡಿ",

    // Roles
    "student": "ವಿದ್ಯಾರ್ಥಿ",
    "parent": "ಪೋಷಕರು",
    "faculty": "ಫ್ಯಾಕಲ್ಟಿ",
    "hod": "ಎಚ್.ಒ.ಡಿ",
    "admin": "ಅಡ್ಮಿನ್",

    // Dashboard Header
    "good_morning": "ಶುಭೋದಯ,",
    "classes_today": "ಇಂದಿನ ತರಗತಿಗಳು",
    "in_campus": "ಕ್ಯಾಂಪಸ್ ಒಳಗೆ",
    "out_campus": "ಕ್ಯಾಂಪಸ್ ಹೊರಗೆ",
    "current_active": "ಈಗ ಲೈವ್",
    "schedule": "ಇಂದಿನ ವೇಳಾಪಟ್ಟಿ",
    "notifications": "ಅಧಿಸೂಚನೆಗಳು",
    "quick_stats": "ತ್ವರಿತ ಅಂಕಿಅಂಶಗಳು",

    // Dashboard Metrics
    "cgpa": "ಸಿಜಿಪಿಎ",
    "gpa": "ಜಿಪಿಎ",
    "fees_due": "ಬಾಕಿ ಶುಲ್ಕ",
    "arrears": "ಅರಿಯರ್ಸ್",
    "scholarship": "ವೇತನ ಪ್ರಶಸ್ತಿ",
    "attendance": "ಹಾಜರಾತಿ",
    "overall": "ಒಟ್ಟಾರೆ",
    "subjects": "ವಿಷಯಗಳು",
    "students": "ವಿದ್ಯಾರ್ಥಿಗಳು",
    "sections": "ವಿಭಾಗಗಳು",

    // Attendance
    "present": "ಹಾಜರಿದ್ದಾರೆ",
    "absent": "ಗೈರುಹಾಜರಾಗಿದ್ದಾರೆ",
    "late": "ವಿಳಂಬ",
    "subject_wise": "ವಿಷಯವಾರು ಹಾಜರಾತಿ",
    "eligible": "ಪರೀಕ್ಷೆಗಳಿಗೆ ಅರ್ಹರಾಗಿದ್ದಾರೆ",
    "low_attendance": "ಹಾಜರಾತಿ ಶೇ. 75 ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದೆ",
    "take_attendance": "ಹಾಜರಾತಿ ತೆಗೆದುಕೊಳ್ಳಿ",
    "absentees_only": "ಗೈರುಹಾಜರಾದವರನ್ನು ಮಾತ್ರ ಗುರುತಿಸಿ",
    "bulk_absent": "ಬಲ್ಕ್ ಗೈರುಹಾಜರಿ ಮೋಡ್",
    "submit_attendance": "ಹಾಜರಾತಿ ಸಲ್ಲಿಸಿ",
    "attendance_saved": "ಹಾಜರಾತಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ ಮತ್ತು ಸಿಂಕ್ ಆಗಿದೆ!",
    "offline_warning": "ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕವಿಲ್ಲ. ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತಿದೆ...",
    "syncing": "ಕ್ಲೌಡ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",

    // Academic Reports
    "academic_records": "ಶೈಕ್ಷಣಿಕ ದಾಖಲೆಗಳು",
    "semester_marks": "ಸೆಮಿಸ್ಟರ್ ಅಂಕಗಳು",
    "internal_marks": "ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನ",
    "marks_table": "ಅಂಕಗಳ ಸಾರಾಂಶ",
    "download_marksheet": "ಅಂಕಪಟ್ಟಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    "downloading": "ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "ca_marks": "ನಿರಂತರ ಮೌಲ್ಯಮಾಪನ",
    "exam_results": "ಪರೀಕ್ಷಾ ಫಲಿತಾಂಶಗಳು",

    // Fees Management
    "fee_details": "ಶುಲ್ಕ ವಿವರಗಳು",
    "total_fees": "ಒಟ್ಟು ಶುಲ್ಕ",
    "pending_amount": "ಬಾಕಿ ಮೊತ್ತ",
    "paid_amount": "ಪಾವತಿಸಿದ ಮೊತ್ತ",
    "pay_online": "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ",
    "payment_history": "ಪಾವತಿ ಇತಿಹಾಸ",
    "payment_success": "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    "payment_receipt": "ರಶೀದಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ",
    "due_date": "ಕೊನೆಯ ದಿನಾಂಕ",
    "pay_now": "ಈಗಲೇ ಪಾವತಿಸಿ",

    // Quick Actions
    "quick_actions": "ತ್ವರಿತ ಕ್ರಮಗಳು",
    "bonafide": "ಬೋನಫೈಡ್ ಪ್ರಮಾಣಪತ್ರ",
    "leave_req": "ರಜೆ ಅರ್ಜಿ",
    "submit_complaint": "ದೂರು ಸಲ್ಲಿಸಿ",
    "study_materials": "ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳು",
    "placements": "ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಹಬ್",
    "ai_assistant": "AI ಕ್ಯಾಂಪಸ್ ಸಹಾಯಕ",
    "transport": "ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕರ್",
    "library": "ಗ್ರಂಥಾಲಯ ಕ್ಯಾಟಲಾಗ್",
    "hostel": "ಹಾಸ್ಟೆಲ್ ನಿರ್ವಹಣೆ",

    // AI Assistant
    "ai_greeting": "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    "ai_placeholder": "ಶುಲ್ಕ, ಹಾಜರಾತಿ ಅಥವಾ ಕಾರ್ಯಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    "ai_suggest_fees": "ನನ್ನ ಬಾಕಿ ಶುಲ್ಕ ಎಷ್ಟು?",
    "ai_suggest_att": "ನನ್ನ ಹಾಜರಾತಿ ಸುರಕ್ಷಿತವಾಗಿದೆಯೇ?",
    "ai_suggest_exam": "ನನ್ನ CA1 ಅಂಕಗಳನ್ನು ತೋರಿಸಿ",

    // Miscellaneous
    "lang_switcher": "ಭಾಷೆ / Language",
    "eng": "English",
    "tam": "தமிழ்",
    "tel": "తెలుగు",
    "hin": "हिन्दी",
    "mal": "മലയാളം",
    "urd": "اردو",
    "kan": "ಕನ್ನಡ",
    "save": "ಉಳಿಸು",
    "cancel": "ರದ್ದುಗೊಳಿಸು",
    "reason": "ಕಾರಣ",
    "apply": "ಅನ್ವಯಿಸು",
    "success": "ಯಶಸ್ಸು",
  },
};

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

const LOCALE_STORAGE_KEY = "@aec_locale";

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (["en", "ta", "te", "hi", "ml", "ur", "kn"].includes(stored as any)) {
          setLocaleState(stored as Locale);
        }
      } catch (_) {
        // ignore
      }
    })();
  }, []);

  const setLocale = async (newLocale: Locale) => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    setLocaleState(newLocale);
  };

  const t = (key: string): string => {
    const text = TRANSLATIONS[locale][key];
    if (text) return text;
    // Fallback to English
    const fallback = TRANSLATIONS["en"][key];
    if (fallback) return fallback;
    return key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
