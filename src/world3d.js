import * as THREE from 'three';

// Mundo 3D: Acampamento Meio-Sangue procedural low-poly
export class CampWorld {
  constructor(container, onArrive) {
    this.container = container;
    this.onArrive = onArrive;
    this.arrived = false;
    this.keys = {};
    this.locName = 'lago';

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0b1e3a');
    this.scene.fog = new THREE.Fog('#0b1e3a', 60, 160);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Luzes
    this.hemi = new THREE.HemisphereLight('#bcd8ff', '#1d3a24', 0.85);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight('#fff2cc', 1.6);
    this.sun.position.set(30, 50, 20);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -60; this.sun.shadow.camera.right = 60;
    this.sun.shadow.camera.top = 60; this.sun.shadow.camera.bottom = -60;
    this.scene.add(this.sun);
    this.magicLight = new THREE.PointLight('#b44dff', 0, 40);
    this.scene.add(this.magicLight);

    this.buildTerrain();
    this.buildLake();
    this.buildCabins();
    this.buildBigHouse();
    this.buildHill();
    this.buildAmphitheater();
    this.buildForest();
    this.buildInfirmary();
    this.buildLabyrinth();
    this.buildOlympus();
    this.buildOracle();
    this.buildPlayer();
    this.buildNPCs();
    this.buildBeacon();

    this.LOCS = {
      oraculo:   { cam: [9, 6, 12], look: [18, 2, -14], spawn: [11, 0, -4], obj: [18, 0, -9], night: 1, label: 'Sótão da Casa Grande' },
      lago:      { cam: [-14, 7, 18], look: [-18, 1, 8], spawn: [-8, 0, 2], obj: [-18, 0, 8], night: 0, label: 'Lago das Canoas' },
      conselho:  { cam: [24, 6, -6], look: [18, 2, -14], spawn: [11, 0, -4], obj: [18, 0, -9], night: 0, label: 'Casa Grande' },
      chales:    { cam: [6, 7, 16], look: [0, 1, 4], spawn: [6, 0, 12], obj: [1, 0, 8.5], night: 0, label: 'Chalés' },
      floresta:  { cam: [-30, 8, -14], look: [-38, 1, -24], spawn: [-28, 0, -14], obj: [-38, 0, -24], night: 1, label: 'Floresta Proibida' },
      enfermaria:{ cam: [16, 6, 18], look: [22, 1, 12], spawn: [14, 0, 16], obj: [22, 0, 16.2], night: 0, label: 'Enfermaria Apolo' },
      colina:    { cam: [24, 10, 26], look: [32, 6, 30], spawn: [21, 0, 21], obj: [25, 0, 23.5], night: 1, label: 'Colina Meio-Sangue' },
      anfiteatro:{ cam: [-2, 9, -2], look: [-8, 0, -34], spawn: [-8, 0, -21], obj: [-8, 0, -25], night: 0, label: 'Anfiteatro' },
      labirinto: { cam: [-34, 6, 8], look: [-42, 1, 2], spawn: [-34, 0, 10], obj: [-42, 0, 2], night: 1, label: 'Entrada do Labirinto' },
    };

    this.resize();
    addEventListener('resize', () => this.resize());
    addEventListener('keydown', e => { this.keys[e.code] = true; if (['ArrowUp','ArrowDown','Space'].includes(e.code)) e.preventDefault(); });
    addEventListener('keyup', e => { this.keys[e.code] = false; });

    // orbit com mouse
    this.yaw = 0; this.dragging = false; this.px = 0;
    this.renderer.domElement.addEventListener('pointerdown', e => { this.dragging = true; this.px = e.clientX; });
    addEventListener('pointerup', () => this.dragging = false);
    addEventListener('pointermove', e => { if (this.dragging) { this.yaw -= (e.clientX - this.px) * 0.005; this.px = e.clientX; } });

    this.clock = new THREE.Clock();
    this.t = 0;
    this.followMode = true;
    this.setLocation('lago');
    this.loop();
  }

  resize() {
    const w = this.container.clientWidth || 800, h = this.container.clientHeight || 500;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  mat(c, e = '#000', ei = 0) { return new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: ei, roughness: 0.85 }); }

  box(x, y, z, w, h, d, m, parent = this.scene) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true;
    parent.add(o); return o;
  }

  buildTerrain() {
    const g = new THREE.Mesh(new THREE.CircleGeometry(70, 48), this.mat('#2c6e3f'));
    g.rotation.x = -Math.PI / 2; g.receiveShadow = true; this.scene.add(g);
    // caminhos
    const pathM = this.mat('#c9b183');
    [[0, 0.02, 0, 6, 60], [0, 0.02, 0, 60, 6]].forEach(([x, y, z, w, d]) => {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), pathM);
      p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); p.receiveShadow = true; this.scene.add(p);
    });
    // tochas
    this.torches = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const x = Math.cos(a) * 26, z = Math.sin(a) * 26;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.4, 6), this.mat('#5a3a1e'));
      pole.position.set(x, 1.2, z); this.scene.add(pole);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8),
        new THREE.MeshStandardMaterial({ color: '#ffb300', emissive: '#ff7700', emissiveIntensity: 2.4 }));
      flame.position.set(x, 2.7, z); this.scene.add(flame);
      const l = new THREE.PointLight('#ff9a2e', 6, 12); l.position.set(x, 2.8, z); this.scene.add(l);
      this.torches.push(flame);
    }
  }

  buildLake() {
    this.lakeMat = new THREE.MeshStandardMaterial({ color: '#1e90ff', transparent: true, opacity: 0.9, roughness: 0.25, metalness: 0.1, emissive: '#06263f', emissiveIntensity: 0.6 });
    const lake = new THREE.Mesh(new THREE.CircleGeometry(10, 40), this.lakeMat);
    lake.rotation.x = -Math.PI / 2; lake.position.set(-18, 0.05, 8); lake.receiveShadow = true;
    this.scene.add(lake);
    // píer
    const wood = this.mat('#7a5230');
    this.box(-16, 0.4, 8, 6, 0.25, 2.2, wood);
    [[-18.4, 8.8], [-18.4, 7.2], [-14, 8.8], [-14, 7.2]].forEach(([x, z]) => this.box(x, -0.2, z, 0.3, 1.4, 0.3, wood));
    // canoas
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 2.4, 4, 8), this.mat(i % 2 ? '#c0392b' : '#e67e22'));
      c.rotation.z = Math.PI / 2; c.rotation.y = 0.3 * i;
      c.position.set(-20 - i * 1.6, 0.35, 5 + i * 1.8); c.castShadow = true; this.scene.add(c);
    }
  }

  setLakeBlood(blood) {
    this.lakeMat.color.set(blood ? '#c1121f' : '#1e90ff');
    this.lakeMat.emissive.set(blood ? '#4d0202' : '#06263f');
  }

  buildCabins() {
    const cols = ['#1e90ff', '#f5b301', '#7a3cff', '#c0392b', '#2ecc71', '#e67e22'];
    cols.forEach((c, i) => {
      const x = -10 + i * 4.4, z = 4;
      this.box(x, 1.2, z, 3.4, 2.4, 3, this.mat(c));
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.9, 1.4, 4), this.mat('#3b2a1a'));
      roof.position.set(x, 3.1, z); roof.rotation.y = Math.PI / 4; roof.castShadow = true; this.scene.add(roof);
      const num = this.makeLabel((i + 1).toString(), '#fff');
      num.position.set(x, 1.6, z + 1.6); this.scene.add(num);
    });
  }

  buildBigHouse() {
    this.box(18, 2, -14, 10, 4, 7, this.mat('#9db4c0'));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5.6, 2.2, 4), this.mat('#5d2a2a'));
    roof.position.set(18, 5.1, -14); roof.rotation.y = Math.PI / 4; roof.castShadow = true; this.scene.add(roof);
    const t = this.makeLabel('CASA GRANDE', '#0b1e3a'); t.position.set(18, 3.6, -9.8); t.scale.set(2.4, 1.2, 1); this.scene.add(t);
  }

  buildOracle() {
    // sótão brilhante verde
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#39ff88', emissive: '#00ff66', emissiveIntensity: 2, transparent: true, opacity: 0.85 }));
    glow.position.set(18, 5.5, -14); this.scene.add(glow);
    this.oracleGlow = glow;
  }

  buildHill() {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(9, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), this.mat('#35924a'));
    hill.position.set(32, 0, 30); hill.castShadow = true; hill.receiveShadow = true; this.scene.add(hill);
    // pinheiro de Thalia
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 4, 8), this.mat('#5a3a1e'));
    trunk.position.set(32, 9.5, 30); trunk.castShadow = true; this.scene.add(trunk);
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(3.2 - i * 0.7, 2.6, 8), this.mat('#14532d'));
      cone.position.set(32, 12 + i * 1.8, 30); cone.castShadow = true; this.scene.add(cone);
    }
    // velo de ouro brilhando
    const fleece = new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 10),
      new THREE.MeshStandardMaterial({ color: '#ffd700', emissive: '#ffaa00', emissiveIntensity: 2.2 }));
    fleece.position.set(33.4, 10.6, 30); this.scene.add(fleece);
    this.fleece = fleece;
    // barreira mágica
    const dome = new THREE.Mesh(new THREE.SphereGeometry(14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.4),
      new THREE.MeshBasicMaterial({ color: '#ffd700', transparent: true, opacity: 0.07, side: THREE.DoubleSide }));
    dome.position.set(32, 0, 30); this.scene.add(dome);
  }

  buildAmphitheater() {
    for (let r = 0; r < 5; r++) {
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(9 - r * 1.4, 9 - r * 1.4, 0.7, 20, 1, false, 0, Math.PI), this.mat(r % 2 ? '#8a8f98' : '#a9b0bc'));
      ring.position.set(-8, 0.35 + r * 0.7, -30); ring.receiveShadow = true; ring.castShadow = true; this.scene.add(ring);
    }
    this.box(-8, 0.5, -27, 5, 1, 3, this.mat('#6b4a2b')); // palco
    // tocha central
    const fire = new THREE.Mesh(new THREE.SphereGeometry(0.7, 10, 10),
      new THREE.MeshStandardMaterial({ color: '#ffcf33', emissive: '#ff6a00', emissiveIntensity: 3 }));
    fire.position.set(-8, 1.8, -27); this.scene.add(fire);
    this.stageFire = fire;
    const pl = new THREE.PointLight('#ff9a2e', 30, 25); pl.position.set(-8, 3, -27); this.scene.add(pl);
  }

  buildForest() {
    this.forestGroup = new THREE.Group(); this.scene.add(this.forestGroup);
    for (let i = 0; i < 60; i++) {
      const x = -48 + Math.random() * 24, z = -34 + Math.random() * 24;
      if (Math.hypot(x + 38, z + 24) < 5) continue;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.4, 6), this.mat('#4a2f1a'));
      t.position.set(x, 1.2, z); t.castShadow = true; this.forestGroup.add(t);
      const c = new THREE.Mesh(new THREE.ConeGeometry(1.5 + Math.random(), 3, 7), this.mat('#0f3d26'));
      c.position.set(x, 3.6, z); c.castShadow = true; this.forestGroup.add(c);
    }
    // portal de Hécate
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.18, 10, 32),
      new THREE.MeshStandardMaterial({ color: '#ff2e88', emissive: '#b44dff', emissiveIntensity: 2.5 }));
    ring.position.set(-38, 2.2, -24); this.scene.add(ring);
    this.portal = ring;
  }

  buildInfirmary() {
    this.box(22, 1.5, 12, 7, 3, 5, this.mat('#f4f1ea'));
    this.box(22, 3.4, 12, 7.4, 0.4, 5.4, this.mat('#e74c3c'));
    const cross = this.makeLabel('+', '#e74c3c'); cross.position.set(22, 2, 14.6); cross.scale.set(2, 2, 1); this.scene.add(cross);
  }

  buildLabyrinth() {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI - Math.PI / 2;
      this.box(-42 + Math.cos(a) * 5, 1.5, 2 + Math.sin(a) * 5, 1.4, 3, 1.4, this.mat('#5d6d7e'));
    }
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(2.2, 20, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: '#000', emissive: '#7a3cff', emissiveIntensity: 0.7 }));
    mouth.position.set(-42, 0.2, 2); mouth.rotation.x = -0.2; this.scene.add(mouth);
  }

  buildOlympus() {
    // Olimpo ao longe nas nuvens
    const g = new THREE.Group(); g.position.set(0, 55, -120); this.scene.add(g);
    for (let i = 0; i < 8; i++) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 12 + Math.random() * 8, 8), this.mat('#e8eef7'));
      t.position.set((i - 4) * 6, 0, Math.random() * 8); g.add(t);
    }
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(30, 12, 10),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.16 }));
    cloud.scale.y = 0.35; g.add(cloud);
    const glow = new THREE.PointLight('#fff7cc', 60, 200); glow.position.copy(g.position); this.scene.add(glow);
    this.olympus = g;
  }

  makeLabel(text, color = '#fff') {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96;
    const cx = cv.getContext('2d');
    cx.fillStyle = 'rgba(0,0,0,0.55)'; cx.fillRect(0, 0, 256, 96);
    cx.fillStyle = color; cx.font = 'bold 44px system-ui'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(text.slice(0, 12), 128, 50);
    const tx = new THREE.CanvasTexture(cv);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthTest: false }));
    sp.scale.set(2.1, 0.8, 1);
    return sp;
  }

  makeFigure(color, name) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.9, 4, 10),
      new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
    body.position.y = 1.05; body.castShadow = true; g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 14, 14), this.mat('#f2c89b'));
    head.position.y = 2.05; head.castShadow = true; g.add(head);
    // arma/ícone
    const tag = this.makeLabel(name, '#fff'); tag.position.y = 2.8; tag.scale.set(1.7, 0.65, 1); g.add(tag);
    this.scene.add(g);
    return g;
  }

  buildPlayer() {
    this.player = this.makeFigure('#1e90ff', 'PERCY');
    this.playerPos = new THREE.Vector3(0, 0, 0);
    this.playerSpeed = 9;
  }

  setHero(quem, cor, nome) {
    this.player.children[0].material.color.set(cor);
    const old = this.player.children.find(c => c.isSprite);
    if (old) { this.player.remove(old); }
    const tag = this.makeLabel(nome.toUpperCase(), '#ffe27a'); tag.position.y = 2.8; this.player.add(tag);
  }

  buildNPCs() {
    this.npcs = [];
    const defs = [
      ['ANNABETH', '#f5b301', 2, 4.5], ['GROVER', '#8a5a2b', -14, 5],
      ['CLARISSE', '#c0392b', 13.5, -7.5], ['QUÍRON', '#ffffff', 22.5, -7.5],
      ['WILL', '#ffd93b', 23.5, 16.5], ['KASSANDRA', '#ff2e88', -38, -22],
      ['RACHEL', '#39ff88', 16.3, -7.6], ['THALIA', '#9fb3c8', 24.5, 21.5],
    ];
    defs.forEach(([n, c, x, z]) => {
      const f = this.makeFigure(c, n); f.position.set(x, 0, z);
      this.npcs.push({ mesh: f, base: new THREE.Vector3(x, 0, z), phase: Math.random() * 6 });
    });
  }

  buildBeacon() {
    const geo = new THREE.CylinderGeometry(0.9, 0.9, 7, 20, 1, true);
    this.beaconMat = new THREE.MeshBasicMaterial({ color: '#ffe27a', transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });
    this.beacon = new THREE.Mesh(geo, this.beaconMat);
    this.beacon.position.set(0, 3.5, 0); this.scene.add(this.beacon);
    this.ring = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.9, 32),
      new THREE.MeshBasicMaterial({ color: '#ffe27a', transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
    this.ring.rotation.x = -Math.PI / 2; this.ring.position.set(0, 0.08, 0); this.scene.add(this.ring);
  }

  setLocation(name) {
    this.locName = name;
    const L = this.LOCS[name] || this.LOCS.lago;
    this.playerPos.set(...L.spawn);
    this.beacon.position.set(L.obj[0], 3.5, L.obj[2]);
    this.ring.position.set(L.obj[0], 0.08, L.obj[2]);
    this.arrived = false;
    const night = L.night ? 1 : 0;
    this.scene.background.set(night ? '#070b24' : '#0b1e3a');
    this.scene.fog.color.set(night ? '#070b24' : '#0b1e3a');
    this.hemi.intensity = night ? 0.45 : 0.85;
    this.sun.intensity = night ? 0.5 : 1.6;
    this.sun.color.set(night ? '#8fa8ff' : '#fff2cc');
    this.magicLight.intensity = night ? 40 : 8;
    this.magicLight.color.set('#b44dff');
    const LP = this.LOCS[name];
    this.magicLight.position.set(LP.obj[0], 4, LP.obj[2]);
    this.setLakeBlood(name === 'lago');
    this.resize();
  }

  update(dt) {
    this.t += dt;
    // tochas tremeluzem
    this.torches.forEach((f, i) => { f.scale.setScalar(1 + Math.sin(this.t * 9 + i) * 0.15); });
    if (this.portal) this.portal.rotation.z += dt * 1.2;
    if (this.fleece) this.fleece.position.y = 10.6 + Math.sin(this.t * 2) * 0.2;
    if (this.oracleGlow) this.oracleGlow.scale.setScalar(1 + Math.sin(this.t * 3) * 0.12);
    if (this.stageFire) this.stageFire.scale.setScalar(1 + Math.sin(this.t * 7) * 0.2);
    this.beaconMat.opacity = 0.28 + Math.sin(this.t * 3) * 0.12;
    const s = 1 + Math.sin(this.t * 3) * 0.15;
    this.ring.scale.set(s, s, 1);
    // npcs idle
    this.npcs.forEach(n => { n.mesh.position.y = Math.sin(this.t * 2 + n.phase) * 0.06; n.mesh.rotation.y += dt * 0.15; });

    // movimento
    const fwd = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(fwd.z, 0, -fwd.x);
    const mv = new THREE.Vector3();
    if (this.keys.KeyW || this.keys.ArrowUp) mv.add(fwd);
    if (this.keys.KeyS || this.keys.ArrowDown) mv.sub(fwd);
    if (this.keys.KeyA || this.keys.ArrowLeft) mv.add(right);
    if (this.keys.KeyD || this.keys.ArrowRight) mv.sub(right);
    // joystick virtual
    if (this.joy) mv.addScaledVector(new THREE.Vector3(this.joy.x, 0, this.joy.y), 1);
    if (mv.lengthSq() > 0) {
      mv.normalize().multiplyScalar(this.playerSpeed * dt);
      const np = this.playerPos.clone().add(mv);
      if (np.length() < 62) this.playerPos.copy(np);
      if (mv.lengthSq() > 0.00001) this.player.rotation.y = Math.atan2(mv.x, mv.z);
      // balanço andando
      this.player.position.y = Math.abs(Math.sin(this.t * 10)) * 0.12;
    }
    this.player.position.set(this.playerPos.x, this.player.position.y, this.playerPos.z);

    // chegada ao objetivo
    const L = this.LOCS[this.locName];
    const d = Math.hypot(this.playerPos.x - L.obj[0], this.playerPos.z - L.obj[2]);
    this.distToObj = d;
    if (d < 3.2 && !this.arrived) { this.arrived = true; this.onArrive && this.onArrive(); }

    // câmera: segue jogador mas olha para objetivo inicialmente
    const cx = this.playerPos.x - Math.sin(this.yaw) * -10.5;
    const cz = this.playerPos.z - Math.cos(this.yaw) * -10.5;
    const desired = new THREE.Vector3(cx, 8.2, cz);
    this.camera.position.lerp(desired, 1 - Math.pow(0.001, dt));
    this.camera.lookAt(this.playerPos.x, 1.6, this.playerPos.z);
  }

  loop() {
    requestAnimationFrame(() => this.loop());
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (!document.hidden) { this.update(dt); this.renderer.render(this.scene, this.camera); }
  }
}
