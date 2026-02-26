// Initialize Lucide icons
lucide.createIcons();

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");
const navOverlay = document.getElementById("nav-overlay");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const body = document.body;

function openMobileMenu() {
  navLinks.classList.add("active");
  navOverlay.classList.add("active");
  body.classList.add("menu-open");
}

function closeMobileMenu() {
  navLinks.classList.remove("active");
  navOverlay.classList.remove("active");
  body.classList.remove("menu-open");
}

// Make function globally available for onclick
window.closeMobileMenu = closeMobileMenu;

mobileMenuBtn.addEventListener("click", openMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);
navOverlay.addEventListener("click", closeMobileMenu);

// Close menu on window resize if open
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && navLinks.classList.contains("active")) {
    closeMobileMenu();
  }
});

// ========== THREE.JS BACKGROUND ==========
const VELOCIDADE_GIRO = 0.5;
const BRILHO_OBJETOS = 0.8;
const VELOCIDADE_TRANSICAO = 0.01;

const canvas = document.querySelector("#hero-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.z = 5;

const createMat = (color) =>
  new THREE.MeshBasicMaterial({
    color: color,
    wireframe: true,
    transparent: true,
    opacity: 0,
  });

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.5, 0.4, 150, 20),
  createMat(0xbf00ff),
);
const sphere = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.8, 2),
  createMat(0x00ff44),
);
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  createMat(0xff6600),
);
const pyramid = new THREE.Mesh(
  new THREE.ConeGeometry(1.5, 2.5, 4),
  createMat(0x00ffff),
);
const octa = new THREE.Mesh(
  new THREE.OctahedronGeometry(1.8, 0),
  createMat(0xff00ff),
);

const objects = [torus, sphere, cube, pyramid, octa];
objects.forEach((obj) => {
  obj.scale.setScalar(0.8);
  scene.add(obj);
});

let currentIdx = 0;

function updateCarousel() {
  const time = Date.now() * 0.001;

  objects.forEach((obj, idx) => {
    if (idx === currentIdx) {
      if (obj.material.opacity < BRILHO_OBJETOS)
        obj.material.opacity += VELOCIDADE_TRANSICAO;
      if (obj.scale.x < 1.1) obj.scale.setScalar(obj.scale.x + 0.01);

      obj.rotation.y += 0.01 * VELOCIDADE_GIRO;
      obj.rotation.x += 0.008 * VELOCIDADE_GIRO;

      obj.position.y = Math.sin(time) * 0.2;
    } else {
      if (obj.material.opacity > 0)
        obj.material.opacity -= VELOCIDADE_TRANSICAO * 2;
      if (obj.scale.x > 0.5) obj.scale.setScalar(obj.scale.x - 0.01);
    }
  });
}

setInterval(() => {
  currentIdx = (currentIdx + 1) % objects.length;
}, 9000);

function animate() {
  requestAnimationFrame(animate);
  updateCarousel();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setSize(window.innerWidth, window.innerHeight);
animate();

// ========== GITHUB REPOS ==========
async function fetchRepos() {
  const container = document.getElementById("github-repos");
  try {
    const response = await fetch(
      `https://api.github.com/users/Ithalolp/repos?sort=updated&per_page=12`,
    );
    const repos = await response.json();
    renderProjects(repos);
  } catch (e) {
    container.innerHTML =
      '<p class="col-span-full text-center text-zinc-500 uppercase text-[10px] tracking-widest">Erro ao sincronizar repositórios.</p>';
  }
}

function renderProjects(repos) {
  const container = document.getElementById("github-repos");
  container.innerHTML = "";

  repos.forEach((repo) => {
    const card = document.createElement("a");
    card.href = repo.html_url;
    card.target = "_blank";
    card.className =
      "reveal bento-item p-8 rounded-[2rem] block group cursor-pointer";

    card.innerHTML = `
      <div class="flex justify-between items-start mb-6">
        <i data-lucide="github" class="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform"></i>
        <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">${
          repo.language || "Project"
        }</span>
      </div>
      <h3 class="font-bold text-white text-xl mb-3 italic uppercase truncate group-hover:text-purple-400 transition-colors">${
        repo.name
      }</h3>
      <p class="text-[12px] text-zinc-500 line-clamp-2 leading-relaxed mb-6 group-hover:text-zinc-300 transition-colors">${
        repo.description || "Exploração técnica e desenvolvimento de software."
      }</p>
      <div class="flex items-center gap-2 text-[9px] font-black text-purple-400 uppercase tracking-widest">
        Acessar Repositório <i data-lucide="external-link" class="w-3 h-3"></i>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
  refreshObserver();
}

// ========== REVEAL ANIMATIONS ==========
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { threshold: 0.1 },
);

function refreshObserver() {
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
}

// ========== TYPING ANIMATION ==========
const phrases = [
  "Full-stack Developer",
  "App Architect",
  "AI & 3D Visual Artist",
  "UX Enthusiast",
  "Creative Technologist",
];
let pIdx = 0,
  cIdx = 0,
  isDel = false;

function type() {
  const current = phrases[pIdx];
  const target = document.getElementById("typing-text");
  if (!target) return;
  target.textContent = isDel
    ? current.substring(0, cIdx - 1)
    : current.substring(0, cIdx + 1);
  cIdx = isDel ? cIdx - 1 : cIdx + 1;
  if (!isDel && cIdx === current.length) {
    isDel = true;
    setTimeout(type, 2000);
  } else if (isDel && cIdx === 0) {
    isDel = false;
    pIdx = (pIdx + 1) % phrases.length;
    setTimeout(type, 500);
  } else {
    setTimeout(type, isDel ? 60 : 120);
  }
}

// ========== PROGRESS BAR ==========
window.addEventListener("scroll", () => {
  const percent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
  document.getElementById("progress-bar").style.width = percent + "%";
});

// ========== TAB SWITCHING ==========
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.add("hidden");
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active-tab");
    btn.classList.add("border-white/10");
  });

  document.getElementById(tabId).classList.remove("hidden");

  const activeBtnMap = {
    "tab-certs": "btn-certs",
    "tab-tech": "btn-tech",
  };

  const btn = document.getElementById(activeBtnMap[tabId]);
  btn.classList.add("active-tab");
  btn.classList.remove("border-white/10");

  lucide.createIcons();
}

// Make function globally available for onclick
window.switchTab = switchTab;

// ========== INIT ==========
window.onload = () => {
  type();
  fetchRepos();
  refreshObserver();
};
