'use strict';
// ===== A Cidade da Lia — lógica do jogo =====

const SAVE = 'minhaCidade_v1';
const HORA = 3600000;
const BAGUNCA_APOS = 3 * HORA;   // o quarto fica bagunçado de novo depois de 3 horas
const ILHA_MIN = 70;             // termômetro dos papais necessário para abrir a ilha

// ---------- Estado salvo ----------
function novoEstado() {
  return {
    coins: 20, papais: 50, batata: { fome: 60, alegria: 60 }, quartoLimpoEm: 0, ultimo: Date.now(),
    donos: [], look: { ...LOOK_PADRAO }, batataAcc: '', batataBrinquedo: 'bola',
    escolaRodadas: 0, fotoDia: '', ilhaDia: '', som: true, voz: true,
    stats: { palavras: 0, receitas: 0, frutas: 0, quartos: 0 }
  };
}
let S;
try { S = Object.assign(novoEstado(), JSON.parse(localStorage.getItem(SAVE) || '{}')); } catch (e) { S = novoEstado(); }
// Jogos salvos antes do cadastro existir são da Lia
// (os itens grátis não contam: eles entram no salvamento mesmo antes do cadastro ser feito)
const comprouAlgo = S.donos.some(id => (ITENS.find(i => i.id === id) || {}).preco > 0);
if (!S.perfil && (S.stats.quartos + S.stats.palavras + S.stats.receitas + S.stats.frutas > 0 || comprouAlgo)) S.perfil = { ...PERFIL_LIA };
S.look = Object.assign({}, menino() ? LOOK_MENINO : LOOK_PADRAO, S.look);
// Versões antigas guardavam o glitter como verdadeiro/falso
if (S.look.glitter === true) S.look.glitter = 'dourado';
if (S.look.glitter === false) S.look.glitter = '';
if (S.donos.includes('glitter:true') && !S.donos.includes('glitter:dourado')) S.donos.push('glitter:dourado');
ITENS.filter(i => i.preco === 0 && !S.donos.includes(i.id)).forEach(i => S.donos.push(i.id));
function salvar() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) { } }

const tem = id => S.donos.includes(id);
const praMim = it => !it.sexo || it.sexo === perfil().sexo;   // item de menina, de menino ou de todos
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const embaralhar = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sortear = (arr, n) => embaralhar(arr).slice(0, n);
const hoje = () => new Date().toDateString();
const quartoBaguncado = () => Date.now() - S.quartoLimpoEm > BAGUNCA_APOS;
const ilhaAberta = () => S.papais >= ILHA_MIN;

// O tempo passa mesmo com o jogo fechado
function tick() {
  const agora = Date.now();
  const horas = Math.max(0, (agora - S.ultimo) / HORA);
  S.papais = clamp(S.papais - horas * 2);
  S.batata.fome = clamp(S.batata.fome - horas * 4);
  S.batata.alegria = clamp(S.batata.alegria - horas * 3);
  S.ultimo = agora;
  salvar();
}

// ---------- Ajudantes de tela ----------
const app = document.getElementById('app');
let limpezas = [];
const aoSair = f => limpezas.push(f);
const depois = (fn, ms) => { const t = setTimeout(fn, ms); aoSair(() => clearTimeout(t)); return t; };
const sempre = (fn, ms) => { const t = setInterval(fn, ms); aoSair(() => clearInterval(t)); return t; };

function h(tag, props = {}, ...filhos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  for (const f of filhos.flat()) if (f != null && f !== false) el.append(f.nodeType ? f : document.createTextNode(personalizar(String(f))));
  return el;
}

const CENAS = {};
function ir(nome, ...args) {
  limpezas.forEach(f => f()); limpezas = [];
  document.querySelectorAll('.modal-fundo,.aviso').forEach(e => e.remove());
  app.innerHTML = '';
  calar();
  S.cena = nome;
  document.body.classList.toggle('menino', menino());   // botões e destaques azuis na versão menino
  CENAS[nome](...args);
}

// ---------- Som e voz ----------
let actx = null;
function iniciarAudio() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { }
}
document.addEventListener('pointerdown', iniciarAudio);
// f2: frequência final, para sons que sobem ou descem
function tom(f, d, tipo = 'sine', v = .18, q = 0, f2 = 0) {
  if (!S.som || !actx) return;
  const t = actx.currentTime + q, o = actx.createOscillator(), g = actx.createGain();
  o.type = tipo; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + .02);
}
const sfx = {
  pop() { tom(600, .08, 'triangle', .15); },
  ok() { tom(660, .12); tom(990, .18, 'sine', .18, .1); },
  // "fóóón-fóóón" de resposta errada
  erro() { tom(220, .22, 'sawtooth', .13, 0, 200); tom(165, .45, 'sawtooth', .13, .24, 120); },
  dica() { tom(500, .1, 'triangle', .1); },
  giro() { tom(300, .6, 'triangle', .12, 0, 1200); tom(1200, .3, 'sine', .08, .55, 1600); },
  buzina() { tom(440, .12, 'square', .08); tom(440, .18, 'square', .08, .18); },
  esfregar() { tom(1400 + Math.random() * 600, .04, 'triangle', .04); },
  moeda() { tom(988, .08, 'square', .07); tom(1319, .25, 'square', .07, .08); },
  festa() { [523, 659, 784, 1047, 1319].forEach((f, i) => tom(f, .25, 'triangle', .15, i * .1)); },
  au() { tom(520, .09, 'sawtooth', .07); tom(380, .14, 'sawtooth', .07, .11); },
  nhac() { [0, .15, .3, .45].forEach(q => tom(200 + Math.random() * 80, .06, 'square', .05, q)); }
};

// Vozes em português, as mais naturais e femininas primeiro.
// Os papais podem trocar a voz e o tom na Área dos Papais.
const TONS = [1.0, 1.2, 1.4, 1.6];
if (S.tomVoz == null) S.tomVoz = 1.4;
if (S.vozEscolhida == null) S.vozEscolhida = 0;
function notaVoz(v) {
  let n = 0;
  if (/pt[-_]BR/i.test(v.lang)) n += 10;
  if (/natural|online|neural|network/i.test(v.name || v.voiceURI || '')) n += 8;
  if (/google/i.test(v.name || '')) n += 5;
  if (/francisca|thalita|maria|let[ií]cia|luciana|vit[oó]ria|camila|female|feminina/i.test(v.name || '')) n += 3;
  return n;
}
let vozesPt = [];
function carregarVozes() {
  try { vozesPt = speechSynthesis.getVoices().filter(v => /^pt/i.test(v.lang)).sort((a, b) => notaVoz(b) - notaVoz(a)); } catch (e) { }
}
if ('speechSynthesis' in window) { carregarVozes(); speechSynthesis.onvoiceschanged = carregarVozes; }

// No app Android a voz vem do plugin nativo; no navegador, do speechSynthesis
function vozNativa() {
  const C = window.Capacitor;
  return C && C.isNativePlatform && C.isNativePlatform() && C.Plugins ? C.Plugins.TextToSpeech : null;
}
let vozesNativas = null;   // [{indice, nome}] das vozes pt do tablet
function carregarVozesNativas() {
  const n = vozNativa();
  if (!n || vozesNativas) return Promise.resolve();
  return n.getSupportedVoices().then(r => {
    vozesNativas = (r.voices || []).map((v, indice) => ({ ...v, indice })).filter(v => /^pt/i.test(v.lang)).sort((a, b) => notaVoz(b) - notaVoz(a));
  }).catch(() => { vozesNativas = []; });
}
carregarVozesNativas();
function listaDeVozes() { return vozNativa() ? (vozesNativas || []) : vozesPt; }

function calar() {
  const n = vozNativa();
  if (n) { n.stop().catch(() => { }); return; }
  try { speechSynthesis.cancel(); } catch (e) { }
}
function falar(txt) {
  if (!S.voz) return;
  txt = personalizar(txt);
  const lista = listaDeVozes();
  const voz = lista.length ? lista[S.vozEscolhida % lista.length] : null;
  const n = vozNativa();
  if (n) {
    const op = { text: txt, lang: 'pt-BR', rate: .95, pitch: S.tomVoz };
    if (voz) op.voice = voz.indice;
    n.stop().catch(() => { }).finally(() => n.speak(op).catch(() => { }));
    return;
  }
  if (!('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'pt-BR'; if (voz) u.voice = voz; u.rate = .95; u.pitch = S.tomVoz;
    speechSynthesis.speak(u);
  } catch (e) { }
}

// ---------- Efeitos ----------
function festa() {
  const em = ['🎉', '⭐', '💖', '✨', '🎊', '🌟'];
  for (let i = 0; i < 36; i++) {
    const c = h('div', { class: 'confete', style: `left:${Math.random() * 100}vw;animation-delay:${Math.random() * .7}s;font-size:${3 + Math.random() * 4}vmin` }, em[i % em.length]);
    document.body.append(c); setTimeout(() => c.remove(), 3400);
  }
  sfx.festa();
}
function atualizarMoedas() { document.querySelectorAll('.moedas b').forEach(b => b.textContent = S.coins); }
function ganhar(n) {
  S.coins += n; salvar(); atualizarMoedas(); sfx.moeda();
  const g = h('div', { class: 'ganho' }, `+${n} 🪙`); document.body.append(g); setTimeout(() => g.remove(), 1700);
}
// Cada erro nas missões custa 1 Lia Coin, para ela pensar antes de chutar
function errou(el) {
  sfx.erro();
  if (el) tremer(el);
  if (S.coins <= 0) return;
  S.coins--; salvar(); atualizarMoedas();
  const g = h('div', { class: 'ganho perda' }, '-1 🪙'); document.body.append(g); setTimeout(() => g.remove(), 1700);
}
function aviso(txt, fala = txt) {
  document.querySelectorAll('.aviso').forEach(a => a.remove());
  const a = h('div', { class: 'aviso' }, txt); document.body.append(a); setTimeout(() => a.remove(), 3000);
  falar(fala);
}
function coracoes(el, em = '💖') {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const c = h('div', { class: 'coracao', style: `left:${r.left + r.width * (.2 + Math.random() * .6)}px;top:${r.top + r.height * .3}px;animation-delay:${i * .12}s` }, em);
    document.body.append(c); setTimeout(() => c.remove(), 1800);
  }
}
function voarPara(de, para, em) {
  const a = de.getBoundingClientRect(), b = para.getBoundingClientRect();
  const f = h('div', { class: 'voando', style: `left:${a.left + a.width / 2}px;top:${a.top + a.height / 2}px` }, em);
  document.body.append(f);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    f.style.left = b.left + b.width / 2 + 'px'; f.style.top = b.top + b.height / 2 + 'px';
    f.style.transform = 'translate(-50%,-50%) scale(.5)'; f.style.opacity = '.3';
  }));
  setTimeout(() => f.remove(), 750);
}
function tremer(el) { el.classList.remove('tremer'); void el.offsetWidth; el.classList.add('tremer'); }
function pular(el) { el.classList.remove('pulo'); void el.offsetWidth; el.classList.add('pulo'); }

function modal(conteudo, botoes) {
  const fundo = h('div', { class: 'modal-fundo' });
  fundo.append(h('div', { class: 'modal' }, conteudo,
    h('div', { class: 'modal-botoes' }, botoes.map(([txt, fn, cls]) =>
      h('button', { class: 'btn ' + (cls || ''), onclick: () => { sfx.pop(); fundo.remove(); fn && fn(); } }, txt)))));
  document.body.append(fundo);
  return fundo;
}

function topo(titulo, voltar = 'mapa', rotulo = '⬅️ Cidade') {
  app.append(h('div', { class: 'topo' },
    h('button', { class: 'btn btn-voltar', onclick: () => { sfx.pop(); ir(voltar); } }, rotulo),
    h('div', { class: 'titulo' }, titulo),
    h('div', { class: 'moedas' }, '🪙 ', h('b', {}, S.coins))));
}

function termometro() {
  const p = Math.round(S.papais);
  const cara = p >= 85 ? '😍' : p >= ILHA_MIN ? '😊' : p >= 40 ? '😐' : '😟';
  return h('div', { class: 'termo' },
    h('div', { class: 'termo-pais' },
      h('div', { class: 'rostinho', html: pessoaSVG('papai', true) }),
      h('div', { class: 'rostinho', html: pessoaSVG('mamae', true) }),
      h('span', { class: 'termo-cara' }, cara)),
    h('div', { class: 'termo-barra' },
      h('div', { class: 'termo-cheio', style: `width:${p}%` }),
      h('div', { class: 'termo-marca', style: `left:${ILHA_MIN}%` }, '🏝️')));
}

function barra(rotulo, v, cor) {
  return h('div', { class: 'barra' }, h('span', {}, rotulo),
    h('div', { class: 'barra-fundo' }, h('div', { class: 'barra-cheia', style: `width:${Math.round(v)}%;background:${cor}` })));
}

function humorBatata() {
  const m = (S.batata.fome + S.batata.alegria) / 2;
  return m >= 60 ? 'feliz' : m >= 30 ? 'normal' : 'triste';
}

function telaCheia() {
  try { const d = document.documentElement; if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen().catch(() => { }); } catch (e) { }
}

// ==================================================================
// TELA INICIAL
// ==================================================================
CENAS.inicio = () => {
  if (!S.perfil) return ir('cadastro');
  document.title = nomeCidade();
  app.append(h('div', { class: 'inicio' },
    h('div', { class: 'nuvem', style: 'left:8%;top:10%' }, '☁️'), h('div', { class: 'nuvem', style: 'left:70%;top:6%;animation-delay:-6s' }, '☁️'),
    h('h1', { class: 'logo' }, g('A Cidade da ', 'A Cidade do '), h('span', {}, 'Lia')),
    h('div', { class: 'inicio-turma' },
      h('div', { class: 'inicio-crianca pulando', html: criancaSVG(S.look) }),
      h('div', { class: 'inicio-batata', html: batataSVG('feliz', S.batataAcc) })),
    h('button', { class: 'btn btn-jogar', onclick: () => { iniciarAudio(); telaCheia(); sfx.festa(); ir('mapa'); falar('Oi, Lia! Vamos passear pela cidade?'); } }, '▶ Jogar')));
};

// ==================================================================
// CADASTRO — menina ou menino e os nomes da família (feito pelos papais)
// ==================================================================
CENAS.cadastro = (editando = false) => {
  const P = Object.assign({ sexo: '', crianca: '', papai: '', mamae: '', vovoF: '', vovoM: '', escola: '', primo: '', primoSexo: 'f', pet: 'Batata', petSexo: 'm' }, S.perfil);
  let pele = S.look.pele, corCabelo = S.look.corCabelo;
  const tela = h('div', { class: 'cadastro' });
  app.append(tela);
  document.body.classList.add('cadastrando');   // dá para preencher com o celular em pé
  aoSair(() => document.body.classList.remove('cadastrando'));

  const previa = h('div', { class: 'cad-previa' });
  const desenharPrevia = () => {
    previa.innerHTML = P.sexo ? criancaSVG({ ...(P.sexo === 'm' ? LOOK_MENINO : LOOK_PADRAO), pele, corCabelo }) : '';
  };

  const escolha = (opcoes, atual, aoEscolher) => {
    const caixa = h('div', { class: 'cad-escolha' });
    const desenhar = (v) => {
      caixa.innerHTML = '';
      opcoes.forEach(([val, rotulo]) => caixa.append(h('button', {
        class: 'cad-opcao' + (val === v ? ' sel' : ''), type: 'button',
        onclick: () => { sfx.pop(); aoEscolher(val); desenhar(val); }
      }, rotulo)));
    };
    desenhar(atual);
    return caixa;
  };
  const campo = (chave, rotulo, dica, extra = null) => {
    const entrada = h('input', { type: 'text', maxlength: '16', placeholder: dica, autocomplete: 'off', autocapitalize: 'words' });
    entrada.value = P[chave];
    entrada.addEventListener('input', () => { P[chave] = entrada.value; });
    return h('label', { class: 'cad-campo' }, h('span', {}, rotulo), entrada, extra);
  };

  // Cartões grandes de menina e menino
  const cartoes = h('div', { class: 'cad-sexo' });
  const desenharCartoes = () => {
    cartoes.innerHTML = '';
    [['f', '👧 Menina', LOOK_PADRAO], ['m', '👦 Menino', LOOK_MENINO]].forEach(([s, rotulo, look]) => cartoes.append(h('button', {
      class: 'cad-cartao' + (P.sexo === s ? ' sel' : ''), type: 'button',
      onclick: () => { sfx.pop(); P.sexo = s; document.body.classList.toggle('menino', s === 'm'); desenharCartoes(); desenharPrevia(); }
    }, h('div', { class: 'cad-cartao-img', html: criancaSVG({ ...look, pele, corCabelo }) }), h('b', {}, rotulo))));
  };
  desenharCartoes(); desenharPrevia();

  const cores = (mapa, nomes, atual, aoEscolher) => {
    const caixa = h('div', { class: 'cad-cores' });
    const desenhar = (v) => {
      caixa.innerHTML = '';
      nomes.forEach(n => caixa.append(h('button', {
        class: 'cad-cor' + (n === v ? ' sel' : ''), type: 'button', style: `background:${mapa[n]}`,
        onclick: () => { sfx.pop(); aoEscolher(n); desenhar(n); desenharPrevia(); desenharCartoes(); }
      })));
    };
    desenhar(atual);
    return caixa;
  };

  tela.append(
    h('h1', {}, editando ? '✏️ Editar cadastro' : '🏙️ Vamos montar a sua cidade!'),
    h('p', { class: 'cad-sub' }, 'Papai ou mamãe: preencham juntos com a criança. Os nomes aparecem e são falados no jogo.'),
    h('h2', {}, '1. É menina ou menino?'), cartoes,
    h('h2', {}, '2. Os nomes da família'),
    h('div', { class: 'cad-grade' },
      campo('crianca', 'Nome da criança ⭐', 'Ex.: Pedro'),
      campo('escola', 'Nome da escola', 'Ex.: Escola Pequeno Príncipe'),
      campo('papai', 'Nome do papai', 'Ex.: Carlos'),
      campo('mamae', 'Nome da mamãe', 'Ex.: Ana'),
      campo('vovoF', 'Nome da vovó', 'Ex.: Maria'),
      campo('vovoM', 'Nome do vovô', 'Ex.: José'),
      campo('primo', 'Nome do primo ou da prima', 'Ex.: Lucas', escolha([['m', 'Primo'], ['f', 'Prima']], P.primoSexo, v => { P.primoSexo = v; })),
      campo('pet', 'Nome do cachorrinho', 'Ex.: Batata', escolha([['m', 'Ele'], ['f', 'Ela']], P.petSexo, v => { P.petSexo = v; }))),
    h('h2', {}, '3. Como é a criança?'),
    h('div', { class: 'cad-visual' },
      h('div', {},
        h('div', { class: 'cad-rotulo' }, 'Pele'), cores(PELES, Object.keys(PELES), pele, v => { pele = v; }),
        h('div', { class: 'cad-rotulo' }, 'Cabelo'), cores(CORES_CABELO, ['castanho', 'preto', 'loiro', 'ruivo'], corCabelo, v => { corCabelo = v; })),
      previa),
    h('div', { class: 'cad-botoes' },
      editando ? h('button', { class: 'btn cinza', type: 'button', onclick: () => ir('mapa') }, '✖ Cancelar') : null,
      h('button', { class: 'btn verde btn-grande', type: 'button', onclick: concluir }, editando ? '✔ Salvar' : '✔ Começar!')));

  function concluir() {
    const limpo = s => { s = (s || '').trim().replace(/\s+/g, ' '); return s ? s[0].toUpperCase() + s.slice(1) : ''; };
    if (!P.sexo) { aviso('Escolha se é menina ou menino 😊'); tela.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const nome = limpo(P.crianca);
    if (!nome) { aviso('Escreva o nome da criança ✏️'); tela.querySelector('input').focus(); return; }
    const mudouSexo = !S.perfil || S.perfil.sexo !== P.sexo;
    S.perfil = {
      sexo: P.sexo, crianca: nome, papai: limpo(P.papai), mamae: limpo(P.mamae), vovoF: limpo(P.vovoF), vovoM: limpo(P.vovoM),
      escola: limpo(P.escola) || 'Escolinha', primo: limpo(P.primo) || (P.primoSexo === 'm' ? 'Primo' : 'Prima'), primoSexo: P.primoSexo,
      pet: limpo(P.pet) || 'Batata', petSexo: P.petSexo
    };
    S.look = mudouSexo ? { ...(P.sexo === 'm' ? LOOK_MENINO : LOOK_PADRAO), pele, corCabelo } : { ...S.look, pele, corCabelo };
    salvar();
    iniciarAudio(); sfx.festa();
    ir(editando ? 'mapa' : 'inicio');
  }
};

// ==================================================================
// MAPA DA CIDADE
// ==================================================================
CENAS.mapa = () => {
  tick();
  const m = h('div', { class: 'mapa' });
  m.append(h('div', { class: 'mar' }, h('div', { class: 'peixe', style: 'top:20%' }, '🐠'), h('div', { class: 'peixe', style: 'top:82%;animation-delay:-4s' }, '⛵')));
  m.append(h('div', { class: 'rua' }), h('div', { class: 'ponte' }));
  // Carros passeando: faixa de cima vai para a direita, a de baixo volta para a esquerda
  [['#e63946', 'carro', 'ida', 11, 0], ['#ffc300', 'onibus', 'ida', 16, -7], ['#3a86ff', 'carro', 'ida', 9, -4],
   ['#06d6a0', 'carro', 'volta', 10, -2], ['#ff70a6', 'carro', 'volta', 13, -8], ['#9d4edd', 'carro', 'volta', 12, -5]]
    .forEach(([cor, tipo, sentido, dur, atraso]) => {
      const dentroCarro = h('div', { class: 'carro-dentro', html: carroSVG(cor, tipo) });
      m.append(h('button', {
        class: `carro ${sentido} ${tipo}`, style: `animation-duration:${dur}s;animation-delay:${atraso}s`,
        onclick: () => { sfx.buzina(); pular(dentroCarro); }
      }, dentroCarro));
    });
  [['🌳', 2, 50], ['🌲', 25, 45], ['🌳', 49, 46], ['🌷', 72, 46], ['🌻', 25, 93], ['🌳', 49, 93], ['🌷', 3, 93], ['🌼', 72, 92], ['🌳', 73, 20], ['🌲', 26, 14]]
    .forEach(([em, x, y]) => m.append(h('div', { class: 'decor', style: `left:${x}%;top:${y}%` }, em)));

  LUGARES.forEach(l => {
    const fechada = l.id === 'ilha' && !ilhaAberta();
    const b = h('button', {
      class: 'lugar' + (fechada ? ' fechado' : ''), style: `left:${l.x}%;top:${l.y}%`,
      onclick: () => { sfx.pop(); ir(l.id); }
    }, h('div', { class: 'predio', html: predioSVG(l.id === 'prima' && menino() ? 'primo' : l.id) }), h('div', { class: 'placa' }, l.nome));
    if (fechada) b.append(h('div', { class: 'selo' }, '🔒'));
    if (l.id === 'casa' && quartoBaguncado()) b.append(h('div', { class: 'selo alerta' }, '❗'));
    m.append(b);
  });

  // Lia e Batata passeando
  m.append(h('button', { class: 'crianca-mapa', html: criancaSVG(S.look), onclick: e => { pular(e.currentTarget); falar(g('Oi! Eu sou a Lia!', 'Oi! Eu sou o Lia!')); } }));
  const precisa = S.batata.fome < 40 ? '🍖' : S.batata.alegria < 40 ? '🎾' : '';
  m.append(h('button', { class: 'batata-mapa', onclick: () => { sfx.au(); ir('batata'); } },
    h('div', { html: batataSVG(humorBatata(), S.batataAcc) }), precisa ? h('div', { class: 'pede' }, precisa) : null));

  // HUD
  m.append(h('div', { class: 'hud' },
    h('div', { class: 'moedas grande' }, '🪙 ', h('b', {}, S.coins)),
    h('button', { class: 'hud-termo', onclick: () => aviso(ilhaAberta() ? 'O papai Paulo e a mamãe Clara estão felizes! A ilha está aberta!' : 'Arrume o seu quarto para deixar o papai e a mamãe felizes e abrir a ilha!') }, termometro()),
    h('button', { class: 'hud-batata', onclick: () => ir('batata') },
      h('div', { class: 'mini-batata', html: batataSVG(humorBatata(), S.batataAcc) }),
      h('div', {}, barra('🍖', S.batata.fome, '#ffb703'), barra('❤️', S.batata.alegria, '#ff4d8d'))),
    h('button', { class: 'btn-engrenagem', onclick: areaPais }, '⚙️')));
  app.append(m);
};

// ==================================================================
// NOSSA CASA — arrumar o quarto
// ==================================================================
CENAS.casa = () => {
  topo(g('🏠 Nossa Casa — Quarto da Lia', '🏠 Nossa Casa — Quarto do Lia'));
  const cena = h('div', { class: 'cena quarto' + g('', ' menino') });
  const meus = ITENS.filter(i => i.tipo === 'brinquedo' && tem(i.id) && praMim(i));
  const parede = h('div', { class: 'parede' },
    h('div', { class: 'janela' }, '🌤️'),
    h('div', { class: 'prateleira' }, meus.length ? meus.map(i => h('span', { class: i.raro ? 'raro-brilho' : '' }, i.icone)) : h('small', {}, 'Compre brinquedos no Shopping!')));
  cena.append(parede);
  const chao = h('div', { class: 'chao' });
  cena.append(chao);

  const baguncado = quartoBaguncado();
  const estante = h('div', { class: 'movel estante', 'data-tipo': 'livro' }, h('div', { class: 'movel-icone' }, '📚'), h('div', { class: 'movel-nome' }, 'Livros'));
  const cama = h('div', { class: 'cama' + (baguncado ? '' : ' feita') },
    h('div', { class: 'cama-cabeceira' }), h('div', { class: 'cama-colchao' }), h('div', { class: 'travesseiro' }), h('div', { class: 'coberta' }));
  const cesto = h('div', { class: 'movel cesto', 'data-tipo': 'roupa' }, h('div', { class: 'movel-icone' }, '🧺'), h('div', { class: 'movel-nome' }, 'Roupas'));
  const lixeira = h('div', { class: 'movel lixeira', 'data-tipo': 'lixo' }, h('div', { class: 'movel-icone' }, '🗑️'), h('div', { class: 'movel-nome' }, 'Lixo'));
  const bau = h('div', { class: 'movel bau', 'data-tipo': 'brinquedo' }, h('div', { class: 'movel-icone' }, '🧸'), h('div', { class: 'movel-nome' }, 'Brinquedos'));
  cena.append(estante, cama, cesto, lixeira, bau);
  app.append(cena);

  if (!baguncado) {
    const falta = Math.max(1, Math.ceil((BAGUNCA_APOS - (Date.now() - S.quartoLimpoEm)) / HORA));
    chao.append(h('div', { class: 'crianca-quarto', html: criancaSVG(S.look) }));
    cena.append(h('div', { class: 'painel-info' },
      h('h2', {}, '✨ Quarto arrumadinho! ✨'),
      h('p', {}, 'O papai e a mamãe estão orgulhosos de você!'),
      h('p', { class: 'pequeno' }, `Volte daqui a ${falta} hora${falta > 1 ? 's' : ''} para arrumar de novo.`),
      h('button', { class: 'btn', onclick: () => ir('batata') }, '🐶 Brincar com o Batata')));
    falar('Seu quarto está arrumadinho! Muito bem, Lia!');
    return;
  }

  const DICAS = { brinquedo: 'Os brinquedos vão no baú!', livro: 'Os livros vão na estante!', roupa: 'As roupas vão no cesto!', lixo: 'O lixo vai na lixeira!' };

  // Ferramentas: mão guarda as coisas, vassoura varre o lixo, pano limpa as manchas
  let ferramenta = 'mao';
  const cursor = h('div', { class: 'cursor-ferramenta' });
  const FERRAMENTAS = [['mao', '✋', 'Mão'], ['vassoura', '🧹', 'Vassoura'], ['pano', '🧽', 'Pano']];
  const caixaFerramentas = h('div', { class: 'ferramentas' });
  function desenharFerramentas() {
    caixaFerramentas.innerHTML = '';
    FERRAMENTAS.forEach(([id, ic, nome]) => caixaFerramentas.append(h('button', {
      class: 'ferramenta' + (ferramenta === id ? ' ativa' : ''),
      onclick: () => { ferramenta = id; sfx.pop(); desenharFerramentas(); falar(nome); }
    }, h('span', {}, ic), nome)));
  }
  desenharFerramentas();
  parede.append(caixaFerramentas);
  cena.append(cursor);

  const itens = [
    ...sortear(BAGUNCA.brinquedo, 4).map(e => [e, 'brinquedo']),
    ...sortear(BAGUNCA.livro, 3).map(e => [e, 'livro']),
    ...sortear(BAGUNCA.roupa, 4).map(e => [e, 'roupa']),
    ...sortear(BAGUNCA.lixo, 3).map(e => [e, 'lixo'])
  ];
  // Grade de 7 x 3 lugares no chão, com um pouco de bagunça na posição
  const lugares = embaralhar(Array.from({ length: 21 }, (_, i) => [6 + (i % 7) * 14 + rand(-3, 3), 16 + Math.floor(i / 7) * 30 + rand(-4, 4)]));
  const alvos = [estante, cesto, lixeira, bau];
  const nManchas = 3;
  let faltam = itens.length + nManchas, camaFeita = false;

  itens.forEach(([em, tipo], i) => {
    const [x, y] = lugares[i];
    const el = h('div', { class: 'bagunca' + (tipo === 'lixo' ? ' lixo' : ''), style: `left:${x}%;top:${y}%;--r:${rand(-30, 30)}deg` }, em);
    chao.append(el);
    arrastavel(el, (px, py) => {
      const alvo = alvos.find(a => dentro(a, px, py));
      if (!alvo) return false;
      if (alvo.dataset.tipo !== tipo) { errou(alvo); aviso(DICAS[tipo]); return false; }
      el.classList.add('guardado'); pular(alvo); sfx.ok();
      setTimeout(() => el.remove(), 400);
      faltam--; checar();
      return true;
    }, () => {
      // Lixo só com a vassoura; o resto só com a mão
      if (tipo === 'lixo' && ferramenta !== 'vassoura') { if (ferramenta === 'mao') aviso('Use a vassoura 🧹 para varrer o lixo!', 'Use a vassoura para varrer o lixo!'); return false; }
      if (tipo !== 'lixo' && ferramenta !== 'mao') { if (ferramenta === 'vassoura') aviso('Use a mão ✋ para guardar as coisas!', 'Use a mão para guardar as coisas!'); return false; }
      return true;
    });
  });

  // Manchas no chão para limpar esfregando o pano
  const CORES_MANCHA = ['#8d6e63', '#ff9f1c', '#9d4edd', '#6d4c41'];
  const manchas = lugares.slice(itens.length, itens.length + nManchas).map(([x, y]) => {
    const r = () => rand(35, 65) + '%';
    const m = h('div', { class: 'mancha', style: `left:${x}%;top:${y}%;background:${CORES_MANCHA[rand(0, CORES_MANCHA.length - 1)]};border-radius:${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}` });
    m.limpo = 0;
    chao.append(m);
    return m;
  });
  const LIMPAR = 260; // quanto precisa esfregar (em pixels)
  let esfregando = false, ultimo = null;
  const moverCursor = e => {
    const r = cena.getBoundingClientRect();
    cursor.style.left = (e.clientX - r.left) + 'px'; cursor.style.top = (e.clientY - r.top) + 'px';
  };
  chao.addEventListener('pointerdown', e => {
    if (ferramenta !== 'pano') {
      if (e.target.classList.contains('mancha')) aviso('Use o pano 🧽 para limpar a sujeira!', 'Use o pano para limpar a sujeira!');
      return;
    }
    e.preventDefault(); chao.setPointerCapture(e.pointerId);
    esfregando = true; ultimo = null;
    cursor.textContent = '🧽'; cursor.classList.add('visivel'); moverCursor(e);
  });
  chao.addEventListener('pointermove', e => {
    if (!esfregando) return;
    moverCursor(e);
    const d = ultimo ? Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) : 0;
    ultimo = { x: e.clientX, y: e.clientY };
    manchas.forEach(m => {
      if (m.limpo >= LIMPAR || !dentro(m, e.clientX, e.clientY, 10)) return;
      m.limpo += d;
      if (Math.random() < .3) sfx.esfregar();
      m.style.opacity = Math.max(0, .6 * (1 - m.limpo / LIMPAR));
      if (m.limpo >= LIMPAR) {
        coracoes(m, '✨'); sfx.ok(); m.remove();
        faltam--; checar();
      }
    });
  });
  const pararEsfregar = () => { esfregando = false; cursor.classList.remove('visivel'); };
  chao.addEventListener('pointerup', pararEsfregar);
  chao.addEventListener('pointercancel', pararEsfregar);

  cama.addEventListener('click', () => {
    if (camaFeita) return;
    camaFeita = true; cama.classList.add('feita'); sfx.ok(); falar('Cama arrumada!'); checar();
  });

  function checar() {
    if (faltam > 0 || !camaFeita) return;
    const estavaFechada = !ilhaAberta();
    S.quartoLimpoEm = Date.now(); S.papais = clamp(S.papais + 35); S.stats.quartos++; salvar();
    depois(() => {
      ganhar(20); festa();
      const abriu = estavaFechada && ilhaAberta();
      falar('Parabéns, Lia! O quarto ficou lindo! O papai Paulo e a mamãe Clara estão muito felizes!' + (abriu ? ' A ilha das férias está aberta!' : ''));
      modal(h('div', {},
        h('div', { class: 'modal-pais' },
          h('div', { class: 'pessoa-modal', html: pessoaSVG('papai') }),
          h('div', { class: 'coracao-grande' }, '💖'),
          h('div', { class: 'pessoa-modal', html: pessoaSVG('mamae') })),
        h('h2', {}, 'Quarto arrumado!'),
        h('p', {}, 'O papai Paulo e a mamãe Clara estão muito felizes com você!'),
        termometro(),
        abriu ? h('p', { class: 'destaque' }, '🏝️ A Ilha das Férias está aberta!') : null),
        [['🗺️ Voltar para a cidade', () => ir('mapa')]]);
    }, 500);
  }
  aviso('Vamos arrumar o quarto! Guarde as coisas com a mão ✋, varra o lixo com a vassoura 🧹, limpe as manchas com o pano 🧽 e arrume a cama!',
    'Vamos arrumar o quarto! Guarde as coisas com a mão, varra o lixo com a vassoura, limpe as manchas com o pano e arrume a cama!');
};

function dentro(el, x, y, folga = 20) {
  const r = el.getBoundingClientRect();
  return x >= r.left - folga && x <= r.right + folga && y >= r.top - folga && y <= r.bottom + folga;
}

// pode(): quando devolve falso o item não é pego e o toque segue para o chão
function arrastavel(el, aoSoltar, pode = () => true) {
  let sx, sy, arrastando = false;
  el.addEventListener('pointerdown', e => {
    if (!pode()) return;
    e.preventDefault(); e.stopPropagation(); el.setPointerCapture(e.pointerId);
    arrastando = true; sx = e.clientX; sy = e.clientY; el.classList.add('arrastando'); el.style.transition = 'none'; sfx.pop();
  });
  el.addEventListener('pointermove', e => {
    if (arrastando) el.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) scale(1.25)`;
  });
  const fim = e => {
    if (!arrastando) return;
    arrastando = false; el.classList.remove('arrastando');
    if (!aoSoltar(e.clientX, e.clientY)) { el.style.transition = 'transform .3s'; el.style.transform = ''; }
  };
  el.addEventListener('pointerup', fim);
  el.addEventListener('pointercancel', fim);
}

// ==================================================================
// COLÉGIO — juntar as sílabas
// ==================================================================
// Palavras que viram desenhos da família em vez de emoji
const DESENHOS_PALAVRA = {
  PAPAI: () => pessoaSVG('papai'), 'MAMÃE': () => pessoaSVG('mamae'), 'VOVÓ': () => pessoaSVG('vovo'), 'VOVÔ': () => pessoaSVG('vovo2'),
  LIA: () => criancaSVG(S.look), NINA: () => primoSVG(), BATATA: () => batataSVG('feliz', S.batataAcc)
};
// LIA, NINA e BATATA só aparecem se forem os nomes do cadastro
const semAcento = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
function palavraPermitida(p) {
  const chave = PALAVRAS_PESSOAIS[p.s.join('')];
  return !chave || semAcento(perfil()[chave] || '') === p.s.join('');
}

// Menu da escola: sílabas em 3 níveis e atividades com números
CENAS.escola = () => {
  topo('🏫 Escola Estrelinha');
  const cena = h('div', { class: 'cena escola' });
  app.append(cena);
  const balao = h('div', { class: 'balao' }, 'Oi, Lia! O que vamos aprender hoje?');
  cena.append(h('div', { class: 'prof' }, h('div', { class: 'prof-emoji' }, '👩‍🏫'), balao));
  const ATIVIDADES = [
    ['🔤', 'Sílabas', '⭐ Fácil', () => ir('silabas', 1), 'rosa'],
    ['🔤', 'Sílabas', '⭐⭐ Médio', () => ir('silabas', 2), 'rosa'],
    ['📖', 'Palavras', '⭐⭐⭐ Difícil', () => ir('silabas', 3), 'rosa'],
    ['🔢', 'Contar', 'de 1 a 10', () => ir('numeros', 'contar'), 'azul'],
    ['➕', 'Somas', 'até 10', () => ir('numeros', 'somar'), 'azul'],
    ['1 2 ?', 'Sequência', 'até 30', () => ir('numeros', 'sequencia'), 'azul']
  ];
  cena.append(h('div', { class: 'menu-escola' }, ATIVIDADES.map(([ic, nome, sub, fn, cor]) =>
    h('button', { class: 'card-escola ' + cor, onclick: () => { sfx.pop(); fn(); } },
      h('div', { class: 'card-escola-ic' + (ic.length > 3 ? ' texto' : '') }, ic), h('b', {}, nome), h('small', {}, sub)))));
  falar('Oi, Lia! O que vamos aprender hoje? Letras ou números?');
};

CENAS.silabas = (nivel) => {
  topo(`🔤 Sílabas — Nível ${nivel}`, 'escola', '⬅️ Escola');
  const cena = h('div', { class: 'cena escola' });
  app.append(cena);
  const pool = nivel === 3 ? PALAVRAS_DIFICEIS : PALAVRAS.filter(palavraPermitida).filter(p => nivel === 1 ? p.nivel === 1 : p.nivel <= 2 && (p.nivel === 2 || Math.random() < .25));
  const rodada = sortear(pool, 5);
  const premio = 2 + nivel;
  let idx = 0;

  const balao = h('div', { class: 'balao' }, 'Junte as sílabas!');
  const estrelas = h('div', { class: 'estrelas' });
  const quadro = h('div', { class: 'quadro-negro' });
  const opcoes = h('div', { class: 'silabas' });
  cena.append(h('div', { class: 'prof' }, h('div', { class: 'prof-emoji' }, '👩‍🏫'), balao), estrelas, quadro, opcoes);

  function proxima() {
    estrelas.innerHTML = '';
    for (let i = 0; i < rodada.length; i++) estrelas.append(h('span', { class: i < idx ? 'on' : '' }, '⭐'));
    if (idx >= rodada.length) return fim();
    const p = rodada[idx], palavra = p.s.join('');
    let pos = 0, erros = 0;
    const dizer = () => falar(palavra.toLowerCase());
    const slots = p.s.map(() => h('div', { class: 'slot' }));
    quadro.innerHTML = '';
    const desenho = DESENHOS_PALAVRA[palavra];
    quadro.append(desenho ? h('button', { class: 'figura figura-desenho', onclick: dizer, html: desenho() }) : h('button', { class: 'figura', onclick: dizer }, p.e),
      h('div', { class: 'slots' }, slots),
      h('button', { class: 'btn-som', onclick: dizer }, '🔊'));
    opcoes.innerHTML = '';
    const botoes = embaralhar([...p.s, ...sortear(SILABAS.filter(x => !p.s.includes(x)), 2)]).map(sil => {
      const b = h('button', { class: 'silaba' }, sil);
      b.onclick = () => {
        if (b.disabled || pos >= p.s.length) return;
        if (sil === p.s[pos]) {
          b.disabled = true; b.classList.add('usada');
          slots[pos].textContent = sil; slots[pos].classList.add('cheio'); pos++;
          sfx.ok(); falar(sil.toLowerCase());
          botoes.forEach(x => x.classList.remove('dica'));
          if (pos === p.s.length) {
            depois(() => {
              falar(palavra.toLowerCase() + '!'); quadro.classList.add('acertou');
              balao.textContent = palavra === 'BATATA' ? 'BATATA! O nome do seu cachorrinho! 🐶' : `Muito bem! ${palavra}!`;
              ganhar(premio); S.stats.palavras++; salvar();
            }, 500);
            depois(() => { quadro.classList.remove('acertou'); idx++; proxima(); }, 2600);
          }
        } else {
          erros++; errou(b);
          if (erros >= 2) botoes.find(x => !x.disabled && x.textContent === p.s[pos])?.classList.add('dica');
        }
      };
      return b;
    });
    opcoes.append(...botoes);
    balao.textContent = 'Que palavra é essa? Toque nas sílabas na ordem certa!';
    falar(`Vamos formar a palavra ${palavra.toLowerCase()}`);
  }

  function fim() {
    const bonus = 6 + nivel * 4;
    S.escolaRodadas++; salvar(); ganhar(bonus); festa();
    falar('Parabéns, Lia! Você aprendeu muitas palavras hoje!');
    modal(h('div', {}, h('div', { class: 'modal-emoji' }, '🏆'), h('h2', {}, 'Muito bem, Lia!'), h('p', {}, `Você formou 5 palavras! +${bonus} Lia Coins de bônus!`)),
      [['📝 Mais palavras', () => ir('silabas', nivel)], ['🏫 Escola', () => ir('escola')]]);
  }
  proxima();
};

// ==================================================================
// COLÉGIO — números: contar, somar e completar a sequência
// ==================================================================
const OBJETOS_CONTAR = ['🍎', '⭐', '🐶', '🎈', '🌸', '🐟', '🦋', '🍓', '🧁', '🐣', '🚗', '🍭'];

// Alternativas perto da resposta, dentro do intervalo permitido
function opcoesNumericas(certo, min, max) {
  const perto = embaralhar([-3, -2, -1, 1, 2, 3].map(d => certo + d).filter(n => n >= min && n <= max));
  return embaralhar([certo, ...perto.slice(0, 3)]);
}

CENAS.numeros = (modo) => {
  const TITULOS_NUM = { contar: '🔢 Vamos contar!', somar: '➕ Somas', sequencia: '🔢 Sequência de números' };
  topo(TITULOS_NUM[modo], 'escola', '⬅️ Escola');
  const cena = h('div', { class: 'cena escola' });
  app.append(cena);
  const balao = h('div', { class: 'balao' });
  const estrelas = h('div', { class: 'estrelas' });
  const quadro = h('div', { class: 'quadro-negro numeros' });
  const opcoes = h('div', { class: 'silabas' });
  cena.append(h('div', { class: 'prof' }, h('div', { class: 'prof-emoji' }, '👩‍🏫'), balao), estrelas, quadro, opcoes);
  const TOTAL = 5;
  let idx = 0;
  const fala = (txt, voz = txt) => { balao.textContent = txt; falar(voz); };

  // Objetos que ela pode tocar para contar em voz alta (5 por linha, como os dedos da mão)
  function grupo(n, em, contador) {
    const g = h('div', { class: 'grupo-contar' + (n > 5 ? ' duas-linhas' : '') });
    for (let i = 0; i < n; i++) {
      const o = h('button', { class: 'obj-contar' }, em);
      o.onclick = () => {
        if (o.classList.contains('contado')) return;
        contador.n++; o.classList.add('contado');
        o.append(h('span', { class: 'num-badge' }, contador.n));
        sfx.pop(); falar(String(contador.n));
      };
      g.append(o);
    }
    return g;
  }

  function proxima() {
    estrelas.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) estrelas.append(h('span', { class: i < idx ? 'on' : '' }, '⭐'));
    if (idx >= TOTAL) return fim();
    quadro.innerHTML = ''; opcoes.innerHTML = '';
    const contador = { n: 0 };
    const em = OBJETOS_CONTAR[rand(0, OBJETOS_CONTAR.length - 1)];
    let certo, min = 1, max = 10, preencher = null;

    if (modo === 'contar') {
      certo = rand(1, 10);
      quadro.append(grupo(certo, em, contador));
      fala('Quantos tem? Toque em cada um para contar!');
    } else if (modo === 'somar') {
      const a = rand(1, 5), b = rand(1, Math.min(5, 10 - a));
      certo = a + b; min = 2;
      const resposta = h('div', { class: 'conta-resposta' }, '?');
      quadro.append(h('div', { class: 'conta' },
        h('div', { class: 'conta-parte' }, grupo(a, em, contador), h('div', { class: 'conta-num' }, a)),
        h('div', { class: 'conta-sinal' }, '+'),
        h('div', { class: 'conta-parte' }, grupo(b, em, contador), h('div', { class: 'conta-num' }, b)),
        h('div', { class: 'conta-sinal' }, '='), resposta));
      preencher = () => { resposta.textContent = certo; resposta.classList.add('certo'); };
      fala(`Quanto é ${a} + ${b}? Pode contar nos dedinhos!`, `Quanto é ${a} mais ${b}? Pode contar nos dedinhos!`);
    } else {
      const inicio = rand(1, 26), falta = rand(0, 4);
      certo = inicio + falta; max = 30;
      const caixas = [0, 1, 2, 3, 4].map(i => h('div', { class: 'num-caixa' + (i === falta ? ' falta' : '') }, i === falta ? '?' : inicio + i));
      quadro.append(h('div', { class: 'sequencia' }, caixas));
      preencher = () => { caixas[falta].textContent = certo; caixas[falta].classList.add('certo'); };
      fala('Qual número está faltando?');
    }

    let erros = 0, acabou = false;
    const botoes = opcoesNumericas(certo, min, max).map(n => {
      const b = h('button', { class: 'silaba numero' }, n);
      b.onclick = () => {
        if (acabou || b.disabled) return;
        if (n === certo) {
          acabou = true; b.classList.add('certo'); sfx.ok();
          if (preencher) preencher();
          quadro.classList.add('acertou');
          fala(`Isso! ${certo}! 🎉`, `Isso! ${certo}!`);
          ganhar(3);
          depois(() => { quadro.classList.remove('acertou'); idx++; proxima(); }, 2000);
        } else {
          erros++; errou(b); b.disabled = true; b.classList.add('usada');
          fala('Ops! Tente de novo.');
          if (erros >= 2) botoes.find(x => Number(x.textContent) === certo)?.classList.add('dica');
        }
      };
      return b;
    });
    opcoes.append(...botoes);
  }

  function fim() {
    ganhar(10); festa();
    falar('Parabéns, Lia! Você é muito boa com os números!');
    modal(h('div', {}, h('div', { class: 'modal-emoji' }, '🏆'), h('h2', {}, 'Muito bem, Lia!'), h('p', {}, 'Você acertou tudo! +10 Lia Coins de bônus!')),
      [['🔢 De novo', () => ir('numeros', modo)], ['🏫 Escola', () => ir('escola')]]);
  }
  proxima();
};

// ==================================================================
// CASA DA VOVÓ LÚCIA E DO VOVÔ TONHO — cozinhar
// ==================================================================
function cenaAvos(cena, texto) {
  const balao = h('div', { class: 'balao' }, texto);
  cena.append(h('div', { class: 'avos' },
    h('div', { class: 'avo', html: pessoaSVG('vovo') }),
    h('div', { class: 'avo', html: pessoaSVG('vovo2') }), balao));
  return (txt, fala = txt) => { balao.textContent = txt; falar(fala); };
}

CENAS.vovo = () => {
  topo('👵 Casa da Vovó Lúcia e do Vovô Tonho');
  const cena = h('div', { class: 'cena cozinha' });
  app.append(cena);
  const fala = cenaAvos(cena, '');
  fala('Oi, minha netinha! O que vamos cozinhar hoje?');
  cena.append(h('div', { class: 'receitas' }, RECEITAS.map(r =>
    h('button', { class: 'card-receita', onclick: () => { sfx.pop(); cozinhar(r); } },
      h('div', { class: 'receita-icone' }, r.icone), h('div', {}, r.nome)))));
};

function cozinhar(r) {
  ir('vovoCozinhar', r);
}
CENAS.vovoCozinhar = (r) => {
  topo('👵 Cozinhando: ' + r.nome, 'vovo', '⬅️ Receitas');
  const cena = h('div', { class: 'cena cozinha' });
  app.append(cena);
  const fala = cenaAvos(cena, '');
  const conteudo = h('div', { class: 'tigela-conteudo' });
  const tigela = h('button', { class: 'tigela' }, conteudo, h('div', { class: 'tigela-emoji' }, '🥣'));
  const progresso = h('div', { class: 'mexer-barra' }, h('div', {}));
  const lista = h('div', { class: 'receita-lista' }, h('b', {}, r.icone + ' ' + r.nome),
    r.ing.map(id => h('div', { class: 'ing-linha', 'data-id': id }, INGREDIENTES[id][0] + ' ' + INGREDIENTES[id][1])));
  const bancada = h('div', { class: 'bancada' });
  cena.append(lista, h('div', { class: 'centro-cozinha' }, tigela, progresso), bancada);

  let passo = 0;
  const pedir = () => { const [em, nome, art] = INGREDIENTES[r.ing[passo]]; fala(`Agora coloque ${art} ${nome.toLowerCase()} ${em}`, `Agora coloque ${art} ${nome.toLowerCase()}`); };
  const outros = sortear(Object.keys(INGREDIENTES).filter(k => !r.ing.includes(k)), 4);
  embaralhar([...r.ing, ...outros]).forEach(id => {
    const [em, nome, art] = INGREDIENTES[id];
    const b = h('button', { class: 'ingrediente' }, h('span', { class: 'ing-emoji' }, em), h('span', { class: 'ing-nome' }, nome));
    b.onclick = () => {
      if (passo >= r.ing.length || b.disabled) return;
      const certo = r.ing[passo];
      if (id === certo) {
        b.disabled = true; b.classList.add('usado'); sfx.ok(); voarPara(b, tigela, em);
        lista.querySelector(`[data-id="${id}"]`).classList.add('feito');
        depois(() => conteudo.append(h('span', {}, em)), 500);
        passo++;
        depois(passo < r.ing.length ? pedir : mexer, 800);
      } else {
        errou(b);
        const [, nc, ac] = INGREDIENTES[certo];
        fala(`Esse é ${art} ${nome.toLowerCase()}! Procure ${ac} ${nc.toLowerCase()}.`);
        bancada.querySelectorAll('.ingrediente').forEach(x => { if (x.querySelector('.ing-nome').textContent === nc) x.classList.add('dica'); });
      }
    };
    bancada.append(b);
  });
  pedir();

  function mexer() {
    bancada.classList.add('apagada');
    fala('Agora mexa bem! Toque na tigela várias vezes! 🥄', 'Agora mexa bem! Toque na tigela várias vezes!');
    tigela.classList.add('pulsar'); progresso.classList.add('ativa');
    let n = 0;
    tigela.onclick = () => {
      n++; sfx.pop(); tremer(tigela);
      progresso.firstChild.style.width = Math.min(100, n * 12.5) + '%';
      if (n === 8) { tigela.onclick = null; tigela.classList.remove('pulsar'); depois(r.fogo ? cozinharNoFogo : pronto, 500); }
    };
  }
  function cozinharNoFogo() {
    const forno = r.fogo === 'forno';
    fala(forno ? 'Agora vamos assar! Toque no forno! 🔥' : 'Agora vamos para a frigideira! Toque no fogão! 🍳',
      forno ? 'Agora vamos assar! Toque no forno!' : 'Agora vamos para a frigideira! Toque no fogão!');
    const fogo = h('button', { class: 'forno pulsar' }, h('div', { class: 'forno-porta' }, forno ? '🔥' : '🍳'), h('div', { class: 'forno-nome' }, forno ? 'Forno' : 'Fogão'));
    tigela.replaceWith(fogo); progresso.remove();
    fogo.onclick = () => {
      fogo.onclick = null; fogo.classList.remove('pulsar'); fogo.classList.add('quente');
      let t = 3; const porta = fogo.querySelector('.forno-porta');
      porta.textContent = t; fala('Esperando ficar pronto...');
      const it = sempre(() => { t--; if (t > 0) { porta.textContent = t; sfx.pop(); } else { clearInterval(it); pronto(); } }, 1000);
    };
  }
  function pronto() {
    S.stats.receitas++; salvar();
    ganhar(12); festa();
    fala(`Hummm! ${r.nome} ficou delicioso! Obrigada pela ajuda, minha netinha! 💖`, `Hummm! ${r.nome} ficou delicioso! Obrigado pela ajuda, minha netinha!`);
    depois(() => modal(h('div', {}, h('div', { class: 'modal-emoji grande' }, r.icone), h('h2', {}, r.nome + ' pronto!'),
      h('p', {}, 'A Vovó Lúcia e o Vovô Tonho adoraram! +12 Lia Coins')),
      [['🍳 Cozinhar outra', () => ir('vovo')], ['🗺️ Cidade', () => ir('mapa')]]), 1500);
  }
};

// ==================================================================
// CASA DA NINA — maquiagem e roupas
// ==================================================================
function previewItem(it, look = S.look) {
  if (it.tipo === 'pele') return `<div class="amostra" style="background:${PELES[it.val]}"></div>`;
  if (it.tipo === 'corCabelo') return `<div class="amostra" style="background:${CORES_CABELO[it.val]}"></div>`;
  if (it.tipo === 'roupa') return criancaSVG({ ...look, roupa: it.val });
  if (it.tipo === 'batataAcc') return batataSVG('feliz', it.val);
  if (it.icone) return `<div class="emoji-item">${it.icone}</div>`;
  return criancaSVG({ ...look, [it.tipo]: it.val }, { rosto: true });
}

// Onde cada maquiagem é aplicada no rosto (coordenadas do desenho: x, y, raio)
const REGIOES = { batom: [[100, 116, 17]], sombra: [[82, 88, 16], [118, 88, 16]], blush: [[68, 108, 16], [132, 108, 16]], glitter: [[100, 90, 48]], pintura: [[132, 110, 17], [68, 110, 17]] };
const LUGAR_MAQUIAGEM = { batom: 'na boquinha', sombra: 'nos olhinhos', blush: 'nas bochechas', glitter: 'no rostinho', pintura: 'na bochecha' };
const PINCEIS = { batom: '💄', sombra: '🖌️', blush: '🖌️', glitter: '✨', pintura: '🎨' };
const elogios = () => g(['Que lindo!', 'Ficou demais!', 'Amei!', 'Que chique!', 'Uau!'], ['Que legal!', 'Ficou demais!', 'Irado!', 'Que estiloso!', 'Uau!']);

// Para meninas é um camarim de maquiagem; para meninos, uma oficina de heróis e de montar brinquedos
CENAS.prima = () => {
  topo(g('💄 Casa da Nina — Camarim', '🦸 Casa da Nina — Oficina'));
  const cena = h('div', { class: 'cena camarim' + g('', ' oficina') });
  app.append(cena);
  const gira = h('div', { class: 'avatar-gira' });
  const avatar = h('div', { class: 'avatar-grande' }, gira);
  const balao = h('div', { class: 'balao' }, g('Oi, Lia! Vamos brincar de maquiagem?', 'Oi, Lia! Vamos virar super-herói?'));
  const flash = h('div', { class: 'flash' });
  const pincel = h('div', { class: 'pincel' });
  cena.append(h('div', { class: 'palco' },
    avatar,
    h('div', { class: 'prima' }, h('div', { class: 'prima-desenho', html: primoSVG() }), balao),
    h('div', { class: 'botoes-palco' },
      h('button', { class: 'btn btn-girar', onclick: girar }, '🔄 Girar'),
      h('button', { class: 'btn btn-foto', onclick: foto }, '📸 Foto!'))), flash, pincel);
  const abas = h('div', { class: 'abas' }), grade = h('div', { class: 'grade-opcoes' });
  cena.append(h('div', { class: 'painel' }, abas, grade));
  falar(g('Oi, Lia! Vamos brincar de maquiagem e trocar de roupa?', 'Oi, Lia! Vamos trocar de roupa, virar super-herói e montar brinquedos?'));

  // A aba 3 é a de passar com o dedo no rosto (maquiagem ou pintura); a aba sem tipos é a de montar brinquedos
  const ABAS = g(
    [['💇‍♀️', 'Cabelo', ['penteado', 'corCabelo', 'pele']], ['👗', 'Roupas', ['roupa']], ['🎀', 'Enfeites', ['acessorio']], ['💄', 'Maquiagem', ['batom', 'sombra', 'blush', 'glitter', 'pintura']]],
    [['💇‍♂️', 'Cabelo', ['penteado', 'corCabelo', 'pele']], ['🦸', 'Roupas', ['roupa']], ['🧢', 'Chapéus', ['acessorio']], ['🎨', 'Pintura', ['pintura']], ['🧩', 'Montar', null]]);
  const MAQUIAGEM = 3;
  let aba = 0, ferramenta = null;
  const dizer = (txt, voz = txt) => { balao.textContent = personalizar(txt); falar(voz); };
  const desenharAvatar = () => {
    gira.innerHTML = criancaSVG(S.look, { rosto: aba === MAQUIAGEM });
    avatar.classList.toggle('rosto', aba === MAQUIAGEM);
    avatar.classList.toggle('tem-raro', usaRaro(S.look));
  };
  function girar() {
    if (aba === MAQUIAGEM) return;
    gira.classList.remove('girando'); void gira.offsetWidth; gira.classList.add('girando');
    sfx.giro();
  }
  avatar.addEventListener('click', () => { if (aba !== MAQUIAGEM) girar(); });

  // Pegar uma maquiagem: o pincel segue o dedo até ela passar no lugar certo
  function pegar(it) {
    ferramenta = it; esfregado = 0;
    pincel.textContent = it.val === '' ? '🧻' : PINCEIS[it.tipo];
    const r = avatar.getBoundingClientRect();
    moverPincel(r.left + r.width * .8, r.top + r.height * .75);
    pincel.classList.add('visivel');
    dizer(it.val === '' ? `Passe o lencinho ${LUGAR_MAQUIAGEM[it.tipo]} para tirar! 🧻` : `Agora passe o dedo ${LUGAR_MAQUIAGEM[it.tipo]}! 👆`,
      it.val === '' ? `Passe o lencinho ${LUGAR_MAQUIAGEM[it.tipo]} para tirar!` : `Agora passe o dedo ${LUGAR_MAQUIAGEM[it.tipo]}!`);
  }
  function soltarFerramenta() { ferramenta = null; pincel.classList.remove('visivel'); }
  function moverPincel(x, y) { pincel.style.left = x + 'px'; pincel.style.top = y + 'px'; }
  aoSair(soltarFerramenta);

  const pontoNoDesenho = (e) => {
    const svg = gira.querySelector('svg');
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };
  let esfregado = 0, ultimo = null, avisou = false;
  avatar.addEventListener('pointerdown', e => {
    if (!ferramenta) return;
    e.preventDefault(); avatar.setPointerCapture(e.pointerId);
    ultimo = pontoNoDesenho(e); avisou = false; moverPincel(e.clientX, e.clientY);
  });
  avatar.addEventListener('pointermove', e => {
    if (!ferramenta) return;
    moverPincel(e.clientX, e.clientY);
    if (!ultimo) return;
    const p = pontoNoDesenho(e);
    const passo = Math.hypot(p.x - ultimo.x, p.y - ultimo.y);
    ultimo = p;
    const noLugar = REGIOES[ferramenta.tipo].some(([x, y, r]) => Math.hypot(p.x - x, p.y - y) <= r);
    if (noLugar) {
      esfregado += passo;
      if (Math.random() < .3) sfx.esfregar();
      if (esfregado >= 35) aplicar();
    } else if (passo > 2 && !avisou) {
      avisou = true;
      dizer(`Aí não! Passe ${LUGAR_MAQUIAGEM[ferramenta.tipo]}! 😊`, `Aí não! Passe ${LUGAR_MAQUIAGEM[ferramenta.tipo]}!`);
    }
  });
  const fimToque = () => { ultimo = null; };
  avatar.addEventListener('pointerup', fimToque);
  avatar.addEventListener('pointercancel', fimToque);

  function aplicar() {
    const it = ferramenta;
    ultimo = null; soltarFerramenta();
    S.look[it.tipo] = it.val; salvar(); sfx.ok();
    desenharAvatar(); desenharAba(); coracoes(avatar, '✨');
    const ELOGIOS = elogios();
    dizer(it.val === '' ? 'Limpinho! ✨' : ELOGIOS[rand(0, ELOGIOS.length - 1)]);
  }

  function desenharAba() {
    abas.innerHTML = ''; grade.innerHTML = '';
    ABAS.forEach(([ic, nome], i) => abas.append(h('button', { class: 'aba' + (i === aba ? ' ativa' : ''), onclick: () => {
      if (aba === i) return;
      aba = i; sfx.pop(); soltarFerramenta(); desenharAvatar(); desenharAba();
      if (i === MAQUIAGEM) dizer(g('Escolha uma maquiagem e passe com o dedo no rosto! 💄', 'Escolha uma pintura e passe com o dedo no rosto! 🎨'),
        g('Escolha uma maquiagem e passe com o dedo no rosto!', 'Escolha uma pintura e passe com o dedo no rosto!'));
    } }, ic + ' ' + nome)));
    if (!ABAS[aba][2]) { oficinaMontar(grade, dizer); return; }
    ABAS[aba][2].forEach(tipo => {
      grade.append(h('div', { class: 'grupo-titulo' }, TITULOS[tipo]));
      const linha = h('div', { class: 'linha-opcoes' + (tipo === 'roupa' ? ' altas' : '') });
      ITENS.filter(i => i.tipo === tipo && praMim(i)).forEach(it => {
        const meu = tem(it.id), sel = S.look[tipo] === it.val, segurando = ferramenta && ferramenta.id === it.id;
        linha.append(h('button', {
          class: 'opcao' + (sel ? ' sel' : '') + (meu ? '' : ' trancada') + (it.raro ? ' raro' : '') + (segurando ? ' segurando' : ''),
          onclick: () => {
            if (!meu) { sfx.erro(); aviso(`${it.nome}: compre no Shopping por ${it.preco} Lia Coins!`); return; }
            sfx.pop();
            if (aba === MAQUIAGEM) { pegar(it); desenharAba(); return; }
            S.look[tipo] = it.val; salvar(); desenharAvatar(); desenharAba();
            if (tipo === 'roupa') girar(); else pular(avatar);
            const ELOGIOS = elogios();
            balao.textContent = ELOGIOS[rand(0, ELOGIOS.length - 1)];
          }
        }, it.raro ? h('div', { class: 'selo-raro mini' }, '✨') : null,
          h('div', { class: 'opcao-img', html: previewItem(it) }), h('div', { class: 'opcao-nome' }, it.nome),
          meu ? null : h('div', { class: 'cadeado-mini' }, `🔒 ${it.preco}🪙`)));
      });
      grade.append(linha);
    });
  }
  function foto() {
    flash.classList.remove('ativo'); void flash.offsetWidth; flash.classList.add('ativo');
    tom(1200, .05, 'square', .1); tom(800, .1, 'square', .1, .06);
    dizer('Que linda, Lia! Você é uma estrela! ⭐', 'Que linda, Lia! Você é uma estrela!');
    pular(avatar);
    if (S.fotoDia !== hoje()) { S.fotoDia = hoje(); depois(() => ganhar(5), 600); }
  }
  desenharAvatar(); desenharAba();
};

// ==================================================================
// OFICINA — montar brinquedos encaixando as peças no lugar do mesmo formato
// ==================================================================
// Peça: [forma, x, y, largura, altura, cor], em % do tabuleiro.
// Formas: r retângulo, c círculo, t triângulo, v triângulo de ponta para baixo
const MONTAGENS = [
  { nome: 'Robô', icone: '🤖', anim: 'acenar', pecas: [
    ['c', 45, 0, 10, 10, '#f72585'], ['r', 32, 9, 36, 24, '#90e0ef'], ['r', 26, 35, 48, 34, '#4cc9f0'],
    ['r', 10, 37, 14, 30, '#f72585'], ['r', 76, 37, 14, 30, '#f72585'], ['r', 30, 71, 16, 27, '#7209b7'], ['r', 54, 71, 16, 27, '#7209b7']] },
  { nome: 'Carro', icone: '🚗', anim: 'andar', pecas: [
    ['r', 6, 44, 88, 26, '#e63946'], ['r', 26, 22, 46, 24, '#ffadad'], ['c', 14, 60, 24, 24, '#333'], ['c', 62, 60, 24, 24, '#333'], ['c', 86, 48, 9, 9, '#ffd60a']] },
  { nome: 'Foguete', icone: '🚀', anim: 'decolar', pecas: [
    ['r', 34, 26, 32, 46, '#f1faee'], ['t', 34, 2, 32, 24, '#e63946'], ['c', 42, 34, 16, 16, '#4cc9f0'],
    ['t', 16, 54, 18, 24, '#e63946'], ['t', 66, 54, 18, 24, '#e63946'], ['v', 40, 74, 20, 22, '#ffba08']] },
  { nome: 'Castelo', icone: '🏰', anim: 'pular', pecas: [
    ['r', 28, 46, 44, 48, '#adb5bd'], ['r', 8, 30, 20, 64, '#ced4da'], ['r', 72, 30, 20, 64, '#ced4da'], ['t', 4, 8, 28, 22, '#9d4edd'],
    ['t', 68, 8, 28, 22, '#9d4edd'], ['r', 42, 68, 16, 26, '#8d5a3b'], ['t', 40, 26, 20, 20, '#ffd60a']] }
];

function formaSVG(f, w, a, estilo) {
  const forma = f === 'c' ? `<ellipse cx="${w / 2}" cy="${a / 2}" rx="${w / 2 - 1}" ry="${a / 2 - 1}" ${estilo}/>`
    : f === 't' ? `<polygon points="${w / 2},1 ${w - 1},${a - 1} 1,${a - 1}" stroke-linejoin="round" ${estilo}/>`
    : f === 'v' ? `<polygon points="1,1 ${w - 1},1 ${w / 2},${a - 1}" stroke-linejoin="round" ${estilo}/>`
    : `<rect x="1" y="1" width="${w - 2}" height="${a - 2}" rx="${Math.min(w, a) * .18}" ${estilo}/>`;
  return `<svg viewBox="0 0 ${w} ${a}" preserveAspectRatio="none">${forma}</svg>`;
}
const estiloPeca = cor => `fill="${cor}" stroke="rgba(0,0,0,.3)" stroke-width="2" vector-effect="non-scaling-stroke"`;
const ESTILO_VAGA = 'fill="rgba(255,255,255,.6)" stroke="#9d8bb8" stroke-width="2.5" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"';

function oficinaMontar(area, dizer) {
  function escolher() {
    area.innerHTML = '';
    area.append(h('div', { class: 'grupo-titulo' }, 'O que vamos montar?'),
      h('div', { class: 'montagens' }, MONTAGENS.map(m =>
        h('button', { class: 'card-montagem', onclick: () => { sfx.pop(); montar(m); } }, h('div', { class: 'card-montagem-ic' }, m.icone), m.nome))));
  }
  function montar(m) {
    area.innerHTML = '';
    const tabuleiro = h('div', { class: 'tabuleiro' }), bandeja = h('div', { class: 'bandeja' });
    area.append(h('div', { class: 'montar-topo' },
      h('button', { class: 'btn cinza btn-mini', onclick: () => { sfx.pop(); escolher(); } }, '⬅️ Outro'), h('b', {}, `${m.icone} ${m.nome}`)),
      h('div', { class: 'montar-area' }, tabuleiro, bandeja));
    const lugar = (x, y, w, a) => `left:${x}%;top:${y}%;width:${w}%;height:${a}%`;
    const vagas = m.pecas.map(([f, x, y, w, a]) => {
      const v = h('div', { class: 'vaga', style: lugar(x, y, w, a), html: formaSVG(f, w, a, ESTILO_VAGA) });
      v.chave = f + w + 'x' + a;
      tabuleiro.append(v);
      return v;
    });
    let faltam = vagas.length;
    const centro = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, Math.max(r.width, r.height)]; };

    // Peças misturadas na bandeja: as grandes por baixo, as pequenas por cima
    [...m.pecas].sort((p, q) => q[3] * q[4] - p[3] * p[4]).forEach(([f, , , w, a, cor]) => {
      const p = h('div', { class: 'peca', style: lugar(rand(0, 100 - w), rand(0, 100 - a), w, a) + `;--r:${rand(-15, 15)}deg`, html: formaSVG(f, w, a, estiloPeca(cor)) });
      bandeja.append(p);
      arrastavel(p, () => {
        const [cx, cy] = centro(p), chave = f + w + 'x' + a;
        const perto = vagas.filter(v => !v.cheia && v.chave === chave)
          .map(v => { const [vx, vy, tam] = centro(v); return { v, d: Math.hypot(vx - cx, vy - cy), tam }; })
          .sort((x, y) => x.d - y.d)[0];
        if (perto && perto.d <= perto.tam * .6) {
          const v = perto.v;
          v.cheia = true; v.classList.add('cheia'); v.innerHTML = formaSVG(f, w, a, estiloPeca(cor));
          p.remove(); sfx.ok(); pular(v);
          if (--faltam === 0) pronto();
          return true;
        }
        // Soltou em cima de um lugar de outro formato: conta como erro
        if (vagas.some(v => !v.cheia && dentro(v, cx, cy, 0))) { errou(p); dizer('Essa peça não encaixa aí. Procure o lugar do mesmo formato!'); }
        return false;
      });
    });
    dizer(`Vamos montar o ${m.nome.toLowerCase()}! Arraste cada peça para o lugar do mesmo formato. 🧩`,
      `Vamos montar o ${m.nome.toLowerCase()}! Arraste cada peça para o lugar do mesmo formato.`);

    function pronto() {
      tabuleiro.classList.add('pronto', 'anim-' + m.anim);
      festa(); ganhar(10);
      dizer(`Uau! Você montou o ${m.nome.toLowerCase()}! 🎉`, `Uau! Você montou o ${m.nome.toLowerCase()}!`);
      depois(() => modal(h('div', {}, h('div', { class: 'modal-emoji' }, m.icone), h('h2', {}, m.nome + ' pronto!'), h('p', {}, 'Você montou tudo sozinho! +10 Lia Coins')),
        [['🧩 Montar outro', escolher], ['🗺️ Cidade', () => ir('mapa')]]), 2200);
    }
  }
  escolher();
}

// ==================================================================
// MERCADO — nomes das frutas
// ==================================================================
CENAS.mercado = () => {
  topo('🛒 Mercado');
  const cena = h('div', { class: 'cena mercado' });
  app.append(cena);
  const lista = sortear(FRUTAS, 5);
  const naPrateleira = embaralhar([...lista, ...sortear(FRUTAS.filter(f => !lista.includes(f)), 7)]);
  let atual = 0, erros = 0;

  const caixa = h('div', { class: 'lista-compras' }, h('div', { class: 'lista-titulo' }, '📝 Lista da Mamãe'));
  const linhas = lista.map(f => {
    const l = h('div', { class: 'lista-item' }, h('span', { class: 'lista-check' }, '⬜'), h('span', { class: 'lista-nome' }, f.nome),
      h('button', { class: 'btn-som-mini', onclick: () => falar(f.nome) }, '🔊'));
    caixa.append(l); return l;
  });
  const carrinhoItens = h('div', { class: 'carrinho-itens' });
  const carrinho = h('div', { class: 'carrinho' }, carrinhoItens, h('div', { class: 'carrinho-emoji' }, '🛒'));
  const prateleira = h('div', { class: 'prateleira-mercado' });
  cena.append(h('div', { class: 'lado-mercado' }, caixa, carrinho), prateleira);

  const botoes = naPrateleira.map(f => {
    const b = h('button', { class: 'fruta' }, h('span', { class: 'fruta-emoji' }, f.e), h('span', { class: 'fruta-nome' }, f.nome));
    b.onclick = () => {
      if (atual >= lista.length) return;
      b.classList.add('mostra'); setTimeout(() => b.classList.remove('mostra'), 1500);
      const alvo = lista[atual];
      if (f === alvo) {
        sfx.ok(); falar(f.nome + '!'); voarPara(b, carrinho, f.e);
        depois(() => carrinhoItens.append(h('span', {}, f.e)), 600);
        linhas[atual].classList.remove('atual'); linhas[atual].classList.add('feito');
        linhas[atual].querySelector('.lista-check').textContent = '✅ ' + f.e;
        botoes.forEach(x => x.classList.remove('dica'));
        ganhar(2); atual++; erros = 0;
        depois(atual < lista.length ? pedir : fim, 1300);
      } else {
        erros++; errou(b);
        falar(`Essa é ${f.art} ${f.nome}! Procure ${alvo.art} ${alvo.nome}.`);
        if (erros >= 2) botoes[naPrateleira.indexOf(alvo)].classList.add('dica');
      }
    };
    prateleira.append(b);
    return b;
  });

  function pedir() {
    linhas.forEach(l => l.classList.remove('atual'));
    linhas[atual].classList.add('atual');
    const f = lista[atual]; falar(`Pegue ${f.art} ${f.nome}`);
  }
  function fim() {
    S.stats.frutas += lista.length; salvar();
    ganhar(8); festa();
    falar('Muito bem, Lia! Você comprou tudo da lista da mamãe!');
    modal(h('div', {}, h('div', { class: 'modal-emoji' }, '🛒💖'), h('h2', {}, 'Compras feitas!'), h('p', {}, 'Você achou todas as frutas da lista! +8 Lia Coins')),
      [['🍎 Fazer outra compra', () => ir('mercado')], ['🗺️ Cidade', () => ir('mapa')]]);
  }
  depois(pedir, 400);
};

// ==================================================================
// SHOPPING — gastar as Lia Coins
// ==================================================================
CENAS.shopping = () => {
  topo('🛍️ Shopping');
  const cena = h('div', { class: 'cena shopping' });
  app.append(cena);
  const CATS = g(
    [['✨', 'Raros', 'raros'], ['👗', 'Roupas', ['roupa']], ['💇‍♀️', 'Cabelos', ['corCabelo', 'penteado']], ['🎀', 'Enfeites', ['acessorio']],
     ['💄', 'Maquiagem', ['batom', 'sombra', 'blush', 'glitter', 'pintura']], ['🧸', 'Brinquedos', ['brinquedo']], ['🐶', 'Batata', ['batataAcc', 'batataBrinquedo']]],
    [['✨', 'Raros', 'raros'], ['🦸', 'Roupas', ['roupa']], ['💇‍♂️', 'Cabelos', ['corCabelo', 'penteado']], ['🧢', 'Chapéus', ['acessorio']],
     ['🎨', 'Pintura', ['pintura']], ['🧸', 'Brinquedos', ['brinquedo']], ['🐶', 'Batata', ['batataAcc', 'batataBrinquedo']]]);
  let cat = 0;
  const abas = h('div', { class: 'abas-loja' }), grade = h('div', { class: 'vitrine' });
  cena.append(abas, grade);
  falar('Bem-vinda ao shopping! Use as suas Lia Coins para comprar coisas lindas!');

  function desenhar() {
    abas.innerHTML = ''; grade.innerHTML = '';
    CATS.forEach(([ic, nome], i) => abas.append(h('button', { class: 'aba' + (i === cat ? ' ativa' : ''), onclick: () => { cat = i; sfx.pop(); desenhar(); } }, h('div', { class: 'aba-ic' }, ic), nome)));
    const filtro = CATS[cat][2] === 'raros' ? i => i.raro : i => CATS[cat][2].includes(i.tipo);
    ITENS.filter(i => filtro(i) && praMim(i) && i.preco > 0).sort((a, b) => a.preco - b.preco).forEach(it => {
      const meu = tem(it.id), pode = S.coins >= it.preco;
      grade.append(h('button', { class: 'produto' + (meu ? ' meu' : '') + (!meu && !pode ? ' caro' : '') + (it.raro ? ' raro' : ''), onclick: () => comprar(it) },
        it.raro ? h('div', { class: 'selo-raro' }, '✨ RARO') : null,
        h('div', { class: 'produto-img' + (it.tipo === 'roupa' ? ' alta' : ''), html: previewItem(it) }),
        h('div', { class: 'produto-nome' }, it.nome),
        h('div', { class: 'preco' }, meu ? '✔ É seu!' : `🪙 ${it.preco}`)));
    });
  }
  function comprar(it) {
    if (tem(it.id)) { aviso('Você já tem! ' + (it.tipo === 'brinquedo' ? 'Está no seu quarto.' : 'Use na casa da Nina.')); return; }
    if (S.coins < it.preco) { sfx.erro(); aviso(`Faltam ${it.preco - S.coins} Lia Coins. Faça as missões para ganhar mais!`); return; }
    falar(`Comprar ${it.nome}?`);
    modal(h('div', {}, h('div', { class: 'produto-img grande' + (it.tipo === 'roupa' ? ' alta' : ''), html: previewItem(it) }),
      h('h2', {}, it.nome), h('p', {}, `Comprar por 🪙 ${it.preco} Lia Coins?`)),
      [['✔ Sim, quero!', () => {
        S.coins -= it.preco; S.donos.push(it.id);
        if (it.tipo in LOOK_PADRAO) S.look[it.tipo] = it.val;
        if (it.tipo === 'batataAcc' || it.tipo === 'batataBrinquedo') S[it.tipo] = it.val;
        salvar(); atualizarMoedas(); festa(); aviso('Agora é seu! 🎉', 'Agora é seu!'); desenhar();
      }, 'verde'], ['✖ Não', null, 'cinza']]);
  }
  desenhar();
};

// ==================================================================
// BATATA — alimentar e brincar
// ==================================================================
CENAS.batata = () => {
  tick();
  topo('🐶 Brincando com o Batata');
  const cena = h('div', { class: 'cena quintal' });
  app.append(cena);
  const iconeBrinq = () => ITENS.find(i => i.id === 'batataBrinquedo:' + S.batataBrinquedo)?.icone || '🎾';
  const barras = h('div', { class: 'barras-batata' });
  const dentroDog = h('div', { class: 'dog-inner' });
  const dog = h('button', { class: 'dog' }, dentroDog);
  const pote = h('div', { class: 'pote' }, h('span', { class: 'racao' }), '🥣');
  const brinquedo = h('div', { class: 'brinquedo-dog' }, iconeBrinq());
  const opcoesBatata = h('div', { class: 'opcoes-batata' });
  cena.append(h('div', { class: 'cerca' }), h('div', { class: 'casinha' }, '🏠'), h('div', { class: 'crianca-quintal', html: criancaSVG(S.look) }),
    pote, brinquedo, dog, barras, opcoesBatata,
    h('div', { class: 'botoes-batata' },
      h('button', { class: 'btn', onclick: alimentar }, '🥣 Comida'),
      h('button', { class: 'btn', onclick: brincar }, h('span', { class: 'ic-brinq' }, iconeBrinq()), ' Brincar'),
      h('button', { class: 'btn', onclick: carinho }, '✋ Carinho')));
  dog.addEventListener('click', carinho);

  const desenharBarras = () => { barras.innerHTML = ''; barras.append(barra('🍖 Barriguinha', S.batata.fome, '#ffb703'), barra('❤️ Alegria', S.batata.alegria, '#ff4d8d')); };
  const desenharDog = () => dentroDog.innerHTML = batataSVG(humorBatata(), S.batataAcc);
  function desenharOpcoes() {
    opcoesBatata.innerHTML = '';
    [['batataAcc', 'Roupinha'], ['batataBrinquedo', 'Brinquedo']].forEach(([tipo, rot]) => {
      const meus = ITENS.filter(i => i.tipo === tipo && tem(i.id) && praMim(i));
      if (meus.length < 2) return;
      opcoesBatata.append(h('div', { class: 'mini-titulo' }, rot), h('div', { class: 'mini-linha' }, meus.map(it =>
        h('button', { class: 'mini-opcao' + (S[tipo] === it.val ? ' sel' : ''), onclick: () => {
          S[tipo] = it.val; salvar(); sfx.pop(); desenharDog(); desenharOpcoes();
          brinquedo.textContent = iconeBrinq(); cena.querySelector('.ic-brinq').textContent = iconeBrinq();
        } }, it.icone || (it.val === 'laco' ? '🎀' : it.val === 'chapeu' ? '🥳' : '🚫')))));
    });
  }
  desenharBarras(); desenharDog(); desenharOpcoes();
  falar(humorBatata() === 'triste' ? 'O Batata está tristinho. Dê comida e brinque com ele!' : 'Au au! O Batata quer brincar!');

  let ocupado = false;
  function alimentar() {
    if (ocupado) return;
    if (S.batata.fome >= 95) { aviso('O Batata está de barriga cheia! 😋', 'O Batata está de barriga cheia!'); return; }
    ocupado = true;
    const comFome = S.batata.fome < 70;
    pote.classList.add('cheio'); dog.classList.add('vai-comer'); dentroDog.classList.remove('direita');
    depois(() => { dog.classList.add('comendo'); sfx.nhac(); }, 700);
    depois(() => {
      dog.classList.remove('comendo', 'vai-comer'); pote.classList.remove('cheio');
      S.batata.fome = clamp(S.batata.fome + 35); salvar();
      desenharBarras(); desenharDog(); coracoes(dog, '😋'); falar('Hummm! Obrigado, Lia! Au au!');
      if (comFome) ganhar(2);
      ocupado = false;
    }, 2400);
  }
  function brincar() {
    if (ocupado) return;
    ocupado = true;
    const precisava = S.batata.alegria < 80;
    brinquedo.classList.add('jogado'); sfx.pop();
    depois(() => { dog.classList.add('correndo', 'vai-pegar'); dentroDog.classList.add('direita'); sfx.au(); }, 300);
    depois(() => { brinquedo.classList.add('sumiu'); dentroDog.classList.remove('direita'); dog.classList.remove('vai-pegar'); }, 1300);
    depois(() => {
      dog.classList.remove('correndo'); brinquedo.classList.remove('jogado', 'sumiu');
      S.batata.alegria = clamp(S.batata.alegria + 15); salvar();
      desenharBarras(); desenharDog(); coracoes(dog); sfx.au();
      if (precisava) ganhar(1);
      ocupado = false;
    }, 2300);
  }
  function carinho() {
    if (ocupado) return;
    S.batata.alegria = clamp(S.batata.alegria + 4); salvar();
    coracoes(dog); sfx.au(); pular(dog); desenharBarras(); desenharDog();
  }
};

// ==================================================================
// ILHA DAS FÉRIAS
// ==================================================================
CENAS.ilha = () => {
  topo('🏝️ Ilha das Férias');
  const cena = h('div', { class: 'cena praia' });
  app.append(cena);
  cena.append(h('div', { class: 'sol' }, '☀️'), h('div', { class: 'mar-praia' }, h('div', { class: 'onda' }), h('div', { class: 'barco' }, '⛵')),
    h('div', { class: 'areia' }), h('div', { class: 'palmeira' }, '🌴'));

  if (!ilhaAberta()) {
    cena.classList.add('fechada');
    cena.append(h('div', { class: 'painel-info' },
      h('div', { class: 'modal-emoji' }, '🔒'),
      h('h2', {}, 'A ilha está fechada'),
      h('p', {}, 'Ela abre quando o Papai Paulo e a Mamãe Clara estiverem bem felizes!'),
      termometro(),
      h('p', {}, 'Dica: arrume o seu quarto! 🧹'),
      h('button', { class: 'btn', onclick: () => ir('casa') }, '🏠 Arrumar o quarto')));
    falar('A ilha abre quando o papai Paulo e a mamãe Clara estiverem bem felizes! Arrume o seu quarto!');
    return;
  }

  const areia = cena.querySelector('.areia');
  cena.append(h('div', { class: 'crianca-praia', html: criancaSVG(S.look) }), h('div', { class: 'batata-praia', html: batataSVG('feliz', S.batataAcc) }));
  const placar = h('div', { class: 'placar' });
  const botao = h('button', { class: 'btn btn-grande', onclick: comecar }, '🐚 Caçar tesouros!');
  cena.append(placar, botao);
  falar('Oba! Férias na ilha! Vamos caçar conchinhas?');
  if (S.ilhaDia !== hoje()) { S.ilhaDia = hoje(); salvar(); depois(() => { ganhar(10); aviso('🎁 Presente das férias: +10 Lia Coins!', 'Presente das férias! Dez Lia Coins!'); }, 1000); }

  function comecar() {
    botao.remove();
    let pontos = 0, tempo = 30;
    const mostrar = () => placar.textContent = `⏱️ ${tempo}   ⭐ ${pontos}`;
    mostrar();
    const TESOUROS = [['🐚', 1], ['🐚', 1], ['🐚', 1], ['🌟', 2], ['🌟', 2], ['🦀', 3], ['💎', 5]];
    const relogio = sempre(() => { tempo--; mostrar(); if (tempo <= 0) acabar(); }, 1000);
    const nasce = sempre(() => {
      const [em, val] = TESOUROS[rand(0, TESOUROS.length - 1)];
      const t = h('button', { class: 'tesouro' + (em === '🦀' ? ' anda' : ''), style: `left:${rand(4, 90)}%;top:${rand(8, 78)}%` }, em);
      t.onclick = () => {
        if (t.classList.contains('pego')) return;
        pontos += val; mostrar(); sfx.pop(); t.classList.add('pego');
        const g = h('div', { class: 'mais', style: t.style.cssText }, '+' + val); areia.append(g);
        setTimeout(() => { t.remove(); g.remove(); }, 600);
      };
      areia.append(t);
      setTimeout(() => t.remove(), 2400);
    }, 650);
    function acabar() {
      clearInterval(relogio); clearInterval(nasce);
      areia.querySelectorAll('.tesouro').forEach(t => t.remove());
      const moedas = Math.min(25, Math.ceil(pontos / 3));
      if (moedas > 0) ganhar(moedas);
      festa();
      falar(`Uau! Você achou ${pontos} pontos de tesouros!`);
      modal(h('div', {}, h('div', { class: 'modal-emoji' }, '🐚🌟🦀'), h('h2', {}, 'Que férias!'), h('p', {}, `Você fez ${pontos} pontos e ganhou ${moedas} Lia Coins!`)),
        [['🐚 Jogar de novo', () => ir('ilha')], ['🗺️ Cidade', () => ir('mapa')]]);
    }
  }
};

// ==================================================================
// ÁREA DOS PAPAIS (protegida por uma continha)
// ==================================================================
function areaPais() {
  const a = rand(6, 9), b = rand(5, 9), certo = a + b;
  modal(h('div', {}, h('h2', {}, '🔐 Área dos Papais'), h('p', {}, `Quanto é ${a} + ${b}?`)),
    embaralhar([certo, certo + 1, certo - 2, certo + 3]).map(n => [String(n), () => n === certo ? painelPais() : aviso('Ops! Só os papais podem entrar 😉', 'Ops! Só os papais podem entrar!')]));
}
function painelPais() {
  modal(h('div', {}, h('h2', {}, '⚙️ Área dos Papais'),
    h('p', { class: 'pequeno' }, `Lia Coins: ${S.coins} · Termômetro: ${Math.round(S.papais)}% · Quartos arrumados: ${S.stats.quartos} · Palavras: ${S.stats.palavras} · Receitas: ${S.stats.receitas} · Frutas: ${S.stats.frutas}`)),
    [[S.som ? '🔊 Som ligado' : '🔇 Som desligado', () => { S.som = !S.som; salvar(); painelPais(); }],
     [S.voz ? '🗣️ Voz ligada' : '🤐 Voz desligada', () => { S.voz = !S.voz; salvar(); painelPais(); }],
     ['🔁 Trocar voz ' + (() => { const l = listaDeVozes(); return l.length ? `(${S.vozEscolhida % l.length + 1} de ${l.length})` : ''; })(), () => {
       const l = listaDeVozes();
       if (l.length) S.vozEscolhida = (S.vozEscolhida + 1) % l.length;
       salvar(); falar('Oi, Lia! Eu sou a voz do seu jogo!'); painelPais();
     }],
     [`🎵 Tom da voz: ${TONS.indexOf(S.tomVoz) + 1} de ${TONS.length}`, () => {
       S.tomVoz = TONS[(TONS.indexOf(S.tomVoz) + 1) % TONS.length];
       salvar(); falar('Oi, Lia! Eu sou a voz do seu jogo!'); painelPais();
     }],
     ['🪙 Dar 50 moedas', () => { ganhar(50); painelPais(); }],
     ['😍 Encher termômetro', () => { S.papais = 100; salvar(); ir('mapa'); }],
     ['🧹 Bagunçar o quarto', () => { S.quartoLimpoEm = 0; salvar(); ir('mapa'); }],
     ['✏️ Editar cadastro', () => ir('cadastro', true)],
     ['🗑️ Recomeçar o jogo', () => modal(h('p', {}, 'Apagar todo o progresso da Lia?'),
       [['Sim, apagar', () => { localStorage.removeItem(SAVE); location.reload(); }, 'vermelho'], ['Cancelar', null, 'cinza']]), 'vermelho'],
     ['✖ Fechar', null, 'cinza']]);
}

// ---------- Início ----------
setInterval(() => { tick(); }, 60000);
document.addEventListener('visibilitychange', () => { if (document.hidden) salvar(); });
// Na versão web (iPhone, iPad, navegador) o jogo fica guardado no aparelho para abrir sem internet
if ('serviceWorker' in navigator && location.protocol === 'https:' && !(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
ir('inicio');
