// ===== Família e amigos da Lia =====
let _clipId = 0;
const PELE_ADULTO = '#f3c9a6';

// Papai Paulo, Mamãe Clara, Vovó Lúcia e Vovô Tonho
function pessoaSVG(quem, soRosto = false) {
  const p = quem === 'vovo2' ? '#b5794f' : PELE_ADULTO;
  let s = `<svg viewBox="${soRosto ? '42 2 116 130' : '0 0 200 330'}"xmlns="http://www.w3.org/2000/svg" class="pessoa-svg">`;
  const rosto = (boca = 'sorriso') =>
    `<ellipse cx="84" cy="80" rx="5" ry="6.5" fill="#2b1d14"/><ellipse cx="116" cy="80" rx="5" ry="6.5" fill="#2b1d14"/>` +
    `<circle cx="86" cy="77.5" r="1.8" fill="#fff"/><circle cx="118" cy="77.5" r="1.8" fill="#fff"/>` +
    `<ellipse cx="74" cy="94" rx="8" ry="5" fill="#ff7f9f" opacity=".3"/><ellipse cx="126" cy="94" rx="8" ry="5" fill="#ff7f9f" opacity=".3"/>` +
    `<path d="M97 88 Q100 92 103 88" stroke="#d99a7a" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    (boca === 'batom' ? `<path d="M89 100 Q100 114 111 100 Q100 104 89 100 Z" fill="#b5179e"/>`
      : `<path d="M90 100 Q100 110 110 100" stroke="${boca === 'barba' ? '#fff' : '#a33'}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
  const cabeca = `<circle cx="58" cy="82" r="7" fill="${p}"/><circle cx="142" cy="82" r="7" fill="${p}"/><circle cx="100" cy="78" r="42" fill="${p}"/>`;
  const pescoco = `<rect x="91" y="112" width="18" height="20" rx="6" fill="${p}"/>`;
  const oculos = `<g fill="none" stroke="#6d4c41" stroke-width="3"><circle cx="84" cy="80" r="11"/><circle cx="116" cy="80" r="11"/><path d="M95 80 L105 80"/></g>`;
  const pernasFinas = (sapato) =>
    `<rect x="84" y="238" width="13" height="70" rx="6" fill="${p}"/><rect x="103" y="238" width="13" height="70" rx="6" fill="${p}"/>` +
    `<ellipse cx="88" cy="312" rx="13" ry="7" fill="${sapato}"/><ellipse cx="112" cy="312" rx="13" ry="7" fill="${sapato}"/>`;
  const bracos = (larg, cor) =>
    `<path d="M64 138 Q48 180 52 220" stroke="${cor}" stroke-width="${larg}" fill="none" stroke-linecap="round"/>` +
    `<path d="M136 138 Q152 180 148 220" stroke="${cor}" stroke-width="${larg}" fill="none" stroke-linecap="round"/>` +
    `<circle cx="52" cy="223" r="8" fill="${p}"/><circle cx="148" cy="223" r="8" fill="${p}"/>`;

  if (quem === 'papai') {
    const id = 'tricolor' + (++_clipId);
    const cab = '#3b2416';
    s += `<rect x="72" y="232" width="24" height="80" rx="8" fill="#355c9a"/><rect x="104" y="232" width="24" height="80" rx="8" fill="#355c9a"/>`;
    s += `<ellipse cx="82" cy="314" rx="16" ry="8" fill="#333"/><ellipse cx="118" cy="314" rx="16" ry="8" fill="#333"/>`;
    // braços fortes
    s += `<path d="M52 140 Q30 180 36 222" stroke="${p}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M148 140 Q170 180 164 222" stroke="${p}" stroke-width="22" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="36" cy="226" r="12" fill="${p}"/><circle cx="164" cy="226" r="12" fill="${p}"/>`;
    // camisa tricolor: listras azul, preto e branco
    const corpo = 'M44 134 Q100 116 156 134 L162 168 L146 170 L144 240 L56 240 L54 170 L38 168 Z';
    s += `<clipPath id="${id}"><path d="${corpo}"/></clipPath><g clip-path="url(#${id})"><rect x="30" y="110" width="140" height="140" fill="#fff"/>`;
    const cores = ['#0d80bf', '#111', '#0d80bf', '#fff'];
    for (let i = 0; i < 12; i++) s += `<rect x="${30 + i * 12}" y="110" width="12" height="140" fill="${cores[i % 4]}"/>`;
    s += `</g><path d="${corpo}" fill="none" stroke="#0a4f75" stroke-width="2"/><path d="M86 126 L100 142 L114 126" fill="#111"/>`;
    s += pescoco + cabeca;
    // barba
    s += `<path d="M60 84 Q62 128 100 128 Q138 128 140 84 Q132 104 118 106 Q100 100 82 106 Q68 104 60 84 Z" fill="${cab}"/>`;
    s += `<path d="M88 98 Q100 92 112 98 Q100 100 88 98 Z" fill="${cab}"/>`;
    s += rosto('barba');
    // cabelo com topete
    s += `<path d="M58 72 Q56 40 80 34 Q78 14 104 10 Q128 8 136 22 Q122 22 116 30 Q144 36 142 72 Q136 52 120 48 Q100 44 80 48 Q64 52 58 72 Z" fill="${cab}"/>`;
    s += `<path d="M73 66 Q84 60 94 65 M106 65 Q116 60 127 66" stroke="${cab}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  }

  if (quem === 'mamae') {
    const cab = '#4a2c1d';
    // cabelo longo ondulado (atrás)
    s += `<path d="M56 78 Q50 30 100 30 Q150 30 144 78 Q158 100 146 122 Q160 146 146 170 Q158 196 140 214 Q124 220 118 200 L82 200 Q76 220 60 214 Q42 196 54 170 Q40 146 54 122 Q42 100 56 78 Z" fill="${cab}"/>`;
    s += pernasFinas('#7b2cbf') + bracos(13, p);
    // vestido roxo
    s += `<path d="M66 132 Q100 120 134 132 L132 180 L158 262 Q100 276 42 262 L68 180 Z" fill="#8e44ad"/>`;
    s += `<path d="M68 176 Q100 186 132 176 L133 184 Q100 194 67 184 Z" fill="#c39bd3"/>`;
    s += `<circle cx="66" cy="138" r="13" fill="#8e44ad"/><circle cx="134" cy="138" r="13" fill="#8e44ad"/>`;
    s += [[80, 214], [110, 230], [130, 250], [70, 246], [100, 200]].map(([x, y]) => estrela(x, y, 5, '#e8daef')).join('');
    s += pescoco + cabeca + rosto('batom');
    s += `<path d="M75 67 Q84 62 93 66 M107 66 Q116 62 125 67" stroke="${cab}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    // frente do cabelo, com ondas caindo dos lados
    s += `<path d="M58 84 Q54 34 100 34 Q146 34 142 84 Q136 56 104 48 Q96 60 70 62 Q60 70 58 84 Z" fill="${cab}"/>`;
    s += `<path d="M58 84 Q50 104 60 120 Q52 134 62 146" stroke="${cab}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M142 84 Q150 104 140 120 Q148 134 138 146" stroke="${cab}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="60" cy="96" r="4" fill="#d7bde2"/><circle cx="140" cy="96" r="4" fill="#d7bde2"/>`;
  }

  if (quem === 'vovo') {
    const cab = '#f0c75e';
    s += `<circle cx="100" cy="30" r="22" fill="${cab}"/>`;
    s += pernasFinas('#8d5a3b') + bracos(14, p);
    s += `<path d="M64 132 Q100 120 136 132 L140 180 L152 260 Q100 272 48 260 L60 180 Z" fill="#f28482"/>`;
    // avental de cozinheira
    s += `<path d="M76 150 L124 150 L130 250 Q100 258 70 250 Z" fill="#fff"/><path d="M82 200 h36 v22 h-36 z" fill="#ffd6e0"/>`;
    s += `<circle cx="64" cy="138" r="13" fill="#f28482"/><circle cx="136" cy="138" r="13" fill="#f28482"/>`;
    s += pescoco + cabeca + rosto() + oculos;
    s += `<path d="M58 80 Q54 36 100 36 Q146 36 142 80 Q138 56 118 52 Q100 60 82 52 Q62 56 58 80 Z" fill="${cab}"/>`;
  }

  if (quem === 'vovo2') {
    const cab = '#1f1a1a';
    s += `<rect x="74" y="232" width="22" height="78" rx="8" fill="#8d6e63"/><rect x="104" y="232" width="22" height="78" rx="8" fill="#8d6e63"/>`;
    s += `<ellipse cx="84" cy="312" rx="15" ry="8" fill="#4e342e"/><ellipse cx="116" cy="312" rx="15" ry="8" fill="#4e342e"/>`;
    s += `<path d="M58 140 Q42 180 46 220" stroke="#2a9d8f" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M142 140 Q158 180 154 220" stroke="#2a9d8f" stroke-width="18" fill="none" stroke-linecap="round"/>`;
    s += `<circle cx="46" cy="226" r="10" fill="${p}"/><circle cx="154" cy="226" r="10" fill="${p}"/>`;
    s += `<path d="M52 134 Q100 118 148 134 L146 240 L54 240 Z" fill="#2a9d8f"/><path d="M100 126 L100 240" stroke="#1d7268" stroke-width="3"/>`;
    s += `<path d="M86 124 L100 150 L114 124 Z" fill="#fff"/>`;
    [160, 185, 210].forEach(y => s += `<circle cx="106" cy="${y}" r="3" fill="#ffd60a"/>`);
    s += pescoco + cabeca + rosto();
    // cabelo curtinho preto
    s += `<path d="M58 80 Q54 34 100 34 Q146 34 142 80 Q140 62 130 56 Q100 50 70 56 Q60 62 58 80 Z" fill="${cab}"/>`;
    s += `<path d="M76 66 Q84 62 92 66 M108 66 Q116 62 124 66" stroke="${cab}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  }
  return s + '</svg>';
}

// Nina: amiga loirinha de 6 anos, no mesmo estilo da Lia
const LOOK_NINA = { pele: 'clara', corCabelo: 'loiro', penteado: 'chiquinhas', roupa: 'camiseta_saia', acessorio: 'flor', blush: true };
function primaSVG() { return criancaSVG(LOOK_NINA); }

// Primo (quando o cadastro diz que é menino): espetadinho, com camisa de futebol
const LOOK_PRIMO = { ...LOOK_MENINO, corCabelo: 'preto', penteado: 'm_espetado', roupa: 'futebol_azul', acessorio: 'nenhum' };
function primoSVG() { return perfil().primoSexo === 'm' ? criancaSVG(LOOK_PRIMO) : primaSVG(); }
