const localtunnel = require('localtunnel');

const SUBDOMAIN = 'borrachapromvp';
const PORT = 3333;
const LOCAL_HOST = '127.0.0.1'; // <-- ISSO AQUI RESOLVE O ERRO 502

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: PORT, local_host: LOCAL_HOST, subdomain: SUBDOMAIN });
    
    if (!tunnel.url.includes(SUBDOMAIN)) {
      console.log(`[TUNNEL] URL errada: ${tunnel.url}. O subdomínio está preso. Fechando e tentando de novo em 5s...`);
      tunnel.close();
      return; 
    }

    console.log(`[TUNNEL] SUCESSO! URL: ${tunnel.url}`);

    tunnel.on('close', () => {
      console.log('[TUNNEL] Fechado. Reiniciando em 2 segundos...');
      setTimeout(startTunnel, 2000);
    });
    
    tunnel.on('error', (err) => {
      console.error('[TUNNEL] Erro:', err);
      tunnel.close();
    });
  } catch (err) {
    console.error('[TUNNEL] Falha ao iniciar.', err.message);
    setTimeout(startTunnel, 5000);
  }
}

startTunnel();

// Keep alive
setInterval(() => {}, 60000);
