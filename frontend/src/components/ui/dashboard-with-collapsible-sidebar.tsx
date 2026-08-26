"use client"
import React, { useState, useEffect } from "react";
import ProductForm from "../../ProductForm";
import {
  LayoutDashboard,
  PackageSearch,
  LineChart,
  Settings,
  ChevronDown,
  ChevronsRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Package,
  Bell,
  Search,
  Wallet,
  AlertCircle
} from "lucide-react";

export const Example = () => {
  const [selected, setSelected] = useState("Visão Geral");

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex min-h-screen w-full dark bg-[#0a0a0a] text-gray-100 font-sans selection:bg-white/10">
      <Sidebar selected={selected} setSelected={setSelected} />
      {selected === "Visão Geral" && <ExampleContent />}
      {selected === "Meus Pneus" && <ProductsContent />}
      {selected !== "Visão Geral" && selected !== "Meus Pneus" && (
        <div className="flex-1 bg-[#0a0a0a] p-10 flex items-center justify-center border-l border-white/5">
          <h2 className="text-2xl font-bold text-[#444]">Página em construção</h2>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ selected, setSelected }: any) => {
  const [open, setOpen] = useState(true);

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 transition-all duration-300 ease-in-out ${
        open ? 'w-[280px]' : 'w-[80px]'
      } bg-[#0a0a0a] border-r border-white/5 p-4 flex flex-col`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8 flex-1 mt-6">
        <div className="px-3 py-2 mb-2 text-sm font-bold text-[#888] uppercase tracking-wider">
          {open ? 'Mercado' : 'Mkt'}
        </div>
        <Option
          Icon={LayoutDashboard}
          title="Visão Geral"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={PackageSearch}
          title="Meus Pneus"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={LineChart}
          title="Vendas ML"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      {open && (
        <div className="pt-4 space-y-1 pb-12">
          <div className="px-3 py-2 mb-2 text-sm font-bold text-[#888] uppercase tracking-wider">
            Conta
          </div>
          <Option
            Icon={Settings}
            title="Configurações"
            selected={selected}
            setSelected={setSelected}
            open={open}
          />
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open }: any) => {
  const isSelected = selected === title;
  
  return (
    <button
      onClick={() => setSelected(title)}
      className={`relative flex h-12 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-white/10 text-white font-bold" 
          : "text-[#aaa] hover:bg-white/5 hover:text-white font-semibold"
      }`}
    >
      <div className="grid h-full w-[48px] place-content-center shrink-0">
        <Icon className="h-6 w-6" strokeWidth={2.5} />
      </div>
      
      {open && (
        <span
          className={`text-base whitespace-nowrap transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }: any) => {
  return (
    <div className="mb-2">
      <div className="flex cursor-pointer items-center justify-between rounded-md px-2 py-2 transition-colors hover:bg-white/5">
        <div className="flex items-center gap-4">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <span className="block text-xl font-extrabold tracking-tight text-white">
                  BorrachaPro
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-8 shrink-0 place-content-center">
      <Activity className="h-7 w-7 text-white" strokeWidth={3} />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-white/5 transition-colors hover:bg-white/5 bg-[#0a0a0a]"
    >
      <div className="flex items-center h-16 px-4">
        <div className="grid size-8 place-content-center shrink-0">
          <ChevronsRight
            className={`h-6 w-6 transition-transform duration-300 text-[#888] ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </button>
  );
};

const ProductsContent = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const res = await fetch(`${baseUrl}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (isAdding) {
    return (
      <div className="flex-1 bg-[#0a0a0a] p-6 lg:p-10 overflow-auto border-l border-white/5">
        <ProductForm onCancel={() => setIsAdding(false)} onSave={() => { setIsAdding(false); loadProducts(); }} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0a0a0a] p-6 lg:p-10 overflow-auto border-l border-white/5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Meus Pneus</h1>
          <p className="text-lg text-[#aaa]">Gerencie o inventário e cadastre novos produtos.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="px-6 py-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e] hover:text-black font-extrabold tracking-tight transition-all"
        >
          + Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-lg font-bold text-[#888]">
          <Activity className="h-5 w-5 animate-spin" />
          Carregando produtos do banco...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-xl bg-[#121212]">
          <Package className="h-12 w-12 text-[#444] mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Nenhum pneu cadastrado</h2>
          <p className="text-[#888] font-medium text-center">Comece adicionando seu primeiro produto para gerenciar o estoque.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="p-6 rounded-xl bg-[#121212] border border-white/5 flex flex-col gap-4 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold text-white leading-tight mb-1">{p.title}</span>
                  <span className="text-sm font-bold text-[#888]">SKU: {p.sku || 'N/A'}</span>
                </div>
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title} className="w-16 h-16 object-cover rounded bg-[#1a1a1a]" />
                )}
              </div>
              <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#888] mb-1">Preço Venda</span>
                  <span className="text-2xl font-black text-white">R$ {p.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-[#888] mb-1">Estoque</span>
                  <span className={`px-3 py-1 rounded text-sm font-bold tracking-wider ${p.stockQuantity > 0 ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20' : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20'}`}>
                    {p.stockQuantity} un
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ExampleContent = () => {
  return (
    <div className="flex-1 bg-[#0a0a0a] p-6 lg:p-10 overflow-auto border-l border-white/5">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center text-base font-medium text-[#aaa]">
          <span>Painel</span>
          <span className="mx-3">›</span>
          <span className="text-white font-bold">Visão Geral</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#888]" />
            <input 
              type="text" 
              placeholder="Buscar pneus, pedidos..." 
              className="h-11 w-72 bg-[#141414] border border-white/5 rounded-md pl-10 pr-4 text-base text-white placeholder:text-[#888] focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button className="p-2.5 rounded-md hover:bg-white/5 text-[#aaa] hover:text-white transition-colors">
            <Bell className="h-6 w-6" />
          </button>
          <button 
            onClick={() => {
              const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
              window.location.href = `${baseUrl}/api/auth/ml`;
            }}
            className="flex items-center gap-2 h-11 px-4 rounded-md bg-[#22c55e]/10 border border-[#22c55e]/20 hover:bg-[#22c55e] text-base font-bold text-[#22c55e] hover:text-black transition-all"
          >
            <Wallet className="h-5 w-5" />
            Conectar ML
          </button>
          <button className="h-11 w-11 rounded-md bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-lg font-bold text-white">
            BP
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Visão Geral do Estoque</h1>
        <p className="text-lg text-[#aaa]">Valores do portfólio, movimentações e alertas macro do seu galpão.</p>
      </div>
      
      {/* Stats Grid - Crypto Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#888]">Valor do Estoque</h3>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3">R$ 148.210<span className="text-xl text-[#888]">,27</span></p>
          <div className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-[#22c55e]" strokeWidth={3} />
            <span className="text-[#22c55e] font-bold">+2.41%</span>
            <span className="text-[#888] font-medium">vs. ontem</span>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#888]">Total de Pneus (Un)</h3>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3">1.134<span className="text-xl text-[#888]">,00</span></p>
          <div className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-[#22c55e]" strokeWidth={3} />
            <span className="text-[#22c55e] font-bold">+15 un</span>
            <span className="text-[#888] font-medium">entradas hoje</span>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#888]">Vendas ML (Hoje)</h3>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3">52<span className="text-xl text-[#888]">,00</span></p>
          <div className="flex items-center gap-2 text-base">
            <TrendingDown className="h-5 w-5 text-[#ef4444]" strokeWidth={3} />
            <span className="text-[#ef4444] font-bold">-2 vendas</span>
            <span className="text-[#888] font-medium">queda leve</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#888]">Índice de Estoque</h3>
          </div>
          <p className="text-4xl font-extrabold text-white tracking-tight leading-none mb-3">72</p>
          <div className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-[#22c55e]" strokeWidth={3} />
            <span className="text-[#22c55e] font-bold">Saudável</span>
            <span className="text-[#888] font-medium">na escala de 100</span>
          </div>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart / Signal Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl bg-[#121212] border border-white/5 p-6">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center font-black text-lg">
                    P
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-extrabold text-white">PIRELLI / ARO 15</h3>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 tracking-wider uppercase">
                        ● Live
                      </span>
                    </div>
                    <p className="text-base text-[#888] font-medium">Pneu Cinturato P1 - Mais Vendido</p>
                  </div>
                </div>
                <div className="flex bg-[#1a1a1a] p-1 rounded-lg border border-white/5 hidden sm:flex">
                  <button className="px-4 py-2 rounded-md text-sm font-bold bg-[#2a2a2a] text-white">Barras</button>
                  <button className="px-4 py-2 rounded-md text-sm font-bold text-[#888] hover:text-white">Linha</button>
                </div>
             </div>
             <div className="flex items-end gap-4 mb-10">
               <span className="text-5xl font-black text-white tracking-tight">R$ 420.18</span>
               <span className="text-lg font-bold text-[#22c55e] mb-1.5">+ R$ 12.50 (1.86%)</span>
             </div>
             
             {/* FIXED Mock Chart Area */}
             <div className="h-64 w-full border-b border-[#333] flex items-end justify-between px-2 pb-1 gap-1">
                {[...Array(35)].map((_, i) => {
                  const isGreen = Math.random() > 0.4;
                  const height = Math.floor(Math.random() * 70) + 10;
                  return (
                    <div key={i} className="flex flex-col items-center justify-end h-full w-full max-w-[12px] group">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 group-hover:opacity-80 ${isGreen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  )
                })}
             </div>
             <div className="flex justify-between text-sm font-semibold text-[#888] pt-4">
               <span>Mai 5</span>
               <span>Mai 6</span>
               <span>Mai 7</span>
               <span>Mai 8</span>
               <span>Mai 9</span>
               <span>Mai 10</span>
               <span>Mai 11</span>
             </div>
          </div>

          <div className="rounded-xl bg-[#121212] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-white">Sinais de Mercado</h3>
              <span className="text-sm font-bold text-[#888]">Última hora</span>
            </div>
            <div className="space-y-2">
              {[
                { tag: "MACRO", text: "Forte demanda por aro 15 detectada no ML (+2.4%)", time: "12m" },
                { tag: "ESTOQUE", text: "Lote de Goodyear ativado no galpão principal", time: "1h" },
                { tag: "ALERTA", text: "Nova tributação estadual afeta custo de frete", time: "3h" },
                { tag: "TECH", text: "API do Mercado Livre apresenta instabilidade leve", time: "4h" }
              ].map((signal, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 -mx-3 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 rounded text-xs font-black bg-[#1a1a1a] text-[#aaa] border border-white/10 w-20 text-center tracking-wider">
                      {signal.tag}
                    </span>
                    <span className="text-base font-semibold text-gray-200">{signal.text}</span>
                  </div>
                  <span className="text-sm font-bold text-[#888]">{signal.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-6">
          <div className="rounded-xl bg-[#121212] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-white">Top Produtos</h3>
              <button className="text-sm font-bold text-[#888] hover:text-white flex items-center gap-1">
                Ver todos <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { symbol: 'PIR', name: 'Pirelli Aro 15', price: 'R$ 420.18', change: '+1.86%', color: 'green' },
                { symbol: 'MIC', name: 'Michelin Aro 17', price: 'R$ 891.45', change: '+2.31%', color: 'green' },
                { symbol: 'GOO', name: 'Goodyear Aro 14', price: 'R$ 284.22', change: '+5.47%', color: 'green' },
                { symbol: 'CON', name: 'Continental Aro 16', price: 'R$ 612.80', change: '-0.42%', color: 'red' },
                { symbol: 'BRI', name: 'Bridgestone Aro 13', price: 'R$ 224.90', change: '+0.18%', color: 'green' }
              ].map((asset, i) => (
                <div key={i} className="flex items-center justify-between py-3 hover:bg-white/5 px-3 -mx-3 rounded-lg transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-sm font-black text-white">
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-white leading-tight mb-1">{asset.symbol}</div>
                      <div className="text-sm font-medium text-[#888] leading-tight">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base text-white font-bold leading-tight mb-1">{asset.price}</div>
                    <div className={`text-sm font-bold leading-tight ${asset.color === 'green' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {asset.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#121212] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-white">Estoque Crítico</h3>
              <button className="text-sm font-bold text-[#888] hover:text-white flex items-center gap-1">
                Abrir livro <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 text-xs font-bold text-[#888] mb-4 px-3 uppercase tracking-wider">
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Produto</div>
              <div className="col-span-1 text-right">Qtd</div>
            </div>

            <div className="space-y-2">
              {[
                { action: 'ZERADO', actionColor: 'text-[#ef4444] border-[#ef4444]/30', product: 'MIC', fullName: 'Michelin', qty: '0', status: 'red' },
                { action: 'BAIXO', actionColor: 'text-orange-500 border-orange-500/30', product: 'GOO', fullName: 'Goodyear', qty: '2', status: 'orange' },
                { action: 'MÉDIO', actionColor: 'text-[#22c55e] border-[#22c55e]/30', product: 'CON', fullName: 'Conti', qty: '8', status: 'green' },
                { action: 'ALTO', actionColor: 'text-[#22c55e] border-[#22c55e]/30', product: 'PIR', fullName: 'Pirelli', qty: '12', status: 'green' }
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 items-center py-3 hover:bg-white/5 px-3 -mx-3 rounded-lg transition-colors cursor-pointer text-base">
                  <div className={`col-span-1 font-extrabold ${row.actionColor} text-[11px] px-2 py-1 rounded bg-[#1a1a1a] w-fit border`}>
                    {row.action}
                  </div>
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="font-extrabold text-white">{row.product}</span>
                    <span className="text-[#888] text-sm font-medium">{row.fullName}</span>
                  </div>
                  <div className="col-span-1 text-right text-white font-extrabold flex justify-end items-center gap-3">
                    {row.qty}
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      row.status === 'green' ? 'bg-[#22c55e]' : 
                      row.status === 'orange' ? 'bg-orange-500' : 'bg-[#ef4444]'
                    } shadow-[0_0_8px_currentColor]`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
