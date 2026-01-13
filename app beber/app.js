let players = [];
let mode = "party";
let difficulty = "normal";
let rounds = 0;

const baseChallenges = {
  party: [
    "Bebe {n} tragos",
    "Reparte {n} tragos",
    "Elige a alguien para beber contigo",
    "Si pasas, bebes el doble",
    "Bebe si hoy has hecho ghosting (aunque sea leve)"
  ],
  uni: [
    "Bebe {n} tragos si has llegado tarde a clase alguna vez",
    "Reparte {n} tragos al que peor lleve la fiesta",
    "Bebe si has estudiado la noche antes de un examen",
    "Elige a alguien para beber"
  ],
  couple: [
    "Bebed {n} tragos juntos",
    "Elige a alguien para beber contigo",
    "Reparte {n} tragos entre dos",
    "Bebe si hoy has sentido celos (aunque sea poquito)"
  ]
};

const $ = (id) => document.getElementById(id);
const card = $("card");
const playersDiv = $("players");
const modeBadge = $("modeBadge");
const diffBadge = $("diffBadge");

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)] }

function aiTragos(){
  let base = difficulty==="easy" ? 1 :
             difficulty==="normal" ? 2 :
             difficulty==="hard" ? 3 : 4;
  base += Math.floor(rounds/5);
  return Math.min(base, 6);
}

function updatePlayers(){
  playersDiv.innerHTML = "";
  if(players.length === 0){
    playersDiv.innerHTML = "<div style='color:#ccc'>👥 Sin jugadores todavía</div>";
    return;
  }
  players.forEach((p,i)=>{
    const el = document.createElement("div");
    el.className = "player-item";
    el.innerHTML = `<span>${p}</span><button aria-label="Eliminar">❌</button>`;
    el.querySelector("button").addEventListener("click", ()=>{
      const removed = players.splice(i,1)[0];
      updatePlayers();
      card.innerHTML = `❌ <b>${removed}</b> eliminado`;
    });
    playersDiv.appendChild(el);
  });
}

function addPlayer(){
  const name = prompt("Nombre del jugador:");
  if(!name) return;
  const trimmed = name.trim();
  if(!trimmed) return;
  players.push(trimmed);
  updatePlayers();
  card.innerHTML = `✅ <b>${trimmed}</b> añadido`;
}

function clearPlayers(){
  players = [];
  updatePlayers();
  card.textContent = "Lista vacía ✅";
}

function resetGame(){
  rounds = 0;
  card.textContent = "Juego reiniciado 🍻";
}

function drawChallenge(){
  if(players.length === 0){
    card.textContent = "⚠️ Añade al menos 1 jugador";
    return;
  }
  rounds++;
  const p = rand(players);
  const n = aiTragos();
  let c = rand(baseChallenges[mode]).replace("{n}", n);
  card.innerHTML = `<span class="player">${p}</span><br>${c}`;
}

function spinWheel(){
  if(players.length === 0){
    card.textContent = "⚠️ Añade jugadores primero";
    return;
  }
  rounds++;
  const p = rand(players);
  card.innerHTML = `🎯 <span class="player">${p}</span><br>Bebe ${aiTragos()} tragos o repártelos`;
}

$("btnAdd").addEventListener("click", addPlayer);
$("btnClear").addEventListener("click", clearPlayers);
$("btnReset").addEventListener("click", resetGame);
$("btnChallenge").addEventListener("click", drawChallenge);
$("btnWheel").addEventListener("click", spinWheel);

$("mode").addEventListener("change", (e)=>{
  mode = e.target.value;
  modeBadge.textContent = mode==="party" ? "Fiesta" : mode==="uni" ? "Universidad" : "Pareja";
});

$("difficulty").addEventListener("change", (e)=>{
  difficulty = e.target.value;
  diffBadge.textContent = difficulty==="easy" ? "Suave" :
                          difficulty==="normal" ? "Normal" :
                          difficulty==="hard" ? "Intenso" : "Caos";
});

updatePlayers();
