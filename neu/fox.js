// Raluca, the 2D cartoon fox (SVG with separate moving parts). Kept as its own module so a 3D
// Raluca can replace it later without touching the lessons.
// Usage: mountFox(container) → { trick(name), setMood(m), tricks, el }; tricks: happy, jump, spin, sit, paw, down,
// and with the ball: fetch, catch, balance.
// Moods (CSS classes on the container): happy, ok, hungry, sad.
// Version 2 (2026-11-12): smoother shapes, idle breathing/blinking, softer moves, fixed slots for clothes
// (#wear-ear, #wear-head, #wear-eyes, #wear-mouth in the head; #wear-neck, #wear-leash on the body; #wear-toy on the ground).
// 2026-11-13: white muzzle reaches up to the nose (no more 'beard'), chest fluff without outline; ball tricks.
// All pivots are in the SVG's own units (transform-box: view-box in app.css), so clothes never shift them.

const OUT = '#6b3417';

const SVG = `
<svg viewBox="0 0 400 400" role="img" aria-label="Raluca, der Fuchs" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f6"/><stop offset="1" stop-color="#eef8fc"/></linearGradient>
<linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3df95"/><stop offset="1" stop-color="#86c46a"/></linearGradient>
<radialGradient id="furG" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ffb26a"/><stop offset=".6" stop-color="#f48a37"/><stop offset="1" stop-color="#dc6b25"/></radialGradient>
<radialGradient id="headG" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#ffb571"/><stop offset=".65" stop-color="#f68c39"/><stop offset="1" stop-color="#de6e27"/></radialGradient>
<linearGradient id="tailG" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#dc6b25"/><stop offset=".55" stop-color="#f48a37"/><stop offset="1" stop-color="#ffab62"/></linearGradient>
<linearGradient id="legG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ea7a2c"/><stop offset=".5" stop-color="#9a4a1f"/><stop offset=".75" stop-color="#5c2e17"/><stop offset="1" stop-color="#4a2514"/></linearGradient>
<linearGradient id="legFarG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c95f22"/><stop offset=".5" stop-color="#7d3b19"/><stop offset="1" stop-color="#3e1f10"/></linearGradient>
<radialGradient id="creamG" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fbeedd"/></radialGradient>
<radialGradient id="eyeG" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#8a5428"/><stop offset=".55" stop-color="#3b2010"/><stop offset="1" stop-color="#160b05"/></radialGradient>
</defs>
<g id="scene">
<rect width="400" height="400" fill="url(#sky)"/>
<ellipse cx="80" cy="70" rx="38" ry="14" fill="#fff" opacity=".85"/><ellipse cx="108" cy="62" rx="26" ry="12" fill="#fff" opacity=".85"/>
<ellipse cx="320" cy="96" rx="30" ry="11" fill="#fff" opacity=".75"/>
<path d="M0 250 Q100 226 200 244 T400 238 V400 H0Z" fill="url(#meadow)"/>
<g fill="#6fb257"><path d="M30 300 l4 -14 l4 14z"/><path d="M350 330 l4 -14 l4 14z"/><path d="M300 280 l3 -10 l3 10z"/><path d="M70 372 l4 -14 l4 14z"/></g>
<g><circle cx="340" cy="300" r="4" fill="#fff"/><circle cx="340" cy="300" r="1.6" fill="#f5c84a"/><circle cx="36" cy="330" r="4" fill="#fff"/><circle cx="36" cy="330" r="1.6" fill="#f5c84a"/></g>
<g id="bowl">
<ellipse cx="62" cy="368" rx="36" ry="6" fill="#000" opacity=".12"/>
<path d="M30 344 L94 344 L86 366 L38 366 Z" fill="#3f78d6"/>
<ellipse cx="62" cy="344" rx="32" ry="7" fill="#2f63b8"/>
<ellipse cx="62" cy="342" rx="26" ry="4.5" fill="#b9733c"/>
<circle cx="53" cy="340" r="3.6" fill="#a5612c"/><circle cx="65" cy="339" r="3.6" fill="#a5612c"/><circle cx="74" cy="341" r="3" fill="#a5612c"/>
<text x="62" y="360" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="9.5" font-weight="800" fill="#fff">RALUCA</text>
</g>
</g>
<ellipse id="shadow" cx="224" cy="352" rx="100" ry="10" fill="#000" opacity=".14"/>
<g id="wear-toy"></g>
<g id="mover"><g id="fox" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
<g id="wear-leash"></g>
<g id="tail">
<path d="M286 272 C318 280 358 266 374 232 C388 200 380 166 356 154 C342 148 330 154 328 164 C344 174 350 196 338 218 C326 240 302 250 280 254 Z" fill="url(#tailG)"/>
<path d="M356 154 C380 166 388 198 378 226 C370 214 360 206 348 204 C354 190 352 172 340 160 C346 154 350 152 356 154 Z" fill="url(#creamG)"/>
<path d="M312 254 q10 -2 18 -10 M330 236 q8 -6 12 -16" fill="none" stroke="#c75d1e" stroke-width="1.6" opacity=".6"/>
</g>
<path id="legBL" d="M258 286 C256 306 256 326 258 342 Q267 349 277 342 C279 326 281 306 281 288 Z" fill="url(#legFarG)"/>
<path id="legFL" d="M176 288 C174 308 174 326 176 342 Q185 349 195 342 C197 326 197 308 197 290 Z" fill="url(#legFarG)"/>
<g id="torso">
<path d="M156 254 C156 222 192 208 236 210 C280 212 308 232 308 266 C308 298 278 312 236 312 C194 312 158 296 156 268 Z" fill="url(#furG)"/>
<path d="M164 270 C172 298 202 308 226 304 C206 294 192 276 190 254 C178 254 168 260 164 270 Z" fill="url(#creamG)" stroke="none"/>
<path d="M214 222 C244 216 276 222 294 240" fill="none" stroke="#ffc68f" stroke-width="5" opacity=".55"/>
</g>
<path id="legBR" d="M276 290 C274 310 274 330 276 346 Q287 353 298 346 C300 330 302 310 302 286 Z" fill="url(#legG)"/>
<path id="legFR" d="M190 292 C188 312 188 332 190 348 Q201 355 212 348 C214 332 214 312 214 294 Z" fill="url(#legG)"/>
<path d="M196 349 v-5 M201 350 v-5 M206 349 v-5 M282 347 v-5 M287 348 v-5 M292 347 v-5" stroke="#2b140a" stroke-width="1.4" opacity=".6"/>
<path id="ruff" d="M142 226 Q154 258 184 264 Q212 258 224 228 Q206 240 184 240 Q160 240 142 226 Z" fill="url(#creamG)" stroke="none"/>
<g id="wear-neck"></g>
<g id="head">
<g id="earL"><path d="M112 134 C106 106 114 82 132 66 C150 82 160 108 162 132 Z" fill="url(#headG)"/><path d="M121 126 C118 106 124 90 133 82 C144 96 150 112 151 128 Z" fill="#5a2e17" stroke="none"/><path d="M128 128 C127 114 130 104 135 96 C141 106 144 118 144 130 Z" fill="#ffe3cc" stroke="none"/></g>
<g id="earR"><path d="M228 134 C234 106 226 82 208 66 C190 82 180 108 178 132 Z" fill="url(#headG)"/><path d="M219 126 C222 106 216 90 207 82 C196 96 190 112 189 128 Z" fill="#5a2e17" stroke="none"/><path d="M212 128 C213 114 210 104 205 96 C199 106 196 118 196 130 Z" fill="#ffe3cc" stroke="none"/></g>
<path d="M106 166 C106 128 136 104 170 104 C204 104 234 128 234 166 C234 178 231 187 226 195 L242 201 L224 207 C212 227 193 240 170 240 C147 240 128 227 116 207 L98 201 L114 195 C109 187 106 178 106 166 Z" fill="url(#headG)"/>
<path d="M109 184 C122 178 138 184 150 178 C158 174 163 170 170 170 C177 170 182 174 190 178 C202 184 218 178 231 184 C230 190 228 194 226 196 L240 201 L224 207 C212 227 193 239 170 239 C147 239 128 227 116 207 L100 201 L114 196 C112 193 110 189 109 184 Z" fill="url(#creamG)" stroke="none"/>
<path d="M114 195 L98 201 L116 207 C128 227 147 240 170 240 C193 240 212 227 224 207 L242 201 L226 195" fill="none"/>
<path d="M156 110 Q170 150 184 110" fill="#ffc07f" stroke="none" opacity=".55"/>
<g stroke="none">
<ellipse cx="146" cy="163" rx="13" ry="16" fill="url(#eyeG)"/>
<ellipse cx="194" cy="163" rx="13" ry="16" fill="url(#eyeG)"/>
<circle cx="150.5" cy="156.5" r="5" fill="#fff"/><circle cx="198.5" cy="156.5" r="5" fill="#fff"/>
<circle cx="142" cy="169" r="2.2" fill="#fff" opacity=".85"/><circle cx="190" cy="169" r="2.2" fill="#fff" opacity=".85"/>
<ellipse id="lidL" cx="146" cy="162" rx="14.5" ry="17.5" fill="#f48a37"/>
<ellipse id="lidR" cx="194" cy="162" rx="14.5" ry="17.5" fill="#f48a37"/>
</g>
<path id="browL" d="M134 141 q12 -7 24 -1" fill="none" stroke-width="2.4"/>
<path id="browR" d="M182 140 q12 -6 24 1" fill="none" stroke-width="2.4"/>
<path d="M160 189 C160 182 180 182 180 189 C180 196 174 199 170 199 C166 199 160 196 160 189 Z" fill="#2a1508"/>
<ellipse cx="166" cy="186" rx="3.6" ry="2" fill="#fff" opacity=".75" stroke="none"/>
<g id="mouth"><path d="M170 199 L170 204 M160 204 Q165 211 170 204 Q175 211 180 204" fill="none" stroke-width="2.2"/><path d="M166 208 Q170 216 174 208 Z" fill="#f28a8a" stroke-width="1.6"/></g>
<ellipse cx="127" cy="188" rx="10" ry="6" fill="#ff9c9c" opacity=".5" stroke="none"/>
<ellipse cx="213" cy="188" rx="10" ry="6" fill="#ff9c9c" opacity=".5" stroke="none"/>
<g id="wear-mouth"></g><g id="wear-eyes"></g><g id="wear-head"></g><g id="wear-ear"></g>
</g>
</g></g>
<g id="ballfx" style="display:none" stroke="#7a1d12" stroke-width="2"><circle r="14" fill="#e8483a"/><path d="M-13 -4 Q0 6 13 -4" fill="none" stroke="#fff" stroke-width="3.4"/><circle cx="-5" cy="-7" r="3.4" fill="#fff" opacity=".6" stroke="none"/></g>
</svg>
`;

const SOFT = 'cubic-bezier(.45,0,.25,1)';
const BALL_TRICKS = ['fetch', 'catch', 'balance'];

export function mountFox(container) {
  container.innerHTML = SVG;
  const q = (id) => container.querySelector('#' + id);
  const fox = q('fox'), head = q('head'), torso = q('torso'), tail = q('tail'), shadow = q('shadow'), ruff = q('ruff');
  const legFR = q('legFR'), legFL = q('legFL'), legBR = q('legBR'), legBL = q('legBL'), earL = q('earL'), earR = q('earR');
  const neck = q('wear-neck'), leash = q('wear-leash'), ball = q('ballfx');
  const A = (el, k, o) => el.animate(k, Object.assign({ duration: 900, easing: SOFT }, o)).finished;
  const many = (els, k, o) => els.forEach((e) => e && e.animate(k, Object.assign({ easing: SOFT }, o)));
  let busy = false;

  const T = {
    jump: async () => {
      const d = 1100;
      shadow.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: 0.18 }, { transform: 'scale(.55)', offset: 0.5 }, { transform: 'scale(1.05)', offset: 0.82 }, { transform: 'scale(1)' }], { duration: d, easing: SOFT });
      many([legFR, legFL], [{ transform: 'none' }, { transform: 'rotate(6deg)', offset: 0.18 }, { transform: 'rotate(-38deg)', offset: 0.5 }, { transform: 'rotate(4deg)', offset: 0.82 }, { transform: 'none' }], { duration: d });
      many([legBR, legBL], [{ transform: 'none' }, { transform: 'rotate(-6deg)', offset: 0.18 }, { transform: 'rotate(34deg)', offset: 0.5 }, { transform: 'rotate(-4deg)', offset: 0.82 }, { transform: 'none' }], { duration: d });
      tail.animate([{ transform: 'none' }, { transform: 'rotate(10deg)', offset: 0.5 }, { transform: 'none' }], { duration: d, easing: SOFT });
      await A(fox, [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(6px) scale(1.05, .9)', offset: 0.18, easing: 'cubic-bezier(.2,.7,.4,1)' },
        { transform: 'translateY(-118px) scale(.97, 1.05)', offset: 0.5, easing: 'cubic-bezier(.6,0,.8,.4)' },
        { transform: 'translateY(4px) scale(1.06, .9)', offset: 0.82 },
        { transform: 'translateY(0) scale(1, 1)' }], { duration: d, easing: 'linear' });
    },
    spin: async () => {
      const d = 1300;
      shadow.animate([{ transform: 'scale(1)' }, { transform: 'scale(.85)', offset: 0.5 }, { transform: 'scale(1)' }], { duration: d });
      await A(fox, [
        { transform: 'translateY(0) scaleX(1)' },
        { transform: 'translateY(-14px) scaleX(0)', offset: 0.25 },
        { transform: 'translateY(-22px) scaleX(-1)', offset: 0.5 },
        { transform: 'translateY(-14px) scaleX(0)', offset: 0.75 },
        { transform: 'translateY(0) scaleX(1)' }], { duration: d, easing: 'ease-in-out' });
    },
    happy: async () => {
      const d = 1200;
      tail.animate([{ transform: 'none' }, { transform: 'rotate(-18deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-18deg)' }, { transform: 'rotate(10deg)' }, { transform: 'none' }], { duration: d, easing: 'ease-in-out' });
      earL.animate([{ transform: 'none' }, { transform: 'rotate(-10deg)', offset: 0.3 }, { transform: 'rotate(4deg)', offset: 0.6 }, { transform: 'none' }], { duration: d, easing: SOFT });
      earR.animate([{ transform: 'none' }, { transform: 'rotate(10deg)', offset: 0.3 }, { transform: 'rotate(-4deg)', offset: 0.6 }, { transform: 'none' }], { duration: d, easing: SOFT });
      fox.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)', offset: 0.25 }, { transform: 'translateY(0)', offset: 0.5 }, { transform: 'translateY(-6px)', offset: 0.75 }, { transform: 'translateY(0)' }], { duration: d, easing: 'ease-in-out' });
      await A(head, [{ transform: 'none' }, { transform: 'rotate(-8deg)', offset: 0.3 }, { transform: 'rotate(6deg)', offset: 0.65 }, { transform: 'none' }], { duration: d });
    },
    sit: async () => {
      // rear stays on the ground, the front comes up (rotate around the hip at 285,318)
      const d = 2500, hold = (a, b) => [{ transform: 'none' }, { transform: a, offset: 0.28 }, { transform: b || a, offset: 0.78 }, { transform: 'none' }];
      const body = 'translate(85px, 14px) rotate(17deg) translate(-85px, -14px)';
      many([torso, ruff, neck, leash], hold(body), { duration: d });
      tail.animate(hold('translate(4px, 22px) rotate(20deg)'), { duration: d, easing: SOFT });
      many([legBR, legBL], hold('translate(-6px, 26px) scale(1.3, .5)'), { duration: d });
      many([legFR, legFL], hold('translateY(-27px) scale(1, 1.5)'), { duration: d });
      shadow.animate(hold('scale(.85, 1)'), { duration: d, easing: SOFT });
      await A(head, hold('translate(-4px, -40px) rotate(-5deg)', 'translate(-4px, -40px) rotate(5deg)'), { duration: d });
    },
    down: async () => {
      const d = 2600, hold = (a) => [{ transform: 'none' }, { transform: a, offset: 0.3 }, { transform: a, offset: 0.78 }, { transform: 'none' }];
      many([legFR, legFL, legBR, legBL], hold('translateY(40px) scale(1.1, .22)'), { duration: d });
      many([torso, ruff, neck, leash], hold('translateY(36px)'), { duration: d });
      tail.animate(hold('translateY(38px) rotate(16deg)'), { duration: d, easing: SOFT });
      earL.animate(hold('rotate(-14deg)'), { duration: d, easing: SOFT });
      earR.animate(hold('rotate(14deg)'), { duration: d, easing: SOFT });
      await A(head, hold('translate(-6px, 44px) rotate(5deg)'), { duration: d });
    },
    paw: async () => {
      const d = 1900;
      head.animate([{ transform: 'none' }, { transform: 'rotate(-9deg)', offset: 0.3 }, { transform: 'rotate(-9deg)', offset: 0.7 }, { transform: 'none' }], { duration: d, easing: SOFT });
      fox.animate([{ transform: 'none' }, { transform: 'rotate(2deg)', offset: 0.3 }, { transform: 'rotate(2deg)', offset: 0.7 }, { transform: 'none' }], { duration: d, easing: SOFT });
      await A(legFR, [{ transform: 'none' }, { transform: 'rotate(78deg)', offset: 0.3 }, { transform: 'rotate(66deg)', offset: 0.45 }, { transform: 'rotate(78deg)', offset: 0.6 }, { transform: 'rotate(70deg)', offset: 0.72 }, { transform: 'none' }], { duration: d });
    },
    // ---- ball tricks (need the ball from the shop). The ball is drawn above the fox and follows her mouth.
    // Mouth: (170, 207) when she stands still; ground: y 336. Fox pivot: x 224 (mirroring maps x → 448 − x).
    fetch: async () => {
      const d = 4200, at = (x, y, offset, rot = 0) => ({ transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, offset });
      const run = [{ transform: 'none' }, { transform: 'rotate(-28deg)' }, { transform: 'rotate(24deg)' }, { transform: 'rotate(-28deg)' }, { transform: 'rotate(24deg)' }, { transform: 'none' }];
      many([legFR, legBL], run, { duration: d / 3, iterations: 3, easing: 'linear' });
      const run2 = [{ transform: 'none' }, { transform: 'rotate(24deg)' }, { transform: 'rotate(-28deg)' }, { transform: 'rotate(24deg)' }, { transform: 'rotate(-28deg)' }, { transform: 'none' }];
      many([legFL, legBR], run2, { duration: d / 3, iterations: 3, easing: 'linear' });
      tail.animate([{ transform: 'none' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(10deg)' }, { transform: 'none' }], { duration: d / 4, iterations: 4 });
      shadow.animate([
        { transform: 'none', offset: 0 }, { transform: 'translateX(-120px)', offset: 0.4 }, { transform: 'translateX(-120px)', offset: 0.5 },
        { transform: 'none', offset: 0.85 }, { transform: 'none', offset: 1 }], { duration: d, easing: 'linear' });
      ball.animate([
        at(116, 336, 0), at(40, 370, 0.25, -400), at(40, 370, 0.42, -400),
        at(50, 207, 0.48), at(158, 207, 0.52), at(278, 207, 0.85), at(278, 207, 0.9), at(130, 336, 1, -200)], { duration: d, easing: 'linear' });
      await A(fox, [
        { transform: 'none', offset: 0 }, { transform: 'translateX(-120px)', offset: 0.4 },
        { transform: 'translateX(-120px) translateY(6px)', offset: 0.46 }, { transform: 'translateX(-120px)', offset: 0.48 },
        { transform: 'translateX(-120px) scaleX(-1)', offset: 0.52 }, { transform: 'scaleX(-1)', offset: 0.85 },
        { transform: 'scaleX(-1)', offset: 0.9 }, { transform: 'scaleX(1)', offset: 1 }], { duration: d, easing: 'linear' });
    },
    catch: async () => {
      const d = 2400, at = (x, y, offset) => ({ transform: `translate(${x}px, ${y}px)`, offset });
      shadow.animate([{ transform: 'none' }, { transform: 'none', offset: 0.3 }, { transform: 'scale(.55)', offset: 0.5 }, { transform: 'none', offset: 0.7 }, { transform: 'none' }], { duration: d, easing: 'linear' });
      many([legFR, legFL], [{ transform: 'none' }, { transform: 'none', offset: 0.3 }, { transform: 'rotate(-38deg)', offset: 0.5 }, { transform: 'none', offset: 0.7 }, { transform: 'none' }], { duration: d, easing: 'linear' });
      many([legBR, legBL], [{ transform: 'none' }, { transform: 'none', offset: 0.3 }, { transform: 'rotate(34deg)', offset: 0.5 }, { transform: 'none', offset: 0.7 }, { transform: 'none' }], { duration: d, easing: 'linear' });
      tail.animate([{ transform: 'none' }, { transform: 'rotate(-18deg)', offset: 0.75 }, { transform: 'rotate(10deg)', offset: 0.85 }, { transform: 'none' }], { duration: d });
      ball.animate([
        at(-20, 60, 0), at(80, 40, 0.25), at(150, 70, 0.42), at(170, 99, 0.5), at(170, 207, 0.7), at(170, 207, 0.86), at(130, 336, 1)], { duration: d, easing: 'linear' });
      await A(fox, [
        { transform: 'none', offset: 0 }, { transform: 'translateY(6px) scale(1.05, .9)', offset: 0.25 },
        { transform: 'translateY(-108px)', offset: 0.5 }, { transform: 'translateY(4px) scale(1.05, .92)', offset: 0.68 },
        { transform: 'none', offset: 0.75 }, { transform: 'none', offset: 1 }], { duration: d, easing: 'linear' });
    },
    balance: async () => {
      const d = 3600, at = (x, y, offset, rot = 0) => ({ transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, offset });
      earL.animate([{ transform: 'none' }, { transform: 'rotate(-12deg)', offset: 0.3 }, { transform: 'rotate(-12deg)', offset: 0.8 }, { transform: 'none' }], { duration: d, easing: SOFT });
      earR.animate([{ transform: 'none' }, { transform: 'rotate(12deg)', offset: 0.3 }, { transform: 'rotate(12deg)', offset: 0.8 }, { transform: 'none' }], { duration: d, easing: SOFT });
      head.animate([
        { transform: 'none', offset: 0 }, { transform: 'none', offset: 0.25 }, { transform: 'rotate(-4deg)', offset: 0.4 },
        { transform: 'rotate(4deg)', offset: 0.52 }, { transform: 'rotate(-4deg)', offset: 0.64 }, { transform: 'rotate(3deg)', offset: 0.74 },
        { transform: 'none', offset: 0.8 }, { transform: 'translateY(8px)', offset: 0.84 }, { transform: 'none', offset: 0.9 }, { transform: 'none', offset: 1 }], { duration: d, easing: 'ease-in-out' });
      tail.animate([{ transform: 'none' }, { transform: 'rotate(-10deg)', offset: 0.5 }, { transform: 'none' }], { duration: d / 2, iterations: 2 });
      await A(ball, [
        at(116, 336, 0), at(130, 120, 0.12), at(166, 70, 0.2), at(170, 92, 0.25),
        at(160, 92, 0.4, -30), at(180, 92, 0.52, 30), at(160, 92, 0.64, -30), at(176, 92, 0.74, 20), at(170, 92, 0.8),
        at(170, 30, 0.88), at(150, 200, 0.95), at(130, 336, 1)], { duration: d, easing: 'linear' });
    },
  };

  async function trick(name) {
    if (busy || !T[name] || !fox.animate) return;
    busy = true;
    const withBall = BALL_TRICKS.includes(name);
    container.classList.add('doing-trick');
    if (withBall) { container.classList.add('doing-ball'); ball.style.display = ''; }
    try { await T[name](); } catch { /* animation cancelled */ }
    ball.style.display = 'none';
    container.classList.remove('doing-trick', 'doing-ball');
    busy = false;
  }
  function setMood(m) {
    ['happy', 'ok', 'hungry', 'sad'].forEach((x) => container.classList.toggle('mood-' + x, x === m));
  }
  return { trick, setMood, tricks: Object.keys(T), el: fox };
}
