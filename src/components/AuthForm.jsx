import { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Field, Input } from "@fluentui/react-components";
import { Mail24Regular, Person24Regular, LockClosed24Regular, Eye24Regular, EyeOff24Regular } from "@fluentui/react-icons";
import { gsap } from "gsap";
import "../styles/Auth.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function AuthForm({ mode = "login", onClose, onNavigate }) {
  const isRegister = mode === "register";
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const tween = gsap.fromTo(cardRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
    return () => tween.kill();
  }, []);

  const errors = {
    name: !values.name.trim() ? "Escribe tu nombre completo." : values.name.trim().length < 3 ? "El nombre debe tener al menos 3 caracteres." : "",
    email: !values.email.trim() ? "Escribe tu correo electrónico." : !emailPattern.test(values.email.trim()) ? "Ingresa un correo electrónico válido." : "",
    password: !values.password ? "Escribe tu contraseña." : values.password.length < 8 ? "Usa al menos 8 caracteres." : "",
    confirm: values.confirm !== values.password ? "Las contraseñas no coinciden." : "",
  };

  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));
  const invalid = (key) => touched[key] && errors[key];
  const markTouched = (key) => () => setTouched((current) => ({ ...current, [key]: true }));

  const submit = (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true, terms: true });
    if (errors.email || errors.password || (isRegister && (errors.name || errors.confirm || !accepted))) return;
    setSubmitted(true);
  };

  return (
    <section className={`auth-card ${isRegister ? "auth-card--register" : ""}`} ref={cardRef} aria-labelledby="auth-title">
      <h1 id="auth-title">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <p className="auth-subtitle">{isRegister ? "Regístrate para disfrutar de todos los beneficios." : "Accede a tu cuenta para comprar más rápido."}</p>
      {submitted ? (
        <div className="auth-success" role="status">
          <span className="auth-success-icon">✓</span>
          <h2>{isRegister ? "¡Cuenta lista!" : "¡Listo para continuar!"}</h2>
          <p>{isRegister ? "Tu registro se validó en esta demostración. La creación de cuenta estará disponible al conectar el backend." : "Los datos se validaron correctamente. La autenticación estará disponible al conectar el backend."}</p>
          <Button appearance="primary" onClick={onClose || (() => onNavigate("/"))}>Continuar</Button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit} noValidate>
          {isRegister && <Field label="Nombre completo" validationState={invalid("name") ? "error" : "none"} validationMessage={invalid("name")}><Input autoComplete="name" placeholder="Tu nombre completo" contentBefore={<Person24Regular />} value={values.name} onChange={update("name")} onBlur={markTouched("name")} /></Field>}
          <Field label="Correo electrónico" validationState={invalid("email") ? "error" : "none"} validationMessage={invalid("email")}><Input type="email" autoComplete="email" placeholder="correo@ejemplo.com" contentBefore={<Mail24Regular />} value={values.email} onChange={update("email")} onBlur={markTouched("email")} /></Field>
          <Field label="Contraseña" validationState={invalid("password") ? "error" : "none"} validationMessage={invalid("password")}><Input type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Mínimo 8 caracteres" contentBefore={<LockClosed24Regular />} contentAfter={<button className="auth-reveal" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff24Regular /> : <Eye24Regular />}</button>} value={values.password} onChange={update("password")} onBlur={markTouched("password")} /></Field>
          {isRegister && <Field label="Confirmar contraseña" validationState={invalid("confirm") ? "error" : "none"} validationMessage={invalid("confirm")}><Input type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repite tu contraseña" contentBefore={<LockClosed24Regular />} value={values.confirm} onChange={update("confirm")} onBlur={markTouched("confirm")} /></Field>}
          {!isRegister && <button type="button" className="auth-forgot" onClick={() => window.alert("Pronto podrás recuperar tu contraseña cuando conectemos el servicio de autenticación.")}>¿Olvidaste tu contraseña?</button>}
          {isRegister && <div className="auth-terms"><Checkbox checked={accepted} onChange={(_, data) => setAccepted(Boolean(data.checked))} label={<span>Acepto los <a href="/terminos" onClick={(event) => event.preventDefault()}>términos y condiciones</a> y la <a href="/privacidad" onClick={(event) => event.preventDefault()}>política de privacidad</a>.</span>} />{touched.terms && !accepted && <span className="auth-error">Debes aceptar los términos para continuar.</span>}</div>}
          <Button className="auth-submit" appearance="primary" type="submit">{isRegister ? "Registrarme" : "Iniciar sesión"}</Button>
          {!isRegister && <Button className="auth-google" appearance="outline" type="button" onClick={() => window.alert("El acceso con Google estará disponible cuando conectemos el backend.")}><span className="google-mark">G</span>Continuar con Google</Button>}
          <p className="auth-switch">{isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"} <button type="button" onClick={() => onNavigate(isRegister ? "/iniciar-sesion" : "/crear-cuenta")}>{isRegister ? "Inicia sesión" : "Regístrate aquí"}</button></p>
        </form>
      )}
    </section>
  );
}

export default AuthForm;
