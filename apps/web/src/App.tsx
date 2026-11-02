import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type HealthResponse = { status: string; service: string };
type AuthUser = { id: string; name: string; email: string; status: string };
type RegisterResponse = { user: AuthUser; workspace: { id: string; name: string } };
type ApiError = { code: string; message: string };
type AuthMode = 'register' | 'login';

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mode, setMode] = useState<AuthMode>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<RegisterResponse | null>(null);

  useEffect(() => {
    void fetch('http://localhost:3000/health')
      .then(async (response) => {
        if (!response.ok) throw new Error('The API returned an error.');
        return response.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch(() => setHealthError('Não foi possível conectar à API.'));

    void fetch('http://localhost:3000/auth/me', { credentials: 'include' })
      .then(async (response) => (response.ok ? (await response.json() as { user: AuthUser }).user : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  function resetForm(nextMode: AuthMode): void {
    setMode(nextMode);
    setFormError(null);
    setRegistration(null);
    setPassword('');
    setPasswordConfirmation('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    setRegistration(null);
    setIsSubmitting(true);

    try {
      const payload = mode === 'register'
        ? { name, email, password, passwordConfirmation }
        : { email, password };
      const response = await fetch(`http://localhost:3000/auth/${mode}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message);
      }

      const result = await response.json() as RegisterResponse | { user: AuthUser };
      setUser(result.user);
      if (mode === 'register') setRegistration(result as RegisterResponse);
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível concluir a operação.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout(): Promise<void> {
    await fetch('http://localhost:3000/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    resetForm('login');
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">LLM Lab · Fase 1</p>
        <h1>Construa sua plataforma de IA por dentro.</h1>
        <p className="hero-copy">Cadastro, sessão e workspace são a primeira fundação do produto.</p>
        <div className="status-card">
          <span className={`status-dot ${health ? 'online' : ''}`} />
          {health ? `API online · ${health.service}` : healthError ?? 'Verificando API...'}
        </div>
      </section>

      <section className="card">
        {user ? (
          <>
            <p className="eyebrow">Sessão ativa</p>
            <h2>Olá, {user.name}.</h2>
            <p className="muted">Você está autenticado como {user.email}.</p>
            <button type="button" onClick={() => void handleLogout()}>Sair</button>
          </>
        ) : (
          <>
            <div className="auth-tabs" role="tablist" aria-label="Autenticação">
              <button type="button" className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => resetForm('register')}>Criar conta</button>
              <button type="button" className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => resetForm('login')}>Entrar</button>
            </div>
            <p className="eyebrow">RF-02</p>
            <h2>{mode === 'register' ? 'Crie sua conta' : 'Entre na sua conta'}</h2>
            <p className="muted">{mode === 'register' ? 'Seu primeiro workspace será criado automaticamente.' : 'Sua sessão será mantida em cookie HTTP-only.'}</p>

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>Nome<input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" /></label>
              )}
              <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
              <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
              {mode === 'register' && (
                <label>Confirme sua senha<input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required minLength={8} autoComplete="new-password" /></label>
              )}
              {formError && <p className="error-message" role="alert">{formError}</p>}
              {registration && <p className="success-message" role="status">Cadastro concluído. Workspace criado: {registration.workspace.name}</p>}
              <button type="submit" disabled={isSubmitting || !health}>{isSubmitting ? 'Aguarde...' : mode === 'register' ? 'Criar conta' : 'Entrar'}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default App;
