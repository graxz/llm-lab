import { useEffect, useState } from 'react';

type HealthResponse = {
  status: string;
  service: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/health' )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('A API respondeu com erro.');
        }

        return response.json() as Promise<HealthResponse>;
      })
      .then((data) => {
        setHealth(data);
      })
      .catch(() => {
        setError('Não foi possível conectar à API.');
      });
  }, []);

  return (
    <main>
      <h1>LLM Lab</h1>

      <h2>Status da API</h2>

      {health && (
        <p>
          API online — serviço: {health.service}
        </p>
      )}

      {!health && !error && <p>Verificando API...</p>}

      {error && <p>{error}</p>}
    </main>
  );
}

export default App;
