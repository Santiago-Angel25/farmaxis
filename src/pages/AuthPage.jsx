import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

function AuthPage({ mode }) {
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <AuthForm mode={mode} onNavigate={navigate} />
    </main>
  );
}

export default AuthPage;
