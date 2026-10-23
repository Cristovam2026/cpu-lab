/* ══════════════════════════════════════════════
   CPU Lab — Application Logic (v2 — PROSUB)
   ══════════════════════════════════════════════ */

"use strict";

// ──────────────────────────────────────────────
// ESTADO GLOBAL E NAVEGAÇÃO
// ──────────────────────────────────────────────
const tabs = {
  overview: "Visão Geral da CPU",
  cycle:    "Ciclo de Instrução",
  simulator:"Simulador de CPU",
  pipeline: "Pipeline de Instrução",
  memory:   "Hierarquia de Memória",
  quiz:     "Quiz Final"
};

let completedActivities = new Set();
let visitedTabs = new Set(["overview"]);

// Navegação Lateral
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    const tab = item.dataset.tab;
    switchTab(tab);
  });
});

function switchTab(tab) {
  document.querySelectorAll(".nav-item").forEach(i => i.classList.toggle("active", i.dataset.tab === tab));
  document.querySelectorAll(".tab-content").forEach(s => s.classList.toggle("active", s.id === "tab-" + tab));
  document.getElementById("headerTitle").textContent = tabs[tab] || "";
  visitedTabs.add(tab);
  
  if (window.innerWidth <= 800) {
    document.getElementById("sidebar").classList.add("collapsed");
    document.getElementById("main").classList.remove("expanded");
  }

  // Inicializações específicas por aba
  if (tab === "pipeline") initPipelineViz();
  if (tab === "memory")   initCacheDemo();
  if (tab === "quiz")     initQuiz();
  if (tab === "simulator") initSim();
  if (tab === "overview") animateFacts();
  
  updateGlobalProgress();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
  document.getElementById("main").classList.toggle("expanded");
}

function updateGlobalProgress() {
  const total = 5; // 5 atividades + 1 quiz (quiz tem barra própria, mas podemos contar)
  const completed = completedActivities.size;
  const pct = Math.round((completed / total) * 100);
  
  document.getElementById("globalProgress").style.width = pct + "%";
  document.getElementById("progressPct").textContent = pct + "%";
}

function markActivityDone(id) {
  completedActivities.add(id);
  const badge = document.getElementById(`badge-${id}`);
  if (badge) badge.style.display = "inline-block";
  const navCheck = document.getElementById(`nc-${id}`);
  if (navCheck) navCheck.textContent = "✅";
  updateGlobalProgress();
}

// ──────────────────────────────────────────────
// MODO PROFESSOR
// ──────────────────────────────────────────────
let profModeUnlocked = false;

function openProfModal() {
  document.getElementById("profOverlay").style.display = "block";
  document.getElementById("profModal").style.display = "flex";
  if (!profModeUnlocked) {
    document.getElementById("profPassScreen").style.display = "flex";
    document.getElementById("profContent").style.display = "none";
    document.getElementById("profPassInput").value = "";
    document.getElementById("passError").style.display = "none";
    document.getElementById("profPassInput").focus();
  }
}

function closeProfModal() {
  document.getElementById("profOverlay").style.display = "none";
  document.getElementById("profModal").style.display = "none";
}

function checkProfPass() {
  const pass = document.getElementById("profPassInput").value;
  if (pass === "Luana@2011") {
    profModeUnlocked = true;
    document.getElementById("profPassScreen").style.display = "none";
    document.getElementById("profContent").style.display = "block";
    renderProfContent();
  } else {
    document.getElementById("passError").style.display = "block";
  }
}

function switchProfTab(tabId) {
  document.querySelectorAll(".prof-tab").forEach(t => t.classList.remove("active"));
  document.querySelector(`.prof-tab[data-ptab="${tabId}"]`).classList.add("active");
  document.querySelectorAll(".prof-tab-content").forEach(c => c.style.display = "none");
  document.getElementById(`ptab-${tabId}`).style.display = "block";
}

function renderProfContent() {
  document.getElementById("ptab-roteiro").innerHTML = `
    <div class="prof-section-title">Sugestão de Roteiro para a Aula</div>
    <div class="prof-time-badge">Tempo estimado: 90 minutos</div>
    <div class="prof-item"><strong>1. Visão Geral (15 min):</strong> Use a analogia da cozinha. Peça para identificarem quem é o Chef (CU) e quem é o cozinheiro (ULA).</div>
    <div class="prof-item"><strong>2. Ciclo de Instrução (20 min):</strong> Mostre a animação passo a passo primeiro. Depois ative o modo automático.</div>
    <div class="prof-item"><strong>3. Simulador (30 min):</strong> Destaque o <em>Raio-X do Processador</em>. Use o botão <strong>"→ Passo"</strong> para mostrar a ULA e o PC em ação. Incentive o uso dos botões <strong>"Carregar Esqueleto"</strong> para os alunos que têm receio de digitar do zero.</div>
    <div class="prof-item"><strong>4. Pipeline (15 min):</strong> Foco na analogia do lava-rápido. Mostre visualmente como os blocos se sobrepõem.</div>
    <div class="prof-item"><strong>5. Memória (10 min):</strong> Destaque a relação Custo x Benefício da pirâmide. O simulador de cache ajuda a entender o "Hit/Miss".</div>
  `;
  
  document.getElementById("ptab-gabarito").innerHTML = `
    <div class="prof-section-title">Gabarito das Atividades</div>
    <div class="prof-item"><strong>Visão Geral:</strong> 1-CU, 2-ULA, 3-Registradores, 4-RAM</div>
    <div class="prof-item"><strong>Ciclo:</strong> Fetch → Decode → Fetch Operands → Execute → Write Back</div>
    <div class="prof-item"><strong>Simulador M1 (Sequência):</strong> <code>MOV R1, 25</code> | <code>MOV R2, 7</code> | <code>SUB R1, R2</code> | <code>MOV R3, 4</code> | <code>ADD R1, R3</code> | <code>HALT</code> (R1 = 22)</div>
    <div class="prof-item"><strong>Simulador M2 (Condicional):</strong> <code>MOV R1, 0</code> | <code>CMP R1, 0</code> | <code>JZ alarme</code> | <code>MOV R0, 1</code> | <code>JMP fim</code> | <code>alarme: MOV R0, 99</code> | <code>fim: HALT</code> (R0 = 99)</div>
    <div class="prof-item"><strong>Simulador M3 (Loop):</strong> <code>MOV R1, 4</code> | <code>MOV R2, 0</code> | <code>loop: ADD R2, R1</code> | <code>SUB R1, 1</code> | <code>JNZ loop</code> | <code>HALT</code> (R2 = 10, R1 = 0)</div>
    <div class="prof-item"><strong>Simulador M4 (Multiplicação):</strong> <code>MOV R1, 3</code> | <code>MOV R2, 5</code> | <code>MOV R3, 0</code> | <code>repete: ADD R3, R1</code> | <code>SUB R2, 1</code> | <code>JNZ repete</code> | <code>HALT</code> (R3 = 15, R2 = 0)</div>
    <div class="prof-item"><strong>Pipeline:</strong> n=10, k=5. Sem pipe=50. Com pipe=14. Speedup=3.57.</div>
    <div class="prof-item"><strong>Memória:</strong> Registradores (Mais rápido, <1ns), RAM (Fora da CPU), HD (Não volátil, Lento).</div>
  `;
  
  document.getElementById("ptab-perguntas").innerHTML = `
    <div class="prof-section-title">Perguntas para provocar a turma</div>
    <div class="prof-item">"Como a CPU sabe se dois números são iguais se a ULA só sabe fazer contas?" (R: Ela faz uma subtração dos dois. Se o resultado der zero, a Flag ZF acende!).</div>
    <div class="prof-item">"Por que todo loop precisa alterar um valor antes de saltar?" (R: Se não diminuir o contador, a condição nunca muda e o processador entra em loop infinito!).</div>
    <div class="prof-item">"Se o clock é a velocidade, por que um processador de 3GHz antigo perde para um de 2GHz novo?" (R: IPC, arquitetura, pipeline melhor).</div>
    <div class="prof-item">"O que acontece se a luz acabar? O que salva e o que perde?" (R: RAM/Cache perdem, HD/SSD salvam).</div>
  `;
  
  document.getElementById("ptab-atencao").innerHTML = `
    <div class="prof-section-title">Erros Comuns dos Alunos (PROSUB)</div>
    <div class="prof-tip"><strong>Esquecer o HALT:</strong> Sem HALT, a CPU não sabe onde parar e continua avançando o PC para posições vazias.</div>
    <div class="prof-tip"><strong>Loop Infinito:</strong> Em loops, os alunos frequentemente esquecem o <code>SUB R1, 1</code>. Explique que o contador precisa diminuir para alcançar a condição de saída!</div>
    <div class="prof-tip"><strong>Confundir CMP com MOV:</strong> Enfatize que o <code>CMP</code> não altera registradores, apenas atualiza as lâmpadas de status (Flags ZF e NF).</div>
  `;
}

// ──────────────────────────────────────────────
// VISÃO GERAL (Componentes, Fatos, Atividade 1)
// ──────────────────────────────────────────────
const componentInfo = {
  cu: { icon: "🎛️", title: "Unidade de Controle (CU)", body: "É o 'maestro' da CPU. Coordena os outros componentes, busca instruções e decide o que fazer." },
  alu: { icon: "➕", title: "ULA", body: "Faz o trabalho pesado. Realiza operações aritméticas (+, -, *, /) e lógicas (AND, OR)." },
  regs: { icon: "📦", title: "Registradores", body: "Memória minúscula e ultrarrápida dentro da CPU. Guarda os dados que estão sendo processados neste exato milissegundo." },
  cache: { icon: "⚡", title: "Cache", body: "Fica entre a CPU e a RAM. Guarda as informações mais usadas para a CPU não perder tempo esperando a RAM." },
  mem: { icon: "🧠", title: "Memória RAM", body: "Memória principal de trabalho. Guarda os programas abertos. Apaga tudo quando desliga." }
};

document.querySelectorAll(".cpu-block[data-info]").forEach(block => {
  block.addEventListener("click", () => {
    const info = componentInfo[block.dataset.info];
    if (!info) return;
    document.getElementById("infoPanelIcon").textContent = info.icon;
    document.getElementById("infoPanelTitle").textContent = info.title;
    document.getElementById("infoPanelBody").innerHTML = info.body;
    document.getElementById("infoPanel").style.display = "block";
  });
});
function closeInfo() { document.getElementById("infoPanel").style.display = "none"; }

let factsAnimated = false;
function animateFacts() {
  if (factsAnimated) return;
  factsAnimated = true;
  document.querySelectorAll(".fact-num[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const iv = setInterval(() => {
      current = Math.min(current + Math.ceil(target/20), target);
      el.textContent = current;
      if (current >= target) clearInterval(iv);
    }, 50);
  });
  const ghzEl = document.querySelector(".fact-num.ghz");
  if (ghzEl) {
    let v = 0;
    const iv = setInterval(() => { v = Math.min(v + 0.2, 3.5); ghzEl.textContent = v.toFixed(1); if (v >= 3.5) clearInterval(iv); }, 50);
  }
}

// ATIVIDADE 1 - Visão Geral
const act1Questions = [
  { text: "1. O 'cérebro' que coordena as tarefas.", ans: "CU" },
  { text: "2. Realiza os cálculos matemáticos.", ans: "ULA" },
  { text: "3. Memória mais rápida, dentro da CPU.", ans: "REG" },
  { text: "4. Memória externa, guarda programas abertos.", ans: "RAM" }
];
let act1Current = 0;
let act1Score = 0;

function initAct1() {
  const body = document.getElementById("actBody-overview");
  if (act1Current >= act1Questions.length) {
    body.innerHTML = `
      <div class="act-score-box">
        <div class="act-score-num">${act1Score} / ${act1Questions.length}</div>
        <div class="act-score-label">Pontuação</div>
        <button class="btn btn-primary act-retry-btn" onclick="act1Current=0;act1Score=0;initAct1()">Tentar Novamente</button>
      </div>`;
    if (act1Score === act1Questions.length) markActivityDone("overview");
    return;
  }
  
  const q = act1Questions[act1Current];
  let dots = act1Questions.map((_, i) => `<div class="act-dot ${i < act1Current ? 'done' : i === act1Current ? 'current' : ''}"></div>`).join('');
  
  body.innerHTML = `
    <div class="act-progress">${dots}</div>
    <div class="act-question-box">
      <div class="act-q-text">${q.text}</div>
      <div class="act-options">
        <button class="act-opt-btn" onclick="checkAct1('CU', this)">Unidade de Controle</button>
        <button class="act-opt-btn" onclick="checkAct1('ULA', this)">ULA</button>
        <button class="act-opt-btn" onclick="checkAct1('REG', this)">Registradores</button>
        <button class="act-opt-btn" onclick="checkAct1('RAM', this)">RAM</button>
      </div>
      <div id="act1-feedback" class="act-feedback" style="display:none"></div>
    </div>
  `;
}
function checkAct1(ans, btn) {
  const q = act1Questions[act1Current];
  const fb = document.getElementById("act1-feedback");
  document.querySelectorAll(".act-opt-btn").forEach(b => b.disabled = true);
  
  if (ans === q.ans) {
    btn.classList.add("correct");
    fb.textContent = "Resposta correta.";
    fb.className = "act-feedback correct";
    act1Score++;
  } else {
    btn.classList.add("wrong");
    fb.textContent = "Resposta incorreta.";
    fb.className = "act-feedback wrong";
  }
  fb.style.display = "block";
  setTimeout(() => { act1Current++; initAct1(); }, 1500);
}

// ──────────────────────────────────────────────
// CICLO DE INSTRUÇÃO (Visualizador, Atividade 2)
// ──────────────────────────────────────────────
let cycleStep = -1;
let cycleAutoTimer = null;
const cycleData = [
  { status: "🔍 FETCH — Buscando instrução na memória...", reg: ["cvPC", "cvMAR"], pc: "0x00", mar: "0x00", mdr: "—", ir: "—", alu: "—", r1: null },
  { status: "📡 FETCH — MDR recebe instrução da RAM.", reg: ["cvMDR", "cvIR"], pc: "0x00", mar: "0x00", mdr: "ADD R1,R2", ir: "—", alu: "—", r1: null },
  { status: "🔓 DECODE — Decodificando: operação ADD.", reg: ["cvIR"], pc: "0x00", mar: "0x00", mdr: "ADD R1,R2", ir: "ADD R1,R2", alu: "—", r1: null },
  { status: "📥 FETCH OPERANDS — Lendo R1=0 e R2=3.", reg: ["cvR1", "cvR2"], pc: "0x00", mar: "0x00", mdr: "ADD R1,R2", ir: "ADD R1,R2", alu: "0 + 3", r1: "0" },
  { status: "⚡ EXECUTE — ULA calcula: 0 + 3 = 3.", reg: ["cvALU"], pc: "0x01", mar: "0x00", mdr: "ADD R1,R2", ir: "ADD R1,R2", alu: "0 + 3 = 3", r1: "0" },
  { status: "💾 WRITE BACK — Resultado salvo em R1.", reg: ["cvR1", "cvPC"], pc: "0x01", mar: "0x00", mdr: "ADD R1,R2", ir: "ADD R1,R2", alu: "→ R1 = 3", r1: "3" }
];

function nextCycleStep() {
  cycleStep = Math.min(cycleStep + 1, cycleData.length - 1);
  const d = cycleData[cycleStep];
  document.getElementById("cycleStatus").textContent = d.status;
  
  const stepIndex = [0,0,1,2,3,4][cycleStep];
  document.querySelectorAll(".cycle-step").forEach((s, i) => {
    s.classList.toggle("active", i === stepIndex);
    s.classList.toggle("done", i < stepIndex);
  });
  
  document.getElementById("pcVal").textContent = d.pc;
  document.getElementById("marVal").textContent = d.mar;
  document.getElementById("mdrVal").textContent = d.mdr;
  document.getElementById("irVal").textContent = d.ir;
  if (d.r1 !== null) document.getElementById("r1Val").textContent = d.r1;
  document.getElementById("aluDisplay").textContent = d.alu;
  
  document.querySelectorAll(".cv-reg").forEach(r => r.classList.remove("active-reg"));
  d.reg.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add("active-reg"); });
}
function resetCycle() {
  cycleStep = -1;
  clearInterval(cycleAutoTimer);
  cycleAutoTimer = null;
  document.getElementById("cycleAuto").textContent = "▶ Auto";
  document.querySelectorAll(".cycle-step").forEach(s => s.classList.remove("active", "done"));
  document.getElementById("cycleStatus").textContent = "⬅️ Clique em 'Próxima fase' para iniciar";
  document.getElementById("pcVal").textContent = "0x00"; document.getElementById("marVal").textContent = "—";
  document.getElementById("mdrVal").textContent = "—"; document.getElementById("irVal").textContent = "—";
  document.getElementById("r1Val").textContent = "0"; document.getElementById("aluDisplay").textContent = "—";
  document.querySelectorAll(".cv-reg").forEach(r => r.classList.remove("active-reg"));
}
function toggleAutoCycle() {
  if (cycleAutoTimer) { clearInterval(cycleAutoTimer); cycleAutoTimer = null; document.getElementById("cycleAuto").textContent = "▶ Auto"; }
  else {
    document.getElementById("cycleAuto").textContent = "⏸ Pausar";
    cycleAutoTimer = setInterval(() => { if (cycleStep >= cycleData.length - 1) toggleAutoCycle(); else nextCycleStep(); }, 1200);
  }
}

// ATIVIDADE 2 - Ciclo
const act2Phases = [
  { id: "F", name: "Fetch (Busca)" },
  { id: "D", name: "Decode (Decodificação)" },
  { id: "FO", name: "Fetch Operands" },
  { id: "E", name: "Execute (Execução)" },
  { id: "WB", name: "Write Back" }
];
let act2Expected = ["F", "D", "FO", "E", "WB"];
let act2Selected = [];

function initAct2() {
  let cardsHTML = [...act2Phases].sort(() => Math.random() - 0.5)
    .map(p => `<div class="order-card" id="card-${p.id}" onclick="act2Select('${p.id}', '${p.name}')">${p.name}</div>`).join('');
  let slotsHTML = act2Phases.map((_, i) => `<div class="order-slot" id="slot-${i}"><span class="order-slot-label">${i+1}º</span></div>`).join('');
  
  document.getElementById("actBody-cycle").innerHTML = `
    <div class="order-phases">
      <div class="order-slots-row">${slotsHTML}</div>
      <div class="order-cards-row">${cardsHTML}</div>
      <button class="btn btn-secondary btn-xs" style="align-self:flex-start" onclick="act2Selected=[];initAct2()">Limpar</button>
    </div>
  `;
}
function act2Select(id, name) {
  if (act2Selected.includes(id)) return;
  const slotIdx = act2Selected.length;
  if (slotIdx >= 5) return;
  
  act2Selected.push(id);
  document.getElementById(`card-${id}`).classList.add("used");
  const slot = document.getElementById(`slot-${slotIdx}`);
  slot.innerHTML = `<span class="order-slot-label">${slotIdx+1}º</span>${name}`;
  slot.classList.add("filled");
  
  if (act2Selected.length === 5) {
    let correct = true;
    for (let i = 0; i < 5; i++) {
      const isCorrect = act2Selected[i] === act2Expected[i];
      document.getElementById(`slot-${i}`).classList.add(isCorrect ? "correct-slot" : "wrong-slot");
      if (!isCorrect) correct = false;
    }
    if (correct) markActivityDone("cycle");
  }
}

// ──────────────────────────────────────────────
// SIMULADOR & ATIVIDADE 3 (PROSUB DIDÁTICO)
// ──────────────────────────────────────────────
const SIM_REGISTERS = ["R0","R1","R2","R3","R4","R5","R6","R7"];
let simRegs = {};
let simPC = 0, simIR = "—", simACC = 0, simFlags = { Z:0, N:0, C:0, O:0 };
let simProgram = [], simRunning = false, simTimer = null, simInitialized = false;
let simStepCount = 0, simClockCount = 0;

const examples = {
  basic: `; 1. SEQUÊNCIA LINEAR
; O processador executa cada instrução na ordem natural
MOV R1, 25    ; Guarda 25 no registrador R1
MOV R2, 7     ; Guarda 7 no registrador R2
SUB R1, R2    ; Subtrai R2 de R1 (25 - 7 = 18)
ADD R1, 4     ; Soma 4 diretamente em R1 (18 + 4 = 22)
HALT          ; Fim do programa (R1 = 22)`,

  conditional: `; 2. CONDICIONAL (IF / ELSE)
; A CPU compara valores e decide qual bloco executar
MOV R1, 0         ; Valor de entrada (ex: sensor = 0)
CMP R1, 0         ; Compara R1 com 0 (seta Flag ZF=1 se iguais)
JZ congelado      ; Se ZF=1, salta para o rótulo 'congelado'

; Bloco ELSE (se NÃO for zero):
MOV R0, 1         ; R0 = 1 (Operação normal)
JMP fim           ; Salta para o fim sem passar pelo bloco abaixo

congelado:        ; Bloco IF (se for zero):
MOV R0, 99        ; R0 = 99 (Alerta de congelamento!)

fim:
HALT`,

  loop: `; 3. LOOP (REPETIÇÃO COM CONTADOR)
; Soma 4 + 3 + 2 + 1 através de um laço de repetição
MOV R1, 4         ; Contador: começa em 4
MOV R2, 0         ; Acumulador do total: começa em 0

loop:
ADD R2, R1        ; R2 = R2 + R1 (soma o contador atual)
SUB R1, 1         ; Decrementa o contador em 1 (4 -> 3 -> 2 -> 1 -> 0)
JNZ loop          ; Se R1 ainda NÃO é zero (ZF=0), repete o loop!

HALT              ; Ao final, R2 = 10 e R1 = 0`,

  multiplication: `; 4. MULTIPLICAÇÃO POR REPETIÇÃO
; Multiplica 3 x 5 somando o número 3 cinco vezes
MOV R1, 3         ; Número base
MOV R2, 5         ; Contador de repetições (5 vezes)
MOV R3, 0         ; Acumulador do resultado

repete:
ADD R3, R1        ; Acumula 3 em R3
SUB R2, 1         ; Reduz 1 repetição
JNZ repete        ; Enquanto o contador não for zero, repete!

HALT              ; R3 terminará com 15 (3 x 5)`
};

function initSim() {
  if (simInitialized) return;
  simInitialized = true;
  const grid = document.getElementById("simRegsGrid");
  SIM_REGISTERS.forEach(reg => {
    grid.innerHTML += `<div class="sim-reg" id="sreg-${reg}"><div class="sim-reg-name">${reg}</div><div class="sim-reg-val" id="sval-${reg}">0</div></div>`;
  });
  resetSimState();
  initAct3();
}

function loadExample(name) {
  document.getElementById("asmEditor").value = examples[name] || "";
  loadProgram();
  logConsole(`Exemplo "${name}" carregado. Clique em "→ Passo" para ver a CPU em ação!`, "info");
}

function clearEditor() {
  document.getElementById("asmEditor").value = "";
  resetSim();
}

function parseProgram(source) {
  const lines = source.split("\n");
  const instructions = [], labels = {};
  let addr = 0;
  lines.forEach(line => {
    const cleaned = line.trim().replace(/;.*$/, "").trim();
    if (!cleaned) return;
    if (cleaned.endsWith(":")) {
      labels[cleaned.slice(0, -1).trim().toLowerCase()] = addr;
    } else {
      addr++;
    }
  });
  lines.forEach(line => {
    const cleaned = line.trim().replace(/;.*$/, "").trim();
    if (!cleaned || cleaned.endsWith(":")) return;
    const parts = cleaned.split(/[\s,]+/).filter(Boolean);
    instructions.push({ op: parts[0].toUpperCase(), args: parts.slice(1), labels });
  });
  return { instructions, labels };
}

function loadProgram() {
  const src = document.getElementById("asmEditor").value;
  try {
    const { instructions } = parseProgram(src);
    if (!instructions.length) {
      logConsole("Aviso: Nenhum código assembly válido para compilar.", "warn");
      return;
    }
    simProgram = instructions;
    resetSimState();
    renderProgMemory();
    document.getElementById("btnStep").disabled = false;
    document.getElementById("btnRun").disabled  = false;
    document.getElementById("btnReset").disabled = false;
    document.getElementById("btnLoad").disabled  = true;
    logConsole("✓ Programa compilado com sucesso! Clique em '→ Passo' ou '▶ Executar'.", "success");
    updateHardwareActionInitial();
    updateSimUI();
  } catch(e) {
    logConsole("Erro de sintaxe: " + e.message, "error");
  }
}

function resetSimState() {
  simRegs = {};
  SIM_REGISTERS.forEach(r => simRegs[r] = 0);
  simPC = 0;
  simIR = "—";
  simACC = 0;
  simFlags = { Z:0, N:0, C:0, O:0 };
  simStepCount = 0;
  simClockCount = 0;
  clearInterval(simTimer);
  simRunning = false;
}

function resetSim() {
  resetSimState();
  simProgram = [];
  document.getElementById("btnStep").disabled = true;
  document.getElementById("btnRun").disabled = true;
  document.getElementById("btnReset").disabled = true;
  document.getElementById("btnLoad").disabled = false;
  document.getElementById("btnRun").textContent = "▶ Executar";
  document.getElementById("progMemory").innerHTML = "";
  updateSimUI();
  updateHardwareActionInitial();
  logConsole("Simulador resetado ao estado inicial.", "info");
}

function stepProgram() {
  if (simPC < simProgram.length) {
    execInstruction();
  } else {
    logConsole("Fim do programa alcançado. Clique em '↺ Reset' para recomeçar.", "warn");
  }
}

function runProgram() {
  if (simRunning) {
    clearInterval(simTimer);
    simRunning = false;
    document.getElementById("btnRun").textContent = "▶ Executar";
    logConsole("Execução pausada pelo usuário.", "info");
  } else {
    simRunning = true;
    document.getElementById("btnRun").textContent = "⏸ Pausar";
    simTimer = setInterval(() => {
      if (simPC >= simProgram.length) {
        clearInterval(simTimer);
        simRunning = false;
        document.getElementById("btnRun").textContent = "▶ Executar";
      } else {
        execInstruction();
      }
    }, 450);
  }
}

function setFlags(val) {
  simFlags.Z = (val === 0) ? 1 : 0;
  simFlags.N = (val < 0) ? 1 : 0;
}

function updateHardwareActionInitial() {
  setHwStages("IF");
  setHwComponents(["CU"]);
  const codeEl = document.getElementById("hwActionCode");
  const expEl = document.getElementById("hwExplanationText");
  const nextEl = document.getElementById("hwNextStepDesc");
  const clkEl = document.getElementById("hwClockCount");
  if (codeEl) codeEl.textContent = "—";
  if (expEl) expEl.innerHTML = "Programa carregado na memória RAM. Clique em <strong>'→ Passo'</strong> para avançar uma instrução por vez e ver o que acontece fisicamente no chip!";
  if (nextEl) nextEl.textContent = simProgram.length ? `Instrução #0: ${simProgram[0].op} ${simProgram[0].args.join(",")}` : "Aguardando código";
  if (clkEl) clkEl.textContent = "Ciclos: 0";
}

function setHwStages(activeStage) {
  const stages = ["IF", "ID", "EX", "WB"];
  stages.forEach(s => {
    const el = document.getElementById("hwStage-" + s);
    if (el) el.classList.toggle("active", s === activeStage);
  });
}

function setHwComponents(activeComps) {
  const allComps = ["CU", "ALU", "BUS", "REG", "FLAGS"];
  allComps.forEach(c => {
    const el = document.getElementById("hwComp-" + c);
    if (el) el.classList.toggle("active", activeComps.includes(c));
  });
}

function execInstruction() {
  if (simPC >= simProgram.length) return;
  
  simStepCount++;
  simClockCount++;

  // Proteção contra loop infinito acidental do aluno (evita travamento do navegador)
  if (simStepCount > 2000) {
    if (simRunning) {
      clearInterval(simTimer);
      simRunning = false;
      document.getElementById("btnRun").textContent = "▶ Executar";
    }
    logConsole("⚠️ Loop infinito detectado (limite de 2000 ciclos atingido). O programa foi pausado automaticamente para proteger seu navegador!", "warn");
    const expEl = document.getElementById("hwExplanationText");
    if (expEl) {
      expEl.innerHTML = "<strong style='color:var(--warning);'>⚠️ Loop Infinito:</strong> A condição de parada do seu loop nunca é atingida. Verifique se você está diminuindo o contador (ex: <code>SUB R1, 1</code>) antes do <code>JNZ</code>!";
    }
    return;
  }

  const instr = simProgram[simPC];
  simIR = instr.op + " " + instr.args.join(", ");
  const getVal = (a) => (a && a.toUpperCase() in simRegs) ? simRegs[a.toUpperCase()] : (parseInt(a) || 0);

  let jumped = false;
  const prevRegs = { ...simRegs };
  const currentAddr = simPC;
  let explanation = "";
  let activeComps = ["CU"];
  let activeStage = "EX";

  switch (instr.op) {
    case "MOV": {
      activeStage = "WB";
      activeComps = ["CU", "BUS", "REG"];
      const targetReg = instr.args[0].toUpperCase();
      const val = getVal(instr.args[1]);
      simRegs[targetReg] = val;
      explanation = `A <strong>Unidade de Controle (UC)</strong> identificou comando de atribuição. O <strong>Barramento de Dados</strong> transportou o valor <strong>${val}</strong> para a caixinha do registrador <strong>${targetReg}</strong>.`;
      break;
    }
    case "ADD": {
      activeStage = "WB";
      activeComps = ["CU", "ALU", "REG", "FLAGS"];
      const targetReg = instr.args[0].toUpperCase();
      const prevVal = simRegs[targetReg] || 0;
      const operand = getVal(instr.args[1]);
      const res = prevVal + operand;
      simRegs[targetReg] = res;
      setFlags(res);
      explanation = `A <strong>Unidade de Controle</strong> enviou os operandos (${prevVal} e ${operand}) para a <strong>ULA</strong>. A ULA somou <code>${prevVal} + ${operand} = ${res}</code> e gravou no registrador <strong>${targetReg}</strong>. Flags atualizadas: ZF=${simFlags.Z}.`;
      break;
    }
    case "SUB": {
      activeStage = "WB";
      activeComps = ["CU", "ALU", "REG", "FLAGS"];
      const targetReg = instr.args[0].toUpperCase();
      const prevVal = simRegs[targetReg] || 0;
      const operand = getVal(instr.args[1]);
      const res = prevVal - operand;
      simRegs[targetReg] = res;
      setFlags(res);
      explanation = `A <strong>ULA</strong> realizou a subtração: <code>${prevVal} - ${operand} = ${res}</code> e salvou em <strong>${targetReg}</strong>. ${res === 0 ? 'Como o resultado deu ZERO, a <strong>Flag Zero (ZF)</strong> foi ATIVADA (= 1)!' : `Como o resultado não é zero (${res}), a Flag ZF é 0.`}`;
      break;
    }
    case "INC": {
      activeStage = "WB";
      activeComps = ["CU", "ALU", "REG", "FLAGS"];
      const targetReg = instr.args[0].toUpperCase();
      const res = (simRegs[targetReg] || 0) + 1;
      simRegs[targetReg] = res;
      setFlags(res);
      explanation = `A <strong>ULA</strong> incrementou o registrador <strong>${targetReg}</strong> em 1 (agora vale ${res}).`;
      break;
    }
    case "DEC": {
      activeStage = "WB";
      activeComps = ["CU", "ALU", "REG", "FLAGS"];
      const targetReg = instr.args[0].toUpperCase();
      const res = (simRegs[targetReg] || 0) - 1;
      simRegs[targetReg] = res;
      setFlags(res);
      explanation = `A <strong>ULA</strong> decrementou o registrador <strong>${targetReg}</strong> em 1 (agora vale ${res}). ${res === 0 ? 'O valor zerou! <strong>Flag ZF=1</strong>.' : ''}`;
      break;
    }
    case "MUL": {
      activeStage = "WB";
      activeComps = ["CU", "ALU", "REG", "FLAGS"];
      const targetReg = instr.args[0].toUpperCase();
      const prevVal = simRegs[targetReg] || 0;
      const operand = getVal(instr.args[1]);
      const res = prevVal * operand;
      simRegs[targetReg] = res;
      setFlags(res);
      explanation = `A <strong>ULA</strong> multiplicou <code>${prevVal} × ${operand} = ${res}</code> e guardou em <strong>${targetReg}</strong>.`;
      break;
    }
    case "CMP": {
      activeStage = "EX";
      activeComps = ["CU", "ALU", "FLAGS"];
      const val1 = getVal(instr.args[0]);
      const val2 = getVal(instr.args[1]);
      const diff = val1 - val2;
      setFlags(diff);
      explanation = `A <strong>ULA</strong> comparou <code>${val1}</code> com <code>${val2}</code> (subtração interna de teste). Os registradores NÃO mudam. ${diff === 0 ? 'Valores IGUAIS! A <strong>Flag Zero (ZF)</strong> foi ligada em 1.' : `Valores DIFERENTES (${val1} ≠ ${val2}). A Flag Zero ficou em 0.`}`;
      break;
    }
    case "JMP": {
      activeStage = "ID";
      activeComps = ["CU", "REG"];
      const label = instr.args[0].toLowerCase();
      if (instr.labels[label] !== undefined) {
        const dest = instr.labels[label];
        simPC = dest;
        jumped = true;
        explanation = `Salto Incondicional! A <strong>Unidade de Controle</strong> alterou diretamente o <strong>Program Counter (PC)</strong> para o endereço <strong>${dest}</strong> (rótulo <code>${label}</code>). O fluxo linear foi desviado.`;
      }
      break;
    }
    case "JZ": {
      activeStage = "EX";
      activeComps = ["CU", "FLAGS", "REG"];
      const label = instr.args[0].toLowerCase();
      if (simFlags.Z && instr.labels[label] !== undefined) {
        const dest = instr.labels[label];
        simPC = dest;
        jumped = true;
        explanation = `Desvio Condicional Realizado! A <strong>Flag Zero (ZF)</strong> está em 1 (condição verdadeira). O PC saltou para <strong>${dest}</strong> (rótulo <code>${label}</code>).`;
      } else {
        explanation = `Desvio NÃO realizado: A <strong>Flag Zero (ZF)</strong> é 0 (condição falsa). A CPU ignora o salto e continua na próxima linha.`;
      }
      break;
    }
    case "JNZ": {
      activeStage = "EX";
      activeComps = ["CU", "FLAGS", "REG"];
      const label = instr.args[0].toLowerCase();
      if (!simFlags.Z && instr.labels[label] !== undefined) {
        const dest = instr.labels[label];
        simPC = dest;
        jumped = true;
        explanation = `🔁 <strong>Salto do Loop Realizado!</strong> Como ZF=0 (resultado NÃO é zero), a CPU saltou de volta para <code>${label}</code> (endereço ${dest}), repetindo o bloco de instruções!`;
      } else {
        explanation = `Fim do Loop! A Flag Zero é 1 (o contador chegou a zero). O processador NÃO salta e segue em frente para a próxima instrução.`;
      }
      break;
    }
    case "JGT":
    case "JG": {
      activeStage = "EX";
      activeComps = ["CU", "FLAGS", "REG"];
      const label = instr.args[0].toLowerCase();
      if (!simFlags.Z && !simFlags.N && instr.labels[label] !== undefined) {
        const dest = instr.labels[label];
        simPC = dest;
        jumped = true;
        explanation = `Desvio Realizado! O valor testado é maior que zero (ZF=0, NF=0). PC saltou para <strong>${dest}</strong>.`;
      } else {
        explanation = `Desvio NÃO realizado: O valor não é maior que zero. O processador segue na sequência.`;
      }
      break;
    }
    case "HALT": {
      activeStage = "ID";
      activeComps = ["CU"];
      simPC = simProgram.length;
      jumped = true;
      explanation = `🛑 <strong>HALT Executado!</strong> A Unidade de Controle recebeu sinal de parada e suspendeu o ciclo de clock. O programa finalizou.`;
      logConsole("✓ HALT executado: Programa finalizado com sucesso.", "success");
      if (simRunning) {
        clearInterval(simTimer);
        simRunning = false;
        document.getElementById("btnRun").textContent = "▶ Executar";
      }
      checkChallenges();
      break;
    }
    default: {
      explanation = `Instrução ${instr.op} executada.`;
    }
  }

  if (!jumped) simPC++;

  // Atualiza painel Raio-X do Processador
  setHwStages(activeStage);
  setHwComponents(activeComps);
  const codeEl = document.getElementById("hwActionCode");
  const expEl = document.getElementById("hwExplanationText");
  const nextEl = document.getElementById("hwNextStepDesc");
  const clkEl = document.getElementById("hwClockCount");

  if (codeEl) codeEl.textContent = `[${currentAddr}] ${simIR}`;
  if (expEl) expEl.innerHTML = explanation;
  if (clkEl) clkEl.textContent = "Ciclos: " + simClockCount;
  if (nextEl) {
    if (simPC < simProgram.length) {
      const nextIns = simProgram[simPC];
      nextEl.innerHTML = `Endereço <strong>${simPC}</strong>: <code>${nextIns.op} ${nextIns.args.join(", ")}</code>`;
    } else {
      nextEl.innerHTML = "<em>Execução finalizada (Fim do código)</em>";
    }
  }

  updateSimUI(prevRegs);
  renderProgMemory();
}

function updateSimUI(prevRegs) {
  SIM_REGISTERS.forEach(r => {
    const el = document.getElementById("sval-" + r);
    if (el) el.textContent = simRegs[r] ?? 0;
    if (prevRegs && prevRegs[r] !== simRegs[r]) {
      const regEl = document.getElementById("sreg-" + r);
      if (regEl) {
        regEl.classList.add("changed");
        setTimeout(() => regEl.classList.remove("changed"), 500);
      }
    }
  });

  document.getElementById("simPC").textContent = simPC;
  document.getElementById("simIR").textContent = simIR;
  document.getElementById("fZ").textContent = simFlags.Z;
  document.getElementById("fN").textContent = simFlags.N;

  // Atualiza destaque visual das flags
  const flagZEl = document.getElementById("flagZ");
  if (flagZEl) flagZEl.classList.toggle("active", simFlags.Z === 1);
  const flagNEl = document.getElementById("flagN");
  if (flagNEl) flagNEl.classList.toggle("active", simFlags.N === 1);
}

function renderProgMemory() {
  const pm = document.getElementById("progMemory");
  if (!pm) return;
  pm.innerHTML = "";
  simProgram.forEach((ins, i) => {
    pm.innerHTML += `<div class="pm-row ${i === simPC ? 'current' : ''}">
      <span class="pm-addr">${i}:</span>
      <span class="pm-inst">${ins.op} ${ins.args.join(", ")}</span>
      ${i === simPC ? '<span class="pm-arrow">◀ PC</span>' : ''}
    </div>`;
  });
}

function logConsole(msg, type="info") {
  const con = document.getElementById("consoleOutput");
  if (!con) return;
  con.innerHTML += `<div class="console-line console-${type}">${msg}</div>`;
  con.scrollTop = con.scrollHeight;
}

// ──────────────────────────────────────────────
// ATIVIDADE 3 - 4 MISSÕES DIDÁTICAS DO SIMULADOR
// ──────────────────────────────────────────────
const SIM_CHALLENGES = [
  {
    id: 0,
    category: "1. Sequência",
    title: "Missão 1: Controle de Estoque (Sequência Aritmética)",
    desc: "Uma loja tinha <strong>25 itens</strong> no estoque (registrador <code>R1</code>). Vendeu <strong>7 itens</strong> (<code>R2</code>) e depois recebeu reposição de <strong>4 itens</strong> (<code>R3</code>). Escreva um programa sequencial com <code>MOV</code>, <code>SUB</code> e <code>ADD</code>. Ao final com <code>HALT</code>, <code>R1</code> deve conter exatamente <strong>22</strong>.",
    hint: "1. <code>MOV R1, 25</code><br>2. <code>MOV R2, 7</code><br>3. <code>SUB R1, R2</code> (sobra 18 em R1)<br>4. <code>MOV R3, 4</code><br>5. <code>ADD R1, R3</code> (total 22 em R1)<br>6. <code>HALT</code>",
    skeleton: `; Missão 1: Sequência de Operações
MOV R1, 25    ; Estoque inicial de 25 peças
MOV R2, 7     ; 7 peças vendidas
SUB R1, R2    ; R1 = 25 - 7 = 18
MOV R3, 4     ; 4 peças de reposição
ADD R1, R3    ; R1 = 18 + 4 = 22
HALT          ; Fim do programa`,
    check: () => simRegs["R1"] === 22
  },
  {
    id: 1,
    category: "2. Condicional",
    title: "Missão 2: Sensor com Alarme (Desvio IF / ELSE)",
    desc: "Crie uma decisão: coloque <code>0</code> em <code>R1</code> (simulando sensor de congelamento). Use <code>CMP R1, 0</code> para comparar. Se for igual a zero, desvie com <code>JZ alarme</code> e guarde <code>99</code> em <code>R0</code>. Se for diferente, guarde <code>1</code> em <code>R0</code>.",
    hint: "Use <code>CMP R1, 0</code>. Logo abaixo coloque <code>JZ alarme</code>. Se não saltar, faça <code>MOV R0, 1</code> e <code>JMP fim</code>. No rótulo <code>alarme:</code>, coloque <code>MOV R0, 99</code>. No <code>fim:</code>, coloque <code>HALT</code>.",
    skeleton: `; Missão 2: Condicional IF / ELSE
MOV R1, 0         ; Valor do sensor (0 = congelamento)
CMP R1, 0         ; Compara com 0 (seta Flag ZF=1 se igual)
JZ alarme         ; Se for zero, desvia para o alarme!

; Bloco normal (se não for zero):
MOV R0, 1         ; Operação normal
JMP fim           ; Pula o bloco de alarme

alarme:
MOV R0, 99        ; Código de Alarme acionado!

fim:
HALT`,
    check: () => simRegs["R0"] === 99 && simRegs["R1"] === 0
  },
  {
    id: 2,
    category: "3. Loop",
    title: "Missão 3: Somatório 4+3+2+1 com Contador Regressivo",
    desc: "Calcule a soma de 1 até 4 (total = 10) usando um laço de repetição. Use <code>R1</code> como contador (começa em <code>4</code>) e <code>R2</code> como acumulador (começa em <code>0</code>). A cada volta do loop, some <code>R1</code> em <code>R2</code>, subtraia <code>1</code> de <code>R1</code> e repita com <code>JNZ loop</code> até o contador zerar!",
    hint: "Crie o rótulo <code>loop:</code>. Dentro dele coloque <code>ADD R2, R1</code>, depois <code>SUB R1, 1</code>, e <code>JNZ loop</code>. Fora do loop, coloque <code>HALT</code>.",
    skeleton: `; Missão 3: Loop com Somatório (4+3+2+1 = 10)
MOV R1, 4         ; Contador: começa em 4
MOV R2, 0         ; Acumulador: começa em 0

loop:
ADD R2, R1        ; Acumula o valor atual do contador em R2
SUB R1, 1         ; Decrementa o contador em 1
JNZ loop          ; Se R1 ainda NÃO for zero, repete o laço!

HALT              ; Ao final, R2 conterá 10 e R1 conterá 0`,
    check: () => simRegs["R2"] === 10 && simRegs["R1"] === 0
  },
  {
    id: 3,
    category: "4. Desafio",
    title: "Missão 4: Multiplicação por Somas Sucessivas (3 × 5 = 15)",
    desc: "Multiplique <strong>3 × 5</strong> somando o número <code>3</code> (em <code>R1</code>) um total de <code>5</code> vezes (contador <code>R2</code>) usando um loop. O resultado final acumulado deve terminar no registrador <code>R3</code> valendo exatamente <strong>15</strong>.",
    hint: "Inicie <code>R1 = 3</code>, <code>R2 = 5</code>, <code>R3 = 0</code>. No loop: <code>ADD R3, R1</code>, depois <code>SUB R2, 1</code>, e <code>JNZ repete</code>. Ao sair com HALT, <code>R3</code> terá 15!",
    skeleton: `; Missão 4: Multiplicação por Repetição (3 x 5)
MOV R1, 3         ; Valor base a ser somado
MOV R2, 5         ; Contador de repetições
MOV R3, 0         ; Acumulador do resultado

repete:
ADD R3, R1        ; Soma o valor base em R3
SUB R2, 1         ; Diminui uma repetição do contador
JNZ repete        ; Enquanto o contador não zerar, repete!

HALT              ; R3 terminará com 15!`,
    check: () => simRegs["R3"] === 15 && simRegs["R2"] === 0
  }
];

let simChal = [false, false, false, false];

function initAct3() {
  const container = document.getElementById("actBody-simulator");
  if (!container) return;
  
  let html = `<div class="challenges-grid">`;
  SIM_CHALLENGES.forEach((chal, i) => {
    html += `
      <div class="challenge-card ${simChal[i] ? 'solved' : ''}" id="chal-${i}">
        <div class="challenge-header">
          <span class="challenge-num">Desafio ${i+1}</span>
          <span class="challenge-category">${chal.category}</span>
          <span class="challenge-status" id="cstat-${i}">${simChal[i] ? '✅ Completo' : '⏳ Pendente'}</span>
        </div>
        <div class="challenge-title">${chal.title}</div>
        <div class="challenge-desc">${chal.desc}</div>
        <div class="challenge-actions">
          <button class="btn-skeleton" onclick="loadChallengeSkeleton(${i})">📥 Carregar Esqueleto no Editor</button>
          <span class="challenge-hint" onclick="toggleHint(${i})">💡 Ver dica explicativa</span>
        </div>
        <div class="challenge-hint-text" id="chint-${i}">${chal.hint}</div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function loadChallengeSkeleton(id) {
  const chal = SIM_CHALLENGES[id];
  if (!chal) return;
  document.getElementById("asmEditor").value = chal.skeleton;
  loadProgram();
  logConsole(`📥 Esqueleto do "${chal.title}" carregado no editor!`, "exec");
  document.getElementById("asmEditor").scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleHint(i) {
  const el = document.getElementById("chint-" + i);
  if (el) el.classList.toggle("visible");
}

function checkChallenges() {
  let anyNew = false;
  SIM_CHALLENGES.forEach((chal, i) => {
    if (!simChal[i] && chal.check()) {
      simChal[i] = true;
      markChal(i);
      anyNew = true;
      logConsole(`🎉 Parabéns! Você completou a ${chal.title}!`, "success");
    }
  });

  if (simChal.every(Boolean)) {
    markActivityDone("simulator");
    logConsole("🏆 Extraordinário! Você concluiu todos os 4 desafios do simulador de CPU!", "success");
  }
}

function markChal(i) {
  const card = document.getElementById(`chal-${i}`);
  const stat = document.getElementById(`cstat-${i}`);
  if (card) card.classList.add("solved");
  if (stat) {
    stat.textContent = "✅ Completo";
    stat.style.color = "var(--success)";
  }
}

// ──────────────────────────────────────────────
// PIPELINE & ATIVIDADE 4
// ──────────────────────────────────────────────
const STAGES = ["IF","ID","EX","MEM","WB"];
const K = 5;
function initPipelineViz() { updatePipelineViz(); }
function updatePipelineViz() {
  const n = parseInt(document.getElementById("numInstSlider").value);
  document.getElementById("numInstLabel").textContent = n;
  document.getElementById("calcN").textContent = n;
  document.getElementById("calcNoPipe").textContent = n * K;
  document.getElementById("calcPipe").textContent = n + K - 1;
  document.getElementById("calcSpeedup").textContent = ((n*K)/(n+K-1)).toFixed(2) + "×";
  buildGrids(n, false);
}
function buildGrids(n, animate) {
  const noPipe = document.getElementById("noPipeGrid"); const pipe = document.getElementById("pipeGrid");
  noPipe.innerHTML = ""; pipe.innerHTML = "";
  noPipe.style.gridTemplateColumns = `repeat(${n*K}, 1fr)`;
  for (let i=0; i<n; i++) for (let s=0; s<K; s++) noPipe.innerHTML += `<div class="pipe-cell pipe-${STAGES[s]} ${animate?'':'visible'}">${STAGES[s]}</div>`;
  
  pipe.style.gridTemplateColumns = `repeat(${n+K-1}, 1fr)`;
  for (let i=0; i<n; i++) {
    for (let c=0; c<n+K-1; c++) {
      if (c>=i && c<i+K) pipe.innerHTML += `<div class="pipe-cell pipe-${STAGES[c-i]} ${animate?'':'visible'}">${STAGES[c-i]}</div>`;
      else pipe.innerHTML += `<div class="pipe-cell pipe-empty visible"></div>`;
    }
  }
}
function animatePipeline() { buildGrids(parseInt(document.getElementById("numInstSlider").value), true); setTimeout(() => document.querySelectorAll(".pipe-cell").forEach(c => c.classList.add("visible")), 100); }
function resetPipeline() { updatePipelineViz(); }

// ATIVIDADE 4 - Speedup
function initAct4() {
  document.getElementById("actBody-pipeline").innerHTML = `
    <div class="speedup-exercise">
      <div class="ex-row"><span class="ex-label">Instruções (n) e Estágios (k):</span><span class="ex-given">n = 10, k = 5</span></div>
      <div class="ex-row"><span class="ex-label">Tempo s/ pipeline (n × k):</span><input type="text" id="ans-nopipe" class="ex-input" placeholder="?"></div>
      <div class="ex-row"><span class="ex-label">Tempo c/ pipeline (n + k - 1):</span><input type="text" id="ans-pipe" class="ex-input" placeholder="?"></div>
      <div class="ex-row"><span class="ex-label">Speedup (s/ pipe ÷ c/ pipe):</span><input type="text" id="ans-speedup" class="ex-input" placeholder="ex: 1.5"></div>
      <button class="btn btn-primary" style="align-self:flex-start" onclick="checkAct4()">Verificar Respostas</button>
    </div>
  `;
}
function checkAct4() {
  let v1 = document.getElementById("ans-nopipe"), v2 = document.getElementById("ans-pipe"), v3 = document.getElementById("ans-speedup");
  let c1 = v1.value.trim() === "50", c2 = v2.value.trim() === "14", c3 = parseFloat(v3.value.trim().replace(',','.')) >= 3.5 && parseFloat(v3.value.trim().replace(',','.')) <= 3.6;
  v1.className = `ex-input ${c1?'correct':'wrong'}`; v2.className = `ex-input ${c2?'correct':'wrong'}`; v3.className = `ex-input ${c3?'correct':'wrong'}`;
  if (c1 && c2 && c3) markActivityDone("pipeline");
}

// ──────────────────────────────────────────────
// HIERARQUIA DE MEMÓRIA & ATIVIDADE 5
// ──────────────────────────────────────────────
const RAM_SIZE = 32; let cacheSlots = new Array(8).fill(null), cacheHits = 0, cacheMisses = 0;
function initCacheDemo() {
  renderCache();
  const rc = document.getElementById("ramCells"); rc.innerHTML = "";
  for(let i=0; i<RAM_SIZE; i++) rc.innerHTML += `<div class="ram-cell" id="rc-${i}">[${i}]</div>`;
}
function renderCache() {
  const c = document.getElementById("cacheSlots"); c.innerHTML = "";
  cacheSlots.forEach((s, i) => c.innerHTML += `<div class="cache-slot ${s!==null?'occupied':''}" id="cs-${i}"><span>S${i}</span><span>${s!==null?'A:'+s:'vazio'}</span></div>`);
}
function simulateCacheAccess() {
  const addr = parseInt(document.getElementById("cacheAddr").value);
  if (isNaN(addr) || addr < 0 || addr >= RAM_SIZE) return;
  document.querySelectorAll(".cache-slot").forEach(s => s.classList.remove("hit-slot","miss-slot"));
  document.querySelectorAll(".ram-cell").forEach(r => r.classList.remove("accessed"));
  document.getElementById("rc-"+addr).classList.add("accessed");
  
  const slotIdx = cacheSlots.indexOf(addr), res = document.getElementById("cacheResult"), arr = document.getElementById("cacheArrow");
  if (slotIdx !== -1) {
    cacheHits++; document.getElementById("cs-"+slotIdx).classList.add("hit-slot");
    res.textContent = `✅ CACHE HIT! Acesso rápido.`; res.className = "cache-result hit"; arr.textContent = "⟵"; arr.className = "cache-demo-arrow hit";
  } else {
    cacheMisses++; const ev = cacheSlots.indexOf(null) !== -1 ? cacheSlots.indexOf(null) : 0; cacheSlots[ev] = addr;
    res.textContent = `❌ CACHE MISS! Buscando na RAM.`; res.className = "cache-result miss"; arr.textContent = "⟶"; arr.className = "cache-demo-arrow miss";
    setTimeout(() => { renderCache(); document.getElementById("cs-"+ev).classList.add("miss-slot"); }, 200);
  }
  const tot = cacheHits + cacheMisses;
  document.getElementById("cacheHits").textContent = cacheHits; document.getElementById("cacheMisses").textContent = cacheMisses;
  document.getElementById("cacheHitRate").textContent = tot ? Math.round((cacheHits/tot)*100)+"%" : "0%";
}
function clearCacheDemo() { cacheSlots.fill(null); cacheHits = 0; cacheMisses = 0; simulateCacheAccess(); } // force update

// ATIVIDADE 5 - Memória
const memChips = [
  { id: "c1", text: "Menor capacidade", ans: "Z1" }, { id: "c2", text: "Dentro da CPU", ans: "Z1" },
  { id: "c3", text: "Perde dados ao desligar", ans: "Z2" }, { id: "c4", text: "Memória de trabalho", ans: "Z2" },
  { id: "c5", text: "Mais lenta", ans: "Z3" }, { id: "c6", text: "Armazena arquivos", ans: "Z3" }
];
let selectedChip = null;

function initAct5() {
  let chips = memChips.sort(()=>Math.random()-0.5).map(c => `<div class="mem-chip" id="${c.id}" onclick="selectChip('${c.id}')">${c.text}</div>`).join('');
  document.getElementById("actBody-memory").innerHTML = `
    <div class="mem-classify-layout">
      <div class="mem-chips-pool" id="memPool">${chips}</div>
      <div class="mem-zones">
        <div class="mem-zone" onclick="placeChip('Z1')"><div class="mem-zone-title">Registrador / Cache</div><div class="mem-zone-items" id="Z1"></div></div>
        <div class="mem-zone" onclick="placeChip('Z2')"><div class="mem-zone-title">RAM</div><div class="mem-zone-items" id="Z2"></div></div>
        <div class="mem-zone" onclick="placeChip('Z3')"><div class="mem-zone-title">HD / SSD</div><div class="mem-zone-items" id="Z3"></div></div>
      </div>
    </div>
  `;
}
function selectChip(id) {
  document.querySelectorAll(".mem-chip").forEach(c => c.classList.remove("selected"));
  selectedChip = memChips.find(c => c.id === id);
  document.getElementById(id).classList.add("selected");
}
function placeChip(zoneId) {
  if (!selectedChip) return;
  const isCorrect = selectedChip.ans === zoneId;
  document.getElementById(zoneId).innerHTML += `<div class="mem-zone-item ${isCorrect?'correct':'wrong'}">${selectedChip.text}</div>`;
  const chipEl = document.getElementById(selectedChip.id);
  chipEl.classList.remove("selected"); chipEl.classList.add("placed");
  selectedChip = null;
  
  if (document.querySelectorAll(".mem-chip.placed").length === memChips.length) {
    if (document.querySelectorAll(".mem-zone-item.wrong").length === 0) markActivityDone("memory");
    else setTimeout(initAct5, 2000); // retry if errors
  }
}

// ──────────────────────────────────────────────
// QUIZ FINAL
// ──────────────────────────────────────────────
const quizQuestions = [
  { q: "O que a ULA (ALU) faz?", options: ["Guarda arquivos", "Realiza operações matemáticas", "Mostra vídeo"], correct: 1 },
  { q: "O PC (Program Counter) armazena:", options: ["O endereço da próxima instrução", "A senha do usuário", "O resultado da soma"], correct: 0 },
  { q: "Qual o benefício do Pipeline?", options: ["Aumenta o HD", "Permite executar instruções em paralelo", "Reduz o consumo de energia"], correct: 1 },
  { q: "Cache Miss ocorre quando:", options: ["O dado é achado rápido", "O dado não está no cache", "A CPU desliga"], correct: 1 },
  { q: "Memória mais rápida da hierarquia:", options: ["RAM", "HD", "Registradores"], correct: 2 }
];
let currentQuestion = 0, answers = new Array(quizQuestions.length).fill(null);
function initQuiz() { renderQuestion(0); }
function renderQuestion(idx) {
  const q = quizQuestions[idx], ans = answers[idx] !== null;
  document.getElementById("quizProgFill").style.width = (answers.filter(a=>a!==null).length / quizQuestions.length * 100) + "%";
  document.getElementById("quizProgText").textContent = `Questão ${idx+1} de ${quizQuestions.length}`;
  let html = `<div class="question-text">${q.q}</div><div class="options-list">`;
  q.options.forEach((opt, i) => {
    let cls = ans ? (i === q.correct ? "correct" : (i === answers[idx] ? "wrong" : "")) : "";
    html += `<button class="option-btn ${cls}" onclick="selectAnswer(${idx},${i})" ${ans?'disabled':''}>${opt}</button>`;
  });
  document.getElementById("questionArea").innerHTML = html + `</div>`;
  document.getElementById("btnPrevQ").disabled = idx === 0; document.getElementById("btnNextQ").disabled = !ans;
}
function selectAnswer(qIdx, optIdx) {
  answers[qIdx] = optIdx; renderQuestion(qIdx);
  if (answers.every(a => a !== null)) setTimeout(showResults, 800);
}
function nextQuestion() { if(currentQuestion < quizQuestions.length-1) renderQuestion(++currentQuestion); }
function prevQuestion() { if(currentQuestion > 0) renderQuestion(--currentQuestion); }
function showResults() {
  const score = answers.filter((a, i) => a === quizQuestions[i].correct).length;
  document.getElementById("quizCard").style.display = "none"; document.getElementById("quizResults").style.display = "block";
  document.getElementById("resultsTitle").textContent = score === 5 ? "Gabaritou!" : "Bom esforço!";
  document.getElementById("resultsScore").textContent = `${score} / 5`;
  document.getElementById("resultsBar").style.width = (score/5*100) + "%";
}
function restartQuiz() { currentQuestion = 0; answers.fill(null); document.getElementById("quizCard").style.display = "block"; document.getElementById("quizResults").style.display = "none"; renderQuestion(0); }

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  initAct1(); initAct2(); initSim(); initAct3(); initAct4(); initAct5();
});
