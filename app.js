/* Laboratorio de negocios — lógica multiproducto CUP/USD */
(() => {
  "use strict";

  const STORAGE_KEY = "lab-negocios-v3";
  const DAYS = { dia: 1, semanal: 7, quincenal: 15, mensual: 30 };
  const PERIOD_LABEL = {
    dia: "día",
    semanal: "semana",
    quincenal: "quincena",
    mensual: "mes",
  };
  const PERIOD_ARTICLE = {
    dia: "el día",
    semanal: "la semana",
    quincenal: "la quincena",
    mensual: "el mes",
  };

  /* Unidades = ventas típicas por DÍA. Costos/precios base en CUP. */
  const CATALOG = [
    {
      group: "Cafetería",
      items: [
        { name: "Café colado", units: 45, cost: 12, price: 35 },
        { name: "Café express", units: 30, cost: 18, price: 45 },
        { name: "Capuchino", units: 18, cost: 35, price: 85 },
        { name: "Café con leche", units: 25, cost: 22, price: 55 },
        { name: "Chocolate caliente", units: 12, cost: 30, price: 70 },
        { name: "Té / infusión", units: 10, cost: 15, price: 40 },
        { name: "Jugo natural", units: 16, cost: 25, price: 60 },
        { name: "Batido de fruta", units: 12, cost: 40, price: 90 },
        { name: "Refresco casero", units: 20, cost: 18, price: 45 },
        { name: "Agua embotellada", units: 25, cost: 20, price: 40 },
      ],
    },
    {
      group: "Dulces y pan",
      items: [
        { name: "Croqueta", units: 20, cost: 12, price: 30 },
        { name: "Empanada", units: 18, cost: 20, price: 45 },
        { name: "Pan dulce", units: 28, cost: 18, price: 40 },
        { name: "Pan de agua", units: 35, cost: 10, price: 25 },
        { name: "Galleta casera", units: 30, cost: 8, price: 20 },
        { name: "Turrón de maní", units: 15, cost: 15, price: 35 },
        { name: "Helado", units: 22, cost: 30, price: 70 },
        { name: "Cupcake", units: 12, cost: 40, price: 90 },
        { name: "Tarta porción", units: 8, cost: 60, price: 140 },
        { name: "Dulce de coco", units: 14, cost: 22, price: 50 },
        { name: "Merenguito", units: 25, cost: 6, price: 15 },
        { name: "Churros (3u)", units: 16, cost: 25, price: 55 },
      ],
    },
    {
      group: "Comida",
      items: [
        { name: "Pizza personal", units: 12, cost: 80, price: 180 },
        { name: "Pizza familiar", units: 5, cost: 220, price: 450 },
        { name: "Sandwich", units: 18, cost: 45, price: 100 },
        { name: "Hamburguesa", units: 14, cost: 70, price: 160 },
        { name: "Hot dog", units: 16, cost: 35, price: 80 },
        { name: "Plato del día", units: 10, cost: 120, price: 250 },
        { name: "Arroz + proteína", units: 12, cost: 100, price: 220 },
        { name: "Ensalada lista", units: 8, cost: 50, price: 120 },
        { name: "Sopa / caldo", units: 10, cost: 40, price: 100 },
        { name: "Taco / burrito", units: 15, cost: 55, price: 130 },
        { name: "Papas fritas", units: 20, cost: 25, price: 60 },
        { name: "Caja de almuerzo", units: 8, cost: 150, price: 300 },
      ],
    },
    {
      group: "Bebidas embotelladas",
      items: [
        { name: "Cerveza nacional", units: 20, cost: 80, price: 150 },
        { name: "Cerveza importada", units: 8, cost: 180, price: 320 },
        { name: "Refresco lata", units: 25, cost: 50, price: 100 },
        { name: "Jugo caja", units: 15, cost: 60, price: 110 },
        { name: "Energizante", units: 10, cost: 90, price: 180 },
        { name: "Vino copa", units: 6, cost: 120, price: 280 },
      ],
    },
    {
      group: "Ropa y accesorios",
      items: [
        { name: "Camiseta básica", units: 3, cost: 400, price: 850 },
        { name: "Camiseta estampada", units: 2, cost: 500, price: 1100 },
        { name: "Pantalón jeans", units: 1, cost: 900, price: 1800 },
        { name: "Short", units: 2, cost: 450, price: 950 },
        { name: "Vestido", units: 1, cost: 800, price: 1700 },
        { name: "Gorra", units: 4, cost: 150, price: 380 },
        { name: "Medias (par)", units: 6, cost: 80, price: 180 },
        { name: "Cinturón", units: 2, cost: 200, price: 450 },
        { name: "Bolso / mochila", units: 1, cost: 600, price: 1400 },
        { name: "Sandalias", units: 2, cost: 350, price: 750 },
        { name: "Zapatillas", units: 1, cost: 1200, price: 2500 },
        { name: "Pañuelo / bandana", units: 5, cost: 60, price: 150 },
      ],
    },
    {
      group: "Belleza y cuidado",
      items: [
        { name: "Corte de cabello", units: 6, cost: 40, price: 200 },
        { name: "Barba / afeitado", units: 5, cost: 20, price: 120 },
        { name: "Manicure", units: 5, cost: 35, price: 150 },
        { name: "Pedicure", units: 3, cost: 50, price: 200 },
        { name: "Tinte / color", units: 2, cost: 180, price: 500 },
        { name: "Tratamiento facial", units: 2, cost: 100, price: 350 },
        { name: "Maquillaje evento", units: 1, cost: 150, price: 500 },
        { name: "Depilación zona", units: 3, cost: 40, price: 180 },
        { name: "Shampoo (frasco)", units: 4, cost: 120, price: 250 },
        { name: "Crema corporal", units: 3, cost: 150, price: 320 },
      ],
    },
    {
      group: "Tecnología y servicios",
      items: [
        { name: "Reparación móvil", units: 2, cost: 200, price: 650 },
        { name: "Cambio de pantalla", units: 1, cost: 800, price: 1600 },
        { name: "Fundas / protectores", units: 5, cost: 80, price: 200 },
        { name: "Cargador", units: 4, cost: 150, price: 350 },
        { name: "Audífonos", units: 3, cost: 200, price: 450 },
        { name: "Recarga saldo", units: 12, cost: 0, price: 30 },
        { name: "Impresión página", units: 40, cost: 2, price: 10 },
        { name: "Fotocopia", units: 50, cost: 1, price: 5 },
        { name: "Diseño logo simple", units: 1, cost: 100, price: 800 },
        { name: "Soporte PC / laptop", units: 1, cost: 150, price: 500 },
      ],
    },
    {
      group: "Hogar y limpieza",
      items: [
        { name: "Detergente", units: 8, cost: 180, price: 320 },
        { name: "Jabón de baño", units: 12, cost: 40, price: 80 },
        { name: "Jabón de lavar", units: 10, cost: 50, price: 95 },
        { name: "Cloro / blanqueador", units: 6, cost: 70, price: 140 },
        { name: "Suavizante", units: 5, cost: 120, price: 230 },
        { name: "Esponja / fibra", units: 10, cost: 25, price: 55 },
        { name: "Vela aromática", units: 5, cost: 90, price: 200 },
        { name: "Bolsa de basura", units: 8, cost: 60, price: 120 },
        { name: "Papel higiénico (4u)", units: 7, cost: 150, price: 280 },
        { name: "Ambientador", units: 4, cost: 80, price: 170 },
      ],
    },
    {
      group: "Abarrotes y mercado",
      items: [
        { name: "Huevos (cartón)", units: 6, cost: 400, price: 550 },
        { name: "Aceite (litro)", units: 5, cost: 350, price: 480 },
        { name: "Arroz (lb)", units: 15, cost: 50, price: 80 },
        { name: "Frijoles (lb)", units: 10, cost: 80, price: 120 },
        { name: "Azúcar (lb)", units: 12, cost: 40, price: 65 },
        { name: "Café molido (lb)", units: 4, cost: 200, price: 320 },
        { name: "Leche en polvo", units: 3, cost: 450, price: 650 },
        { name: "Pasta / espagueti", units: 8, cost: 60, price: 100 },
        { name: "Atún lata", units: 6, cost: 120, price: 200 },
        { name: "Salsa de tomate", units: 7, cost: 50, price: 90 },
      ],
    },
    {
      group: "Agricultura urbana",
      items: [
        { name: "Tomate (lb)", units: 10, cost: 40, price: 80 },
        { name: "Lechuga", units: 8, cost: 30, price: 60 },
        { name: "Plátano (unidad)", units: 20, cost: 8, price: 20 },
        { name: "Aguacate", units: 6, cost: 50, price: 100 },
        { name: "Hierbas aromáticas", units: 5, cost: 20, price: 50 },
        { name: "Plantas ornamentales", units: 3, cost: 80, price: 200 },
        { name: "Semilleros", units: 4, cost: 30, price: 80 },
        { name: "Composta (bolsa)", units: 2, cost: 50, price: 120 },
      ],
    },
    {
      group: "Educación y oficio",
      items: [
        { name: "Clase particular 1h", units: 3, cost: 20, price: 200 },
        { name: "Curso corto (plaza)", units: 1, cost: 100, price: 600 },
        { name: "Cuaderno", units: 8, cost: 40, price: 90 },
        { name: "Lápices / bolígrafos", units: 15, cost: 15, price: 40 },
        { name: "Carpintería menor", units: 1, cost: 150, price: 500 },
        { name: "Costura / arreglo", units: 3, cost: 30, price: 150 },
        { name: "Clave / cerrajería", units: 2, cost: 50, price: 250 },
        { name: "Pintura habitación", units: 0.3, cost: 400, price: 1200 },
      ],
    },
    {
      group: "Transporte y mandados",
      items: [
        { name: "Viaje corto taxi", units: 8, cost: 50, price: 150 },
        { name: "Viaje medio", units: 5, cost: 100, price: 300 },
        { name: "Mandado / delivery", units: 10, cost: 20, price: 80 },
        { name: "Mudanza pequeña", units: 0.5, cost: 300, price: 1000 },
        { name: "Recarga gasolina (margen)", units: 4, cost: 0, price: 50 },
      ],
    },
  ];

  const PRESETS = {
    cafeteria: {
      name: "Cafetería de barrio",
      other: 400,
      products: [
        { name: "Café colado", units: 45, cost: 12, price: 35, active: true },
        { name: "Capuchino", units: 15, cost: 35, price: 85, active: true },
        { name: "Croqueta", units: 20, cost: 12, price: 30, active: true },
        { name: "Jugo natural", units: 12, cost: 25, price: 60, active: true },
      ],
    },
    dulceria: {
      name: "Dulcería y pan",
      other: 500,
      products: [
        { name: "Pan dulce", units: 30, cost: 18, price: 45, active: true },
        { name: "Helado", units: 20, cost: 30, price: 70, active: true },
        { name: "Empanada", units: 18, cost: 20, price: 45, active: true },
        { name: "Cupcake", units: 10, cost: 40, price: 90, active: true },
      ],
    },
    comida: {
      name: "Comida rápida",
      other: 800,
      products: [
        { name: "Hamburguesa", units: 14, cost: 70, price: 160, active: true },
        { name: "Pizza personal", units: 10, cost: 80, price: 180, active: true },
        { name: "Papas fritas", units: 18, cost: 25, price: 60, active: true },
        { name: "Refresco lata", units: 20, cost: 50, price: 100, active: true },
      ],
    },
    ropa: {
      name: "Ropa casual",
      other: 600,
      products: [
        { name: "Camiseta básica", units: 4, cost: 400, price: 850, active: true },
        { name: "Gorra", units: 5, cost: 150, price: 380, active: true },
        { name: "Short", units: 2, cost: 450, price: 950, active: true },
        { name: "Medias (par)", units: 6, cost: 80, price: 180, active: true },
      ],
    },
    belleza: {
      name: "Salón de belleza",
      other: 500,
      products: [
        { name: "Corte de cabello", units: 6, cost: 40, price: 200, active: true },
        { name: "Manicure", units: 5, cost: 35, price: 150, active: true },
        { name: "Pedicure", units: 3, cost: 50, price: 200, active: true },
        { name: "Barba / afeitado", units: 4, cost: 20, price: 120, active: true },
      ],
    },
    mercado: {
      name: "Ventas de mercado",
      other: 300,
      products: [
        { name: "Arroz (lb)", units: 15, cost: 50, price: 80, active: true },
        { name: "Huevos (cartón)", units: 5, cost: 400, price: 550, active: true },
        { name: "Aceite (litro)", units: 4, cost: 350, price: 480, active: true },
        { name: "Tomate (lb)", units: 10, cost: 40, price: 80, active: true },
      ],
    },
    tech: {
      name: "Tecnología barrio",
      other: 400,
      products: [
        { name: "Reparación móvil", units: 2, cost: 200, price: 650, active: true },
        { name: "Fundas / protectores", units: 5, cost: 80, price: 200, active: true },
        { name: "Cargador", units: 4, cost: 150, price: 350, active: true },
        { name: "Recarga saldo", units: 12, cost: 0, price: 30, active: true },
      ],
    },
  };

  let state = loadState();

  function uid() {
    return "p_" + Math.random().toString(36).slice(2, 10);
  }

  function defaultState() {
    return {
      currency: "CUP",
      rate: 400,
      period: "mensual",
      linked: true,
      other: 300,
      products: [
        {
          id: uid(),
          name: "Producto 1",
          units: 20,
          cost: 100,
          price: 150,
          active: true,
        },
      ],
      activos: [],
      openId: null,
      catalogOpen: false,
      catalogQuery: "",
      catalogGroup: "Todos",
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        products: (parsed.products || base.products).map((p) => ({
          active: true,
          ...p,
          id: p.id || uid(),
        })),
        activos: parsed.activos || [],
      };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    const { openId, catalogOpen, catalogQuery, catalogGroup, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }

  function n(v) {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  }

  function convert(amount, from, to, rate) {
    if (from === to) return amount;
    if (from === "CUP" && to === "USD") return amount / rate;
    return amount * rate;
  }

  function formatMoney(amount, currency) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (currency === "USD") {
      return (
        sign +
        "$" +
        abs.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
    return (
      sign +
      Math.round(abs).toLocaleString("es-CU") +
      " CUP"
    );
  }

  function priceForMargin(cost, margin) {
    if (margin <= 0 || margin >= 1) return cost;
    return Math.round((cost / (1 - margin)) * 100) / 100;
  }

  function scaleUnits(unitsDaily, period) {
    return unitsDaily * DAYS[period];
  }

  function productContribution(p, period) {
    if (!p.active) return 0;
    const units = n(p.units);
    return (n(p.price) - n(p.cost)) * units;
  }

  function totals(period) {
    const products = state.products;
    let revenue = 0;
    let cogs = 0;
    let units = 0;
    for (const p of products) {
      if (!p.active) continue;
      const u = n(p.units);
      units += u;
      revenue += u * n(p.price);
      cogs += u * n(p.cost);
    }
    const other = n(state.other);
    const contribution = revenue - cogs;
    const profit = contribution - other;
    const ticket = units > 0 ? revenue / units : 0;
    return { revenue, cogs, other, contribution, profit, units, ticket };
  }

  function projectPeriod(basePeriod, targetPeriod, t) {
    const factor = DAYS[targetPeriod] / DAYS[basePeriod];
    return {
      revenue: t.revenue * factor,
      cogs: t.cogs * factor,
      other: t.other * factor,
      contribution: t.contribution * factor,
      profit: t.profit * factor,
      units: t.units * factor,
      ticket: t.ticket,
    };
  }

  function setCurrency(next) {
    if (next === state.currency) return;
    const rate = Math.max(1, n(state.rate));
    state.products = state.products.map((p) => ({
      ...p,
      cost: convert(n(p.cost), state.currency, next, rate),
      price: convert(n(p.price), state.currency, next, rate),
    }));
    state.other = convert(n(state.other), state.currency, next, rate);
    state.activos = state.activos.map((a) => ({
      ...a,
      profit: convert(n(a.profit), state.currency, next, rate),
    }));
    state.currency = next;
    saveState();
    render();
  }

  function setPeriod(next) {
    if (next === state.period) return;
    if (state.linked) {
      const factor = DAYS[next] / DAYS[state.period];
      state.products = state.products.map((p) => ({
        ...p,
        units: Math.round(n(p.units) * factor * 100) / 100,
      }));
      state.other = Math.round(n(state.other) * factor * 100) / 100;
    }
    state.period = next;
    saveState();
    render();
  }

  function updateProduct(id, patch, soft = false) {
    state.products = state.products.map((p) =>
      p.id === id ? { ...p, ...patch } : p
    );
    saveState();
    if (soft) {
      updateLiveNumbers();
      return;
    }
    render();
  }

  /** Actualiza cifras visibles sin reconstruir el DOM (evita saltos al escribir). */
  function updateLiveNumbers() {
    const cur = state.currency;
    for (const p of state.products) {
      const el = document.querySelector(`[data-aporte="${p.id}"]`);
      if (!el) continue;
      const contrib = productContribution(p, state.period);
      el.textContent =
        (contrib >= 0 ? "+" : "") + formatMoney(contrib, cur);
      el.className =
        "aporte " +
        (!p.active ? "muted" : contrib >= 0 ? "gain" : "loss");
    }
    const t = totals(state.period);
    const hero = document.querySelector("[data-hero-profit]");
    if (hero) {
      hero.textContent =
        (t.profit >= 0 ? "+" : "") + formatMoney(t.profit, cur);
      hero.className = "value " + (t.profit >= 0 ? "gain" : "loss");
    }
    const map = {
      revenue: t.revenue,
      cogs: t.cogs,
      contribution: t.contribution,
      other: t.other,
      restock: t.cogs,
      ticket: t.ticket,
    };
    for (const [k, v] of Object.entries(map)) {
      const el = document.querySelector(`[data-metric="${k}"]`);
      if (el) el.textContent = formatMoney(v, cur);
    }
    const insight = document.querySelector("[data-insight]");
    if (insight) insight.innerHTML = insightText(t);
    const periods = ["dia", "semanal", "quincenal", "mensual"];
    const projected = {};
    for (const p of periods) {
      projected[p] = projectPeriod(state.period, p, t);
    }
    const maxAbs = Math.max(
      1,
      ...periods.map((p) => Math.abs(projected[p].profit))
    );
    for (const p of periods) {
      const profit = projected[p].profit;
      const pct = Math.min(100, (Math.abs(profit) / maxAbs) * 100);
      const fill = document.querySelector(`[data-bar-fill="${p}"]`);
      const amt = document.querySelector(`[data-bar-amt="${p}"]`);
      if (fill) {
        fill.style.width = pct + "%";
        fill.className = "bar-fill" + (profit < 0 ? " neg" : "");
      }
      if (amt) {
        amt.textContent =
          (profit >= 0 ? "+" : "") + formatMoney(profit, cur);
      }
    }
    const reg = document.querySelector("[data-register-label]");
    if (reg) {
      const monthly = projectPeriod(state.period, "mensual", t);
      reg.textContent = `Registrar ${monthly.profit >= 0 ? "+" : ""}${formatMoney(monthly.profit, cur)}/mes`;
    }
  }

  function addProduct(data) {
    const p = {
      id: uid(),
      name: data.name || "Nuevo producto",
      units: n(data.units) || 10,
      cost: n(data.cost) || 50,
      price: n(data.price) || 100,
      active: true,
    };
    state.products.push(p);
    state.openId = p.id;
    state.catalogOpen = false;
    saveState();
    render();
  }

  function addFromCatalog(item) {
    // Catálogo en unidades/día; escalar al periodo actual
    const units = scaleUnits(item.units, state.period);
    let cost = item.cost;
    let price = item.price;
    if (state.currency === "USD") {
      cost = convert(cost, "CUP", "USD", state.rate);
      price = convert(price, "CUP", "USD", state.rate);
    }
    addProduct({ name: item.name, units, cost, price });
  }

  function removeProduct(id) {
    state.products = state.products.filter((p) => p.id !== id);
    if (state.openId === id) state.openId = null;
    saveState();
    render();
  }

  function duplicateProduct(id) {
    const src = state.products.find((p) => p.id === id);
    if (!src) return;
    addProduct({
      name: src.name + " (copia)",
      units: src.units,
      cost: src.cost,
      price: src.price,
    });
  }

  function registerActivo() {
    const t = totals(state.period);
    const monthly = projectPeriod(state.period, "mensual", t);
    const name =
      state.products
        .filter((p) => p.active)
        .map((p) => p.name)
        .slice(0, 3)
        .join(" · ") || "Simulación";
    state.activos.unshift({
      id: uid(),
      name,
      profit: monthly.profit,
      currency: state.currency,
      at: Date.now(),
    });
    state.activos = state.activos.slice(0, 12);
    saveState();
    render();
  }

  function loadPreset(key) {
    const preset = PRESETS[key];
    if (!preset) return;
    const factor = DAYS[state.period];
    state.products = preset.products.map((p) => {
      let cost = p.cost;
      let price = p.price;
      if (state.currency === "USD") {
        cost = convert(cost, "CUP", "USD", state.rate);
        price = convert(price, "CUP", "USD", state.rate);
      }
      return {
        id: uid(),
        name: p.name,
        units: p.units * factor,
        cost,
        price,
        active: true,
      };
    });
    let other = preset.other * factor;
    if (state.currency === "USD") {
      other = convert(other, "CUP", "USD", state.rate);
    }
    state.other = other;
    state.openId = null;
    saveState();
    render();
  }

  function insightText(t) {
    const cur = state.currency;
    const per = PERIOD_ARTICLE[state.period];
    if (t.units <= 0) {
      return "Agrega unidades a vender en al menos un producto activo para ver la simulación.";
    }
    if (t.profit > 0) {
      return `Con este ritmo ganas <strong>${formatMoney(t.profit, cur)}</strong> en ${per}. El aporte de los productos cubre los otros gastos y deja margen.`;
    }
    if (t.profit === 0) {
      return `Estás en el punto de equilibrio en ${per}: ingresos y costos se compensan.`;
    }
    const need = Math.abs(t.profit);
    return `En ${per} pierdes <strong>${formatMoney(need, cur)}</strong>. Sube precio, baja costo o aumenta unidades para volver positivo.`;
  }

  /**
   * Tap fiable SIN romper el scroll del WebView.
   * Solo cuenta como tap si el dedo casi no se movió.
   */
  function bindTap(node, handler) {
    const MOVE_MAX = 14;
    let startX = 0;
    let startY = 0;
    let moved = false;
    let tracking = false;
    let lastTap = 0;

    node.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        startX = t.clientX;
        startY = t.clientY;
        moved = false;
        tracking = true;
      },
      { passive: true }
    );

    node.addEventListener(
      "touchmove",
      (e) => {
        if (!tracking) return;
        const t = e.changedTouches[0];
        if (
          Math.abs(t.clientX - startX) > MOVE_MAX ||
          Math.abs(t.clientY - startY) > MOVE_MAX
        ) {
          moved = true;
        }
      },
      { passive: true }
    );

    node.addEventListener(
      "touchend",
      (e) => {
        if (!tracking) return;
        tracking = false;
        if (moved) return; // gesto de scroll → no es tap
        lastTap = Date.now();
        // NUNCA preventDefault aquí: bloqueaba el scroll de la página
        handler(e);
      },
      { passive: true }
    );

    node.addEventListener("touchcancel", () => {
      tracking = false;
      moved = true;
    });

    node.addEventListener("click", (e) => {
      // Evita doble acción si ya hubo touchend
      if (Date.now() - lastTap < 400) return;
      handler(e);
    });
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === "className") node.className = v;
        else if (k === "dataset") Object.assign(node.dataset, v);
        else if (k === "onClick" && typeof v === "function") {
          bindTap(node, v);
        } else if (k.startsWith("on") && typeof v === "function") {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else if (k === "html") node.innerHTML = v;
        else if (v !== false && v != null) node.setAttribute(k, v === true ? "" : v);
      }
    }
    if (children != null) {
      const list = Array.isArray(children) ? children : [children];
      for (const c of list) {
        if (c == null || c === false) continue;
        node.appendChild(
          typeof c === "string" || typeof c === "number"
            ? document.createTextNode(String(c))
            : c
        );
      }
    }
    return node;
  }

  function render() {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const active = document.activeElement;
    let restore = null;
    if (active && active.getAttribute && active.getAttribute("data-focus-key")) {
      restore = {
        key: active.getAttribute("data-focus-key"),
        start: active.selectionStart,
        end: active.selectionEnd,
      };
    }

    const root = document.getElementById("app");
    root.innerHTML = "";
    const cur = state.currency;
    const t = totals(state.period);
    const periods = ["dia", "semanal", "quincenal", "mensual"];
    const projected = {};
    for (const p of periods) {
      projected[p] = projectPeriod(state.period, p, t);
    }
    const maxAbs = Math.max(
      1,
      ...periods.map((p) => Math.abs(projected[p].profit))
    );

    // Brand
    root.appendChild(
      el("header", { className: "brand span-full" }, [
        el("div", { className: "brand-kicker" }, "Camino a la Libertad"),
        el("h1", null, "Laboratorio de negocios"),
        el(
          "p",
          null,
          "Simula varios productos, compara periodos y decide en CUP o USD antes de arriesgar dinero real."
        ),
      ])
    );

    // Toolbar: period + currency
    const toolbar = el("div", { className: "toolbar span-full" });
    const periodRow = el("div", { className: "chip-row" });
    for (const p of periods) {
      periodRow.appendChild(
        el(
          "button",
          {
            className: "chip" + (state.period === p ? " active" : ""),
            type: "button",
            onClick: () => setPeriod(p),
          },
          PERIOD_LABEL[p].charAt(0).toUpperCase() + PERIOD_LABEL[p].slice(1)
        )
      );
    }
    toolbar.appendChild(periodRow);

    const curRow = el("div", { className: "chip-row" });
    for (const c of ["CUP", "USD"]) {
      curRow.appendChild(
        el(
          "button",
          {
            className: "chip" + (state.currency === c ? " active" : ""),
            type: "button",
            onClick: () => setCurrency(c),
          },
          c
        )
      );
    }
    toolbar.appendChild(curRow);
    root.appendChild(toolbar);

    // Linked + rate
    const controls = el("div", { className: "card span-full" }, [
      el("h2", null, "Controles"),
      el("div", { className: "switch-row", style: "margin-bottom:0.75rem" }, [
        el("span", null, "Mismo ritmo al cambiar periodo (escala unidades y gastos)"),
        el("button", {
          className: "switch" + (state.linked ? " on" : ""),
          type: "button",
          role: "switch",
          "aria-checked": String(state.linked),
          onClick: () => {
            state.linked = !state.linked;
            saveState();
            render();
          },
        }),
      ]),
      el("div", { className: "rate-box" }, [
        el("span", null, "Tasa CUP por 1 USD:"),
        el("input", {
          type: "number",
          min: "1",
          step: "1",
          value: String(state.rate),
          onInput: (e) => {
            state.rate = Math.max(1, n(e.target.value));
            saveState();
          },
          onChange: () => render(),
        }),
      ]),
    ]);
    root.appendChild(controls);

    // Products
    const prodCard = el("div", { className: "card" });
    const activeCount = state.products.filter((p) => p.active).length;
    prodCard.appendChild(
      el(
        "h2",
        null,
        `Productos (${activeCount} activos · ${state.products.length} total)`
      )
    );

    if (!state.products.length) {
      prodCard.appendChild(
        el("div", { className: "empty" }, "Aún no hay productos. Elige del catálogo o crea uno.")
      );
    }

    for (const p of state.products) {
      const open = state.openId === p.id;
      const contrib = productContribution(p, state.period);
      const card = el("div", {
        className: "product" + (open ? " open" : "") + (!p.active ? " paused" : ""),
      });
      const head = el("button", {
        className: "product-head",
        type: "button",
        onClick: () => {
          const y = window.scrollY;
          state.openId = open ? null : p.id;
          render();
          requestAnimationFrame(() => window.scrollTo(0, y));
        },
      });
      head.appendChild(el("span", { className: "name" }, p.name));
      const aporteClass =
        !p.active ? "aporte muted" : contrib >= 0 ? "aporte gain" : "aporte loss";
      head.appendChild(
        el(
          "span",
          { className: aporteClass, "data-aporte": p.id },
          (contrib >= 0 ? "+" : "") + formatMoney(contrib, cur)
        )
      );
      head.appendChild(
        el(
          "span",
          { className: "chevron", html: "▼" }
        )
      );
      card.appendChild(head);

      const body = el("div", { className: "product-body" });
      body.appendChild(
        field(
          "Nombre",
          el("input", {
            type: "text",
            value: p.name,
            "data-focus-key": p.id + "-name",
            inputmode: "text",
            autocomplete: "off",
            onInput: (e) =>
              updateProduct(p.id, { name: e.target.value }, true),
          })
        )
      );
      body.appendChild(
        field(
          `Unidades (${PERIOD_LABEL[state.period]})`,
          el("input", {
            type: "number",
            min: "0",
            step: "1",
            value: String(p.units),
            "data-focus-key": p.id + "-units",
            inputmode: "decimal",
            onInput: (e) =>
              updateProduct(p.id, { units: n(e.target.value) }, true),
          })
        )
      );
      const grid = el("div", { className: "grid-2" });
      grid.appendChild(
        field(
          "Costo / unidad",
          el("input", {
            type: "number",
            min: "0",
            step: "0.01",
            value: String(p.cost),
            "data-focus-key": p.id + "-cost",
            inputmode: "decimal",
            onInput: (e) =>
              updateProduct(p.id, { cost: n(e.target.value) }, true),
          })
        )
      );
      grid.appendChild(
        field(
          "Precio de venta",
          el("input", {
            type: "number",
            min: "0",
            step: "0.01",
            value: String(p.price),
            "data-focus-key": p.id + "-price",
            inputmode: "decimal",
            onInput: (e) =>
              updateProduct(p.id, { price: n(e.target.value) }, true),
          })
        )
      );
      body.appendChild(grid);

      const margins = el("div", { className: "margin-btns" });
      for (const m of [0.3, 0.4, 0.5]) {
        margins.appendChild(
          el(
            "button",
            {
              className: "chip",
              type: "button",
              onClick: (e) => {
                e.stopPropagation();
                const prod = state.products.find((x) => x.id === p.id);
                const next = priceForMargin(n(prod ? prod.cost : p.cost), m);
                updateProduct(p.id, { price: next }, true);
                const inp = document.querySelector(
                  `[data-focus-key="${p.id}-price"]`
                );
                if (inp) inp.value = String(next);
              },
            },
            `Margen ${Math.round(m * 100)}%`
          )
        );
      }
      body.appendChild(margins);

      const actions = el("div", { className: "mini-actions" });
      actions.appendChild(
        el(
          "button",
          {
            className: "chip",
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              updateProduct(p.id, { active: !p.active });
            },
          },
          p.active ? "Pausar" : "Incluir"
        )
      );
      actions.appendChild(
        el(
          "button",
          {
            className: "chip",
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              duplicateProduct(p.id);
            },
          },
          "Duplicar"
        )
      );
      actions.appendChild(
        el(
          "button",
          {
            className: "chip",
            type: "button",
            onClick: (e) => {
              e.stopPropagation();
              removeProduct(p.id);
            },
          },
          "Eliminar"
        )
      );
      body.appendChild(actions);
      card.appendChild(body);
      prodCard.appendChild(card);
    }

    prodCard.appendChild(
      el("div", { className: "btn-row" }, [
        el(
          "button",
          {
            className: "btn btn-secondary",
            type: "button",
            onClick: () => {
              state.catalogOpen = !state.catalogOpen;
              render();
            },
          },
          state.catalogOpen ? "Cerrar catálogo" : "Elegir productos"
        ),
        el(
          "button",
          {
            className: "btn btn-ghost",
            type: "button",
            onClick: () =>
              addProduct({
                name: "Nuevo producto",
                units: 10 * DAYS[state.period],
                cost: state.currency === "USD" ? 1 : 50,
                price: state.currency === "USD" ? 2 : 100,
              }),
          },
          "+ Manual"
        ),
      ])
    );

    // Catalog
    const catalog = el("div", {
      className: "catalog-panel" + (state.catalogOpen ? " open" : ""),
    });
    const totalCatalog = CATALOG.reduce((n, g) => n + g.items.length, 0);
    catalog.appendChild(
      el(
        "p",
        { className: "empty", style: "text-align:left;padding:0.5rem 0" },
        `${totalCatalog} plantillas · ritmo diario, escaladas a tu periodo. Precios base en CUP.`
      )
    );
    catalog.appendChild(
      el("input", {
        type: "text",
        className: "catalog-search",
        placeholder: "Buscar producto…",
        value: state.catalogQuery || "",
        "data-focus-key": "catalog-search",
        autocomplete: "off",
        onInput: (e) => {
          state.catalogQuery = e.target.value;
          render();
        },
      })
    );
    const groupFilters = el("div", { className: "chip-row catalog-filters" });
    const groups = ["Todos", ...CATALOG.map((g) => g.group)];
    for (const gName of groups) {
      groupFilters.appendChild(
        el(
          "button",
          {
            className:
              "chip" + ((state.catalogGroup || "Todos") === gName ? " active" : ""),
            type: "button",
            onClick: () => {
              state.catalogGroup = gName;
              render();
            },
          },
          gName
        )
      );
    }
    catalog.appendChild(groupFilters);

    const q = (state.catalogQuery || "").trim().toLowerCase();
    const activeGroup = state.catalogGroup || "Todos";
    let shown = 0;
    for (const g of CATALOG) {
      if (activeGroup !== "Todos" && g.group !== activeGroup) continue;
      const filtered = g.items.filter(
        (item) => !q || item.name.toLowerCase().includes(q)
      );
      if (!filtered.length) continue;
      shown += filtered.length;
      const group = el("div", { className: "catalog-group" });
      group.appendChild(el("h3", null, `${g.group} (${filtered.length})`));
      const items = el("div", { className: "catalog-items" });
      for (const item of filtered) {
        const margin =
          item.price > 0
            ? Math.round(((item.price - item.cost) / item.price) * 100)
            : 0;
        items.appendChild(
          el(
            "button",
            {
              className: "chip catalog-item",
              type: "button",
              title: `Costo ${item.cost} · Venta ${item.price} · ~${item.units}/día`,
              onClick: () => addFromCatalog(item),
            },
            `${item.name} · ${margin}%`
          )
        );
      }
      group.appendChild(items);
      catalog.appendChild(group);
    }
    if (!shown) {
      catalog.appendChild(
        el("div", { className: "empty" }, "Ningún producto coincide con la búsqueda.")
      );
    }
    prodCard.appendChild(catalog);

    // Other expenses
    prodCard.appendChild(
      el("div", { style: "margin-top:1rem" },
        field(
          `Otros gastos (${PERIOD_LABEL[state.period]})`,
          el("input", {
            type: "number",
            min: "0",
            step: "0.01",
            value: String(state.other),
            "data-focus-key": "other-expenses",
            inputmode: "decimal",
            onInput: (e) => {
              state.other = n(e.target.value);
              saveState();
              updateLiveNumbers();
            },
          }),
          "Alquiler, transporte, datos, comisiones…"
        )
      )
    );

    // Presets
    const presets = el("div", { className: "chip-row", style: "margin-top:0.85rem" });
    presets.appendChild(
      el(
        "span",
        { style: "font-size:0.75rem;color:var(--muted);width:100%" },
        "Negocios de ejemplo (cargan varios productos):"
      )
    );
    for (const [key, label] of [
      ["cafeteria", "Cafetería"],
      ["dulceria", "Dulcería"],
      ["comida", "Comida rápida"],
      ["ropa", "Ropa"],
      ["belleza", "Belleza"],
      ["mercado", "Mercado"],
      ["tech", "Tecnología"],
    ]) {
      presets.appendChild(
        el(
          "button",
          {
            className: "chip",
            type: "button",
            onClick: () => loadPreset(key),
          },
          label
        )
      );
    }
    prodCard.appendChild(presets);
    root.appendChild(prodCard);

    // Results
    const res = el("div", { className: "card", id: "resultados" });
    res.appendChild(el("h2", null, "Resultados"));
    const hero = el("div", { className: "results-hero" });
    hero.appendChild(
      el("div", { className: "label" }, `Ganancia · ${PERIOD_LABEL[state.period]}`)
    );
    hero.appendChild(
      el(
        "div",
        {
          className: "value " + (t.profit >= 0 ? "gain" : "loss"),
          "data-hero-profit": "1",
        },
        (t.profit >= 0 ? "+" : "") + formatMoney(t.profit, cur)
      )
    );
    res.appendChild(hero);

    const metrics = el("div", { className: "metrics" });
    const metricData = [
      ["Ingresos", "revenue", t.revenue],
      ["Costo mercancía", "cogs", t.cogs],
      ["Aporte productos", "contribution", t.contribution],
      ["Otros gastos", "other", t.other],
      ["Efectivo reposición", "restock", t.cogs],
      ["Ticket promedio", "ticket", t.ticket],
    ];
    for (const [label, key, val] of metricData) {
      metrics.appendChild(
        el("div", { className: "metric" }, [
          el("div", { className: "k" }, label),
          el(
            "div",
            { className: "v", "data-metric": key },
            formatMoney(val, cur)
          ),
        ])
      );
    }
    res.appendChild(metrics);
    res.appendChild(
      el("div", { className: "insight", "data-insight": "1", html: insightText(t) })
    );

    // Comparison bars
    res.appendChild(el("h2", { style: "margin-top:1.1rem" }, "Comparar periodos"));
    const bars = el("div", { className: "bars" });
    for (const p of periods) {
      const profit = projected[p].profit;
      const pct = Math.min(100, (Math.abs(profit) / maxAbs) * 100);
      const row = el("div", { className: "bar-row" });
      row.appendChild(el("span", null, PERIOD_LABEL[p]));
      const track = el("div", { className: "bar-track" });
      track.appendChild(
        el("div", {
          className: "bar-fill" + (profit < 0 ? " neg" : ""),
          style: `width:${pct}%`,
          "data-bar-fill": p,
        })
      );
      row.appendChild(track);
      row.appendChild(
        el(
          "span",
          { className: "amt", "data-bar-amt": p },
          (profit >= 0 ? "+" : "") + formatMoney(profit, cur)
        )
      );
      bars.appendChild(row);
    }
    res.appendChild(bars);

    const monthlyProfit = projectPeriod(state.period, "mensual", t).profit;
    res.appendChild(
      el(
        "button",
        {
          className: "btn btn-primary",
          type: "button",
          style: "margin-top:1rem",
          "data-register-label": "1",
          onClick: registerActivo,
        },
        `Registrar ${monthlyProfit >= 0 ? "+" : ""}${formatMoney(monthlyProfit, cur)}/mes`
      )
    );
    root.appendChild(res);

    // Activos
    const act = el("div", { className: "card span-full" });
    act.appendChild(el("h2", null, "Activos simulados"));
    if (!state.activos.length) {
      act.appendChild(
        el("div", { className: "empty" }, "Registra una simulación para guardar el escenario.")
      );
    } else {
      const list = el("div", { className: "activos-list" });
      for (const a of state.activos) {
        list.appendChild(
          el("div", { className: "activo" }, [
            el("span", { className: "t" }, a.name),
            el(
              "span",
              {
                className: "p",
                style: `color:${a.profit >= 0 ? "var(--gain)" : "var(--loss)"}`,
              },
              (a.profit >= 0 ? "+" : "") + formatMoney(a.profit, a.currency || cur) + "/mes"
            ),
          ])
        );
      }
      act.appendChild(list);
      act.appendChild(
        el(
          "button",
          {
            className: "btn btn-ghost",
            type: "button",
            style: "margin-top:0.75rem",
            onClick: () => {
              state.activos = [];
              saveState();
              render();
            },
          },
          "Limpiar historial"
        )
      );
    }
    root.appendChild(act);

    root.appendChild(
      el(
        "p",
        { className: "footer-note span-full" },
        "Herramienta educativa. Los números son estimaciones: no incluyen impuestos, mermas ni cambios de demanda."
      )
    );

    // Restaurar scroll y foco (evita que la pantalla “baje sola” al editar)
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      if (restore && restore.key) {
        const elFocus = document.querySelector(
          `[data-focus-key="${restore.key}"]`
        );
        if (elFocus) {
          elFocus.focus({ preventScroll: true });
          try {
            if (
              typeof restore.start === "number" &&
              typeof restore.end === "number"
            ) {
              elFocus.setSelectionRange(restore.start, restore.end);
            }
          } catch (_) {
            /* number inputs may not support selection */
          }
        }
      }
    });
  }

  function field(label, input, hint) {
    const wrap = el("div", { className: "field" });
    wrap.appendChild(el("label", null, label));
    wrap.appendChild(input);
    if (hint) wrap.appendChild(el("div", { className: "hint" }, hint));
    return wrap;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
