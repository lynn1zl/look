/* 외관표 니니닝! */
(() => {
'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- 아이콘 ---------- */
const BUNNY = '<ellipse cx="8.4" cy="7.2" rx="2.4" ry="5.6" transform="rotate(-12 8.4 7.2)"/><ellipse cx="15.6" cy="7.2" rx="2.4" ry="5.6" transform="rotate(12 15.6 7.2)"/><ellipse cx="12" cy="15.4" rx="7" ry="6.3"/>';
const BRAND = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${BUNNY}<circle cx="9.4" cy="14.8" r="1" fill="#3182f6"/><circle cx="14.6" cy="14.8" r="1" fill="#3182f6"/></svg>`;
const st = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  copy: st('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 5.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5"/>'),
  download: st('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14"/>'),
  swap: st('<path d="M7 7h12m0 0-3.5-3.5M19 7l-3.5 3.5M17 17H5m0 0 3.5 3.5M5 17l3.5-3.5"/>'),
  palette: st('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.9 1.8-1.8 0-1.2-1-1.6-1-2.7 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.1" fill="currentColor"/><circle cx="10" cy="7" r="1.1" fill="currentColor"/><circle cx="15" cy="7.2" r="1.1" fill="currentColor"/>'),
  more: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18.5" cy="12" r="1.8"/></svg>',
  person: st('<circle cx="12" cy="5.5" r="2.5"/><path d="M8.5 21v-6.5L7 13.5V10a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 17 10v3.5l-1.5 1V21M12 15v6"/>'),
  face: st('<circle cx="12" cy="12" r="8.5"/><path d="M9 10v.5M15 10v.5M9 15c1.6 1.4 4.4 1.4 6 0"/>'),
  replace: st('<path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5"/>'),
  fit: st('<path d="M4 9V6a2 2 0 0 1 2-2h3M15 4h3a2 2 0 0 1 2 2v3M20 15v3a2 2 0 0 1-2 2h-3M9 20H6a2 2 0 0 1-2-2v-3"/><rect x="8.5" y="8.5" width="7" height="7" rx="1.5"/>'),
  plus: st('<path d="M12 5v14M5 12h14"/>'),
  minus: st('<path d="M5 12h14"/>'),
  trash: st('<path d="M4.5 7h15M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4.5h6V7"/>'),
  dropper: st('<path d="m14.5 6.5 3 3M4 20l1-4 9-9 3 3-9 9-4 1Z"/><path d="m13 5 2-2a2.1 2.1 0 0 1 3 0l3 3a2.1 2.1 0 0 1 0 3l-2 2"/>'),
  heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.6 3.9 4 7.4 4c2 0 3.5 1.1 4.6 2.6C13.1 5.1 14.6 4 16.6 4c3.5 0 5.8 3.6 4.6 7.1-1.7 4.8-9.2 9.4-9.2 9.4Z"/></svg>',
};

/* ---------- 상태 ---------- */
const ACCENTS = ['#3182f6', '#03b26c', '#ff8a3d', '#f04452', '#a234c7', '#191f28'];
const blankImg = () => ({ src: '', x: 50, y: 50, z: 1, fit: 'cover' });
const blankChar = (i) => ({
  tag: i ? 'B' : 'A', name: '', gender: '', age: '', height: '',
  hairLabel: '머리색', eyeLabel: '눈색',
  hair: i ? '#E8D3B0' : '#2B2D33', eye: i ? '#4C7CC9' : '#8A5A3B',
  features: '',
  ok: '', ng: '',
  body: blankImg(), face: blankImg(), face2: blankImg(),
});
const blankState = () => ({
  v: 1, mode: 2, theme: 'white', accent: '#3182f6', scale: 2,
  pair: { name: '', rel: '', ab: '', ba: '', source: '' },
  chars: [blankChar(0), blankChar(1)],
});
let S = blankState();

/* ---------- 저장 (IndexedDB) ---------- */
const DB_NAME = 'oegwan-ninining', STORE = 'kv';
function idb() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function dbGet(k) {
  const db = await idb();
  return new Promise((res, rej) => {
    const q = db.transaction(STORE).objectStore(STORE).get(k);
    q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error);
  });
}
async function dbSet(k, v) {
  const db = await idb();
  return new Promise((res, rej) => {
    const t = db.transaction(STORE, 'readwrite');
    t.objectStore(STORE).put(v, k);
    t.oncomplete = () => res(); t.onerror = () => rej(t.error);
  });
}
let saveTimer = 0;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { dbSet('state', S).catch(() => {}); }, 350);
}
function normalize(d) {
  const b = blankState();
  if (!d || typeof d !== 'object') return b;
  const out = { ...b, ...d, pair: { ...b.pair, ...(d.pair || {}) } };
  out.chars = [0, 1].map(i => {
    const c = (d.chars && d.chars[i]) || {};
    return { ...b.chars[i], ...c, body: { ...blankImg(), ...(c.body || {}) }, face: { ...blankImg(), ...(c.face || {}) }, face2: { ...blankImg(), ...(c.face2 || {}) } };
  });
  return out;
}

/* ---------- 외관표 만들기 ---------- */
const sheet = $('#sheet');

const SLOT_LABEL = { body: '전신 이미지', face: '두상', face2: '두상 2' };
function slotHTML(c, kind) {
  const isBody = kind === 'body';
  return `<div class="slot slot-${isBody ? 'body' : 'face'}" data-c="${c}" data-img="${kind}" tabindex="0" role="button" aria-label="${SLOT_LABEL[kind]}">
    <img alt="" hidden>
    <div class="slot-empty">${isBody ? ICON.person : ICON.face}<span>${SLOT_LABEL[kind]}</span><small>끌어다 놓기 · 클릭<br>붙여넣기</small></div>
    <div class="slot-tools">
      <button type="button" data-tool="replace" title="이미지 바꾸기" aria-label="이미지 바꾸기">${ICON.replace}</button>
      <button type="button" data-tool="out" title="축소" aria-label="축소">${ICON.minus}</button>
      <button type="button" data-tool="in" title="확대" aria-label="확대">${ICON.plus}</button>
      <button type="button" data-tool="fit" title="맞춤 (전체 보기)" aria-label="맞춤">${ICON.fit}</button>
      <button type="button" data-tool="del" title="이미지 지우기" aria-label="이미지 지우기">${ICON.trash}</button>
    </div>
  </div>`;
}
const ce = (attrs, ph, cls = '', multi = false) =>
  `<div class="ce ${cls}" ${attrs} data-ph="${ph}" contenteditable="plaintext-only" spellcheck="false" ${multi ? 'data-multi' : ''}></div>`;

function colorHTML(c, key) {
  return `<div class="color-row" data-c="${c}" data-color="${key}">
    <button type="button" class="swatch" data-swatch title="컬러판에서 고르기" aria-label="색 고르기"></button>
    <div class="color-txt">
      ${ce(`data-c="${c}" data-f="${key}Label"`, key === 'hair' ? '머리색' : '눈색', 'k')}
      ${ce(`data-c="${c}" data-hex="${key}"`, '#000000', 'hex')}
    </div>
    ${'EyeDropper' in window ? `<button type="button" class="dropper" data-dropper title="화면에서 색 뽑기" aria-label="스포이트">${ICON.dropper}</button>` : ''}
  </div>`;
}

function charHTML(c) {
  const meta = (f, k, ph) => `<div class="meta-item"><span class="k">${k}</span>${ce(`data-c="${c}" data-f="${f}"`, ph, 'v')}</div>`;
  return `<section class="char${c ? ' mirror' : ''}" data-c="${c}">
    <header class="id">
      ${ce(`data-c="${c}" data-f="tag"`, c ? 'B' : 'A', 'badge')}
      <div class="id-txt">
        ${ce(`data-c="${c}" data-f="name"`, '이름', 'name')}
        <div class="meta">
          ${meta('gender', '성별', '—')}
          ${meta('age', '나이', '—')}
          ${meta('height', '키', '—')}
        </div>
      </div>
    </header>
    <div class="pics">
      ${slotHTML(c, 'body')}
      <div class="faces">${slotHTML(c, 'face')}${slotHTML(c, 'face2')}</div>
    </div>
    <div class="block">
      <div class="block-title">컬러</div>
      <div class="colors">${colorHTML(c, 'hair')}${colorHTML(c, 'eye')}</div>
    </div>
    <div class="block okng">
      <div class="okng-row ok"><span class="okng-k">OK</span>${ce(`data-c="${c}" data-f="ok"`, '캐릭터로 가능한 것 한 줄', 'okng-v')}</div>
      <div class="okng-row ng"><span class="okng-k">NG</span>${ce(`data-c="${c}" data-f="ng"`, '캐릭터로 안 되는 것 한 줄', 'okng-v')}</div>
    </div>
    <div class="block feat">
      <div class="block-title">주요 특징</div>
      ${ce(`data-c="${c}" data-f="features"`, '예) 왼쪽 눈 밑 점 · 늘 헤드폰을 걸고 다님 · 은색 반지', 'feat-text', true)}
    </div>
  </section>`;
}

const ARROW = '<svg class="arrow" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true"><path d="M2 7h186" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M184 1 198 7l-14 6z" fill="currentColor"/></svg>';
function buildSheet() {
  sheet.innerHTML = `
    ${charHTML(0)}
    <section class="center">
      <div class="pair-top">
        <div class="eyebrow">PAIR</div>
        ${ce('data-p="name"', '페어명', 'pair-name', true)}
        ${ce('data-p="rel"', '#페어 특징 #마음껏', 'pair-tags', true)}
      </div>
      <div class="rels">
        <div class="rel-line">
          <div class="rel-who" data-who="ab"></div>
          ${ce('data-p="ab"', '서로를 어떻게 생각하는지', 'rel-text', true)}
          ${ARROW}
        </div>
        <div class="rel-line back">
          <div class="rel-who" data-who="ba"></div>
          ${ce('data-p="ba"', '서로를 어떻게 생각하는지', 'rel-text', true)}
          ${ARROW}
        </div>
      </div>
    </section>
    ${charHTML(1)}
    <footer class="sheet-foot">${ce('data-p="source"', '@커미션 출처 (없으면 비워 두세요)', 'source')}</footer>`;
  // plaintext-only 를 지원하지 않는 브라우저
  const probe = document.createElement('div');
  probe.contentEditable = 'plaintext-only';
  if (probe.contentEditable !== 'plaintext-only') $$('.ce', sheet).forEach(el => el.contentEditable = 'true');
}
function paintWho() {
  const a = S.chars[0].name || 'A', b = S.chars[1].name || 'B';
  $('[data-who="ab"]', sheet).textContent = `${a} → ${b}`;
  $('[data-who="ba"]', sheet).textContent = `${b} → ${a}`;
}

/* ---------- 상태 → 화면 ---------- */
function setText(el, v) { if (document.activeElement !== el) el.textContent = v || ''; }
function fieldValue(el) {
  if (el.dataset.p) return S.pair[el.dataset.p];
  const c = S.chars[+el.dataset.c];
  if (el.dataset.hex) return c[el.dataset.hex];
  return c[el.dataset.f];
}
function paintImg(slot) {
  const im = S.chars[+slot.dataset.c][slot.dataset.img];
  const img = $('img', slot);
  slot.classList.toggle('has', !!im.src);
  slot.classList.toggle('fit-contain', im.fit === 'contain');
  $('[data-tool="fit"]', slot).setAttribute('aria-pressed', im.fit === 'contain');
  if (!im.src) { img.hidden = true; img.removeAttribute('src'); return; }
  if (img.getAttribute('src') !== im.src) img.src = im.src;
  img.hidden = false;
  img.style.objectPosition = `${im.x}% ${im.y}%`;
  img.style.transformOrigin = `${im.x}% ${im.y}%`;
  img.style.transform = im.z !== 1 ? `scale(${im.z})` : '';
}
function paintColors() {
  $$('.color-row', sheet).forEach(row => {
    const c = S.chars[+row.dataset.c];
    $('.swatch', row).style.setProperty('--c', c[row.dataset.color]);
  });
  $$('.char', sheet).forEach(el => el.style.setProperty('--key', S.chars[+el.dataset.c].hair));
}
function paintAll() {
  $$('.ce', sheet).forEach(el => setText(el, fieldValue(el)));
  $$('.slot', sheet).forEach(paintImg);
  paintColors();
  paintWho();
  paintLook();
}
function paintLook() {
  sheet.className = `sheet theme-${S.theme} mode-${S.mode}${compact ? ' compact' : ''}`;
  sheet.style.setProperty('--s-accent', S.accent);
  setSeg($('#mode-seg'), 'mode', S.mode);
  setSeg($('#scale-seg'), 'scale', S.scale);
  $$('#theme-list button').forEach(b => b.setAttribute('aria-pressed', b.dataset.theme === S.theme));
  $$('#accent-list .accent-dot').forEach(b => b.setAttribute('aria-pressed', b.dataset.accent ? b.dataset.accent === S.accent : !ACCENTS.includes(S.accent)));
  const custom = $('#accent-list .custom');
  if (custom) custom.style.setProperty('--c', ACCENTS.includes(S.accent) ? 'transparent' : S.accent);
  $('#btn-swap').hidden = S.mode !== 2;
  requestAnimationFrame(fitStage);
}
function setSeg(seg, key, val) {
  const btns = $$('button', seg);
  btns.forEach(b => b.setAttribute('aria-checked', String(b.dataset[key]) === String(val)));
  const on = btns.find(b => String(b.dataset[key]) === String(val));
  const thumb = $('.seg-thumb', seg);
  if (on && on.offsetWidth) {
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.transform = `translateX(${on.offsetLeft - 3}px)`;
  }
}

/* ---------- 글자 입력 ---------- */
sheet.addEventListener('input', e => {
  const el = e.target.closest('.ce');
  if (!el) return;
  let v = el.innerText.replace(/ /g, ' ');
  if (!el.hasAttribute('data-multi')) v = v.replace(/\n/g, ' ');
  if (!v.trim()) { v = ''; if (el.innerHTML) el.innerHTML = ''; }
  else v = v.replace(/\n$/, '');
  if (el.dataset.p) S.pair[el.dataset.p] = v;
  else if (el.dataset.hex) return; // 컬러코드는 입력을 마칠 때 반영
  else S.chars[+el.dataset.c][el.dataset.f] = v;
  if (el.dataset.f === 'name') paintWho();
  save();
});
sheet.addEventListener('keydown', e => {
  const el = e.target.closest('.ce');
  if (!el) return;
  if (e.key === 'Enter' && !e.isComposing && (!el.hasAttribute('data-multi') || e.metaKey || e.ctrlKey)) {
    e.preventDefault(); el.blur();
  }
  if (e.key === 'Escape') el.blur();
});
sheet.addEventListener('paste', e => {
  const el = e.target.closest('.ce');
  if (!el) return;
  const hasImg = [...(e.clipboardData?.items || [])].some(i => i.type.startsWith('image/'));
  if (hasImg) return; // 이미지 붙여넣기는 아래에서 처리
  if (el.contentEditable === 'true') {
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  }
});
sheet.addEventListener('focusout', e => {
  const el = e.target.closest('.ce');
  if (!el) return;
  if (el.dataset.hex) {
    const c = +el.dataset.c, key = el.dataset.hex;
    const hex = parseColor(el.innerText);
    if (hex) { S.chars[c][key] = hex; paintColors(); save(); }
    else if (el.innerText.trim()) toast('컬러코드는 #RRGGBB 형식으로 입력해 주세요');
    el.textContent = S.chars[c][key];
    return;
  }
  if (!el.textContent.trim()) el.innerHTML = '';
});

function parseColor(str) {
  let s = String(str || '').trim();
  if (!s) return null;
  if (/^#?[0-9a-f]{3}$/i.test(s)) { s = s.replace('#', ''); return ('#' + s.split('').map(ch => ch + ch).join('')).toUpperCase(); }
  if (/^#?[0-9a-f]{6}$/i.test(s)) return ('#' + s.replace('#', '')).toUpperCase();
  // rgb(…), 색 이름 등
  const probe = document.createElement('span');
  probe.style.color = s;
  if (!probe.style.color) return null;
  document.body.appendChild(probe);
  const m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
  probe.remove();
  if (!m) return null;
  return '#' + m.slice(0, 3).map(n => Math.round(+n).toString(16).padStart(2, '0')).join('').toUpperCase();
}

/* ---------- 색 고르기 ---------- */
const colorInput = $('#color-input');
let colorTarget = null;
sheet.addEventListener('click', async e => {
  const sw = e.target.closest('[data-swatch]');
  if (sw) {
    const row = sw.closest('.color-row');
    colorTarget = { c: +row.dataset.c, key: row.dataset.color };
    colorInput.value = S.chars[colorTarget.c][colorTarget.key].toLowerCase();
    const r = sw.getBoundingClientRect();
    colorInput.style.left = r.left + 'px'; colorInput.style.top = r.bottom + 'px';
    colorInput.click();
    return;
  }
  const dp = e.target.closest('[data-dropper]');
  if (dp) {
    const row = dp.closest('.color-row');
    try {
      const { sRGBHex } = await new window.EyeDropper().open();
      const hex = parseColor(sRGBHex);
      if (hex) { S.chars[+row.dataset.c][row.dataset.color] = hex; paintColors(); paintAll(); save(); }
    } catch { /* 취소 */ }
  }
});
colorInput.addEventListener('input', () => {
  if (colorTarget?.accent) { S.accent = colorInput.value.toUpperCase(); paintLook(); save(); return; }
  if (!colorTarget) return;
  S.chars[colorTarget.c][colorTarget.key] = colorInput.value.toUpperCase();
  paintColors();
  const hexEl = $(`.ce[data-c="${colorTarget.c}"][data-hex="${colorTarget.key}"]`, sheet);
  hexEl.textContent = S.chars[colorTarget.c][colorTarget.key];
  save();
});

/* ---------- 이미지 ---------- */
const fileImg = $('#file-img');
let pickTarget = null;
let hoverSlot = null;
let activeSlot = null;
const MAX_SIDE = 2400;

function readFile(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result); r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });
}
function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im); im.onerror = rej;
    im.src = src;
  });
}
async function fileToSrc(file) {
  const url = await readFile(file);
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return url;
  const im = await loadImage(url);
  const long = Math.max(im.naturalWidth, im.naturalHeight);
  if (long <= MAX_SIDE && file.size < 3.5e6) return url;
  const k = Math.min(1, MAX_SIDE / long);
  const cv = document.createElement('canvas');
  cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k);
  cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
  const png = file.type === 'image/png' || file.type === 'image/webp';
  return cv.toDataURL(png ? 'image/png' : 'image/jpeg', .92);
}
async function putImage(slot, file) {
  if (!file || !file.type.startsWith('image/')) { toast('이미지 파일만 넣을 수 있어요'); return; }
  try {
    const src = await fileToSrc(file);
    const im = S.chars[+slot.dataset.c][slot.dataset.img];
    Object.assign(im, blankImg(), { src });
    paintImg(slot); save();
  } catch { toast('이미지를 읽지 못했어요'); }
}
async function putImageFromUrl(slot, url) {
  try {
    const r = await fetch(url, { mode: 'cors' });
    if (!r.ok) throw 0;
    const b = await r.blob();
    await putImage(slot, new File([b], 'image', { type: b.type || 'image/png' }));
  } catch {
    toast('이 이미지는 바로 가져올 수 없어요. 저장한 뒤 파일로 넣어 주세요');
  }
}
function firstEmptySlot() {
  const visible = $$('.slot', sheet).filter(s => S.mode === 2 || s.dataset.c === '0');
  return visible.find(s => !S.chars[+s.dataset.c][s.dataset.img].src) || null;
}
function setActive(slot) {
  if (activeSlot && activeSlot !== slot) activeSlot.classList.remove('active');
  activeSlot = slot;
  if (slot) slot.classList.add('active');
}

sheet.addEventListener('click', e => {
  const tool = e.target.closest('[data-tool]');
  const slot = e.target.closest('.slot');
  if (!slot) return;
  const im = S.chars[+slot.dataset.c][slot.dataset.img];
  if (tool) {
    e.stopPropagation();
    const t = tool.dataset.tool;
    if (t === 'replace') { pickTarget = slot; fileImg.click(); }
    if (t === 'del') { Object.assign(im, blankImg()); paintImg(slot); save(); }
    if (t === 'fit') { im.fit = im.fit === 'contain' ? 'cover' : 'contain'; paintImg(slot); save(); }
    if (t === 'in' || t === 'out') { im.z = clamp(+(im.z * (t === 'in' ? 1.15 : 1 / 1.15)).toFixed(3), 1, 5); paintImg(slot); save(); }
    return;
  }
  if (slot.dataset.moved) { delete slot.dataset.moved; return; }
  if (!im.src) { pickTarget = slot; fileImg.click(); }
  else setActive(slot);
});
sheet.addEventListener('keydown', e => {
  const slot = e.target.classList?.contains('slot') ? e.target : null;
  if (!slot) return;
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickTarget = slot; fileImg.click(); }
  if ((e.key === 'Delete' || e.key === 'Backspace')) {
    Object.assign(S.chars[+slot.dataset.c][slot.dataset.img], blankImg()); paintImg(slot); save();
  }
});
fileImg.addEventListener('change', () => {
  const f = fileImg.files[0];
  if (f && pickTarget) putImage(pickTarget, f);
  fileImg.value = '';
});
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.slot')) setActive(null);
});

// 끌어서 위치 옮기기
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
sheet.addEventListener('pointerdown', e => {
  const slot = e.target.closest('.slot.has');
  if (!slot || e.target.closest('.slot-tools') || e.button !== 0) return;
  const im = S.chars[+slot.dataset.c][slot.dataset.img];
  if (im.fit === 'contain') return;
  const img = $('img', slot);
  const rect = slot.getBoundingClientRect();
  const scale = rect.width / slot.offsetWidth; // 화면 확대율
  // 칸 밖으로 넘치는 크기(px) 계산
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const sw = slot.offsetWidth, sh = slot.offsetHeight;
  const cover = Math.max(sw / nw, sh / nh);
  const ox = Math.max(1, nw * cover * im.z - sw), oy = Math.max(1, nh * cover * im.z - sh);
  const sx = e.clientX, sy = e.clientY, x0 = im.x, y0 = im.y;
  let moved = false;
  slot.setPointerCapture(e.pointerId);
  const move = ev => {
    const dx = (ev.clientX - sx) / scale, dy = (ev.clientY - sy) / scale;
    if (!moved && Math.hypot(dx, dy) < 4) return;
    moved = true;
    slot.classList.add('panning');
    im.x = clamp(x0 - dx / ox * 100, 0, 100);
    im.y = clamp(y0 - dy / oy * 100, 0, 100);
    paintImg(slot);
  };
  const up = () => {
    slot.removeEventListener('pointermove', move);
    slot.removeEventListener('pointerup', up);
    slot.removeEventListener('pointercancel', up);
    slot.classList.remove('panning');
    if (moved) { slot.dataset.moved = '1'; save(); setActive(slot); }
  };
  slot.addEventListener('pointermove', move);
  slot.addEventListener('pointerup', up);
  slot.addEventListener('pointercancel', up);
});
sheet.addEventListener('wheel', e => {
  const slot = e.target.closest('.slot.has');
  if (!slot || !(slot === activeSlot || e.ctrlKey || e.altKey)) return;
  const im = S.chars[+slot.dataset.c][slot.dataset.img];
  if (im.fit === 'contain') return;
  e.preventDefault();
  im.z = clamp(+(im.z * Math.exp(-e.deltaY * 0.0015)).toFixed(3), 1, 5);
  paintImg(slot); save();
}, { passive: false });

// 끌어다 놓기
sheet.addEventListener('pointerover', e => { hoverSlot = e.target.closest('.slot') || null; });
sheet.addEventListener('pointerleave', () => { hoverSlot = null; });
document.addEventListener('dragover', e => {
  if (![...e.dataTransfer.types].some(t => t === 'Files' || t === 'text/uri-list')) return;
  e.preventDefault();
  const slot = e.target.closest?.('.slot');
  $$('.slot.drag-over', sheet).forEach(s => s !== slot && s.classList.remove('drag-over'));
  if (slot) slot.classList.add('drag-over');
  e.dataTransfer.dropEffect = 'copy';
});
document.addEventListener('dragleave', e => {
  if (!e.relatedTarget || !e.relatedTarget.closest?.('.slot')) $$('.slot.drag-over', sheet).forEach(s => s.classList.remove('drag-over'));
});
document.addEventListener('drop', e => {
  e.preventDefault();
  $$('.slot.drag-over', sheet).forEach(s => s.classList.remove('drag-over'));
  let slot = e.target.closest?.('.slot') || firstEmptySlot();
  const files = [...e.dataTransfer.files].filter(f => f.type.startsWith('image/'));
  if (files.length) {
    if (!slot) { toast('이미지를 넣을 칸 위에 놓아 주세요'); return; }
    putImage(slot, files[0]);
    // 여러 장이면 나머지는 빈 칸에 차례로
    (async () => {
      for (const f of files.slice(1)) {
        await new Promise(r => setTimeout(r, 30));
        const next = firstEmptySlot();
        if (!next) break;
        await putImage(next, f);
      }
    })();
    return;
  }
  const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
  if (url && /^https?:|^data:image/.test(url.trim()) && slot) putImageFromUrl(slot, url.trim().split('\n')[0]);
});

// 붙여넣기
document.addEventListener('paste', e => {
  const items = [...(e.clipboardData?.items || [])];
  const it = items.find(i => i.type.startsWith('image/'));
  if (!it) return;
  e.preventDefault();
  const slot = hoverSlot || activeSlot || firstEmptySlot();
  if (!slot) { toast('붙여넣을 칸 위에 마우스를 올려 주세요'); return; }
  putImage(slot, it.getAsFile());
});

/* ---------- 상단 컨트롤 ---------- */
$('.brand-mark').innerHTML = BRAND;
$('#btn-swap').innerHTML = ICON.swap;
$('#btn-design').innerHTML = ICON.palette;
$('#btn-more').innerHTML = ICON.more;
$$('[data-icon]').forEach(el => el.innerHTML = ICON[el.dataset.icon] || '');
$('[data-zoom="in"]').innerHTML = ICON.plus;
$('[data-zoom="out"]').innerHTML = ICON.minus;

$('#accent-list').innerHTML = ACCENTS.map(c => `<button type="button" class="accent-dot" data-accent="${c}" style="--c:${c}" aria-label="포인트 색 ${c}"></button>`).join('')
  + '<button type="button" class="accent-dot custom" data-accent-custom aria-label="직접 고르기"></button>';

$('#mode-seg').addEventListener('click', e => {
  const b = e.target.closest('[data-mode]'); if (!b) return;
  S.mode = +b.dataset.mode; paintLook(); save();
});
$('#scale-seg').addEventListener('click', e => {
  const b = e.target.closest('[data-scale]'); if (!b) return;
  S.scale = +b.dataset.scale; paintLook(); save();
});
$('#theme-list').addEventListener('click', e => {
  const b = e.target.closest('[data-theme]'); if (!b) return;
  S.theme = b.dataset.theme; paintLook(); save();
});
$('#accent-list').addEventListener('click', e => {
  const b = e.target.closest('.accent-dot'); if (!b) return;
  if (b.dataset.accent) { S.accent = b.dataset.accent; paintLook(); save(); return; }
  colorTarget = { accent: true };
  colorInput.value = S.accent.toLowerCase();
  const r = b.getBoundingClientRect();
  colorInput.style.left = r.left + 'px'; colorInput.style.top = r.bottom + 'px';
  colorInput.click();
});
$('#btn-swap').addEventListener('click', () => {
  const tags = S.chars.map(c => c.tag);
  S.chars.reverse();
  S.chars.forEach((c, i) => { c.tag = tags[i]; });
  paintAll(); save(); toast('좌우 캐릭터를 바꿨어요');
});

// 팝오버
function closePops(except) {
  $$('.pop').forEach(p => { if (p !== except) { p.hidden = true; } });
  $$('[aria-haspopup]').forEach(b => { if (!except || b.nextElementSibling !== except) b.setAttribute('aria-expanded', 'false'); });
}
$$('[aria-haspopup]').forEach(btn => btn.addEventListener('click', e => {
  e.stopPropagation();
  const pop = btn.nextElementSibling;
  const open = pop.hidden;
  closePops(pop);
  pop.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  if (open) setSeg($('#scale-seg'), 'scale', S.scale);
}));
document.addEventListener('click', e => { if (!e.target.closest('.pop')) closePops(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePops(); $$('.modal').forEach(m => m.hidden = true); }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveImage(); }
});

$('#pop-more').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  closePops();
  const act = b.dataset.act;
  if (act === 'help') $('#modal-help').hidden = false;
  if (act === 'reset') $('#modal-reset').hidden = false;
  if (act === 'export') exportJSON();
});
$$('.modal').forEach(m => m.addEventListener('click', e => {
  if (e.target === m || e.target.closest('[data-close]')) m.hidden = true;
}));
$('#modal-reset').addEventListener('click', e => {
  const b = e.target.closest('[data-reset]'); if (!b) return;
  const r = b.dataset.reset;
  if (r === 'all') {
    const keep = { mode: S.mode, theme: S.theme, accent: S.accent, scale: S.scale };
    S = { ...blankState(), ...keep };
  } else S.chars[+r] = blankChar(+r);
  paintAll(); save();
  $('#modal-reset').hidden = true;
  toast('초기화했어요');
});

// 작업 파일
function exportJSON() {
  const blob = new Blob([JSON.stringify({ app: 'oegwan-ninining', ...S })], { type: 'application/json' });
  download(blob, `${fileBase()}.oegwan.json`);
}
$('#file-import').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  closePops();
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!d || !Array.isArray(d.chars)) throw 0;
    S = normalize(d); paintAll(); save(); toast('작업을 불러왔어요');
  } catch { toast('외관표 니니닝! 작업 파일이 아니에요'); }
});

/* ---------- 화면 맞춤 · 확대 ---------- */
const stage = $('#stage'), stageInner = $('#stage-inner'), scaler = $('#scaler');
let zoom = 'fit';
let compact = false;
const COMPACT_MAX = 760;
function setCompact(on) {
  compact = on;
  sheet.classList.toggle('compact', on);
  $('.char[data-c="1"]', sheet).classList.toggle('mirror', !on);
  document.body.classList.toggle('is-compact', on);
}
function fitStage() {
  const avail = stage.clientWidth - parseFloat(getComputedStyle(stage).paddingLeft) * 2;
  const wantCompact = !rendering && window.innerWidth <= COMPACT_MAX;
  if (wantCompact !== compact) setCompact(wantCompact);
  if (compact) {
    sheet.style.width = avail + 'px';
    scaler.style.transform = '';
    stageInner.style.width = avail + 'px';
    stageInner.style.height = sheet.offsetHeight + 'px';
    stage.style.alignItems = 'center';
    return;
  }
  sheet.style.width = '';
  const w = sheet.offsetWidth, h = sheet.offsetHeight;
  const fit = Math.min(1, avail / w);
  const k = zoom === 'fit' ? fit : zoom;
  scaler.style.transform = `scale(${k})`;
  stageInner.style.width = w * k + 'px';
  stageInner.style.height = h * k + 'px';
  $('#zoom-val').textContent = Math.round(k * 100) + '%';
  $('#zoom-val').title = zoom === 'fit' ? '화면에 맞춤' : '화면에 맞추기';
  stage.style.alignItems = w * k > avail ? 'flex-start' : 'center';
}
$('#zoom').addEventListener('click', e => {
  const b = e.target.closest('[data-zoom]'); if (!b) return;
  const cur = parseFloat($('#zoom-val').textContent) / 100;
  const steps = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5];
  if (b.dataset.zoom === 'fit') zoom = 'fit';
  if (b.dataset.zoom === 'in') zoom = steps.find(s => s > cur + .005) || 1.5;
  if (b.dataset.zoom === 'out') zoom = [...steps].reverse().find(s => s < cur - .005) || .25;
  fitStage();
});
new ResizeObserver(() => fitStage()).observe(stage);
new ResizeObserver(() => fitStage()).observe(sheet);

/* ---------- 이미지로 저장 · 복사 ---------- */
let fontCSS = null;
let rendering = false;
async function getFontCSS() {
  if (fontCSS !== null) return fontCSS;
  try { fontCSS = await htmlToImage.getFontEmbedCSS(sheet); }
  catch { fontCSS = ''; }
  return fontCSS;
}
const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
async function renderBlob() {
  if (document.activeElement && sheet.contains(document.activeElement)) document.activeElement.blur();
  setActive(null);
  rendering = true;
  stageInner.classList.add('rendering');
  if (compact) { setCompact(false); sheet.style.width = ''; }
  sheet.classList.add('exporting');
  // 빈 정보는 빠지므로, 처음 보이는 항목 앞의 구분선을 없앰
  $$('.meta', sheet).forEach(m => {
    const first = $$('.meta-item', m).find(it => $('.v', it).textContent.trim());
    if (first) first.classList.add('lead');
  });
  try {
    await document.fonts.ready;
    const bg = getComputedStyle(sheet).backgroundColor;
    const opts = {
      pixelRatio: S.scale,
      width: sheet.offsetWidth, height: sheet.offsetHeight,
      backgroundColor: bg,
      fontEmbedCSS: await getFontCSS(),
      filter: n => !(n.classList && (n.classList.contains('slot-tools') || n.classList.contains('dropper'))) && !(n.tagName === 'IMG' && !n.getAttribute('src')),
    };
    if (isSafari) await htmlToImage.toBlob(sheet, opts); // Safari 첫 렌더에서 이미지가 빠지는 문제 방지
    return await htmlToImage.toBlob(sheet, opts);
  } finally {
    sheet.classList.remove('exporting');
    $$('.meta-item.lead', sheet).forEach(it => it.classList.remove('lead'));
    rendering = false;
    fitStage();
    stageInner.classList.remove('rendering');
  }
}
function fileBase() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const title = (S.mode === 2 ? (S.pair.name || [S.chars[0].name, S.chars[1].name].filter(Boolean).join('x')) : S.chars[0].name) || '외관표';
  return `[외관닝]${title.replace(/[\\/:*?"<>|\n]+/g, ' ').trim().slice(0, 40)}_${date}`;
}
function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
async function busy(btn, fn) {
  btn.disabled = true;
  try { await fn(); } finally { btn.disabled = false; }
}
async function saveImage() {
  await busy($('#btn-save'), async () => {
    try {
      const blob = await renderBlob();
      const name = `${fileBase()}.png`;
      const file = new File([blob], name, { type: 'image/png' });
      const mobile = matchMedia('(hover: none) and (pointer: coarse)').matches;
      if (mobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file] }); return; } catch (err) { if (err.name === 'AbortError') return; }
      }
      download(blob, name);
      toast('이미지를 저장했어요');
    } catch (err) {
      console.error(err);
      toast('저장하지 못했어요. 다시 시도해 주세요');
    }
  });
}
async function copyImage() {
  await busy($('#btn-copy'), async () => {
    try {
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error('unsupported');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': renderBlob() })]);
      toast('클립보드에 복사했어요');
    } catch (err) {
      console.error(err);
      toast(err.message === 'unsupported' ? '이 브라우저는 이미지 복사를 지원하지 않아요. 저장을 이용해 주세요' : '복사하지 못했어요. 다시 시도해 주세요');
    }
  });
}
$('#btn-save').addEventListener('click', saveImage);
$('#btn-copy').addEventListener('click', copyImage);

/* ---------- 토스트 ---------- */
let toastTimer = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- 시작 ---------- */
buildSheet();
paintAll();
dbGet('state').then(d => { if (d) { S = normalize(d); paintAll(); } }).catch(() => {});
document.fonts.ready.then(() => { setSeg($('#mode-seg'), 'mode', S.mode); fitStage(); });
})();
