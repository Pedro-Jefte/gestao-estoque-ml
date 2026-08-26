import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    const { title, sku, price, stockQuantity, imageUrl } = req.body;
    
    // Convert to appropriate types
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stockQuantity, 10);

    let mlItemId = undefined;

    // Tenta publicar no Mercado Livre
    try {
      const { getValidToken } = await import('./auth');
      const token = await getValidToken();
      
      const mlData = {
        title: title,
        category_id: "MLB115206", // Categoria genérica de pneus
        price: parsedPrice,
        currency_id: "BRL",
        available_quantity: isNaN(parsedStock) ? 0 : parsedStock,
        buying_mode: "buy_it_now",
        condition: "new",
        listing_type_id: "gold_special", // Anúncio clássico
        pictures: [
          { source: imageUrl || "https://http2.mlstatic.com/D_NQ_NP_2X_784918-MLB42973715205_082020-F.webp" }
        ],
        attributes: [
          { id: "ITEM_CONDITION", value_id: "2230284" }
        ]
      };

      const mlResponse = await fetch('https://api.mercadolibre.com/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mlData)
      });

      const mlResult = await mlResponse.json();

      if (mlResponse.ok) {
        mlItemId = mlResult.id;
        console.log(`[ML Integração] Anúncio criado: ${mlItemId}`);
      } else {
        console.error(`[ML Integração] Erro ao criar anúncio:`, mlResult);
      }
    } catch (e) {
      console.log(`[ML Integração] Pulo: Conta não conectada ou erro de rede.`);
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        sku: sku || undefined,
        price: parsedPrice,
        stockQuantity: isNaN(parsedStock) ? 0 : parsedStock,
        imageUrl: imageUrl || undefined,
        mlItemId: mlItemId
      }
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

export default router;
