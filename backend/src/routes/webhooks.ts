import { Router } from 'express';
import { prisma } from '../db';
import { getValidToken } from './auth';

const router = Router();

router.post('/mercadolivre', async (req, res) => {
  const { topic, resource } = req.body;
  
  // O Mercado Livre exige que retornemos 200 OK imediatamente
  res.status(200).send('OK');

  console.log(`[Webhook ML] Recebido: ${topic} - ${resource}`);

  try {
    if (topic === 'orders_v2') {
      // 1. Busca os detalhes da ordem no ML usando o ID do recurso (ex: /orders/200000)
      const token = await getValidToken();
      const response = await fetch(`https://api.mercadolibre.com${resource}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error('Falha ao buscar detalhes da ordem no ML');
        return;
      }

      const orderData = await response.json();
      
      // 2. Itera sobre os itens comprados na ordem
      if (orderData.order_items && orderData.order_items.length > 0) {
        for (const item of orderData.order_items) {
          const mlItemId = item.item.id;
          const quantitySold = item.quantity;
          
          console.log(`[Webhook ML] Venda detectada: ML Item ${mlItemId} | Quantidade: ${quantitySold}`);

          // 3. Atualiza o estoque no banco local
          await prisma.product.updateMany({
            where: { mlItemId: mlItemId },
            data: {
              stockQuantity: {
                decrement: quantitySold
              }
            }
          });
          
          console.log(`[Webhook ML] Estoque atualizado para o item ${mlItemId}!`);
        }
      }
    }
    
    // Futuro: se o tópico for 'items', podemos sincronizar edições manuais feitas no ML.

  } catch (error) {
    console.error('[Webhook ML] Erro ao processar:', error);
  }
});

export default router;
