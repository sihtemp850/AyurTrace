// AyurTrace - Multilingual Language Manager for Farmers
// Location-based language detection with manual override capability

class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.detectedLanguage = null;
        this.userPreference = null;
        this.locationData = null;
        this.googleTranslateApiKey = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw'; // Demo key - replace with actual
        this.translationCache = new Map();
        
        // Initialize language system
        this.init();
    }

    // Language mappings for Indian states and regions
    stateLanguageMap = {
        // Major Hindi-speaking states
        'uttar pradesh': 'hi',
        'bihar': 'hi',
        'madhya pradesh': 'hi',
        'rajasthan': 'hi',
        'haryana': 'hi',
        'jharkhand': 'hi',
        'uttarakhand': 'hi',
        'himachal pradesh': 'hi',
        'delhi': 'hi',
        
        // South Indian states
        'tamil nadu': 'ta',
        'kerala': 'ml',
        'karnataka': 'kn',
        'andhra pradesh': 'te',
        'telangana': 'te',
        
        // Western states
        'maharashtra': 'mr',
        'gujarat': 'gu',
        'goa': 'mr',
        
        // Eastern states
        'west bengal': 'bn',
        'odisha': 'or',
        'assam': 'as',
        
        // Northeastern states
        'manipur': 'mni',
        'tripura': 'bn',
        'meghalaya': 'en',
        'nagaland': 'en',
        'mizoram': 'lus',
        'arunachal pradesh': 'en',
        'sikkim': 'ne',
        
        // Union territories
        'punjab': 'pa',
        'chandigarh': 'hi',
        'jammu and kashmir': 'ur',
        'ladakh': 'ur'
    };

    // Comprehensive language definitions
    languages = {
        'en': {
            code: 'en',
            name: 'English',
            nativeName: 'English',
            direction: 'ltr',
            flag: '🇬🇧',
            region: 'Global'
        },
        'hi': {
            code: 'hi',
            name: 'Hindi',
            nativeName: 'हिंदी',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'North India'
        },
        'ta': {
            code: 'ta',
            name: 'Tamil',
            nativeName: 'தமிழ்',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Tamil Nadu'
        },
        'te': {
            code: 'te',
            name: 'Telugu',
            nativeName: 'తెలుగు',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Andhra Pradesh, Telangana'
        },
        'kn': {
            code: 'kn',
            name: 'Kannada',
            nativeName: 'ಕನ್ನಡ',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Karnataka'
        },
        'ml': {
            code: 'ml',
            name: 'Malayalam',
            nativeName: 'മലയാളം',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Kerala'
        },
        'mr': {
            code: 'mr',
            name: 'Marathi',
            nativeName: 'मराठी',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Maharashtra'
        },
        'gu': {
            code: 'gu',
            name: 'Gujarati',
            nativeName: 'ગુજરાતી',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Gujarat'
        },
        'bn': {
            code: 'bn',
            name: 'Bengali',
            nativeName: 'বাংলা',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'West Bengal'
        },
        'pa': {
            code: 'pa',
            name: 'Punjabi',
            nativeName: 'ਪੰਜਾਬੀ',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Punjab'
        },
        'or': {
            code: 'or',
            name: 'Odia',
            nativeName: 'ଓଡ଼ିଆ',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Odisha'
        },
        'as': {
            code: 'as',
            name: 'Assamese',
            nativeName: 'অসমীয়া',
            direction: 'ltr',
            flag: '🇮🇳',
            region: 'Assam'
        },
        'ur': {
            code: 'ur',
            name: 'Urdu',
            nativeName: 'اردو',
            direction: 'rtl',
            flag: '🇮🇳',
            region: 'Kashmir, Delhi'
        }
    };

    // Translation strings for farmer dashboard
    translations = {
        'en': {
            // Navigation
            'dashboard': 'Farmer Dashboard',
            'dashboard_subtitle': 'Track your herbs from farm to market',
            'earnings': 'Monthly Earnings',
            'submissions': 'Herb Submissions',
            'traceability': 'Herb Traceability',
            'losses': 'Loss Tracking',
            'market': 'Market Analytics',
            'crops': 'Crop Management',
            'export_data': 'Export Data',
            'monthly_earnings_dashboard': 'Monthly Earnings Dashboard',
            'track_revenue_profits': 'Track your herb farming revenue and profits',
            'this_month_revenue': 'This Month Revenue',
            'net_profit': 'Net Profit',
            'pending_payments': 'Pending Payments',
            'avg_rate': 'Avg. Rate',
            'revenue_profit_trends': 'Revenue & Profit Trends',
            'monthly_performance': 'Monthly performance over the year',
            'earnings_by_herb': 'Earnings by Herb Type',
            'total_submitted': 'Total Submitted',
            'this_month': 'This Month',
            'pending_approval': 'Pending Approval',
            'batches': 'Batches',
            'approved': 'Approved',
            'rejected': 'Rejected',
            
            // Language selector
            'language_detected': 'We detected you might prefer',
            'language_suggestion': 'Based on your location, we suggest',
            'change_language': 'Change Language',
            'keep_current': 'Keep Current',
            'language_preferences': 'Language Preferences',
            
            // Crop names
            'ashwagandha': 'Ashwagandha',
            'turmeric': 'Turmeric',
            'brahmi': 'Brahmi',
            'neem': 'Neem',
            'tulsi': 'Holy Basil',
            
            // Common actions
            'add_crop': 'Add Crop',
            'submit': 'Submit',
            'cancel': 'Cancel',
            'view_all': 'View All',
            'filter': 'Filter',
            'search': 'Search',
            'export': 'Export',
            'refresh': 'Refresh',
            'save': 'Save',
            'edit': 'Edit',
            'delete': 'Delete',
            'view': 'View',
            'upload': 'Upload',
            
            // User menu
            'my_profile': 'My Profile',
            'settings': 'Settings',
            'help_support': 'Help & Support',
            'logout': 'Logout',
            'demo_farmer': 'Demo Farmer',
            'rajesh_kumar': 'Rajesh Kumar',
            
            // Sidebar navigation
            'ayurtrace': 'AyurTrace',
            
            // Herb submissions section
            'herb_submissions_dashboard': 'Herb Submissions Dashboard',
            'manage_track_submissions': 'Manage and track your herb submissions',
            'recent_submissions': 'Recent Submissions',
            'submission_status': 'Submission Status',
            'batch_id': 'Batch ID',
            'herb_type': 'Herb Type',
            'quantity_kg': 'Quantity (kg)',
            'quality_grade': 'Quality Grade',
            'submission_date': 'Submission Date',
            'status': 'Status',
            'actions': 'Actions',
            'view_details': 'View Details',
            'download_certificate': 'Download Certificate',
            'save': 'Save',
            'edit': 'Edit',
            'delete': 'Delete',
            'view': 'View',
            'upload': 'Upload',
            
            // Form labels
            'crop_type': 'Crop Type',
            'quantity': 'Quantity (kg)',
            'quality_grade': 'Quality Grade',
            'harvest_date': 'Harvest Date',
            'location': 'Location',
            'notes': 'Notes',
            'collection_event_recording': 'Collection Event Recording',
            'gps_latitude': 'GPS Latitude',
            'gps_longitude': 'GPS Longitude',
            'get_current_location': 'Get Current Location',
            'collection_date_time': 'Collection Date & Time',
            'collector_id': 'Collector ID',
            'approved_zone': 'Approved Zone',
            'select_zone': 'Select Zone'
        },
        'hi': {
            // Navigation
            'dashboard': 'किसान डैशबोर्ड',
            'dashboard_subtitle': 'अपनी जड़ी-बूटियों को खेत से बाजार तक ट्रैक करें',
            'earnings': 'मासिक आय',
            'submissions': 'जड़ी-बूटी जमा',
            'traceability': 'जड़ी-बूटी ट्रेसेबिलिटी',
            'losses': 'नुकसान ट्रैकिंग',
            'market': 'बाजार विश्लेषण',
            'crops': 'फसल प्रबंधन',
            'export_data': 'डेटा निर्यात',
            'monthly_earnings_dashboard': 'मासिक आय डैशबोर्ड',
            'track_revenue_profits': 'अपनी जड़ी-बूटी खेती की आय और मुनाफे को ट्रैक करें',
            'this_month_revenue': 'इस महीने की आय',
            'net_profit': 'शुद्ध लाभ',
            'pending_payments': 'लंबित भुगतान',
            'avg_rate': 'औसत दर',
            'revenue_profit_trends': 'आय और लाभ के रुझान',
            'monthly_performance': 'साल भर की मासिक प्रदर्शन',
            'earnings_by_herb': 'जड़ी-बूटी के प्रकार के अनुसार आय',
            'total_submitted': 'कुल जमा',
            'this_month': 'इस महीने',
            'pending_approval': 'अनुमोदन लंबित',
            'batches': 'बैच',
            'approved': 'अनुमोदित',
            'rejected': 'अस्वीकृत',
            
            // Language selector
            'language_detected': 'हमने पाया कि आप पसंद कर सकते हैं',
            'language_suggestion': 'आपके स्थान के आधार पर, हम सुझाते हैं',
            'change_language': 'भाषा बदलें',
            'keep_current': 'वर्तमान रखें',
            'language_preferences': 'भाषा प्राथमिकताएं',
            
            // Crop names
            'ashwagandha': 'अश्वगंधा',
            'turmeric': 'हल्दी',
            'brahmi': 'ब्राह्मी',
            'neem': 'नीम',
            'tulsi': 'तुलसी',
            
            // Common actions
            'add_crop': 'फसल जोड़ें',
            'submit': 'जमा करें',
            'cancel': 'रद्द करें',
            'view_all': 'सभी देखें',
            'filter': 'फिल्टर',
            'search': 'खोजें',
            'export': 'निर्यात',
            'refresh': 'रीफ्रेश',
            'save': 'सहेजें',
            'edit': 'संपादित करें',
            'delete': 'हटाएं',
            'view': 'देखें',
            'upload': 'अपलोड करें',
            
            // User menu
            'my_profile': 'मेरी प्रोफ़ाइल',
            'settings': 'सेटिंग्स',
            'help_support': 'सहायता और समर्थन',
            'logout': 'लॉगआउट',
            'demo_farmer': 'डेमो किसान',
            'rajesh_kumar': 'राजेश कुमार',
            
            // Sidebar navigation
            'ayurtrace': 'आयुर्ट्रेस',
            
            // Herb submissions section
            'herb_submissions_dashboard': 'जड़ी-बूटी जमा डैशबोर्ड',
            'manage_track_submissions': 'अपनी जड़ी-बूटी जमा का प्रबंधन और ट्रैकिंग करें',
            'recent_submissions': 'हाल की जमा',
            'submission_status': 'जमा स्थिति',
            'batch_id': 'बैच आईडी',
            'herb_type': 'जड़ी-बूटी का प्रकार',
            'quantity_kg': 'मात्रा (किग्रा)',
            'quality_grade': 'गुणवत्ता ग्रेड',
            'submission_date': 'जमा तारीख',
            'status': 'स्थिति',
            'actions': 'कार्य',
            'view_details': 'विवरण देखें',
            'download_certificate': 'प्रमाणपत्र डाउनलोड करें',
            'save': 'सहेजें',
            'edit': 'संपादित करें',
            'delete': 'हटाएं',
            'view': 'देखें',
            'upload': 'अपलोड करें',
            
            // Form labels
            'crop_type': 'फसल का प्रकार',
            'quantity': 'मात्रा (किलो)',
            'quality_grade': 'गुणवत्ता ग्रेड',
            'harvest_date': 'फसल की तारीख',
            'location': 'स्थान',
            'notes': 'टिप्पणियां',
            'collection_event_recording': 'संग्रह घटना रिकॉर्डिंग',
            'gps_latitude': 'जीपीएस अक्षांश',
            'gps_longitude': 'जीपीएस देशांतर',
            'get_current_location': 'वर्तमान स्थान प्राप्त करें',
            'collection_date_time': 'संग्रह दिनांक और समय',
            'collector_id': 'संग्रहकर्ता आईडी',
            'approved_zone': 'अनुमोदित क्षेत्र',
            'select_zone': 'क्षेत्र चुनें'
        },
        'ta': {
            // Navigation
            'dashboard': 'விவசாயி டாஷ்போர்டு',
            'earnings': 'மாதாந்திர வருமானம்',
            'submissions': 'மூலிகை சமர்ப்பணம்',
            'traceability': 'மூலிகை கண்டறிதல்',
            'losses': 'இழப்பு கண்காணிப்பு',
            'market': 'சந்தை பகுப்பாய்வு',
            'crops': 'பயிர் மேலாண்மை',
            'export_data': 'தரவு ஏற்றுமதி',
            
            // Language selector
            'language_detected': 'நீங்கள் விரும்பலாம் என்று நாங்கள் கண்டறிந்தோம்',
            'language_suggestion': 'உங்கள் இருப்பிடத்தின் அடிப்படையில், நாங்கள் பரிந்துரைக்கிறோம்',
            'change_language': 'மொழியை மாற்று',
            'keep_current': 'தற்போதையதை வைத்துக்கொள்',
            'language_preferences': 'மொழி விருப்பத்தேர்வுகள்',
            
            // Crop names
            'ashwagandha': 'அஸ்வகந்தா',
            'turmeric': 'மஞ்சள்',
            'brahmi': 'பிரம்மி',
            'neem': 'வேம்பு',
            'tulsi': 'துளசி',
            
            // Common actions
            'add_crop': 'பயிர் சேர்க்க',
            'submit': 'சமர்ப்பிக்க',
            'cancel': 'ரத்து செய்',
            'save': 'சேமி',
            'edit': 'திருத்து',
            'delete': 'நீக்கு',
            'view': 'பார்',
            'upload': 'பதிவேற்று',
            
            // Form labels
            'crop_type': 'பயிர் வகை',
            'quantity': 'அளவு (கிலோ)',
            'quality_grade': 'தர நிலை',
            'harvest_date': 'அறுவடை தேதி',
            'location': 'இடம்',
            'notes': 'குறிப்புகள்'
        },
        'te': {
            // Navigation
            'dashboard': 'రైతు డాష్‌బోర్డ్',
            'dashboard_subtitle': 'మీ మూలికలను పొలం నుండి మార్కెట్ వరకు ట్రాక్ చేయండి',
            'earnings': 'నెలవారీ ఆదాయాలు',
            'submissions': 'మూలిక సమర్పణలు',
            'traceability': 'మూలిక ట్రేసబిలిటీ',
            'losses': 'నష్టం ట్రాకింగ్',
            'market': 'మార్కెట్ అనలిటిక్స్',
            'crops': 'పంట నిర్వహణ',
            'export_data': 'డేటా ఎక్స్‌పోర్ట్',
            'add_crop': 'పంట జోడించు',
            'ashwagandha': 'అశ్వగంధ',
            'turmeric': 'పసుపు',
            'brahmi': 'బ్రాహ్మి',
            'neem': 'వేప',
            'tulsi': 'తులసి'
        },
        'kn': {
            // Navigation
            'dashboard': 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
            'dashboard_subtitle': 'ನಿಮ್ಮ ಗಿಡಮೂಲಿಕೆಗಳನ್ನು ಫಾರ್ಮ್‌ನಿಂದ ಮಾರುಕಟ್ಟೆಗೆ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
            'earnings': 'ಮಾಸಿಕ ಆದಾಯ',
            'submissions': 'ಗಿಡಮೂಲಿಕೆ ಸಲ್ಲಿಕೆಗಳು',
            'traceability': 'ಗಿಡಮೂಲಿಕೆ ಟ್ರೇಸಬಿಲಿಟಿ',
            'losses': 'ನಷ್ಟ ಟ್ರ್ಯಾಕಿಂಗ್',
            'market': 'ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ',
            'crops': 'ಬೆಳೆ ನಿರ್ವಹಣೆ',
            'export_data': 'ಡೇಟಾ ರಫ್ತು',
            'add_crop': 'ಬೆಳೆ ಸೇರಿಸಿ',
            'ashwagandha': 'ಅಶ್ವಗಂಧ',
            'turmeric': 'ಅರಿಶಿನ',
            'brahmi': 'ಬ್ರಾಹ್ಮಿ',
            'neem': 'ಬೇವು',
            'tulsi': 'ತುಳಸಿ'
        },
        'ml': {
            // Navigation
            'dashboard': 'കർഷക ഡാഷ്‌ബോർഡ്',
            'dashboard_subtitle': 'നിങ്ങളുടെ ഔഷധസസ്യങ്ങൾ ഫാമിൽ നിന്ന് മാർക്കറ്റിലേക്ക് ട്രാക്ക് ചെയ്യുക',
            'earnings': 'മാസിക വരുമാനം',
            'submissions': 'ഔഷധസസ്യ സമർപ്പണങ്ങൾ',
            'traceability': 'ഔഷധസസ്യ ട്രേസബിലിറ്റി',
            'losses': 'നഷ്ട ട്രാക്കിംഗ്',
            'market': 'മാർക്കറ്റ് അനലിറ്റിക്സ്',
            'crops': 'വിള മാനേജ്മെന്റ്',
            'export_data': 'ഡാറ്റ എക്സ്പോർട്ട്',
            'add_crop': 'വിള ചേർക്കുക',
            'ashwagandha': 'അശ്വഗന്ധ',
            'turmeric': 'മഞ്ഞൾ',
            'brahmi': 'ബ്രാഹ്മി',
            'neem': 'വേപ്പ്',
            'tulsi': 'തുളസി'
        },
        'mr': {
            // Navigation
            'dashboard': 'शेतकरी डॅशबोर्ड',
            'dashboard_subtitle': 'तुमच्या औषधी वनस्पती शेतापासून बाजारपर्यंत ट्रॅक करा',
            'earnings': 'मासिक कमाई',
            'submissions': 'औषधी वनस्पती सबमिशन',
            'traceability': 'औषधी वनस्पती ट्रेसेबिलिटी',
            'losses': 'नुकसान ट्रॅकिंग',
            'market': 'मार्केट अॅनालिटिक्स',
            'crops': 'पीक व्यवस्थापन',
            'export_data': 'डेटा एक्सपोर्ट',
            'add_crop': 'पीक जोडा',
            'ashwagandha': 'अश्वगंधा',
            'turmeric': 'हळद',
            'brahmi': 'ब्राह्मी',
            'neem': 'कडुनिंब',
            'tulsi': 'तुळस'
        },
        'gu': {
            // Navigation
            'dashboard': 'ખેડૂત ડેશબોર્ડ',
            'dashboard_subtitle': 'તમારી જડીબુટ્ટીઓને ખેતરથી બજાર સુધી ટ્રેક કરો',
            'earnings': 'માસિક કમાણી',
            'submissions': 'જડીબુટ્ટી સબમિશન',
            'traceability': 'જડીબુટ્ટી ટ્રેસેબિલિટી',
            'losses': 'નુકસાન ટ્રેકિંગ',
            'market': 'માર્કેટ એનાલિટિક્સ',
            'crops': 'પાક વ્યવસ્થાપન',
            'export_data': 'ડેટા એક્સપોર્ટ',
            'add_crop': 'પાક ઉમેરો',
            'ashwagandha': 'અશ્વગંધા',
            'turmeric': 'હળદર',
            'brahmi': 'બ્રાહ્મી',
            'neem': 'લીમડો',
            'tulsi': 'તુલસી'
        },
        'bn': {
            // Navigation
            'dashboard': 'কৃষক ড্যাশবোর্ড',
            'dashboard_subtitle': 'আপনার ভেষজ খামার থেকে বাজার পর্যন্ত ট্র্যাক করুন',
            'earnings': 'মাসিক আয়',
            'submissions': 'ভেষজ জমা',
            'traceability': 'ভেষজ ট্রেসেবিলিটি',
            'losses': 'ক্ষতি ট্র্যাকিং',
            'market': 'বাজার বিশ্লেষণ',
            'crops': 'ফসল ব্যবস্থাপনা',
            'export_data': 'ডেটা রপ্তানি',
            'add_crop': 'ফসল যোগ করুন',
            'ashwagandha': 'অশ্বগন্ধা',
            'turmeric': 'হলুদ',
            'brahmi': 'ব্রাহ্মী',
            'neem': 'নিম',
            'tulsi': 'তুলসী'
        },
        'or': {
            // Navigation - Odia
            'dashboard': 'କୃଷକ ଡ୍ୟାସବୋର୍ଡ',
            'dashboard_subtitle': 'ଆପଣଙ୍କ ଔଷଧୀୟ ଗଛକୁ ଖେତରୁ ବଜାର ପର୍ଯ୍ୟନ୍ତ ଟ୍ରାକ କରନ୍ତୁ',
            'earnings': 'ମାସିକ ଆୟ',
            'submissions': 'ଔଷଧୀୟ ଗଛ ଦାଖଲ',
            'traceability': 'ଔଷଧୀୟ ଗଛ ଟ୍ରେସେବିଲିଟି',
            'losses': 'କ୍ଷତି ଟ୍ରାକିଂ',
            'market': 'ବଜାର ବିଶ୍ଳେଷଣ',
            'crops': 'ଫସଲ ପରିଚାଳନା',
            'export_data': 'ତଥ୍ୟ ରପ୍ତାନି',
            'add_crop': 'ଫସଲ ଯୋଗ କରନ୍ତୁ',
            'monthly_earnings_dashboard': 'ମାସିକ ଆୟ ଡ୍ୟାସବୋର୍ଡ',
            'track_revenue_profits': 'ଆପଣଙ୍କ ଔଷଧୀୟ ଚାଷର ଆୟ ଏବଂ ଲାଭ ଟ୍ରାକ କରନ୍ତୁ',
            'this_month_revenue': 'ଏହି ମାସର ଆୟ',
            'net_profit': 'ନିଟ ଲାଭ',
            'pending_payments': 'ବିଚାରାଧୀନ ଦେୟ',
            'avg_rate': 'ହାରାହାରି ଦର',
            'my_profile': 'ମୋର ପ୍ରୋଫାଇଲ',
            'settings': 'ସେଟିଂସ',
            'help_support': 'ସହାୟତା ଏବଂ ସମର୍ଥନ',
            'logout': 'ଲଗଆଉଟ',
            'demo_farmer': 'ଡେମୋ କୃଷକ',
            'rajesh_kumar': 'ରାଜେଶ କୁମାର',
            'ayurtrace': 'ଆୟୁର୍ଟ୍ରେସ',
            'ashwagandha': 'ଅଶ୍ୱଗନ୍ଧା',
            'turmeric': 'ହଳଦୀ',
            'brahmi': 'ବ୍ରାହ୍ମୀ',
            'neem': 'ନିମ୍ବ',
            'tulsi': 'ତୁଳସୀ'
        },
        'pa': {
            // Navigation - Punjabi
            'dashboard': 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ',
            'dashboard_subtitle': 'ਆਪਣੀਆਂ ਜੜੀ-ਬੂਟੀਆਂ ਨੂੰ ਖੇਤ ਤੋਂ ਮਾਰਕੀਟ ਤੱਕ ਟਰੈਕ ਕਰੋ',
            'earnings': 'ਮਹੀਨਾਵਾਰ ਕਮਾਈ',
            'submissions': 'ਜੜੀ-ਬੂਟੀ ਸਬਮਿਸ਼ਨ',
            'traceability': 'ਜੜੀ-ਬੂਟੀ ਟਰੇਸੇਬਿਲਿਟੀ',
            'losses': 'ਨੁਕਸਾਨ ਟਰੈਕਿੰਗ',
            'market': 'ਮਾਰਕੀਟ ਐਨਾਲਿਟਿਕਸ',
            'crops': 'ਫਸਲ ਪ੍ਰਬੰਧਨ',
            'export_data': 'ਡੇਟਾ ਐਕਸਪੋਰਟ',
            'add_crop': 'ਫਸਲ ਸ਼ਾਮਲ ਕਰੋ',
            'monthly_earnings_dashboard': 'ਮਹੀਨਾਵਾਰ ਕਮਾਈ ਡੈਸ਼ਬੋਰਡ',
            'track_revenue_profits': 'ਆਪਣੀ ਜੜੀ-ਬੂਟੀ ਦੀ ਖੇਤੀ ਦੀ ਆਮਦਨ ਅਤੇ ਮੁਨਾਫੇ ਨੂੰ ਟਰੈਕ ਕਰੋ',
            'this_month_revenue': 'ਇਸ ਮਹੀਨੇ ਦੀ ਆਮਦਨ',
            'net_profit': 'ਸ਼ੁੱਧ ਲਾਭ',
            'pending_payments': 'ਬਕਾਇਆ ਭੁਗਤਾਨ',
            'avg_rate': 'ਔਸਤ ਦਰ',
            'my_profile': 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ',
            'settings': 'ਸੈਟਿੰਗਜ਼',
            'help_support': 'ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ',
            'logout': 'ਲਾਗਆਉਟ',
            'demo_farmer': 'ਡੈਮੋ ਕਿਸਾਨ',
            'rajesh_kumar': 'ਰਾਜੇਸ਼ ਕੁਮਾਰ',
            'ayurtrace': 'ਆਯੁਰਟਰੇਸ',
            'ashwagandha': 'ਅਸ਼ਵਗੰਧਾ',
            'turmeric': 'ਹਲਦੀ',
            'brahmi': 'ਬ੍ਰਾਹਮੀ',
            'neem': 'ਨਿੰਮ',
            'tulsi': 'ਤੁਲਸੀ'
        },
        'as': {
            // Navigation - Assamese
            'dashboard': 'কৃষক ডেছবৰ্ড',
            'dashboard_subtitle': 'আপোনাৰ ঔষধি গছ-গছনি খেতিৰ পৰা বজাৰলৈ ট্ৰেক কৰক',
            'earnings': 'মাহিলী আয়',
            'submissions': 'ঔষধি গছ-গছনি দাখিল',
            'traceability': 'ঔষধি গছ-গছনি ট্ৰেচেবিলিটি',
            'losses': 'ক্ষতি ট্ৰেকিং',
            'market': 'বজাৰ বিশ্লেষণ',
            'crops': 'শস্য ব্যৱস্থাপনা',
            'export_data': 'তথ্য ৰপ্তানি',
            'add_crop': 'শস্য যোগ কৰক',
            'monthly_earnings_dashboard': 'মাহিলী আয় ডেছবৰ্ড',
            'track_revenue_profits': 'আপোনাৰ ঔষধি খেতিৰ আয় আৰু লাভ ট্ৰেক কৰক',
            'this_month_revenue': 'এই মাহৰ আয়',
            'net_profit': 'নিট লাভ',
            'pending_payments': 'বিচাৰাধীন পেমেণ্ট',
            'avg_rate': 'গড় হাৰ',
            'my_profile': 'মোৰ প্ৰোফাইল',
            'settings': 'ছেটিংছ',
            'help_support': 'সহায় আৰু সমৰ্থন',
            'logout': 'লগআউট',
            'demo_farmer': 'ডেমো কৃষক',
            'rajesh_kumar': 'ৰাজেশ কুমাৰ',
            'ayurtrace': 'আয়ুৰট্ৰেচ',
            'ashwagandha': 'অশ্বগন্ধা',
            'turmeric': 'হালধি',
            'brahmi': 'ব্ৰাহ্মী',
            'neem': 'নিম',
            'tulsi': 'তুলসী'
        },
        'ur': {
            // Navigation - Urdu (RTL)
            'dashboard': 'کسان ڈیش بورڈ',
            'dashboard_subtitle': 'اپنی جڑی بوٹیوں کو کھیت سے بازار تک ٹریک کریں',
            'earnings': 'ماہانہ آمدنی',
            'submissions': 'جڑی بوٹی جمع کرانا',
            'traceability': 'جڑی بوٹی ٹریسیبلٹی',
            'losses': 'نقصان کی ٹریکنگ',
            'market': 'مارکیٹ تجزیات',
            'crops': 'فصل کا انتظام',
            'export_data': 'ڈیٹا ایکسپورٹ',
            'add_crop': 'فصل شامل کریں',
            'monthly_earnings_dashboard': 'ماہانہ آمدنی ڈیش بورڈ',
            'track_revenue_profits': 'اپنی جڑی بوٹیوں کی کھیتی کی آمدنی اور منافع کو ٹریک کریں',
            'this_month_revenue': 'اس مہینے کی آمدنی',
            'net_profit': 'خالص منافع',
            'pending_payments': 'زیر التواء ادائیگیاں',
            'avg_rate': 'اوسط ریٹ',
            'my_profile': 'میری پروفائل',
            'settings': 'سیٹنگز',
            'help_support': 'مدد اور سپورٹ',
            'logout': 'لاگ آؤٹ',
            'demo_farmer': 'ڈیمو کسان',
            'rajesh_kumar': 'راجیش کمار',
            'ayurtrace': 'آیور ٹریس',
            'ashwagandha': 'اشوگندھا',
            'turmeric': 'ہلدی',
            'brahmi': 'برہمی',
            'neem': 'نیم',
            'tulsi': 'تلسی'
        }
    };

    async init() {
        // Load saved preferences
        this.loadSavedPreferences();
        
        // Initialize UI components first
        this.initializeLanguageSelector();
        
        // Detect location and auto-apply language
        await this.detectLocationAndSuggestLanguage();
        
        // Apply current language (will be detected language if no preference)
        await this.applyLanguage(this.currentLanguage);
        
        // Update crop names after language is applied
        this.updateCropNames();
    }

    loadSavedPreferences() {
        const saved = localStorage.getItem('farmerLanguagePreference');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.userPreference = prefs.language;
            this.currentLanguage = prefs.language;
        }
    }

    async detectLocationAndSuggestLanguage() {
        try {
            // Try to get user's location
            if (navigator.geolocation) {
                const position = await this.getCurrentPosition();
                await this.getLocationInfo(position.coords.latitude, position.coords.longitude);
            }
        } catch (error) {
            console.log('Location detection failed, using default language');
            // Fallback to browser language detection
            this.detectBrowserLanguage();
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: false
            });
        });
    }

    async getLocationInfo(lat, lng) {
        try {
            // Using a free geocoding service to get location details
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();
            
            this.locationData = data;
            
            // Extract state/region and suggest language
            const state = data.principalSubdivision?.toLowerCase() || '';
            const country = data.countryName?.toLowerCase() || '';
            
            if (country === 'india' && this.stateLanguageMap[state]) {
                this.detectedLanguage = this.stateLanguageMap[state];
                
                // Automatically apply detected language if no user preference exists
                if (!this.userPreference) {
                    console.log(`Auto-applying detected language: ${this.detectedLanguage}`);
                    this.setLanguage(this.detectedLanguage);
                    this.showLanguageNotification();
                } else {
                    this.showLanguageSuggestion();
                }
            }
        } catch (error) {
            console.log('Geocoding failed:', error);
            this.detectBrowserLanguage();
        }
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language.split('-')[0];
        if (this.languages[browserLang]) {
            this.detectedLanguage = browserLang;
            if (!this.userPreference) {
                console.log(`Auto-applying browser language: ${this.detectedLanguage}`);
                this.setLanguage(this.detectedLanguage);
                this.showLanguageNotification();
            }
        }
    }

    showLanguageNotification() {
        const langName = this.languages[this.detectedLanguage]?.nativeName || this.detectedLanguage;
        this.showNotification(`Language automatically set to ${langName}`, 'success');
    }

    showLanguageSuggestion() {
        if (!this.detectedLanguage || this.detectedLanguage === this.currentLanguage) return;

        const suggestion = this.createLanguageSuggestionModal();
        document.body.appendChild(suggestion);
        
        // Auto-show the modal
        setTimeout(() => {
            suggestion.classList.add('show');
        }, 1000);
    }

    createLanguageSuggestionModal() {
        const modal = document.createElement('div');
        modal.className = 'language-suggestion-modal';
        modal.innerHTML = `
            <div class="language-suggestion-overlay">
                <div class="language-suggestion-content">
                    <div class="suggestion-header">
                        <div class="suggestion-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h3>${this.translate('language_suggestion')}</h3>
                    </div>
                    
                    <div class="language-options">
                        <div class="suggested-language">
                            <div class="language-card suggested">
                                <div class="language-flag">${this.languages[this.detectedLanguage].flag}</div>
                                <div class="language-info">
                                    <h4>${this.languages[this.detectedLanguage].nativeName}</h4>
                                    <p>${this.languages[this.detectedLanguage].name}</p>
                                    <small>${this.languages[this.detectedLanguage].region}</small>
                                </div>
                                <button class="btn btn-primary" onclick="languageManager.acceptSuggestion('${this.detectedLanguage}')">
                                    <i class="fas fa-check"></i>
                                    ${this.translate('change_language')}
                                </button>
                            </div>
                        </div>
                        
                        <div class="current-language">
                            <div class="language-card current">
                                <div class="language-flag">${this.languages[this.currentLanguage].flag}</div>
                                <div class="language-info">
                                    <h4>${this.languages[this.currentLanguage].nativeName}</h4>
                                    <p>${this.languages[this.currentLanguage].name}</p>
                                </div>
                                <button class="btn btn-outline" onclick="languageManager.dismissSuggestion()">
                                    <i class="fas fa-times"></i>
                                    ${this.translate('keep_current')}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="suggestion-footer">
                        <p><i class="fas fa-info-circle"></i> You can change language anytime from settings</p>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    acceptSuggestion(languageCode) {
        this.setLanguage(languageCode);
        this.dismissSuggestion();
        this.showNotification(`Language changed to ${this.languages[languageCode].nativeName}`, 'success');
    }

    dismissSuggestion() {
        const modal = document.querySelector('.language-suggestion-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    initializeLanguageSelector() {
        // Add language selector to header
        this.addLanguageSelectorToHeader();
        
        // Add language settings to user dropdown
        this.addLanguageToUserDropdown();
    }

    addLanguageSelectorToHeader() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;

        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector-header';
        languageSelector.setAttribute('data-no-translate', 'true');
        languageSelector.innerHTML = `
            <button class="btn btn-outline language-btn" onclick="languageManager.toggleLanguageDropdown()">
                <span class="current-lang-flag">${this.languages[this.currentLanguage].flag}</span>
                <span class="current-lang-code">${this.currentLanguage.toUpperCase()}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="language-dropdown" id="languageDropdown" data-no-translate="true">
                <div class="language-dropdown-header">
                    <h4><i class="fas fa-globe"></i> ${this.translate('language_preferences')}</h4>
                </div>
                <div class="language-list" data-no-translate="true">
                    ${Object.values(this.languages).map(lang => `
                        <div class="language-option ${lang.code === this.currentLanguage ? 'active' : ''}" 
                             onclick="languageManager.setLanguage('${lang.code}')" data-no-translate="true">
                            <div class="lang-flag">${lang.flag}</div>
                            <div class="lang-info" data-no-translate="true">
                                <span class="lang-native" data-no-translate="true">${lang.nativeName}</span>
                                <small class="lang-english" data-no-translate="true">${lang.name}</small>
                            </div>
                            ${lang.code === this.currentLanguage ? '<i class="fas fa-check"></i>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        headerActions.insertBefore(languageSelector, headerActions.firstChild);
    }

    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        dropdown.classList.toggle('show');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.language-selector-header')) {
                dropdown.classList.remove('show');
            }
        }, { once: true });
    }

    setLanguage(languageCode) {
        if (!this.languages[languageCode]) return;

        this.currentLanguage = languageCode;
        this.userPreference = languageCode;
        
        // Save preference
        localStorage.setItem('farmerLanguagePreference', JSON.stringify({
            language: languageCode,
            timestamp: Date.now()
        }));
        
        // Apply language changes
        this.applyLanguage(languageCode);
        
        // Update UI elements
        this.updateLanguageSelector();
        
        // Close dropdown
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }

    async applyLanguage(languageCode) {
        console.log(`Applying language: ${languageCode}`);
        
        // Update document direction for RTL languages
        document.dir = this.languages[languageCode].direction;
        
        // Update all translatable elements with data-translate attributes
        const translatableElements = document.querySelectorAll('[data-translate]');
        console.log(`Found ${translatableElements.length} translatable elements`);
        
        for (const element of translatableElements) {
            const key = element.getAttribute('data-translate');
            let translation = this.translate(key);
            
            console.log(`Translating key: ${key} -> ${translation}`);
            
            // If no local translation exists and not English, try API translation
            if ((!translation || translation === key) && languageCode !== 'en') {
                translation = await this.translateWithGoogle(key, languageCode);
                console.log(`API translation for ${key}: ${translation}`);
            }
            
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'search')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
        
        // Force re-translation of all elements to ensure complete coverage
        await this.forceCompleteTranslation(languageCode);
        
        // Update language-specific content
        this.updateCropNames();
        this.updateFormLabels();
        this.updateNavigationLabels();
        
        console.log(`Language application completed for: ${languageCode}`);
    }

    // Force complete translation of all text elements
    async forceCompleteTranslation(languageCode) {
        if (languageCode === 'en') return;

        // Get all text nodes and translate them
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip empty text nodes and nodes in no-translate areas
                    if (!node.textContent.trim() || 
                        node.parentElement.closest('[data-no-translate]') ||
                        node.parentElement.closest('.language-selector') ||
                        node.parentElement.closest('.language-dropdown')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Translate each text node
        for (const textNode of textNodes) {
            const text = textNode.textContent.trim();
            if (text && text.length > 1 && !text.match(/^[0-9₹%\-+.,\s]+$/)) {
                // Check if we have a local translation first
                let translation = this.translate(text);
                
                // If no local translation, try API
                if (translation === text && this.translations[languageCode]) {
                    translation = await this.translateWithGoogle(text, languageCode);
                }
                
                if (translation && translation !== text) {
                    textNode.textContent = translation;
                }
            }
        }
    }

    updateLanguageSelector() {
        const currentFlag = document.querySelector('.current-lang-flag');
        const currentCode = document.querySelector('.current-lang-code');
        
        if (currentFlag) currentFlag.textContent = this.languages[this.currentLanguage].flag;
        if (currentCode) currentCode.textContent = this.currentLanguage.toUpperCase();
        
        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.onclick.toString().includes(this.currentLanguage)) {
                option.classList.add('active');
            }
        });
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations['en']?.[key] || 
               key;
    }

    // Google Translate API integration
    async translateWithGoogle(text, targetLanguage) {
        if (!text || targetLanguage === 'en') return text;
        
        const cacheKey = `${text}_${targetLanguage}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            // Use a free translation service as fallback since Google Translate API requires billing
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.responseStatus === 200 && data.responseData) {
                    const translatedText = data.responseData.translatedText;
                    this.translationCache.set(cacheKey, translatedText);
                    return translatedText;
                }
            }
        } catch (error) {
            console.log('Translation API error:', error);
        }
        
        // Fallback to local translations if API fails
        const localTranslation = this.translate(text);
        return localTranslation !== text ? localTranslation : text;
    }

    // Translate all static content on the page
    async translateAllStaticContent(languageCode) {
        if (languageCode === 'en') return;

        // Translate page titles and headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
            if (!heading.hasAttribute('data-translate') && 
                !heading.closest('[data-no-translate]') &&
                !heading.closest('.language-selector') &&
                heading.textContent.trim()) {
                const translated = await this.translateWithGoogle(heading.textContent, languageCode);
                heading.textContent = translated;
            }
        }

        // Translate paragraphs and spans without data-translate
        const textElements = document.querySelectorAll('p, span, label, button');
        for (const element of textElements) {
            if (!element.hasAttribute('data-translate') && 
                !element.closest('[data-no-translate]') &&
                !element.closest('.language-selector') &&
                !element.closest('.language-dropdown') &&
                element.textContent.trim() &&
                !element.querySelector('i, img') && // Skip elements with icons/images
                element.textContent.length > 2) {
                
                const translated = await this.translateWithGoogle(element.textContent, languageCode);
                element.textContent = translated;
            }
        }

        // Translate table headers
        const tableHeaders = document.querySelectorAll('th');
        for (const th of tableHeaders) {
            if (!th.hasAttribute('data-translate') && 
                !th.closest('[data-no-translate]') &&
                th.textContent.trim()) {
                const translated = await this.translateWithGoogle(th.textContent, languageCode);
                th.textContent = translated;
            }
        }

        // Translate form placeholders
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        for (const input of inputs) {
            if (!input.hasAttribute('data-translate') && 
                !input.closest('[data-no-translate]') &&
                input.placeholder.trim()) {
                const translated = await this.translateWithGoogle(input.placeholder, languageCode);
                input.placeholder = translated;
            }
        }
    }

    updateCropNames() {
        // Update crop selection dropdowns
        document.querySelectorAll('select option[data-crop]').forEach(option => {
            const cropKey = option.getAttribute('data-crop');
            const translation = this.translate(cropKey);
            if (translation !== cropKey) {
                option.textContent = translation;
            }
        });
        
        // Update herb cards in visual selection
        document.querySelectorAll('.herb-card h5[data-crop]').forEach(element => {
            const cropKey = element.getAttribute('data-crop');
            if (cropKey) {
                const translation = this.translate(cropKey);
                if (translation !== cropKey) {
                    element.textContent = translation;
                }
            }
        });
        
        // Update crop cards
        document.querySelectorAll('.crop-card .crop-name').forEach(element => {
            const cropKey = element.getAttribute('data-crop');
            if (cropKey) {
                const translation = this.translate(cropKey);
                if (translation !== cropKey) {
                    element.textContent = translation;
                }
            }
        });
        
        // Update batch cards herb names
        document.querySelectorAll('.batch-details strong').forEach(element => {
            const herbName = element.textContent.toLowerCase();
            const translation = this.translate(herbName);
            if (translation !== herbName) {
                element.textContent = translation;
            }
        });
    }

    updateFormLabels() {
        // Update form labels with translation keys
        document.querySelectorAll('label[data-translate]').forEach(label => {
            const key = label.getAttribute('data-translate');
            const translation = this.translate(key);
            if (translation !== key) {
                label.textContent = translation;
            }
        });
        
        // Update input placeholders
        document.querySelectorAll('input[data-translate-placeholder]').forEach(input => {
            const key = input.getAttribute('data-translate-placeholder');
            const translation = this.translate(key);
            if (translation !== key) {
                input.placeholder = translation;
            }
        });
    }

    updateNavigationLabels() {
        // Update navigation items
        document.querySelectorAll('.nav-item span[data-translate]').forEach(span => {
            const key = span.getAttribute('data-translate');
            const translation = this.translate(key);
            if (translation !== key) {
                span.textContent = translation;
            }
        });
        
        // Update button labels
        document.querySelectorAll('button span[data-translate]').forEach(span => {
            const key = span.getAttribute('data-translate');
            const translation = this.translate(key);
            if (translation !== key) {
                span.textContent = translation;
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for global access
window.languageManager = languageManager;
