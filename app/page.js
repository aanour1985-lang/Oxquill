"use client";
import { useState, useEffect } from "react";

/* ══════════ THEME ══════════ */
var LT = { bg:"#F7F8FC",cd:"#FFFFFF",tx:"#1A1F36",t2:"#4A5070",t3:"#8C92AB",bd:"#E4E8F1",pr:"#5B6CF0",p2:"#9B7BF0" };
var DK = { bg:"#0F1018",cd:"#1A1B26",tx:"#E8E6F0",t2:"#A0A0B8",t3:"#6A6A82",bd:"#2A2B38",pr:"#7B8AF5",p2:"#B89FF5" };
var GR = "linear-gradient(135deg,#5B6CF0,#9B7BF0)";

/* ══════════ I18N — full AR/EN ══════════ */
var W = {
  brand:"OxQuill",
  home:{en:"Home",ar:"\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629"},
  writer:{en:"AI Writer",ar:"\u0643\u0627\u062a\u0628 AI"},
  roast:{en:"Roast",ar:"\u0627\u0644\u0646\u0642\u062f \u0627\u0644\u0643\u0648\u0645\u064a\u062f\u064a"},
  battle:{en:"Battle",ar:"\u0627\u0644\u0645\u0639\u0631\u0643\u0629"},
  writers:{en:"Writers",ar:"\u0627\u0644\u0643\u062a\u0651\u0627\u0628"},
  pricing:{en:"Pricing",ar:"\u0627\u0644\u0628\u0627\u0642\u0627\u062a"},
  credits:{en:"Credits",ar:"\u0627\u0644\u0643\u0631\u064a\u062f\u062a"},
  profile:{en:"Profile",ar:"\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a"},
  contact:{en:"Contact",ar:"\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627"},
  terms:{en:"Terms",ar:"\u0627\u0644\u0634\u0631\u0648\u0637"},
  privacy:{en:"Privacy",ar:"\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629"},
  admin:{en:"Admin",ar:"\u0627\u0644\u0625\u062f\u0627\u0631\u0629"},
  login:{en:"Login",ar:"\u062f\u062e\u0648\u0644"},
  logout:{en:"Logout",ar:"\u062e\u0631\u0648\u062c"},
  signup:{en:"Sign Up",ar:"\u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f"},
  services:{en:"Services",ar:"\u0627\u0644\u062e\u062f\u0645\u0627\u062a"},
  billing:{en:"Billing",ar:"\u0627\u0644\u0641\u0648\u0627\u062a\u064a\u0631"},
  support:{en:"Support",ar:"\u0627\u0644\u062f\u0639\u0645"},
  name:{en:"Name",ar:"\u0627\u0644\u0627\u0633\u0645"},
  email:{en:"Email",ar:"\u0627\u0644\u0628\u0631\u064a\u062f"},
  password:{en:"Password",ar:"\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631"},
  subject:{en:"Subject",ar:"\u0627\u0644\u0645\u0648\u0636\u0648\u0639"},
  message:{en:"Message",ar:"\u0627\u0644\u0631\u0633\u0627\u0644\u0629"},
  send:{en:"Send",ar:"\u0623\u0631\u0633\u0644"},
  copy:{en:"Copy",ar:"\u0646\u0633\u062e"},
  copied:{en:"Copied!",ar:"\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!"},
  result:{en:"Result",ar:"\u0627\u0644\u0646\u062a\u064a\u062c\u0629"},
  generate:{en:"Generate",ar:"\u062a\u0648\u0644\u064a\u062f"},
  topic:{en:"Enter topic...",ar:"\u0627\u0643\u062a\u0628 \u0627\u0644\u0645\u0648\u0636\u0648\u0639..."},
  paste:{en:"Paste content here...",ar:"\u0627\u0644\u0635\u0642 \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0647\u0646\u0627..."},
  nomoney:{en:"Not enough credits",ar:"\u0631\u0635\u064a\u062f\u0643 \u0645\u0634 \u0643\u0627\u0641\u064a"},
  loading:{en:"Generating...",ar:"\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0648\u0644\u064a\u062f..."},
  noArticles:{en:"No articles yet",ar:"\u0644\u0633\u0647 \u0645\u0627 \u0643\u062a\u0628\u062a \u0645\u0642\u0627\u0644\u0627\u062a"},
  soon:{en:"Coming soon!",ar:"\u0642\u0631\u064a\u0628\u0627\u064b!"},
  start:{en:"Start Writing Free",ar:"\u0627\u0628\u062f\u0623 \u0627\u0644\u0643\u062a\u0627\u0628\u0629 \u0645\u062c\u0627\u0646\u0627\u064b"},
  viewPlans:{en:"View Plans",ar:"\u0634\u0648\u0641 \u0627\u0644\u062e\u0637\u0637"},
  heroEN:"Every Writer Deserves a ",
  heroAR:"\u0643\u0644 \u0643\u0627\u062a\u0628 \u064a\u0633\u062a\u0627\u0647\u0644 ",
  heroW_EN:"Superbrain",
  heroW_AR:"\u0639\u0642\u0644 \u062e\u0627\u0631\u0642",
  heroEnd:{en:". Now You Have One.",ar:". \u062f\u0647 \u0639\u0642\u0644\u0643."},
  heroDesc:{en:"From first draft to published masterpiece \u2014 in minutes, not months. 28 languages. 31 eras. Your voice, amplified.",ar:"\u0645\u0646 \u0627\u0644\u0645\u0633\u0648\u062f\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0625\u0644\u0649 \u0627\u0644\u062a\u062d\u0641\u0629 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u0629 \u2014 \u0641\u064a \u062f\u0642\u0627\u0626\u0642\u060c \u0645\u0634 \u0634\u0647\u0648\u0631. 28 \u0644\u063a\u0629. 31 \u062d\u0642\u0628\u0629. \u0635\u0648\u062a\u0643\u060c \u0628\u0623\u0636\u0639\u0627\u0641 \u0642\u0648\u062a\u0647."},
  superTools:{en:"Superpowered Tools for Superpowered Writers",ar:"\u0623\u062f\u0648\u0627\u062a \u062e\u0627\u0631\u0642\u0629 \u0644\u0643\u062a\u0651\u0627\u0628 \u062e\u0627\u0631\u0642\u064a\u0646"},
  whatSay:{en:"What Our Writers Say",ar:"\u0645\u0627\u0630\u0627 \u064a\u0642\u0648\u0644 \u0643\u062a\u0651\u0627\u0628\u0646\u0627"},
  readyCTA:{en:"Ready to Write Content That Wows?",ar:"\u0645\u0633\u062a\u0639\u062f \u062a\u0643\u062a\u0628 \u0645\u062d\u062a\u0648\u0649 \u064a\u0628\u0647\u0631 \u0627\u0644\u0639\u0627\u0644\u0645\u061f"},
  freeCredits:{en:"10 free credits. No card needed.",ar:"10 \u0643\u0631\u064a\u062f\u062a\u0633 \u0645\u062c\u0627\u0646\u0627\u064b. \u0644\u0627 \u0628\u0637\u0627\u0642\u0629."},
  startNow:{en:"Get Started Now",ar:"\u0627\u0628\u062f\u0623 \u062f\u0644\u0648\u0642\u062a\u064a"},
  language:{en:"Language",ar:"\u0627\u0644\u0644\u063a\u0629"},
  mood:{en:"Mood",ar:"\u0627\u0644\u0646\u0628\u0631\u0629"},
  timeMachine:{en:"Time Machine",ar:"\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646"},
  words:{en:"Words",ar:"\u0643\u0644\u0645\u0627\u062a"},
  gender:{en:"Gender",ar:"\u0627\u0644\u062c\u0646\u0633"},
  neutral:{en:"Neutral",ar:"\u0645\u062d\u0627\u064a\u062f"},
  male:{en:"Male",ar:"\u0630\u0643\u0631"},
  female:{en:"Female",ar:"\u0623\u0646\u062b\u0649"},
  roastTitle:{en:"The Article Roaster",ar:"\u0645\u062d\u0645\u0635\u0629 \u0627\u0644\u0645\u0642\u0627\u0644\u0627\u062a"},
  roastDesc:{en:"Drop your article and face the brutal truth",ar:"\u0627\u0631\u0645\u064a \u0645\u0642\u0627\u0644\u0643 \u0648\u0634\u0648\u0641 \u0627\u0644\u062d\u0642\u064a\u0642\u0629"},
  roastBtn:{en:"Roast My Article!",ar:"\u062d\u0645\u0651\u0635 \u0645\u0642\u0627\u0644\u064a!"},
  roastResult:{en:"Roast Results",ar:"\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u062a\u062d\u0645\u064a\u0635"},
  battleTitle:{en:"Battle Arena",ar:"\u0633\u0627\u062d\u0629 \u0627\u0644\u0645\u0639\u0631\u0643\u0629"},
  battleDesc:{en:"Pit two topics against each other!",ar:"\u062d\u0637 \u0645\u0648\u0636\u0648\u0639\u064a\u0646 \u0648\u0634\u0648\u0641 \u0645\u064a\u0646 \u064a\u0643\u0633\u0628!"},
  battleBtn:{en:"Start Battle!",ar:"\u0627\u0628\u062f\u0623 \u0627\u0644\u0645\u0639\u0631\u0643\u0629!"},
  sideA:{en:"Side A...",ar:"\u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u0623\u0648\u0644..."},
  sideB:{en:"Side B...",ar:"\u0627\u0644\u0637\u0631\u0641 \u0627\u0644\u062b\u0627\u0646\u064a..."},
  myInfo:{en:"My Info",ar:"\u0645\u0639\u0644\u0648\u0645\u0627\u062a\u064a"},
  myArticles:{en:"My Articles",ar:"\u0645\u0642\u0627\u0644\u0627\u062a\u064a"},
  levels:{en:"Levels",ar:"\u0627\u0644\u0645\u0633\u062a\u0648\u064a\u0627\u062a"},
  settings:{en:"Settings",ar:"\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a"},
  balance:{en:"Current Balance",ar:"\u0631\u0635\u064a\u062f\u0643 \u0627\u0644\u062d\u0627\u0644\u064a"},
  buyCredits:{en:"Buy Credits",ar:"\u0627\u0634\u062a\u0631\u064a \u0643\u0631\u064a\u062f\u062a"},
  toolCosts:{en:"Tool Costs",ar:"\u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0623\u062f\u0648\u0627\u062a"},
  creditPacks:{en:"Credit Packs",ar:"\u0628\u0627\u0642\u0627\u062a \u0627\u0644\u0643\u0631\u064a\u062f\u062a"},
  choosePlan:{en:"Choose Your Plan",ar:"\u0627\u062e\u062a\u0631 \u062e\u0637\u062a\u0643"},
  subscribe:{en:"Subscribe",ar:"\u0627\u0634\u062a\u0631\u0643"},
  startFree:{en:"Start Free",ar:"\u0627\u0628\u062f\u0623 \u0645\u062c\u0627\u0646\u0627\u064b"},
  popular:{en:"Popular",ar:"\u0627\u0644\u0623\u0634\u0647\u0631"},
  bestVal:{en:"Best Value",ar:"\u0627\u0644\u0623\u0641\u0636\u0644"},
  free:{en:"Free",ar:"\u0645\u062c\u0627\u0646\u064a"},
  month:{en:"month",ar:"\u0634\u0647\u0631"},
  writersDir:{en:"Writers Directory",ar:"\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0651\u0627\u0628"},
  searchWriters:{en:"Search writers...",ar:"\u0627\u0628\u062d\u062b \u0639\u0646 \u0643\u0627\u062a\u0628..."},
  articles:{en:"articles",ar:"\u0645\u0642\u0627\u0644"},
  dashboard:{en:"Dashboard",ar:"\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645"},
  users:{en:"Users",ar:"\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646"},
  admins:{en:"Admins",ar:"\u0627\u0644\u0623\u062f\u0645\u0646\u0632"},
  messages:{en:"Messages",ar:"\u0627\u0644\u0631\u0633\u0627\u0626\u0644"},
  termsTitle:{en:"Terms of Service",ar:"\u0634\u0631\u0648\u0637 \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645"},
  privacyTitle:{en:"Privacy Policy",ar:"\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629"},
  noUsers:{en:"No users yet",ar:"\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646"},
  noMsgs:{en:"No messages yet",ar:"\u0644\u0627 \u064a\u0648\u062c\u062f \u0631\u0633\u0627\u0626\u0644"},
  msgSent:{en:"Message sent!",ar:"\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062a\u0643!"},
  deleted:{en:"Article deleted",ar:"\u062a\u0645 \u062d\u0630\u0641 \u0627\u0644\u0645\u0642\u0627\u0644"},
  loggedOut:{en:"Logged out",ar:"\u062a\u0645 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c"},
  fillAll:{en:"Fill all fields",ar:"\u0627\u0643\u062a\u0628 \u0643\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a"},
  checkEmail:{en:"Done! Check email",ar:"\u062a\u0645! \u0623\u0643\u062f \u0628\u0631\u064a\u062f\u0643"},
  createAcc:{en:"Create account",ar:"\u0633\u062c\u0651\u0644 \u062d\u0633\u0627\u0628 \u062c\u062f\u064a\u062f"},
  haveAcc:{en:"Have account? Login",ar:"\u0639\u0646\u062f\u0643 \u062d\u0633\u0627\u0628\u061f \u0627\u062f\u062e\u0644"},
  update:{en:"Update",ar:"\u062a\u062d\u062f\u064a\u062b"},
  markRead:{en:"Mark Read",ar:"\u062a\u0645 \u0627\u0644\u0642\u0631\u0627\u0621\u0629"},
  superwriter:{en:"AI Superwriter",ar:"\u0643\u0627\u062a\u0628 AI \u0627\u0644\u062e\u0627\u0631\u0642"},
};

/* ══════════ STATIC DATA ══════════ */
var TOOLS = [
  {id:"generate",ic:"\u270d\ufe0f",c:5},{id:"roast",ic:"\ud83d\udd25",c:2},{id:"viral",ic:"\ud83d\udcca",c:2},
  {id:"remix",ic:"\ud83d\udd04",c:3},{id:"debate",ic:"\ud83d\udcac",c:6},{id:"summary",ic:"\ud83d\udcdd",c:1},
  {id:"titles",ic:"\ud83d\udca1",c:1},{id:"thread",ic:"\ud83e\uddf5",c:2},{id:"linkedin",ic:"\ud83d\udcbc",c:2},
  {id:"repurpose",ic:"\u267b\ufe0f",c:5}
];
var LANGS=["English","Arabic","Spanish","French","German","Italian","Portuguese","Russian","Chinese","Japanese","Korean","Hindi","Turkish","Dutch","Swedish","Polish","Czech","Greek","Hebrew","Thai","Vietnamese","Indonesian","Malay","Filipino","Swahili","Persian","Urdu","Bengali"];
var MOODS=["Professional","Casual","Academic","Creative","Humorous","Inspirational"];
var ERAS=[];(function(){for(var y=1900;y<=1945;y+=5)ERAS.push(String(y));for(var y2=1950;y2<=2020;y2+=5)ERAS.push(String(y2));ERAS.push("2024","2025","2030","2035","2040","2050");})();
var PLANS=[
  {id:"free",n:"Free",pr:0,cr:10,wm:true,cc:false,cs:false,f:["10 credits/mo","800 words","5 languages","Watermark"]},
  {id:"starter",n:"Starter",pr:19,cr:100,wm:false,cc:true,cs:true,f:["100 credits/mo","2000 words","28 languages","No watermark","Copy & Share"]},
  {id:"pro",n:"Pro",pr:49,cr:500,wm:false,cc:true,cs:true,pop:true,f:["500 credits/mo","5000 words","All tools","Writers Dir","Priority support"]},
  {id:"agency",n:"Agency",pr:99,cr:2000,wm:false,cc:true,cs:true,f:["2000 credits/mo","Unlimited","API access","White label","Team seats"]}
];
var PACKS=[{cr:10,pr:5,l:"Starter"},{cr:50,pr:20,l:"Writer"},{cr:200,pr:60,l:"Pro",best:true},{cr:500,pr:120,l:"Agency"}];
var TESTI=[
  {n:"Amira K.",r:"Content Creator",t:"Oxquill cut my writing time by 70%!",tA:"Oxquill \u0642\u0644\u0644 \u0648\u0642\u062a \u0627\u0644\u0643\u062a\u0627\u0628\u0629 70%!"},
  {n:"James W.",r:"SaaS Founder",t:"Battle helped me pick winning headlines.",tA:"\u0627\u0644\u0645\u0639\u0631\u0643\u0629 \u0633\u0627\u0639\u062f\u062a\u0646\u064a \u0623\u062e\u062a\u0627\u0631 \u0639\u0646\u0627\u0648\u064a\u0646 \u0631\u0627\u0628\u062d\u0629."},
  {n:"Fatima S.",r:"Marketing Manager",t:"28 languages and nails Arabic grammar!",tA:"28 \u0644\u063a\u0629 \u0648\u0628\u064a\u062a\u0642\u0646 \u0627\u0644\u0639\u0631\u0628\u064a\u0629!"}
];
var FEATS=[
  {ic:"\u270d\ufe0f",en:"AI Writer",ar:"\u0643\u0627\u062a\u0628 AI",go:"writer"},
  {ic:"\ud83d\udd25",en:"Roast",ar:"\u0627\u0644\u0646\u0642\u062f \u0627\u0644\u0643\u0648\u0645\u064a\u062f\u064a",go:"roast"},
  {ic:"\u2694\ufe0f",en:"Battle",ar:"\u0627\u0644\u0645\u0639\u0631\u0643\u0629",go:"battle"},
  {ic:"\ud83d\udcca",en:"Viral Score",ar:"\u0645\u062a\u0646\u0628\u0626 \u0627\u0644\u0627\u0646\u062a\u0634\u0627\u0631",go:"writer"},
  {ic:"\ud83d\udd04",en:"Remix",ar:"\u0631\u064a\u0645\u0643\u0633",go:"writer"},
  {ic:"\u23f3",en:"Time Machine",ar:"\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646",go:"writer"},
  {ic:"\ud83c\udf0d",en:"28 Languages",ar:"28 \u0644\u063a\u0629",go:"writer"},
  {ic:"\ud83d\udc65",en:"Writers",ar:"\u062f\u0644\u064a\u0644 \u0627\u0644\u0643\u062a\u0651\u0627\u0628",go:"writers"}
];
var LVLS=[
  {lv:1,n:"Beginner",nA:"\u0645\u0628\u062a\u062f\u0626",xp:0,ic:"\ud83c\udf31",rw:"+5 credits"},
  {lv:2,n:"Writer",nA:"\u0643\u0627\u062a\u0628",xp:100,ic:"\u270f\ufe0f",rw:"Unlock Remix"},
  {lv:3,n:"Pro",nA:"\u0645\u062d\u062a\u0631\u0641",xp:300,ic:"\ud83d\udcdd",rw:"Unlock Battle"},
  {lv:4,n:"Expert",nA:"\u062e\u0628\u064a\u0631",xp:600,ic:"\u2b50",rw:"+5 credits"},
  {lv:5,n:"Master",nA:"\u0645\u0627\u0633\u062a\u0631",xp:1000,ic:"\ud83c\udfc6",rw:"Unlock Writers"},
  {lv:6,n:"Grand Master",nA:"\u062c\u0631\u0627\u0646\u062f \u0645\u0627\u0633\u062a\u0631",xp:1500,ic:"\ud83d\udc51",rw:"Gold Badge"},
  {lv:7,n:"Legend",nA:"\u0623\u0633\u0637\u0648\u0631\u0629",xp:2500,ic:"\ud83c\udf1f",rw:"+10 credits"},
  {lv:8,n:"Visionary",nA:"\u0645\u0644\u0647\u0645",xp:4000,ic:"\ud83d\udc8e",rw:"Platinum Badge"},
  {lv:9,n:"Genius",nA:"\u0639\u0628\u0642\u0631\u064a",xp:6000,ic:"\ud83e\udde0",rw:"+20 credits"},
  {lv:10,n:"Superbrain",nA:"\u062e\u0627\u0631\u0642",xp:10000,ic:"\ud83e\uddb8",rw:"VIP Status"}
];
var CTYPES=[
  {id:"suggestion",e:"\ud83d\udca1",en:"Suggestion",ar:"\u0627\u0642\u062a\u0631\u0627\u062d"},
  {id:"question",e:"\u2753",en:"Question",ar:"\u0633\u0624\u0627\u0644"},
  {id:"complaint",e:"\ud83d\ude24",en:"Complaint",ar:"\u0634\u0643\u0648\u0649"},
  {id:"collaboration",e:"\ud83e\udd1d",en:"Collaboration",ar:"\u062a\u0639\u0627\u0648\u0646"},
  {id:"business",e:"\ud83d\udcbc",en:"Business",ar:"\u062a\u062c\u0627\u0631\u064a"},
  {id:"technical",e:"\ud83d\udd27",en:"Technical",ar:"\u062a\u0642\u0646\u064a"}
];
var DWRITERS=[
  {name:"Sarah Ahmed",nA:"\u0633\u0627\u0631\u0629 \u0623\u062d\u0645\u062f",sp:"Tech & AI",sA:"\u062a\u0642\u0646\u064a\u0629 \u0648\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a",a:124,r:4.9},
  {name:"Mohamed Ali",nA:"\u0645\u062d\u0645\u062f \u0639\u0644\u064a",sp:"Business",sA:"\u0623\u0639\u0645\u0627\u0644",a:89,r:4.7},
  {name:"Layla Hassan",nA:"\u0644\u064a\u0644\u0649 \u062d\u0633\u0646",sp:"Creative Writing",sA:"\u0643\u062a\u0627\u0628\u0629 \u0625\u0628\u062f\u0627\u0639\u064a\u0629",a:156,r:4.8},
  {name:"Omar Nour",nA:"\u0639\u0645\u0631 \u0646\u0648\u0631",sp:"Marketing & SEO",sA:"\u062a\u0633\u0648\u064a\u0642 \u0648SEO",a:203,r:4.9}
];

/* ══════════ SAFE DB ══════════ */
var sDb=null,sSupa=null;
try{sSupa=require("./lib/supabase").supabase;}catch(e){}
try{sDb=require("./lib/db");}catch(e){}

/* ══════════ COMPONENT ══════════ */
export default function Home(){
  var [dk,sDk]=useState(false);
  var [rtl,sRtl]=useState(false);
  var [usr,sUsr]=useState(null);
  var [cr,sCr]=useState(10);
  var [vw,sVw]=useState("landing");
  var [mn,sMn]=useState(false);
  var [au,sAu]=useState(false);
  var [auM,sAuM]=useState("login");
  var [aE,sAE]=useState("");
  var [aP,sAP]=useState("");
  var [aN,sAN]=useState("");
  var [aL,sAL]=useState(false);
  var [tst,sTst]=useState(null);
  var [arts,sArts]=useState([]);
  // Writer
  var [tp,sTp]=useState("");
  var [lng,sLng]=useState("English");
  var [md,sMd]=useState("Professional");
  var [era,sEra]=useState("2024");
  var [wc,sWc]=useState(1000);
  var [gn,sGn]=useState("neutral");
  var [tl,sTl]=useState("generate");
  var [pst,sPst]=useState("");
  var [gL,sGL]=useState(false);
  var [res,sRes]=useState("");
  // Roast
  var [rLv,sRLv]=useState("medium");
  // Battle
  var [bA,sBA]=useState("");
  var [bB,sBB]=useState("");
  // Profile
  var [pT,sPT]=useState("info");
  // Admin
  var [aT,sAT]=useState("dashboard");
  var [aBal,sABal]=useState(5);
  var [bIn,sBIn]=useState("");
  // Contact
  var [cTp,sCTp]=useState("suggestion");
  var [cSb,sCSb]=useState("");
  var [cMs,sCMs]=useState("");
  var [cEm,sCEm]=useState("");
  // Terms
  var [tT,sTT]=useState("terms");
  // Writers
  var [wS,sWS]=useState("");

  var T=dk?DK:LT;
  function tx(k){var e=W[k];if(!e)return k;if(typeof e==="string")return e;return rtl?e.ar:e.en;}
  function toast(m,t){sTst({m:m,t:t||"info"});setTimeout(function(){sTst(null);},3000);}
  function go(v){sVw(v);sMn(false);sRes("");window.scrollTo(0,0);}
  var curLv=LVLS.reduce(function(a,l){return((usr&&usr.xp)||0)>=l.xp?l:a;},LVLS[0]);
  var nP=["roast","viral","remix","summary","titles","thread","linkedin","repurpose"];

  useEffect(function(){
    try{if(localStorage.getItem("ox_dk")==="1")sDk(true);if(localStorage.getItem("ox_rtl")==="1")sRtl(true);}catch(e){}
    if(sSupa){try{
      sSupa.auth.getSession().then(function(r){if(r.data.session)ldU(r.data.session.user);});
      sSupa.auth.onAuthStateChange(function(ev,s){
        if(ev==="SIGNED_IN"&&s){ldU(s.user);sAu(false);go("writer");}
        if(ev==="SIGNED_OUT"){sUsr(null);sCr(10);go("landing");}
      });
    }catch(e){}}
  },[]);
  useEffect(function(){try{localStorage.setItem("ox_dk",dk?"1":"0");}catch(e){}},[dk]);
  useEffect(function(){try{localStorage.setItem("ox_rtl",rtl?"1":"0");}catch(e){}},[rtl]);

  async function ldU(a){if(!sDb)return;try{
    var p=await sDb.getProfile(a.id);
    if(p){sUsr({id:a.id,email:a.email,name:p.full_name||"",plan:p.plan||"free",adm:p.is_admin||false,xp:p.xp||0});sCr(p.credits||10);}
    else{sUsr({id:a.id,email:a.email,name:(a.user_metadata&&a.user_metadata.full_name)||"",plan:"free",adm:a.email==="aanour1985@gmail.com",xp:0});}
  }catch(e){}}

  async function doLogin(){
    if(!sDb||!aE||!aP){toast(tx("fillAll"),"error");return;}sAL(true);
    try{var r=await sDb.signIn(aE,aP);if(r&&r.error)toast(r.error.message,"error");}catch(e){toast(e.message,"error");}sAL(false);
  }
  async function doSignup(){
    if(!sDb||!aE||!aP||!aN){toast(tx("fillAll"),"error");return;}sAL(true);
    try{var r=await sDb.signUp(aE,aP,aN,"neutral");if(r&&r.error)toast(r.error.message,"error");else toast(tx("checkEmail"),"success");}catch(e){toast(e.message,"error");}sAL(false);
  }
  async function doLogout(){if(sDb)try{await sDb.signOut();}catch(e){}sUsr(null);sCr(10);go("landing");toast(tx("loggedOut"),"success");}

  function getPrompt(useTool,useTopic){
    var g=gn==="male"?" Write masculine voice.":gn==="female"?" Write feminine voice.":"";
    if(useTool==="generate")return"Write a "+wc+"-word article about: "+useTopic+". Language: "+lng+". Tone: "+md+". Era: "+era+"."+g;
    if(useTool==="roast")return"Roast this article ("+rLv+" level). Score /10. Weaknesses. 3 tips.\n\n"+pst;
    if(useTool==="viral")return"Analyze viral potential. Score 1-100:\n"+pst;
    if(useTool==="remix")return"Remix into "+md+" style:\n"+pst;
    if(useTool==="debate")return"Debate about: "+useTopic+". BOTH sides with evidence.";
    if(useTool==="summary")return"3 bullets + TL;DR:\n"+pst;
    if(useTool==="titles")return"10 click-worthy titles:\n"+(pst||useTopic);
    if(useTool==="thread")return"Twitter/X thread 8-12 tweets:\n"+pst;
    if(useTool==="linkedin")return"LinkedIn post:\n"+pst;
    if(useTool==="repurpose")return"Repurpose: blog, social, email, video, podcast:\n"+pst;
    return"Write about: "+useTopic;
  }

  async function doGen(overrideTool,overrideTopic){
    var useTool=overrideTool||tl;
    var useTopic=overrideTopic||tp;
    var cost=(TOOLS.find(function(t){return t.id===useTool;})||{}).c||5;
    if(cr<cost){toast(tx("nomoney"),"error");return;}
    if((useTool==="generate"||useTool==="debate")&&!useTopic.trim()){toast(tx("fillAll"),"error");return;}
    if(nP.indexOf(useTool)!==-1&&!pst.trim()&&useTool!=="titles"){toast(tx("fillAll"),"error");return;}
    sGL(true);sRes("");
    try{
      var resp=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:getPrompt(useTool,useTopic)})});
      var data=await resp.json();
      if(data.content){sRes(data.content);sCr(function(p){return p-cost;});toast("Done! -"+cost+" credits","success");}
      else{toast(data.error||"Error","error");}
    }catch(e){toast("Connection error","error");}
    sGL(false);
  }
  function doCopy(){try{navigator.clipboard.writeText(res);toast(tx("copied"),"success");}catch(e){}}

  /* ══════════ STYLES ══════════ */
  var iS={width:"100%",padding:"12px",borderRadius:"10px",border:"1px solid "+T.bd,background:T.cd,color:T.tx,marginBottom:"12px",boxSizing:"border-box",fontSize:"0.95rem",direction:rtl?"rtl":"ltr"};
  var chip=function(a){return{padding:"8px 16px",borderRadius:"20px",border:a?"2px solid "+T.pr:"1px solid "+T.bd,background:a?T.pr+"18":T.cd,color:a?T.pr:T.t2,cursor:"pointer",fontSize:"0.85rem",fontWeight:a?700:500,transition:"all 0.2s"};};
  var crd={background:T.cd,border:"1px solid "+T.bd,borderRadius:"14px",padding:"20px",marginBottom:"12px"};
  var btn=function(bg,clr){return{width:"100%",padding:"14px",borderRadius:"12px",border:"none",background:bg,color:clr||"#fff",fontSize:"1rem",fontWeight:700,cursor:"pointer",transition:"all 0.2s"};};

  /* ══════════ SIDEBAR MENU ══════════ */
  var sideItems=[];
  if(usr){
    sideItems.push({type:"header"});
    sideItems.push({type:"divider",label:tx("services")});
    sideItems.push({id:"writer",ic:"\u270d\ufe0f",l:tx("writer")});
    sideItems.push({id:"roast",ic:"\ud83d\udd25",l:tx("roast")});
    sideItems.push({id:"battle",ic:"\u2694\ufe0f",l:tx("battle")});
    sideItems.push({id:"writers",ic:"\ud83d\udc65",l:tx("writers")});
    sideItems.push({type:"divider",label:tx("billing")});
    sideItems.push({id:"credits",ic:"\ud83e\ude99",l:tx("credits")});
    sideItems.push({id:"pricing",ic:"\ud83d\udc8e",l:tx("pricing")});
    sideItems.push({type:"divider",label:tx("support")});
    sideItems.push({id:"contact",ic:"\ud83d\udce9",l:tx("contact")});
    sideItems.push({id:"terms",ic:"\ud83d\udcdc",l:tx("terms")});
    if(usr.adm){
      sideItems.push({type:"divider",label:tx("admin")});
      sideItems.push({id:"admin",ic:"\ud83d\udee1\ufe0f",l:tx("admin")});
    }
  }else{
    sideItems.push({id:"landing",ic:"\ud83c\udfe0",l:tx("home")});
    sideItems.push({id:"pricing",ic:"\ud83d\udc8e",l:tx("pricing")});
    sideItems.push({id:"contact",ic:"\ud83d\udce9",l:tx("contact")});
    sideItems.push({id:"terms",ic:"\ud83d\udcdc",l:tx("terms")});
  }

  /* ══════════ RENDER ══════════ */
  return(
<div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",direction:rtl?"rtl":"ltr"}}>

{/* ═══ NAV ═══ */}
<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:T.cd+"ee",backdropFilter:"blur(12px)",borderBottom:"1px solid "+T.bd,padding:"0 16px",height:"56px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
    <button onClick={function(){sMn(!mn);}} style={{background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",color:T.tx}}>{"\u2630"}</button>
    <span onClick={function(){go("landing");}} style={{fontFamily:"'Source Serif 4',serif",fontWeight:800,fontSize:"1.2rem",cursor:"pointer",color:T.tx}}>{"\u270d\ufe0f OxQuill"}</span>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
    {usr&&<span style={{fontSize:"0.8rem",color:T.pr,fontWeight:700}}>{cr+" \ud83e\ude99"}</span>}
    <button onClick={function(){sDk(!dk);}} style={{background:"none",border:"none",fontSize:"1.1rem",cursor:"pointer"}}>{dk?"\u2600\ufe0f":"\ud83c\udf19"}</button>
    <button onClick={function(){sRtl(!rtl);}} style={{background:"none",border:"none",fontSize:"0.8rem",cursor:"pointer",color:T.t2,fontWeight:700}}>{rtl?"EN":"AR"}</button>
    {usr
      ?<button onClick={doLogout} style={{background:"none",border:"1px solid #EF4444",color:"#EF4444",padding:"4px 12px",borderRadius:"8px",fontSize:"0.8rem",cursor:"pointer"}}>{tx("logout")}</button>
      :<button onClick={function(){sAu(true);}} style={{background:T.pr,border:"none",color:"#fff",padding:"6px 16px",borderRadius:"8px",fontSize:"0.85rem",fontWeight:700,cursor:"pointer"}}>{tx("login")}</button>
    }
  </div>
</nav>

{/* ═══ SIDEBAR ═══ */}
{mn&&(
<div style={{position:"fixed",top:"56px",left:0,right:0,bottom:0,zIndex:99}}>
  <div onClick={function(){sMn(false);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
  <div style={{position:"relative",background:T.cd,padding:"0",maxWidth:"280px",height:"100%",overflowY:"auto",borderRight:rtl?"none":"1px solid "+T.bd,borderLeft:rtl?"1px solid "+T.bd:"none"}}>
    {sideItems.map(function(item,i){
      if(item.type==="header")return(
        <div key={i} onClick={function(){go("profile");}} style={{padding:"20px",borderBottom:"1px solid "+T.bd,cursor:"pointer"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"50%",background:GR,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",color:"#fff",marginBottom:"8px"}}>{usr?(usr.name||usr.email||"?").charAt(0).toUpperCase():"?"}</div>
          <div style={{fontWeight:700}}>{usr?usr.name||usr.email:"Guest"}</div>
          <div style={{fontSize:"0.8rem",color:T.pr}}>{curLv.ic+" "+(rtl?curLv.nA:curLv.n)+" \u2022 "+cr+" credits"}</div>
        </div>
      );
      if(item.type==="divider")return(
        <div key={i} style={{padding:"10px 20px 4px",fontSize:"0.7rem",fontWeight:700,color:T.t3,textTransform:"uppercase",letterSpacing:"0.5px"}}>{item.label}</div>
      );
      var active=vw===item.id;
      return(
        <button key={i} onClick={function(){go(item.id);}} style={{display:"block",width:"100%",padding:"12px 20px",background:active?T.pr+"18":"transparent",border:"none",color:active?T.pr:T.tx,fontSize:"0.95rem",fontWeight:active?700:500,cursor:"pointer",textAlign:rtl?"right":"left"}}>{item.ic+" "+item.l}</button>
      );
    })}
  </div>
</div>
)}

{/* ═══ MAIN CONTENT ═══ */}
<main style={{paddingTop:"56px",minHeight:"calc(100vh - 120px)"}}>

{/* ── LANDING ── */}
{vw==="landing"&&(
<div>
  <section style={{padding:"80px 20px 40px",textAlign:"center",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-120px",left:"50%",transform:"translateX(-50%)",width:"600px",height:"600px",background:"radial-gradient(circle,rgba(91,108,240,0.12) 0%,transparent 70%)",borderRadius:"50%",pointerEvents:"none"}}/>
    <div style={{position:"relative",maxWidth:"700px",margin:"0 auto"}}>
      <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"clamp(1.8rem,5vw,3rem)",fontWeight:800,lineHeight:1.25,marginBottom:"16px"}}>
        {rtl?W.heroAR:W.heroEN}
        <span style={{background:GR,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{rtl?W.heroW_AR:W.heroW_EN}</span>
        {tx("heroEnd")}
      </h1>
      <p style={{color:T.t2,fontSize:"clamp(0.95rem,2.5vw,1.15rem)",maxWidth:"560px",margin:"0 auto 28px",lineHeight:1.7}}>{tx("heroDesc")}</p>
      <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={function(){usr?go("writer"):sAu(true);}} style={{background:GR,color:"#fff",border:"none",padding:"14px 32px",borderRadius:"12px",fontSize:"1rem",fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(91,108,240,0.3)",transition:"transform 0.2s"}}>{tx("start")}</button>
        <button onClick={function(){go("pricing");}} style={{background:"transparent",color:T.pr,border:"2px solid "+T.pr,padding:"14px 32px",borderRadius:"12px",fontSize:"1rem",fontWeight:700,cursor:"pointer",transition:"transform 0.2s"}}>{tx("viewPlans")}</button>
      </div>
    </div>
  </section>
  <section style={{display:"flex",justifyContent:"center",gap:"clamp(20px,5vw,50px)",padding:"20px",flexWrap:"wrap"}}>
    {[{n:"28",l:rtl?"\u0644\u063a\u0629":"Languages"},{n:"31",l:rtl?"\u062d\u0642\u0628\u0629":"Eras"},{n:"10",l:rtl?"\u0623\u062f\u0627\u0629 AI":"AI Tools"},{n:"6",l:rtl?"\u0646\u0628\u0631\u0627\u062a":"Moods"}].map(function(s,i){
      return <div key={i} style={{textAlign:"center"}}><div style={{fontSize:"2rem",fontWeight:800,background:GR,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.n}</div><div style={{fontSize:"0.8rem",color:T.t2}}>{s.l}</div></div>;
  })}
  </section>
  <section style={{padding:"40px 20px",maxWidth:"900px",margin:"0 auto"}}>
    <h2 style={{textAlign:"center",fontFamily:"'Source Serif 4',serif",fontSize:"1.5rem",fontWeight:700,marginBottom:"28px"}}>{tx("superTools")}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"12px"}}>
      {FEATS.map(function(f,i){return <div key={i} onClick={function(){usr?go(f.go):sAu(true);}} style={{background:T.cd,border:"1px solid "+T.bd,borderRadius:"14px",padding:"20px",textAlign:"center",cursor:"pointer",transition:"transform 0.2s"}} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(91,108,240,0.1)";}} onMouseLeave={function(e){e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}><div style={{fontSize:"1.5rem",marginBottom:"8px"}}>{f.ic}</div><div style={{fontWeight:600,fontSize:"0.85rem"}}>{rtl?f.ar:f.en}</div></div>;})}
    </div>
  </section>
  <section style={{padding:"40px 20px",maxWidth:"800px",margin:"0 auto"}}>
    <h2 style={{textAlign:"center",fontFamily:"'Source Serif 4',serif",fontSize:"1.3rem",fontWeight:700,marginBottom:"24px"}}>{tx("whatSay")}</h2>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"12px"}}>
      {TESTI.map(function(tm,i){return <div key={i} style={Object.assign({},crd)}><div style={{marginBottom:"8px"}}>{"\u2b50\u2b50\u2b50\u2b50\u2b50"}</div><p style={{color:T.t2,fontSize:"0.9rem",lineHeight:1.6,fontStyle:"italic",marginBottom:"12px"}}>{rtl?tm.tA:tm.t}</p><div style={{fontWeight:700,fontSize:"0.9rem"}}>{tm.n}</div><div style={{color:T.t2,fontSize:"0.8rem"}}>{tm.r}</div></div>;})}
    </div>
  </section>
  <section style={{padding:"40px 20px",textAlign:"center"}}><div style={{background:GR,borderRadius:"20px",padding:"40px 24px",maxWidth:"600px",margin:"0 auto"}}><h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.4rem",fontWeight:700,color:"#fff",marginBottom:"12px"}}>{tx("readyCTA")}</h2><p style={{color:"rgba(255,255,255,0.85)",marginBottom:"20px"}}>{tx("freeCredits")}</p><button onClick={function(){usr?go("writer"):sAu(true);}} style={{background:"#fff",color:T.pr,border:"none",padding:"12px 36px",borderRadius:"10px",fontSize:"1rem",fontWeight:700,cursor:"pointer"}}>{tx("startNow")}</button></div></section>
</div>
)}

{/* ── WRITER ── */}
{vw==="writer"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"750px",margin:"0 auto"}}>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.5rem",fontWeight:700,textAlign:"center",marginBottom:"20px"}}>{"\u270d\ufe0f "+tx("superwriter")}</h1>
  <div style={{display:"flex",gap:"6px",flexWrap:"wrap",justifyContent:"center",marginBottom:"20px"}}>
    {TOOLS.map(function(t){return <button key={t.id} onClick={function(){sTl(t.id);sRes("");}} style={chip(tl===t.id)}>{t.ic+" "+t.id+" ("+t.c+")"}</button>;})}
  </div>
  {(tl==="generate"||tl==="debate"||tl==="titles")&&<input value={tp} onChange={function(e){sTp(e.target.value);}} placeholder={tx("topic")} style={iS}/>}
  {nP.indexOf(tl)!==-1&&<textarea value={pst} onChange={function(e){sPst(e.target.value);}} placeholder={tx("paste")} rows={5} style={Object.assign({},iS,{resize:"vertical"})}/>}
  {tl==="generate"&&(
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:"10px",marginBottom:"16px"}}>
    <div><label style={{color:T.t2,fontSize:"0.8rem",display:"block",marginBottom:"4px"}}>{tx("language")}</label><select value={lng} onChange={function(e){sLng(e.target.value);}} style={iS}>{LANGS.map(function(l){return <option key={l} value={l}>{l}</option>;})}</select></div>
    <div><label style={{color:T.t2,fontSize:"0.8rem",display:"block",marginBottom:"4px"}}>{tx("mood")}</label><select value={md} onChange={function(e){sMd(e.target.value);}} style={iS}>{MOODS.map(function(m){return <option key={m} value={m}>{m}</option>;})}</select></div>
    <div><label style={{color:T.t2,fontSize:"0.8rem",display:"block",marginBottom:"4px"}}>{"\u23f3 "+tx("timeMachine")}</label><select value={era} onChange={function(e){sEra(e.target.value);}} style={iS}>{ERAS.map(function(e){return <option key={e} value={e}>{e}</option>;})}</select></div>
    <div><label style={{color:T.t2,fontSize:"0.8rem",display:"block",marginBottom:"4px"}}>{tx("words")+": "+wc}</label><input type="range" min={200} max={5000} step={100} value={wc} onChange={function(e){sWc(Number(e.target.value));}} style={{width:"100%"}}/></div>
    <div><label style={{color:T.t2,fontSize:"0.8rem",display:"block",marginBottom:"4px"}}>{tx("gender")}</label><select value={gn} onChange={function(e){sGn(e.target.value);}} style={iS}><option value="neutral">{tx("neutral")}</option><option value="male">{tx("male")}</option><option value="female">{tx("female")}</option></select></div>
  </div>
  )}
  <button onClick={function(){doGen();}} disabled={gL} style={btn(gL?T.bd:GR)}>{gL?("\u23f3 "+tx("loading")):("\ud83d\ude80 "+tx("generate")+" ("+(TOOLS.find(function(t){return t.id===tl;})||{}).c+")")}</button>
  {res&&<div style={Object.assign({},crd,{marginTop:"20px"})}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}><span style={{fontWeight:700}}>{tx("result")}</span><button onClick={doCopy} style={{background:T.pr+"18",border:"1px solid "+T.pr,color:T.pr,padding:"4px 14px",borderRadius:"8px",fontSize:"0.85rem",cursor:"pointer"}}>{"\ud83d\udccb "+tx("copy")}</button></div><div style={{lineHeight:1.8,whiteSpace:"pre-wrap",direction:rtl?"rtl":"ltr"}}>{res}</div></div>}
</div>
)}

{/* ── ROAST ── */}
{vw==="roast"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"650px",margin:"0 auto",textAlign:"center"}}>
  <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>{"\ud83d\udd25"}</div>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.6rem",fontWeight:800,marginBottom:"8px"}}>{tx("roastTitle")}</h1>
  <p style={{color:T.t2,marginBottom:"16px"}}>{tx("roastDesc")+" \ud83d\udd25"}</p>
  <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"16px"}}>
    {[{id:"gentle",e:"\ud83d\ude0f"},{id:"medium",e:"\ud83d\udd25"},{id:"savage",e:"\ud83d\udc80"}].map(function(lv){return <button key={lv.id} onClick={function(){sRLv(lv.id);}} style={Object.assign({},chip(rLv===lv.id),rLv===lv.id?{borderColor:"#EF4444",color:"#EF4444"}:{})}>{lv.e+" "+lv.id}</button>;})}
  </div>
  <textarea value={pst} onChange={function(e){sPst(e.target.value);}} placeholder={tx("paste")} rows={8} style={Object.assign({},iS,{textAlign:"left",resize:"vertical"})}/>
  <button onClick={function(){doGen("roast");}} disabled={gL} style={btn(gL?T.bd:"linear-gradient(135deg,#EF4444,#F97316)")}>{gL?"\ud83d\udd25 Roasting...":"\ud83d\udd25 "+tx("roastBtn")+" (2)"}</button>
  {res&&<div style={Object.assign({},crd,{marginTop:"20px",textAlign:"left"})}><h3 style={{color:"#EF4444",fontWeight:700,marginBottom:"12px"}}>{"\ud83d\udd25 "+tx("roastResult")}</h3><div style={{lineHeight:1.8,whiteSpace:"pre-wrap"}}>{res}</div></div>}
</div>
)}

{/* ── BATTLE ── */}
{vw==="battle"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"650px",margin:"0 auto",textAlign:"center"}}>
  <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>{"\u2694\ufe0f"}</div>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.6rem",fontWeight:800,marginBottom:"8px"}}>{tx("battleTitle")}</h1>
  <p style={{color:T.t2,marginBottom:"20px"}}>{tx("battleDesc")}</p>
  <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"10px",alignItems:"center",marginBottom:"20px"}}>
    <input value={bA} onChange={function(e){sBA(e.target.value);}} placeholder={tx("sideA")} style={iS}/>
    <span style={{fontSize:"1.3rem",fontWeight:800,color:"#EF4444"}}>VS</span>
    <input value={bB} onChange={function(e){sBB(e.target.value);}} placeholder={tx("sideB")} style={iS}/>
  </div>
  <button onClick={function(){doGen("debate",bA+" vs "+bB);}} disabled={gL} style={btn(gL?T.bd:"linear-gradient(135deg,#EF4444,#8B5CF6)")}>{gL?"\u2694\ufe0f Battle...":"\u2694\ufe0f "+tx("battleBtn")+" (6)"}</button>
  {res&&<div style={Object.assign({},crd,{marginTop:"20px",textAlign:"left"})}><div style={{lineHeight:1.8,whiteSpace:"pre-wrap"}}>{res}</div></div>}
</div>
)}

{/* ── PROFILE ── */}
{vw==="profile"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"650px",margin:"0 auto"}}>
  <div style={{textAlign:"center",marginBottom:"20px"}}>
    <div style={{width:"70px",height:"70px",borderRadius:"50%",background:GR,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:"1.8rem",color:"#fff"}}>{usr?(usr.name||usr.email||"?").charAt(0).toUpperCase():"?"}</div>
    <div style={{fontWeight:700,fontSize:"1.2rem"}}>{usr?(usr.name||usr.email):"Guest"}</div>
    <div style={{color:T.t2,fontSize:"0.85rem"}}>{curLv.ic+" "+(rtl?curLv.nA:curLv.n)+" \u2022 "+cr+" credits"}</div>
  </div>
  <div style={{display:"flex",gap:"6px",marginBottom:"20px"}}>
    {[{id:"info",l:"\ud83d\udc64 "+tx("myInfo")},{id:"articles",l:"\ud83d\udcc4 "+tx("myArticles")},{id:"levels",l:"\ud83c\udfc6 "+tx("levels")},{id:"settings",l:"\u2699\ufe0f "+tx("settings")}].map(function(tb){return <button key={tb.id} onClick={function(){sPT(tb.id);}} style={Object.assign({},chip(pT===tb.id),{flex:1,fontSize:"0.75rem"})}>{tb.l}</button>;})}
  </div>
  {pT==="info"&&<div style={crd}>{[{l:tx("name"),v:usr?usr.name:"-"},{l:tx("email"),v:usr?usr.email:"-"},{l:tx("credits"),v:cr},{l:tx("levels"),v:curLv.ic+" "+curLv.n},{l:"XP",v:(usr&&usr.xp)||0}].map(function(r,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<4?"1px solid "+T.bd:"none"}}><span style={{color:T.t2}}>{r.l}</span><span style={{fontWeight:600}}>{r.v}</span></div>;})}</div>}
  {pT==="articles"&&<div style={{textAlign:"center",padding:"40px",color:T.t2}}><div style={{fontSize:"2rem",marginBottom:"8px"}}>{"\ud83d\udced"}</div>{tx("noArticles")}</div>}
  {pT==="levels"&&<div>{LVLS.map(function(lv,i){var reached=((usr&&usr.xp)||0)>=lv.xp;var isCur=curLv.lv===lv.lv;return <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px",borderRadius:"10px",marginBottom:"6px",background:isCur?T.pr+"14":reached?T.cd:"transparent",border:isCur?"2px solid "+T.pr:"1px solid "+(reached?T.bd:"transparent"),opacity:reached?1:0.5}}><div style={{fontSize:"1.3rem"}}>{lv.ic}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:"0.85rem"}}>{"Lv"+lv.lv+" \u2014 "+(rtl?lv.nA:lv.n)}</div><div style={{color:T.t2,fontSize:"0.75rem"}}>{lv.xp+" XP \u2022 "+lv.rw}</div></div>{reached&&<span style={{color:"#22C55E",fontWeight:700}}>{"\u2713"}</span>}</div>;})}</div>}
  {pT==="settings"&&<div style={Object.assign({},crd,{textAlign:"center",color:T.t2})}>{tx("soon")}</div>}
</div>
)}

{/* ── ADMIN ── */}
{vw==="admin"&&usr&&usr.adm&&(
<div style={{padding:"20px 16px 40px",maxWidth:"800px",margin:"0 auto"}}>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.4rem",fontWeight:700,textAlign:"center",marginBottom:"20px"}}>{"\ud83d\udee1\ufe0f "+tx("admin")}</h1>
  <div style={{display:"flex",gap:"6px",marginBottom:"20px"}}>
    {[{id:"dashboard",l:"\ud83d\udcca "+tx("dashboard")},{id:"users",l:"\ud83d\udc65 "+tx("users")},{id:"admins",l:"\ud83d\udee1\ufe0f "+tx("admins")},{id:"messages",l:"\ud83d\udce9 "+tx("messages")}].map(function(tb){return <button key={tb.id} onClick={function(){sAT(tb.id);}} style={Object.assign({},chip(aT===tb.id),{flex:1,fontSize:"0.75rem"})}>{tb.l}</button>;})}
  </div>
  {aT==="dashboard"&&<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"10px",marginBottom:"20px"}}>
      {[{l:tx("users"),v:"0",ic:"\ud83d\udc65",c:"#3B82F6"},{l:tx("myArticles"),v:"0",ic:"\ud83d\udcc4",c:"#22C55E"},{l:tx("credits"),v:"0",ic:"\ud83d\udcb0",c:"#F59E0B"},{l:tx("messages"),v:"0",ic:"\ud83d\udce9",c:"#EF4444"}].map(function(s,i){return <div key={i} style={Object.assign({},crd,{textAlign:"center"})}><div style={{fontSize:"1.3rem"}}>{s.ic}</div><div style={{fontSize:"1.4rem",fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:"0.8rem",color:T.t2}}>{s.l}</div></div>;})}
    </div>
    <div style={crd}><h3 style={{fontWeight:700,marginBottom:"12px"}}>{"\ud83e\udd16 Claude API Usage"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
        <div style={{background:dk?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.03)",borderRadius:"10px",padding:"12px"}}><div style={{color:T.t2,fontSize:"0.8rem"}}>Monthly Tokens</div><div style={{fontWeight:700,fontSize:"1.1rem"}}>0</div></div>
        <div style={{background:dk?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.03)",borderRadius:"10px",padding:"12px"}}><div style={{color:T.t2,fontSize:"0.8rem"}}>Est. Cost</div><div style={{fontWeight:700,fontSize:"1.1rem"}}>$0.00</div></div>
      </div>
      <div style={{background:aBal<2?"rgba(239,68,68,0.08)":aBal<5?"rgba(245,158,11,0.08)":"rgba(34,197,94,0.08)",borderRadius:"10px",padding:"12px",marginBottom:"10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{color:T.t2,fontSize:"0.8rem"}}>Anthropic Balance</div><div style={{fontWeight:800,fontSize:"1.2rem",color:aBal<2?"#EF4444":aBal<5?"#F59E0B":"#22C55E"}}>{"$"+aBal.toFixed(2)}</div></div>
        {aBal<2&&<span style={{background:"#EF4444",color:"#fff",padding:"4px 10px",borderRadius:"8px",fontSize:"0.75rem",fontWeight:700}}>{"\u26a0\ufe0f LOW!"}</span>}
      </div>
      <div style={{display:"flex",gap:"8px"}}><input value={bIn} onChange={function(e){sBIn(e.target.value);}} placeholder="$" type="number" style={Object.assign({},iS,{flex:1,marginBottom:0})}/><button onClick={function(){var v=parseFloat(bIn);if(!isNaN(v)&&v>=0){sABal(v);sBIn("");toast(tx("update")+"d","success");}}} style={{padding:"10px 18px",borderRadius:"8px",border:"none",background:T.pr,color:"#fff",fontWeight:700,cursor:"pointer"}}>{tx("update")}</button></div>
    </div>
  </div>}
  {aT==="users"&&<div style={Object.assign({},crd,{textAlign:"center",color:T.t2})}>{tx("noUsers")}</div>}
  {aT==="admins"&&<div style={Object.assign({},crd,{textAlign:"center",color:T.t2})}>{"Admin: aanour1985@gmail.com \ud83d\udee1\ufe0f"}</div>}
  {aT==="messages"&&<div style={Object.assign({},crd,{textAlign:"center",color:T.t2})}>{tx("noMsgs")}</div>}
</div>
)}

{/* ── WRITERS ── */}
{vw==="writers"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"750px",margin:"0 auto"}}>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.4rem",fontWeight:700,textAlign:"center",marginBottom:"8px"}}>{"\ud83d\udc65 "+tx("writersDir")}</h1>
  <input value={wS} onChange={function(e){sWS(e.target.value);}} placeholder={tx("searchWriters")} style={Object.assign({},iS,{marginTop:"16px"})}/>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"12px"}}>
    {DWRITERS.filter(function(w){return !wS||w.name.toLowerCase().indexOf(wS.toLowerCase())!==-1||(w.nA&&w.nA.indexOf(wS)!==-1);}).map(function(w,i){return <div key={i} style={Object.assign({},crd,{textAlign:"center",cursor:"pointer",transition:"transform 0.2s"})} onMouseEnter={function(e){e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={function(e){e.currentTarget.style.transform="none";}}><div style={{width:"50px",height:"50px",borderRadius:"50%",background:GR,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",fontSize:"1.2rem",fontWeight:800,color:"#fff"}}>{w.name.charAt(0)}</div><div style={{fontWeight:700}}>{rtl?w.nA:w.name}</div><div style={{color:T.pr,fontSize:"0.85rem",fontWeight:600}}>{rtl?w.sA:w.sp}</div><div style={{color:T.t2,fontSize:"0.8rem",marginTop:"4px"}}>{"\ud83d\udcc4 "+w.a+" "+tx("articles")+" \u2022 \u2b50 "+w.r}</div></div>;})}
  </div>
</div>
)}

{/* ── PRICING ── */}
{vw==="pricing"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"850px",margin:"0 auto"}}>
  <h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.5rem",fontWeight:700,textAlign:"center",marginBottom:"28px"}}>{"\ud83d\udc8e "+tx("choosePlan")}</h1>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"12px",marginBottom:"40px"}}>
    {PLANS.map(function(p,i){return <div key={i} style={Object.assign({},crd,{textAlign:"center",position:"relative",border:p.pop?"2px solid "+T.pr:"1px solid "+T.bd})}>{p.pop&&<div style={{position:"absolute",top:"-10px",left:"50%",transform:"translateX(-50%)",background:GR,color:"#fff",padding:"3px 14px",borderRadius:"10px",fontSize:"0.7rem",fontWeight:700}}>{"\u2b50 "+tx("popular")}</div>}<h3 style={{fontWeight:700,fontSize:"1.05rem",marginBottom:"6px"}}>{p.n}</h3><div style={{fontSize:"1.8rem",fontWeight:800,color:T.pr}}>{p.pr===0?tx("free"):"$"+p.pr}</div>{p.pr>0&&<div style={{color:T.t2,fontSize:"0.8rem",marginBottom:"12px"}}>{"/ "+tx("month")}</div>}<div style={{marginBottom:"14px"}}>{p.f.map(function(f,j){return <div key={j} style={{color:T.t2,fontSize:"0.8rem",padding:"3px 0"}}>{"\u2713 "+f}</div>;})}</div><button onClick={function(){toast(tx("soon"),"info");}} style={{width:"100%",padding:"10px",borderRadius:"10px",border:p.pop?"none":"1px solid "+T.bd,background:p.pop?GR:"transparent",color:p.pop?"#fff":T.tx,fontWeight:700,cursor:"pointer"}}>{p.pr===0?tx("startFree"):tx("subscribe")}</button></div>;})}
  </div>
  <h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.2rem",fontWeight:700,textAlign:"center",marginBottom:"16px"}}>{"\ud83e\ude99 "+tx("creditPacks")}</h2>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"10px"}}>
    {PACKS.map(function(pk,i){return <div key={i} style={Object.assign({},crd,{textAlign:"center",position:"relative",border:pk.best?"2px solid #F59E0B":"1px solid "+T.bd})}>{pk.best&&<div style={{position:"absolute",top:"-8px",right:"10px",background:"#F59E0B",color:"#fff",padding:"2px 8px",borderRadius:"6px",fontSize:"0.65rem",fontWeight:700}}>{tx("bestVal")}</div>}<div style={{fontSize:"1.3rem",fontWeight:800,color:"#F59E0B"}}>{pk.cr+" \ud83e\ude99"}</div><div style={{color:T.t2,fontSize:"0.8rem",margin:"4px 0 10px"}}>{pk.l}</div><button onClick={function(){toast(tx("soon"),"info");}} style={{width:"100%",padding:"8px",borderRadius:"8px",border:"none",background:"#F59E0B",color:"#fff",fontWeight:700,cursor:"pointer"}}>{"$"+pk.pr}</button></div>;})}
  </div>
</div>
)}

{/* ── CREDITS ── */}
{vw==="credits"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"550px",margin:"0 auto"}}>
  <div style={{background:GR,borderRadius:"18px",padding:"28px",textAlign:"center",color:"#fff",marginBottom:"20px"}}><div style={{fontSize:"0.85rem",opacity:0.85}}>{tx("balance")}</div><div style={{fontSize:"2.5rem",fontWeight:800}}>{cr+" \ud83e\ude99"}</div><button onClick={function(){go("pricing");}} style={{marginTop:"14px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",color:"#fff",padding:"8px 24px",borderRadius:"10px",fontWeight:700,cursor:"pointer"}}>{tx("buyCredits")}</button></div>
  <div style={crd}><h3 style={{fontWeight:700,marginBottom:"12px"}}>{tx("toolCosts")}</h3>{TOOLS.map(function(t,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<TOOLS.length-1?"1px solid "+T.bd:"none"}}><span>{t.ic+" "+t.id}</span><span style={{color:T.pr,fontWeight:700}}>{t.c+" \ud83e\ude99"}</span></div>;})}</div>
</div>
)}

{/* ── CONTACT ── */}
{vw==="contact"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"550px",margin:"0 auto"}}>
  <div style={{textAlign:"center",marginBottom:"24px"}}><div style={{fontSize:"2rem",marginBottom:"6px"}}>{"\ud83d\udce9"}</div><h1 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.4rem",fontWeight:700}}>{tx("contact")}</h1></div>
  <div style={{display:"flex",flexWrap:"wrap",gap:"6px",justifyContent:"center",marginBottom:"20px"}}>{CTYPES.map(function(ct){return <button key={ct.id} onClick={function(){sCTp(ct.id);}} style={chip(cTp===ct.id)}>{ct.e+" "+(rtl?ct.ar:ct.en)}</button>;})}</div>
  <input value={cEm||(usr?usr.email:"")} onChange={function(e){sCEm(e.target.value);}} placeholder={tx("email")} style={iS}/>
  <input value={cSb} onChange={function(e){sCSb(e.target.value);}} placeholder={tx("subject")} style={iS}/>
  <textarea value={cMs} onChange={function(e){sCMs(e.target.value);}} placeholder={tx("message")} rows={5} style={Object.assign({},iS,{resize:"vertical"})}/>
  <button onClick={function(){
    if(!cSb||!cMs){toast(tx("fillAll"),"error");return;}
    if(sDb)try{sDb.sendContactMessage(usr?usr.id:null,cTp,cSb,cMs);}catch(e){}
    toast(tx("msgSent")+" \ud83d\udce9","success");sCSb("");sCMs("");
  }} style={btn(GR)}>{"\ud83d\udce9 "+tx("send")}</button>
</div>
)}

{/* ── TERMS ── */}
{vw==="terms"&&(
<div style={{padding:"20px 16px 40px",maxWidth:"650px",margin:"0 auto"}}>
  <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"24px"}}>
    <button onClick={function(){sTT("terms");}} style={chip(tT==="terms")}>{tx("termsTitle")}</button>
    <button onClick={function(){sTT("privacy");}} style={chip(tT==="privacy")}>{tx("privacyTitle")}</button>
  </div>
  <div style={Object.assign({},crd,{lineHeight:1.8,direction:rtl?"rtl":"ltr"})}>
    {tT==="terms"?(
      <div><h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.3rem",fontWeight:700,marginBottom:"16px"}}>{"\ud83d\udcdc "+tx("termsTitle")}</h2>
      <h3 style={{color:T.pr,fontWeight:700,marginTop:"16px"}}>{rtl?"1. \u0627\u0644\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0645\u0642\u0628\u0648\u0644":"1. Acceptable Use"}</h3><p style={{color:T.t2}}>{rtl?"\u064a\u0645\u0646\u0639 \u062a\u0648\u0644\u064a\u062f \u0645\u062d\u062a\u0648\u0649 \u0645\u062e\u0627\u0644\u0641 \u0644\u0644\u0642\u0627\u0646\u0648\u0646 \u0623\u0648 \u0645\u062d\u062a\u0648\u0649 \u0643\u0631\u0627\u0647\u064a\u0629.":"Generating illegal or harmful content is prohibited."}</p>
      <h3 style={{color:T.pr,fontWeight:700,marginTop:"16px"}}>{rtl?"2. \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u0645\u0648\u0644\u0651\u062f":"2. Generated Content"}</h3><p style={{color:T.t2}}>{rtl?"\u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u064a\u062e\u0635\u0643. \u062a\u062a\u062d\u0645\u0644 \u0645\u0633\u0624\u0648\u0644\u064a\u0629 \u0645\u0631\u0627\u062c\u0639\u062a\u0647 \u0642\u0628\u0644 \u0627\u0644\u0646\u0634\u0631.":"Content belongs to you. Review before publishing."}</p>
      <h3 style={{color:T.pr,fontWeight:700,marginTop:"16px"}}>{rtl?"3. \u0627\u0644\u0643\u0631\u064a\u062f\u062a":"3. Credits"}</h3><p style={{color:T.t2}}>{rtl?"\u063a\u064a\u0631 \u0642\u0627\u0628\u0644 \u0644\u0644\u0627\u0633\u062a\u0631\u062f\u0627\u062f. \u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643\u0627\u062a \u062a\u062a\u062c\u062f\u062f \u062a\u0644\u0642\u0627\u0626\u064a\u0627\u064b.":"Non-refundable. Subscriptions auto-renew."}</p></div>
    ):(
      <div><h2 style={{fontFamily:"'Source Serif 4',serif",fontSize:"1.3rem",fontWeight:700,marginBottom:"16px"}}>{"\ud83d\udd12 "+tx("privacyTitle")}</h2>
      <h3 style={{color:T.pr,fontWeight:700}}>{rtl?"1. \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a":"1. Data"}</h3><p style={{color:T.t2}}>{rtl?"\u0646\u062c\u0645\u0639 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0628\u0631\u064a\u062f \u0641\u0642\u0637. \u0644\u0627 \u0646\u0628\u064a\u0639 \u0628\u064a\u0627\u0646\u0627\u062a\u0643.":"We collect name and email only. We never sell your data."}</p>
      <h3 style={{color:T.pr,fontWeight:700,marginTop:"16px"}}>{rtl?"2. \u0627\u0644\u0623\u0645\u0627\u0646":"2. Security"}</h3><p style={{color:T.t2}}>{rtl?"\u0646\u0633\u062a\u062e\u062f\u0645 \u062a\u0634\u0641\u064a\u0631 SSL \u0648\u0623\u0641\u0636\u0644 \u0627\u0644\u0645\u0645\u0627\u0631\u0633\u0627\u062a.":"We use SSL encryption and best practices."}</p>
      <h3 style={{color:T.pr,fontWeight:700,marginTop:"16px"}}>{rtl?"3. \u062d\u0642\u0648\u0642\u0643":"3. Your Rights"}</h3><p style={{color:T.t2}}>{rtl?"\u064a\u0645\u0643\u0646\u0643 \u062d\u0630\u0641 \u062d\u0633\u0627\u0628\u0643 \u0641\u064a \u0623\u064a \u0648\u0642\u062a.":"You can delete your account anytime."}</p></div>
    )}
  </div>
</div>
)}

</main>

{/* ═══ AUTH MODAL ═══ */}
{au&&(
<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}}>
  <div onClick={function(){sAu(false);}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)"}}/>
  <div style={{position:"relative",background:T.cd,borderRadius:"20px",padding:"32px 24px",width:"90%",maxWidth:"380px",border:"1px solid "+T.bd}}>
    <button onClick={function(){sAu(false);}} style={{position:"absolute",top:"12px",right:"16px",background:"none",border:"none",fontSize:"1.3rem",cursor:"pointer",color:T.t2}}>{"\u00d7"}</button>
    <h2 style={{textAlign:"center",marginBottom:"20px",fontSize:"1.2rem",fontWeight:700}}>{auM==="login"?tx("login"):tx("signup")}</h2>
    {auM==="signup"&&<input value={aN} onChange={function(e){sAN(e.target.value);}} placeholder={tx("name")} style={iS}/>}
    <input value={aE} onChange={function(e){sAE(e.target.value);}} placeholder={tx("email")} type="email" style={iS}/>
    <input value={aP} onChange={function(e){sAP(e.target.value);}} placeholder={tx("password")} type="password" style={iS}/>
    <button onClick={auM==="login"?doLogin:doSignup} disabled={aL} style={btn(GR)}>{aL?"...":auM==="login"?tx("login"):tx("signup")}</button>
    <p style={{textAlign:"center",color:T.t2,fontSize:"0.85rem",marginTop:"12px"}}><span onClick={function(){sAuM(auM==="login"?"signup":"login");}} style={{color:T.pr,cursor:"pointer",fontWeight:700}}>{auM==="login"?tx("createAcc"):tx("haveAcc")}</span></p>
  </div>
</div>
)}

{/* ═══ TOAST ═══ */}
{tst&&<div style={{position:"fixed",bottom:"24px",left:"50%",transform:"translateX(-50%)",background:tst.t==="error"?"#EF4444":tst.t==="success"?"#22C55E":"#3B82F6",color:"#fff",padding:"12px 24px",borderRadius:"12px",fontSize:"0.9rem",fontWeight:600,zIndex:300,boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{tst.m}</div>}

{/* ═══ FOOTER ═══ */}
<footer style={{borderTop:"1px solid "+T.bd,padding:"24px 16px",textAlign:"center"}}>
  <div style={{display:"flex",justifyContent:"center",gap:"20px",marginBottom:"12px",flexWrap:"wrap"}}>
    <span onClick={function(){go("pricing");}} style={{color:T.t2,fontSize:"0.85rem",cursor:"pointer"}}>{"\ud83d\udc8e "+tx("pricing")}</span>
    <span onClick={function(){go("contact");}} style={{color:T.t2,fontSize:"0.85rem",cursor:"pointer"}}>{"\ud83d\udce9 "+tx("contact")}</span>
    <span onClick={function(){go("terms");}} style={{color:T.t2,fontSize:"0.85rem",cursor:"pointer"}}>{"\ud83d\udcdc "+tx("terms")}</span>
  </div>
  <div style={{display:"flex",justifyContent:"center",gap:"12px",marginBottom:"8px"}}>
    <button onClick={function(){sDk(!dk);}} style={{background:"none",border:"none",fontSize:"1rem",cursor:"pointer"}}>{dk?"\u2600\ufe0f":"\ud83c\udf19"}</button>
    <button onClick={function(){sRtl(!rtl);}} style={{background:"none",border:"none",fontSize:"0.85rem",cursor:"pointer",color:T.t2,fontWeight:700}}>{rtl?"EN":"AR"}</button>
  </div>
  <p style={{color:T.t3,fontSize:"0.8rem"}}>{"\u00a9 2024 OxQuill. All rights reserved."}</p>
</footer>

</div>
  );
}
