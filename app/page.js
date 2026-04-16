"use client";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import AuthModal from "./components/AuthModal";
import GoogleIcon from "./components/GoogleIcon";
import {
  getProfile,
  updateProfile,
  getArticles,
  saveArticle,
  useCredits as useCreditsDB,
  addCredits,
  addXp,
  sendContactMessage,
  signOut,
  getAllUsers,
  blockUser,
  makeAdmin,
  deleteAccount
} from "./lib/db";

// ═══════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════
var LANGS = [
  {v:"en",l:"English"},{v:"ar",l:"العربية"},{v:"fr",l:"Francais"},
  {v:"es",l:"Espanol"},{v:"de",l:"Deutsch"},{v:"it",l:"Italiano"},
  {v:"pt",l:"Portugues"},{v:"tr",l:"Turkce"},{v:"ru",l:"Russian"},
  {v:"ja",l:"Japanese"},{v:"zh",l:"Chinese"},{v:"hi",l:"Hindi"},
  {v:"nl",l:"Dutch"},{v:"pl",l:"Polski"},{v:"sv",l:"Svenska"},
  {v:"th",l:"Thai"},{v:"vi",l:"Vietnamese"},{v:"id",l:"Bahasa"},
  {v:"ko",l:"Korean"},{v:"he",l:"Hebrew"},{v:"el",l:"Greek"},
  {v:"cs",l:"Czech"},{v:"da",l:"Danish"},{v:"fi",l:"Finnish"},
  {v:"no",l:"Norsk"},{v:"ro",l:"Romanian"},{v:"uk",l:"Ukrainian"},
  {v:"ms",l:"Melayu"}
];
var TONES = ["Professional","Casual","Academic","Creative","Persuasive","Storytelling","Friendly","Authoritative"];
var MOODS = [
  {e:"H",n:"Happy",p:"upbeat and positive"},
  {e:"E",n:"Emotional",p:"touching and heartfelt"},
  {e:"P",n:"Passionate",p:"bold and assertive"},
  {e:"T",n:"Thoughtful",p:"reflective and deep"},
  {e:"C",n:"Confident",p:"cool and assured"},
  {e:"F",n:"Humorous",p:"funny and witty"}
];
var ERAS_VINTAGE = []; for(var y=1900;y<=1945;y+=5) ERAS_VINTAGE.push({y:String(y),p:y+"s vintage formal prose"});
var ERAS_MODERN = []; for(var y=1950;y<=2020;y+=5) ERAS_MODERN.push({y:String(y),p:y+"s modern style"});
var ERAS_FUTURE = []; for(var y=2025;y<=2050;y+=5) ERAS_FUTURE.push({y:String(y),p:"futuristic "+y+" style"});
var TMPLS = [
  {id:"blog",n:"Blog",p:"a blog article"},
  {id:"list",n:"Listicle",p:"a listicle"},
  {id:"how",n:"How-To",p:"a how-to guide"},
  {id:"comp",n:"Compare",p:"a comparison"},
  {id:"rev",n:"Review",p:"a review"},
  {id:"news",n:"News",p:"a news article"}
];
var COSTS = {generate:5,roast:2,viral:2,remix:3,debate:6,summary:1,titles:1,thread:2,linkedin:2,repurpose:5,battle:4};
var PACKS = [
  {credits:10,price:5,label:"Starter"},
  {credits:50,price:20,label:"Creator",save:"20%"},
  {credits:200,price:60,label:"Power",best:true,save:"40%"},
  {credits:500,price:120,label:"Agency",save:"52%"}
];
var PLANS = {
  free:{n:"Free",pr:0,cr:10,mW:800,lng:5,directory:false,f:["10 credits/month","800 words max","5 languages","Basic support"]},
  starter:{n:"Starter",pr:19,cr:100,mW:2000,lng:28,directory:false,f:["100 credits/month","2000 words max","28 languages","Email support","All AI tools"]},
  pro:{n:"Pro",pr:49,cr:500,mW:5000,lng:28,directory:true,pop:true,f:["500 credits/month","5000 words max","28 languages","Priority support","Writers Directory","PDF/Word export"]},
  agency:{n:"Agency",pr:99,cr:2000,mW:5000,lng:28,directory:true,f:["2000 credits/month","5000 words max","28 languages","Dedicated support","Writers Directory","White-label","Team seats"]}
};
var LEVELS = [
  {lv:1,n:"Beginner",xp:0,goal:"Write your first article",reward:"+5 credits"},
  {lv:2,n:"Writer",xp:100,goal:"Write 5 articles",reward:"+10 credits"},
  {lv:3,n:"Author",xp:300,goal:"3-day streak",reward:"New templates"},
  {lv:4,n:"Editor",xp:600,goal:"Write 10,000 words",reward:"+15 credits"},
  {lv:5,n:"Expert",xp:1000,goal:"Win 3 battles",reward:"Premium badge"},
  {lv:6,n:"Master",xp:2000,goal:"Write in 5 languages",reward:"+25 credits"},
  {lv:7,n:"Legend",xp:3500,goal:"30-day streak",reward:"Exclusive templates"},
  {lv:8,n:"Sage",xp:5500,goal:"Write 100 articles",reward:"+50 credits"},
  {lv:9,n:"Virtuoso",xp:8000,goal:"Write 50,000 words",reward:"Lifetime discount"},
  {lv:10,n:"Elite",xp:12000,goal:"Ultimate mastery",reward:"VIP status"}
];
var BADGES = [
  {id:"first",n:"First Article",ic:"1",req:1,t:"art"},
  {id:"ten",n:"10 Articles",ic:"10",req:10,t:"art"},
  {id:"fifty",n:"50 Club",ic:"50",req:50,t:"art"},
  {id:"hundred",n:"Centurion",ic:"100",req:100,t:"art"},
  {id:"s3",n:"3-Day Streak",ic:"3d",req:3,t:"str"},
  {id:"s7",n:"Week Warrior",ic:"7d",req:7,t:"str"},
  {id:"s30",n:"Monthly Master",ic:"30d",req:30,t:"str"},
  {id:"w1k",n:"1K Words",ic:"1K",req:1000,t:"wrd"},
  {id:"w10k",n:"10K Words",ic:"10K",req:10000,t:"wrd"},
  {id:"w50k",n:"50K Words",ic:"50K",req:50000,t:"wrd"}
];
var CONTACT_TYPES = [
  {id:"suggest",n:{en:"Suggestion",ar:"اقتراح"}},
  {id:"question",n:{en:"Question",ar:"سؤال"}},
  {id:"complaint",n:{en:"Complaint",ar:"شكوى"}},
  {id:"collab",n:{en:"Collaboration",ar:"تعاون"}},
  {id:"business",n:{en:"Business",ar:"تجاري"}},
  {id:"technical",n:{en:"Technical",ar:"تقني"}}
];
var DEMO_WRITERS = [
  {id:"w1",name:"Sarah Ahmed",specialty:"Tech & AI",bio:"10+ years technical writer, AI and SaaS specialist",contact:"sarah@demo.com"},
  {id:"w2",name:"Mohamed Ali",specialty:"Digital Marketing",bio:"Marketing content expert helping SaaS brands grow",contact:"mo@demo.com"},
  {id:"w3",name:"Layla Hassan",specialty:"Creative Writing",bio:"Award-winning novelist and storyteller",contact:"layla@demo.com"},
  {id:"w4",name:"Omar Nour",specialty:"Education",bio:"Educational content for online courses",contact:"omar@demo.com"}
];
var TESTIMONIALS = [
  {name:"Amira K.",role:"Content Creator",text:"Oxquill cut my writing time by 70%. The Roast tool alone is worth it!",rating:5},
  {name:"James W.",role:"SaaS Founder",text:"Article Battle helped me pick winning headlines that doubled my CTR.",rating:5},
  {name:"Fatima S.",role:"Marketing Manager",text:"28 languages and it nails Arabic grammar. Finally an AI that speaks my language.",rating:5}
];

// ═══════════════════════════════════════════════════════════════════
// I18N
// ═══════════════════════════════════════════════════════════════════
var I18N = {
  "brand": { en: "Oxquill", ar: "Oxquill" },
  "tagline": { en: "Your AI Writing Superpower", ar: "قوتك في الكتابة بالذكاء الاصطناعي" },
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.writer": { en: "AI Writer", ar: "كاتب AI" },
  "nav.services": { en: "Services", ar: "الخدمات" },
  "nav.battle": { en: "Battle", ar: "المعركة" },
  "nav.writers": { en: "Writers", ar: "الكتاب" },
  "nav.pricing": { en: "Pricing", ar: "الباقات" },
  "nav.credits": { en: "Credits", ar: "الكريديت" },
  "nav.profile": { en: "Profile", ar: "الملف الشخصي" },
  "nav.contact": { en: "Contact", ar: "تواصل" },
  "nav.terms": { en: "Terms", ar: "الشروط" },
  "nav.privacy": { en: "Privacy", ar: "الخصوصية" },
  "nav.admin": { en: "Admin", ar: "الإدارة" },
  "nav.login": { en: "Log In", ar: "دخول" },
  "nav.logout": { en: "Log Out", ar: "خروج" },
  "nav.signup": { en: "Sign Up", ar: "حساب جديد" },
  "common.back": { en: "Back", ar: "رجوع" },
  "common.save": { en: "Save", ar: "حفظ" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.delete": { en: "Delete", ar: "حذف" },
  "common.loading": { en: "Loading...", ar: "جاري التحميل..." },
  "common.upgrade": { en: "Upgrade", ar: "ترقية" },
  "common.popular": { en: "POPULAR", ar: "الأكثر طلباً" },
  "common.best": { en: "BEST VALUE", ar: "الأفضل" },
  "common.current": { en: "Current", ar: "\u0627\u0644\u062d\u0627\u0644\u064a\u0629" },
  "nav.roast": { en: "Roast", ar: "\u0627\u0644\u0646\u0642\u062f \u0627\u0644\u0643\u0648\u0645\u064a\u062f\u064a" },
  "hero.title.en": "Every Writer Deserves a ",
  "hero.word.en": "Superbrain",
  "hero.end.en": ". Now You Have One.",
  "hero.title.ar": "\u0643\u0644 \u0643\u0627\u062a\u0628 \u064a\u0633\u062a\u0627\u0647\u0644 ",
  "hero.word.ar": "\u0639\u0642\u0644 \u062e\u0627\u0631\u0642",
  "hero.end.ar": ". \u062f\u0647 \u0639\u0642\u0644\u0643.",
  "hero.desc": { en: "From first draft to published masterpiece \u2014 in minutes, not months. 28 languages. 31 eras. Your voice, amplified.", ar: "\u0645\u0646 \u0627\u0644\u0645\u0633\u0648\u062f\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0625\u0644\u0649 \u0627\u0644\u062a\u062d\u0641\u0629 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u2014 \u0641\u064a \u062f\u0642\u0627\u0626\u0642\u060c \u0645\u0634 \u0634\u0647\u0648\u0631. 28 \u0644\u063a\u0629. 31 \u062d\u0642\u0628\u0629. \u0635\u0648\u062a\u0643\u060c \u0628\u0623\u0636\u0639\u0627\u0641 \u0642\u0648\u062a\u0647." },
  "hero.supertools": { en: "Superpowered Tools for Superpowered Writers", ar: "\u0623\u062f\u0648\u0627\u062a \u062e\u0627\u0631\u0642\u0629 \u0644\u0643\u062a\u0651\u0627\u0628 \u062e\u0627\u0631\u0642\u064a\u0646" },
  "hero.testimonials": { en: "What Our Writers Say", ar: "\u0645\u0627\u0630\u0627 \u064a\u0642\u0648\u0644 \u0643\u062a\u0651\u0627\u0628\u0646\u0627" },
  "hero.ready": { en: "Ready to Write Content That Wows?", ar: "\u0645\u0633\u062a\u0639\u062f \u062a\u0643\u062a\u0628 \u0645\u062d\u062a\u0648\u0649 \u064a\u0628\u0647\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u061f" },
  "hero.freeCredits": { en: "10 free credits. No card needed.", ar: "10 \u0643\u0631\u064a\u062f\u062a\u0633 \u0645\u062c\u0627\u0646\u0627\u064b. \u0644\u0627 \u0628\u0637\u0627\u0642\u0629." },
  "hero.startNow": { en: "Get Started Now", ar: "\u0627\u0628\u062f\u0623 \u062f\u0644\u0648\u0642\u062a\u064a" },
  "profile.levels": { en: "Levels", ar: "\u0627\u0644\u0645\u0633\u062a\u0648\u064a\u0627\u062a" },
  "admin.messages": { en: "Messages", ar: "\u0627\u0644\u0631\u0633\u0627\u0626\u0644" },
  "admin.apiUsage": { en: "Claude API Usage", ar: "\u0627\u0633\u062a\u0647\u0644\u0627\u0643 Claude API" },
  "roast.title": { en: "The Article Roaster", ar: "\u0645\u062d\u0645\u0635\u0629 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a" },
  "roast.desc": { en: "Drop your article and face the brutal truth", ar: "\u0627\u0631\u0645\u064a \u0645\u0642\u0627\u0644\u0643 \u0648\u0634\u0648\u0641 \u0627\u0644\u062d\u0642\u064a\u0642\u0629" },
  "roast.btn": { en: "Roast My Article!", ar: "\u062d\u0645\u0651\u0635 \u0645\u0642\u0627\u0644\u064a!" },
  "roast.result": { en: "Roast Results", ar: "\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u062a\u062d\u0645\u064a\u0635" },
  "footer.company": { en: "Company", ar: "\u0627\u0644\u0634\u0631\u0643\u0629" },
  "footer.legal": { en: "Legal", ar: "\u0642\u0627\u0646\u0648\u0646\u064a" },
  "footer.billing": { en: "Billing", ar: "\u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631" }
};

// ═══════════════════════════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════════════════════════
var LIGHT = {bg:"#F7F8FC",cd:"#FFFFFF",b3:"#EEF0F7",tx:"#1A1F36",t2:"#4A5070",t3:"#8C92AB",pr:"#5B6CF0",p2:"#9B7BF0",pS:"rgba(91,108,240,.08)",bd:"#E4E8F1",nv:"rgba(247,248,252,.94)",ok:"#2D8A4E",er:"#D4453C",wr:"#EFA935"};
var DARK = {bg:"#0F1018",cd:"#1A1B26",b3:"#252630",tx:"#E8E6F0",t2:"#A0A0B8",t3:"#6A6A82",pr:"#7B8AF5",p2:"#B89FF5",pS:"rgba(123,138,245,.14)",bd:"#2A2B38",nv:"rgba(15,16,24,.92)",ok:"#3BBF85",er:"#EF7B6C",wr:"#EFA935"};

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════
function md2h(t){if(!t)return"";return t.replace(/^### (.*$)/gm,"<h3>$1</h3>").replace(/^## (.*$)/gm,"<h2>$1</h2>").replace(/^# (.*$)/gm,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^- (.*$)/gm,"<li>$1</li>").replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br/>")}
function exPDF(c,t){var w=window.open("");w.document.write("<html><head><title>"+t+"</title><style>body{font-family:Georgia;max-width:700px;margin:40px auto;padding:20px;line-height:1.8}h1{font-size:26px}h2{font-size:20px}@media print{body{margin:0}}</style></head><body>"+md2h(c)+"</body></html>");w.document.close();setTimeout(function(){w.print()},500)}
function exWord(c,t){var b=new Blob(["<html><head><meta charset='utf-8'></head><body>"+md2h(c)+"</body></html>"],{type:"application/msword"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=(t||"article").slice(0,30)+".doc";a.click()}
function exTXT(c,t){var b=new Blob([c],{type:"text/plain"});var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=(t||"article").slice(0,30)+".txt";a.click()}

async function callAI(prompt){
  try{
    var res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:prompt})});
    var data=await res.json();
    var text="";
    if(data.content){for(var i=0;i<data.content.length;i++)text+=data.content[i].text||""}
    return text||data.error||"Error generating content."
  }catch(e){return "Network error. Please try again."}
}

var astyle = ".ax h1{font-family:Source Serif 4,Georgia,serif;font-size:24px;font-weight:900;color:var(--tx);margin-bottom:10px}.ax h2{font-family:Source Serif 4,Georgia,serif;font-size:19px;font-weight:700;color:var(--tx);margin-top:24px;margin-bottom:10px}.ax h3{font-size:16px;font-weight:700;color:var(--tx);margin-top:16px;margin-bottom:6px}.ax p{margin-bottom:14px}.ax strong{color:var(--tx)}.ax ul,.ax ol{margin:12px 0;padding-inline-start:22px}.ax li{margin-bottom:6px}.ax em{color:var(--p2);font-style:italic}";

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function Oxquill() {
  // Auth & Profile
  var [authUser, setAuthUser] = useState(null);
  var [profile, setProfile] = useState(null);
  var [authLoading, setAuthLoading] = useState(true);

  // UI State
  var [view, setView] = useState("landing");
  var [modal, setModal] = useState(null); // "login" | "signup" | "pay"
  var [authInitial, setAuthInitial] = useState("login");
  var [paymentData, setPaymentData] = useState(null);
  var [sidebar, setSidebar] = useState(false);
  var [servicesOpen, setServicesOpen] = useState(true);
  var [dark, setDark] = useState(false);
  var [rtl, setRtl] = useState(false);
  var [toast, setToast] = useState(null);
  var [faqOpen, setFaqOpen] = useState(-1);

  // Articles
  var [articles, setArticles] = useState([]);
  var [selArt, setSelArt] = useState(null);

  // Writer
  var [topic, setTopic] = useState("");
  var [lang, setLang] = useState("en");
  var [tone, setTone] = useState("Professional");
  var [len, setLen] = useState("medium");
  var [tmpl, setTmpl] = useState("blog");
  var [mood, setMood] = useState(null);
  var [era, setEra] = useState(null);
  var [loading, setLoading] = useState(false);
  var [result, setResult] = useState(null);
  var [toolId, setToolId] = useState(null);
  var [toolResult, setToolResult] = useState("");
  var [toolLoading, setToolLoading] = useState(false);

  // Battle
  var [bat1, setBat1] = useState("");
  var [bat2, setBat2] = useState("");
  var [batResult, setBatResult] = useState("");
  var [batLoading, setBatLoading] = useState(false);

  // Contact
  var [contactType, setContactType] = useState("suggest");
  var [contactSubject, setContactSubject] = useState("");
  var [contactMsg, setContactMsg] = useState("");
  var [contactSent, setContactSent] = useState(false);

  // Profile
  var [profileTab, setProfileTab] = useState("stats");
  var [adminContactMsgs, setAdminContactMsgs] = useState([]);

  // Admin
  var [adminTab, setAdminTab] = useState("dashboard");
  var [allUsers, setAllUsers] = useState([]);
  var [userSearch, setUserSearch] = useState("");
  var [newAdminEmail, setNewAdminEmail] = useState("");

  // Roast
  var [roastText, setRoastText] = useState("");
  var [roastLevel, setRoastLevel] = useState("medium");
  var [roastLoading, setRoastLoading] = useState(false);
  var [roastResult, setRoastResult] = useState("");

  // Admin API tracking
  var [apiBalance, setApiBalance] = useState(5);
  var [balanceInput, setBalanceInput] = useState("");

  // UI preferences (can still use localStorage)
  useEffect(function(){
    try {
      var d = localStorage.getItem("oxq_dark");
      var r = localStorage.getItem("oxq_rtl");
      if (d === "true") setDark(true);
      if (r === "true") setRtl(true);
    } catch(e) {}
  }, []);
  useEffect(function(){ try { localStorage.setItem("oxq_dark", String(dark)) } catch(e){} }, [dark]);
  useEffect(function(){ try { localStorage.setItem("oxq_rtl", String(rtl)) } catch(e){} }, [rtl]);

  // Handle URL errors (from OAuth callback)
  useEffect(function(){
    if (typeof window === "undefined") return;
    var params = new URLSearchParams(window.location.search);
    var err = params.get("error");
    if (err) {
      showToast(rtl ? "فشل تسجيل الدخول" : "Login failed: " + err, "error");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // ─── AUTH STATE ───
  useEffect(function(){
    var mounted = true;

    async function loadInitial(){
      var sessionResult = await supabase.auth.getSession();
      var session = sessionResult.data.session;

      if (!mounted) return;

      if (session && session.user) {
        setAuthUser(session.user);
        await loadProfile(session.user.id);
      }
      setAuthLoading(false);
    }

    loadInitial();

    // Listen to auth changes
    var sub = supabase.auth.onAuthStateChange(async function(event, session) {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session && session.user) {
          setAuthUser(session.user);
          await loadProfile(session.user.id);
          if (event === "SIGNED_IN" && modal) setModal(null);
        }
      } else if (event === "SIGNED_OUT") {
        setAuthUser(null);
        setProfile(null);
        setArticles([]);
        setView("landing");
      }
    });

    return function() {
      mounted = false;
      if (sub && sub.data && sub.data.subscription) sub.data.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId){
    var res = await getProfile(userId);
    if (!res.error && res.data) {
      setProfile(res.data);
      if (res.data.blocked) {
        showToast(rtl ? "حسابك محظور" : "Your account is blocked", "error");
        await signOut();
        return;
      }
      loadUserArticles(userId);
    }
  }

  async function loadUserArticles(userId){
    var res = await getArticles(userId);
    if (!res.error && res.data) {
      var mapped = res.data.map(function(a){
        return {
          id: a.id,
          topic: a.topic,
          content: a.content,
          lang: a.language,
          tone: a.tone,
          mood: a.mood,
          era: a.era,
          date: new Date(a.created_at).toLocaleDateString(),
          words: a.words || 0
        };
      });
      setArticles(mapped);
    }
  }

  // ─── DERIVED ───
  var t = function(key){var v=I18N[key];return v?(rtl?v.ar:v.en):key};
  var th = dark ? DARK : LIGHT;
  var plan = profile ? profile.plan : "free";
  var P = PLANS[plan];
  var credits = profile ? profile.credits : 0;
  var xp = profile ? profile.xp : 0;
  var streak = profile ? profile.streak : 0;
  var gender = profile ? profile.gender : "neutral";
  var isAdmin = profile ? profile.is_admin === true : false;
  var level = LEVELS[0];
  for(var i=LEVELS.length-1;i>=0;i--){if(xp>=LEVELS[i].xp){level=LEVELS[i];break}}
  var nextLevel = LEVELS.find(function(l){return l.xp>xp});

  // ─── HELPERS ───
  function go(v){setView(v);setSelArt(null);setSidebar(false);setContactSent(false)}
  function showToast(msg, type){setToast({msg:msg,type:type||"success"});setTimeout(function(){setToast(null)},3000)}

  async function handleLogout(){
    await signOut();
    showToast(rtl?"تم تسجيل الخروج":"Logged out");
  }

  function greeting(){
    if(!profile) return "";
    if(rtl){
      if(gender==="male") return "أهلاً بك، "+profile.name;
      if(gender==="female") return "أهلاً بكِ، "+profile.name;
      return "أهلاً، "+profile.name;
    }
    return "Welcome, "+profile.name;
  }

  function totalWords(){return articles.reduce(function(s,a){return s+(a.words||0)},0)}
  function earnedBadges(){
    return BADGES.filter(function(b){
      if(b.t==="art") return articles.length>=b.req;
      if(b.t==="str") return streak>=b.req;
      if(b.t==="wrd") return totalWords()>=b.req;
      return false;
    });
  }

  // ─── AI GENERATE ───
  async function generate(){
    if(!topic.trim()||loading) return;
    if(!authUser){showToast(rtl?"سجّل الدخول أولاً":"Please log in first","error");setAuthInitial("login");setModal("login");return}

    // Deduct credits first
    var creditResult = await useCreditsDB(authUser.id, COSTS.generate, "generate");
    if(creditResult.error){
      showToast(rtl?"كريديت غير كافي":"Not enough credits","error");
      go("credits");
      return;
    }

    setLoading(true);setResult(null);setToolId(null);setToolResult("");

    var ln="English";for(var i=0;i<LANGS.length;i++)if(LANGS[i].v===lang){ln=LANGS[i].l;break}
    var tp="a blog article";for(var i=0;i<TMPLS.length;i++)if(TMPLS[i].id===tmpl){tp=TMPLS[i].p;break}
    var extra="";
    if(mood) extra+="\n- Mood: "+mood.p;
    if(era) extra+="\n- Era style: "+era.p;
    if(gender==="male") extra+="\n- Address reader as male";
    if(gender==="female") extra+="\n- Address reader as female";

    try{
      var wc = len==="short"?800:len==="medium"?1500:2500;
      wc = Math.min(wc,P.mW);
      var txt = await callAI("Write "+tp+" about: \""+topic+"\"\n- Language: "+ln+"\n- Tone: "+tone+"\n- ~"+wc+" words\n- Use # for title, 4-6 ## subheadings, include SEO keywords, add **Meta Description:** at end"+extra+"\nWrite the full article:");
      setResult(txt);

      var words = txt.split(/\s+/).length;
      var saved = await saveArticle(authUser.id, {
        topic: topic,
        content: txt,
        language: ln,
        tone: tone,
        mood: mood ? mood.n : null,
        era: era ? era.y : null,
        template: tmpl,
        words: words
      });

      if(!saved.error){
        await loadUserArticles(authUser.id);
        await addXp(authUser.id, 25);
        await loadProfile(authUser.id);
      }
    }catch(e){setResult("Error: "+e.message)}
    setLoading(false);
  }

  async function runTool(id){
    if(!authUser) return;
    var creditResult = await useCreditsDB(authUser.id, COSTS[id], id);
    if(creditResult.error){
      showToast(rtl?"كريديت غير كافي":"Not enough credits","error");
      return;
    }
    setToolId(id);setToolLoading(true);setToolResult("");
    var prompts={
      roast:"Roast this article comedically and rate 1-10.\n\n"+result,
      viral:"Rate viral potential 1-100 with breakdown and tips.\n\n"+result,
      remix:"Update this article to 2026 standards.\n\n"+result,
      debate:"Write FOR (500w) and AGAINST (500w) the topic: \""+topic+"\"",
      summary:"Write a 3-sentence summary:\n\n"+result,
      titles:"Generate 10 SEO-optimized titles for: \""+topic+"\". Rate each 1-10.",
      thread:"Create a Twitter/X thread of 8-12 tweets:\n\n"+result,
      linkedin:"Write a LinkedIn post under 1300 chars with hashtags:\n\n"+result,
      repurpose:"Generate: Summary, X Thread, LinkedIn post, Instagram caption, Email subject lines:\n\n"+result
    };
    try{
      var r=await callAI(prompts[id]||"Analyze:\n"+result);
      setToolResult(r);
      await addXp(authUser.id, 5);
      await loadProfile(authUser.id);
    }catch(e){setToolResult("Error.")}
    setToolLoading(false);
  }

  async function doBattle(){
    if(!bat1.trim()||!bat2.trim()||batLoading) return;
    if(!authUser){showToast(rtl?"سجّل الدخول":"Log in first","error");return}
    var cr = await useCreditsDB(authUser.id, COSTS.battle, "battle");
    if(cr.error){showToast(rtl?"كريديت غير كافي":"Not enough credits","error");return}
    setBatLoading(true);setBatResult("");
    try{
      var r=await callAI("ARTICLE BATTLE!\n\nA:\n"+bat1.slice(0,2000)+"\n\nB:\n"+bat2.slice(0,2000)+"\n\nJudge by Structure/SEO/Readability/Depth/Engagement (20pts each). Announce Winner with detailed reasoning!");
      setBatResult(r);
      await addXp(authUser.id, 20);
      await loadProfile(authUser.id);
    }catch(e){setBatResult("Error.")}
    setBatLoading(false);
  }



  // ─── STANDALONE ROAST ───
  async function doRoast(){
    if(!roastText.trim()||roastLoading) return;
    if(!authUser){showToast(rtl?"سجّل الدخول":"Log in first","error");return}
    var cr = await useCreditsDB(authUser.id, COSTS.roast, "roast");
    if(cr.error){showToast(rtl?"كريديت غير كافي":"Not enough credits","error");return}
    setRoastLoading(true);setRoastResult("");
    var lvPrompt = roastLevel==="gentle"?"Be constructive with light humor.":roastLevel==="savage"?"Be BRUTAL and merciless (but constructive underneath).":"Balance humor with genuine feedback.";
    try{
      var r=await callAI("You are a brutally honest writing critic. "+lvPrompt+" Roast this article. Score /10. Point out weaknesses. End with 3 tips.\n\n"+roastText);
      setRoastResult(r);
      await addXp(authUser.id, 5);
      await loadProfile(authUser.id);
    }catch(e){setRoastResult("Error.")}
    setRoastLoading(false);
  }
  // ─── CONTACT ───
  async function handleSendContact(){
    if(!contactSubject.trim()){showToast(rtl?"أدخل الموضوع":"Enter subject","error");return}
    if(!contactMsg.trim()){showToast(rtl?"اكتب الرسالة":"Write a message","error");return}
    var res = await sendContactMessage(authUser?authUser.id:null, contactType, contactSubject, contactMsg);
    if(res.error){showToast(res.error.message,"error");return}
    setContactSent(true);
    setContactSubject("");
    setContactMsg("");
  }

  // ─── ADMIN ───
  async function loadAdminUsers(){
    var res = await getAllUsers();
    if(!res.error && res.data) setAllUsers(res.data);
  }
  useEffect(function(){
    if(isAdmin && view === "admin") loadAdminUsers();
  }, [isAdmin, view, adminTab]);

  async function toggleBlock(userId, currentBlocked){
    var res = await blockUser(userId, !currentBlocked);
    if(!res.error){
      showToast(currentBlocked?(rtl?"تم فك الحظر":"Unblocked"):(rtl?"تم الحظر":"Blocked"));
      loadAdminUsers();
    }
  }
  async function handleMakeAdmin(email, makeIt){
    var res = await makeAdmin(email, makeIt);
    if(!res.error){
      showToast(makeIt?(rtl?"تمت الإضافة":"Admin added"):(rtl?"تم الحذف":"Admin removed"));
      loadAdminUsers();
    }
  }

  // ─── PROFILE SETTINGS ───
  async function saveProfileSettings(updates){
    var res = await updateProfile(authUser.id, updates);
    if(!res.error){
      setProfile(res.data);
      showToast(rtl?"تم الحفظ":"Saved");
    }
  }

  async function handleDeleteAccount(){
    if(!confirm(rtl?"هل أنت متأكد؟ لا يمكن التراجع.":"Are you sure? This cannot be undone.")) return;
    await deleteAccount(authUser.id);
  }

  // ─── STYLES ───
  var cssVars="";
  var kk=Object.keys(th);
  for(var i=0;i<kk.length;i++) cssVars+="--"+kk[i]+":"+th[kk[i]]+";";
  cssVars+="min-height:100vh;background:var(--bg);font-family:Plus Jakarta Sans,system-ui,sans-serif;color:var(--tx);overflow-x:hidden;direction:"+(rtl?"rtl":"ltr");

  // ─── LOADING SCREEN ───
  if(authLoading){
    return (
      <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#F7F8FC",fontFamily:"Plus Jakarta Sans,system-ui,sans-serif"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#5B6CF0,#9B7BF0)",display:"grid",placeItems:"center",color:"#fff",fontWeight:900,fontSize:22,margin:"0 auto 16px"}}>Ox</div>
          <div style={{fontSize:14,color:"#4A5070",fontWeight:600}}>Loading...</div>
        </div>
      </div>
    );
  }

  // ═════════ RENDER ═════════
  return (
    <div ref={function(el){if(el)el.style.cssText=cssVars}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}a{color:inherit;text-decoration:none}button{font-family:inherit}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}@keyframes spin{to{transform:rotate(360deg)}}"}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,insetInlineStart:0,insetInlineEnd:0,zIndex:100,height:56,padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--nv)",backdropFilter:"blur(16px)",borderBottom:"1px solid var(--bd)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={function(){setSidebar(!sidebar)}} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--tx)",padding:6,width:34,height:34}}>=</button>
          <div onClick={function(){go("landing")}} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
            <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,var(--pr),var(--p2))",display:"grid",placeItems:"center",fontWeight:900,fontSize:12,color:"#fff",letterSpacing:-.5}}>Ox</div>
            <div>
              <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:16,fontWeight:900,lineHeight:1}}>{t("brand")}</div>
              <div style={{fontSize:9,color:"var(--t3)",lineHeight:1,marginTop:2}}>{t("tagline")}</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <button onClick={function(){setDark(!dark)}} style={{padding:"6px 9px",background:"var(--b3)",border:"1px solid var(--bd)",borderRadius:7,fontSize:12,cursor:"pointer",color:"var(--t2)",width:34,height:32}}>{dark?"L":"D"}</button>
          <button onClick={function(){setRtl(!rtl)}} style={{padding:"6px 9px",background:"var(--b3)",border:"1px solid var(--bd)",borderRadius:7,fontSize:10,fontWeight:800,cursor:"pointer",color:"var(--pr)",minWidth:42,height:32}}>{rtl?"EN":"AR"}</button>
          {authUser && <div onClick={function(){go("credits")}} style={{padding:"5px 11px",borderRadius:99,fontSize:11,fontWeight:800,background:"linear-gradient(135deg,var(--wr),#EF7B6C)",color:"#fff",cursor:"pointer",height:32,display:"flex",alignItems:"center",gap:4}}>C {credits}</div>}
          {authUser ? (
            <button onClick={handleLogout} style={{padding:"6px 14px",background:"var(--b3)",color:"var(--tx)",border:"1px solid var(--bd)",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer"}}>{t("nav.logout")}</button>
          ) : (
            <button onClick={function(){setAuthInitial("login");setModal("login")}} style={{padding:"6px 14px",background:"var(--pr)",color:"#fff",border:"none",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer"}}>{t("nav.login")}</button>
          )}
        </div>
      </nav>

      {/* SIDEBAR */}
      {sidebar && (<>
        <div onClick={function(){setSidebar(false)}} style={{position:"fixed",inset:0,zIndex:150,background:"rgba(0,0,0,.4)",backdropFilter:"blur(3px)"}}/>
        <div style={{position:"fixed",top:0,insetInlineStart:0,bottom:0,zIndex:200,width:"min(280px,85vw)",background:"var(--cd)",borderInlineEnd:"1px solid var(--bd)",overflowY:"auto",animation:"slideIn .25s"}}>
          <div style={{padding:"16px 18px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,var(--pr),var(--p2))",display:"grid",placeItems:"center",fontWeight:900,fontSize:13,color:"#fff"}}>Ox</div>
              <div>
                <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:17,fontWeight:900}}>{t("brand")}</div>
                <div style={{fontSize:9,color:"var(--t3)"}}>{t("tagline")}</div>
              </div>
            </div>
            <button onClick={function(){setSidebar(false)}} style={{width:30,height:30,borderRadius:7,border:"1px solid var(--bd)",background:"var(--b3)",cursor:"pointer",color:"var(--t2)",fontSize:14}}>X</button>
          </div>

          <div style={{padding:"10px 0"}}>
            {profile && (
              <div onClick={function(){go("profile")}} style={{padding:"14px 18px",borderBottom:"1px solid var(--bd)",cursor:"pointer",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,var(--pr),var(--p2))",display:"grid",placeItems:"center",color:"#fff",fontWeight:800,fontSize:16}}>{(profile.name||"?").charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:13}}>{profile.name}</div>
                    <div style={{fontSize:10,color:"var(--pr)"}}>{level.n+" \u2022 "+credits+" credits"}</div>
                  </div>
                </div>
              </div>
            )}
            <SideItem ic="[H]" label={t("nav.home")} active={view==="landing"} onClick={function(){go("landing")}}/>

            <div onClick={function(){setServicesOpen(!servicesOpen)}} style={{padding:"12px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,color:"var(--t2)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>
              <span style={{flex:1}}>{t("nav.services")}</span>
              <span style={{fontSize:9,color:"var(--t3)"}}>{servicesOpen?"-":"+"}</span>
            </div>
            {servicesOpen && (<>
              <SideItem ic="[W]" label={t("nav.writer")} active={view==="writer"} onClick={function(){go("writer")}} sub/>
              <SideItem ic="[B]" label={t("nav.battle")} active={view==="battle"} onClick={function(){go("battle")}} sub/>
              <SideItem ic="[R]" label={t("nav.roast")} active={view==="roast"} onClick={function(){go("roast")}} sub/>
              <SideItem ic="[D]" label={t("nav.writers")} active={view==="writers"} onClick={function(){go("writers")}} sub/>
            </>)}

            <div style={{height:1,background:"var(--bd)",margin:"6px 18px"}}/>

            <SideItem ic="[$]" label={t("nav.pricing")} active={view==="pricing"} onClick={function(){go("pricing")}}/>
            <SideItem ic="[C]" label={t("nav.credits")} active={view==="credits"} onClick={function(){go("credits")}}/>
            {authUser && <SideItem ic="[P]" label={t("nav.profile")} active={view==="profile"} onClick={function(){go("profile")}}/>}

            <div style={{height:1,background:"var(--bd)",margin:"6px 18px"}}/>

            <SideItem ic="[@]" label={t("nav.contact")} active={view==="contact"} onClick={function(){go("contact")}}/>
            <SideItem ic="[T]" label={t("nav.terms")} active={view==="terms"} onClick={function(){go("terms")}}/>
            <SideItem ic="[K]" label={t("nav.privacy")} active={view==="privacy"} onClick={function(){go("privacy")}}/>
            {isAdmin && <SideItem ic="[A]" label={t("nav.admin")} active={view==="admin"} onClick={function(){go("admin")}}/>}
          </div>

          {profile && (
            <div style={{marginTop:20,padding:"14px 18px",borderTop:"1px solid var(--bd)",background:"var(--bg)"}}>
              <div style={{fontSize:12,fontWeight:700}}>{greeting()}</div>
              <div style={{fontSize:10,color:"var(--t3)",marginTop:2,wordBreak:"break-all"}}>{profile.email}</div>
              {isAdmin && <div style={{display:"inline-block",padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,background:"var(--wr)",color:"#fff",marginTop:4}}>Admin</div>}
            </div>
          )}
        </div>
      </>)}

      {/* PAGES */}
      <div style={{position:"relative",zIndex:1,paddingTop:56}}>
        {view==="landing" && <LandingPage t={t} rtl={rtl} go={go} authUser={authUser} setAuthInitial={setAuthInitial} setModal={setModal} faqOpen={faqOpen} setFaqOpen={setFaqOpen}/>}
        {view==="writer" && <WriterPage {...{t,rtl,authUser,setAuthInitial,setModal,P,topic,setTopic,lang,setLang,tone,setTone,len,setLen,tmpl,setTmpl,mood,setMood,era,setEra,loading,result,generate,runTool,toolId,toolResult,toolLoading,setToolId,setToolResult,credits,go}}/>}
        {view==="roast" && <RoastPage {...{t,rtl,authUser,setAuthInitial,setModal,roastText,setRoastText,roastLevel,setRoastLevel,roastLoading,roastResult,doRoast}}/>}
        {view==="battle" && <BattlePage {...{t,rtl,authUser,setAuthInitial,setModal,bat1,setBat1,bat2,setBat2,doBattle,batLoading,batResult}}/>}
        {view==="credits" && <CreditsPage {...{t,rtl,credits,setPaymentData,setModal}}/>}
        {view==="pricing" && <PricingPage {...{t,rtl,plan,setPaymentData,setModal,go}}/>}
        {view==="profile" && authUser && profile && <ProfilePage {...{t,rtl,profile,articles,xp,credits,streak,level,nextLevel,profileTab,setProfileTab,selArt,setSelArt,gender,earnedBadges:earnedBadges(),totalWords:totalWords(),saveProfileSettings,handleDeleteAccount,showToast}}/>}
        {view==="writers" && <WritersPage {...{t,rtl,plan,go}}/>}
        {view==="contact" && <ContactPage {...{t,rtl,contactType,setContactType,contactSubject,setContactSubject,contactMsg,setContactMsg,contactSent,setContactSent,handleSendContact}}/>}
        {view==="terms" && <LegalPage type="terms" rtl={rtl}/>}
        {view==="privacy" && <LegalPage type="privacy" rtl={rtl}/>}
        {view==="admin" && isAdmin && <AdminPage {...{t,rtl,allUsers,userSearch,setUserSearch,adminTab,setAdminTab,toggleBlock,handleMakeAdmin,newAdminEmail,setNewAdminEmail,articles,apiBalance,setApiBalance,balanceInput,setBalanceInput,showToast}}/>}
      </div>

      {/* FOOTER */}
      <footer style={{borderTop:"1px solid var(--bd)",padding:"40px 20px 24px",marginTop:40}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24,marginBottom:28}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,var(--pr),var(--p2))",display:"grid",placeItems:"center",fontWeight:900,fontSize:11,color:"#fff"}}>Ox</div>
                <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:18,fontWeight:900}}>{t("brand")}</div>
              </div>
              <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.6}}>{t("tagline")}</div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:10}}>{t("nav.services")}</div>
              <FooterLink onClick={function(){go("writer")}}>{t("nav.writer")}</FooterLink>
              <FooterLink onClick={function(){go("battle")}}>{t("nav.battle")}</FooterLink>
              <FooterLink onClick={function(){go("writers")}}>{t("nav.writers")}</FooterLink>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:10}}>{t("footer.company")}</div>
              <FooterLink onClick={function(){go("pricing")}}>{t("nav.pricing")}</FooterLink>
              <FooterLink onClick={function(){go("credits")}}>{t("nav.credits")}</FooterLink>
              <FooterLink onClick={function(){go("contact")}}>{t("nav.contact")}</FooterLink>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:10}}>{t("footer.legal")}</div>
              <FooterLink onClick={function(){go("terms")}}>{t("nav.terms")}</FooterLink>
              <FooterLink onClick={function(){go("privacy")}}>{t("nav.privacy")}</FooterLink>
            </div>
          </div>
          <div style={{borderTop:"1px solid var(--bd)",paddingTop:18,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:10}}>
              <button onClick={function(){setDark(!dark)}} style={{background:"none",border:"1px solid var(--bd)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:14}}>{dark?"\u2600\ufe0f":"\ud83c\udf19"}</button>
              <button onClick={function(){setRtl(!rtl)}} style={{background:"none",border:"1px solid var(--bd)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:800,color:"var(--pr)"}}>{rtl?"EN":"AR"}</button>
            </div>
            <p style={{fontSize:11,color:"var(--t3)"}}>(c) 2026 Oxquill. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {(modal==="login"||modal==="signup") && (
        <AuthModal
          initialMode={modal}
          rtl={rtl}
          onClose={function(){setModal(null)}}
          onSuccess={function(){setModal(null);go("writer")}}
        />
      )}
      {modal==="pay" && paymentData && <PayModal data={paymentData} rtl={rtl} t={t} onClose={function(){setModal(null);setPaymentData(null)}} onSuccess={async function(){
        if(paymentData.type === "plan"){
          await saveProfileSettings({ plan: paymentData.planKey });
          await addCredits(authUser.id, paymentData.credits, "plan_purchase");
        } else if(paymentData.type === "credits"){
          await addCredits(authUser.id, paymentData.credits, "credit_pack_purchase");
        }
        await loadProfile(authUser.id);
        setModal(null);
        setPaymentData(null);
        showToast(rtl?"تم الدفع بنجاح":"Payment successful");
      }}/>}

      {/* TOAST */}
      {toast && (
        <div style={{position:"fixed",bottom:20,insetInlineStart:"50%",transform:"translateX(-50%)",zIndex:10000,padding:"12px 20px",background:toast.type==="error"?"var(--er)":"var(--ok)",color:"#fff",borderRadius:9,fontSize:13,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,.15)",animation:"fadeUp .25s"}}>
          {toast.type==="error"?"!":"+"} {toast.msg}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════
function SideItem(p){
  return (
    <div onClick={p.onClick} style={{padding:p.sub?"9px 18px 9px 34px":"11px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:11,background:p.active?"var(--pS)":"none",color:p.active?"var(--pr)":"var(--t2)",fontSize:p.sub?12:13,fontWeight:p.sub?500:600,borderInlineStart:p.active?"3px solid var(--pr)":"3px solid transparent"}}>
      <span style={{fontSize:p.sub?11:13,fontWeight:700,color:p.active?"var(--pr)":"var(--t3)"}}>{p.ic}</span>
      <span>{p.label}</span>
    </div>
  );
}
function FooterLink(p){
  return <div onClick={p.onClick} style={{fontSize:12,color:"var(--t2)",cursor:"pointer",padding:"3px 0"}}>{p.children}</div>;
}
function Btn(p){
  var bg = p.variant==="ghost"?"var(--b3)":p.variant==="danger"?"var(--er)":"var(--pr)";
  var col = p.variant==="ghost"?"var(--tx)":"#fff";
  var sz = p.size==="lg"?"13px 28px":p.size==="sm"?"6px 12px":"10px 20px";
  var fs = p.size==="lg"?14:p.size==="sm"?11:12;
  return <button onClick={p.onClick} disabled={p.disabled} style={{padding:sz,background:p.disabled?"var(--t3)":bg,color:col,border:"none",borderRadius:9,fontSize:fs,fontWeight:700,cursor:p.disabled?"not-allowed":"pointer",fontFamily:"inherit",opacity:p.disabled?.6:1,width:p.full?"100%":"auto",...p.style}}>{p.children}</button>;
}
function Card(p){
  return <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,padding:p.padding||18,...p.style}}>{p.children}</div>;
}
function SmallBtn(p){
  return <button onClick={p.onClick} style={{padding:"5px 10px",background:"var(--cd)",color:"var(--pr)",border:"1px solid var(--bd)",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{p.children}</button>;
}
function Chip(p){
  return <button onClick={p.onClick} style={{padding:"6px 13px",background:p.active?"var(--pr)":"var(--b3)",border:p.active?"none":"1px solid var(--bd)",borderRadius:99,color:p.active?"#fff":"var(--t2)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{p.children}</button>;
}

// ═══════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════
function LandingPage(p){
  var heroCards = [
    {k1:"AI Writer",k2:"Generate SEO articles in 28 languages",v:"writer"},
    {k1:"Article Battle",k2:"Compare two articles head-to-head",v:"battle"},
    {k1:"Writers Directory",k2:"Connect with top content creators",v:"writers"}
  ];
  var features = [
    {t:"AI Writer",d:"Generate SEO-optimized articles in 28 languages with 6 moods"},
    {t:"Article Battle",d:"Compare two articles with AI judging"},
    {t:"Time Machine",d:"Write in any era style from 1900 to 2050"},
    {t:"Mood Writing",d:"Match tone to emotion"},
    {t:"Article Roast",d:"Get comedic feedback to improve"},
    {t:"Repurpose Suite",d:"Turn one article into thread, LinkedIn, email, and more"}
  ];
  var faqData = [
    {q:p.rtl?"كيف يعمل الكريديت؟":"How do credits work?",a:p.rtl?"كل عملية AI تكلف كريديت. تحصل على 10 كريديت مجاناً عند التسجيل.":"Each AI action costs credits. Get 10 free on signup, plus monthly credits with paid plans."},
    {q:p.rtl?"هل يمكنني الإلغاء؟":"Can I cancel anytime?",a:p.rtl?"نعم، من ملفك الشخصي بدون رسوم.":"Yes, cancel anytime from profile. No fees."},
    {q:p.rtl?"هل تقدمون استرداد؟":"Do you offer refunds?",a:p.rtl?"نعم، ضمان 14 يوماً.":"Yes, 14-day money-back guarantee."},
    {q:p.rtl?"ما اللغات المدعومة؟":"Which languages are supported?",a:p.rtl?"28 لغة تشمل العربية والإنجليزية.":"28 languages including Arabic, English, French, Spanish, and more."},
    {q:p.rtl?"هل محتواي خاص؟":"Is my content private?",a:p.rtl?"بالطبع. لا نشارك أو نستخدم محتواك للتدريب.":"Absolutely. We never share or use your content for training."},
    {q:p.rtl?"هل يمكنني الاستخدام التجاري؟":"Can I use content commercially?",a:p.rtl?"نعم، تمتلك 100 بالمئة من المحتوى.":"Yes, you own 100% of generated content."}
  ];
  function primary(){if(!p.authUser){p.setAuthInitial("signup");p.setModal("signup")}else{p.go("writer")}}

  return (
    <div>
      {/* HERO */}
      <section style={{paddingTop:40,paddingBottom:40,textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px",background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:99,fontSize:11,fontWeight:700,color:"var(--pr)",marginBottom:22}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"var(--ok)",animation:"pulse 2s infinite"}}/>
            {p.rtl?"28 لغة · 31 حقبة · 10 أدوات AI":"28 languages · 31 eras · 10 AI tools"}
          </div>
          <h1 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(32px,7vw,60px)",fontWeight:900,lineHeight:1.05,marginBottom:16,letterSpacing:-1}}>
            {p.rtl ? <>{p.t("hero.title.ar")}<span style={{background:"linear-gradient(135deg,#5B6CF0,#9B7BF0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p.t("hero.word.ar")}</span>{p.t("hero.end.ar")}</> : <>{p.t("hero.title.en")}<span style={{background:"linear-gradient(135deg,#5B6CF0,#9B7BF0)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p.t("hero.word.en")}</span>{p.t("hero.end.en")}</>}
          </h1>
          <p style={{fontSize:"clamp(13px,2vw,16px)",color:"var(--t2)",maxWidth:580,margin:"0 auto 26px",lineHeight:1.7}}>
            {p.t("hero.desc")}
          </p>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
            <Btn size="lg" onClick={primary}>{p.rtl?"ابدأ الكتابة مجاناً":"Start Writing Free"}</Btn>
            <Btn size="lg" variant="ghost" onClick={function(){var el=document.getElementById("how");if(el)el.scrollIntoView({behavior:"smooth"})}}>{p.rtl?"شاهد كيف يعمل":"See How It Works"}</Btn>
          </div>
          <div style={{fontSize:11,color:"var(--t3)"}}>+ {p.rtl?"بدون بطاقة ائتمان · 10 كريديت مجاناً":"No credit card required · 10 free credits"}</div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{padding:"20px",borderTop:"1px solid var(--bd)",borderBottom:"1px solid var(--bd)",background:"var(--cd)"}}>
        <div style={{textAlign:"center",fontSize:11,fontWeight:600,color:"var(--t3)",letterSpacing:1,textTransform:"uppercase"}}>
          {p.rtl?"موثوق من 2,500+ صانع محتوى":"Trusted by 2,500+ content creators worldwide"}
        </div>
      </section>

      {/* HERO CARDS */}
      <section style={{padding:"50px 20px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {heroCards.map(function(c,i){
              return (
                <div key={i} onClick={function(){p.go(c.v)}} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:14,padding:24,cursor:"pointer"}}>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:8,color:"var(--pr)"}}>{c.k1}</div>
                  <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5}}>{c.k2}</div>
                  <div style={{fontSize:12,color:"var(--pr)",marginTop:12,fontWeight:600}}>{p.rtl?"تعرف أكثر":"Learn more"} {"->"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"50px 20px",background:"var(--cd)"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--pr)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{p.rtl?"المميزات":"FEATURES"}</div>
            <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:900}}>{p.rtl?"كل ما تحتاجه لتتصدر":"Everything You Need"}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {features.map(function(f,i){
              return (
                <div key={i} style={{background:"var(--bg)",border:"1px solid var(--bd)",borderRadius:12,padding:22}}>
                  <div style={{fontSize:15,fontWeight:800,marginBottom:6,color:"var(--pr)"}}>{f.t}</div>
                  <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6}}>{f.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"50px 20px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:30}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--pr)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{p.rtl?"كيف يعمل":"HOW IT WORKS"}</div>
            <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:900}}>{p.rtl?"ثلاث خطوات فقط":"Three Simple Steps"}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18}}>
            {[
              {t:p.rtl?"اختر الموضوع":"Choose Topic",d:p.rtl?"قالب + كلمات + لغة + نبرة":"Template, keywords, language, tone"},
              {t:p.rtl?"دع AI يكتب":"Let AI Write",d:p.rtl?"احصل على مقال كامل في ثوان":"Get a complete SEO article in seconds"},
              {t:p.rtl?"حسّن وانشر":"Polish & Publish",d:p.rtl?"10 أدوات للتحسين ثم صدّر PDF/Word":"10 AI tools then export as PDF, Word, or TXT"}
            ].map(function(s,i){
              return (
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--pr),var(--p2))",color:"#fff",display:"grid",placeItems:"center",margin:"0 auto 14px",fontFamily:"Source Serif 4,Georgia,serif",fontSize:24,fontWeight:900}}>{i+1}</div>
                  <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{s.t}</div>
                  <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.6,maxWidth:240,margin:"0 auto"}}>{s.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"50px 20px",background:"var(--cd)"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:26}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--pr)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{p.rtl?"الشهادات":"TESTIMONIALS"}</div>
            <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:900}}>{p.rtl?"يحبه المبدعون":"Loved by Creators"}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
            {TESTIMONIALS.map(function(ts,i){
              return (
                <div key={i} style={{background:"var(--bg)",border:"1px solid var(--bd)",borderRadius:12,padding:22}}>
                  <div style={{fontSize:13,color:"var(--wr)",marginBottom:10}}>{"*".repeat(ts.rating)}</div>
                  <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.7,marginBottom:14,fontStyle:"italic"}}>"{ts.text}"</p>
                  <div style={{fontSize:13,fontWeight:700}}>{ts.name}</div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>{ts.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"50px 20px"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--pr)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>FAQ</div>
            <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(22px,4vw,32px)",fontWeight:900}}>{p.rtl?"الأسئلة الشائعة":"Common Questions"}</h2>
          </div>
          {faqData.map(function(f,i){
            var open = p.faqOpen===i;
            return (
              <div key={i} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:10,marginBottom:8,overflow:"hidden"}}>
                <div onClick={function(){p.setFaqOpen(open?-1:i)}} style={{padding:"14px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div style={{fontSize:13,fontWeight:700,flex:1}}>{f.q}</div>
                  <div style={{fontSize:18,color:"var(--pr)"}}>{open?"-":"+"}</div>
                </div>
                {open && <div style={{padding:"0 18px 14px",fontSize:12,color:"var(--t2)",lineHeight:1.7}}>{f.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"50px 20px"}}>
        <div style={{maxWidth:700,margin:"0 auto",background:"linear-gradient(135deg,var(--pr),var(--p2))",borderRadius:18,padding:"42px 28px",textAlign:"center",color:"#fff"}}>
          <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(22px,4vw,30px)",fontWeight:900,marginBottom:10}}>{p.rtl?"جاهز لمضاعفة محتواك؟":"Ready to 10x Your Content?"}</h2>
          <p style={{fontSize:14,opacity:.92,marginBottom:20}}>{p.rtl?"انضم للآلاف":"Join thousands of creators"}</p>
          <button onClick={primary} style={{padding:"14px 34px",background:"#fff",color:"var(--pr)",border:"none",borderRadius:10,fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{p.rtl?"ابدأ مجاناً":"Start Free"}</button>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WRITER PAGE
// ═══════════════════════════════════════════════════════════════════
function WriterPage(p){
  if(!p.authUser){
    return <div style={{padding:"80px 20px",textAlign:"center"}}>
      <div style={{fontSize:15,color:"var(--t2)",marginBottom:14}}>{p.rtl?"سجّل الدخول للمتابعة":"Log in to continue"}</div>
      <Btn size="lg" onClick={function(){p.setAuthInitial("signup");p.setModal("signup")}}>{p.rtl?"حساب مجاني":"Create Free Account"}</Btn>
    </div>;
  }
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"20px 16px 40px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:22,fontWeight:900}}>{p.rtl?"كاتب AI":"AI Writer"}</h2>
        <span style={{padding:"3px 10px",borderRadius:99,fontSize:10,fontWeight:700,background:"var(--pS)",color:"var(--pr)"}}>C {p.credits}</span>
      </div>

      <Card>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"القالب":"Template"}</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {TMPLS.map(function(tp){return <Chip key={tp.id} active={p.tmpl===tp.id} onClick={function(){p.setTmpl(tp.id)}}>{tp.n}</Chip>})}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الموضوع":"Topic"}</label>
          <input value={p.topic} onChange={function(e){p.setTopic(e.target.value)}} placeholder={p.rtl?"مثال: مستقبل الذكاء الاصطناعي":"e.g. Future of AI in Marketing"} style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"اللغة":"Language"}</label>
            <select value={p.lang} onChange={function(e){p.setLang(e.target.value)}} style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}>
              {LANGS.slice(0,p.P.lng).map(function(l){return <option key={l.v} value={l.v}>{l.l}</option>})}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الطول":"Length"}</label>
            <select value={p.len} onChange={function(e){p.setLen(e.target.value)}} style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}>
              <option value="short">{p.rtl?"قصير (800)":"Short (800w)"}</option>
              <option value="medium">{p.rtl?"متوسط (1500)":"Medium (1500w)"}</option>
              <option value="long">{p.rtl?"طويل (2500)":"Long (2500w)"}</option>
            </select>
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"النبرة":"Tone"}</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {TONES.map(function(tn){return <Chip key={tn} active={p.tone===tn} onClick={function(){p.setTone(tn)}}>{tn}</Chip>})}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"المزاج":"Mood"}</label>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {MOODS.map(function(m){return <Chip key={m.n} active={p.mood&&p.mood.n===m.n} onClick={function(){p.setMood(p.mood&&p.mood.n===m.n?null:m)}}>{m.n}</Chip>})}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"آلة الزمن":"Time Machine"}</label>
          {[
            {label:p.rtl?"عتيق (1900-1945)":"Vintage (1900-1945)",eras:ERAS_VINTAGE},
            {label:p.rtl?"حديث (1950-2020)":"Modern (1950-2020)",eras:ERAS_MODERN},
            {label:p.rtl?"المستقبل (2025-2050)":"Future (2025-2050)",eras:ERAS_FUTURE}
          ].map(function(grp,gi){
            return (
              <div key={gi} style={{marginBottom:8}}>
                <div style={{fontSize:10,color:"var(--t3)",marginBottom:4,fontWeight:600}}>{grp.label}</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {grp.eras.map(function(e){return <Chip key={e.y} active={p.era&&p.era.y===e.y} onClick={function(){p.setEra(p.era&&p.era.y===e.y?null:e)}}>{e.y}</Chip>})}
                </div>
              </div>
            );
          })}
        </div>

        <Btn full size="lg" disabled={p.loading||!p.topic.trim()} onClick={p.generate}>
          {p.loading?(p.rtl?"جاري الكتابة...":"Crafting..."):(p.rtl?"توليد":"Generate")+" ("+COSTS.generate+"C)"}
        </Btn>
      </Card>

      {p.result && (
        <Card style={{marginTop:14,overflow:"hidden",padding:0}}>
          <div style={{padding:"12px 16px",background:"var(--b3)",borderBottom:"1px solid var(--bd)"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6,marginBottom:8}}>
              <span style={{fontSize:10,color:"var(--t3)"}}>{p.result.split(/\s+/).length} words</span>
              <div style={{display:"flex",gap:4}}>
                <SmallBtn onClick={function(){navigator.clipboard.writeText(p.result)}}>Copy</SmallBtn>
                <SmallBtn onClick={function(){exTXT(p.result,p.topic)}}>TXT</SmallBtn>
                <SmallBtn onClick={function(){exPDF(p.result,p.topic)}}>PDF</SmallBtn>
                <SmallBtn onClick={function(){exWord(p.result,p.topic)}}>Word</SmallBtn>
              </div>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {["roast","viral","remix","debate","summary","titles","thread","linkedin","repurpose"].map(function(tid){
                return <SmallBtn key={tid} onClick={function(){p.runTool(tid)}}>{tid} ({COSTS[tid]}C)</SmallBtn>;
              })}
            </div>
          </div>
          {p.toolLoading && <div style={{padding:30,textAlign:"center"}}><div style={{fontSize:12,color:"var(--t2)"}}>{p.rtl?"جاري العمل...":"Working..."}</div></div>}
          {p.toolResult && !p.toolLoading && (
            <div style={{borderBottom:"1px solid var(--bd)"}}>
              <div style={{padding:"8px 16px",display:"flex",justifyContent:"space-between",background:"var(--bg)"}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--pr)",textTransform:"capitalize"}}>{p.toolId}</span>
                <SmallBtn onClick={function(){p.setToolResult("");p.setToolId(null)}}>X</SmallBtn>
              </div>
              <div style={{padding:16,fontSize:13,lineHeight:1.7,color:"var(--t2)",whiteSpace:"pre-wrap",maxHeight:360,overflowY:"auto"}}>{p.toolResult}</div>
            </div>
          )}
          <div style={{padding:20,fontSize:14,lineHeight:1.8,color:"var(--t2)"}} dangerouslySetInnerHTML={{__html:"<style>"+astyle+"</style><div class='ax'>"+md2h(p.result)+"</div>"}}/>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BATTLE PAGE
// ═══════════════════════════════════════════════════════════════════
function BattlePage(p){
  if(!p.authUser){
    return <div style={{padding:"80px 20px",textAlign:"center"}}>
      <div style={{fontSize:15,color:"var(--t2)",marginBottom:14}}>{p.rtl?"سجّل الدخول":"Log in to continue"}</div>
      <Btn size="lg" onClick={function(){p.setAuthInitial("signup");p.setModal("signup")}}>{p.rtl?"حساب مجاني":"Create Free Account"}</Btn>
    </div>;
  }
  return (
    <div style={{maxWidth:820,margin:"0 auto",padding:"20px 16px 40px"}}>
      <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:22,fontWeight:900,marginBottom:6}}>{p.rtl?"معركة المقالات":"Article Battle"}</h2>
      <p style={{fontSize:13,color:"var(--t2)",marginBottom:16}}>{p.rtl?"قارن مقالين وجهاً لوجه":"Compare two articles head-to-head"} ({COSTS.battle}C)</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        <div><label style={{fontSize:11,fontWeight:700,color:"var(--pr)",marginBottom:6,display:"block"}}>{p.rtl?"المقال A":"Article A"}</label><textarea value={p.bat1} onChange={function(e){p.setBat1(e.target.value)}} placeholder={p.rtl?"الصق المقال هنا...":"Paste content here..."} style={{width:"100%",height:180,padding:12,background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:9,color:"var(--tx)",fontFamily:"inherit",fontSize:12,outline:"none",resize:"vertical"}}/></div>
        <div><label style={{fontSize:11,fontWeight:700,color:"var(--er)",marginBottom:6,display:"block"}}>{p.rtl?"المقال B":"Article B"}</label><textarea value={p.bat2} onChange={function(e){p.setBat2(e.target.value)}} placeholder={p.rtl?"الصق المقال هنا...":"Paste content here..."} style={{width:"100%",height:180,padding:12,background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:9,color:"var(--tx)",fontFamily:"inherit",fontSize:12,outline:"none",resize:"vertical"}}/></div>
      </div>
      <Btn full size="lg" disabled={p.batLoading||!p.bat1.trim()||!p.bat2.trim()} onClick={p.doBattle} style={{background:"linear-gradient(135deg,var(--er),var(--pr))"}}>{p.batLoading?"...":p.rtl?"ابدأ المعركة":"START BATTLE"}</Btn>
      {p.batResult && <Card style={{marginTop:14,whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.7,color:"var(--t2)"}}>{p.batResult}</Card>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CREDITS PAGE
// ═══════════════════════════════════════════════════════════════════
function CreditsPage(p){
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 40px"}}>
      <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:24,fontWeight:900,marginBottom:6}}>{p.rtl?"الكريديت":"Credits"}</h2>
      <p style={{fontSize:13,color:"var(--t2)",marginBottom:18}}>{p.rtl?"اشحن لتواصل الإبداع":"Top up to keep creating"}</p>
      <div style={{background:"linear-gradient(135deg,var(--pr),var(--p2))",borderRadius:16,padding:"30px 24px",marginBottom:20,color:"#fff",textAlign:"center"}}>
        <div style={{fontSize:13,opacity:.88}}>{p.rtl?"رصيدك":"Your Balance"}</div>
        <div style={{fontSize:48,fontWeight:900}}>C {p.credits}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        {PACKS.map(function(pk){return (
          <div key={pk.credits} style={{background:"var(--cd)",border:pk.best?"2px solid var(--pr)":"1px solid var(--bd)",borderRadius:14,padding:"26px 18px",textAlign:"center",position:"relative"}}>
            {pk.best && <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"var(--pr)",color:"#fff",padding:"4px 12px",borderRadius:99,fontSize:9,fontWeight:800}}>{p.t("common.best")}</div>}
            <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>{pk.label}</div>
            <div style={{fontSize:32,fontWeight:900,color:"var(--pr)"}}>C {pk.credits}</div>
            <div style={{fontSize:24,fontWeight:800,marginBottom:4}}>${pk.price}</div>
            {pk.save && <div style={{fontSize:10,fontWeight:700,color:"var(--ok)",marginBottom:8}}>Save {pk.save}</div>}
            <Btn full variant={pk.best?"primary":"ghost"} onClick={function(){p.setPaymentData({type:"credits",price:pk.price,label:pk.credits+" Credits",credits:pk.credits});p.setModal("pay")}}>
              {p.rtl?"اشترِ":"Buy"} ${pk.price}
            </Btn>
          </div>
        )})}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════════════════════════════
function PricingPage(p){
  return (
    <div style={{padding:"20px 16px 40px"}}>
      <div style={{maxWidth:1050,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(24px,4vw,36px)",fontWeight:900,marginBottom:8}}>{p.rtl?"الباقات":"Plans & Pricing"}</h2>
          <p style={{fontSize:14,color:"var(--t2)"}}>{p.rtl?"اختر الخطة التي تناسبك":"Choose the plan that fits you"}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
          {Object.keys(PLANS).map(function(k){
            var D = PLANS[k];
            return (
              <div key={k} style={{background:"var(--cd)",border:D.pop?"2px solid var(--pr)":"1px solid var(--bd)",borderRadius:14,padding:"26px 20px",position:"relative"}}>
                {D.pop && <div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:"var(--pr)",color:"#fff",padding:"4px 12px",borderRadius:99,fontSize:9,fontWeight:800}}>{p.t("common.popular")}</div>}
                {p.plan===k && <div style={{position:"absolute",top:8,insetInlineEnd:8,padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,background:"var(--ok)",color:"#fff"}}>{p.t("common.current")}</div>}
                <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{D.n}</div>
                <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:36,fontWeight:900}}>${D.pr}<span style={{fontSize:13,color:"var(--t3)",fontWeight:500}}>{D.pr>0?(p.rtl?"/شهر":"/mo"):""}</span></div>
                <div style={{fontSize:15,fontWeight:700,color:"var(--pr)",margin:"8px 0 14px"}}>C {D.cr} / mo</div>
                <ul style={{listStyle:"none",marginBottom:16}}>
                  {D.f.map(function(f,i){return <li key={i} style={{fontSize:11,color:"var(--t2)",marginBottom:6}}>+ {f}</li>})}
                </ul>
                <Btn full variant={D.pop?"primary":"ghost"} onClick={function(){
                  if(p.plan===k||k==="free"){p.go("writer")}
                  else{p.setPaymentData({type:"plan",planKey:k,price:D.pr,label:D.n+" Plan",credits:D.cr});p.setModal("pay")}
                }}>
                  {p.plan===k?p.t("common.current"):k==="free"?(p.rtl?"ابدأ مجاناً":"Start Free"):(p.rtl?"ترقية":"Upgrade Now")}
                </Btn>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════
function ProfilePage(p){
  var tabs = [
    {id:"stats",l:p.rtl?"الإحصائيات":"Stats"},
    {id:"levels",l:p.rtl?"المستويات":"Levels"},
    {id:"badges",l:p.rtl?"الشارات":"Badges"},
    {id:"articles",l:p.rtl?"مقالاتي":"My Articles"},
    {id:"settings",l:p.rtl?"الإعدادات":"Settings"}
  ];
  var pct = p.nextLevel ? Math.round((p.xp - p.level.xp) / (p.nextLevel.xp - p.level.xp) * 100) : 100;

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 40px"}}>
      {/* Header card */}
      <Card style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--pr),var(--p2))",display:"grid",placeItems:"center",color:"#fff",fontWeight:900,fontSize:24,flexShrink:0}}>
            {p.profile.name?p.profile.name[0].toUpperCase():"U"}
          </div>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:20,fontWeight:900,marginBottom:2}}>{p.profile.name}</div>
            <div style={{fontSize:11,color:"var(--t3)",wordBreak:"break-all",marginBottom:4}}>{p.profile.email}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <span style={{padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,background:"var(--pS)",color:"var(--pr)"}}>{p.level.n}</span>
              <span style={{padding:"2px 8px",borderRadius:99,fontSize:9,fontWeight:700,background:"var(--b3)",color:"var(--t2)"}}>{p.profile.plan.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",padding:"2px 0"}}>
        {tabs.map(function(tb){
          var active = p.profileTab===tb.id;
          return <button key={tb.id} onClick={function(){p.setProfileTab(tb.id)}} style={{padding:"8px 14px",background:active?"var(--pr)":"var(--cd)",color:active?"#fff":"var(--t2)",border:"1px solid "+(active?"var(--pr)":"var(--bd)"),borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{tb.l}</button>;
        })}
      </div>

      {/* STATS */}
      {p.profileTab==="stats" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:14}}>
            {[
              {v:p.articles.length,l:p.rtl?"مقالات":"Articles"},
              {v:p.totalWords.toLocaleString(),l:p.rtl?"كلمات":"Words"},
              {v:p.streak,l:p.rtl?"سلسلة":"Streak"},
              {v:p.xp,l:"XP"},
              {v:p.credits,l:p.rtl?"رصيد":"Credits"},
              {v:p.earnedBadges.length,l:p.rtl?"شارات":"Badges"}
            ].map(function(s,i){return (
              <Card key={i} style={{textAlign:"center",padding:14}}>
                <div style={{fontSize:22,fontWeight:900,color:"var(--pr)",fontFamily:"Source Serif 4,Georgia,serif"}}>{s.v}</div>
                <div style={{fontSize:10,color:"var(--t3)",marginTop:3,textTransform:"uppercase",letterSpacing:1,fontWeight:600}}>{s.l}</div>
              </Card>
            )})}
          </div>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:12,fontWeight:700}}>{p.level.n}</div>
              {p.nextLevel && <div style={{fontSize:11,color:"var(--t3)"}}>Next: {p.nextLevel.n}</div>}
            </div>
            <div style={{height:10,background:"var(--b3)",borderRadius:99,overflow:"hidden"}}>
              <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,var(--pr),var(--p2))",transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:6,textAlign:"center"}}>
              {p.nextLevel?(p.nextLevel.xp-p.xp)+" XP to "+p.nextLevel.n:(p.rtl?"وصلت للقمة!":"Max level reached!")}
            </div>
          </Card>
        </div>
      )}

      {/* LEVELS */}
      {p.profileTab==="levels" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
          {LEVELS.map(function(lv){
            var reached = p.xp >= lv.xp;
            var current = p.level.lv === lv.lv;
            return (
              <Card key={lv.lv} style={{textAlign:"center",opacity:reached?1:.5,border:current?"2px solid var(--pr)":"1px solid var(--bd)"}}>
                <div style={{fontSize:22,fontWeight:900,color:reached?"var(--pr)":"var(--t3)",fontFamily:"Source Serif 4,Georgia,serif"}}>Lv {lv.lv}</div>
                <div style={{fontSize:13,fontWeight:700,marginTop:2}}>{lv.n}</div>
                <div style={{fontSize:10,color:"var(--t3)",marginTop:6}}>{lv.xp} XP</div>
                <div style={{fontSize:10,color:"var(--t2)",marginTop:8,lineHeight:1.5}}>{lv.goal}</div>
                <div style={{fontSize:10,color:"var(--ok)",marginTop:6,fontWeight:700}}>{lv.reward}</div>
              </Card>
            );
          })}
        </div>
      )}

      {/* BADGES */}
      {p.profileTab==="badges" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
          {BADGES.map(function(bd){
            var earned = p.earnedBadges.some(function(e){return e.id===bd.id});
            return (
              <Card key={bd.id} style={{textAlign:"center",opacity:earned?1:.45}}>
                <div style={{width:48,height:48,borderRadius:"50%",background:earned?"linear-gradient(135deg,var(--wr),#EF7B6C)":"var(--b3)",color:"#fff",margin:"0 auto 8px",display:"grid",placeItems:"center",fontSize:12,fontWeight:900}}>{bd.ic}</div>
                <div style={{fontSize:12,fontWeight:700}}>{bd.n}</div>
                <div style={{fontSize:10,color:earned?"var(--ok)":"var(--t3)",marginTop:4,fontWeight:700}}>{earned?(p.rtl?"مُحقَّقة":"Earned"):(p.rtl?"مُقفلة":"Locked")}</div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ARTICLES */}
      {p.profileTab==="articles" && (
        <div>
          {p.articles.length===0 ? (
            <Card style={{textAlign:"center",padding:40}}>
              <div style={{fontSize:14,color:"var(--t2)"}}>{p.rtl?"لا مقالات بعد":"No articles yet"}</div>
            </Card>
          ) : p.selArt ? (
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div style={{fontSize:15,fontWeight:800,flex:1}}>{p.selArt.topic}</div>
                <div style={{display:"flex",gap:4}}>
                  <SmallBtn onClick={function(){navigator.clipboard.writeText(p.selArt.content)}}>Copy</SmallBtn>
                  <SmallBtn onClick={function(){exPDF(p.selArt.content,p.selArt.topic)}}>PDF</SmallBtn>
                  <SmallBtn onClick={function(){p.setSelArt(null)}}>X</SmallBtn>
                </div>
              </div>
              <div style={{fontSize:10,color:"var(--t3)",marginBottom:12}}>{p.selArt.date} · {p.selArt.words} words · {p.selArt.lang}</div>
              <div style={{fontSize:13,lineHeight:1.8,color:"var(--t2)",maxHeight:400,overflowY:"auto"}} dangerouslySetInnerHTML={{__html:"<style>"+astyle+"</style><div class='ax'>"+md2h(p.selArt.content)+"</div>"}}/>
            </Card>
          ) : (
            <div style={{display:"grid",gap:8}}>
              {p.articles.map(function(a){
                return (
                  <Card key={a.id} style={{padding:14,cursor:"pointer"}}>
                    <div onClick={function(){p.setSelArt(a)}}>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{a.topic}</div>
                      <div style={{fontSize:10,color:"var(--t3)"}}>{a.date} · {a.words} words · {a.lang}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      {p.profileTab==="settings" && (
        <ProfileSettings profile={p.profile} rtl={p.rtl} saveProfileSettings={p.saveProfileSettings} handleDeleteAccount={p.handleDeleteAccount}/>
      )}
    </div>
  );
}
function ProfileSettings(p){
  var [name, setName] = useState(p.profile.name || "");
  var [gender, setGender] = useState(p.profile.gender || "neutral");

  function save(){
    p.saveProfileSettings({ name: name, gender: gender });
  }

  return (
    <Card>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الاسم":"Name"}</label>
        <input value={name} onChange={function(e){setName(e.target.value)}} style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الجنس":"Gender"}</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          {[["male",p.rtl?"ذكر":"Male"],["female",p.rtl?"أنثى":"Female"],["neutral",p.rtl?"محايد":"Neutral"]].map(function(g){
            var active = gender===g[0];
            return <button key={g[0]} type="button" onClick={function(){setGender(g[0])}} style={{padding:10,background:active?"var(--pr)":"var(--bg)",border:"1.5px solid "+(active?"var(--pr)":"var(--bd)"),borderRadius:8,color:active?"#fff":"var(--t2)",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>{g[1]}</button>;
          })}
        </div>
      </div>
      <div style={{marginBottom:18}}>
        <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"البريد":"Email"}</label>
        <input value={p.profile.email} disabled style={{width:"100%",padding:"10px 13px",background:"var(--b3)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--t3)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
      </div>
      <Btn full onClick={save}>{p.rtl?"حفظ":"Save Changes"}</Btn>
      <div style={{height:1,background:"var(--bd)",margin:"20px 0"}}/>
      <div style={{fontSize:11,color:"var(--er)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{p.rtl?"منطقة الخطر":"Danger Zone"}</div>
      <Btn full variant="danger" onClick={p.handleDeleteAccount}>{p.rtl?"حذف الحساب":"Delete Account"}</Btn>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════
// WRITERS DIRECTORY
// ═══════════════════════════════════════════════════════════════════
function WritersPage(p){
  var locked = p.plan!=="pro" && p.plan!=="agency";

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 40px",position:"relative"}}>
      <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:22,fontWeight:900,marginBottom:6}}>{p.rtl?"دليل الكتاب":"Writers Directory"}</h2>
      <p style={{fontSize:13,color:"var(--t2)",marginBottom:18}}>{p.rtl?"تواصل مع أفضل صناع المحتوى":"Connect with top content creators"}</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,filter:locked?"blur(4px)":"none",pointerEvents:locked?"none":"auto"}}>
        {DEMO_WRITERS.map(function(w){
          return (
            <Card key={w.id}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <div style={{width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,var(--pr),var(--p2))",color:"#fff",display:"grid",placeItems:"center",fontWeight:900,fontSize:15,flexShrink:0}}>{w.name[0]}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:800}}>{w.name}</div>
                  <div style={{fontSize:10,color:"var(--pr)",fontWeight:600}}>{w.specialty}</div>
                </div>
              </div>
              <p style={{fontSize:11,color:"var(--t2)",lineHeight:1.6,marginBottom:10}}>{w.bio}</p>
              <SmallBtn>{p.rtl?"تواصل":"Contact"}</SmallBtn>
            </Card>
          );
        })}
      </div>

      {locked && (
        <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",padding:20}}>
          <Card style={{textAlign:"center",maxWidth:380,padding:28}}>
            <div style={{fontSize:40,marginBottom:10,color:"var(--pr)",fontWeight:900,fontFamily:"Source Serif 4,Georgia,serif"}}>PRO</div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:6}}>{p.rtl?"مُتاح للباقات المدفوعة":"Available on Pro & Agency"}</div>
            <p style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>{p.rtl?"ترقية للوصول للكتاب المحترفين":"Upgrade to unlock access to verified pro writers"}</p>
            <Btn full onClick={function(){p.go("pricing")}}>{p.rtl?"شاهد الباقات":"View Plans"}</Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════════════════════
function ContactPage(p){
  if(p.contactSent){
    return (
      <div style={{maxWidth:500,margin:"60px auto",padding:"20px 16px",textAlign:"center"}}>
        <Card style={{padding:40}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:8,color:"var(--ok)"}}>{p.rtl?"تم الإرسال بنجاح":"Message Sent"}</div>
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:18,lineHeight:1.6}}>{p.rtl?"شكراً لتواصلك. سنرد قريباً.":"Thanks for reaching out. We'll respond shortly."}</p>
          <Btn onClick={function(){p.setContactSent(false)}}>{p.rtl?"إرسال رسالة أخرى":"Send Another"}</Btn>
        </Card>
      </div>
    );
  }
  return (
    <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 40px"}}>
      <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:22,fontWeight:900,marginBottom:6}}>{p.rtl?"تواصل معنا":"Contact Us"}</h2>
      <p style={{fontSize:13,color:"var(--t2)",marginBottom:18}}>{p.rtl?"نحب أن نسمع منك":"We'd love to hear from you"}</p>

      <Card>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"نوع الرسالة":"Message Type"}</label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:5}}>
            {CONTACT_TYPES.map(function(ct){
              var active = p.contactType===ct.id;
              return <button key={ct.id} type="button" onClick={function(){p.setContactType(ct.id)}} style={{padding:"8px 6px",background:active?"var(--pr)":"var(--bg)",border:"1.5px solid "+(active?"var(--pr)":"var(--bd)"),borderRadius:7,color:active?"#fff":"var(--t2)",cursor:"pointer",fontFamily:"inherit",fontSize:10,fontWeight:600}}>{p.rtl?ct.n.ar:ct.n.en}</button>;
            })}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الموضوع":"Subject"}</label>
          <input value={p.contactSubject} onChange={function(e){p.setContactSubject(e.target.value)}} maxLength={120} style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:6}}>{p.rtl?"الرسالة":"Message"}</label>
          <textarea value={p.contactMsg} onChange={function(e){p.setContactMsg(e.target.value)}} maxLength={2000} placeholder={p.rtl?"اكتب رسالتك...":"Write your message..."} style={{width:"100%",height:140,padding:12,background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none",resize:"vertical"}}/>
          <div style={{fontSize:10,color:"var(--t3)",textAlign:"end",marginTop:4}}>{p.contactMsg.length}/2000</div>
        </div>

        <Btn full onClick={p.handleSendContact}>{p.rtl?"إرسال الرسالة":"Send Message"}</Btn>
      </Card>
    </div>
  );
}
// ═══════════════════════════════════════════════════════════════════
// LEGAL PAGE (Terms + Privacy)
// ═══════════════════════════════════════════════════════════════════
function LegalPage(p){
  var isTerms = p.type === "terms";
  var content = isTerms ? (p.rtl ? [
    {h:"1. قبول الشروط",b:"باستخدامك Oxquill، فإنك توافق على هذه الشروط."},
    {h:"2. الخدمة",b:"نقدم أدوات كتابة مدعومة بالذكاء الاصطناعي."},
    {h:"3. الاشتراك والمدفوعات",b:"يتم التحصيل شهرياً. يمكنك الإلغاء في أي وقت."},
    {h:"4. الاسترداد",b:"ضمان استرداد 14 يوماً للباقات المدفوعة."},
    {h:"5. الملكية",b:"تمتلك 100 بالمئة من المحتوى الذي تنشئه."},
    {h:"6. الاستخدام المقبول",b:"ممنوع إنشاء محتوى غير قانوني أو ضار."},
    {h:"7. إنهاء الحساب",b:"نحتفظ بالحق في تعليق الحسابات المخالفة."},
    {h:"8. التعديلات",b:"قد نحدّث هذه الشروط بإشعار مسبق."}
  ] : [
    {h:"1. Acceptance",b:"By using Oxquill, you agree to these terms."},
    {h:"2. The Service",b:"We provide AI-powered writing tools."},
    {h:"3. Subscription and Payments",b:"Billed monthly. Cancel anytime."},
    {h:"4. Refunds",b:"14-day money-back guarantee on paid plans."},
    {h:"5. Ownership",b:"You own 100% of the content you generate."},
    {h:"6. Acceptable Use",b:"No illegal or harmful content generation."},
    {h:"7. Termination",b:"We reserve the right to suspend violating accounts."},
    {h:"8. Changes",b:"We may update these terms with prior notice."}
  ]) : (p.rtl ? [
    {h:"1. البيانات التي نجمعها",b:"البريد الإلكتروني، الاسم، والمقالات التي تنشئها."},
    {h:"2. كيف نستخدمها",b:"لتقديم الخدمة وإرسال التحديثات المهمة."},
    {h:"3. مشاركة البيانات",b:"لا نبيع بياناتك أبداً. نستخدم مزودي خدمة موثوقين فقط."},
    {h:"4. المحتوى الخاص بك",b:"محتواك ملكك. لا نستخدمه لتدريب نماذجنا."},
    {h:"5. الأمان",b:"تشفير، مصادقة، وحماية RLS على مستوى قاعدة البيانات."},
    {h:"6. ملفات تعريف الارتباط",b:"نستخدم cookies ضرورية للمصادقة فقط."},
    {h:"7. حقوقك",b:"يمكنك طلب بياناتك، تصديرها، أو حذفها في أي وقت."},
    {h:"8. الاتصال",b:"privacy@oxquill.com للاستفسارات."}
  ] : [
    {h:"1. Data We Collect",b:"Email, name, and articles you create."},
    {h:"2. How We Use It",b:"To provide the service and send essential updates."},
    {h:"3. Data Sharing",b:"We never sell your data. We use trusted service providers only."},
    {h:"4. Your Content",b:"Your content is yours. We don't use it to train our models."},
    {h:"5. Security",b:"Encryption, authentication, and RLS database-level protection."},
    {h:"6. Cookies",b:"We use essential cookies for authentication only."},
    {h:"7. Your Rights",b:"You can request, export, or delete your data anytime."},
    {h:"8. Contact",b:"privacy@oxquill.com for inquiries."}
  ]);

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"20px 16px 40px"}}>
      <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:26,fontWeight:900,marginBottom:6}}>{isTerms?(p.rtl?"شروط الاستخدام":"Terms of Service"):(p.rtl?"سياسة الخصوصية":"Privacy Policy")}</h2>
      <div style={{fontSize:11,color:"var(--t3)",marginBottom:18}}>{p.rtl?"آخر تحديث":"Last updated"}: April 2026</div>
      <Card>
        {content.map(function(s,i){
          return (
            <div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:i<content.length-1?"1px solid var(--bd)":"none"}}>
              <div style={{fontSize:14,fontWeight:800,marginBottom:6,color:"var(--pr)"}}>{s.h}</div>
              <div style={{fontSize:13,color:"var(--t2)",lineHeight:1.7}}>{s.b}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════
function AdminPage(p){
  var tabs = [
    {id:"dashboard",n:p.rtl?"لوحة التحكم":"Dashboard"},
    {id:"users",n:p.rtl?"المستخدمون":"Users"},
    {id:"admins",n:p.rtl?"المديرون":"Admins"},
    {id:"messages",n:p.rtl?"الرسائل":"Messages"}
  ];
  var filtered = p.allUsers.filter(function(u){
    if(!p.userSearch) return true;
    var q = p.userSearch.toLowerCase();
    return (u.email||"").toLowerCase().indexOf(q)>=0 || (u.name||"").toLowerCase().indexOf(q)>=0;
  });
  var totalUsers = p.allUsers.length;
  var blockedCount = p.allUsers.filter(function(u){return u.blocked}).length;
  var activeCount = totalUsers - blockedCount;
  var paidPlans = p.allUsers.filter(function(u){return u.plan && u.plan !== "free"}).length;
  var estRevenue = p.allUsers.reduce(function(s,u){
    if(u.plan==="starter") return s+19;
    if(u.plan==="pro") return s+49;
    if(u.plan==="agency") return s+99;
    return s;
  },0);

  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"20px 16px 40px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <h2 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:22,fontWeight:900}}>{p.rtl?"الإدارة":"Admin Panel"}</h2>
        <span style={{padding:"3px 10px",borderRadius:99,fontSize:9,fontWeight:700,background:"var(--wr)",color:"#fff"}}>ADMIN</span>
      </div>

      <div style={{display:"flex",gap:4,marginBottom:16,overflowX:"auto"}}>
        {tabs.map(function(tb){
          var active = p.adminTab===tb.id;
          return <button key={tb.id} onClick={function(){p.setAdminTab(tb.id)}} style={{padding:"8px 14px",background:active?"var(--pr)":"var(--b3)",color:active?"#fff":"var(--t2)",border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{tb.n}</button>;
        })}
      </div>

      {p.adminTab==="dashboard" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
          {[
            {l:p.rtl?"إجمالي المستخدمين":"Total Users",v:totalUsers,c:"var(--pr)"},
            {l:p.rtl?"نشط":"Active",v:activeCount,c:"var(--ok)"},
            {l:p.rtl?"محظور":"Blocked",v:blockedCount,c:"var(--er)"},
            {l:p.rtl?"باقات مدفوعة":"Paid Plans",v:paidPlans,c:"var(--p2)"},
            {l:p.rtl?"الإيرادات الشهرية":"Est. MRR",v:"$"+estRevenue,c:"var(--wr)"},
            {l:p.rtl?"إجمالي المقالات":"Articles",v:p.articles.length,c:"var(--pr)"}
          ].map(function(s,i){
            return (
              <Card key={i}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.l}</div>
                <div style={{fontSize:26,fontWeight:900,color:s.c,fontFamily:"Source Serif 4,Georgia,serif"}}>{s.v}</div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CLAUDE API USAGE - inside dashboard */}
      {p.adminTab==="dashboard" && (
        <Card style={{marginTop:14}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:12}}>{"\ud83e\udd16 "+p.t("admin.apiUsage")}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{background:"var(--b3)",borderRadius:10,padding:12}}>
              <div style={{color:"var(--t3)",fontSize:10}}>Monthly Tokens</div>
              <div style={{fontWeight:700,fontSize:16}}>0</div>
            </div>
            <div style={{background:"var(--b3)",borderRadius:10,padding:12}}>
              <div style={{color:"var(--t3)",fontSize:10}}>Est. Cost</div>
              <div style={{fontWeight:700,fontSize:16}}>$0.00</div>
            </div>
          </div>
          <div style={{background:p.apiBalance<2?"rgba(212,69,60,0.08)":p.apiBalance<5?"rgba(239,169,53,0.08)":"rgba(45,138,78,0.08)",borderRadius:10,padding:12,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <div style={{color:"var(--t3)",fontSize:10}}>Anthropic Balance</div>
              <div style={{fontWeight:800,fontSize:18,color:p.apiBalance<2?"var(--er)":p.apiBalance<5?"var(--wr)":"var(--ok)"}}>{"$"+p.apiBalance.toFixed(2)}</div>
            </div>
            {p.apiBalance<2 && <span style={{background:"var(--er)",color:"#fff",padding:"3px 8px",borderRadius:6,fontSize:10,fontWeight:700}}>{"\u26a0\ufe0f LOW!"}</span>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={p.balanceInput} onChange={function(e){p.setBalanceInput(e.target.value)}} placeholder="$" type="number" step="0.01" style={{flex:1,padding:8,borderRadius:8,border:"1px solid var(--bd)",background:"var(--cd)",color:"var(--tx)",fontSize:12,fontFamily:"inherit"}}/>
            <Btn onClick={function(){var v=parseFloat(p.balanceInput);if(!isNaN(v)&&v>=0){p.setApiBalance(v);p.setBalanceInput("");p.showToast(p.rtl?"\u062a\u0645 \u0627\u0644\u062a\u062d\u062f\u064a\u062b":"Updated")}}}>{p.rtl?"\u062a\u062d\u062f\u064a\u062b":"Update"}</Btn>
          </div>
        </Card>
      )}

      {p.adminTab==="users" && (
        <div>
          <input placeholder={p.rtl?"ابحث بالبريد أو الاسم...":"Search by email or name..."} value={p.userSearch} onChange={function(e){p.setUserSearch(e.target.value)}} style={{width:"100%",padding:"10px 13px",background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none",marginBottom:12}}/>
          <div style={{display:"grid",gap:6}}>
            {filtered.length===0 && <Card><div style={{textAlign:"center",padding:16,color:"var(--t3)",fontSize:12}}>{p.rtl?"لا توجد نتائج":"No results"}</div></Card>}
            {filtered.map(function(u){
              return (
                <div key={u.id} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:9,padding:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                      {u.name||"—"}
                      {u.is_admin && <span style={{padding:"1px 6px",borderRadius:99,fontSize:8,fontWeight:700,background:"var(--wr)",color:"#fff"}}>A</span>}
                      {u.blocked && <span style={{padding:"1px 6px",borderRadius:99,fontSize:8,fontWeight:700,background:"var(--er)",color:"#fff"}}>BLOCKED</span>}
                    </div>
                    <div style={{fontSize:11,color:"var(--t3)",wordBreak:"break-all"}}>{u.email}</div>
                    <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>{u.plan||"free"} · C {u.credits||0} · {u.xp||0} XP</div>
                  </div>
                  <button onClick={function(){p.toggleBlock(u.id,u.blocked)}} style={{padding:"6px 12px",background:u.blocked?"var(--ok)":"var(--er)",color:"#fff",border:"none",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    {u.blocked?(p.rtl?"فك الحظر":"Unblock"):(p.rtl?"حظر":"Block")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {p.adminTab==="admins" && (
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{p.rtl?"إضافة مدير":"Add Admin"}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <input placeholder="email@example.com" value={p.newAdminEmail} onChange={function(e){p.setNewAdminEmail(e.target.value)}} style={{flex:1,minWidth:180,padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none"}}/>
              <Btn onClick={function(){if(p.newAdminEmail.trim()){p.handleMakeAdmin(p.newAdminEmail.trim(),true);p.setNewAdminEmail("")}}}>{p.rtl?"إضافة":"Add"}</Btn>
            </div>
          </Card>
          <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{p.rtl?"المديرون الحاليون":"Current Admins"}</div>
          <div style={{display:"grid",gap:6}}>
            {p.allUsers.filter(function(u){return u.is_admin}).map(function(u){
              return (
                <div key={u.id} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:9,padding:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:160}}>
                    <div style={{fontSize:13,fontWeight:700}}>{u.name||"—"}</div>
                    <div style={{fontSize:11,color:"var(--t3)",wordBreak:"break-all"}}>{u.email}</div>
                  </div>
                  <button onClick={function(){p.handleMakeAdmin(u.email,false)}} style={{padding:"6px 12px",background:"var(--er)",color:"#fff",border:"none",borderRadius:7,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{p.rtl?"إزالة":"Remove"}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {p.adminTab==="messages" && (
        <Card>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:14}}>{p.rtl?"\ud83d\udce9 \u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0639\u0645\u0644\u0627\u0621":"\ud83d\udce9 Customer Messages"}</h3>
          <p style={{fontSize:12,color:"var(--t3)",textAlign:"center",padding:20}}>{p.rtl?"\u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0645\u0646 \u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a":"Messages from contact form will appear here"}</p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ROAST PAGE (Standalone)
// ═══════════════════════════════════════════════════════════════════
function RoastPage(p){
  var levels = [{id:"gentle",e:"\ud83d\ude0f",n:"Gentle"},{id:"medium",e:"\ud83d\udd25",n:"Medium"},{id:"savage",e:"\ud83d\udc80",n:"Savage"}];
  return (
    <div style={{maxWidth:650,margin:"0 auto",padding:"30px 20px",textAlign:"center"}}>
      <div style={{fontSize:"3rem",marginBottom:8}}>\ud83d\udd25</div>
      <h1 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(24px,5vw,32px)",fontWeight:900,marginBottom:8}}>{p.t("roast.title")}</h1>
      <p style={{color:"var(--t2)",marginBottom:20}}>{p.t("roast.desc")} \ud83d\udd25</p>
      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
        {levels.map(function(lv){return <Chip key={lv.id} active={p.roastLevel===lv.id} onClick={function(){p.setRoastLevel(lv.id)}}>{lv.e+" "+lv.n}</Chip>})}
      </div>
      <textarea value={p.roastText} onChange={function(e){p.setRoastText(e.target.value)}} placeholder={p.rtl?"\u0627\u0644\u0635\u0642 \u0645\u0642\u0627\u0644\u0643 \u0647\u0646\u0627...":"Paste your article here..."} rows={8} style={{width:"100%",padding:16,borderRadius:12,border:"1px solid var(--bd)",background:"var(--cd)",color:"var(--tx)",fontSize:14,resize:"vertical",boxSizing:"border-box",direction:p.rtl?"rtl":"ltr",lineHeight:1.7,fontFamily:"inherit"}}/>
      <div style={{display:"flex",justifyContent:"space-between",margin:"8px 0 16px",fontSize:11,color:"var(--t3)"}}>
        <span>{(p.roastText||"").split(/\s+/).filter(Boolean).length} {p.rtl?"\u0643\u0644\u0645\u0629":"words"}</span>
        <span>{COSTS.roast} credits</span>
      </div>
      <Btn size="lg" full onClick={p.doRoast} disabled={p.roastLoading} style={{background:p.roastLoading?"var(--t3)":"linear-gradient(135deg,#EF4444,#F97316)"}}>{p.roastLoading?(p.rtl?"\ud83d\udd25 \u062c\u0627\u0631\u064a...":"\ud83d\udd25 Roasting..."):("\ud83d\udd25 "+p.t("roast.btn")+" ("+COSTS.roast+")")}</Btn>
      {p.roastResult && (
        <Card style={{marginTop:20,textAlign:"left"}}>
          <h3 style={{color:"#EF4444",fontWeight:700,marginBottom:12}}>{"\ud83d\udd25 "+p.t("roast.result")}</h3>
          <div className="ax" style={{lineHeight:1.8,direction:p.rtl?"rtl":"ltr"}} dangerouslySetInnerHTML={{__html:md2h(p.roastResult)}}/>
        </Card>
      )}
    </div>
  );
}

function PayModal(p){
  var [step,setStep] = useState("form");
  var [card,setCard] = useState("");
  var [exp,setExp] = useState("");
  var [cvc,setCvc] = useState("");

  function handlePay(){
    if(card.length<12||exp.length<4||cvc.length<3) return;
    setStep("processing");
    setTimeout(function(){
      setStep("success");
      setTimeout(function(){p.onSuccess()},1200);
    },1500);
  }

  return (
    <div onClick={p.onClose} style={{position:"fixed",inset:0,zIndex:9999,display:"grid",placeItems:"center",padding:16,direction:p.rtl?"rtl":"ltr"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)"}}/>
      <div onClick={function(e){e.stopPropagation()}} style={{position:"relative",width:"100%",maxWidth:380,background:"var(--cd)",borderRadius:16,padding:24,fontFamily:"Plus Jakarta Sans,system-ui,sans-serif"}}>
        {step==="form" && (
          <>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:20,fontWeight:900,marginBottom:4}}>{p.rtl?"إتمام الشراء":"Complete Purchase"}</div>
              <div style={{fontSize:12,color:"var(--t2)"}}>{p.data.label}</div>
              <div style={{fontSize:28,fontWeight:900,color:"var(--pr)",marginTop:8}}>${p.data.price}</div>
            </div>
            <label style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:5,display:"block"}}>{p.rtl?"رقم البطاقة":"Card Number"}</label>
            <input value={card} onChange={function(e){setCard(e.target.value.replace(/\D/g,"").slice(0,16))}} placeholder="1234 5678 9012 3456" style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none",marginBottom:10}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <div>
                <label style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:5,display:"block"}}>{p.rtl?"انتهاء":"Expiry"}</label>
                <input value={exp} onChange={function(e){setExp(e.target.value.replace(/\D/g,"").slice(0,4))}} placeholder="MMYY" style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
              </div>
              <div>
                <label style={{fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:5,display:"block"}}>CVC</label>
                <input value={cvc} onChange={function(e){setCvc(e.target.value.replace(/\D/g,"").slice(0,4))}} placeholder="123" style={{width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"}}/>
              </div>
            </div>
            <Btn full onClick={handlePay}>{p.rtl?"ادفع":"Pay"} ${p.data.price}</Btn>
            <div style={{fontSize:10,color:"var(--t3)",textAlign:"center",marginTop:10}}>{p.rtl?"محاكاة دفع — سنضيف LemonSqueezy قريباً":"Payment simulation — LemonSqueezy coming soon"}</div>
          </>
        )}
        {step==="processing" && (
          <div style={{textAlign:"center",padding:"30px 10px"}}>
            <div style={{width:50,height:50,border:"4px solid var(--b3)",borderTopColor:"var(--pr)",borderRadius:"50%",margin:"0 auto 14px",animation:"spin 1s linear infinite"}}/>
            <div style={{fontSize:14,fontWeight:700}}>{p.rtl?"جاري المعالجة...":"Processing..."}</div>
          </div>
        )}
        {step==="success" && (
          <div style={{textAlign:"center",padding:"30px 10px"}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:"var(--ok)",color:"#fff",display:"grid",placeItems:"center",margin:"0 auto 14px",fontSize:26,fontWeight:900}}>+</div>
            <div style={{fontSize:17,fontWeight:800,marginBottom:5}}>{p.rtl?"تم بنجاح!":"Success!"}</div>
            <div style={{fontSize:12,color:"var(--t2)"}}>{p.rtl?"جاري التحميل...":"Loading..."}</div>
          </div>
        )}
      </div>
    </div>
  );
}
