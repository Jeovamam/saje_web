import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças na autenticação (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Evita redirecionamentos errados enquanto a sessão está sendo carregada
  if (loading) {
    return <div className="min-h-screen bg-background-dark" />;
  }

  return (
    <Routes>
      {/* Rota Raiz: Redireciona com base na sessão */}
      <Route
        path="/"
        element={
          session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Se o usuário já estiver logado, ele não deve ver Login ou Cadastro */}
      <Route
        path="/login"
        element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      
      <Route
        path="/register"
        element={session ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route
        path="/registration-success" element={<RegistrationSuccessPage />}
      />
      {/* Rota Protegida */}
      <Route
        path="/dashboard"
        element={
          session ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />
        }
      />
      <Route
        path="/forgot-password-success"
        element={<ForgotPasswordSuccess />
        }
      />
      <Route
        path="/reset-password"
        element={<ResetPassword />
        }
        />

      {/* Catch-all: Redireciona rotas inexistentes para a raiz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}