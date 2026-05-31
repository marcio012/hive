---
id: WO-043
titulo: HIVE-026-B — Auth Frontend: substituir localStorage demo por auth real
backlog_ref: HIVE-026
debate_ref: beehive/construcao/debates/DEBATE-036-LOGIN-LANDING-HIVE.md
thread: login-landing-hive
executor: Gemini
status: pendente
data: 2026-05-30
workspace_hive: /home/marcio/job/hive
workspace_target: /home/marcio/job/hive
repo_target: hive
cwd_exec: /home/marcio/job/hive/apps/hive-ui/frontend
---

# WO-043 — Auth Frontend: substituir localStorage demo por auth real

## Contexto

O `App.tsx` já possui Landing Page, Login Page e lógica de rota protegida, mas usando `localStorage` (`hive-ui-demo-session`) como flag de sessão e `simulateLogin()` que apenas aguarda 700ms e autentica. Esta WO substitui esse mecanismo por chamadas reais à API de auth implementada na WO-042.

**Dependência:** WO-042 deve estar commitada e o backend rodando antes da validação final.

---

## Escopo

### 1. Remover funções de localStorage demo

Em `App.tsx`, remover completamente:

```typescript
// REMOVER estas duas funções:
function getStoredSession(): boolean {
  return window.localStorage.getItem('hive-ui-demo-session') === 'ok';
}

function setStoredSession(active: boolean): void {
  if (active) {
    window.localStorage.setItem('hive-ui-demo-session', 'ok');
    return;
  }
  window.localStorage.removeItem('hive-ui-demo-session');
}
```

### 2. Novo hook `useAuth`

Criar `src/hooks/useAuth.ts`:

```typescript
import { useCallback, useEffect, useState } from 'react';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export function useAuth() {
  const [status, setStatus] = useState<AuthState>('loading');

  useEffect(() => {
    fetch(`${API}/auth/session`, { credentials: 'include' })
      .then(r => { setStatus(r.ok ? 'authenticated' : 'unauthenticated'); })
      .catch(() => { setStatus('unauthenticated'); });
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });
    if (r.ok) setStatus('authenticated');
    return r.ok;
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    setStatus('unauthenticated');
  }, []);

  return { status, login, logout };
}
```

### 3. Atualizar `App.tsx`

#### 3a. Substituir estado de auth

```typescript
// ANTES:
const [authenticated, setAuthenticated] = useState<boolean>(() => getStoredSession());
const [submittingLogin, setSubmittingLogin] = useState(false);

// DEPOIS:
const { status: authStatus, login, logout: authLogout } = useAuth();
const authenticated = authStatus === 'authenticated';
const [submittingLogin, setSubmittingLogin] = useState(false);
```

#### 3b. Loading state durante verificação inicial

Adicionar antes dos renders condicionais:

```typescript
if (authStatus === 'loading') {
  return (
    <div className="auth-loading">
      <span className="dot gold pulse" />
    </div>
  );
}
```

#### 3c. Substituir `simulateLogin`

```typescript
// ANTES:
const simulateLogin = () => {
  setSubmittingLogin(true);
  window.setTimeout(() => enterCockpit('/mapa'), 700);
};

// DEPOIS:
const doLogin = async (username: string, password: string) => {
  setSubmittingLogin(true);
  const ok = await login(username, password);
  if (ok) {
    navigate('/mapa');
  } else {
    setSubmittingLogin(false);
    // LoginPage deve exibir erro — ver item 4
  }
};
```

#### 3d. Substituir `logout`

```typescript
// ANTES:
const logout = () => {
  setStoredSession(false);
  setAuthenticated(false);
  setSubmittingLogin(false);
  navigate('/landing');
};

// DEPOIS:
const logout = async () => {
  setSubmittingLogin(false);
  await authLogout();
  navigate('/landing');
};
```

#### 3e. Remover `enterCockpit` (não mais necessário após remoção do localStorage)

### 4. Atualizar `LoginPage` para receber credenciais e estado de erro

Ajustar `LoginPageProps`:

```typescript
type LoginPageProps = {
  submitting: boolean;
  error: boolean;             // novo
  onSubmit: (username: string, password: string) => void;  // alterado
  onBack: () => void;
};
```

No formulário:
- Remover `defaultValue="marcio"` e `defaultValue="hive-os"` dos inputs
- Capturar valores reais com `useRef` ou `useState` nos campos
- Se `error === true`, exibir mensagem abaixo do botão:
  ```tsx
  {error && <p className="login-error">Credenciais inválidas. Tente novamente.</p>}
  ```

### 5. CSS — loading e erro

Adicionar em `hive.css`:

```css
.auth-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  background: var(--bg);
}

.login-error {
  color: var(--red, #ff4d4d);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  text-align: center;
}
```

### 6. Variável de ambiente frontend

Em `apps/hive-ui/frontend/.env` (e `.env.example`):

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Critérios de Aceite

- **AC-01:** Ao carregar o app sem sessão, exibe loading dot → redireciona para `/landing` ou `/login`
- **AC-02:** Login com credenciais corretas seta cookie real e acessa o cockpit
- **AC-03:** Login com credenciais erradas exibe mensagem de erro no formulário
- **AC-04:** Botão "Sair" faz logout real (cookie removido) e redireciona para `/landing`
- **AC-05:** Recarregar a página com sessão válida mantém o usuário autenticado (cookie persiste)
- **AC-06:** `localStorage` não é mais usado para autenticação — `hive-ui-demo-session` não aparece no DevTools
- **AC-07:** Inputs de usuário e senha estão sem `defaultValue` hardcoded
- **AC-08:** `npm run check:types` e `npm run build` passam sem erros novos

## Validação

```bash
cd apps/hive-ui/frontend && npm run check:types
cd apps/hive-ui/frontend && npm run build
# Verificar no DevTools: Application > Cookies > http://localhost:5174
# Cookie hive_session deve aparecer após login com HttpOnly marcado
```
