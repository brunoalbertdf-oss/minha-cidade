// ===== Perfil da criança: nomes da família e se é menina ou menino =====
// O jogo foi escrito com os nomes da família da Lia. personalizar() troca esses nomes
// pelos do cadastro em todo texto que aparece na tela ou é falado.

const PERFIL_LIA = {
  sexo: 'f', crianca: 'Lia', papai: 'Paulo', mamae: 'Clara', vovoF: 'Lúcia', vovoM: 'Tonho',
  escola: 'Escola Estrelinha', primo: 'Nina', primoSexo: 'f', pet: 'Batata', petSexo: 'm'
};

function perfil() { return S.perfil || PERFIL_LIA; }
const menino = () => perfil().sexo === 'm';
const g = (paraMenina, paraMenino) => menino() ? paraMenino : paraMenina;
const artigo = sexo => sexo === 'f' ? 'a' : 'o';
const comNome = (titulo, nome) => nome ? `${titulo} ${nome}` : titulo;
const nomeCidade = () => `A Cidade d${artigo(perfil().sexo)} ${perfil().crianca}`;

let _regras = null, _regrasDe = '';
function regrasPerfil() {
  const P = perfil(), chave = JSON.stringify(P);
  if (_regrasDe === chave) return _regras;
  const mapa = {};
  const troca = (de, para) => { if (de !== para) mapa[de] = para; };
  const ap = artigo(P.primoSexo), pp = artigo(P.petSexo);

  troca('Escola Estrelinha', P.escola);
  troca('Lia Coins', `${P.crianca} Coins`); troca('Lia Coin', `${P.crianca} Coin`);
  troca('papai Paulo', comNome('papai', P.papai)); troca('Papai Paulo', comNome('Papai', P.papai));
  troca('mamãe Clara', comNome('mamãe', P.mamae)); troca('Mamãe Clara', comNome('Mamãe', P.mamae));
  troca('Vovó Lúcia', comNome('Vovó', P.vovoF)); troca('Vovô Tonho', comNome('Vovô', P.vovoM));
  troca('da Nina', `d${ap} ${P.primo}`); troca('a Nina', `${ap} ${P.primo}`); troca('Nina', P.primo);
  troca('do Batata', `d${pp} ${P.pet}`); troca('o Batata', `${pp} ${P.pet}`); troca('O Batata', `${pp.toUpperCase()} ${P.pet}`);
  troca('Batata', P.pet);
  troca('Lia', P.crianca);
  if (P.petSexo === 'f') { troca('tristinho', 'tristinha'); troca('brinque com ele', 'brinque com ela'); troca('Obrigado, Lia', `Obrigada, ${P.crianca}`); }
  if (P.sexo === 'm') {
    troca('Bem-vinda', 'Bem-vindo'); troca('minha netinha', 'meu netinho'); troca('muito boa', 'muito bom');
    troca('Que linda', 'Que estiloso'); troca('coisas lindas', 'coisas incríveis');
  }

  const chaves = Object.keys(mapa).sort((a, b) => b.length - a.length);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Só troca palavras inteiras, numa passada só (um nome trocado não é trocado de novo)
  _regras = chaves.length ? { re: new RegExp(`(^|[^\\p{L}])(${chaves.map(esc).join('|')})(?![\\p{L}])`, 'gu'), mapa } : null;
  _regrasDe = chave;
  return _regras;
}

function personalizar(txt) {
  if (typeof txt !== 'string') return txt;
  const r = regrasPerfil();
  return r ? txt.replace(r.re, (m, antes, k) => antes + r.mapa[k]) : txt;
}
