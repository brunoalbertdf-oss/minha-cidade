// ===== Desenhos do jogo (SVG): Lia, Batata, prédios e carros da cidade =====

const PELES = { clara: '#ffe0c7', media: '#f3c39b', morena: '#c98b5a', escura: '#8d5524' };
const CORES_CABELO = { castanho: '#5a3420', preto: '#1f1a1a', loiro: '#f0c75e', ruivo: '#c8512c', rosa: '#ff7eb6', azul: '#4aa8ff', roxo: '#9b5de5', verde: '#2ec4b6', dourado: '#f5c518' };
const BATONS = { rosa: '#ff5c8a', vermelho: '#e01e37', roxo: '#9d4edd', coral: '#ff7f50', dourado: '#e0b000' };
const SOMBRAS = { azul: '#6ec6ff', rosa: '#ff8fc8', roxa: '#b388ff', verde: '#7ed957' };
const ARCO_IRIS = ['#ff595e', '#ff924c', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
const ROUPAS = {
  vestido_rosa:    { t: 'vestido',   c1: '#ff8fc8', c2: '#ff4d8d', bolinhas: true },
  camiseta_saia:   { t: 'saia',      c1: '#ffffff', c2: '#5dade2' },
  macacao:         { t: 'macacao',   c1: '#ffd166', c2: '#3a86ff' },
  vestido_amarelo: { t: 'vestido',   c1: '#ffe066', c2: '#ff9f1c' },
  maio:            { t: 'maio',      c1: '#00bbf9', c2: '#fee440', sapato: '#ffd60a' },
  caipira:         { t: 'caipira',   c1: '#e63946', c2: '#ffd60a' },
  pijama:          { t: 'pijama',    c1: '#cdb4db', c2: '#fff', sapato: '#cdb4db' },
  tricolor:        { t: 'tricolor',  c1: '#0d80bf', c2: '#4a6fa5' },
  bailarina:       { t: 'bailarina', c1: '#ffafcc', c2: '#ffc8dd', sapato: '#ff8fc8' },
  princesa:        { t: 'princesa',  c1: '#c77dff', c2: '#e0aaff' },
  arcoiris:        { t: 'arcoiris',  c1: '#ffca3a', c2: '#fff' },
  fada:            { t: 'fada',      c1: '#b9fbc0', c2: '#5ee6c8' },
  heroina:         { t: 'heroina',   c1: '#7b2cbf', c2: '#ffd60a', sapato: '#e63946' },
  sereia:          { t: 'sereia',    c1: '#2ec4b6', c2: '#c77dff' },
  gelo:            { t: 'gelo',      c1: '#a9def9', c2: '#e4f5ff' },
  // Roupas de menino
  bermuda:          { t: 'bermuda',    c1: '#4cc9f0', c2: '#3a5a8c', sapato: '#3a86ff' },
  calca:            { t: 'calca',      c1: '#ff9f1c', c2: '#355c9a', sapato: '#e63946' },
  futebol_br:       { t: 'futebol',    c1: '#ffdf00', c2: '#009c3b', c3: '#1e40af', num: 10, meia: '#fff', sapato: '#111' },
  futebol_vermelho: { t: 'futebol',    c1: '#e63946', c2: '#fff', c3: '#fff', num: 7, meia: '#e63946', sapato: '#111' },
  futebol_azul:     { t: 'futebol',    c1: '#1d4ed8', c2: '#fff', c3: '#111', num: 9, meia: '#1d4ed8', sapato: '#111' },
  bombeiro:         { t: 'bombeiro',   c1: '#d62828', c2: '#ffd60a', sapato: '#222' },
  pirata:           { t: 'pirata',     c1: '#fff', c2: '#c1121f', sapato: '#3b2416' },
  heroi_azul:       { t: 'heroi',      c1: '#1d4ed8', c2: '#e63946', emb: 'raio', capa: '#e63946', sapato: '#e63946' },
  heroi_verde:      { t: 'heroi',      c1: '#2a9d8f', c2: '#111', emb: 'estrela', capa: '#111', sapato: '#111' },
  heroi_fogo:       { t: 'heroi',      c1: '#e85d04', c2: '#ffba08', emb: 'fogo', capa: '#ffba08', sapato: '#9d0208', raro: true },
  astronauta:       { t: 'astronauta', c1: '#f1f3f5', c2: '#4361ee', sapato: '#adb5bd' },
  dino:             { t: 'dino',       c1: '#70e000', c2: '#ccff33', sapato: '#38b000' },
  cavaleiro:        { t: 'cavaleiro',  c1: '#adb5bd', c2: '#ffd60a', sapato: '#6c757d' },
  robo:             { t: 'robo',       c1: '#90e0ef', c2: '#f72585', sapato: '#48cae4' }
};
const P_BERMUDA = 'M70 186 L130 186 L132 228 L104 228 L100 208 L96 228 L68 228 Z';
const raioD = (x, y, s = 1) => `M${x + 4 * s} ${y - 14 * s} L${x - 8 * s} ${y + 2 * s} L${x} ${y + 2 * s} L${x - 4 * s} ${y + 14 * s} L${x + 8 * s} ${y - 2 * s} L${x} ${y - 2 * s} Z`;
const chamaD = (x, y, s = 1) => `M${x} ${y - 14 * s} Q${x + 12 * s} ${y - 2 * s} ${x + 7 * s} ${y + 10 * s} Q${x} ${y + 15 * s} ${x - 7 * s} ${y + 10 * s} Q${x - 12 * s} ${y - 2 * s} ${x - 3 * s} ${y - 6 * s} Q${x - 2 * s} ${y + 2 * s} ${x + 2 * s} ${y + 1 * s} Q${x + 3 * s} ${y - 6 * s} ${x} ${y - 14 * s} Z`;

let _uid = 0; // ids únicos para gradientes e recortes dentro dos SVGs

function estrelaD(x, y, r) {
  return `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
}
function estrela(x, y, r, cor) { return `<path d="${estrelaD(x, y, r)}" fill="${cor}"/>`; }
// Estrelinha que pisca (usada nos itens raros)
function brilho(x, y, r, cor = '#fff', atraso = 0, dur = 1.6) {
  return `<path d="${estrelaD(x, y, r)}" fill="${cor}" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="${dur}s" begin="${atraso}s" repeatCount="indefinite"/></path>`;
}

function cabeloTras(p, c) {
  const capa = `<circle cx="100" cy="80" r="55" fill="${c}"/>`;
  const laco = '#ff4d8d';
  switch (p) {
    case 'rabo': return capa + `<path d="M140 50 Q196 60 182 160 Q176 186 160 196 Q168 150 150 100 Z" fill="${c}"/><circle cx="146" cy="54" r="8" fill="${laco}"/>`;
    case 'chiquinhas': return capa +
      `<path d="M56 70 Q6 96 22 170 Q26 186 38 190 Q32 140 62 100 Z" fill="${c}"/><path d="M144 70 Q194 96 178 170 Q174 186 162 190 Q168 140 138 100 Z" fill="${c}"/>` +
      `<circle cx="54" cy="74" r="8" fill="${laco}"/><circle cx="146" cy="74" r="8" fill="${laco}"/>`;
    case 'coque': return `<circle cx="100" cy="24" r="24" fill="${c}"/>` + capa + `<rect x="84" y="20" width="32" height="7" rx="3" fill="${laco}"/>`;
    case 'coquinhos': return `<circle cx="56" cy="36" r="21" fill="${c}"/><circle cx="144" cy="36" r="21" fill="${c}"/>` + capa;
    case 'curto': return `<path d="M44 88 Q40 22 100 22 Q160 22 156 88 L158 132 Q148 140 138 132 L62 132 Q52 140 42 132 Z" fill="${c}"/>`;
    case 'trancas': {
      let s = capa;
      [-1, 1].forEach(lado => {
        for (let i = 0; i < 7; i++) s += `<ellipse cx="${100 + lado * (47 + (i % 2) * 3)}" cy="${112 + i * 15}" rx="11" ry="10" fill="${c}"/>`;
        s += `<circle cx="${100 + lado * 48}" cy="${214}" r="6" fill="${laco}"/><path d="M${100 + lado * 48 - 6} 220 Q${100 + lado * 48} 238 ${100 + lado * 48 + 6} 220 Z" fill="${c}"/>`;
      });
      return s;
    }
    case 'cacheado': {
      let s = capa;
      [[44, 70], [40, 100], [40, 130], [44, 158], [56, 180], [156, 70], [160, 100], [160, 130], [156, 158], [144, 180],
       [58, 40], [78, 26], [100, 22], [122, 26], [142, 40]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="19" fill="${c}"/>`);
      return s;
    }
    // Cabelos de menino: só uma "touca" atrás da cabeça; o desenho principal fica na franja
    case 'm_curto': case 'm_espetado': case 'm_topete': case 'm_tigela':
      return `<path d="M48 90 Q44 28 100 28 Q156 28 152 90 Z" fill="${c}"/>`;
    case 'm_cacheado': return [[50, 80], [52, 56], [66, 38], [84, 30], [100, 28], [116, 30], [134, 38], [148, 56], [150, 80]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}"/>`).join('');
    case 'm_moicano': return '';
    default: return `<path d="M44 85 Q40 22 100 22 Q160 22 156 85 L164 200 Q132 212 100 206 Q68 212 36 200 Z" fill="${c}"/>`;
  }
}

function franja(p, c) {
  switch (p) {
    case 'cacheado': return [[58, 62], [72, 48], [88, 42], [104, 41], [120, 45], [134, 53], [146, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/>`).join('');
    case 'm_curto': return `<path d="M51 82 Q48 32 100 32 Q152 32 149 82 Q142 58 122 54 Q106 62 90 55 Q68 58 51 82 Z" fill="${c}"/>`;
    case 'm_espetado': return `<path d="M51 82 Q48 46 58 38 L50 18 L72 30 L76 6 L92 26 L102 2 L112 26 L128 8 L130 32 L150 20 L142 44 Q152 56 149 82 Q140 58 120 56 Q100 62 80 56 Q60 58 51 82 Z" fill="${c}"/>`;
    case 'm_topete': return `<path d="M51 82 Q48 32 100 32 Q152 32 149 82 Q142 58 122 54 Q106 62 90 55 Q68 58 51 82 Z" fill="${c}"/>` +
      `<path d="M66 46 Q70 8 112 6 Q142 6 140 28 Q124 18 106 32 Q90 40 66 46 Z" fill="${c}"/>`;
    case 'm_tigela': return `<path d="M48 90 Q44 30 100 30 Q156 30 152 90 L150 72 Q100 66 50 72 Z" fill="${c}"/>`;
    case 'm_cacheado': return [[60, 58], [74, 46], [90, 42], [106, 42], [122, 46], [138, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${c}"/>`).join('');
    case 'm_moicano': return `<path d="M50 82 Q48 36 100 34 Q152 36 150 82 Q100 60 50 82 Z" fill="${c}" opacity=".35"/>` +
      `<path d="M86 60 L84 26 L90 32 L92 6 L98 22 L104 0 L108 22 L114 10 L116 34 L114 60 Q100 54 86 60 Z" fill="${c}"/>`;
  }
  return `<path d="M50 84 Q46 28 100 29 Q154 28 150 84 Q146 60 130 50 Q118 66 98 58 Q80 70 70 54 Q56 62 50 84 Z" fill="${c}"/>`;
}

const P_VESTIDO = 'M75 142 Q100 134 125 142 L134 182 L152 232 Q100 244 48 232 L66 182 Z';
const P_CAMISA = 'M75 142 Q100 134 125 142 L130 190 L70 190 Z';
const P_CALCA = 'M70 186 L130 186 L128 266 L104 266 L100 214 L96 266 L72 266 Z';
const P_GOWN = 'M76 142 Q100 134 124 142 L130 175 Q166 240 160 282 Q100 294 40 282 Q34 240 70 175 Z';
const P_CORPETE = 'M76 142 Q100 134 124 142 L128 178 Q100 188 72 178 Z';

// Partes da roupa que ficam atrás do corpo (asas e capas)
function roupaAtras(R) {
  switch (R.t) {
    case 'fada': {
      const asa = (lado) => `<g><animateTransform attributeName="transform" type="rotate" values="0 100 150;${lado * 8} 100 150;0 100 150" dur=".9s" repeatCount="indefinite"/>` +
        `<ellipse cx="${100 + lado * 42}" cy="140" rx="36" ry="22" transform="rotate(${lado * -30} ${100 + lado * 42} 140)" fill="#d6f8ff" fill-opacity=".85" stroke="#7ad7f0" stroke-width="2"/>` +
        `<ellipse cx="${100 + lado * 34}" cy="178" rx="24" ry="15" transform="rotate(${lado * 25} ${100 + lado * 34} 178)" fill="#ffd6f5" fill-opacity=".85" stroke="#f7a1d9" stroke-width="2"/></g>`;
      return asa(-1) + asa(1);
    }
    case 'heroina': return `<path d="M74 142 Q100 136 126 142 L154 262 Q100 274 46 262 Z" fill="#e63946"/>`;
    case 'gelo': return `<path d="M72 142 L38 286 Q100 298 162 286 L128 142 Z" fill="#bde0fe" fill-opacity=".7"/>`;
    case 'heroi': return `<path d="M72 142 Q100 134 128 142 L160 270 Q130 262 100 276 Q70 262 40 270 Z" fill="${R.capa}"/>`;
    case 'astronauta': return `<rect x="62" y="138" width="76" height="70" rx="12" fill="#ced4da" stroke="#adb5bd" stroke-width="3"/>`;
    case 'dino': {
      let s = `<path d="M118 214 Q160 214 186 252 Q160 246 124 238 Z" fill="${R.c1}"/>`;
      [[60, 150], [54, 176], [52, 202], [140, 150], [146, 176], [148, 202]].forEach(([x, y]) =>
        s += `<path d="M${x} ${y - 12} L${x + (x < 100 ? -14 : 14)} ${y} L${x} ${y + 12} Z" fill="#ff9e00"/>`);
      return s;
    }
  }
  return '';
}

function roupaSVG(R) {
  const { c1, c2 } = R;
  const mangas = (c) => `<circle cx="77" cy="150" r="12" fill="${c}"/><circle cx="123" cy="150" r="12" fill="${c}"/>`;
  const camisa = `<path d="${P_CAMISA}" fill="${c1}" stroke="#e3e3e3" stroke-width="2"/>`;
  switch (R.t) {
    case 'vestido': {
      let s = `<path d="${P_VESTIDO}" fill="${c1}"/>` +
        `<path d="M67 180 Q100 188 133 180 L134 187 Q100 195 66 187 Z" fill="${c2}"/>` + mangas(c2);
      if (R.bolinhas) [[80, 205], [100, 215], [120, 205], [70, 222], [130, 222], [90, 160], [110, 165]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" opacity=".8"/>`);
      return s;
    }
    case 'saia': return camisa + `<path d="M70 186 L130 186 L146 228 Q100 236 54 228 Z" fill="${c2}"/>` + mangas(c1) +
      `<circle cx="100" cy="162" r="7" fill="#ff4d8d"/>`;
    case 'macacao': return camisa + mangas(c1) +
      `<path d="${P_CALCA}" fill="${c2}"/>` +
      `<path d="M84 158 L116 158 L118 190 L82 190 Z" fill="${c2}"/><path d="M84 160 L78 142 M116 160 L122 142" stroke="${c2}" stroke-width="6"/>` +
      `<circle cx="86" cy="164" r="3" fill="#ffd60a"/><circle cx="114" cy="164" r="3" fill="#ffd60a"/>`;
    case 'pijama': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
      [[86, 160], [112, 172], [92, 205], [110, 235], [84, 250], [116, 252]].map(([x, y]) => estrela(x, y, 5, c2)).join('') +
      `<circle cx="100" cy="186" r="0"/><path d="M92 150 Q100 156 108 150" stroke="#fff" stroke-width="3" fill="none"/>`;
    case 'maio': return `<path d="M78 144 Q100 138 122 144 L126 200 Q112 216 100 216 Q88 216 74 200 Z" fill="${c1}"/>` +
      [[88, 160], [110, 170], [92, 190], [112, 198], [100, 176]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c2}"/>`).join('');
    case 'caipira': {
      const id = 'xadrez' + (++_uid);
      return `<defs><pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/>` +
        `<rect width="6" height="12" fill="${c1}" opacity=".55"/><rect width="12" height="6" fill="${c1}" opacity=".55"/></pattern></defs>` +
        `<path d="${P_VESTIDO}" fill="url(#${id})"/>` +
        Array.from({ length: 13 }, (_, i) => `<circle cx="${52 + i * 8}" cy="${234 + Math.sin(i) * 1.5}" r="4.5" fill="#fff"/>`).join('') +
        `<rect x="78" y="200" width="12" height="11" fill="${c2}" transform="rotate(-8 84 205)"/><rect x="112" y="214" width="11" height="10" fill="#3a86ff" transform="rotate(10 117 219)"/>` +
        mangas(c1) + `<path d="M86 146 Q100 156 114 146" stroke="#fff" stroke-width="4" fill="none"/>`;
    }
    case 'tricolor': {
      const id = 'tri' + (++_uid);
      const cores = ['#0d80bf', '#111', '#0d80bf', '#fff'];
      let listras = '';
      for (let i = 0; i < 10; i++) listras += `<rect x="${66 + i * 7}" y="130" width="7" height="64" fill="${cores[i % 4]}"/>`;
      return `<clipPath id="${id}"><path d="${P_CAMISA}"/></clipPath><g clip-path="url(#${id})">${listras}</g>` +
        `<path d="M70 186 L130 186 L144 226 Q100 234 56 226 Z" fill="${c2}"/><path d="M100 188 L100 230" stroke="#355c9a" stroke-width="2"/>` +
        `<circle cx="77" cy="150" r="12" fill="#0d80bf"/><circle cx="123" cy="150" r="12" fill="#0d80bf"/>`;
    }
    case 'bailarina': return `<path d="M76 142 Q100 134 124 142 L128 188 Q100 196 72 188 Z" fill="${c1}"/>` +
      `<ellipse cx="100" cy="192" rx="56" ry="16" fill="${c2}"/><ellipse cx="100" cy="188" rx="48" ry="12" fill="#fff" opacity=".6"/>` +
      estrela(100, 160, 7, '#fff');
    case 'princesa': return `<path d="${P_GOWN}" fill="${c1}"/>` + `<path d="${P_CORPETE}" fill="${c2}"/>` + mangas(c2) +
      estrela(70, 240, 6, '#fff') + estrela(125, 255, 7, '#fff') + estrela(98, 220, 5, '#fff') + estrela(145, 228, 5, '#fff');
    case 'arcoiris': {
      const id = 'arco' + (++_uid);
      let faixas = '';
      ARCO_IRIS.concat(ARCO_IRIS[0]).forEach((c, i) => faixas += `<rect x="40" y="${134 + i * 16}" width="120" height="16" fill="${c}"/>`);
      return `<clipPath id="${id}"><path d="${P_VESTIDO}"/></clipPath><g clip-path="url(#${id})">${faixas}</g>` + mangas('#fff') +
        brilho(70, 220, 7, '#fff', 0) + brilho(128, 200, 6, '#fff', .5) + brilho(100, 165, 6, '#fff', 1);
    }
    case 'fada': return `<path d="${P_VESTIDO}" fill="${c1}"/>` + `<path d="M67 180 Q100 188 133 180 L134 187 Q100 195 66 187 Z" fill="${c2}"/>` + mangas(c2) +
      brilho(76, 214, 6, '#fff', 0) + brilho(122, 222, 7, '#fff', .6) + brilho(100, 160, 5, '#ffd60a', 1.1) + brilho(140, 120, 6, '#ffd60a', .3) + brilho(56, 128, 5, '#fff', .9);
    case 'heroina': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
      `<rect x="70" y="183" width="60" height="7" rx="3" fill="${c2}"/>` + estrela(100, 162, 11, c2) +
      `<rect x="83" y="246" width="15" height="26" rx="5" fill="#e63946"/><rect x="102" y="246" width="15" height="26" rx="5" fill="#e63946"/>` +
      brilho(100, 162, 5, '#fff', 0, 1.2);
    case 'sereia': {
      let s = `<path d="M70 186 Q100 180 130 186 Q130 240 112 264 L136 292 Q114 286 100 278 Q86 286 64 292 L88 264 Q70 240 70 186 Z" fill="${c1}"/>`;
      for (let y = 196; y < 262; y += 12) for (let x = 78 + ((y / 12) % 2) * 6; x < 124; x += 12) s += `<path d="M${x} ${y} q6 7 12 0" stroke="#1a9e92" stroke-width="2" fill="none"/>`;
      s += `<circle cx="89" cy="158" r="10" fill="${c2}"/><circle cx="111" cy="158" r="10" fill="${c2}"/><path d="M84 152 L89 166 M94 152 L89 166 M106 152 L111 166 M116 152 L111 166" stroke="#9d4edd" stroke-width="1.5"/>`;
      return s + brilho(84, 220, 6, '#fff', 0) + brilho(116, 240, 6, '#fff', .7) + brilho(100, 284, 5, '#fff', 1.2);
    }
    case 'gelo': return `<path d="${P_GOWN}" fill="${c1}"/>` + `<path d="${P_CORPETE}" fill="${c2}"/>` + mangas(c2) +
      estrela(70, 244, 6, '#fff') + estrela(132, 258, 7, '#fff') + estrela(100, 228, 5, '#fff') +
      brilho(60, 268, 7, '#fff', 0) + brilho(140, 236, 7, '#fff', .5) + brilho(100, 160, 6, '#fff', 1) + brilho(118, 276, 6, '#fff', 1.3);

    // ----- Roupas de menino -----
    case 'bermuda': return `<path d="${P_CAMISA}" fill="${c1}"/>` + mangas(c1) +
      `<path d="${P_BERMUDA}" fill="${c2}"/>` + `<path d="M90 160 Q100 168 110 160" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;
    case 'calca': return `<path d="${P_CAMISA}" fill="${c1}"/>` + mangas(c1) + `<path d="${P_CALCA}" fill="${c2}"/>` +
      estrela(100, 164, 8, '#fff');
    case 'futebol': return `<path d="${P_CAMISA}" fill="${c1}"/>` + mangas(c1) +
      `<path d="M88 142 L100 154 L112 142" stroke="${c2}" stroke-width="5" fill="none"/>` +
      `<circle cx="77" cy="150" r="12" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="10 40"/><circle cx="123" cy="150" r="12" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="10 40"/>` +
      `<text x="100" y="181" font-size="24" font-weight="900" text-anchor="middle" fill="${c2}" font-family="Arial, sans-serif">${R.num}</text>` +
      `<path d="${P_BERMUDA}" fill="${R.c3}"/>` +
      `<rect x="84" y="242" width="14" height="28" rx="4" fill="${R.meia}"/><rect x="102" y="242" width="14" height="28" rx="4" fill="${R.meia}"/>`;
    case 'bombeiro': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
      `<rect x="71" y="168" width="58" height="6" fill="${c2}"/><rect x="72" y="240" width="25" height="6" fill="${c2}"/><rect x="103" y="240" width="25" height="6" fill="${c2}"/>` +
      `<path d="M100 140 L100 190" stroke="#9d0208" stroke-width="3"/>` + [152, 180].map(y => `<circle cx="106" cy="${y}" r="3" fill="${c2}"/>`).join('');
    case 'pirata': {
      const id = 'pir' + (++_uid);
      let listras = '';
      for (let i = 0; i < 7; i++) listras += `<rect x="60" y="${136 + i * 8}" width="80" height="4" fill="#1d3557"/>`;
      return `<path d="${P_CAMISA}" fill="${c1}"/><clipPath id="${id}"><path d="${P_CAMISA}"/></clipPath><g clip-path="url(#${id})">${listras}</g>` +
        mangas(c1) + `<path d="${P_CALCA}" fill="#222"/>` + `<path d="M70 180 L130 180 L130 192 L70 192 Z" fill="${c2}"/><path d="M118 190 L128 210 L114 206 Z" fill="${c2}"/>`;
    }
    case 'heroi': {
      const emb = R.emb === 'raio' ? `<path d="${raioD(100, 164, .9)}" fill="#ffd60a"/>`
        : R.emb === 'fogo' ? `<path d="${chamaD(100, 164, 1)}" fill="#ffd60a"/>` : estrela(100, 164, 11, '#ffd60a');
      return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
        `<circle cx="100" cy="164" r="15" fill="${c2}"/>` + emb +
        `<rect x="70" y="183" width="60" height="7" rx="3" fill="${c2}"/>` +
        `<rect x="83" y="246" width="15" height="26" rx="5" fill="${R.sapato}"/><rect x="102" y="246" width="15" height="26" rx="5" fill="${R.sapato}"/>` +
        (R.raro ? brilho(100, 164, 6, '#fff', 0, 1.2) + brilho(68, 230, 6, '#ffd60a', .5) + brilho(136, 200, 6, '#ffd60a', 1) : '');
    }
    case 'astronauta': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
      `<rect x="84" y="156" width="32" height="20" rx="4" fill="#dee2e6" stroke="#adb5bd" stroke-width="2"/>` +
      `<circle cx="92" cy="166" r="3.5" fill="#e63946"><animate attributeName="fill" values="#e63946;#ffd60a;#e63946" dur="1s" repeatCount="indefinite"/></circle>` +
      `<circle cx="102" cy="166" r="3.5" fill="#06d6a0"/><rect x="108" y="162" width="5" height="8" fill="${c2}"/>` +
      `<circle cx="120" cy="150" r="6" fill="${c2}"/>` + `<rect x="70" y="183" width="60" height="7" rx="3" fill="#adb5bd"/>` +
      brilho(66, 214, 6, '#fff', 0) + brilho(132, 240, 6, '#fff', .7) + brilho(100, 150, 5, '#4cc9f0', 1.2);
    case 'dino': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="${c1}"/>` + mangas(c1) +
      `<path d="M86 146 Q100 142 114 146 L116 230 Q100 238 84 230 Z" fill="${c2}"/>` +
      [160, 178, 196, 214].map(y => `<path d="M88 ${y} Q100 ${y + 4} 112 ${y}" stroke="#9ef01a" stroke-width="2" fill="none"/>`).join('') +
      brilho(70, 200, 6, '#fff', 0) + brilho(130, 236, 6, '#fff', .8);
    case 'cavaleiro': return `<path d="${P_CAMISA}" fill="${c1}"/><path d="${P_CALCA}" fill="#868e96"/>` + mangas(c1) +
      `<path d="M78 146 Q100 140 122 146 L120 186 Q100 194 80 186 Z" fill="#ced4da" stroke="${c2}" stroke-width="3"/>` +
      `<path d="M100 150 L100 182 M88 164 L112 164" stroke="#e63946" stroke-width="5"/>` +
      `<path d="M40 176 L66 176 L66 204 Q53 220 40 204 Z" fill="#e63946" stroke="${c2}" stroke-width="3"/>` + estrela(53, 192, 7, c2) +
      brilho(116, 152, 6, '#fff', 0) + brilho(60, 180, 5, '#fff', .6) + brilho(100, 240, 5, '#fff', 1.1);
    case 'robo': return `<rect x="70" y="140" width="60" height="52" rx="6" fill="${c1}" stroke="#48cae4" stroke-width="3"/>` +
      `<rect x="72" y="190" width="24" height="56" rx="4" fill="${c1}"/><rect x="104" y="190" width="24" height="56" rx="4" fill="${c1}"/>` +
      `<rect x="64" y="140" width="16" height="22" rx="5" fill="#48cae4"/><rect x="120" y="140" width="16" height="22" rx="5" fill="#48cae4"/>` +
      `<rect x="82" y="152" width="36" height="26" rx="4" fill="#023e8a"/>` +
      [[90, 160, '#f72585', 0], [100, 160, '#ffd60a', .3], [110, 160, '#06d6a0', .6]].map(([x, y, c, a]) =>
        `<circle cx="${x}" cy="${y}" r="3.5" fill="${c}"><animate attributeName="opacity" values="1;.2;1" dur="1s" begin="${a}s" repeatCount="indefinite"/></circle>`).join('') +
      `<rect x="86" y="168" width="28" height="4" rx="2" fill="${c2}"/>` +
      brilho(76, 200, 6, '#fff', 0) + brilho(124, 230, 6, '#fff', .7);
  }
  return '';
}

function acessorioSVG(a) {
  switch (a) {
    case 'laco': return `<g transform="translate(140 40) rotate(15)"><path d="M0 0 L-22 -13 L-20 14 Z" fill="#ff4d8d"/><path d="M0 0 L22 -13 L20 14 Z" fill="#ff4d8d"/><circle r="7" fill="#ff1f70"/></g>`;
    case 'coroa': return `<path d="M68 40 L74 12 L87 30 L100 4 L113 30 L126 12 L132 40 Z" fill="#ffd60a" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="100" cy="28" r="4.5" fill="#ff4d8d"/><circle cx="81" cy="33" r="3.5" fill="#4cc9f0"/><circle cx="119" cy="33" r="3.5" fill="#4cc9f0"/>`;
    case 'oculos': return `<g fill="#222" fill-opacity=".85" stroke="#ff4d8d" stroke-width="3"><rect x="65" y="82" width="31" height="21" rx="9"/><rect x="104" y="82" width="31" height="21" rx="9"/></g>` +
      `<path d="M96 90 Q100 86 104 90" stroke="#ff4d8d" stroke-width="3" fill="none"/>`;
    case 'flor': return [[58, 34], [68, 42], [64, 54], [52, 54], [48, 42]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#ff8fc8"/>`).join('') +
      `<circle cx="58" cy="45" r="6" fill="#ffd60a"/>`;
    case 'chapeu': return `<ellipse cx="100" cy="40" rx="76" ry="15" fill="#f4d58d" stroke="#d4a84b" stroke-width="2"/>` +
      `<path d="M60 40 Q62 -2 100 -2 Q138 -2 140 40 Z" fill="#f4d58d" stroke="#d4a84b" stroke-width="2"/>` +
      `<path d="M61 30 Q100 37 139 30 L140 40 Q100 47 60 40 Z" fill="#ff4d8d"/>` + `<circle cx="132" cy="34" r="7" fill="#fff"/>`;
    case 'gatinho': return `<path d="M56 56 L60 16 L88 38 Z" fill="#333"/><path d="M63 46 L65 27 L80 39 Z" fill="#ff8fc8"/>` +
      `<path d="M144 56 L140 16 L112 38 Z" fill="#333"/><path d="M137 46 L135 27 L120 39 Z" fill="#ff8fc8"/>`;
    case 'coelho': return `<path d="M60 52 Q100 26 140 52" stroke="#ff8fc8" stroke-width="6" fill="none"/>` +
      `<ellipse cx="78" cy="8" rx="11" ry="32" fill="#fff" stroke="#e8e8e8" stroke-width="2" transform="rotate(-12 78 8)"/><ellipse cx="78" cy="10" rx="5" ry="22" fill="#ffc2d1" transform="rotate(-12 78 10)"/>` +
      `<ellipse cx="122" cy="8" rx="11" ry="32" fill="#fff" stroke="#e8e8e8" stroke-width="2" transform="rotate(12 122 8)"/><ellipse cx="122" cy="10" rx="5" ry="22" fill="#ffc2d1" transform="rotate(12 122 10)"/>`;
    case 'estrela': return estrela(140, 46, 14, '#ffd60a') + estrela(126, 36, 6, '#ff8fc8');
    case 'bone': return `<path d="M52 54 Q54 12 100 12 Q146 12 148 54 Z" fill="#e63946"/><path d="M142 50 Q182 46 190 60 Q162 62 142 58 Z" fill="#b5172b"/>` +
      `<circle cx="100" cy="14" r="4" fill="#fff"/><path d="M100 14 L100 54" stroke="#b5172b" stroke-width="2"/>`;
    case 'fones': return `<path d="M50 92 Q46 16 100 16 Q154 16 150 92" stroke="#ff4d8d" stroke-width="7" fill="none"/>` +
      `<rect x="38" y="78" width="16" height="28" rx="7" fill="#ff8fc8"/><rect x="146" y="78" width="16" height="28" rx="7" fill="#ff8fc8"/>`;
    case 'coroa_flores': return [[60, 54], [72, 42], [86, 35], [100, 33], [114, 35], [128, 42], [140, 54]].map(([x, y], i) =>
      `<circle cx="${x}" cy="${y}" r="7" fill="${['#ff8fc8', '#ffd60a', '#b388ff', '#ff595e'][i % 4]}"/><circle cx="${x}" cy="${y}" r="2.8" fill="#fff"/>`).join('');
    case 'tiara': return `<path d="M62 50 Q100 22 138 50" stroke="#dfe7ef" stroke-width="5" fill="none"/>` +
      `<path d="M100 10 L110 24 L100 36 L90 24 Z" fill="#a8e6ff" stroke="#fff" stroke-width="2"/>` +
      `<path d="M80 22 L86 30 L80 38 L74 30 Z" fill="#ffc2e2" stroke="#fff" stroke-width="1.5"/><path d="M120 22 L126 30 L120 38 L114 30 Z" fill="#ffc2e2" stroke="#fff" stroke-width="1.5"/>` +
      brilho(100, 12, 7, '#fff', 0, 1.2) + brilho(80, 22, 5, '#fff', .4, 1.4) + brilho(122, 24, 5, '#fff', .8, 1.4);
    case 'unicornio': return `<path d="M90 36 L100 -8 L110 36 Z" fill="#ffe08a" stroke="#f4a261" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M92 28 L108 22 M94 18 L106 12 M96 8 L104 4" stroke="#f4a261" stroke-width="2"/>` +
      [[80, 40, '#ff8fc8'], [120, 40, '#b388ff'], [88, 34, '#8ac926']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`).join('') +
      brilho(100, -8, 7, '#fff', 0, 1.1) + brilho(116, 8, 5, '#ffd60a', .5) + brilho(84, 12, 5, '#ff8fc8', 1);
    // ----- Acessórios de menino -----
    case 'bandana': return `<path d="M50 62 Q100 44 150 62 L150 74 Q100 56 50 74 Z" fill="#111"/><path d="M150 66 L172 58 L168 76 Z M150 70 L170 84 L160 90 Z" fill="#111"/>`;
    case 'mascara': return `<path d="M58 84 Q70 74 92 82 Q100 86 108 82 Q130 74 142 84 Q146 100 130 102 Q116 104 108 96 Q100 92 92 96 Q84 104 70 102 Q54 100 58 84 Z" fill="#1d4ed8"/>` +
      `<ellipse cx="82" cy="91" rx="9" ry="7" fill="#fff"/><ellipse cx="118" cy="91" rx="9" ry="7" fill="#fff"/>` +
      `<ellipse cx="82" cy="92" rx="5" ry="6" fill="#2b1d14"/><ellipse cx="118" cy="92" rx="5" ry="6" fill="#2b1d14"/>`;
    case 'capacete': return `<path d="M46 60 Q46 8 100 8 Q154 8 154 60 Z" fill="#d62828"/><path d="M38 58 L162 58 L166 68 L34 68 Z" fill="#9d0208"/>` +
      `<path d="M88 14 L112 14 L108 44 L92 44 Z" fill="#ffd60a"/><circle cx="100" cy="28" r="6" fill="#d62828"/>`;
    case 'chapeu_pirata': return `<path d="M30 54 Q100 -10 170 54 Q100 34 30 54 Z" fill="#222"/><path d="M40 52 Q100 38 160 52" stroke="#ffd60a" stroke-width="3" fill="none"/>` +
      `<circle cx="100" cy="28" r="8" fill="#fff"/><circle cx="97" cy="27" r="1.8" fill="#222"/><circle cx="103" cy="27" r="1.8" fill="#222"/><path d="M93 38 L107 44 M107 38 L93 44" stroke="#fff" stroke-width="2.5"/>`;
    case 'antenas': return `<path d="M76 44 L64 4 M124 44 L136 4" stroke="#adb5bd" stroke-width="4"/><rect x="64" y="38" width="72" height="12" rx="6" fill="#48cae4"/>` +
      `<circle cx="64" cy="4" r="7" fill="#f72585"><animate attributeName="fill" values="#f72585;#ffd60a;#06d6a0;#f72585" dur="1.2s" repeatCount="indefinite"/></circle>` +
      `<circle cx="136" cy="4" r="7" fill="#06d6a0"><animate attributeName="fill" values="#06d6a0;#f72585;#ffd60a;#06d6a0" dur="1.2s" repeatCount="indefinite"/></circle>` +
      brilho(64, 4, 6, '#fff', 0, 1.2) + brilho(136, 4, 6, '#fff', .6, 1.2);
    case 'capacete_astro': return `<circle cx="100" cy="82" r="68" fill="#bde0fe" fill-opacity=".28" stroke="#f1f3f5" stroke-width="7"/>` +
      `<path d="M58 40 Q76 22 100 20" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>` +
      `<rect x="56" y="138" width="88" height="12" rx="6" fill="#ced4da"/>` + brilho(148, 40, 7, '#fff', 0, 1.3) + brilho(54, 120, 5, '#fff', .7, 1.3);
  }
  return '';
}

function pinturaSVG(p) {
  const x = 134, y = 110;
  switch (p) {
    case 'coracao': return `<path d="M${x} ${y + 6} C${x - 10} ${y - 2} ${x - 6} ${y - 10} ${x} ${y - 4} C${x + 6} ${y - 10} ${x + 10} ${y - 2} ${x} ${y + 6} Z" fill="#ff4d8d"/>`;
    case 'estrela': return `<path d="M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y - 2} L${x + 4} ${y + 2} L${x + 6} ${y + 8} L${x} ${y + 5} L${x - 6} ${y + 8} L${x - 4} ${y + 2} L${x - 9} ${y - 2} L${x - 3} ${y - 3} Z" fill="#ffd60a" stroke="#f4a261" stroke-width="1"/>`;
    case 'arcoiris': return ARCO_IRIS.slice(0, 4).map((c, i) => `<path d="M${x - 11 + i * 2.5} ${y + 4} A${11 - i * 2.5} ${11 - i * 2.5} 0 0 1 ${x + 11 - i * 2.5} ${y + 4}" stroke="${c}" stroke-width="2.5" fill="none"/>`).join('');
    case 'borboleta': return `<g>` +
      `<ellipse cx="${x - 6}" cy="${y - 3}" rx="6" ry="7" fill="#b388ff"><animate attributeName="rx" values="6;2;6" dur=".7s" repeatCount="indefinite"/></ellipse>` +
      `<ellipse cx="${x + 6}" cy="${y - 3}" rx="6" ry="7" fill="#ff8fc8"><animate attributeName="rx" values="6;2;6" dur=".7s" repeatCount="indefinite"/></ellipse>` +
      `<ellipse cx="${x - 5}" cy="${y + 6}" rx="4" ry="4" fill="#4cc9f0"/><ellipse cx="${x + 5}" cy="${y + 6}" rx="4" ry="4" fill="#ffd60a"/>` +
      `<rect x="${x - 1.2}" y="${y - 8}" width="2.4" height="17" rx="1.2" fill="#3d2c5e"/></g>` + brilho(x + 12, y - 10, 4, '#ffd60a', 0, 1.2);
    case 'raio': return `<path d="${raioD(x, y, .75)}" fill="#ffd60a" stroke="#f4a261" stroke-width="1"/>`;
    case 'listras': return [-6, 0, 6].map(d => `<path d="M${x - 9} ${y + d} L${x + 9} ${y + d - 3}" stroke="#1d3557" stroke-width="3" stroke-linecap="round"/>`).join('') +
      [-6, 0, 6].map(d => `<path d="M${200 - x - 9} ${y + d - 3} L${200 - x + 9} ${y + d}" stroke="#1d3557" stroke-width="3" stroke-linecap="round"/>`).join('');
    case 'bola': return `<circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="#222" stroke-width="1.5"/><path d="M${x} ${y - 4} L${x + 4} ${y - 1} L${x + 2.5} ${y + 4} L${x - 2.5} ${y + 4} L${x - 4} ${y - 1} Z" fill="#222"/>`;
    case 'brasil': return `<rect x="${x - 11}" y="${y - 8}" width="22" height="16" rx="2" fill="#009c3b"/><path d="M${x} ${y - 6} L${x + 9} ${y} L${x} ${y + 6} L${x - 9} ${y} Z" fill="#ffdf00"/><circle cx="${x}" cy="${y}" r="3.6" fill="#1e40af"/>`;
    case 'fogo': return `<path d="${chamaD(x, y, .9)}" fill="#ff7b00"><animateTransform attributeName="transform" type="scale" values="1 1;1 1.12;1 1" dur=".6s" additive="sum" repeatCount="indefinite"/></path>` +
      `<path d="${chamaD(x, y + 3, .5)}" fill="#ffd60a"/>` + brilho(x + 10, y - 10, 4, '#ffd60a', 0, 1);
  }
  return '';
}

function itemRaro(tipo, val) {
  const it = ITENS.find(i => i.tipo === tipo && i.val === val);
  return !!(it && it.raro);
}
function usaRaro(look) { return Object.entries(look).some(([t, v]) => itemRaro(t, v)); }

// Desenha a Lia. opcoes.rosto = true mostra só o rosto (miniaturas e maquiagem)
function criancaSVG(look, opcoes = {}) {
  const L = Object.assign({}, LOOK_PADRAO, look);
  const pele = PELES[L.pele] || PELES.clara;
  const R = ROUPAS[L.roupa] || ROUPAS.vestido_rosa;
  const vb = opcoes.rosto ? '22 -26 156 166' : '0 -26 200 320';
  let defs = '';
  let cab = CORES_CABELO[L.corCabelo] || CORES_CABELO.castanho;
  let sobrancelha = cab;
  if (L.corCabelo === 'arcoiris') {
    const id = 'cab' + (++_uid);
    defs += `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="215">` +
      ARCO_IRIS.map((c, i) => `<stop offset="${i / (ARCO_IRIS.length - 1)}" stop-color="${c}"/>`).join('') + `</linearGradient>`;
    cab = `url(#${id})`; sobrancelha = '#6a4c93';
  }
  let sombra = SOMBRAS[L.sombra];
  if (L.sombra === 'arcoiris') {
    const id = 'som' + (++_uid);
    defs += `<linearGradient id="${id}">` + ARCO_IRIS.map((c, i) => `<stop offset="${i / (ARCO_IRIS.length - 1)}" stop-color="${c}"/>`).join('') + `</linearGradient>`;
    sombra = `url(#${id})`;
  }

  let s = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="crianca-svg">` + (defs ? `<defs>${defs}</defs>` : '');
  s += roupaAtras(R);
  s += cabeloTras(L.penteado, cab);
  if (R.t !== 'sereia') {
    const perna = R.t === 'bailarina' ? '#ffd6e0' : pele;
    const sapato = R.sapato || '#ff4d8d';
    s += `<rect x="85" y="222" width="12" height="50" rx="6" fill="${perna}"/><rect x="103" y="222" width="12" height="50" rx="6" fill="${perna}"/>`;
    s += `<ellipse cx="89" cy="274" rx="11" ry="6" fill="${sapato}"/><ellipse cx="111" cy="274" rx="11" ry="6" fill="${sapato}"/>`;
  }
  s += `<path d="M77 150 Q62 176 58 202" stroke="${pele}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
       `<path d="M123 150 Q138 176 142 202" stroke="${pele}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
       `<circle cx="58" cy="204" r="7.5" fill="${pele}"/><circle cx="142" cy="204" r="7.5" fill="${pele}"/>`;
  s += roupaSVG(R);
  s += `<rect x="92" y="126" width="16" height="18" rx="6" fill="${pele}"/>`;
  s += `<circle cx="50" cy="90" r="8" fill="${pele}"/><circle cx="150" cy="90" r="8" fill="${pele}"/><circle cx="100" cy="85" r="50" fill="${pele}"/>`;
  if (sombra) s += `<ellipse cx="82" cy="86" rx="11" ry="6.5" fill="${sombra}" opacity=".8"/><ellipse cx="118" cy="86" rx="11" ry="6.5" fill="${sombra}" opacity=".8"/>`;
  s += `<ellipse cx="82" cy="93" rx="6.5" ry="8.5" fill="#2b1d14"/><ellipse cx="118" cy="93" rx="6.5" ry="8.5" fill="#2b1d14"/>` +
       `<circle cx="84.5" cy="89.5" r="2.4" fill="#fff"/><circle cx="120.5" cy="89.5" r="2.4" fill="#fff"/>` +
       (L.sexo === 'm' ? '' : `<path d="M75 87 l-5 -3 M78 85 l-2 -5 M125 87 l5 -3 M122 85 l2 -5" stroke="#2b1d14" stroke-width="2" stroke-linecap="round"/>`);
  s += `<path d="M73 75 Q82 70 90 74 M110 74 Q118 70 127 75" stroke="${sobrancelha}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="68" cy="108" rx="9" ry="5.5" fill="#ff7f9f" opacity="${L.blush ? .7 : .25}"/><ellipse cx="132" cy="108" rx="9" ry="5.5" fill="#ff7f9f" opacity="${L.blush ? .7 : .25}"/>`;
  s += `<path d="M97 101 Q100 104 103 101" stroke="#d99a7a" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  s += BATONS[L.batom]
    ? `<path d="M88 112 Q100 128 112 112 Q100 117 88 112 Z" fill="${BATONS[L.batom]}"/>`
    : `<path d="M89 113 Q100 124 111 113" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if (L.batom === 'dourado') s += brilho(110, 113, 4, '#fff', 0, 1.2) + brilho(92, 118, 3, '#fff', .6, 1.2);
  s += pinturaSVG(L.pintura);
  if (L.glitter) {
    const cores = L.glitter === 'rosa' ? ['#ff4d8d', '#ffc2e2'] : L.glitter === 'arcoiris' ? ARCO_IRIS : ['#ffd60a', '#fff'];
    [[62, 96, 5], [142, 98, 6], [70, 121, 3.5], [130, 122, 3.5], [100, 66, 4], [56, 112, 3]].forEach(([x, y, r], i) => {
      const c = cores[i % cores.length];
      s += L.glitter === 'arcoiris' ? brilho(x, y, r + 1, c, i * .25, 1.3) : estrela(x, y, r, c);
    });
  }
  s += franja(L.penteado, cab);
  if (L.corCabelo === 'dourado') s += brilho(70, 46, 6, '#fff', 0) + brilho(128, 40, 5, '#fff', .7) + brilho(48, 150, 5, '#fff', 1.2);
  if (L.corCabelo === 'arcoiris') s += brilho(64, 50, 6, '#fff', .3) + brilho(150, 140, 5, '#fff', 1);
  s += acessorioSVG(L.acessorio);
  return s + '</svg>';
}

// Desenha o Batata (cachorro branco e preto). humor: feliz | normal | triste
function batataSVG(humor = 'feliz', acc = '') {
  let s = `<svg viewBox="0 0 220 175" xmlns="http://www.w3.org/2000/svg" class="batata-svg">`;
  s += `<g class="rabo"><path d="M172 98 Q206 74 198 48" stroke="#333" stroke-width="13" fill="none" stroke-linecap="round"/>` +
       `<path d="M172 98 Q206 74 198 48" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="198" cy="48" r="6" fill="#222"/></g>`;
  [[88, 128], [112, 132], [148, 132], [170, 126]].forEach(([x, y]) => s += `<rect x="${x}" y="${y}" width="17" height="32" rx="8" fill="#fff" stroke="#333" stroke-width="3"/>`);
  s += `<ellipse cx="132" cy="112" rx="56" ry="35" fill="#fff" stroke="#333" stroke-width="3"/>`;
  s += `<ellipse cx="152" cy="100" rx="21" ry="15" fill="#222"/><ellipse cx="116" cy="126" rx="9" ry="6" fill="#222"/>`;
  if (acc === 'capa') s += `<path d="M96 96 Q132 70 180 92 L176 128 Q134 116 100 122 Z" fill="#e63946" stroke="#b5172b" stroke-width="2"/>` +
    estrela(140, 104, 9, '#ffd60a') + brilho(160, 96, 6, '#fff', 0) + brilho(118, 110, 5, '#fff', .7);
  s += `<path d="M84 104 Q100 118 116 98" stroke="#e63946" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="102" cy="116" r="6" fill="#ffd60a"/>`;
  if (acc === 'gravata') s += `<path d="M102 112 L86 102 L88 124 Z" fill="#3a0ca3"/><path d="M102 112 L118 102 L116 124 Z" fill="#3a0ca3"/><circle cx="102" cy="112" r="5" fill="#7209b7"/>`;
  s += `<circle cx="72" cy="72" r="40" fill="#fff" stroke="#333" stroke-width="3"/>`;
  s += `<ellipse cx="38" cy="72" rx="13" ry="27" fill="#222" transform="rotate(${humor === 'triste' ? 8 : 22} 38 72)"/>`;
  s += `<ellipse cx="106" cy="62" rx="13" ry="27" fill="#222" transform="rotate(${humor === 'triste' ? -8 : -22} 106 62)"/>`;
  s += `<ellipse cx="86" cy="66" rx="15" ry="14" fill="#222"/>`;
  if (humor === 'feliz') {
    s += `<path d="M53 70 Q59 62 65 70" stroke="#222" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M80 66 Q86 58 92 66" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  } else {
    s += `<circle cx="59" cy="69" r="5.5" fill="#222"/><circle cx="61" cy="67" r="1.8" fill="#fff"/><circle cx="86" cy="66" r="6.5" fill="#fff"/><circle cx="86" cy="66" r="4.5" fill="#222"/><circle cx="88" cy="64" r="1.6" fill="#fff"/>`;
  }
  if (humor === 'triste') s += `<path d="M50 58 L64 62 M95 54 L82 59" stroke="#222" stroke-width="3" stroke-linecap="round"/><path d="M56 78 q-3 7 0 9 q3 -2 0 -9" fill="#6ec6ff"/>`;
  s += `<ellipse cx="66" cy="94" rx="21" ry="14" fill="#fff" stroke="#ddd" stroke-width="2"/><ellipse cx="64" cy="86" rx="8" ry="5.5" fill="#222"/>`;
  if (humor === 'triste') s += `<path d="M56 102 Q66 95 76 102" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M55 95 Q65 106 76 95" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>` +
    (humor === 'feliz' ? `<path d="M62 101 Q65 116 71 101 Z" fill="#ff7b9c"/>` : '');
  if (humor === 'feliz') s += `<ellipse cx="48" cy="90" rx="6" ry="4" fill="#ff9fb4" opacity=".7"/>`;
  if (acc === 'oculos') s += `<g fill="#222" fill-opacity=".85" stroke="#ff4d8d" stroke-width="2.5"><circle cx="59" cy="69" r="11"/><circle cx="87" cy="66" r="12"/></g><path d="M70 68 L75 67" stroke="#ff4d8d" stroke-width="2.5"/>`;
  if (acc === 'laco') s += `<g transform="translate(72 34) rotate(-10)"><path d="M0 0 L-18 -11 L-16 12 Z" fill="#ff4d8d"/><path d="M0 0 L18 -11 L16 12 Z" fill="#ff4d8d"/><circle r="6" fill="#ff1f70"/></g>`;
  if (acc === 'chapeu') s += `<path d="M54 38 L74 -4 L92 36 Z" fill="#7b2cbf"/><path d="M62 24 L84 22 M58 32 L88 31" stroke="#ffd60a" stroke-width="4"/><circle cx="74" cy="-4" r="6" fill="#ffd60a"/>`;
  if (acc === 'coroa') s += `<path d="M52 38 L56 14 L66 28 L74 8 L82 28 L92 14 L96 38 Z" fill="#ffd60a" stroke="#e0a800" stroke-width="2" stroke-linejoin="round"/>` +
    `<circle cx="74" cy="28" r="3.5" fill="#ff4d8d"/>` + brilho(74, 6, 6, '#fff', 0, 1.2) + brilho(94, 16, 4, '#fff', .6, 1.2);
  return s + '</svg>';
}

// ===== Prédios do mapa =====
function casaBase(parede, telhado, porta, extra = '') {
  return `<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">` +
    `<ellipse cx="80" cy="134" rx="70" ry="6" fill="#000" opacity=".12"/>` +
    `<rect x="28" y="60" width="104" height="72" rx="4" fill="${parede}"/>` +
    `<polygon points="14,66 80,14 146,66" fill="${telhado}" stroke="${telhado}" stroke-width="6" stroke-linejoin="round"/>` +
    `<rect x="68" y="92" width="24" height="40" rx="11" fill="${porta}"/><circle cx="87" cy="114" r="2.5" fill="#ffd60a"/>` +
    `<rect x="38" y="76" width="22" height="20" rx="3" fill="#bde0fe" stroke="#fff" stroke-width="3"/>` +
    `<rect x="100" y="76" width="22" height="20" rx="3" fill="#bde0fe" stroke="#fff" stroke-width="3"/>` + extra + `</svg>`;
}

function predioSVG(id) {
  switch (id) {
    case 'casa': return casaBase('#8ecae6', '#e63946', '#8d5a3b',
      `<path d="M80 40 c-6 -8 -18 -2 -10 8 l10 9 l10 -9 c8 -10 -4 -16 -10 -8z" fill="#ff8fc8"/>`);
    case 'vovo': return casaBase('#ffe5b4', '#a0522d', '#6b4226',
      `<rect x="110" y="18" width="14" height="30" fill="#8d5a3b"/><circle cx="117" cy="10" r="6" fill="#fff" opacity=".8"/><circle cx="126" cy="2" r="5" fill="#fff" opacity=".6"/>` +
      `<rect x="36" y="96" width="26" height="7" rx="3" fill="#7cb518"/><circle cx="42" cy="95" r="3.5" fill="#ff4d8d"/><circle cx="50" cy="94" r="3.5" fill="#ffd60a"/><circle cx="57" cy="95" r="3.5" fill="#ff4d8d"/>`);
    case 'prima': return casaBase('#e0c3fc', '#ff70a6', '#9d4edd', estrela(80, 44, 9, '#ffd60a'));
    case 'primo': return casaBase('#bde0fe', '#1d4ed8', '#e85d04', `<path d="${raioD(80, 44, .9)}" fill="#ffd60a"/>`);
    case 'escola': return `<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">` +
      `<ellipse cx="80" cy="134" rx="76" ry="6" fill="#000" opacity=".12"/>` +
      `<rect x="6" y="58" width="148" height="74" rx="4" fill="#ffd166"/><rect x="58" y="26" width="44" height="40" fill="#ffb703"/>` +
      `<polygon points="52,30 80,4 108,30" fill="#3a86ff"/><circle cx="80" cy="44" r="10" fill="#fff" stroke="#333" stroke-width="2"/>` +
      `<path d="M80 44 L80 37 M80 44 L85 46" stroke="#333" stroke-width="2"/>` +
      `<rect x="80" y="-14" width="2" height="20" fill="#555"/><path d="M82 -14 L98 -9 L82 -4 Z" fill="#06d6a0"/>` +
      `<rect x="68" y="96" width="24" height="36" fill="#3a86ff"/>` +
      [16, 40, 104, 128].map(x => `<rect x="${x}" y="74" width="18" height="18" rx="2" fill="#bde0fe" stroke="#fff" stroke-width="3"/>`).join('') +
      `<path d="M6 58 L154 58" stroke="#ff9f1c" stroke-width="6"/></svg>`;
    case 'mercado': return `<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">` +
      `<ellipse cx="80" cy="134" rx="74" ry="6" fill="#000" opacity=".12"/>` +
      `<rect x="12" y="40" width="136" height="92" rx="4" fill="#f1faee"/><rect x="12" y="22" width="136" height="22" rx="4" fill="#2a9d8f"/>` +
      `<text x="80" y="39" font-size="15" font-weight="900" text-anchor="middle" fill="#fff" font-family="sans-serif">MERCADO</text>` +
      [0, 1, 2, 3, 4, 5, 6, 7].map(i => `<path d="M${12 + i * 17} 44 h17 v12 q-8.5 8 -17 0z" fill="${i % 2 ? '#fff' : '#e63946'}"/>`).join('') +
      `<rect x="22" y="70" width="44" height="34" rx="3" fill="#bde0fe" stroke="#fff" stroke-width="3"/><rect x="96" y="76" width="40" height="56" fill="#90e0ef" stroke="#fff" stroke-width="3"/>` +
      `<text x="30" y="98" font-size="16">🍎</text><text x="46" y="98" font-size="16">🍌</text></svg>`;
    case 'shopping': return `<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">` +
      `<ellipse cx="80" cy="134" rx="74" ry="6" fill="#000" opacity=".12"/>` +
      `<rect x="20" y="20" width="120" height="112" rx="8" fill="#cdb4db"/><rect x="20" y="20" width="120" height="22" rx="8" fill="#9d4edd"/>` +
      `<text x="80" y="37" font-size="14" font-weight="900" text-anchor="middle" fill="#fff" font-family="sans-serif">SHOPPING</text>` +
      [0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${30 + c * 26}" y="${50 + r * 22}" width="20" height="16" rx="2" fill="#a2d2ff" stroke="#fff" stroke-width="2"/>`).join('')).join('') +
      `<rect x="60" y="112" width="40" height="20" fill="#7bdff2"/>` +
      `<circle cx="14" cy="30" r="9" fill="#ff4d8d"/><path d="M14 39 L16 70" stroke="#999"/><circle cx="148" cy="24" r="9" fill="#ffd60a"/><path d="M148 33 L146 64" stroke="#999"/></svg>`;
    case 'ilha': return `<svg viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">` +
      `<ellipse cx="80" cy="112" rx="72" ry="22" fill="#ffe8a3"/><ellipse cx="80" cy="108" rx="58" ry="14" fill="#f9d77e"/>` +
      `<path d="M84 108 Q80 70 92 40" stroke="#8d5a3b" stroke-width="9" fill="none" stroke-linecap="round"/>` +
      `<path d="M92 40 Q70 28 50 44 M92 40 Q110 24 132 38 M92 40 Q84 18 66 16 M92 40 Q112 46 122 64 M92 40 Q70 46 62 64" stroke="#2a9d8f" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<circle cx="88" cy="46" r="5" fill="#8d5a3b"/><circle cx="96" cy="47" r="5" fill="#8d5a3b"/>` +
      `<text x="30" y="118" font-size="16">🐚</text><text x="112" y="120" font-size="14">⭐</text></svg>`;
  }
  return '';
}

// ===== Carros da cidade (de lado, virados para a direita) =====
function roda(x, y, r = 10) {
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#333"/><circle cx="${x}" cy="${y}" r="${r * .5}" fill="#ccc"/>` +
    `<path d="M${x - r * .5} ${y} L${x + r * .5} ${y} M${x} ${y - r * .5} L${x} ${y + r * .5}" stroke="#777" stroke-width="2">` +
    `<animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur=".5s" repeatCount="indefinite"/></path></g>`;
}
function carroSVG(cor, tipo = 'carro') {
  if (tipo === 'onibus') return `<svg viewBox="0 0 170 72" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="4" y="6" width="160" height="50" rx="10" fill="#ffc300"/><rect x="4" y="40" width="160" height="5" fill="#222" opacity=".25"/>` +
    [16, 44, 72, 100, 128].map(x => `<rect x="${x}" y="14" width="22" height="18" rx="3" fill="#cdeffd"/>`).join('') +
    `<rect x="150" y="14" width="10" height="24" rx="3" fill="#cdeffd"/><circle cx="160" cy="46" r="4" fill="#fff3b0"/>` +
    `<text x="70" y="52" font-size="8" font-weight="900" fill="#222" text-anchor="middle" font-family="sans-serif">ESCOLAR</text>` +
    roda(36, 58, 12) + roda(134, 58, 12) + `</svg>`;
  return `<svg viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg">` +
    `<path d="M8 42 Q8 28 24 26 L36 26 L48 10 L84 10 L98 26 Q114 28 114 42 L114 50 L8 50 Z" fill="${cor}"/>` +
    `<path d="M42 26 L52 14 L64 14 L64 26 Z" fill="#cdeffd"/><path d="M68 14 L80 14 L92 26 L68 26 Z" fill="#cdeffd"/>` +
    `<circle cx="110" cy="36" r="4" fill="#fff3b0"/><rect x="6" y="34" width="5" height="6" rx="2" fill="#ff595e"/>` +
    roda(32, 50) + roda(92, 50) + `</svg>`;
}
