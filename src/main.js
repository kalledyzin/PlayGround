import * as THREE from 'three';
import { CENAS, FINAIS, EPILOGOS_FAN, PERSONAGENS, PROFECIA, calcularFinal } from './story.js';
import { CampWorld } from './world3d.js';

// ================= ESTADO =================
const SAVE_KEY = 'ecos-do-olimpo-save-v1';
let S = freshState();
function freshState() {
  return { olimpo: 0, equipe: 30, sombra: 5, flags: [], historico: [], cenaIndex: 0, mortes: [] };
}
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch {} }
function load() { try { const r = localStorage.getItem(SAVE_KEY); if (r) { S = JSON.parse(r); return true; } } catch {} return false; }

// ================= ÁUDIO procedural =================
let AC = null, muted = false;
function beep(freq = 440, dur = 0.12, type = 'sine', vol = 0.15) {
  if (muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch {}
}
const sfx = {
  click: () => beep(660, 0.07, 'square', 0.08),
  good: () => { beep(523, 0.12); setTimeout(() => beep(784, 0.15), 110); },
  bad: () => { beep(220, 0.2, 'sawtooth', 0.12); setTimeout(() => beep(147, 0.3, 'sawtooth', 0.1), 150); },
  magic: () => { beep(880, 0.2, 'sine', 0.1); setTimeout(() => beep(1320, 0.25, 'sine', 0.08), 120); },
  thunder: () => beep(70, 0.6, 'sawtooth', 0.2),
};

// ================= HELPERS DOM =================
const $ = id => document.getElementById(id);
function toast(msg, ms = 2600) {
  const d = document.createElement('div');
  d.className = 'toastMsg'; d.textContent = msg;
  $('toast').appendChild(d);
  setTimeout(() => d.remove(), ms);
}
function fmtSpeaker(txt) {
  const m = txt.match(/^([A-ZÃÕÇÉÊ\s\(\)\/\-]+):\s?(.*)$/);
  if (m && m[1].length < 42) return `<span class="spk">${m[1]}:</span> ${m[2]}`;
  return txt;
}

// ================= MUNDO 3D (título + jogo) =================
let titleWorld = null, world = null;
function initTitle3D() {
  const el = $('titleCanvas');
  titleWorld = new CampWorld(el, null);
  titleWorld.followMode = false;
  titleWorld.playerSpeed = 0;
  // câmera panorâmica no título
  let a = 0;
  const spin = () => {
    if (!$('title').classList.contains('hidden')) {
      a += 0.0035;
      titleWorld.camera.position.set(Math.sin(a) * 34, 14, Math.cos(a) * 34);
      titleWorld.camera.lookAt(0, 2, -6);
    }
    requestAnimationFrame(spin);
  };
  spin();
}

// ================= FLUXO DO JOGO =================
let cenaAtual = null, falaIdx = 0, timerInt = null, qteResolve = null;

function startGame(fromSave = false) {
  if (!fromSave) S = freshState();
  save();
  $('title').classList.add('hidden');
  $('ending').classList.add('hidden');
  $('game').classList.remove('hidden');
  if (!world) {
    world = new CampWorld($('view3d'), onArrive);
    setupJoystick();
  }
  world.resize();
  runScene(S.cenaIndex);
  beep(392, 0.15); setTimeout(() => beep(523, 0.2), 150);
}

function runScene(i) {
  if (i >= CENAS.length) return showEnding();
  S.cenaIndex = i; save();
  cenaAtual = CENAS[i]; falaIdx = 0;
  const P = PERSONAGENS[cenaAtual.quem];
  world.setLocation(cenaAtual.local);
  world.setHero(cenaAtual.quem, P.cor, P.nome.split(' ')[0]);
  $('whoName').textContent = P.nome.toUpperCase();
  $('whoDot').style.background = P.cor;
  $('capLabel').textContent = cenaAtual.capitulo.split('—')[0].toUpperCase();
  $('choices').classList.add('hidden');
  $('result').classList.add('hidden');
  $('dCap').textContent = cenaAtual.capitulo;
  $('dTitle').textContent = cenaAtual.titulo;
  $('obj').textContent = '🎯 ' + cenaAtual.objetivo3d;
  updateBars();
  // mostra intro + falas
  const falas = ['📜 ' + cenaAtual.intro, ...cenaAtual.textos];
  showFala(falas);
}

function showFala(falas) {
  $('dialog').classList.remove('hidden');
  $('explore').classList.add('hidden');
  const render = () => {
    if (falaIdx < falas.length) {
      const pct = Math.round((falaIdx / falas.length) * 100);
      $('dtext').innerHTML = fmtSpeaker(falas[falaIdx]) +
        `<div style="margin-top:8px;font-size:12px;color:var(--dim)">— ${falaIdx + 1}/${falas.length} — clique Continuar ou pressione Espaço</div>`;
      beep(300 + falaIdx * 40, 0.05, 'sine', 0.05);
    } else {
      $('dialog').classList.add('hidden');
      startExplore();
    }
  };
  render();
  $('btnNext').onclick = () => { falaIdx++; sfx.click(); if (falaIdx <= falas.length) render(); };
}

function startExplore() {
  $('explore').classList.remove('hidden');
  $('joy').classList.remove('hidden');
  toast('🚶 Ande até o FEIXE DOURADO! (WASD / joystick)');
  const tick = () => {
    if ($('explore').classList.contains('hidden')) return;
    if (world && world.distToObj !== undefined)
      $('dist').textContent = `• ${world.distToObj.toFixed(0)}m`;
    requestAnimationFrame(tick);
  };
  tick();
}

function onArrive() {
  sfx.magic();
  $('explore').classList.add('hidden');
  $('joy').classList.add('hidden');
  showChoices();
}

function showChoices() {
  const box = $('choices');
  box.innerHTML = '';
  box.classList.remove('hidden');
  const esc = cenaAtual.escolha;
  const q = document.createElement('div');
  q.className = 'q'; q.textContent = '❖ ' + esc.pergunta;
  const tw = document.createElement('div');
  tw.id = 'timerWrap';
  tw.innerHTML = `⏳ Tempo para decidir: <b id="timerNum">${esc.tempo}</b>s <small style="color:var(--dim)">(Detroit: o tempo esgota = o jogo escolhe por você)</small><div id="timerBar"><i></i></div>`;
  box.appendChild(tw); box.appendChild(q);
  esc.opcoes.forEach((op, idx) => {
    const b = document.createElement('button');
    b.className = 'opt' + ((op.texto.includes('HEADCANON') || op.texto.includes('FAN')) ? ' fan' : '');
    b.innerHTML = `${op.texto}<span class="tag">${op.tag} • 👥 ${op.pct}% dos jogadores</span>`;
    b.onclick = () => chooseOption(idx);
    box.appendChild(b);
  });
  // timer
  let t = esc.tempo;
  clearInterval(timerInt);
  timerInt = setInterval(() => {
    t -= 0.1;
    const num = $('timerNum'), bar = document.querySelector('#timerBar i');
    if (num) num.textContent = Math.max(0, t).toFixed(0);
    if (bar) bar.style.width = Math.max(0, (t / esc.tempo) * 100) + '%';
    if (t <= 5 && t > 0) beep(880, 0.05, 'square', 0.06);
    if (t <= 0) {
      clearInterval(timerInt);
      toast('⏳ Tempo esgotado! O destino escolheu... (a 1ª opção)');
      chooseOption(0, true);
    }
  }, 100);
}

async function chooseOption(idx, auto = false) {
  clearInterval(timerInt);
  const op = cenaAtual.escolha.opcoes[idx];
  sfx.click();
  $('choices').classList.add('hidden');
  // QTE se houver
  if (op.qte) {
    const ok = await runQTE(op.qte);
    if (!ok) {
      toast('💥 Você falhou no evento rápido! Consequência parcial...');
      sfx.bad();
    } else { sfx.good(); toast('⚡ Evento rápido PERFEITO!'); }
    op._qteOk = ok;
  }
  applyEffects(op, auto);
}

function runQTE(label) {
  return new Promise(resolve => {
    $('qte').classList.remove('hidden');
    $('qteText').textContent = label;
    const keys = ['ESPAÇO', 'E', 'Q'];
    const want = keys[Math.floor(Math.random() * keys.length)];
    $('qteKey').textContent = want;
    const bar = document.querySelector('#qteBar i');
    let left = 100;
    const need = want === 'ESPAÇO' ? 'Space' : 'Key' + want;
    const onKey = e => {
      if (e.code === need) { cleanup(true); }
      else if (['Space', 'KeyE', 'KeyQ', 'KeyW'].includes(e.code)) { cleanup(false); }
    };
    const iv = setInterval(() => {
      left -= 4;
      bar.style.width = left + '%';
      if (left <= 0) cleanup(false);
    }, 60);
    function cleanup(ok) {
      clearInterval(iv);
      removeEventListener('keydown', onKey);
      $('qte').classList.add('hidden');
      resolve(ok);
    }
    addEventListener('keydown', onKey);
  });
}

function applyEffects(op, auto) {
  const ef = op.efeitos || {};
  const dO = ef.olimpo || 0, dE = ef.equipe || 0, dS = ef.sombra || 0;
  S.olimpo = Math.max(-100, Math.min(100, S.olimpo + dO));
  S.equipe = Math.max(0, Math.min(100, S.equipe + dE));
  S.sombra = Math.max(0, Math.min(100, S.sombra + dS));
  (ef.flags || []).forEach(f => { if (!S.flags.includes(f)) S.flags.push(f); });
  if (op.morte && op._qteOk !== false) {
    // morte pode ser evitada se QTE perfeito? Não: sacrifício é escolha. Marca morte.
    S.mortes.push(op.morte);
    sfx.thunder();
  }
  S.historico.push({ cena: cenaAtual.id, escolha: op.texto, tag: op.tag, pct: op.pct });
  save();
  updateBars();
  // mostra resultado
  $('result').classList.remove('hidden');
  let extra = '';
  if (op._qteOk === false) extra = '<br/><i style="color:#ff9b9b">(Você falhou no QTE — o resultado veio com custo extra.)</i>';
  if (op.morte && op._qteOk !== false) extra += `<br/><b style="color:#ff6b6b">☠️ ${PERSONAGENS[op.morte].nome} carrega agora a marca do sacrifício...</b>`;
  $('rtext').innerHTML = (auto ? '<i>(escolha automática — tempo esgotado)</i><br/>' : '') + op.resultado + extra;
  const fx = $('reffects'); fx.innerHTML = '';
  const chip = (t, c) => { const s = document.createElement('span'); s.className = 'fx ' + c; s.textContent = t; fx.appendChild(s); };
  if (dO) chip(`🏛️ Olimpo ${dO > 0 ? '+' : ''}${dO}`, dO > 0 ? 'up' : 'down');
  if (dE) chip(`🤝 Equipe ${dE > 0 ? '+' : ''}${dE}`, dE > 0 ? 'up' : 'down');
  if (dS) chip(`🌑 Sombra ${dS > 0 ? '+' : ''}${dS}`, dS > 0 ? 'up' : 'down');
  if ((ef.flags || []).length) chip(`🔖 ${ef.flags.length} segredo(s) desbloqueado(s)`, 'up');
  $('pct').textContent = `👥 ${op.pct}% dos jogadores escolheram isso • “${op.tag}” registrado no fluxograma.`;
  if (dE > 0 || dO > 0) sfx.good(); else if (dE < 0 || dO < 0) sfx.bad(); else sfx.magic();
  $('btnAfter').onclick = () => {
    sfx.click();
    $('result').classList.add('hidden');
    // checkpoint de fluxograma a cada 2 cenas
    if (S.historico.length % 2 === 0) showFlow(false, () => runScene(S.cenaIndex + 1));
    else runScene(S.cenaIndex + 1);
  };
}

function updateBars() {
  $('barOlimpo').style.width = ((S.olimpo + 100) / 2) + '%';
  $('barEquipe').style.width = S.equipe + '%';
  $('barSombra').style.width = S.sombra + '%';
}

// ================= FLUXOGRAMA =================
function flowHTML(full) {
  return CENAS.map((c, i) => {
    const h = S.historico.find(x => x.cena === c.id);
    const done = !!h;
    if (!done && !full) return `<div class="node">🔒 <b>${c.capitulo}</b><br/>??? — jogue para desbloquear<span class="pct">???%</span></div>`;
    if (!done) return `<div class="node">◻️ <b>${c.capitulo} — ${c.titulo}</b><br/>Opções: ${c.escolha.opcoes.map(o => o.tag).join(' / ')}</div>`;
    return `<div class="node">✅ <b>${c.capitulo}</b> — ${c.titulo}<br/>Você: “${h.escolha}”<br/><i>${c.escolha.opcoes.map(o => `👥 ${o.pct}% — ${o.texto.slice(0, 46)}…`).join('<br/>')}</i><span class="pct">${h.pct}%</span></div>`;
  }).join('');
}
let flowCb = null;
function showFlow(full = true, cb = null) {
  flowCb = cb;
  $('flowNodes').innerHTML = flowHTML(full);
  $('flow').classList.remove('hidden');
}

// ================= FINAL =================
function showEnding() {
  $('game').classList.add('hidden');
  $('ending').classList.remove('hidden');
  const key = calcularFinal(S);
  const F = FINAIS[key];
  $('endTitle').textContent = F.titulo;
  $('endText').textContent = F.texto;
  $('stO').textContent = S.olimpo; $('stE').textContent = S.equipe; $('stS').textContent = S.sombra;
  const eps = EPILOGOS_FAN.filter(e => e.cond.some(c => S.flags.includes(c)));
  $('epilogos').innerHTML = '<h3>💖 Epílogos de fãs desbloqueados (' + eps.length + ')</h3>' +
    (eps.length ? eps.map(e => `<div class="epi">${e.texto}</div>`).join('') :
      '<p style="color:var(--dim)">Nenhum epílogo fan desbloqueado — rejogue escolhendo opções 🌟 HEADCANON e 💖 FAN-SERVICE!</p>');
  $('endFlow').innerHTML = flowHTML(true);
  try { localStorage.removeItem(SAVE_KEY); } catch {}
  sfx.thunder(); setTimeout(() => sfx.good(), 600);
}

// ================= JOYSTICK =================
function setupJoystick() {
  const joy = $('joy'), stick = $('stick');
  let active = false;
  const move = e => {
    if (!active) return;
    const r = joy.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const p = e.touches ? e.touches[0] : e;
    let dx = (p.clientX - cx) / 40, dy = (p.clientY - cy) / 40;
    dx = Math.max(-1, Math.min(1, dx)); dy = Math.max(-1, Math.min(1, dy));
    stick.style.left = (35 + dx * 30) + 'px'; stick.style.top = (35 + dy * 30) + 'px';
    world.joy = { x: -dx, y: -dy };
  };
  joy.addEventListener('pointerdown', e => { active = true; joy.setPointerCapture(e.pointerId); move(e); });
  joy.addEventListener('pointermove', move);
  joy.addEventListener('pointerup', () => { active = false; stick.style.left = '35px'; stick.style.top = '35px'; world.joy = null; });
}

// ================= EVENTOS GLOBAIS =================
addEventListener('keydown', e => {
  if (e.code === 'Space') {
    if (!$('dialog').classList.contains('hidden') && !$('game').classList.contains('hidden')) {
      e.preventDefault(); $('btnNext').click();
    }
  }
  if (e.code === 'KeyM') {
    if ($('flow').classList.contains('hidden')) showFlow(true);
    else $('flow').classList.add('hidden');
  }
});

$('btnStart').onclick = () => { sfx.click(); AC = AC || new (window.AudioContext || window.webkitAudioContext)(); startGame(false); };
$('btnContinue').onclick = () => {
  if (load()) { toast('💾 Save carregado!'); startGame(true); }
  else toast('⚠️ Nenhum save encontrado. Comece uma nova história!');
};
$('btnFlow0').onclick = () => { if (S.historico.length) showFlow(true); else toast('🔀 Jogue ao menos uma cena para gerar o fluxograma!'); };
$('btnFlow').onclick = () => showFlow(true);
$('btnCloseFlow').onclick = () => { $('flow').classList.add('hidden'); if (flowCb) { const c = flowCb; flowCb = null; c(); } };
$('btnQuit').onclick = () => { save(); location.reload(); };
$('btnMute').onclick = e => { muted = !muted; e.target.textContent = muted ? '🔇' : '🔊'; };
$('btnAgain').onclick = () => { S = freshState(); save(); $('ending').classList.add('hidden'); $('game').classList.remove('hidden'); runScene(0); };
$('btnTitle2').onclick = () => location.reload();

initTitle3D();
updateBars();

// Hook de debug/teste (não afeta o jogo): permite teleporte até o objetivo
window.__eco = {
  state: () => S,
  teleport: () => {
    if (!world || !cenaAtual) return false;
    const L = world.LOCS[world.locName];
    world.playerPos.set(L.obj[0], 0, L.obj[2]);
    return true;
  },
};
