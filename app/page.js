"use client";
import { useState } from "react";

var LANGS = [
  {v:"en",l:"🇺🇸 English"},{v:"ar",l:"🇸🇦 العربية"},{v:"fr",l:"🇫🇷 Français"},
  {v:"es",l:"🇪🇸 Español"},{v:"de",l:"🇩🇪 Deutsch"},{v:"it",l:"🇮🇹 Italiano"},
  {v:"pt",l:"🇧🇷 Português"},{v:"tr",l:"🇹🇷 Türkçe"},{v:"ru",l:"🇷🇺 Русский"},
  {v:"ja",l:"🇯🇵 日本語"},{v:"ko",l:"🇰🇷 한국어"},{v:"zh",l:"🇨🇳 中文"},
  {v:"hi",l:"🇮🇳 हिन्दी"},{v:"nl",l:"🇳🇱 Nederlands"},{v:"pl",l:"🇵🇱 Polski"},
  {v:"sv",l:"🇸🇪 Svenska"},{v:"da",l:"🇩🇰 Dansk"},{v:"fi",l:"🇫🇮 Suomi"},
  {v:"no",l:"🇳🇴 Norsk"},{v:"el",l:"🇬🇷 Ελληνικά"},{v:"th",l:"🇹🇭 ไทย"},
  {v:"vi",l:"🇻🇳 Tiếng Việt"},{v:"id",l:"🇮🇩 Bahasa"},{v:"ro",l:"🇷🇴 Română"},
  {v:"uk",l:"🇺🇦 Українська"},{v:"he",l:"🇮🇱 עברית"},{v:"ms",l:"🇲🇾 Melayu"},
  {v:"sw",l:"🇰🇪 Kiswahili"}
];
var TONES = ["Professional","Casual","Academic","Creative","Persuasive","Storytelling","Friendly","Authoritative"];
var MOODS = [
  {e:"😊",n:"Happy",p:"upbeat, positive"},{e:"😢",n:"Emotional",p:"touching, heartfelt"},
  {e:"😡",n:"Passionate",p:"bold, assertive"},{e:"🤔",n:"Thoughtful",p:"reflective"},
  {e:"😎",n:"Confident",p:"cool, assured"},{e:"🤣",n:"Humorous",p:"funny, witty"}
];
var ERAS = [
  {y:"1920s",p:"1920s newspaper formal"},{y:"1960s",p:"1960s counterculture"},
  {y:"1980s",p:"1980s corporate bold"},{y:"2050",p:"futuristic AI"},{y:"Medieval",p:"medieval archaic"}
];
var TMPLS = [
  {id:"blog",n:"Blog",ic:"📝",p:"a blog article"},{id:"list",n:"Listicle",ic:"📋",p:"a listicle"},
  {id:"how",n:"How-To",ic:"🔧",p:"a how-to guide"},{id:"comp",n:"Compare",ic:"⚖️",p:"a comparison"},
  {id:"rev",n:"Review",ic:"⭐",p:"a review"},{id:"news",n:"News",ic:"📰",p:"a news article"}
];
var COSTS = {generate:5,roast:2,viral:2,remix:3,debate:6,summary:1,titles:1,thread:2,linkedin:2,repurpose:5,battle:4};
var PACKS = [
  {credits:10,price:5,label:"Starter Pack"},
  {credits:50,price:20,label:"Creator Pack",save:"20%"},
  {credits:200,price:60,label:"Power Pack",best:true,save:"40%"},
  {credits:500,price:120,label:"Agency Pack",save:"52%"}
];
var PLANS = {
  free:{n:"Free",pr:0,cr:10,mW:800,lng:5},
  starter:{n:"Starter",pr:19,cr:100,mW:2000,lng:28},
  pro:{n:"Pro",pr:49,cr:500,mW:5000,lng:28},
  agency:{n:"Agency",pr:99,cr:2000,mW:5000,lng:28}
};
var THL = {bg:"#F7F8FC",cd:"#FFF",b3:"#F0F2F8",tx:"#1C2340",t2:"#505776",t3:"#8C92AB",pr:"#5B6CF0",pS:"rgba(91,108,240,.07)",bd:"#E4E8F1",nv:"rgba(247,248,252,.88)"};
var THD = {bg:"#13141A",cd:"#1C1D26",b3:"#252630",tx:"#E8E6F0",t2:"#A0A0B8",t3:"#6A6A82",pr:"#7B8AF5",pS:"rgba(123,138,245,.1)",bd:"#2A2B38",nv:"rgba(19,20,26,.88)"};

function md2h(t) {
  if (!t) return "";
  return t.replace(/^### (.*$)/gm,"<h3>$1</h3>").replace(/^## (.*$)/gm,"<h2>$1</h2>")
    .replace(/^# (.*$)/gm,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/^- (.*$)/gm,"<li>$1</li>")
    .replace(/\n\n/g,"</p><p>").replace(/\n/g,"<br/>");
}

function exPDF(c, t) {
  var w = window.open("");
  w.document.write("<html><head><title>" + t + "</title><style>body{font-family:Georgia;max-width:700px;margin:40px auto;padding:20px;line-height:1.8}h1{font-size:26px}h2{font-size:20px;margin-top:30px}@media print{body{margin:0}}</style></head><body>" + md2h(c) + "</body></html>");
  w.document.close();
  setTimeout(function(){ w.print(); }, 500);
}
function exWord(c, t) {
  var blob = new Blob(["<html><head><meta charset='utf-8'><style>body{font-family:Calibri;font-size:12pt;line-height:1.8}h1{font-size:22pt}h2{font-size:16pt}</style></head><body>" + md2h(c) + "</body></html>"], {type:"application/msword"});
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (t||"article").slice(0,30)+".doc"; a.click();
}
function exTXT(c, t) {
  var blob = new Blob([c], {type:"text/plain"});
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (t||"article").slice(0,30)+".txt"; a.click();
}

async function callAI(prompt) {
  var res = await fetch("/api/generate", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({prompt: prompt})
  });
  var data = await res.json();
  var parts = data.content || [];
  var text = "";
  for (var i = 0; i < parts.length; i++) { text += parts[i].text || ""; }
  return text || "Error generating content.";
}

var astyle = ".ax h1{font-family:Source Serif 4,Georgia,serif;font-size:22px;font-weight:900;color:var(--tx);margin-bottom:6px}.ax h2{font-family:Source Serif 4,Georgia,serif;font-size:18px;font-weight:700;color:var(--tx);margin-top:24px;margin-bottom:8px}.ax h3{font-size:15px;font-weight:700;color:var(--tx)}.ax p{margin-bottom:12px}.ax strong{color:var(--tx)}.ax ul,.ax ol{margin:10px 0;padding-left:20px}.ax li{margin-bottom:4px}";

function ShareModal(props) {
  var topic = props.topic;
  var onClose = props.onClose;
  var u = encodeURIComponent("https://oxquill.com");
  var tx = encodeURIComponent("Check out: " + topic);
  var links = [
    {n:"WhatsApp",i:"💬",u:"https://wa.me/?text="+tx+"%20"+u},
    {n:"Twitter/X",i:"🐦",u:"https://twitter.com/intent/tweet?text="+tx+"&url="+u},
    {n:"Facebook",i:"📘",u:"https://facebook.com/sharer/sharer.php?u="+u},
    {n:"LinkedIn",i:"💼",u:"https://linkedin.com/sharing/share-offsite/?url="+u},
    {n:"Telegram",i:"✈️",u:"https://t.me/share/url?url="+u+"&text="+tx},
    {n:"Email",i:"📧",u:"mailto:?subject="+encodeURIComponent(topic)+"&body="+tx}
  ];
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.35)",backdropFilter:"blur(6px)"}}></div>
      <div onClick={function(e){e.stopPropagation()}} style={{position:"relative",width:"100%",maxWidth:340,background:"var(--cd)",borderRadius:16,padding:"24px 20px"}}>
        <div style={{fontSize:16,fontWeight:700,marginBottom:12,textAlign:"center"}}>Share</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {links.map(function(l,i){
            return <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:7,padding:"10px 12px",background:"var(--b3)",borderRadius:9,textDecoration:"none",color:"var(--tx)",fontSize:13,border:"1px solid var(--bd)"}}>{l.i} {l.n}</a>;
          })}
        </div>
        <button onClick={function(){navigator.clipboard.writeText(topic+" — https://oxquill.com")}} style={{width:"100%",marginTop:8,padding:10,background:"var(--pr)",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer"}}>📋 Copy Link</button>
      </div>
    </div>
  );
}

function PayModal(props) {
  var price = props.price;
  var label = props.label;
  var onClose = props.onClose;
  var onSuccess = props.onSuccess;
  var s = useState("form");
  var step = s[0]; var setStep = s[1];
  var c1 = useState(""); var cd = c1[0]; var setCd = c1[1];
  var c2 = useState(""); var ex = c2[0]; var setEx = c2[1];
  var c3 = useState(""); var cv = c3[0]; var setCv = c3[1];
  var c4 = useState(""); var nm = c4[0]; var setNm = c4[1];
  var c5 = useState(""); var em = c5[0]; var setEm = c5[1];
  var ok = cd.length >= 16 && ex.length >= 4 && cv.length >= 3 && nm && em;
  var fs = {width:"100%",padding:"9px 12px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"};
  var ls = {display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:4};

  function process() {
    if (!ok) return;
    setStep("proc");
    setTimeout(function(){
      setStep("done");
      setTimeout(function(){ onSuccess(); onClose(); }, 1500);
    }, 2000);
  }

  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(8px)"}}></div>
      <div onClick={function(e){e.stopPropagation()}} style={{position:"relative",width:"100%",maxWidth:400,background:"var(--cd)",borderRadius:18,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontSize:16,fontWeight:700}}>{label}</div><div style={{fontSize:13,color:"var(--t2)"}}>${price}</div></div>
          <button onClick={onClose} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--bd)",background:"var(--b3)",cursor:"pointer",display:"grid",placeItems:"center",color:"var(--t3)",fontSize:13}}>✕</button>
        </div>
        {step === "done" ? (
          <div style={{padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:700}}>Success!</div>
          </div>
        ) : step === "proc" ? (
          <div style={{padding:"40px 20px",textAlign:"center"}}>
            <div style={{fontSize:34}}>💳</div>
            <div style={{fontSize:16,fontWeight:600,marginTop:10}}>Processing...</div>
          </div>
        ) : (
          <div style={{padding:"16px 20px"}}>
            <div style={{marginBottom:10}}><label style={ls}>Full Name</label><input style={fs} value={nm} onChange={function(e){setNm(e.target.value)}}/></div>
            <div style={{marginBottom:10}}><label style={ls}>Email</label><input style={fs} type="email" value={em} onChange={function(e){setEm(e.target.value)}}/></div>
            <div style={{marginBottom:10}}><label style={ls}>Card Number</label><input style={fs} placeholder="4242424242424242" maxLength={19} value={cd} onChange={function(e){setCd(e.target.value.replace(/\D/g,""))}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              <div><label style={ls}>Expiry</label><input style={fs} placeholder="MM/YY" maxLength={5} value={ex} onChange={function(e){setEx(e.target.value)}}/></div>
              <div><label style={ls}>CVC</label><input style={fs} placeholder="123" maxLength={4} type="password" value={cv} onChange={function(e){setCv(e.target.value)}}/></div>
            </div>
            <button onClick={process} disabled={!ok} style={{width:"100%",padding:12,background:"var(--pr)",color:"#fff",border:"none",borderRadius:9,fontSize:14,fontWeight:700,cursor:ok?"pointer":"not-allowed",opacity:ok?1:0.5}}>Pay ${price}</button>
            <div style={{textAlign:"center",marginTop:8,fontSize:10,color:"var(--t3)"}}>🔒 Stripe · Cancel anytime</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Oxquill() {
  var _view = useState("landing"); var view = _view[0]; var setView = _view[1];
  var _arts = useState([]); var articles = _arts[0]; var setArticles = _arts[1];
  var _sel = useState(null); var selArt = _sel[0]; var setSelArt = _sel[1];
  var _plan = useState("free"); var plan = _plan[0]; var setPlan = _plan[1];
  var _dark = useState(false); var dark = _dark[0]; var setDark = _dark[1];
  var _rtl = useState(false); var rtl = _rtl[0]; var setRtl = _rtl[1];
  var _cr = useState(10); var credits = _cr[0]; var setCredits = _cr[1];
  var _pay = useState(null); var payM = _pay[0]; var setPayM = _pay[1];
  var _share = useState(null); var shareM = _share[0]; var setShareM = _share[1];
  var _xp = useState(0); var xp = _xp[0]; var setXp = _xp[1];
  var _streak = useState(0); var streak = _streak[0]; var setStreak = _streak[1];
  var _search = useState(""); var search = _search[0]; var setSearch = _search[1];

  // Writer state
  var _topic = useState(""); var topic = _topic[0]; var setTopic = _topic[1];
  var _lang = useState("en"); var lang = _lang[0]; var setLang = _lang[1];
  var _tone = useState("Professional"); var tone = _tone[0]; var setTone = _tone[1];
  var _len = useState("medium"); var len = _len[0]; var setLen = _len[1];
  var _tmpl = useState("blog"); var tmpl = _tmpl[0]; var setTmpl = _tmpl[1];
  var _mood = useState(null); var mood = _mood[0]; var setMood = _mood[1];
  var _era = useState(null); var era = _era[0]; var setEra = _era[1];
  var _loading = useState(false); var loading = _loading[0]; var setLoading = _loading[1];
  var _result = useState(null); var result = _result[0]; var setResult = _result[1];
  var _copied = useState(false); var copied = _copied[0]; var setCopied = _copied[1];
  var _tid = useState(null); var toolId = _tid[0]; var setToolId = _tid[1];
  var _tr = useState(""); var toolResult = _tr[0]; var setToolResult = _tr[1];
  var _tl = useState(false); var toolLoading = _tl[0]; var setToolLoading = _tl[1];

  // Battle state
  var _b1 = useState(""); var bat1 = _b1[0]; var setBat1 = _b1[1];
  var _b2 = useState(""); var bat2 = _b2[0]; var setBat2 = _b2[1];
  var _br = useState(""); var batResult = _br[0]; var setBatResult = _br[1];
  var _bl = useState(false); var batLoading = _bl[0]; var setBatLoading = _bl[1];

  var P = PLANS[plan];
  var th = dark ? THD : THL;

  function go(v) { setView(v); setSelArt(null); }

  function useCredit(action) {
    var cost = COSTS[action] || 1;
    if (credits < cost) return false;
    setCredits(credits - cost);
    return true;
  }

  var cssVars = "";
  var keys = Object.keys(th);
  for (var i = 0; i < keys.length; i++) { cssVars += "--" + keys[i] + ":" + th[keys[i]] + ";"; }
  cssVars += "min-height:100vh;background:var(--bg);font-family:Plus Jakarta Sans,system-ui,sans-serif;color:var(--tx);overflow-x:hidden;direction:" + (rtl?"rtl":"ltr");

  var inp = {width:"100%",padding:"10px 13px",background:"var(--bg)",border:"1.5px solid var(--bd)",borderRadius:8,color:"var(--tx)",fontFamily:"inherit",fontSize:14,outline:"none"};
  var lab = {display:"block",fontSize:10,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"var(--t3)",marginBottom:5};
  function chip(active) { return {padding:"5px 12px",background:active?"var(--pr)":"var(--b3)",border:active?"none":"1px solid var(--bd)",borderRadius:99,color:active?"#fff":"var(--t2)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}; }
  function sbtn(active) { return {padding:"5px 11px",background:active?"var(--pr)":"var(--cd)",color:active?"#fff":"var(--pr)",border:active?"none":"1px solid var(--bd)",borderRadius:6,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}; }

  async function generate() {
    if (!topic.trim() || loading) return;
    if (!useCredit("generate")) { alert("Not enough credits!"); go("credits"); return; }
    setLoading(true); setResult(null); setToolId(null); setToolResult("");
    var ln = "English";
    for (var i = 0; i < LANGS.length; i++) { if (LANGS[i].v === lang) { ln = LANGS[i].l.replace(/^..\s/,""); break; } }
    var tp = "a blog article";
    for (var i = 0; i < TMPLS.length; i++) { if (TMPLS[i].id === tmpl) { tp = TMPLS[i].p; break; } }
    var extra = "";
    if (mood) extra += "\n- Mood: " + mood.p;
    if (era) extra += "\n- Style: " + era.p;
    try {
      var txt = await callAI("Write " + tp + " about: \"" + topic + "\"\n- Language: " + ln + "\n- Tone: " + tone + "\n- ~" + Math.min(len==="short"?800:len==="medium"?1500:2500, P.mW) + " words\n- # title, 4-6 ## subheadings, SEO, **Meta Description:**" + extra + "\nWrite the full article:");
      setResult(txt);
      var newArt = {id: Date.now(), topic:topic, lang:ln, tone:tone, mood:mood?mood.e:null, era:era?era.y:null, content:txt, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), words:txt.split(/\s+/).length, fav:false};
      setArticles([newArt].concat(articles));
      setXp(xp + 25);
      setStreak(streak + 1);
    } catch(e) { setResult("Error. Check connection."); }
    setLoading(false);
  }

  async function runTool(id) {
    if (!useCredit(id)) { alert("Not enough credits!"); return; }
    setToolId(id); setToolLoading(true); setToolResult("");
    var prompts = {
      roast: "Roast this article in a funny comedian style. Be savage but fun. Rate 1-10 at the end.\n\n" + result,
      viral: "Rate viral potential 1-100. Break down: Hook, Emotion, Shareability, Controversy, Headline. Give tips.\n\n" + result,
      remix: "Update this article to 2026. Refresh stats, examples, modernize.\n\n" + result,
      debate: "Write two articles about \"" + topic + "\":\n\n## FOR (500 words supporting)\n\n## AGAINST (500 words opposing)\n\nBoth well-reasoned.",
      summary: "Summarize in exactly 3 short sentences:\n\n" + result,
      titles: "Generate 10 SEO blog titles for: \"" + topic + "\". Rate each 1-10 for SEO.",
      thread: "Convert to Twitter/X thread of 8-12 tweets. Each under 280 chars. Numbered.\n\n" + result,
      linkedin: "Convert to LinkedIn post under 1300 chars. Professional. Add hashtags.\n\n" + result,
      repurpose: "Generate ALL from this article:\n1. Summary (3 lines)\n2. Twitter Thread (8 tweets)\n3. LinkedIn Post\n4. Instagram Caption with hashtags\n5. Email Subject Line\n\n" + result
    };
    try {
      var r = await callAI(prompts[id] || "Analyze:\n" + result);
      setToolResult(r); setXp(xp + 5);
    } catch(e) { setToolResult("Error."); }
    setToolLoading(false);
  }

  async function doBattle() {
    if (!bat1.trim() || !bat2.trim() || batLoading) return;
    if (!useCredit("battle")) { alert("Not enough credits!"); return; }
    setBatLoading(true); setBatResult("");
    try {
      var r = await callAI("ARTICLE BATTLE!\n\nARTICLE 1:\n" + bat1.slice(0,2000) + "\n\nARTICLE 2:\n" + bat2.slice(0,2000) + "\n\nJudge: Structure(20), SEO(20), Readability(20), Depth(20), Engagement(20). Total scores + declare winner. Be dramatic like a sports commentator!");
      setBatResult(r); setXp(xp + 20);
    } catch(e) { setBatResult("Error."); }
    setBatLoading(false);
  }

  var seo = 0;
  if (result && topic) {
    var w = result.toLowerCase();
    var kws = topic.toLowerCase().split(/\s+/);
    var hdCount = (result.match(/^#{1,3} /gm) || []).length;
    seo = Math.min(25, hdCount * 5) + (result.split(/\s+/).length > 500 ? 15 : 5);
    for (var i = 0; i < kws.length; i++) {
      var c = (w.match(new RegExp(kws[i],"g")) || []).length;
      seo += c > 0 ? (c / result.split(/\s+/).length * 100 > 0.5 ? 10 : 5) : 0;
    }
    if (result.indexOf("**Meta") >= 0) seo += 15;
    if (result.indexOf("- ") >= 0) seo += 10;
    seo = Math.min(100, seo);
  }
  var tags = topic ? topic.split(/\s+/).filter(function(w){return w.length>3}).map(function(w){return "#"+w.charAt(0).toUpperCase()+w.slice(1)}).concat(["#AI","#Content"]).slice(0,6) : [];

  return (
    <div ref={function(el){if(el)el.style.cssText=cssVars}}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}"}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,height:54,padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--nv)",backdropFilter:"blur(16px)",borderBottom:"1px solid var(--bd)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={function(){go("landing")}}>
          <div style={{width:30,height:30,borderRadius:7,background:"linear-gradient(135deg,var(--pr),#9B7BF0)",display:"grid",placeItems:"center",fontWeight:800,fontSize:11,color:"#fff"}}>Ox</div>
          <div style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:17,fontWeight:700}}>Oxquill</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:3}}>
          {[["✍️","writer"],["💰","pricing"],["🪙","credits"],["📚","articles"],["⚔️","battle"],["🏆","profile"]].map(function(x){
            return <button key={x[1]} onClick={function(){go(x[1])}} style={{padding:"4px 7px",background:view===x[1]?"var(--pS)":"none",border:"none",color:view===x[1]?"var(--pr)":"var(--t3)",fontSize:12,cursor:"pointer",borderRadius:5}}>{x[0]}</button>;
          })}
          <button onClick={function(){setDark(!dark)}} style={{padding:"3px 6px",background:"var(--b3)",border:"1px solid var(--bd)",borderRadius:4,fontSize:9,cursor:"pointer",color:"var(--t2)"}}>{dark?"☀":"🌙"}</button>
          <button onClick={function(){setRtl(!rtl)}} style={{padding:"3px 6px",background:"var(--b3)",border:"1px solid var(--bd)",borderRadius:4,fontSize:9,fontWeight:700,cursor:"pointer",color:"var(--pr)"}}>{rtl?"EN":"ع"}</button>
          <div onClick={function(){go("credits")}} style={{padding:"3px 8px",borderRadius:99,fontSize:9,fontWeight:700,background:"linear-gradient(135deg,#EFA935,#EF7B6C)",color:"#fff",cursor:"pointer"}}>🪙 {credits}</div>
          {streak>0 && <div style={{padding:"3px 6px",borderRadius:99,fontSize:9,fontWeight:700,background:"#FEECEC",color:"#D44"}}>🔥{streak}</div>}
        </div>
      </nav>

      <div style={{position:"relative",zIndex:1}}>

        {/* ═══ LANDING ═══ */}
        {view==="landing" && (
          <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"85px 20px 60px"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 13px",background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:99,fontSize:11,fontWeight:600,color:"var(--pr)",marginBottom:24,animation:"fadeUp .6s"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#3BBF85",animation:"pulse 2s infinite"}}></span>
              AI Writer · 28 Languages · Credits System
            </div>
            <h1 style={{fontFamily:"Source Serif 4,Georgia,serif",fontSize:"clamp(34px,7vw,70px)",fontWeight:900,lineHeight:1.08,maxWidth:680,marginBottom:16,animation:"fadeUp .6s .08s both"}}>
              Write <em style={{fontStyle:"italic",color:"#EF7B6C"}}>Brilliant</em> Content<br/>with <span style={{color:"var(--pr)"}}>AI Superpowers</span>
            </h1>
            <p style={{fontSize:"clamp(13px,2vw,16px)",color:"var(--t2)",maxWidth:440,lineHeight:1.75,marginBottom:32,animation:"fadeUp .6s .16s both"}}>
              Generate, roast, battle, remix, and repurpose content. 10 world-first AI tools.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp .6s .24s both"}}>
              <button onClick={function(){go("writer")}} style={{padding:"13px 30px",background:"var(--pr)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✦ Start Free (10 🪙)</button>
              <button onClick={function(){go("pricing")}} style={{padding:"13px 30px",background:"var(--cd)",color:"var(--tx)",border:"1.5px solid var(--bd)",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>View Plans</button>
            </div>
            <div style={{display:"flex",gap:8,marginTop:36,flexWrap:"wrap",justifyContent:"center",animation:"fadeUp .6s .32s both"}}>
              {[["⚔️","Battle"],["🔥","Roast"],["⏰","Time"],["😊","Mood"],["📈","Viral"],["⚖️","Debate"],["♻️","Remix"],["🪙","Credits"]].map(function(x,i){
                return <div key={i} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:8,padding:"8px 12px",textAlign:"center",minWidth:60}}>
                  <div style={{fontSize:18}}>{x[0]}</div><div style={{fontSize:8,color:"var(--t3)",fontWeight:600}}>{x[1]}</div></div>;
              })}
            </div>
          </section>
        )}

        {/* ═══ WRITER ═══ */}
        {view==="writer" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"74px 20px 50px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:21,fontWeight:900}}>✦ Writer</h2>
              <span style={{fontSize:11,fontWeight:700,color:"var(--pr)"}}>🪙 {credits} credits</span>
            </div>
            <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,padding:20}}>
              <div style={{marginBottom:12}}><label style={lab}>Template</label>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{TMPLS.map(function(tp){return <button key={tp.id} onClick={function(){setTmpl(tp.id)}} style={chip(tmpl===tp.id)}>{tp.ic} {tp.n}</button>})}</div></div>
              <div style={{marginBottom:12}}><label style={lab}>Topic</label>
                <input style={inp} placeholder="e.g. Future of AI" value={topic} onChange={function(e){setTopic(e.target.value)}} onKeyDown={function(e){if((e.ctrlKey||e.metaKey)&&e.key==="Enter")generate()}}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><label style={lab}>Language ({LANGS.slice(0,P.lng).length})</label><select style={inp} value={lang} onChange={function(e){setLang(e.target.value)}}>{LANGS.slice(0,P.lng).map(function(l){return <option key={l.v} value={l.v}>{l.l}</option>})}</select></div>
                <div><label style={lab}>Length</label><select style={inp} value={len} onChange={function(e){setLen(e.target.value)}}><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></div>
              </div>
              <div style={{marginBottom:12}}><label style={lab}>Tone</label><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{TONES.map(function(t){return <button key={t} onClick={function(){setTone(t)}} style={chip(tone===t)}>{t}</button>})}</div></div>
              <div style={{marginBottom:12}}><label style={lab}>😊 Mood Writing</label><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{MOODS.map(function(m){return <button key={m.n} onClick={function(){setMood(mood&&mood.n===m.n?null:m)}} style={chip(mood&&mood.n===m.n)}>{m.e} {m.n}</button>})}</div></div>
              <div style={{marginBottom:14}}><label style={lab}>⏰ Time Machine</label><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{ERAS.map(function(e){return <button key={e.y} onClick={function(){setEra(era&&era.y===e.y?null:e)}} style={chip(era&&era.y===e.y)}>{e.y}</button>})}</div></div>
              <button onClick={generate} disabled={loading||!topic.trim()} style={{width:"100%",padding:13,background:loading?"#8B96F5":"var(--pr)",color:"#fff",border:"none",borderRadius:9,fontSize:14,fontWeight:700,cursor:loading?"wait":"pointer",opacity:!topic.trim()&&!loading?0.5:1,fontFamily:"inherit"}}>
                {loading ? "Crafting..." : "✦ Generate (" + COSTS.generate + " 🪙)"}
              </button>
            </div>

            {/* RESULT */}
            {result && (
              <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,marginTop:16,overflow:"hidden",animation:"fadeUp .4s"}}>
                <div style={{padding:"10px 14px",background:"var(--b3)",borderBottom:"1px solid var(--bd)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4,marginBottom:6}}>
                    <span style={{fontSize:10,color:"var(--t3)"}}>{result.split(/\s+/).length}w · SEO:{seo}/100 · 🪙{credits}</span>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      <button style={sbtn()} onClick={function(){navigator.clipboard.writeText(result);setCopied(true);setTimeout(function(){setCopied(false)},2000)}}>{copied?"✓":"📋"}</button>
                      <button style={sbtn()} onClick={function(){exTXT(result,topic)}}>📝 TXT</button>
                      <button style={sbtn()} onClick={function(){exPDF(result,topic)}}>📄 PDF</button>
                      <button style={sbtn()} onClick={function(){exWord(result,topic)}}>📘 Word</button>
                      <button style={sbtn()} onClick={function(){setShareM({topic:topic})}}>📤</button>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {[["roast","🔥"],["viral","📈"],["remix","♻️"],["debate","⚖️"],["summary","📌"],["titles","💡"],["thread","🧵"],["linkedin","💼"],["repurpose","♻️ All"]].map(function(x){
                      return <button key={x[0]} style={sbtn()} onClick={function(){runTool(x[0])}}>{x[1]} <span style={{fontSize:9,opacity:0.7}}>{COSTS[x[0]]}🪙</span></button>;
                    })}
                    <button style={sbtn()} onClick={generate}>🔁</button>
                  </div>
                </div>
                {toolLoading && <div style={{padding:30,textAlign:"center"}}><div style={{fontSize:22}}>🛠</div><div style={{fontSize:12,color:"var(--t2)",marginTop:6}}>Working...</div></div>}
                {toolResult && !toolLoading && (
                  <div style={{borderBottom:"1px solid var(--bd)"}}>
                    <div style={{padding:"8px 14px",display:"flex",justifyContent:"space-between",background:"var(--bg)"}}>
                      <span style={{fontSize:11,fontWeight:600,color:"var(--pr)",textTransform:"capitalize"}}>{toolId}</span>
                      <div style={{display:"flex",gap:3}}>
                        <button style={sbtn()} onClick={function(){navigator.clipboard.writeText(toolResult)}}>📋</button>
                        <button style={sbtn()} onClick={function(){setToolResult("");setToolId(null)}}>✕</button>
                      </div>
                    </div>
                    <div style={{padding:14,fontSize:13,lineHeight:1.8,color:"var(--t2)",whiteSpace:"pre-wrap",maxHeight:350,overflowY:"auto"}}>{toolResult}</div>
                  </div>
                )}
                <div style={{padding:20,fontSize:14,lineHeight:1.85,color:"var(--t2)"}} dangerouslySetInnerHTML={{__html:"<style>"+astyle+"</style><div class='ax'>"+md2h(result)+"</div>"}}></div>
                <div style={{padding:"8px 14px",borderTop:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                  <div style={{display:"flex",gap:2}}>{tags.map(function(t,i){return <span key={i} style={{padding:"2px 5px",background:"var(--pS)",borderRadius:3,fontSize:8,fontWeight:600,color:"var(--pr)"}}>{t}</span>})}</div>
                  <span style={{fontSize:9,color:"var(--t3)"}}>Powered by Oxquill ✦</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ BATTLE ═══ */}
        {view==="battle" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"76px 20px 50px"}}>
            <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:22,fontWeight:900,marginBottom:16}}>⚔️ Article Battle ({COSTS.battle} 🪙)</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div><label style={lab}>🔵 Article 1</label><textarea value={bat1} onChange={function(e){setBat1(e.target.value)}} placeholder="Paste first article..." style={{width:"100%",height:180,padding:12,background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:9,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none",resize:"vertical"}}></textarea></div>
              <div><label style={lab}>🔴 Article 2</label><textarea value={bat2} onChange={function(e){setBat2(e.target.value)}} placeholder="Paste second article..." style={{width:"100%",height:180,padding:12,background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:9,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none",resize:"vertical"}}></textarea></div>
            </div>
            <button onClick={doBattle} disabled={batLoading||!bat1.trim()||!bat2.trim()} style={{width:"100%",padding:14,background:batLoading?"#8B96F5":"linear-gradient(135deg,#EF7B6C,#5B6CF0)",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:batLoading?"wait":"pointer",fontFamily:"inherit"}}>
              {batLoading ? "⚔️ Battling..." : "⚔️ START BATTLE!"}
            </button>
            {batResult && <div style={{marginTop:16,background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,padding:20,fontSize:14,lineHeight:1.8,color:"var(--t2)",whiteSpace:"pre-wrap"}}>{batResult}</div>}
          </div>
        )}

        {/* ═══ CREDITS ═══ */}
        {view==="credits" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"76px 20px 50px"}}>
            <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:22,fontWeight:900,marginBottom:16}}>🪙 Credits</h2>
            <div style={{background:"linear-gradient(135deg,var(--pr),#9B7BF0)",borderRadius:14,padding:"28px 24px",marginBottom:20,color:"#fff",textAlign:"center"}}>
              <div style={{fontSize:14,opacity:0.8}}>Your Balance</div>
              <div style={{fontSize:48,fontWeight:900}}>🪙 {credits}</div>
            </div>
            <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,padding:20,marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>💡 Costs per action</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:6}}>
                {Object.keys(COSTS).map(function(k){return <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"var(--b3)",borderRadius:8,fontSize:12}}><span style={{color:"var(--t2)",textTransform:"capitalize"}}>{k}</span><span style={{fontWeight:700,color:"var(--pr)"}}>{COSTS[k]} 🪙</span></div>})}
              </div>
            </div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>💳 Buy Credits</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
              {PACKS.map(function(pack){return (
                <div key={pack.credits} style={{background:"var(--cd)",border:pack.best?"2px solid var(--pr)":"1px solid var(--bd)",borderRadius:12,padding:"24px 18px",textAlign:"center",position:"relative"}}>
                  {pack.best && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"var(--pr)",color:"#fff",padding:"3px 12px",borderRadius:99,fontSize:9,fontWeight:800}}>🔥 BEST</div>}
                  <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:8}}>{pack.label}</div>
                  <div style={{fontSize:32,fontWeight:900,color:"var(--pr)"}}>🪙 {pack.credits}</div>
                  <div style={{fontSize:22,fontWeight:800,marginBottom:2}}>${pack.price}</div>
                  {pack.save && <div style={{fontSize:11,fontWeight:700,color:"#3BBF85",marginBottom:10}}>Save {pack.save}</div>}
                  <button onClick={function(){setPayM({price:pack.price,label:pack.credits+" Credits",onSuccess:function(){setCredits(credits+pack.credits)}})}} style={{width:"100%",padding:10,background:pack.best?"var(--pr)":"var(--b3)",color:pack.best?"#fff":"var(--tx)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Buy ${pack.price}</button>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* ═══ PRICING ═══ */}
        {view==="pricing" && (
          <div style={{padding:"80px 20px 60px"}}><div style={{maxWidth:1020,margin:"0 auto",textAlign:"center"}}>
            <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:"clamp(22px,4vw,36px)",fontWeight:900,marginBottom:24}}>Plans & Pricing</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
              {Object.keys(PLANS).map(function(k){var D=PLANS[k];var pop=k==="pro";return (
                <div key={k} style={{background:"var(--cd)",border:pop?"2px solid var(--pr)":"1px solid var(--bd)",borderRadius:12,padding:"26px 18px",textAlign:"center",position:"relative"}}>
                  {pop && <div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"var(--pr)",color:"#fff",padding:"3px 12px",borderRadius:99,fontSize:9,fontWeight:800}}>★ POPULAR</div>}
                  {plan===k && <div style={{position:"absolute",top:7,right:7,padding:"2px 7px",borderRadius:99,fontSize:8,fontWeight:700,background:"#EBF5EE",color:"#2D8A4E"}}>✓</div>}
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"var(--t3)",marginBottom:8}}>{D.n}</div>
                  <div style={{fontFamily:"Source Serif 4,serif",fontSize:34,fontWeight:900}}>${D.pr}<span style={{fontSize:13,color:"var(--t3)"}}>{D.pr>0?"/mo":""}</span></div>
                  <div style={{fontSize:18,fontWeight:700,color:"var(--pr)",margin:"8px 0"}}>🪙 {D.cr}/mo</div>
                  <button onClick={function(){if(plan===k||k==="free"){go("writer")}else{setPayM({price:D.pr,label:D.n+" Plan",onSuccess:function(){setPlan(k);setCredits(credits+D.cr)}})}}} style={{width:"100%",padding:11,background:pop?"var(--pr)":"var(--b3)",color:pop?"#fff":"var(--tx)",border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                    {plan===k?"Current":k==="free"?"Start Free":"Subscribe $"+D.pr+"/mo"}
                  </button>
                </div>
              )})}
            </div>
          </div></div>
        )}

        {/* ═══ ARTICLES ═══ */}
        {view==="articles" && !selArt && (
          <div style={{maxWidth:700,margin:"0 auto",padding:"76px 20px 50px"}}>
            <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:22,fontWeight:900,marginBottom:14}}>📚 Articles ({articles.length})</h2>
            <input value={search} onChange={function(e){setSearch(e.target.value)}} placeholder="🔍 Search..." style={{width:"100%",padding:"9px 13px",background:"var(--cd)",border:"1.5px solid var(--bd)",borderRadius:9,color:"var(--tx)",fontFamily:"inherit",fontSize:13,outline:"none",marginBottom:12}}/>
            {articles.filter(function(a){return a.topic.toLowerCase().indexOf(search.toLowerCase())>=0}).map(function(a){return (
              <div key={a.id} onClick={function(){setSelArt(a)}} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:9,padding:"14px 16px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><h3 style={{fontSize:13,fontWeight:600}}>{a.topic}</h3><p style={{fontSize:10,color:"var(--t3)"}}>{a.date} · {a.words}w · {a.tone}{a.mood?" · "+a.mood:""}{a.era?" · "+a.era:""}</p></div>
                <span style={{color:"var(--pr)"}}>→</span>
              </div>
            )})}
            {articles.length===0 && <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:34,marginBottom:8}}>📝</div><button onClick={function(){go("writer")}} style={{padding:"10px 22px",background:"var(--pr)",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Create Article</button></div>}
          </div>
        )}
        {view==="articles" && selArt && (
          <div style={{maxWidth:700,margin:"0 auto",padding:"76px 20px 50px"}}>
            <button onClick={function(){setSelArt(null)}} style={{background:"none",border:"none",color:"var(--pr)",fontSize:12,cursor:"pointer",marginBottom:14,fontFamily:"inherit",fontWeight:600}}>← Back</button>
            <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",background:"var(--b3)",borderBottom:"1px solid var(--bd)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
                <span style={{fontSize:10,color:"var(--t3)"}}>{selArt.words}w · {selArt.date} · {selArt.tone}</span>
                <div style={{display:"flex",gap:3}}>
                  <button style={sbtn()} onClick={function(){navigator.clipboard.writeText(selArt.content)}}>📋</button>
                  <button style={sbtn()} onClick={function(){exTXT(selArt.content,selArt.topic)}}>📝</button>
                  <button style={sbtn()} onClick={function(){exPDF(selArt.content,selArt.topic)}}>📄</button>
                  <button style={sbtn()} onClick={function(){exWord(selArt.content,selArt.topic)}}>📘</button>
                  <button style={sbtn()} onClick={function(){setShareM({topic:selArt.topic})}}>📤</button>
                </div>
              </div>
              <div style={{padding:22,fontSize:14,lineHeight:1.85,color:"var(--t2)"}} dangerouslySetInnerHTML={{__html:"<style>"+astyle+"</style><div class='ax'>"+md2h(selArt.content)+"</div>"}}></div>
              <div style={{padding:"8px 14px",borderTop:"1px solid var(--bd)",textAlign:"center",fontSize:9,color:"var(--t3)"}}>Oxquill ✦</div>
            </div>
          </div>
        )}

        {/* ═══ PROFILE ═══ */}
        {view==="profile" && (
          <div style={{maxWidth:700,margin:"0 auto",padding:"76px 20px 50px"}}>
            <h2 style={{fontFamily:"Source Serif 4,serif",fontSize:22,fontWeight:900,marginBottom:16}}>🏆 Profile</h2>
            <div style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:12,padding:20,marginBottom:14}}>
              <div style={{fontSize:26,fontWeight:900,color:"var(--pr)"}}>Level {(function(){for(var i=LEVELS.length-1;i>=0;i--){if(xp>=LEVELS[i].xp)return LEVELS[i].lv}return 1})()} — {(function(){for(var i=LEVELS.length-1;i>=0;i--){if(xp>=LEVELS[i].xp)return LEVELS[i].n}return"Beginner"})()}</div>
              <div style={{fontSize:16,color:"var(--t2)",marginTop:4}}>⚡ {xp} XP · 🪙 {credits} Credits · 🔥 {streak} Streak</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[[articles.length,"Articles","var(--pr)"],[articles.reduce(function(s,a){return s+a.words},0),"Words","#3BBF85"],[streak,"Streak","#EF7B6C"]].map(function(x,i){
                return <div key={i} style={{background:"var(--cd)",border:"1px solid var(--bd)",borderRadius:9,padding:"14px 10px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:x[2]}}>{typeof x[0]==="number"?x[0].toLocaleString():x[0]}</div><div style={{fontSize:10,color:"var(--t3)"}}>{x[1]}</div></div>;
              })}
            </div>
          </div>
        )}
      </div>

      <footer style={{borderTop:"1px solid var(--bd)",padding:"24px 20px",textAlign:"center"}}>
        <div style={{fontFamily:"Source Serif 4,serif",fontSize:14,fontWeight:700,color:"var(--pr)"}}>Oxquill</div>
        <p style={{fontSize:10,color:"var(--t3)"}}>© 2026 Oxquill. AI-Powered Content Engine.</p>
      </footer>

      {payM && <PayModal price={payM.price} label={payM.label} onClose={function(){setPayM(null)}} onSuccess={function(){if(payM.onSuccess)payM.onSuccess();setPayM(null)}}/>}
      {shareM && <ShareModal topic={shareM.topic} onClose={function(){setShareM(null)}}/>}
    </div>
  );
}