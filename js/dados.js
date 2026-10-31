// ===== Dados do jogo: lugares, itens da loja, palavras, frutas e receitas =====

const LOOK_PADRAO = {
  sexo: 'f', pele: 'clara', corCabelo: 'castanho', penteado: 'longo', roupa: 'vestido_rosa',
  acessorio: 'laco', batom: '', sombra: '', blush: false, glitter: '', pintura: ''
};
const LOOK_MENINO = { ...LOOK_PADRAO, sexo: 'm', penteado: 'm_curto', roupa: 'bermuda', acessorio: 'nenhum' };

const LUGARES = [
  { id: 'casa',     nome: 'Nossa Casa',               x: 13, y: 33 },
  { id: 'escola',   nome: 'Escola Estrelinha', x: 37, y: 31 },
  { id: 'vovo',     nome: 'Casa da Vovó Lúcia e Vovô Tonho', x: 61, y: 33 },
  { id: 'prima',    nome: 'Casa da Nina',            x: 13, y: 77 },
  { id: 'mercado',  nome: 'Mercado',                  x: 37, y: 77 },
  { id: 'shopping', nome: 'Shopping',                 x: 61, y: 77 },
  { id: 'ilha',     nome: 'Ilha das Férias',          x: 89, y: 55 }
];

// [tipo, valor, nome, preço, ícone, raro]
// Itens raros brilham na loja e no avatar, e custam mais
const ITENS = [
  ['pele', 'clara', 'Clarinha', 0], ['pele', 'media', 'Média', 0], ['pele', 'morena', 'Morena', 0], ['pele', 'escura', 'Escura', 0],

  ['corCabelo', 'castanho', 'Castanho', 0], ['corCabelo', 'preto', 'Preto', 0], ['corCabelo', 'loiro', 'Loiro', 0],
  ['corCabelo', 'ruivo', 'Ruivo', 15], ['corCabelo', 'rosa', 'Cabelo Rosa', 25], ['corCabelo', 'azul', 'Cabelo Azul', 25], ['corCabelo', 'roxo', 'Cabelo Roxo', 25],
  ['corCabelo', 'verde', 'Verde-Água', 30],
  ['corCabelo', 'dourado', 'Cabelo de Ouro', 90, null, true], ['corCabelo', 'arcoiris', 'Cabelo Arco-Íris', 120, null, true],

  ['penteado', 'longo', 'Cabelo Longo', 0], ['penteado', 'rabo', 'Rabo de Cavalo', 0],
  ['penteado', 'curto', 'Chanel', 10], ['penteado', 'chiquinhas', 'Maria-Chiquinha', 15], ['penteado', 'coque', 'Coque', 15],
  ['penteado', 'trancas', 'Tranças', 25], ['penteado', 'cacheado', 'Cacheado', 25], ['penteado', 'coquinhos', 'Coquinhos', 30],

  ['roupa', 'vestido_rosa', 'Vestido Rosa', 0], ['roupa', 'camiseta_saia', 'Camiseta e Saia', 0],
  ['roupa', 'macacao', 'Jardineira', 20], ['roupa', 'vestido_amarelo', 'Vestido de Sol', 20], ['roupa', 'maio', 'Maiô de Praia', 25],
  ['roupa', 'caipira', 'Vestido Caipira', 30], ['roupa', 'pijama', 'Pijama de Estrelas', 35], ['roupa', 'tricolor', 'Camisa Tricolor do Papai', 40],
  ['roupa', 'bailarina', 'Bailarina', 40], ['roupa', 'princesa', 'Vestido de Princesa', 60],
  ['roupa', 'arcoiris', 'Vestido Arco-Íris', 100, null, true], ['roupa', 'fada', 'Fada com Asas', 120, null, true],
  ['roupa', 'heroina', 'Super-Heroína', 120, null, true], ['roupa', 'sereia', 'Sereia', 150, null, true],
  ['roupa', 'gelo', 'Vestido de Gelo', 180, null, true],

  ['acessorio', 'nenhum', 'Nada', 0], ['acessorio', 'laco', 'Laço', 0],
  ['acessorio', 'flor', 'Flor', 15], ['acessorio', 'estrela', 'Presilha de Estrela', 20], ['acessorio', 'oculos', 'Óculos de Sol', 20],
  ['acessorio', 'bone', 'Boné', 25], ['acessorio', 'chapeu', 'Chapéu de Praia', 25], ['acessorio', 'gatinho', 'Orelhas de Gatinho', 30],
  ['acessorio', 'coelho', 'Orelhas de Coelho', 30], ['acessorio', 'fones', 'Fones de Ouvido', 35], ['acessorio', 'coroa_flores', 'Coroa de Flores', 40],
  ['acessorio', 'coroa', 'Coroa', 50],
  ['acessorio', 'tiara', 'Tiara de Diamante', 100, null, true], ['acessorio', 'unicornio', 'Chifre de Unicórnio', 130, null, true],

  ['batom', '', 'Sem Batom', 0], ['batom', 'rosa', 'Batom Rosa', 0], ['batom', 'vermelho', 'Batom Vermelho', 15], ['batom', 'roxo', 'Batom Roxo', 15],
  ['batom', 'coral', 'Batom Coral', 15], ['batom', 'dourado', 'Batom de Ouro', 80, null, true],
  ['sombra', '', 'Sem Sombra', 0], ['sombra', 'azul', 'Sombra Azul', 15], ['sombra', 'rosa', 'Sombra Rosa', 15], ['sombra', 'roxa', 'Sombra Lilás', 15],
  ['sombra', 'verde', 'Sombra Verde', 15], ['sombra', 'arcoiris', 'Sombra Arco-Íris', 90, null, true],
  ['blush', false, 'Natural', 0], ['blush', true, 'Blush', 10],
  ['glitter', '', 'Sem Brilho', 0], ['glitter', 'dourado', 'Glitter Dourado', 30], ['glitter', 'rosa', 'Glitter Rosa', 35],
  ['glitter', 'arcoiris', 'Glitter Arco-Íris', 100, null, true],
  ['pintura', '', 'Sem Pintura', 0], ['pintura', 'coracao', 'Coraçãozinho', 20], ['pintura', 'estrela', 'Estrelinha', 20],
  ['pintura', 'arcoiris', 'Arco-Íris', 30], ['pintura', 'borboleta', 'Borboleta Mágica', 80, null, true],

  ['brinquedo', 'balao', 'Balão', 10, '🎈'], ['brinquedo', 'ioio', 'Ioiô', 10, '🪀'], ['brinquedo', 'bola', 'Bola de Basquete', 15, '🏀'],
  ['brinquedo', 'ursinho', 'Ursinho', 20, '🧸'], ['brinquedo', 'coelho', 'Coelhinho', 25, '🐰'], ['brinquedo', 'boneca', 'Boneca', 25, '🪆'],
  ['brinquedo', 'tintas', 'Kit de Pintura', 25, '🎨'], ['brinquedo', 'robo', 'Robô', 30, '🤖'], ['brinquedo', 'dino', 'Dinossauro', 30, '🦖'],
  ['brinquedo', 'foguete', 'Foguete', 30, '🚀'], ['brinquedo', 'pinata', 'Piñata', 30, '🪅'], ['brinquedo', 'unicornio', 'Unicórnio', 35, '🦄'],
  ['brinquedo', 'violao', 'Violão', 35, '🎸'], ['brinquedo', 'patins', 'Patins', 35, '🛼'], ['brinquedo', 'patinete', 'Patinete', 40, '🛴'],
  ['brinquedo', 'piano', 'Piano', 45, '🎹'], ['brinquedo', 'castelo', 'Castelo', 50, '🏰'], ['brinquedo', 'escorregador', 'Escorregador', 60, '🛝'],
  ['brinquedo', 'dragao', 'Dragão Mágico', 120, '🐉', true], ['brinquedo', 'carrossel', 'Carrossel', 150, '🎠', true],
  ['brinquedo', 'rodagigante', 'Roda-Gigante', 200, '🎡', true],

  ['batataAcc', '', 'Sem nada', 0, '🚫'], ['batataAcc', 'laco', 'Lacinho do Batata', 20, '🎀'], ['batataAcc', 'gravata', 'Gravatinha', 20, '🎩'],
  ['batataAcc', 'chapeu', 'Chapéu de Festa', 25, '🥳'], ['batataAcc', 'oculos', 'Óculos do Batata', 25, '🕶️'],
  ['batataAcc', 'coroa', 'Coroa do Batata', 100, '👑', true], ['batataAcc', 'capa', 'Capa de Super-Cão', 120, '🦸', true],
  ['batataBrinquedo', 'bola', 'Bolinha', 0, '🎾'], ['batataBrinquedo', 'osso', 'Osso de Brinquedo', 15, '🦴'], ['batataBrinquedo', 'frisbee', 'Frisbee', 20, '🥏'],
  ['batataBrinquedo', 'corda', 'Cordinha', 20, '🪢'], ['batataBrinquedo', 'futebol', 'Bola de Futebol', 25, '⚽'], ['batataBrinquedo', 'frango', 'Frango de Borracha', 25, '🐔'],

  // Brinquedos novos (para todos)
  ['brinquedo', 'carrinho', 'Carrinho de Corrida', 15, '🏎️'], ['brinquedo', 'futebol', 'Bola de Futebol', 15, '⚽'], ['brinquedo', 'aviao', 'Aviãozinho', 25, '✈️'],
  ['brinquedo', 'trem', 'Trenzinho', 30, '🚂'], ['brinquedo', 'skate', 'Skate', 35, '🛹'], ['brinquedo', 'videogame', 'Videogame', 45, '🎮'],
  ['brinquedo', 'nave', 'Disco Voador', 130, '🛸', true], ['brinquedo', 'trofeu', 'Taça de Campeão', 160, '🏆', true],

  // Só para meninos
  ['penteado', 'm_curto', 'Cabelo Curto', 0, null, false, 'm'], ['penteado', 'm_espetado', 'Espetadinho', 0, null, false, 'm'],
  ['penteado', 'm_topete', 'Topete', 15, null, false, 'm'], ['penteado', 'm_tigela', 'Franjão', 15, null, false, 'm'],
  ['penteado', 'm_cacheado', 'Cachinhos', 20, null, false, 'm'], ['penteado', 'm_moicano', 'Moicano', 30, null, false, 'm'],

  ['roupa', 'bermuda', 'Camiseta e Bermuda', 0, null, false, 'm'], ['roupa', 'calca', 'Camiseta e Calça', 0, null, false, 'm'],
  ['roupa', 'futebol_br', 'Camisa da Seleção', 30, null, false, 'm'], ['roupa', 'futebol_vermelho', 'Time Vermelho', 30, null, false, 'm'],
  ['roupa', 'futebol_azul', 'Time Azul', 30, null, false, 'm'], ['roupa', 'bombeiro', 'Bombeiro', 40, null, false, 'm'],
  ['roupa', 'pirata', 'Pirata', 45, null, false, 'm'], ['roupa', 'heroi_azul', 'Super-Herói do Raio', 50, null, false, 'm'],
  ['roupa', 'heroi_verde', 'Herói da Estrela', 50, null, false, 'm'],
  ['roupa', 'heroi_fogo', 'Herói de Fogo', 120, null, true, 'm'], ['roupa', 'astronauta', 'Astronauta', 130, null, true, 'm'],
  ['roupa', 'dino', 'Fantasia de Dinossauro', 140, null, true, 'm'], ['roupa', 'cavaleiro', 'Cavaleiro', 150, null, true, 'm'],
  ['roupa', 'robo', 'Armadura de Robô', 180, null, true, 'm'],

  ['acessorio', 'bandana', 'Faixa de Ninja', 20, null, false, 'm'], ['acessorio', 'mascara', 'Máscara de Herói', 25, null, false, 'm'],
  ['acessorio', 'capacete', 'Capacete de Bombeiro', 30, null, false, 'm'], ['acessorio', 'chapeu_pirata', 'Chapéu de Pirata', 35, null, false, 'm'],
  ['acessorio', 'antenas', 'Antenas de Robô', 100, null, true, 'm'], ['acessorio', 'capacete_astro', 'Capacete Espacial', 120, null, true, 'm'],

  ['pintura', 'raio', 'Raio', 20, null, false, 'm'], ['pintura', 'listras', 'Listras de Guerreiro', 20, null, false, 'm'],
  ['pintura', 'bola', 'Bola de Futebol', 25, null, false, 'm'], ['pintura', 'brasil', 'Brasil', 30, null, false, 'm'],
  ['pintura', 'fogo', 'Fogo Mágico', 80, null, true, 'm']
].map(([tipo, val, nome, preco, icone, raro, sexo]) => ({ id: tipo + ':' + val, tipo, val, nome, preco, icone, raro: !!raro, sexo }));

// Itens só de menina (o resto, sem marca, é para todos)
['penteado:longo', 'penteado:rabo', 'penteado:curto', 'penteado:chiquinhas', 'penteado:coque', 'penteado:trancas', 'penteado:cacheado', 'penteado:coquinhos',
 'roupa:vestido_rosa', 'roupa:camiseta_saia', 'roupa:macacao', 'roupa:vestido_amarelo', 'roupa:maio', 'roupa:caipira', 'roupa:bailarina', 'roupa:princesa',
 'roupa:arcoiris', 'roupa:fada', 'roupa:heroina', 'roupa:sereia', 'roupa:gelo',
 'acessorio:laco', 'acessorio:flor', 'acessorio:estrela', 'acessorio:chapeu', 'acessorio:gatinho', 'acessorio:coelho', 'acessorio:coroa_flores',
 'acessorio:tiara', 'acessorio:unicornio', 'pintura:coracao', 'pintura:borboleta', 'brinquedo:boneca', 'batataAcc:laco'
].forEach(id => { ITENS.find(i => i.id === id).sexo = 'f'; });
ITENS.filter(i => ['batom', 'sombra', 'blush', 'glitter'].includes(i.tipo)).forEach(i => { i.sexo = 'f'; });

const TITULOS = {
  pele: 'Pele', corCabelo: 'Cor do cabelo', penteado: 'Penteado', roupa: 'Roupas', acessorio: 'Enfeites',
  batom: 'Batom', sombra: 'Sombra', blush: 'Bochechas', glitter: 'Brilho', pintura: 'Pintura no rosto',
  brinquedo: 'Brinquedos do quarto', batataAcc: 'Roupinha do Batata', batataBrinquedo: 'Brinquedo do Batata'
};

// Bagunça do quarto: emoji -> onde guardar
const BAGUNCA = {
  brinquedo: ['🧸', '🚗', '🪀', '🧩', '⚽', '🪁', '🎲', '🦕', '🪆', '🎨'],
  livro: ['📕', '📗', '📘', '📙'],
  roupa: ['👕', '👗', '🧦', '👖', '👚', '🩳', '🧢', '👟'],
  lixo: ['🍂', '🧻', '🍌', '📄', '🥤', '🍬']
};

// Palavras da escola, separadas em sílabas.
// Nível 1: duas sílabas · Nível 2: três sílabas
const PALAVRAS = [
  ['GA', 'TO', '🐱'], ['BO', 'LA', '⚽'], ['CA', 'SA', '🏠'], ['PA', 'TO', '🦆'], ['SA', 'PO', '🐸'],
  ['LU', 'A', '🌙'], ['BO', 'LO', '🎂'], ['FA', 'DA', '🧚'], ['VA', 'CA', '🐄'], ['PEI', 'XE', '🐟'],
  ['MA', 'ÇÃ', '🍎'], ['U', 'VA', '🍇'], ['DA', 'DO', '🎲'], ['MO', 'TO', '🏍️'], ['PI', 'PA', '🪁'],
  ['RA', 'TO', '🐭'], ['FO', 'CA', '🦭'], ['CA', 'MA', '🛏️'], ['PE', 'RA', '🍐'], ['CO', 'CO', '🥥'],
  ['BI', 'A', '👧'], ['VO', 'VÓ', '👵'], ['VO', 'VÔ', '👴'], ['SO', 'FÁ', '🛋️'], ['CA', 'FÉ', '☕'], ['PA', 'PAI', '👨'],
  ['MA', 'MÃE', '👩'], ['NA', 'VE', '🚀'], ['SU', 'CO', '🧃'], ['MA', 'LA', '🧳'], ['BA', 'LA', '🍬'],
  ['LE', 'ÃO', '🦁'], ['BO', 'NÉ', '🧢'],
  ['MA', 'CA', 'CO', '🐒'], ['CA', 'VA', 'LO', '🐴'], ['BA', 'NA', 'NA', '🍌'], ['SA', 'PA', 'TO', '👞'],
  ['JA', 'NE', 'LA', '🪟'], ['PI', 'PO', 'CA', '🍿'], ['TO', 'MA', 'TE', '🍅'], ['GA', 'LI', 'NHA', '🐔'],
  ['BA', 'TA', 'TA', '🐶'], ['CE', 'NOU', 'RA', '🥕'], ['BA', 'LEI', 'A', '🐳'], ['CO', 'E', 'LHO', '🐰'],
  ['SO', 'FI', 'A', '👭'], ['GI', 'RA', 'FA', '🦒'], ['CO', 'RU', 'JA', '🦉'], ['MO', 'CHI', 'LA', '🎒'],
  ['CA', 'MI', 'SA', '👕'], ['PA', 'NE', 'LA', '🍲'], ['A', 'VI', 'ÃO', '✈️'],
  ['BO', 'NE', 'CA', '🪆'], ['CA', 'NE', 'CA', '☕']
].map(p => ({ s: p.slice(0, -1), e: p[p.length - 1], nivel: p.length - 2 }));

// Nível 3: quatro sílabas e palavras com consoantes juntas (PRA, BRU, TRE...) ou finais (POR, FES...)
const PALAVRAS_DIFICEIS = [
  ['PRA', 'TO', '🍽️'], ['BRU', 'XA', '🧙‍♀️'], ['LI', 'VRO', '📖'], ['GLO', 'BO', '🌍'], ['FRU', 'TA', '🍓'],
  ['PE', 'DRA', '🪨'], ['ZE', 'BRA', '🦓'], ['CO', 'BRA', '🐍'], ['TI', 'GRE', '🐯'], ['POR', 'CO', '🐷'],
  ['GAR', 'FO', '🍴'], ['CAR', 'RO', '🚗'], ['POR', 'TA', '🚪'], ['FES', 'TA', '🎉'], ['BAR', 'CO', '⛵'],
  ['ES', 'TRE', 'LA', '⭐'], ['SOR', 'VE', 'TE', '🍦'], ['ÁR', 'VO', 'RE', '🌳'], ['GRA', 'VA', 'TA', '👔'],
  ['PLA', 'NE', 'TA', '🪐'], ['FLO', 'RES', '💐'], ['FOR', 'MI', 'GA', '🐜'], ['MOR', 'CE', 'GO', '🦇'],
  ['CA', 'MI', 'NHÃO', '🚚'], ['PA', 'LHA', 'ÇO', '🤡'],
  ['PI', 'RU', 'LI', 'TO', '🍭'], ['A', 'BA', 'CA', 'XI', '🍍'], ['TE', 'LE', 'FO', 'NE', '📞'],
  ['BOR', 'BO', 'LE', 'TA', '🦋'], ['BI', 'CI', 'CLE', 'TA', '🚲'], ['TAR', 'TA', 'RU', 'GA', '🐢'],
  ['PA', 'TI', 'NE', 'TE', '🛴'], ['CHO', 'CO', 'LA', 'TE', '🍫'], ['ME', 'LAN', 'CI', 'A', '🍉'],
  ['DI', 'NOS', 'SAU', 'RO', '🦖'], ['PAS', 'SA', 'RI', 'NHO', '🐦'], ['MA', 'CA', 'RRÃO', '🍝']
].map(p => ({ s: p.slice(0, -1), e: p[p.length - 1], nivel: 3 }));

// Palavras que são nomes da família da Lia: só entram quando o nome do cadastro é igual
const PALAVRAS_PESSOAIS = { LIA: 'crianca', NINA: 'primo', BATATA: 'pet' };

const SILABAS =[...new Set([...PALAVRAS, ...PALAVRAS_DIFICEIS].flatMap(p => p.s))];

const FRUTAS = [
  ['🍎', 'Maçã', 'a'], ['🍌', 'Banana', 'a'], ['🍇', 'Uva', 'a'], ['🍓', 'Morango', 'o'],
  ['🍊', 'Laranja', 'a'], ['🍍', 'Abacaxi', 'o'], ['🍉', 'Melancia', 'a'], ['🍐', 'Pera', 'a'],
  ['🍋', 'Limão', 'o'], ['🍒', 'Cereja', 'a'], ['🥝', 'Kiwi', 'o'], ['🥭', 'Manga', 'a'],
  ['🍑', 'Pêssego', 'o'], ['🥥', 'Coco', 'o'], ['🫐', 'Mirtilo', 'o'], ['🍈', 'Melão', 'o']
].map(([e, nome, art]) => ({ e, nome, art }));

const INGREDIENTES = {
  ovo: ['🥚', 'Ovo', 'o'], farinha: ['🌾', 'Farinha', 'a'], leite: ['🥛', 'Leite', 'o'],
  chocolate: ['🍫', 'Chocolate', 'o'], massa: ['🫓', 'Massa', 'a'], tomate: ['🍅', 'Tomate', 'o'],
  queijo: ['🧀', 'Queijo', 'o'], azeitona: ['🫒', 'Azeitona', 'a'], mel: ['🍯', 'Mel', 'o'],
  morango: ['🍓', 'Morango', 'o'], banana: ['🍌', 'Banana', 'a'], maca: ['🍎', 'Maçã', 'a'],
  uva: ['🍇', 'Uva', 'a'], manteiga: ['🧈', 'Manteiga', 'a'], acucar: ['🍬', 'Açúcar', 'o'],
  cenoura: ['🥕', 'Cenoura', 'a'], milho: ['🌽', 'Milho', 'o'], limao: ['🍋', 'Limão', 'o']
};

const RECEITAS = [
  { nome: 'Bolo de Chocolate', icone: '🎂', ing: ['ovo', 'farinha', 'leite', 'chocolate'], fogo: 'forno' },
  { nome: 'Pizza', icone: '🍕', ing: ['massa', 'tomate', 'queijo', 'azeitona'], fogo: 'forno' },
  { nome: 'Panqueca', icone: '🥞', ing: ['ovo', 'leite', 'farinha', 'mel'], fogo: 'frigideira' },
  { nome: 'Salada de Frutas', icone: '🍧', ing: ['morango', 'banana', 'maca', 'uva'], fogo: null },
  { nome: 'Biscoitos', icone: '🍪', ing: ['manteiga', 'acucar', 'farinha', 'chocolate'], fogo: 'forno' },
  { nome: 'Bolo de Cenoura', icone: '🧁', ing: ['cenoura', 'ovo', 'acucar', 'farinha'], fogo: 'forno' }
];
