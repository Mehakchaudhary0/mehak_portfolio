// -----------------------------
// MEHAK PORTFOLIO INTERACTIONS
// -----------------------------
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }, 850);
});

const progress = document.getElementById("progress");
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${(scrollY / max) * 100}%`;
  navbar.classList.toggle("scrolled", scrollY > 40);
});

const menu = document.querySelector(".menu-toggle");
const nav = document.getElementById("navLinks");
menu.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.remove("scroll-hidden");
      e.target.classList.add("scroll-visible");
    }
  });
}, {threshold:.12, rootMargin:"0px 0px -45px 0px"});

document.querySelectorAll(".reveal, .skill-card, .project, .timeline-item, .process-node, .portrait, .about-copy, .title-row, .manifesto, .contact-panel").forEach(el => {
  el.classList.add("scroll-hidden");
  revealObserver.observe(el);
});

// Smooth custom cursor on desktop.
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mx=0,my=0,rx=0,ry=0;
window.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+"px"; dot.style.top=my+"px"; });
function cursorLoop(){
  rx += (mx-rx)*.13; ry += (my-ry)*.13;
  ring.style.left=rx+"px"; ring.style.top=ry+"px";
  requestAnimationFrame(cursorLoop);
}
cursorLoop();
document.querySelectorAll("a,button,.skill-card,.project").forEach(el=>{
  el.addEventListener("mouseenter",()=>{ring.style.width="46px";ring.style.height="46px"});
  el.addEventListener("mouseleave",()=>{ring.style.width="32px";ring.style.height="32px"});
});

// Three.js hero scene: Floating Holographic Data Core
const canvas = document.getElementById("scene");
if (canvas && window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, 0, 5.4);

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setClearColor(0x000000, 0);

  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Main faceted data crystal
  const coreGeo = new THREE.IcosahedronGeometry(0.92, 2);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x8e7aff,
    metalness: 0.62,
    roughness: 0.11,
    transmission: 0.38,
    transparent: true,
    opacity: 0.93,
    clearcoat: 1,
    clearcoatRoughness: 0.045,
    emissive: 0x342174,
    emissiveIntensity: 0.28
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  coreGroup.add(core);

  // Wireframe shell gives the object a digital/AI feel.
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.03, 2)),
    new THREE.LineBasicMaterial({
      color: 0xb9adff,
      transparent: true,
      opacity: 0.62
    })
  );
  coreGroup.add(shell);

  // Subtle glass-like outer shell for a more physical, layered appearance.
  const glassShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x7665c9,
      metalness: 0.18,
      roughness: 0.18,
      transmission: 0.8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      clearcoat: 1
    })
  );
  coreGroup.add(glassShell);

  // Bright inner nucleus.
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.29, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xfaf8ff,
      emissive: 0x9278ff,
      emissiveIntensity: 2.15,
      metalness: 0.72,
      roughness: 0.07
    })
  );
  coreGroup.add(nucleus);

  const energyBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.98, 0.025, 10, 160),
    new THREE.MeshBasicMaterial({
      color: 0x66e8ff,
      transparent: true,
      opacity: 0.62
    })
  );
  energyBand.rotation.x = Math.PI * 0.35;
  coreGroup.add(energyBand);

  // Three thin orbital data rings.
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const orbitSpecs = [
    [1.38, 0.55, 0.008, 0x9d88ff],
    [1.68, -0.72, -0.005, 0x5ce9ff],
    [1.96, 1.05, 0.0025, 0xd09aff]
  ];

  orbitSpecs.forEach(([radius, tilt, speed, color], idx) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012, 8, 128),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: idx === 1 ? 0.48 : 0.34
      })
    );
    ring.rotation.x = tilt;
    ring.userData.speed = speed;
    orbitGroup.add(ring);
  });

  // Small "data nodes" moving around the core.
  const nodeGroup = new THREE.Group();
  orbitGroup.add(nodeGroup);

  for (let i = 0; i < 8; i++) {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.035 + (i % 3) * 0.012, 12, 12),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? 0x65e9ff : 0xb89eff
      })
    );
    const angle = (Math.PI * 2 / 8) * i;
    node.position.set(Math.cos(angle) * 1.42, Math.sin(angle) * 1.42, (i % 3 - 1) * 0.18);
    node.userData.angle = angle;
    node.userData.radius = 1.42 + (i % 2) * 0.18;
    node.userData.offset = i * 0.55;
    nodeGroup.add(node);
  }

  // Compact particle halo.
  const particleGeo = new THREE.BufferGeometry();
  const count = 260;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = 2.15 + Math.random() * 1.35;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2.4;
  }

  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      color: 0xb9adff,
      size: 0.014,
      transparent: true,
      opacity: 0.65
    })
  );
  scene.add(particles);

  // Soft lighting.
  const purpleLight = new THREE.PointLight(0x987aff, 14, 7);
  purpleLight.position.set(2.8, 2.3, 3);
  scene.add(purpleLight);

  const cyanLight = new THREE.PointLight(0x4ce7ff, 8, 6);
  cyanLight.position.set(-2.8, -1.7, 2);
  scene.add(cyanLight);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));

  function resizeScene() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    const heroVisual = document.querySelector(".hero-visual");

function resizeScene() {
    if (!heroVisual) return;

    const width = heroVisual.clientWidth;
    const height = heroVisual.clientHeight;

    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

resizeScene();

window.addEventListener("resize", resizeScene);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  resizeScene();
  window.addEventListener("resize", resizeScene);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    // Slow, premium movement instead of a huge spinning object.
    core.rotation.x = time * 0.16;
    core.rotation.y = time * 0.31;
    shell.rotation.x = -time * 0.12;
    shell.rotation.y = -time * 0.21;
    glassShell.rotation.x = time * 0.08;
    glassShell.rotation.y = -time * 0.13;
    energyBand.rotation.z = time * 0.9;

    const breathe = 1 + Math.sin(time * 1.8) * 0.018;
    coreGroup.scale.setScalar(breathe);
    nucleus.scale.setScalar(1 + Math.sin(time * 2.4) * 0.055);

    orbitGroup.rotation.z += 0.0018;
    orbitGroup.rotation.y += 0.0012;

    orbitGroup.children.forEach(child => {
      if (child.userData && child.userData.speed) {
        child.rotation.z += child.userData.speed;
        child.rotation.y += child.userData.speed * 0.4;
      }
    });

    nodeGroup.children.forEach(node => {
      node.userData.angle += 0.004;
      const a = node.userData.angle;
      const r = node.userData.radius;
      node.position.x = Math.cos(a) * r;
      node.position.y = Math.sin(a) * r;
      node.position.z = Math.sin(a * 1.8 + node.userData.offset) * 0.22;
    });

    particles.rotation.z = time * 0.025;
    particles.rotation.y = time * 0.018;

    purpleLight.intensity = 13 + Math.sin(time * 2) * 2.5;

    renderer.render(scene, camera);
  }

  animate();

  // Subtle mouse parallax.
  window.addEventListener("mousemove", e => {
    const x = (e.clientX / innerWidth - 0.5);
    const y = (e.clientY / innerHeight - 0.5);

    coreGroup.position.x = x * 0.13;
    coreGroup.position.y = -y * 0.13;
    orbitGroup.position.x = x * 0.07;
    orbitGroup.position.y = -y * 0.07;
  });
}

// Project expansion
document.querySelectorAll(".project-expand").forEach(project => {
  const toggle = project.querySelector(".project-toggle");
  const main = project.querySelector(".project-main");
  const openProject = () => {
    document.querySelectorAll(".project-expand.open").forEach(other => {
      if (other !== project) other.classList.remove("open");
    });
    project.classList.toggle("open");
  };
  toggle.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); openProject(); });
  main.addEventListener("click", e => {
    if (!e.target.closest("a")) openProject();
  });
});

// About portrait click pulse
const portrait = document.querySelector(".portrait");
if (portrait) {
  portrait.addEventListener("click", () => {
    portrait.classList.add("active");
    setTimeout(() => portrait.classList.remove("active"), 700);
  });
}

// Active navigation link while scrolling
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("#navLinks a")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, {threshold:.45});
sections.forEach(section => navObserver.observe(section));

