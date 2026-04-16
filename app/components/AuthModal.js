// ═══════════════════════════════════════════════════════════════════
// AUTH MODAL — Login + Signup + Forgot Password
// Real Google OAuth with official brand colors
// ═══════════════════════════════════════════════════════════════════
"use client";
import { useState } from "react";
import GoogleIcon from "./GoogleIcon";
import { signUp, signIn, signInWithGoogle, resetPassword } from "../lib/db";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthModal(props) {
  var onClose = props.onClose;
  var onSuccess = props.onSuccess;
  var initialMode = props.initialMode || "login";
  var rtl = props.rtl || false;

  var [mode, setMode] = useState(initialMode);
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [name, setName] = useState("");
  var [gender, setGender] = useState("neutral");
  var [errors, setErrors] = useState({});
  var [loading, setLoading] = useState(false);
  var [infoMsg, setInfoMsg] = useState("");

  var L = rtl ? {
    loginTitle: "أهلاً بعودتك",
    loginSub: "سجّل الدخول للمتابعة",
    signupTitle: "أنشئ حسابك",
    signupSub: "ابدأ بـ 10 كريديت مجاناً",
    resetTitle: "إعادة تعيين كلمة المرور",
    resetSub: "سنرسل لك رابط إعادة التعيين",
    continueGoogle: "الدخول بجوجل",
    or: "أو",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordHint: "8 أحرف على الأقل",
    name: "الاسم الكامل",
    gender: "الجنس (اختياري)",
    male: "ذكر",
    female: "أنثى",
    neutral: "أفضل عدم الذكر",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    sendReset: "إرسال الرابط",
    forgotPw: "نسيت كلمة المرور؟",
    noAccount: "لا تمتلك حساباً؟",
    hasAccount: "لديك حساب بالفعل؟",
    backToLogin: "العودة لتسجيل الدخول",
    terms: "بالتسجيل، توافق على الشروط وسياسة الخصوصية",
    invalidEmail: "بريد إلكتروني غير صحيح",
    weakPassword: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    nameRequired: "الاسم مطلوب",
    resetSent: "تم إرسال رابط إعادة التعيين! افحص بريدك.",
    checkEmail: "افحص بريدك لتأكيد الحساب!",
    loading: "جاري..."
  } : {
    loginTitle: "Welcome Back",
    loginSub: "Log in to continue",
    signupTitle: "Create Your Account",
    signupSub: "Start with 10 free credits",
    resetTitle: "Reset Password",
    resetSub: "We'll send you a reset link",
    continueGoogle: "Continue with Google",
    or: "or",
    email: "Email",
    password: "Password",
    passwordHint: "Min. 8 characters",
    name: "Full Name",
    gender: "Gender (optional)",
    male: "Male",
    female: "Female",
    neutral: "Prefer not to say",
    login: "Log In",
    signup: "Sign Up",
    sendReset: "Send Reset Link",
    forgotPw: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    backToLogin: "Back to login",
    terms: "By signing up, you agree to our Terms and Privacy Policy",
    invalidEmail: "Invalid email address",
    weakPassword: "Password must be at least 8 characters",
    nameRequired: "Name is required",
    resetSent: "Reset link sent! Check your inbox.",
    checkEmail: "Check your email to confirm your account!",
    loading: "Loading..."
  };

  async function handleGoogle() {
    setLoading(true);
    setErrors({});
    var result = await signInWithGoogle();
    if (result && result.error) {
      setErrors({ general: result.error.message });
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setErrors({});
    setInfoMsg("");

    if (mode === "reset") {
      if (!validateEmail(email)) {
        setErrors({ email: L.invalidEmail });
        return;
      }
      setLoading(true);
      var result = await resetPassword(email);
      setLoading(false);
      if (result.error) {
        setErrors({ general: result.error.message });
      } else {
        setInfoMsg(L.resetSent);
      }
      return;
    }

    var validationErrors = {};
    if (!validateEmail(email)) validationErrors.email = L.invalidEmail;
    if (password.length < 8) validationErrors.password = L.weakPassword;
    if (mode === "signup" && !name.trim()) validationErrors.name = L.nameRequired;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    var result;
    if (mode === "signup") {
      result = await signUp(email, password, name, gender);
      setLoading(false);
      if (result.error) {
        setErrors({ general: result.error.message });
      } else if (result.data && result.data.user) {
        if (!result.data.session) {
          setInfoMsg(L.checkEmail);
        } else {
          if (onSuccess) onSuccess(result.data.user);
        }
      }
    } else {
      result = await signIn(email, password);
      setLoading(false);
      if (result.error) {
        setErrors({ general: result.error.message });
      } else if (result.data && result.data.user) {
        if (onSuccess) onSuccess(result.data.user);
      }
    }
  }

  var isSignup = mode === "signup";
  var isReset = mode === "reset";
  var title = isReset ? L.resetTitle : isSignup ? L.signupTitle : L.loginTitle;
  var subtitle = isReset ? L.resetSub : isSignup ? L.signupSub : L.loginSub;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        padding: 16,
        direction: rtl ? "rtl" : "ltr"
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(8px)"
        }}
      />
      <div
        onClick={function(e) { e.stopPropagation(); }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 400,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--cd, #FFF)",
          borderRadius: 16,
          padding: 26,
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 13,
              background: "linear-gradient(135deg, #5B6CF0, #9B7BF0)",
              margin: "0 auto 12px",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 20,
              letterSpacing: -0.5
            }}
          >
            Ox
          </div>
          <div
            style={{
              fontFamily: "Source Serif 4, Georgia, serif",
              fontSize: 22,
              fontWeight: 900,
              color: "var(--tx, #1A1F36)",
              marginBottom: 4
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 12, color: "var(--t2, #4A5070)" }}>
            {subtitle}
          </div>
        </div>

        {!isReset && (
          <>
            <button
              onClick={handleGoogle}
              disabled={loading}
              style={{
                width: "100%",
                padding: 12,
                background: "#FFF",
                border: "1.5px solid #DADCE0",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer",
                color: "#3C4043",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 14,
                fontFamily: "inherit",
                transition: "background 0.15s, box-shadow 0.15s",
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={function(e) {
                if (!loading) {
                  e.currentTarget.style.background = "#F8F9FA";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,.08)";
                }
              }}
              onMouseLeave={function(e) {
                e.currentTarget.style.background = "#FFF";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <GoogleIcon size={20} />
              {L.continueGoogle}
            </button>

            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--t3, #8C92AB)",
                margin: "12px 0",
                position: "relative"
              }}
            >
              <span
                style={{
                  background: "var(--cd, #FFF)",
                  padding: "0 12px",
                  position: "relative",
                  zIndex: 1
                }}
              >
                {L.or}
              </span>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "var(--bd, #E4E8F1)"
                }}
              />
            </div>
          </>
        )}

        {isSignup && (
          <>
            <FormInput
              label={L.name}
              value={name}
              onChange={function(e) { setName(e.target.value); setErrors({ ...errors, name: null }); }}
              error={errors.name}
            />
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>{L.gender}</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                {[["male", "M", L.male], ["female", "F", L.female], ["neutral", "N", L.neutral]].map(function(g) {
                  var active = gender === g[0];
                  return (
                    <button
                      key={g[0]}
                      type="button"
                      onClick={function() { setGender(g[0]); }}
                      style={{
                        padding: "10px 4px",
                        background: active ? "#5B6CF0" : "var(--bg, #F7F8FC)",
                        border: "1.5px solid " + (active ? "#5B6CF0" : "var(--bd, #E4E8F1)"),
                        borderRadius: 8,
                        color: active ? "#fff" : "var(--t2, #4A5070)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 11,
                        fontWeight: 600
                      }}
                    >
                      {g[2]}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <FormInput
          label={L.email}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={function(e) { setEmail(e.target.value); setErrors({ ...errors, email: null }); }}
          error={errors.email}
        />

        {!isReset && (
          <FormInput
            label={L.password}
            type="password"
            placeholder={L.passwordHint}
            value={password}
            onChange={function(e) { setPassword(e.target.value); setErrors({ ...errors, password: null }); }}
            error={errors.password}
            hint={isSignup ? L.passwordHint : null}
          />
        )}

        {mode === "login" && (
          <div style={{ textAlign: rtl ? "left" : "right", marginBottom: 12 }}>
            <button
              type="button"
              onClick={function() { setMode("reset"); setErrors({}); }}
              style={{
                background: "none",
                border: "none",
                color: "#5B6CF0",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              {L.forgotPw}
            </button>
          </div>
        )}

        {errors.general && (
          <div
            style={{
              padding: 10,
              background: "rgba(239, 123, 108, 0.1)",
              border: "1px solid #EF7B6C",
              borderRadius: 8,
              color: "#D4453C",
              fontSize: 12,
              marginBottom: 12
            }}
          >
            {errors.general}
          </div>
        )}

        {infoMsg && (
          <div
            style={{
              padding: 10,
              background: "rgba(59, 191, 133, 0.1)",
              border: "1px solid #3BBF85",
              borderRadius: 8,
              color: "#2D8A4E",
              fontSize: 12,
              marginBottom: 12
            }}
          >
            {infoMsg}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: 13,
            background: loading ? "#8B96F5" : "#5B6CF0",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            fontFamily: "inherit",
            marginBottom: 10,
            transition: "background 0.15s"
          }}
        >
          {loading ? L.loading : isReset ? L.sendReset : isSignup ? L.signup : L.login}
        </button>

        {isSignup && (
          <div
            style={{
              fontSize: 10,
              color: "var(--t3, #8C92AB)",
              textAlign: "center",
              marginTop: 8,
              lineHeight: 1.5
            }}
          >
            {L.terms}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 12,
            color: "var(--t3, #8C92AB)"
          }}
        >
          {isReset ? (
            <button
              type="button"
              onClick={function() { setMode("login"); setErrors({}); setInfoMsg(""); }}
              style={{
                background: "none",
                border: "none",
                color: "#5B6CF0",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "inherit"
              }}
            >
              {L.backToLogin}
            </button>
          ) : (
            <>
              {isSignup ? L.hasAccount : L.noAccount}{" "}
              <button
                type="button"
                onClick={function() { setMode(isSignup ? "login" : "signup"); setErrors({}); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#5B6CF0",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "inherit",
                  marginInlineStart: 4
                }}
              >
                {isSignup ? L.login : L.signup}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

var labelStyle = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--t3, #8C92AB)",
  marginBottom: 5
};

function FormInput(props) {
  return (
    <div style={{ marginBottom: 12 }}>
      {props.label && <label style={labelStyle}>{props.label}</label>}
      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        style={{
          width: "100%",
          padding: "11px 13px",
          background: "var(--bg, #F7F8FC)",
          border: "1.5px solid " + (props.error ? "#EF7B6C" : "var(--bd, #E4E8F1)"),
          borderRadius: 8,
          color: "var(--tx, #1A1F36)",
          fontFamily: "inherit",
          fontSize: 14,
          outline: "none",
          transition: "border 0.15s"
        }}
      />
      {props.error && (
        <div style={{ fontSize: 10, color: "#D4453C", marginTop: 4 }}>
          {props.error}
        </div>
      )}
      {props.hint && !props.error && (
        <div style={{ fontSize: 10, color: "var(--t3, #8C92AB)", marginTop: 4 }}>
          {props.hint}
        </div>
      )}
    </div>
  );
}
