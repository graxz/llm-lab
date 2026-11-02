import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type HealthResponse = {
  status: string;
  service: string;
};

type RegisterResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
  workspace: {
    id: string;
    name: string;
  };
};

type ApiError = {
  code: string;
  message: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
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
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    setRegistration(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, password, passwordConfirmation }),
      });

      if (!response.ok) {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message);
      }

      setRegistration((await response.json()) as RegisterResponse);
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível concluir o cadastro.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">LLM Lab · Fase 1</p>
        <h1>Construa sua plataforma de IA por dentro.</h1>
        <p className="hero-copy">
          Primeiro vertical slice: cadastro, workspace inicial e uma base segura para as próximas capacidades da plataforma.
        </p>
        <div className="status-card">
          <span className={`status-dot ${health ? 'online' : ''}`} />
          {health ? `API online · ${health.service}` : healthError ?? 'Verificando API...'}
        </div>
      </section>

      <section className="card">
        <p className="eyebrow">RF-01</p>
        <h2>Crie sua conta</h2>
        <p className="muted">Seu primeiro workspace será criado automaticamente.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
          </label>
          <label>
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
          </label>
          <label>
            Confirme sua senha
            <input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required minLength={8} autoComplete="new-password" />
          </label>

          {formError && <p className="error-message" role="alert">{formError}</p>}
          {registration && (
            <p className="success-message" role="status">
              Cadastro concluído. Workspace criado: {registration.workspace.name}
            </p>
          )}

          <button type="submit" disabled={isSubmitting || !health}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
