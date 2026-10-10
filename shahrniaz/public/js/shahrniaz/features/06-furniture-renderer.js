/* مسئولیت این فایل: مدل‌ها، نور، متریال و نمایش سه‌بعدی مبلمان. */
/** Shahr Niaz: furniture-renderer. Original execution order: 6. */
window.Furniture3D = (() => {
  const T = window.THREE,
    D = window.FURNITURE;
  const textureCache = new Map();
  /** texture: furniture-renderer feature. Keep related handlers in this module. */
  function texture(kind) {
    if (textureCache.has(kind)) return textureCache.get(kind);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d");
    let seed = 381;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    ctx.fillStyle = "#e9e9e9";
    ctx.fillRect(0, 0, 512, 512);
    if (kind === "wood") {
      for (let i = 0; i < 800; i++) {
        const x = random() * 512;
        ctx.strokeStyle = `rgba(${random() > 0.5 ? "255,255,255" : "40,30,20"},${0.03 + random() * 0.15})`;
        ctx.lineWidth = 0.3 + random() * 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        for (let y = 0; y <= 512; y += 12)
          ctx.lineTo(x + Math.sin(y / 85 + i) * 3 + Math.sin(y / 31 + i) * 0.9, y);
        ctx.stroke();
      }
    } else if (kind === "fabric") {
      ctx.fillStyle = "#bbb";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 512; i += 3) {
        ctx.strokeStyle = i % 2 ? "#a1a1a1" : "#d0d0d0";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    } else {
      const a = ctx.getImageData(0, 0, 512, 512);
      for (let i = 0; i < a.data.length; i += 4) {
        const v = 165 + random() * 65;
        a.data[i] = a.data[i + 1] = a.data[i + 2] = v;
        a.data[i + 3] = 255;
      }
      ctx.putImageData(a, 0, 0);
      if (kind === "stone") {
        for (let i = 0; i < 90; i++) {
          ctx.strokeStyle = "rgba(70,70,65,.07)";
          ctx.beginPath();
          const y = random() * 512;
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(150, y - 40, 300, y + 80, 512, y + 50);
          ctx.stroke();
        }
      }
    }
    const map = new T.CanvasTexture(canvas);
    map.wrapS = map.wrapT = T.RepeatWrapping;
    map.repeat.set(kind === "fabric" ? 5 : 1, kind === "fabric" ? 5 : 1);
    map.anisotropy = 4;
    textureCache.set(kind, map);
    return map;
  }
  /** makeMaterials: furniture-renderer feature. Keep related handlers in this module. */
  function makeMaterials(config) {
    const materials = {};
    const get = (id) => {
      const m = D.materials[id] || D.materials.oak;
      return new T.MeshPhysicalMaterial({
        color: m.color,
        roughness:
          m.kind === "metal" ? 0.3 : m.kind === "stone" ? 0.32 : m.kind === "paint" ? 0.38 : 0.5,
        metalness: m.kind === "metal" ? 0.72 : 0,
        map: m.kind === "wood" ? texture("wood") : m.kind === "stone" ? texture("stone") : null,
        bumpMap: ["wood", "stone"].includes(m.kind) ? texture(m.kind) : null,
        bumpScale: m.kind === "wood" ? 0.003 : 0.005,
        clearcoat: m.kind === "stone" ? 0.32 : m.kind === "paint" ? 0.18 : 0,
        clearcoatRoughness: 0.34,
      });
    };
    materials.body = get(config.material);
    materials.front = get(config.frontMaterial || config.material);
    materials.counter = get(config.counterMaterial || "stone");
    materials.base = get(config.baseMaterial || config.material);
    materials.dark = new T.MeshStandardMaterial({
      color: "#252824",
      roughness: 0.32,
      metalness: 0.65,
    });
    materials.glass = new T.MeshPhysicalMaterial({
      color: "#0d1110",
      roughness: 0.12,
      metalness: 0.3,
      clearcoat: 0.65,
    });
    materials.steel = new T.MeshStandardMaterial({
      color: "#b7b8b2",
      roughness: 0.2,
      metalness: 0.9,
    });
    materials.inside = get(config.material);
    materials.inside.color.multiplyScalar(0.78);
    materials.upholstery = new T.MeshStandardMaterial({
      color: D.colors[config.color]?.color || "#c5b69c",
      roughness: config.upholstery === "leather" ? 0.47 : 0.95,
      bumpMap: texture(config.upholstery || "fabric"),
      bumpScale: config.upholstery === "leather" ? 0.002 : 0.0015,
    });
    materials.seam = materials.upholstery.clone();
    materials.seam.color.multiplyScalar(0.85);
    return materials;
  }
  function rounded(w, h, d, r = 0.025) {
    return new window.SNRoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 3, h / 3, d / 3));
  }
  /** build: furniture-renderer feature. Keep related handlers in this module. */
  function build(type, c, options = {}) {
    const root = new T.Group(),
      m = makeMaterials(c),
      w = c.width / 100,
      h = c.height / 100,
      d = c.depth / 100;
    const add = (geo, mat, x, y, z, parent = root, bay = null) => {
      const mesh = new T.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      if (bay !== null) mesh.userData.bay = bay;
      parent.add(mesh);
      return mesh;
    };
    const box = (a, b, e, x, y, z, mat = m.body, r = 0, parent = root, bay = null) =>
      add(r ? rounded(a, b, e, r) : new T.BoxGeometry(a, b, e), mat, x, y, z, parent, bay);
    const cyl = (r1, r2, len, x, y, z, mat = m.body, parent = root, bay = null) =>
      add(new T.CylinderGeometry(r1, r2, len, 24), mat, x, y, z, parent, bay);
    const frontPanel = (pw, ph, x, y, z, parent = root, bay = null) => {
      const door = box(pw, ph, 0.023, x, y, z, m.front, 0.002, parent, bay),
        style = c.doorStyle || "slab",
        groove = c.groove || "none";
      if (style === "shaker" || groove === "frame") {
        const rail = 0.018,
          off = 0.035;
        box(pw - off * 2, rail, 0.008, x, y + ph / 2 - off, z + 0.016, m.front, 0.002, parent, bay);
        box(pw - off * 2, rail, 0.008, x, y - ph / 2 + off, z + 0.016, m.front, 0.002, parent, bay);
        box(rail, ph - off * 2, 0.008, x - pw / 2 + off, y, z + 0.016, m.front, 0.002, parent, bay);
        box(rail, ph - off * 2, 0.008, x + pw / 2 - off, y, z + 0.016, m.front, 0.002, parent, bay);
      }
      if (groove === "vertical")
        for (let gx = -pw / 2 + 0.035; gx < pw / 2 - 0.02; gx += 0.045)
          box(0.005, ph - 0.04, 0.006, x + gx, y, z + 0.016, m.dark, 0.001, parent, bay);
      return door;
    };
    const handle = (style, x, y, z, parent = root, bay = null) => {
      if (style === "none" || style === "profile") return;
      if (style === "bar") {
        const bar = box(0.013, 0.16, 0.026, x, y, z, m.dark, 0.005, parent, bay);
        bar.castShadow = false;
      } else {
        const knob = cyl(0.016, 0.016, 0.025, x, y, z, m.dark, parent, bay);
        knob.rotation.x = Math.PI / 2;
        knob.castShadow = false;
      }
    };
    if (type === "table") {
      const top = c.thickness / 100;
      box(w, top, d, 0, h - top / 2, 0, m.body, c.edge === "soft" ? 0.028 : 0.004);
      if (c.legs === "four") {
        for (const x of [-1, 1])
          for (const z of [-1, 1]) {
            cyl(
              0.035,
              0.024,
              h - top,
              x * (w / 2 - 0.11),
              (h - top) / 2,
              z * (d / 2 - 0.11),
              m.base,
            );
          }
        box(w - 0.18, 0.085, 0.04, 0, h - top - 0.075, -d / 2 + 0.11, m.base);
        box(w - 0.18, 0.085, 0.04, 0, h - top - 0.075, d / 2 - 0.11, m.base);
      }
      if (c.legs === "trestle") {
        for (const x of [-1, 1]) {
          box(0.07, h - top - 0.07, d * 0.7, x * w * 0.32, (h - top) / 2, 0, m.base, 0.008);
          box(0.24, 0.045, d * 0.8, x * w * 0.32, 0.025, 0, m.base, 0.008);
        }
        box(w * 0.67, 0.06, 0.06, 0, 0.2, 0, m.base, 0.005);
      }
      if (c.legs === "pedestal") {
        cyl(Math.min(w, d) * 0.2, Math.min(w, d) * 0.24, h - top, 0, (h - top) / 2, 0, m.base);
        cyl(Math.min(w, d) * 0.35, Math.min(w, d) * 0.35, 0.035, 0, 0.02, 0, m.base);
      }
    }
    if (type === "chair") {
      const sh = c.seatHeight / 100;
      for (const x of [-1, 1])
        for (const z of [-1, 1]) {
          const leg = cyl(
            0.024,
            0.017,
            sh - 0.065,
            x * (w / 2 - 0.055),
            (sh - 0.065) / 2,
            z * (d / 2 - 0.07),
          );
          leg.rotation.z = -x * 0.035;
        }
      box(w - 0.04, 0.045, d - 0.06, 0, sh - 0.055, 0, m.body, 0.016);
      box(w - 0.045, 0.075, d - 0.07, 0, sh - 0.007, 0.008, m.upholstery, 0.033);
      for (const x of [-1, 1])
        box(
          0.035,
          h - sh + 0.07,
          0.035,
          x * (w / 2 - 0.055),
          (h + sh) / 2 - 0.015,
          -d / 2 + 0.07,
          m.body,
          0.008,
        );
      const back = box(
        w - 0.075,
        Math.min(0.28, h - sh - 0.06),
        0.065,
        0,
        h - 0.15,
        -d / 2 + 0.065,
        m.upholstery,
        0.025,
      );
      back.rotation.x = -0.06;
      if (c.arms)
        for (const x of [-1, 1]) {
          box(0.045, 0.04, d * 0.8, x * (w / 2 - 0.018), sh + 0.2, -0.01, m.body, 0.017);
          box(0.028, 0.21, 0.028, x * (w / 2 - 0.018), sh + 0.1, d * 0.26, m.body, 0.004);
        }
    }
    if (type === "sofa") {
      const sh = c.seatHeight / 100,
        arm = c.armWidth / 100,
        legH = 0.1,
        baseH = Math.max(0.12, sh - 0.21);
      for (const x of [-1, 1])
        for (const z of [-1, 1])
          cyl(0.025, 0.019, legH, x * (w / 2 - 0.14), legH / 2, z * (d / 2 - 0.13), m.body);
      box(w - 0.08, baseH, d - 0.06, 0, legH + baseH / 2, 0, m.upholstery, 0.05);
      box(
        w - 2 * arm - 0.01,
        h - legH - 0.04,
        0.12,
        0,
        (h + legH - 0.04) / 2,
        -d / 2 + 0.055,
        m.upholstery,
        0.03,
      );
      const seatW = (w - 2 * arm - 0.025 * (c.seats + 1)) / c.seats,
        seatD = d - 0.23;
      for (let i = 0; i < c.seats; i++) {
        const x = -w / 2 + arm + 0.025 + seatW / 2 + i * (seatW + 0.025);
        box(seatW, 0.17, seatD, x, sh - 0.085, 0.075, m.upholstery, 0.06);
        const back = box(
          seatW,
          h - sh - 0.035,
          0.2,
          x,
          sh + (h - sh) / 2 - 0.025,
          -d / 2 + 0.13,
          m.upholstery,
          0.065,
        );
        back.rotation.x = -0.07;
        if (c.tufted)
          for (let row = 0; row < 2; row++)
            for (let n = 0; n < 2; n++) {
              const button = add(
                new T.SphereGeometry(0.009, 12, 8),
                m.seam,
                x + (n ? 1 : -1) * seatW * 0.23,
                sh + 0.11 + row * (h - sh) * 0.43,
                -d / 2 + 0.241,
              );
              button.scale.z = 0.45;
            }
      }
      for (const x of [-1, 1])
        box(
          arm,
          h * 0.77 - legH,
          d - 0.025,
          x * (w / 2 - arm / 2),
          (h * 0.77 + legH) / 2,
          0,
          m.upholstery,
          0.045,
        );
    }
    if (type === "cabinet") {
      const t = 0.019,
        plinth = 0.085;
      box(w, 0.075, d - 0.055, 0, 0.04, 0, m.body, 0.004);
      box(w, t, d, 0, plinth, 0);
      box(w, t, d, 0, h - t / 2, 0);
      box(w, h - plinth, 0.009, 0, (h + plinth) / 2, -d / 2 + 0.008, m.inside);
      box(t, h - plinth, d, -w / 2 + t / 2, (h + plinth) / 2, 0);
      box(t, h - plinth, d, w / 2 - t / 2, (h + plinth) / 2, 0);
      let left = -w / 2;
      c.bays.forEach((bay, i) => {
        const bw = bay.actualWidth / 100,
          center = left + bw / 2,
          inner = bw - t * 1.7;
        if (i > 0) box(t, h - plinth, d, left, (h + plinth) / 2, 0, m.body, 0, root, i);
        const floor = plinth + 0.035,
          ceiling = h - 0.055,
          usable = ceiling - floor;
        if (bay.type === "shelves")
          for (let j = 1; j <= bay.shelves; j++)
            box(
              inner,
              t,
              d - 0.035,
              center,
              floor + (usable * j) / (bay.shelves + 1),
              0.006,
              m.body,
              0.002,
              root,
              i,
            );
        if (bay.type === "hang") {
          box(inner, t, d - 0.035, center, h - 0.35, 0.006, m.body, 0.002, root, i);
          const rail = cyl(0.012, 0.012, inner - 0.035, center, h - 0.44, 0, m.dark, root, i);
          rail.rotation.z = Math.PI / 2;
          box(inner, t, d - 0.035, center, 0.37, 0.006, m.body, 0.002, root, i);
        }
        if (bay.type === "drawers") {
          const dh = Math.min(0.23, (usable * 0.62) / bay.drawers);
          for (let j = 0; j < bay.drawers; j++) {
            box(
              inner,
              dh - 0.01,
              d - 0.055,
              center,
              floor + dh * (j + 0.5),
              0.005,
              m.body,
              0.003,
              root,
              i,
            );
            box(
              inner - 0.012,
              0.027,
              0.025,
              center,
              floor + dh * (j + 0.5) + dh * 0.25,
              d / 2 - 0.012,
              m.dark,
              0.005,
              root,
              i,
            );
          }
          const start = floor + dh * bay.drawers + 0.06;
          for (let j = 1; j <= bay.shelves; j++)
            box(
              inner,
              t,
              d - 0.035,
              center,
              start + ((ceiling - start) * j) / (bay.shelves + 1),
              0.006,
              m.body,
              0.002,
              root,
              i,
            );
        }
        // Invisible selection planes allow clicking a bay even through open shelves.
        const hit = add(
          new T.PlaneGeometry(inner, h - plinth),
          new T.MeshBasicMaterial({ visible: false }),
          center,
          (h + plinth) / 2,
          d / 2 + 0.04,
          root,
          i,
        );
        hit.userData.pickSurface = true;
        if (c.doors && !options.inside) {
          frontPanel(
            bw - 0.005,
            h - plinth - 0.005,
            center,
            (h + plinth) / 2,
            d / 2 + 0.016,
            root,
            i,
          );
          handle(c.handles, left + bw - 0.045, h * 0.48, d / 2 + 0.041, root, i);
        }
        if (options.inside && options.selected === i) {
          const lineGeo = new T.BufferGeometry().setFromPoints([
            new T.Vector3(left + 0.01, plinth, d / 2 + 0.025),
            new T.Vector3(left + bw - 0.01, plinth, d / 2 + 0.025),
            new T.Vector3(left + bw - 0.01, h, d / 2 + 0.025),
            new T.Vector3(left + 0.01, h, d / 2 + 0.025),
            new T.Vector3(left + 0.01, plinth, d / 2 + 0.025),
          ]);
          root.add(new T.Line(lineGeo, new T.LineBasicMaterial({ color: "#738054" })));
        }
        left += bw;
      });
    }
    if (type === "kitchen" && Array.isArray(c.modules)) {
      const surfaceMaterial = (id) => {
          const src = D.materials[id] || D.materials.white;
          return new T.MeshPhysicalMaterial({
            color: src.color,
            roughness: src.kind === "stone" ? 0.42 : src.kind === "wood" ? 0.56 : 0.72,
            map:
              src.kind === "wood"
                ? texture("wood")
                : src.kind === "stone"
                  ? texture("stone")
                  : null,
            bumpMap: ["wood", "stone"].includes(src.kind) ? texture(src.kind) : null,
            bumpScale: 0.003,
            clearcoat: src.kind === "stone" ? 0.16 : 0,
          });
        },
        floorMat = surfaceMaterial(c.floorFinish || "stone"),
        highlightMat = new T.LineBasicMaterial({ color: "#c7ff62" });
      const roomPoints = () => {
          if (c.roomShape === "lroom")
            return [
              [-w / 2, -d / 2],
              [w / 2, -d / 2],
              [w / 2, d * 0.08],
              [w * 0.22, d * 0.08],
              [w * 0.22, d / 2],
              [-w / 2, d / 2],
            ];
          if (c.roomShape === "angled") {
            const rise = d * 0.34,
              run = Math.min(
                w * 0.38,
                rise / Math.tan(((Number(c.cornerAngle) || 40) * Math.PI) / 180),
              );
            return [
              [-w / 2, -d / 2],
              [w / 2, -d / 2],
              [w / 2, d / 2],
              [-w / 2 + run, d / 2],
              [-w / 2, d / 2 - rise],
            ];
          }
          return [
            [-w / 2, -d / 2],
            [w / 2, -d / 2],
            [w / 2, d / 2],
            [-w / 2, d / 2],
          ];
        },
        rp = roomPoints(),
        shape = new T.Shape();
      rp.forEach(([x, z], i) => (i ? shape.lineTo(x, z) : shape.moveTo(x, z)));
      shape.closePath();
      const floor = add(new T.ShapeGeometry(shape), floorMat, 0, 0.012, 0);
      floor.rotation.x = Math.PI / 2;
      floor.receiveShadow = true;
      for (let i = 0; i < rp.length; i++) {
        const a = rp[i],
          b = rp[(i + 1) % rp.length],
          dx = b[0] - a[0],
          dz = b[1] - a[1],
          mx = (a[0] + b[0]) / 2,
          mz = (a[1] + b[1]) / 2,
          length = Math.hypot(dx, dz),
          wallId = ["north", "east", "south", "west", "west", "south"][i] || "north";
        if (mz <= -d * 0.12 || mx <= -w * 0.12) {
          const wall = box(
            length,
            h,
            0.035,
            mx,
            h / 2,
            mz,
            surfaceMaterial(c.wallFinishes?.[wallId] || "white"),
          );
          wall.rotation.y = -Math.atan2(dz, dx);
          wall.userData.wall = wallId;
          if (options.selectedWall === wallId) {
            const edge = new T.LineSegments(new T.EdgesGeometry(wall.geometry), highlightMat);
            wall.add(edge);
          }
        }
      }
      (c.customWalls || []).forEach((def) => {
        const angle = ((def.angle || 0) * Math.PI) / 180,
          length = def.length / 100,
          wh = (def.height || c.height) / 100,
          cx = def.x / 100 + (Math.cos(angle) * length) / 2,
          cz = def.y / 100 + (Math.sin(angle) * length) / 2,
          wall = box(
            length,
            wh,
            0.045,
            cx,
            wh / 2,
            cz,
            surfaceMaterial(c.wallFinishes?.[def.id] || "white"),
          );
        wall.rotation.y = -angle;
        wall.userData.wall = def.id;
        if (options.selectedWall === def.id) {
          const edge = new T.LineSegments(new T.EdgesGeometry(wall.geometry), highlightMat);
          wall.add(edge);
        }
      });
      const lightColor =
          c.lightingMood === "neutral"
            ? "#f5f4ef"
            : c.lightingMood === "dramatic"
              ? "#ffd09b"
              : "#ffe5bd",
        lightPower = (c.lightIntensity || 1) * 1.2,
        count = Math.max(0, c.ceilingLights || 0);
      for (let i = 0; i < count; i++) {
        const x = count === 1 ? 0 : -w * 0.35 + w * 0.7 * (i / (count - 1));
        cyl(0.055, 0.075, 0.035, x, h - 0.025, 0, m.dark);
        add(
          new T.SphereGeometry(0.035, 16, 10),
          new T.MeshBasicMaterial({ color: lightColor }),
          x,
          h - 0.055,
          0,
        );
        const lamp = new T.PointLight(lightColor, lightPower, 4.5, 2);
        lamp.position.set(x, h - 0.12, 0);
        root.add(lamp);
      }
      const moduleMaterial = (id) => {
        const src = D.materials[id] || D.materials[c.frontMaterial] || D.materials.white;
        return new T.MeshPhysicalMaterial({
          color: src.color,
          roughness:
            src.kind === "metal"
              ? 0.3
              : src.kind === "stone"
                ? 0.32
                : src.kind === "paint"
                  ? 0.38
                  : 0.5,
          metalness: src.kind === "metal" ? 0.7 : 0,
          map:
            src.kind === "wood" ? texture("wood") : src.kind === "stone" ? texture("stone") : null,
          bumpMap: ["wood", "stone"].includes(src.kind) ? texture(src.kind) : null,
          bumpScale: 0.003,
          clearcoat: src.kind === "stone" ? 0.3 : src.kind === "paint" ? 0.18 : 0,
          clearcoatRoughness: 0.35,
        });
      };
      const backsplash = surfaceMaterial(c.backsplashFinish || "marble");
      box(w, 0.58, 0.018, 0, 1.18, -d / 2 + 0.025, backsplash);
      box(0.018, 0.58, Math.max(0.2, d - 0.7), -w / 2 + 0.025, 1.18, 0.18, backsplash);
      c.modules.forEach((mod, index) => {
        const mw = mod.width / 100,
          md = mod.depth / 100,
          mh = mod.height / 100,
          elevation = mod.elevation / 100,
          group = new T.Group();
        group.userData.module = mod.id;
        const along = (mod.offset + mod.width / 2) / 100;
        if (mod.run === "north") group.position.set(-w / 2 + along, elevation, -d / 2 + md / 2);
        if (mod.run === "south") {
          group.position.set(-w / 2 + along, elevation, d / 2 - md / 2);
          group.rotation.y = Math.PI;
        }
        if (mod.run === "west") {
          group.position.set(-w / 2 + md / 2, elevation, -d / 2 + along);
          group.rotation.y = Math.PI / 2;
        }
        if (mod.run === "east") {
          group.position.set(w / 2 - md / 2, elevation, -d / 2 + along);
          group.rotation.y = -Math.PI / 2;
        }
        if (mod.run === "island" || mod.run === "free") {
          group.position.set((mod.offset || 0) / 100, elevation, (mod.crossOffset || 0) / 100);
          group.rotation.y = ((Number(mod.rotation) || 0) * Math.PI) / 180;
        }
        const customWall = (c.customWalls || []).find((x) => x.id === mod.run);
        if (customWall) {
          const a = ((customWall.angle || 0) * Math.PI) / 180,
            along = (mod.offset + mod.width / 2) / 100;
          group.position.set(
            customWall.x / 100 + Math.cos(a) * along - (Math.sin(a) * md) / 2,
            elevation,
            customWall.y / 100 + Math.sin(a) * along + (Math.cos(a) * md) / 2,
          );
          group.rotation.y = -a;
        }
        root.add(group);
        const finish = moduleMaterial(mod.finish || c.frontMaterial),
          frontZ = md / 2 + 0.014;
        const mb = (a, b, e, x, y, z, mat = m.body, r = 0.002) =>
          box(a, b, e, x, y, z, mat, r, group, mod.id);
        if (mod.kind === "diningTable") {
          mb(mw, 0.065, md, 0, mh - 0.04, 0, m.counter, 0.025);
          const leg = 0.055;
          for (const x of [-mw * 0.38, mw * 0.38])
            for (const z of [-md * 0.35, md * 0.35])
              mb(leg, mh - 0.06, leg, x, (mh - 0.06) / 2, z, m.dark, 0.012);
        } else if (mod.kind === "diningChair") {
          const seatY = Math.min(0.47, mh * 0.55),
            leg = 0.035;
          mb(mw * 0.82, 0.065, md * 0.82, 0, seatY, 0, finish, 0.035);
          for (const x of [-mw * 0.32, mw * 0.32])
            for (const z of [-md * 0.3, md * 0.3])
              mb(leg, seatY, leg, x, seatY / 2, z, m.dark, 0.01);
          mb(mw * 0.76, mh - seatY, 0.065, 0, seatY + (mh - seatY) / 2, -md * 0.34, finish, 0.025);
        } else if (["fridge", "dishwasher", "oven"].includes(mod.kind)) {
          mb(mw, mh, md, 0, mh / 2, 0, m.body, 0.01);
          if (mod.kind === "fridge") {
            const style = c.fridgeStyle || "steelSide",
              fridgeMat =
                style === "whiteTop"
                  ? moduleMaterial("white")
                  : style === "blackFrench"
                    ? moduleMaterial("black")
                    : m.steel;
            if (style === "steelSide") {
              mb((mw - 0.035) / 2, mh - 0.03, 0.026, -mw * 0.255, mh / 2, frontZ, fridgeMat, 0.01);
              mb((mw - 0.035) / 2, mh - 0.03, 0.026, mw * 0.255, mh / 2, frontZ, fridgeMat, 0.01);
              mb(0.018, mh * 0.45, 0.022, -0.04, mh * 0.52, frontZ + 0.025, m.dark, 0.004);
              mb(0.018, mh * 0.45, 0.022, 0.04, mh * 0.52, frontZ + 0.025, m.dark, 0.004);
            } else if (style === "blackFrench") {
              for (const x of [-mw * 0.255, mw * 0.255])
                mb((mw - 0.035) / 2, mh * 0.62, 0.026, x, mh * 0.68, frontZ, fridgeMat, 0.01);
              mb(mw - 0.025, mh * 0.34, 0.026, 0, mh * 0.18, frontZ, fridgeMat, 0.01);
            } else {
              mb(mw - 0.025, mh * 0.29, 0.026, 0, mh * 0.85, frontZ, fridgeMat, 0.01);
              mb(mw - 0.025, mh * 0.68, 0.026, 0, mh * 0.35, frontZ, fridgeMat, 0.01);
            }
          }
          if (mod.kind === "dishwasher") {
            mb(mw - 0.025, mh - 0.025, 0.026, 0, mh / 2, frontZ, finish, 0.008);
            mb(mw * 0.75, 0.024, 0.022, 0, mh - 0.08, frontZ + 0.02, m.dark, 0.003);
          }
          if (mod.kind === "oven") {
            mb(mw - 0.035, mh * 0.68, 0.026, 0, mh * 0.48, frontZ, m.glass, 0.006);
            mb(mw * 0.72, 0.024, 0.02, 0, mh * 0.79, frontZ + 0.02, m.steel, 0.003);
            mb(mw - 0.04, mh * 0.22, 0.026, 0, mh * 0.89, frontZ, finish, 0.004);
          }
        } else if (mod.kind === "hood") {
          if (c.hoodStyle === "integrated") mb(mw, 0.22, md, 0, 0.11, 0, finish, 0.01);
          else if (c.hoodStyle === "island") {
            mb(mw, 0.12, md, 0, 0.06, 0, m.steel, 0.015);
            mb(0.08, mh - 0.12, 0.08, 0, (mh + 0.12) / 2, 0, m.steel, 0.006);
          } else {
            mb(mw, 0.16, md, 0, 0.08, 0, m.steel, 0.015);
            mb(mw * 0.36, mh - 0.16, md * 0.48, 0, (mh + 0.16) / 2, -md * 0.08, m.steel, 0.008);
          }
        } else {
          const t = 0.018;
          mb(mw, t, md, 0, t / 2, 0);
          mb(mw, t, md, 0, mh - t / 2, 0);
          mb(t, mh, md, -mw / 2 + t / 2, mh / 2, 0);
          mb(t, mh, md, mw / 2 - t / 2, mh / 2, 0);
          mb(mw, mh, 0.009, 0, mh / 2, -md / 2 + 0.006, m.inside);
          if (mod.front === "open") {
            for (let j = 1; j <= Math.max(1, mod.shelves || 1); j++)
              mb(
                mw - t * 2,
                t,
                md - 0.025,
                0,
                (mh * j) / (Math.max(1, mod.shelves || 1) + 1),
                0,
                m.body,
                0.002,
              );
          }
          if (mod.front === "drawers") {
            const count = Math.max(1, mod.drawers || 3),
              dh = (mh - 0.025) / count;
            for (let j = 0; j < count; j++) {
              mb(mw - 0.025, dh - 0.012, 0.025, 0, dh * (j + 0.5), frontZ, finish, 0.004);
              handle(
                mod.handle || c.handles,
                0,
                dh * (j + 0.5) + dh * 0.18,
                frontZ + 0.025,
                group,
                mod.id,
              );
            }
          } else if (mod.front !== "open") {
            const count = Math.max(1, mod.doors || 1),
              dw = (mw - 0.012) / count,
              glass = new T.MeshPhysicalMaterial({
                color: "#9bb0aa",
                roughness: 0.08,
                metalness: 0.08,
                transparent: true,
                opacity: 0.34,
                transmission: 0.28,
                clearcoat: 0.7,
              });
            for (let j = 0; j < count; j++) {
              const x = -mw / 2 + dw * (j + 0.5),
                isOpen = mod.doorState === "open",
                left = j < count / 2,
                doorMat = mod.frontType === "glass" ? glass : finish;
              if (isOpen) {
                const pivot = new T.Group(),
                  hinge = x + (left ? -dw / 2 : dw / 2);
                pivot.position.set(hinge, 0, frontZ);
                pivot.rotation.y = left ? -1.08 : 1.08;
                group.add(pivot);
                box(
                  dw - 0.01,
                  mh - 0.025,
                  0.025,
                  left ? dw / 2 : -dw / 2,
                  mh / 2,
                  0,
                  doorMat,
                  0.004,
                  pivot,
                  mod.id,
                );
              } else mb(dw - 0.01, mh - 0.025, 0.025, x, mh / 2, frontZ, doorMat, 0.004);
              if (!isOpen && (mod.style || c.doorStyle) === "shaker" && mod.frontType !== "glass") {
                const rail = 0.016,
                  off = 0.032;
                mb(dw - off * 2, rail, 0.007, x, mh - off, frontZ + 0.017, finish, 0.002);
                mb(dw - off * 2, rail, 0.007, x, off, frontZ + 0.017, finish, 0.002);
                mb(
                  rail,
                  mh - off * 2,
                  0.007,
                  x - dw / 2 + off,
                  mh / 2,
                  frontZ + 0.017,
                  finish,
                  0.002,
                );
                mb(
                  rail,
                  mh - off * 2,
                  0.007,
                  x + dw / 2 - off,
                  mh / 2,
                  frontZ + 0.017,
                  finish,
                  0.002,
                );
              }
              if (!isOpen && (mod.groove || c.groove) === "vertical" && mod.frontType !== "glass")
                for (let gx = -dw / 2 + 0.035; gx < dw / 2 - 0.02; gx += 0.045)
                  mb(0.004, mh - 0.05, 0.006, x + gx, mh / 2, frontZ + 0.018, m.dark, 0.001);
              if (!isOpen)
                handle(
                  mod.handle || c.handles,
                  x + (j < count / 2 ? dw * 0.3 : -dw * 0.3),
                  mh * 0.5,
                  frontZ + 0.03,
                  group,
                  mod.id,
                );
            }
            if (mod.internalLight === "warm") {
              const strip = mb(
                  mw - 0.08,
                  0.018,
                  0.018,
                  0,
                  mh - 0.045,
                  -md / 2 + 0.04,
                  new T.MeshBasicMaterial({ color: "#ffd49b" }),
                  0.002,
                ),
                lamp = new T.PointLight("#ffd49b", 0.65, 1.7, 2);
              lamp.position.set(0, mh * 0.68, 0);
              group.add(lamp);
            }
          }
          if (["sink", "hob"].includes(mod.kind)) {
            mb(mw + 0.025, 0.045, md + 0.04, 0, mh + 0.025, 0, m.counter, 0.006);
            if (mod.kind === "sink") {
              const double = c.sinkModel === "double",
                farm = c.sinkModel === "farmhouse",
                sw = Math.min(0.58, mw * 0.78),
                sd = Math.min(0.42, md * 0.72);
              if (double) {
                for (const x of [-sw * 0.26, sw * 0.26]) {
                  mb(sw * 0.47, 0.025, sd, x, mh + 0.055, 0, m.steel, 0.012);
                  mb(sw * 0.37, 0.012, sd * 0.68, x, mh + 0.072, 0, m.dark, 0.014);
                }
              } else {
                mb(sw, 0.025, sd, 0, mh + 0.055, 0, m.steel, 0.015);
                mb(sw * 0.74, 0.012, sd * 0.68, 0, mh + 0.072, 0, m.dark, 0.018);
              }
              if (farm) mb(sw, 0.22, 0.08, 0, mh - 0.08, md / 2 + 0.02, m.steel, 0.012);
              const tapH = c.tapModel === "square" ? 0.27 : 0.34,
                tap = cyl(0.014, 0.014, tapH, 0, mh + 0.2, -md * 0.3, m.steel, group, mod.id);
              tap.position.y = mh + 0.17;
              if (c.tapModel === "pullout")
                mb(0.055, 0.08, 0.04, 0.04, mh + 0.34, -md * 0.3, m.dark, 0.012);
            } else {
              mb(
                Math.min(0.58, mw * 0.82),
                0.018,
                Math.min(0.42, md * 0.7),
                0,
                mh + 0.056,
                0,
                m.glass,
                0.012,
              );
              for (const dx of [-0.15, 0.15])
                for (const dz of [-0.1, 0.1])
                  cyl(0.055, 0.055, 0.009, dx, mh + 0.072, dz, m.dark, group, mod.id);
            }
          } else if (["base", "island"].includes(mod.kind))
            mb(mw + 0.025, 0.045, md + 0.04, 0, mh + 0.025, 0, m.counter, 0.006);
        }
        if (options.selectedModule === mod.id) {
          const edges = new T.EdgesGeometry(new T.BoxGeometry(mw + 0.035, mh + 0.04, md + 0.035));
          const line = new T.LineSegments(edges, highlightMat);
          line.position.set(0, mh / 2, 0);
          group.add(line);
        }
      });
    } else if (type === "kitchen") {
      const unit = 0.6,
        baseH = 0.82,
        topY = 0.9,
        upperBottom = 1.42,
        upperH = Math.max(0.45, h - upperBottom - 0.08);
      const run = (length, px, pz, rotation = 0, primary = false) => {
        const group = new T.Group();
        group.position.set(px, 0, pz);
        group.rotation.y = rotation;
        root.add(group);
        const count = Math.max(3, Math.round(length / unit)),
          uw = length / count;
        box(length, 0.09, 0.62, 0, 0.045, 0, m.body, 0.004, group);
        box(length, 0.045, 0.67, 0, topY, 0, m.counter, 0.006, group);
        for (let i = 0; i < count; i++) {
          const x = -length / 2 + uw * (i + 0.5),
            isDish = primary && c.dishwasher && i === 1,
            isOven = primary && c.oven && i === count - 2;
          box(uw - 0.012, baseH - 0.07, 0.59, x, 0.47, 0, m.body, 0.004, group);
          if (isDish) {
            frontPanel(uw - 0.025, baseH - 0.1, x, 0.47, 0.307, group);
            box(uw - 0.08, 0.035, 0.015, x, 0.79, 0.325, m.dark, 0.004, group);
          } else if (isOven) {
            box(uw - 0.055, 0.52, 0.025, x, 0.49, 0.314, m.glass, 0.003, group);
            box(uw - 0.12, 0.025, 0.018, x, 0.73, 0.332, m.steel, 0.003, group);
          } else {
            frontPanel(uw - 0.025, baseH - 0.1, x, 0.47, 0.307, group);
            handle(c.handles, x + uw * 0.31, 0.49, 0.337, group);
          }
        }
        const upperCount = Math.max(2, Math.floor(count * 0.82)),
          upperW = length / upperCount;
        for (let i = 0; i < upperCount; i++) {
          const x = -length / 2 + upperW * (i + 0.5);
          box(
            upperW - 0.014,
            upperH,
            0.35,
            x,
            upperBottom + upperH / 2,
            -0.12,
            m.body,
            0.003,
            group,
          );
          frontPanel(upperW - 0.026, upperH - 0.02, x, upperBottom + upperH / 2, 0.066, group);
          handle(c.handles, x + upperW * 0.3, upperBottom + upperH * 0.45, 0.09, group);
        }
        if (primary && c.sink) {
          const sx = -length * 0.23;
          box(0.57, 0.018, 0.43, sx, topY + 0.031, 0, m.steel, 0.015, group);
          box(0.43, 0.012, 0.28, sx, topY + 0.041, 0, m.dark, 0.018, group);
          const tap = cyl(0.014, 0.014, 0.35, sx, 1.08, -0.23, m.steel, group);
          tap.position.y = 1.05;
        }
        if (primary && c.hob) {
          const hx = length * 0.22;
          box(0.58, 0.018, 0.42, hx, topY + 0.032, 0, m.glass, 0.01, group);
          for (const dx of [-0.16, 0.16])
            for (const dz of [-0.1, 0.1]) {
              const ring = cyl(0.065, 0.065, 0.009, hx + dx, topY + 0.047, dz, m.dark, group);
              ring.rotation.x = Math.PI / 2;
            }
        }
        if (primary && c.hood) {
          const hx = length * 0.22;
          box(0.68, 0.14, 0.43, hx, 1.66, -0.08, m.steel, 0.015, group);
          box(0.23, 0.55, 0.22, hx, 1.96, -0.08, m.steel, 0.01, group);
        }
        return group;
      };
      run(w, 0, -d / 2 + 0.34, 0, true);
      if (c.layout !== "straight")
        run(Math.max(1.5, d - 0.68), -w / 2 + 0.34, 0.34, Math.PI / 2, false);
      if (c.layout === "u") run(w * 0.72, 0, d / 2 - 0.34, Math.PI, false);
      if (c.fridge) {
        box(0.76, 2.04, 0.68, w / 2 - 0.42, 1.02, -d / 2 + 0.34, m.front, 0.018);
        box(0.65, 0.012, 0.02, w / 2 - 0.42, 1.02, -d / 2 + 0.69, m.dark, 0.004);
      }
      if (c.island) {
        const iw = Math.min(2.1, w * 0.55);
        box(iw, 0.82, 0.72, 0, 0.46, 0.28, m.body, 0.02);
        frontPanel(iw - 0.06, 0.7, 0, 0.47, -0.092);
        box(iw + 0.14, 0.055, 0.88, 0, 0.9, 0.28, m.counter, 0.012);
      }
    }
    root.userData = { type, config: c, width: w, height: h, depth: d };
    return root;
  }
  function disposeModel(root) {
    if (!root) return;
    const materials = new Set();
    root.traverse((o) => {
      o.geometry?.dispose();
      if (o.material)
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => materials.add(m));
    });
    materials.forEach((m) => m.dispose());
  }
  class Viewer {
    constructor(host, type, config, options = {}) {
      this.host = host;
      this.type = type;
      this.options = options;
      this.theta = 0.68;
      this.phi = 1.12;
      this.zoom = 1;
      this.pointers = new Map();
      this.disposed = false;
      this.renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = T.PCFSoftShadowMap;
      this.renderer.outputColorSpace = T.SRGBColorSpace;
      this.renderer.toneMapping = T.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.98;
      this.canvas = this.renderer.domElement;
      this.canvas.tabIndex = options.interactive === false ? -1 : 0;
      this.canvas.setAttribute("role", "img");
      this.canvas.setAttribute("aria-label", options.label || "Interactive 3D furniture preview");
      host.append(this.canvas);
      this.scene = new T.Scene();
      this.scene.background = new T.Color(
        document.body.classList.contains("experience-mode") ? "#0d110f" : "#e9e6de",
      );
      this.scene.fog = new T.Fog(this.scene.background, 12, 30);
      this.camera = new T.PerspectiveCamera(32, 1, 0.01, 60);
      this.scene.add(new T.HemisphereLight("#fff5df", "#6d766e", 2.15));
      const key = new T.DirectionalLight("#ffe9c9", 4.1);
      key.position.set(-4, 7, 5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.left = -5;
      key.shadow.camera.right = 5;
      key.shadow.camera.top = 5;
      key.shadow.camera.bottom = -5;
      key.shadow.normalBias = 0.04;
      key.shadow.bias = 0.00035;
      key.shadow.radius = 5;
      this.scene.add(key);
      const fill = new T.DirectionalLight("#d9e4ff", 2.0);
      fill.position.set(5, 4, -4);
      this.scene.add(fill);
      const rim = new T.DirectionalLight("#efffd5", 0.9);
      rim.position.set(0, 5, -6);
      this.scene.add(rim);
      this.floor = new T.Mesh(
        new T.PlaneGeometry(200, 200),
        new T.MeshStandardMaterial({
          color: document.body.classList.contains("experience-mode") ? "#171c19" : "#e9e6de",
          roughness: 1,
        }),
      );
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.position.y = -0.007;
      this.floor.receiveShadow = true;
      this.scene.add(this.floor);
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(host);
      this.abort = new AbortController();
      if (options.interactive !== false) this.bind();
      this.update(config, options);
      this.resize();
      host.dataset.ready = "true";
    }
    update(config, options = {}) {
      if (this.disposed) return;
      this.config = config;
      this.options = { ...this.options, ...options };
      if (this.model) {
        this.scene.remove(this.model);
        disposeModel(this.model);
      }
      this.model = build(this.type, config, this.options);
      this.scene.add(this.model);
      this.model.updateMatrixWorld(true);
      this.target = new T.Vector3(0, config.height / 200, 0);
      this.fit();
      this.render();
    }
    fit() {
      const c = this.config,
        w = c.width / 100,
        h = c.height / 100,
        d = c.depth / 100;
      this.baseDistance =
        Math.max(w / Math.max(this.camera.aspect, 0.5), h, d) * 2.05 + Math.max(w, d) * 0.5;
      this.positionCamera();
    }
    positionCamera() {
      const distance = this.baseDistance * this.zoom;
      this.camera.position.set(
        this.target.x + distance * Math.sin(this.phi) * Math.sin(this.theta),
        this.target.y + distance * Math.cos(this.phi),
        this.target.z + distance * Math.sin(this.phi) * Math.cos(this.theta),
      );
      this.camera.lookAt(this.target);
      this.camera.updateProjectionMatrix();
      this.camera.updateMatrixWorld(true);
    }
    resize() {
      if (this.disposed) return;
      const w = this.host.clientWidth,
        h = this.host.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.fit();
      this.render();
    }
    render() {
      if (this.disposed) return;
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = null;
        if (!this.disposed) {
          this.renderer.render(this.scene, this.camera);
          this.options.onRender?.(this);
        }
      });
    }
    setView(view) {
      if (view === "front") {
        this.theta = 0;
        this.phi = Math.PI / 2 - 0.001;
      } else if (view === "side") {
        this.theta = Math.PI / 2;
        this.phi = Math.PI / 2 - 0.001;
      } else if (view === "top") {
        this.theta = 0;
        this.phi = 0.001;
      } else {
        this.theta = 0.68;
        this.phi = 1.12;
        this.zoom = 1;
      }
      this.positionCamera();
      this.render();
    }
    changeZoom(delta) {
      this.zoom = Math.max(0.55, Math.min(1.8, this.zoom + delta));
      this.positionCamera();
      this.render();
    }
    bind() {
      const s = { signal: this.abort.signal },
        c = this.canvas;
      c.addEventListener(
        "pointerdown",
        (e) => {
          if (e.button !== 0) return;
          c.setPointerCapture(e.pointerId);
          this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          this.start = { x: e.clientX, y: e.clientY };
          this.moved = false;
          this.pinch = null;
          this.dragModule = this.type === "kitchen" ? this.moduleAt(e) : null;
          if (this.dragModule) this.options.onSelectModule?.(this.dragModule);
        },
        s,
      );
      c.addEventListener(
        "pointermove",
        (e) => {
          if (!this.pointers.has(e.pointerId)) return;
          const p = this.pointers.get(e.pointerId),
            dx = e.clientX - p.x,
            dy = e.clientY - p.y;
          this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (Math.hypot(e.clientX - this.start.x, e.clientY - this.start.y) > 5) this.moved = true;
          if (this.dragModule && this.moved) {
            const point = this.floorPoint(e);
            if (point)
              this.options.onMoveModule?.(this.dragModule, { x: point.x * 100, y: point.z * 100 });
            return;
          }
          if (this.pointers.size === 2) {
            const a = [...this.pointers.values()],
              distance = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
            if (this.pinch) this.changeZoom((this.pinch - distance) * 0.003);
            this.pinch = distance;
          } else {
            this.theta -= dx * 0.008;
            this.phi = Math.max(0.12, Math.min(Math.PI / 2 + 0.08, this.phi + dy * 0.006));
            this.positionCamera();
            this.render();
          }
        },
        s,
      );
      const up = (e) => {
        if (!this.pointers.has(e.pointerId)) return;
        this.pointers.delete(e.pointerId);
        if (!this.moved && ["cabinet", "kitchen"].includes(this.type)) this.pick(e);
        this.dragModule = null;
        this.pinch = null;
      };
      c.addEventListener("pointerup", up, s);
      c.addEventListener(
        "pointercancel",
        (e) => {
          this.pointers.delete(e.pointerId);
          this.dragModule = null;
        },
        s,
      );
      c.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          this.changeZoom(e.deltaY * 0.001);
        },
        { ...s, passive: false },
      );
      c.addEventListener(
        "keydown",
        (e) => {
          if (
            !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "-", "=", "Home"].includes(
              e.key,
            )
          )
            return;
          e.preventDefault();
          if (e.key === "Home") return this.setView("perspective");
          if (["+", "=", "-"].includes(e.key)) return this.changeZoom(e.key === "-" ? 0.1 : -0.1);
          if (e.key === "ArrowLeft") this.theta += 0.12;
          if (e.key === "ArrowRight") this.theta -= 0.12;
          if (e.key === "ArrowUp") this.phi = Math.max(0.12, this.phi - 0.1);
          if (e.key === "ArrowDown") this.phi = Math.min(Math.PI / 2 + 0.08, this.phi + 0.1);
          this.positionCamera();
          this.render();
        },
        s,
      );
    }
    ray(e) {
      const r = this.canvas.getBoundingClientRect(),
        ray = new T.Raycaster();
      ray.setFromCamera(
        new T.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        this.camera,
      );
      return ray;
    }
    moduleAt(e) {
      const hits = this.ray(e).intersectObjects(this.model.children, true);
      return (
        hits
          .map((x) => {
            let o = x.object;
            while (o && o !== this.model) {
              if (o.userData.module) return o.userData.module;
              o = o.parent;
            }
            return null;
          })
          .find(Boolean) || null
      );
    }
    floorPoint(e) {
      const point = new T.Vector3();
      return this.ray(e).ray.intersectPlane(new T.Plane(new T.Vector3(0, 1, 0), 0), point)
        ? point
        : null;
    }
    pick(e) {
      const hits = this.ray(e).intersectObjects(this.model.children, true),
        bay = hits.find((x) => Number.isInteger(x.object.userData.bay));
      if (bay) this.options.onSelect?.(bay.object.userData.bay);
      const wall = hits.find((x) => x.object.userData.wall);
      if (wall) this.options.onSelectWall?.(wall.object.userData.wall);
      const module = this.moduleAt(e);
      if (module) this.options.onSelectModule?.(module);
    }
    snapshot() {
      this.renderer.render(this.scene, this.camera);
      return this.canvas.toDataURL("image/png");
    }
    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      cancelAnimationFrame(this.frame);
      this.abort.abort();
      this.resizeObserver.disconnect();
      disposeModel(this.model);
      this.floor.geometry.dispose();
      this.floor.material.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.canvas.remove();
      delete this.host.dataset.ready;
    }
  }
  return { Viewer, build };
})();
