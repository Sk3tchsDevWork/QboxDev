const panel = document.getElementById('panel');
const closeBtn = document.getElementById('close');
const refreshBtn = document.getElementById('refresh');
const playersEl = document.getElementById('players');
const searchEl = document.getElementById('search');
const approvalsEl = document.getElementById('approvals');
const invView = document.getElementById('inventoryView');
const systemView = document.getElementById('systemView');
const txaBanner = document.getElementById('txaBanner');
const announceText = document.getElementById('announceText');
const countdownWrap = document.getElementById('countdownWrap');
const cdTime = document.getElementById('cdTime');

// Tabs
const tabs = document.querySelectorAll('.tabs button');
const tabPanels = { admin: document.getElementById('tab-admin'), heatmap: document.getElementById('tab-heatmap') };
tabs.forEach(btn => btn.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  Object.values(tabPanels).forEach(p => p.classList.add('hidden'));
  tabPanels[btn.dataset.tab].classList.remove('hidden');
}));

let players = [];
let selected = null;
let heatTimer = null;
let countdownEnd = 0;
let cdInterval = null;

function nuiFetch(name, data={}){
  return fetch(`https://aegis-admin/${name}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)}).then(r=>r.json());
}

window.addEventListener('message', (e) => {
  if (e.data.type === 'show') {
    panel.classList.remove('hidden');
    loadPlayers();
    loadApprovals();
    startHeatmap();
  } else if (e.data.type === 'hide') {
    panel.classList.add('hidden');
    stopHeatmap();
  } else if (e.data.type === 'txa_countdown') {
    // e.data.endEpoch, e.data.message
    startCountdown(e.data.endEpoch);
    txaBanner.textContent = e.data.message || '';
  } else if (e.data.type === 'txa_warning') {
    txaBanner.textContent = e.data.message || '';
  } else if (e.data.type === 'txa_announce') {
    txaBanner.textContent = `Announcement: ${e.data.message}`;
    setTimeout(()=> txaBanner.textContent = '', 10000);
  }
});

closeBtn.addEventListener('click', () => nuiFetch('close', {}));
refreshBtn.addEventListener('click', () => { loadPlayers(); loadApprovals(); });

function renderPlayers(){
  const q = (searchEl.value || '').toLowerCase();
  playersEl.innerHTML = '';
  players.filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q))
    .forEach(p => {
      const li = document.createElement('li');
      li.textContent = `[#${p.id}] ${p.name}`;
      if (selected && selected.id === p.id) li.classList.add('active');
      li.onclick = () => { selected = p; renderPlayers(); };
      playersEl.appendChild(li);
    });
}
searchEl.addEventListener('input', renderPlayers);

function loadPlayers(){
  nuiFetch('fetchPlayers',{}).then(list => { players = list || []; renderPlayers(); });
}

function loadApprovals(){
  nuiFetch('fetchApprovals',{}).then(list => {
    approvalsEl.innerHTML = '';
    (list||[]).forEach(a => {
      const li = document.createElement('li');
      const when = new Date(a.ts*1000).toLocaleTimeString();
      li.innerHTML = `<b>${a.capability}</b> — token <code>${a.token}</code> by #${a.requestedBy} @ ${when} <button data-token="${a.token}">Approve</button>`;
      li.querySelector('button').onclick = () => nuiFetch('approveAction', { token: a.token });
      approvalsEl.appendChild(li);
    });
  });
}

function doCap(cap, extra={}){
  if (!selected && cap !== 'system.stats' && cap !== 'system.restart.queue' && cap !== 'system.restart.cancel' && cap !== 'system.announce') return;
  nuiFetch('doAction', { capability: cap, target: selected ? selected.id : null, ...extra });
}

document.querySelectorAll('button[data-cap]').forEach(btn => {
  btn.addEventListener('click', () => {
    const cap = btn.getAttribute('data-cap');
    if (cap === 'inventory.give' || cap === 'inventory.take') {
      const item = document.getElementById('item').value.trim();
      const amount = Number(document.getElementById('amount').value || '1');
      doCap(cap, { item, amount });
    } else if (cap === 'jobs.set') {
      const job = document.getElementById('job').value.trim();
      const grade = Number(document.getElementById('grade').value || '0');
      doCap(cap, { job, grade });
    } else if (cap === 'moderation.kick' || cap === 'moderation.ban.request') {
      const reason = document.getElementById('reason').value.trim();
      doCap(cap, { reason });
    } else if (cap === 'economy.giveCash') {
      const cash = Number(document.getElementById('cash').value || '0');
      doCap(cap, { amount: cash });
    } else if (cap === 'economy.setBank') {
      const bank = Number(document.getElementById('bank').value || '0');
      doCap(cap, { amount: bank });
    } else if (cap === 'system.announce') {
      const message = (announceText.value || '').trim() || 'Server Announcement';
      doCap(cap, { message });
    } else if (cap === 'system.stats') {
      nuiFetch('doAction', { capability: cap }).then(()=>setTimeout(()=>{ systemView.textContent = 'Stats requested at ' + new Date().toLocaleTimeString(); },200));
    } else {
      doCap(cap);
    }
  });
});

// Heatmap rendering
const heatCanvas = document.getElementById('heatCanvas');
const ctx = heatCanvas.getContext('2d');
let cellSize = 100;

function startHeatmap(){
  if (heatTimer) return;
  pullHeat();
  heatTimer = setInterval(pullHeat, 5000);
}
function stopHeatmap(){
  if (!heatTimer) return;
  clearInterval(heatTimer);
  heatTimer = null;
}
function pullHeat(){
  nuiFetch('fetchHeatmap',{}).then(data => {
    if (!data) return;
    cellSize = data.cellSize || 100;
    drawHeat(data.cells || []);
  });
}

function drawHeat(cells){
  let maxI = 0;
  cells.forEach(c => { if (c.intensity > maxI) maxI = c.intensity; });
  ctx.clearRect(0,0,heatCanvas.width,heatCanvas.height);
  if (maxI <= 0) return;
  const scale = 12;
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  cells.forEach(c => { if (c.cx<minX)minX=c.cx; if (c.cy<minY)minY=c.cy; if (c.cx>maxX)maxX=c.cx; if (c.cy>maxY)maxY=c.cy; });
  const width = (maxX-minX+1)*scale;
  const height = (maxY-minY+1)*scale;
  const offsetX = (heatCanvas.width - width)/2;
  const offsetY = (heatCanvas.height - height)/2;

  cells.forEach(c => {
    const n = c.intensity / maxI;
    const r = Math.floor(255 * Math.max(0, (n-0.5) * 2));
    const g = Math.floor(255 * (n < 0.5 ? n*2 : 1-(n-0.5)*2));
    const b = Math.floor(255 * (1-n));
    ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
    const x = (c.cx - minX) * scale + offsetX;
    const y = (c.cy - minY) * scale + offsetY;
    ctx.fillRect(x, y, scale-1, scale-1);
  });
}

// Countdown widget
function startCountdown(endEpoch){
  countdownEnd = Math.max(0, endEpoch || 0);
  if (!countdownEnd) return stopCountdown();
  countdownWrap.classList.remove('hidden');
  if (cdInterval) clearInterval(cdInterval);
  updateCountdown();
  cdInterval = setInterval(updateCountdown, 1000);
}
function stopCountdown(){
  countdownEnd = 0;
  countdownWrap.classList.add('hidden');
  if (cdInterval) { clearInterval(cdInterval); cdInterval = null; }
  cdTime.textContent = '--:--';
}
function updateCountdown(){
  const now = Math.floor(Date.now()/1000);
  const remain = countdownEnd - now;
  if (remain <= 0){ stopCountdown(); return; }
  const h = Math.floor(remain/3600).toString().padStart(2,'0');
  const m = Math.floor((remain%3600)/60).toString().padStart(2,'0');
  const s = Math.floor(remain%60).toString().padStart(2,'0');
  cdTime.textContent = `${h}:${m}:${s}`;
}

// Command palette
const palette = document.getElementById('palette');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
document.getElementById('cmdk').addEventListener('click', openPalette);
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault(); openPalette();
  } else if (e.key === 'Escape') {
    closePalette();
  }
});
function openPalette(){
  palette.classList.remove('hidden');
  paletteInput.value = '';
  rebuildPalette();
  paletteInput.focus();
}
function closePalette(){ palette.classList.add('hidden'); }
const actions = [
  {label:'Freeze', cap:'players.freeze'},
  {label:'Unfreeze', cap:'players.unfreeze'},
  {label:'Heal', cap:'players.heal'},
  {label:'Revive', cap:'players.revive'},
  {label:'Bring', cap:'players.tp.bring'},
  {label:'Goto', cap:'players.tp.goto'},
  {label:'Spectate', cap:'players.spectate'},
  {label:'Follow', cap:'players.spectate.follow'},
  {label:'View Inventory', cap:'inventory.view'},
  {label:'Give Item', cap:'inventory.give'},
  {label:'Take Item', cap:'inventory.take'},
  {label:'Set Job', cap:'jobs.set'},
  {label:'Kick', cap:'moderation.kick'},
  {label:'Request Ban', cap:'moderation.ban.request'},
  {label:'Server Stats', cap:'system.stats'},
  {label:'Announce', cap:'system.announce'}
];
function rebuildPalette(){
  const q = (paletteInput.value||'').toLowerCase();
  const list = [];
  if (players && players.length){
    players.forEach(p => list.push({type:'player', label:`[#${p.id}] ${p.name}`, value:p.id}));
  }
  actions.forEach(a => list.push({type:'action', label:a.label, cap:a.cap}));
  const filtered = list.filter(x => x.label.toLowerCase().includes(q));
  paletteList.innerHTML = '';
  filtered.forEach((x)=>{
    const li = document.createElement('li');
    li.textContent = x.label + (x.type==='action' ? ' ⌘' : '');
    li.onclick = () => {
      if (x.type==='player'){ selected = { id:x.value, name:x.label }; renderPlayers(); closePalette(); }
      else { if (!selected && !['system.stats','system.announce'].includes(x.cap)) return; doCap(x.cap); closePalette(); }
    };
    paletteList.appendChild(li);
  });
}
paletteInput.addEventListener('input', rebuildPalette);
