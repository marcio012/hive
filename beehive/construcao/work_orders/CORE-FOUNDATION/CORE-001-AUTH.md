# Work Order: CORE-001 — Auth Identity Service

## 🎯 Objetivo
Implementar o motor de autenticação central no NestJS para substituir o Auth legado do Express.

## 🛠️ Especificação Técnica
- **Modulo:** `AuthModule` (encapsulado).
- **Serviços:** 
  - `AuthService`: Lógica de validação de credenciais e geração de JWT.
  - `BcryptService`: Para hash de senhas (padrão 10 rounds).
- **Estratégia:** Passport-JWT.
- **Payload JWT:**
  ```json
  { "sub": "user_id", "tenantId": "cuid", "role": "admin|vendedor" }
  ```
- **Decorators:** Criar `@Public()` para rotas abertas e `@Roles('admin')` para controle de acesso.

## ✅ Critérios de Aceite
- [ ] Login retorna JWT assinado com a Secret da ENV.
- [ ] Senhas são salvas apenas em formato hash (Bcrypt).
- [ ] Tentativa de acesso sem Bearer Token retorna 401 Unauthorized.
