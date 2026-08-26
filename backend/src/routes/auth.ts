import { Router } from 'express';
import { prisma } from '../db';


const router = Router();

// O Mercado Livre exige que essa URL seja idêntica à configurada no painel deles.
// Em produção, aponte a env APP_URL para o seu backend no Render, ex: https://seu-backend.onrender.com
const APP_URL = process.env.APP_URL || 'http://localhost:3333';
const REDIRECT_URI = `${APP_URL}/api/auth/callback`;

// 1. Rota para iniciar o Login
router.get('/ml', (req, res) => {
  const APP_ID = process.env.MELI_APP_ID;
  console.log("Chamando /api/auth/ml. APP_ID=", APP_ID);
  
  if (!APP_ID) {
    return res.status(500).send("Erro: MELI_APP_ID não encontrado no servidor.");
  }
  
  const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// 2. Rota de Callback (Retorno do Mercado Livre)
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Código de autorização não fornecido.');
  }

  try {
    // Troca o código pelo Token de Acesso
    const APP_ID = process.env.MELI_APP_ID;
    const CLIENT_SECRET = process.env.MELI_CLIENT_SECRET;
    
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: APP_ID as string,
        client_secret: CLIENT_SECRET as string,
        code: code as string,
        redirect_uri: REDIRECT_URI
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao pegar token:', data);
      return res.status(500).send('Erro ao autenticar no Mercado Livre: ' + JSON.stringify(data));
    }

    const { access_token, refresh_token, expires_in, user_id } = data;

    // Calcula a expiração real
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Salva ou Atualiza no banco (config ID 1 único)
    await prisma.meliConfig.upsert({
      where: { id: 1 },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        userId: String(user_id)
      },
      create: {
        id: 1,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        userId: String(user_id)
      }
    });

    res.send(`
      <html>
        <body style="background: #0a0a0a; color: #22c55e; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh;">
          <div style="text-align: center;">
            <h1 style="font-size: 2rem;">✅ Conectado com Sucesso!</h1>
            <p style="color: #aaa;">Os tokens do Mercado Livre foram salvos no seu banco de dados.</p>
            <p>Você já pode fechar esta aba e voltar para a Dashboard.</p>
            <script>
              setTimeout(() => { window.close(); }, 5000);
            </script>
          </div>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error('Erro no callback ML:', error.message);
    res.status(500).send('Erro interno ao processar autenticação.');
  }
});

// Utilitário para pegar o token válido (faz refresh se necessário)
export async function getValidToken() {
  const config = await prisma.meliConfig.findUnique({ where: { id: 1 } });
  if (!config) throw new Error('Conta do ML não conectada.');

  // Se o token estiver perto de expirar (menos de 5 minutos), faz refresh
  if (config.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
    const APP_ID = process.env.MELI_APP_ID;
    const CLIENT_SECRET = process.env.MELI_CLIENT_SECRET;
    
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: APP_ID as string,
        client_secret: CLIENT_SECRET as string,
        refresh_token: config.refreshToken
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      const expiresAt = new Date(Date.now() + data.expires_in * 1000);
      await prisma.meliConfig.update({
        where: { id: 1 },
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt
        }
      });
      return data.access_token;
    } else {
      console.error('Erro ao fazer refresh:', data);
      throw new Error('Falha ao atualizar token do ML.');
    }
  }

  return config.accessToken;
}

export default router;
