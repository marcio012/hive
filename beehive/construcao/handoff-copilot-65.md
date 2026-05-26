# Handoff Copilot — Issue #65: V2-F1 Infra Twilio Sandbox + Webhook WhatsApp

**Data:** 2026-05-22
**Issue:** https://github.com/marcio012/white-label-mvp/issues/65
**Epic:** #64 — V2 Agente de Vendas
**Agente executor:** Copilot
**Claude:** executando #63 em paralelo (independentes)

---

## Contexto

Frente 1 do Agente de Vendas V2. Estabelece a integração com Twilio WhatsApp Sandbox e expõe o webhook que receberá mensagens. Tudo que as frentes F2–F6 precisam parte daqui.

---

## O que fazer

### 1. Instalar dependência
```bash
cd apps/core
npm install twilio
```

### 2. Variáveis de ambiente

Adicionar ao `.env.example`:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 3. Estrutura de arquivos

```
apps/core/src/whatsapp/
├── whatsapp.module.ts
├── whatsapp.controller.ts
└── whatsapp.service.ts
```

### 4. WhatsappModule

```typescript
// whatsapp.module.ts
@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
```

Registrar em `AppModule`.

### 5. WhatsappController

```typescript
@Public()
@SkipTenant()
@Controller('webhook')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('whatsapp')
  @HttpCode(200)
  async receive(
    @Req() req: Request,
    @Body() body: Record<string, string>,
    @Headers('x-twilio-signature') signature: string,
    @Res() res: Response,
  ): Promise<void> {
    const twiml = await this.whatsappService.handleIncoming(body, signature, req.url);
    res.type('text/xml');
    res.send(twiml);
  }
}
```

### 6. WhatsappService

```typescript
@Injectable()
export class WhatsappService {
  private readonly client: twilio.Twilio;
  private readonly authToken: string;

  constructor(private readonly config: ConfigService) {
    this.authToken = config.get<string>('TWILIO_AUTH_TOKEN') ?? '';
    this.client = twilio(
      config.get<string>('TWILIO_ACCOUNT_SID'),
      this.authToken,
    );
  }

  async handleIncoming(
    body: Record<string, string>,
    signature: string,
    url: string,
  ): Promise<string> {
    // Validar assinatura Twilio
    const webhookUrl = this.config.get<string>('APP_URL') + '/webhook/whatsapp';
    const valid = twilio.validateRequest(this.authToken, signature, webhookUrl, body);

    if (!valid) {
      throw new UnauthorizedException('Assinatura Twilio invalida');
    }

    const from = body['From'] ?? '';   // ex: whatsapp:+5511999998888
    const message = body['Body'] ?? '';

    // Por agora: echo simples — F2 vai substituir por state machine
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(`Recebido: ${message}`);
    return twiml.toString();
  }

  async sendMessage(to: string, text: string): Promise<void> {
    await this.client.messages.create({
      from: this.config.get<string>('TWILIO_WHATSAPP_FROM'),
      to,
      body: text,
    });
  }
}
```

### 7. Variável APP_URL

Adicionar ao `.env.example`:
```
APP_URL=https://seu-ngrok-url.ngrok.io
```

---

## Critérios de aceite

- [ ] `POST /webhook/whatsapp` com payload Twilio válido → responde 200 com TwiML
- [ ] Assinatura inválida → 401
- [ ] Module registrado no AppModule
- [ ] `WhatsappService.sendMessage()` exportado (F2 vai usar)
- [ ] `.env.example` atualizado com as 4 variáveis

---

## Padrão de referência

Ver `apps/core/src/produtos/` para padrão de módulo, controller e service.

---

## Commit

Padrão do repo: `feat(whatsapp): infra Twilio Sandbox + webhook WhatsApp (#65)`

Após entregar: comentar na issue #65 com DIR-039 e mover para Done no board.
