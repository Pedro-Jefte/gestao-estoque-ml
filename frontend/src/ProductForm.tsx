import React, { useState } from 'react';
import { PackageSearch, X } from 'lucide-react';

export default function ProductForm({ onCancel, onSave }: any) {
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    price: '',
    stockQuantity: 1,
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Falha ao salvar produto');
      
      const newProduct = await response.json();
      if (onSave) onSave(newProduct);
      
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#121212] border border-white/5 p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white">
            <PackageSearch className="h-5 w-5 text-[#22c55e]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Cadastrar Novo Produto</h2>
            <p className="text-sm text-[#888] font-medium">Adicione ao inventário e sincronize com o ML</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 rounded-md hover:bg-white/5 text-[#888] hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-[#888]">Nome do Produto</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Ex: Pneu Aro 15 Michelin Cinturato P1"
              required 
              autoFocus
              className="h-12 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 text-lg text-white font-bold placeholder:text-[#444] placeholder:font-medium focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="sku" className="text-sm font-bold text-[#888]">SKU / Código Referência</label>
            <input 
              type="text" 
              id="sku" 
              name="sku" 
              value={formData.sku} 
              onChange={handleChange} 
              placeholder="Ex: MIC-15-200"
              className="h-12 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 text-base text-white font-bold placeholder:text-[#444] focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-bold text-[#888]">Preço Venda (R$)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] font-bold">R$</span>
              <input 
                type="number" 
                step="0.01"
                id="price" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00"
                required
                className="h-12 w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-12 pr-4 text-xl text-white font-extrabold placeholder:text-[#444] focus:outline-none focus:border-[#22c55e]/50 focus:ring-1 focus:ring-[#22c55e]/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="stockQuantity" className="text-sm font-bold text-[#888]">Qtd Estoque Inicial</label>
            <input 
              type="number" 
              id="stockQuantity" 
              name="stockQuantity" 
              value={formData.stockQuantity} 
              onChange={handleChange} 
              min="0"
              required
              className="h-12 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 text-xl text-white font-extrabold placeholder:text-[#444] focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-bold text-[#888]">URL da Imagem (Opcional)</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              placeholder="https://exemplo.com/imagem.png"
              className="h-12 w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 text-base text-[#888] focus:outline-none focus:border-white/30 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
          <button 
            type="button" 
            onClick={onCancel}
            className="h-12 px-6 rounded-lg text-base font-bold text-[#aaa] hover:text-white hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="h-12 px-8 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e] hover:text-black hover:border-[#22c55e] text-base font-extrabold tracking-tight transition-all disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar no Banco'}
          </button>
        </div>
      </form>
    </div>
  );
}
