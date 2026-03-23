import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "navbar": {
        "home": "Home",
        "about": "About Us",
        "how_it_works": "How it Works",
        "upload": "Upload",
        "signin": "Sign In",
        "logout": "Logout",
        "get_started": "Get Started",
        "disclaimer": "This platform provides informational insights only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional."
      },
      "chat": {
        "welcome": "Hi! I'm your MedExplain AI Assistant. Ask me anything about your report metrics!",
        "title": "MedExplain Assistant",
        "subtitle": "Ask about your stats",
        "placeholder": "E.g. Is my cholesterol too high?",
        "analyzing": "Analyzing...",
        "error": "Sorry, I'm having trouble analyzing your request right now. Please try again later."
      },
      "auth": {
        "login": {
          "title": "Welcome Back",
          "subtitle": "Log in to view your health history & trends",
          "email": "Email Address",
          "password": "Password",
          "forgot": "Forgot Password?",
          "button": "Sign In",
          "signing_in": "Signing in...",
          "no_account": "Don't have an account?",
          "signup_link": "Create one now"
        },
        "signup": {
          "title": "Create Account",
          "subtitle": "Start tracking your health with AI insights",
          "name": "Full Name",
          "email": "Email Address",
          "password": "Password",
          "button": "Create Account",
          "creating": "Creating account...",
          "has_account": "Already have an account?",
          "login_link": "Log in here"
        }
      },
      "about": {
        "title": "About MedExplain AI",
        "subtitle": "Demystifying healthcare, one report at a time.",
        "mission": {
          "title": "Our Mission",
          "text": "Our mission is to make medical reports easier for everyone to understand by using AI to translate complex medical data into simple language."
        },
        "why": {
          "title": "Why We Started",
          "text": "Many people receive medical lab reports full of complex terminology and numerical values they don't understand, leading to anxiety and confusion. MedExplain AI was built to empower patients with instant, easy-to-read insights."
        },
        "future": {
          "title": "Looking Forward",
          "text": "We are continuously improving our AI models to support more tests. Soon, we will introduce features like personalized health trend tracking and medical history management."
        }
      },
      "upload": {
        "title": "Analysis Center",
        "subtitle": "Upload your medical report for instant AI analysis.",
        "drag_drop": "Drag & drop your report here",
        "browse": "or click to browse from your device",
        "supported": "Supported formats: PDF, JPG, PNG (Max 10MB)",
        "analyze_btn": "Analyze Report",
        "analyzing": "Analyzing...",
        "ai_analyzing": "AI is analyzing your report...",
        "extracting": "Extracting exact lab values and biomarkers...",
        "security": "Your files are securely processed and automatically deleted immediately after analysis. We ensure complete privacy."
      },
      "landing": {
        "badge": "AI-Powered Medical Insights",
        "hero": {
          "title_part1": "Simplifying Medical",
          "title_accent": "Insights",
          "title_part2": "with AI",
          "subtitle": "Empowering healthcare professionals and patients with instant, accurate, and actionable AI-driven medical analysis. Bridge the gap between data and care.",
          "cta": "Upload Report",
          "demo": "View Demo"
        },
        "trust": {
          "label": "Trusted by Global Healthcare Leaders"
        },
        "stats": {
          "hospitals": "Hospitals Integrated",
          "accuracy": "Accuracy Rate",
          "insights": "Insights Generated"
        },
        "features": {
          "label": "Core Capabilities",
          "title": "Advanced AI solutions for the modern healthcare landscape.",
          "analysis": {
            "title": "AI Analysis",
            "desc": "Deep learning models process medical imagery and data with unprecedented speed and precision."
          },
          "collab": {
            "title": "Health Trends",
            "desc": "Track your medical history over time and visualize progress with interactive health timelines."
          },
          "summary": {
            "title": "Patient Summaries",
            "desc": "Convert complex clinical jargon into clear, simplified reports that help patients understand their health."
          }
        },
        "hiw": {
          "label": "The Process",
          "title": "How MedExplain Works",
          "step1": {
            "title": "Upload Report",
            "desc": "Securely upload your lab results or medical documents."
          },
          "step2": {
            "title": "AI Processing",
            "desc": "Our proprietary neural engine analyzes every data point."
          },
          "step3": {
            "title": "Verification",
            "desc": "Results are cross-referenced with medical terminology."
          },
          "step4": {
            "title": "Get Insights",
            "desc": "Receive detailed, easy-to-understand health insights."
          }
        },
        "cta": {
          "title": "Ready to understand your results?",
          "subtitle": "Join thousands of users who use MedExplain to simplify their healthcare journey.",
          "button": "Get Started Now"
        }
      },
      "dashboard": {
        "title": "Analysis Dashboard",
        "back": "Back to Upload",
        "patient_id": "Patient ID",
        "report_date": "Report Date",
        "export": "Export PDF",
        "exporting": "Exporting...",
        "total_tests": "Total Tests",
        "normal": "Normal Results",
        "abnormal": "Abnormal Results",
        "summary_title": "Quick Summary",
        "next_steps": "Recommended Next Steps",
        "urgency_title": "Overall Health Urgency",
        "risk_description": {
          "base": "Based on your metrics, your urgency level to consult a healthcare professional is rated at",
          "low": "Your results look generally stable, so standard routine checkups are appropriate.",
          "moderate": "You have some metrics that require attention. It's recommended to schedule a non-urgent visit.",
          "high": "Important markers are out of range. You should prioritize seeing a doctor as soon as possible.",
          "critical": "Important markers are out of range. You should prioritize seeing a doctor as soon as possible."
        },
        "breakdown": "Detailed Breakdown"
      },
      "notfound": {
        "title": "Page Not Found",
        "text": "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
        "button": "Return to Home"
      }
    }
  },
  hi: {
    translation: {
      "navbar": {
        "home": "होम",
        "about": "हमारे बारे में",
        "how_it_works": "यह कैसे काम करता है",
        "upload": "अपलोड करें",
        "signin": "साइन इन करें",
        "logout": "लॉग आउट",
        "get_started": "शुरू करें",
        "disclaimer": "यह प्लेटफ़ॉर्म केवल जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह, निदान या उपचार को प्रतिस्थापित नहीं करता है। हमेशा एक योग्य स्वास्थ्य देखभाल पेशेवर से परामर्श लें।"
      },
      "chat": {
        "welcome": "नमस्ते! मैं आपका MedExplain AI असिस्टेंट हूँ। अपनी रिपोर्ट के बारे में कुछ भी पूछें!",
        "title": "MedExplain असिस्टेंट",
        "subtitle": "अपने आँकड़ों के बारे में पूछें",
        "placeholder": "जैसे: क्या मेरा कोलेस्ट्रॉल बहुत अधिक है?",
        "analyzing": "विश्लेषण हो रहा है...",
        "error": "क्षमा करें, मुझे अभी आपके अनुरोध का विश्लेषण करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।"
      },
      "auth": {
        "login": {
          "title": "वापसी पर स्वागत है",
          "subtitle": "अपने स्वास्थ्य इतिहास और रुझान देखने के लिए लॉग इन करें",
          "email": "ईमेल पता",
          "password": "पासवर्ड",
          "forgot": "पासवर्ड भूल गए?",
          "button": "साइन इन करें",
          "signing_in": "साइन इन हो रहा है...",
          "no_account": "खाता नहीं है?",
          "signup_link": "अभी बनाएं"
        },
        "signup": {
          "title": "खाता बनाएं",
          "subtitle": "AI अंतर्दृष्टि के साथ अपने स्वास्थ्य को ट्रैक करना शुरू करें",
          "name": "पूरा नाम",
          "email": "ईमेल पता",
          "password": "पासवर्ड",
          "button": "खाता बनाएं",
          "creating": "खाता बनाया जा रहा है...",
          "has_account": "पहले से ही एक खाता है?",
          "login_link": "यहाँ लॉग इन करें"
        }
      },
      "about": {
        "title": "MedExplain AI के बारे में",
        "subtitle": "स्वास्थ्य सेवा को सरल बनाना, एक-एक रिपोर्ट करके।",
        "mission": {
          "title": "हमारा मिशन",
          "text": "हमारा मिशन जटिल चिकित्सा डेटा को सरल भाषा में अनुवाद करने के लिए AI का उपयोग करके मेडिकल रिपोर्ट को सभी के लिए समझना आसान बनाना है।"
        },
        "why": {
          "title": "हमने क्यों शुरू किया",
          "text": "कई लोगों को जटिल शब्दावली और संख्यात्मक मानों से भरी चिकित्सा रिपोर्ट प्राप्त होती है जिसे वे समझ नहीं पाते हैं। MedExplain AI को मरीजों को तत्काल, आसानी से पढ़ी जाने वाली जानकारी के साथ सशक्त बनाने के लिए बनाया गया था।"
        },
        "future": {
          "title": "आगे की सोच",
          "text": "हम अधिक परीक्षणों का समर्थन करने के लिए अपने AI मॉडल में लगातार सुधार कर रहे हैं। जल्द ही, हम व्यक्तिगत स्वास्थ्य रुझान और चिकित्सा इतिहास प्रबंधन जैसी सुविधाएं पेश करेंगे।"
        }
      },
      "upload": {
        "title": "विश्लेषण केंद्र",
        "subtitle": "त्वरित AI विश्लेषण के लिए अपनी मेडिकल रिपोर्ट अपलोड करें।",
        "drag_drop": "अपनी रिपोर्ट को यहाँ खींचें और छोड़ें",
        "browse": "या अपने डिवाइस से ब्राउज़ करने के लिए क्लिक करें",
        "supported": "समर्थित प्रारूप: PDF, JPG, PNG (अधिकतम 10MB)",
        "analyze_btn": "रिपोर्ट का विश्लेषण करें",
        "analyzing": "विश्लेषण हो रहा है...",
        "ai_analyzing": "AI आपकी रिपोर्ट का विश्लेषण कर रहा है...",
        "extracting": "सटीक लैब मूल्यों और बायोमार्कर को निकाला जा रहा है...",
        "security": "आपकी फ़ाइलें सुरक्षित रूप से संसाधित होती हैं और विश्लेषण के तुरंत बाद स्वचालित रूप से हटा दी जाती हैं। हम पूर्ण गोपनीयता सुनिश्चित करते हैं।"
      },
      "landing": {
        "badge": "AI-संचालित मेडिकल अंतर्दृष्टि",
        "hero": {
          "title_part1": "AI के साथ मेडिकल",
          "title_accent": "जानकारी",
          "title_part2": "को सरल बनाना",
          "subtitle": "तत्काल, सटीक और कार्रवाई योग्य AI-संचालित चिकित्सा विश्लेषण के साथ स्वास्थ्य सेवा पेशेवरों और रोगियों को सशक्त बनाना। डेटा और देखभाल के बीच की दूरी को मिटाना।",
          "cta": "रिपोर्ट अपलोड करें",
          "demo": "डेमो देखें"
        },
        "trust": {
          "label": "ग्लोबल हेल्थकेयर लीडर्स द्वारा भरोसेमंद"
        },
        "stats": {
          "hospitals": "अस्पताल एकीकृत",
          "accuracy": "सटीकता दर",
          "insights": "उत्पन्न अंतर्दृष्टि"
        },
        "features": {
          "label": "मुख्य क्षमताएं",
          "title": "आधुनिक स्वास्थ्य देखभाल परिदृश्य के लिए उन्नत AI समाधान।",
          "analysis": {
            "title": "AI विश्लेषण",
            "desc": "डीप लर्निंग मॉडल अभूतपूर्व गति और सटीकता के साथ चिकित्सा इमेजरी और डेटा को संसाधित करते हैं।"
          },
          "collab": {
            "title": "स्वास्थ्य रुझान",
            "desc": "समय के साथ अपने चिकित्सा इतिहास को ट्रैक करें और इंटरैक्टिव स्वास्थ्य समयरेखा के साथ प्रगति की कल्पना करें।"
          },
          "summary": {
            "title": "रोगी सारांश",
            "desc": "जटिल नैदानिक शब्दावली को स्पष्ट, सरल रिपोर्टों में परिवर्तित करें जो रोगियों को उनके स्वास्थ्य को समझने में मदद करती हैं।"
          }
        },
        "hiw": {
          "label": "प्रक्रिया",
          "title": "MedExplain कैसे काम करता है",
          "step1": {
            "title": "रिपोर्ट अपलोड करें",
            "desc": "अपने लैब परिणामों या चिकित्सा दस्तावेजों को सुरक्षित रूप से अपलोड करें।"
          },
          "step2": {
            "title": "AI प्रोसेसिंग",
            "desc": "हमारा मालिकाना न्यूरल इंजन हर डेटा पॉइंट का विश्लेषण करता है।"
          },
          "step3": {
            "title": "सत्यापन",
            "desc": "परिणामों को चिकित्सा शब्दावली के साथ क्रॉस-रेफरेंस किया जाता है।"
          },
          "step4": {
            "title": "अंतर्दृष्टि प्राप्त करें",
            "desc": "विस्तृत, समझने में आसान स्वास्थ्य अंतर्दृष्टि प्राप्त करें।"
          }
        },
        "cta": {
          "title": "क्या आप अपने परिणामों को समझने के लिए तैयार हैं?",
          "subtitle": "उन हजारों उपयोगकर्ताओं से जुड़ें जो अपनी स्वास्थ्य देखभाल यात्रा को सरल बनाने के लिए MedExplain का उपयोग करते हैं।",
          "button": "अभी शुरू करें"
        }
      },
      "dashboard": {
        "title": "विश्लेषण डैशबोर्ड",
        "back": "अपलोड पर वापस जाएं",
        "patient_id": "रोगी आईडी",
        "report_date": "रिपोर्ट दिनांक",
        "export": "PDF निर्यात करें",
        "exporting": "निर्यात हो रहा है...",
        "total_tests": "कुल परीक्षण",
        "normal": "सामान्य परिणाम",
        "abnormal": "असामान्य परिणाम",
        "summary_title": "त्वरित सारांश",
        "next_steps": "अनुशंसित अगले कदम",
        "urgency_title": "कुल स्वास्थ्य जीवनशैली",
        "risk_description": {
          "base": "आपके मेट्रिक्स के आधार पर, स्वास्थ्य सेवा पेशेवर से परामर्श करने के लिए आपकी तत्परता स्तर को",
          "low": "आपके परिणाम सामान्य रूप से स्थिर दिखते हैं, इसलिए मानक नियमित चेकअप उपयुक्त हैं।",
          "moderate": "आपके पास कुछ मेट्रिक्स हैं जिन पर ध्यान देने की आवश्यकता है। एक गैर-जरूरी मुलाकात निर्धारित करने की सिफारिश की जाती है।",
          "high": "महत्वपूर्ण मार्कर सीमा से बाहर हैं। आपको जल्द से जल्द डॉक्टर से मिलने को प्राथमिकता देनी चाहिए।",
          "critical": "महत्वपूर्ण मार्कर सीमा से बाहर हैं। आपको जल्द से जल्द डॉक्टर से मिलने को प्राथमिकता देनी चाहिए।"
        },
        "breakdown": "विस्तृत विवरण"
      },
      "notfound": {
        "title": "पृष्ठ नहीं मिला",
        "text": "आप जो पृष्ठ खोज रहे हैं उसे शायद हटा दिया गया है, उसका नाम बदल दिया गया है, या अस्थायी रूप से अनुपलब्ध है।",
        "button": "होम पर वापस जाएं"
      }
    }
  },
  hinglish: {
    translation: {
      "navbar": {
        "home": "Home",
        "about": "About Us",
        "how_it_works": "Kaise Kaam Karta Hai",
        "upload": "Upload Kare",
        "signin": "Sign In",
        "logout": "Logout",
        "get_started": "Get Started",
        "disclaimer": "Yeh platform sirf informational insights ke liye hai, professional doctor ki advice ki jagah nahi le sakta. Hamesha qualified doctor se consult karein."
      },
      "chat": {
        "welcome": "Hi! Main aapka MedExplain AI Assistant hoon. Apni report ke baare mein kuch bhi puchein!",
        "title": "MedExplain Assistant",
        "subtitle": "Apne stats ke baare mein puchein",
        "placeholder": "Jaise: Kya mera cholesterol high hai?",
        "analyzing": "Analyzing...",
        "error": "Sorry, abhi analyze karne mein problem ho rahi hai. Please baad mein try karein."
      },
      "auth": {
        "login": {
          "title": "Welcome Back",
          "subtitle": "Apna health history dekhne ke liye log in karein",
          "email": "Email Address",
          "password": "Password",
          "forgot": "Password bhool gaye?",
          "button": "Sign In",
          "signing_in": "Signing in...",
          "no_account": "Account nahi hai?",
          "signup_link": "Naya account banayein"
        },
        "signup": {
          "title": "Account Banayein",
          "subtitle": "AI insights ke saath health track karna start karein",
          "name": "Pura Naam",
          "email": "Email Address",
          "password": "Password",
          "button": "Account Banayein",
          "creating": "Account ban raha hai...",
          "has_account": "Pehle se account hai?",
          "login_link": "Yahan login karein"
        }
      },
      "about": {
        "title": "MedExplain AI ke baare mein",
        "subtitle": "Healthcare ko simple banana, ek ek report ke saath.",
        "mission": {
          "title": "Humara Mission",
          "text": "Humara mission complex medical data ko simple language mein translate karke reports ko sabke liye easy banana hai."
        },
        "why": {
          "title": "Humne kyun start kiya",
          "text": "Log complex terminology ki wajah se apni medical reports nahi samajh paate. MedExplain AI unhe instant aur easy insights dene ke liye banaya gaya hai."
        },
        "future": {
          "title": "Future Plans",
          "text": "Hum apne AI models ko improve kar rahe hain. Jaldi hi health trend tracking aur medical history jaisi features aayengi."
        }
      },
      "upload": {
        "title": "Analysis Center",
        "subtitle": "Instant AI analysis ke liye apni medical report upload karein.",
        "drag_drop": "Apni report yahan drag & drop karein",
        "browse": "ya device se browse karne ke liye click karein",
        "supported": "Supported formats: PDF, JPG, PNG (Max 10MB)",
        "analyze_btn": "Report Analyze Karein",
        "analyzing": "Analyzing...",
        "ai_analyzing": "AI aapki report analyze kar raha hai...",
        "extracting": "Lab values aur biomarkers nikal rahe hain...",
        "security": "Aapki files securely process hoti hain aur analysis ke baad automatically delete ho jati hain. Hum privacy ki guarantee dete hain."
      },
      "landing": {
        "badge": "AI-Powered Medical Insights",
        "hero": {
          "title_part1": "AI ke saath Medical",
          "title_accent": "Insights",
          "title_part2": "ko simple banayein",
          "subtitle": "Instant, accurate aur actionable AI-driven medical analysis ke saath patients ko empower karna. Data aur care ke beech ka gap mitaein.",
          "cta": "Report Upload Karein",
          "demo": "Demo Dekhein"
        },
        "trust": {
          "label": "Global Healthcare Leaders ka bharosa"
        },
        "stats": {
          "hospitals": "Hospitals Integrated",
          "accuracy": "Accuracy Rate",
          "insights": "Insights Generated"
        },
        "features": {
          "label": "Core Capabilities",
          "title": "Modern healthcare ke liye advanced AI solutions.",
          "analysis": {
            "title": "AI Analysis",
            "desc": "Deep learning models medical reports ko fast aur accurate tareeke se analyze karte hain."
          },
          "collab": {
            "title": "Health Trends",
            "desc": "Apni medical history track karein aur progress visualize karein."
          },
          "summary": {
            "title": "Patient Summaries",
            "desc": "Complex medical words ko easy language mein samjhein."
          }
        },
        "hiw": {
          "label": "Process",
          "title": "MedExplain kaise kaam karta hai",
          "step1": {
            "title": "Report Upload Karein",
            "desc": "Lab results ya medical documents securely upload karein."
          },
          "step2": {
            "title": "AI Processing",
            "desc": "Humara neural engine har data point ko analyze karta hai."
          },
          "step3": {
            "title": "Verification",
            "desc": "Results ko medical terminology se cross-check kiya jata hai."
          },
          "step4": {
            "title": "Get Insights",
            "desc": "Detailed aur easy-to-understand health insights payein."
          }
        },
        "cta": {
          "title": "Apne results samajhne ke liye ready hain?",
          "subtitle": "Un thousands of users se judein jo MedExplain use karte hain.",
          "button": "Abhi Start Karein"
        }
      },
      "dashboard": {
        "title": "Analysis Dashboard",
        "back": "Back to Upload",
        "patient_id": "Patient ID",
        "report_date": "Report Date",
        "export": "Export PDF",
        "exporting": "Exporting...",
        "total_tests": "Total Tests",
        "normal": "Normal Results",
        "abnormal": "Abnormal Results",
        "summary_title": "Quick Summary",
        "next_steps": "Recommended Next Steps",
        "urgency_title": "Overall Health Urgency",
        "risk_description": {
          "base": "Aapke metrics ke basis par, consultancy ki urgency level",
          "low": "Results stable lag rahe hain, routine checkups theek rahenge.",
          "moderate": "Kuch metrics attention maang rahe hain. Doctor se milna acha rahega.",
          "high": "Important markers range se bahar hain. Doctor se jaldi consult karein.",
          "critical": "Important markers range se bahar hain. Doctor se jaldi consult karein."
        },
        "breakdown": "Detailed Breakdown"
      },
      "notfound": {
        "title": "Page Nahi Mila",
        "text": "Aap jo page dhoondh rahe hain wo shayed remove ho gaya hai, name change ho gaya hai ya abhi available nahi hai.",
        "button": "Home Par Wapas Jayein"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
