// Raluca, the 2D cartoon fox (SVG with separate moving parts). Kept as its own module so a 3D
// Raluca can replace it later without touching the lessons.
// Usage: mountFox(container) → { trick(name), setMood(m), el }; tricks: happy, jump, spin, sit, paw, down.
// Moods (CSS classes on the container): happy, ok, hungry, sad.

const SVG = `
<svg viewBox="0 0 400 400" role="img" aria-label="Raluca, der Fuchs">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3f6"/><stop offset="1" stop-color="#e9f6fb"/></linearGradient>
<linearGradient id="meadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d98b"/><stop offset="1" stop-color="#86c46a"/></linearGradient>
<radialGradient id="furG" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffa257"/><stop offset=".7" stop-color="#f07f2e"/><stop offset="1" stop-color="#d9651c"/></radialGradient>
<radialGradient id="headG" cx=".45" cy=".35" r=".75"><stop offset="0" stop-color="#ffab62"/><stop offset=".75" stop-color="#f3842f"/><stop offset="1" stop-color="#dc6a1f"/></radialGradient>
<linearGradient id="legG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2701f"/><stop offset=".55" stop-color="#7a3d1c"/><stop offset="1" stop-color="#4a2614"/></linearGradient>
<radialGradient id="eyeG" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#7a4a22"/><stop offset=".6" stop-color="#3b2010"/><stop offset="1" stop-color="#1c0f07"/></radialGradient>
</defs>
<rect width="400" height="400" fill="url(#sky)"/>
<ellipse cx="80" cy="70" rx="38" ry="14" fill="#fff" opacity=".8"/><ellipse cx="108" cy="62" rx="26" ry="12" fill="#fff" opacity=".8"/>
<ellipse cx="320" cy="96" rx="30" ry="11" fill="#fff" opacity=".7"/>
<path d="M0 250 Q100 225 200 245 T400 240 V400 H0Z" fill="url(#meadow)"/>
<g fill="#6fb257"><path d="M30 300 l4 -14 l4 14z"/><path d="M350 330 l4 -14 l4 14z"/><path d="M300 280 l3 -10 l3 10z"/><path d="M70 360 l4 -14 l4 14z"/></g>
<g><circle cx="340" cy="300" r="4" fill="#fff"/><circle cx="340" cy="300" r="1.6" fill="#f5c84a"/><circle cx="48" cy="330" r="4" fill="#fff"/><circle cx="48" cy="330" r="1.6" fill="#f5c84a"/></g>
<!-- bowl -->
<g>
<ellipse cx="72" cy="356" rx="40" ry="7" fill="#000" opacity=".12"/>
<path d="M36 330 L108 330 L98 354 L46 354 Z" fill="var(--scarf)"/>
<ellipse cx="72" cy="330" rx="36" ry="8" fill="#2f63b8"/>
<ellipse cx="72" cy="328" rx="29" ry="5" fill="#b9733c"/>
<circle cx="62" cy="326" r="4" fill="#a5612c"/><circle cx="76" cy="325" r="4" fill="#a5612c"/><circle cx="86" cy="327" r="3.5" fill="#a5612c"/>
<text x="72" y="345" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="11" font-weight="800" fill="#fff">RALUCA</text>
</g>
<ellipse id="shadow" class="part" cx="220" cy="350" rx="95" ry="11" fill="#000" opacity=".14" style="transform-origin:50% 50%"/>
<g id="mover" class="part"><g id="fox" class="part" stroke="#5a2c10" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
<!-- tail -->
<g id="tail" class="part">
<path d="M282 268 C330 262 372 236 368 190 C366 170 352 158 340 160 C350 186 338 214 300 232 C290 238 280 246 276 254 Z" fill="url(#furG)"/>
<path d="M340 160 C352 158 366 170 368 190 C369 200 366 210 360 218 C356 206 352 196 344 194 C350 186 348 174 340 160 Z" fill="#fff7ec"/>
</g>
<!-- back legs -->
<path id="legBL" class="part" d="M262 290 C258 312 258 330 260 344 L276 344 C278 330 280 310 282 292 Z" fill="url(#legG)"/>
<path id="legFL" class="part" d="M178 292 C176 314 176 330 178 344 L194 344 C196 330 196 312 196 294 Z" fill="url(#legG)"/>
<!-- torso -->
<g id="torso" class="part">
<path d="M160 248 C162 222 196 212 232 214 C268 216 300 230 300 262 C300 294 270 306 232 306 C196 306 166 296 160 276 Z" fill="url(#furG)"/>
<path d="M162 262 C170 296 204 304 226 298 C206 290 190 272 186 250 Z" fill="#fff7ec" stroke="none"/>
</g>
<!-- near legs -->
<path id="legBR" class="part" d="M276 292 C274 314 274 330 276 346 L294 346 C296 330 298 310 298 288 Z" fill="url(#legG)"/>
<path id="legFR" class="part" d="M192 294 C190 316 190 332 192 348 L210 348 C212 332 212 314 212 296 Z" fill="url(#legG)"/>
<!-- scarf -->
<g id="scarf">
<path d="M136 232 Q170 258 210 236 L214 252 Q172 278 132 248 Z" fill="var(--scarf)"/>
<path d="M184 254 L196 290 L174 284 Z" fill="var(--scarf)"/>
<circle cx="160" cy="246" r="3" fill="#fff" stroke="none"/><circle cx="190" cy="248" r="3" fill="#fff" stroke="none"/>
</g>
<!-- head -->
<g id="head" class="part">
<g id="earL" class="part"><path d="M116 124 C116 102 124 86 134 76 C146 92 154 112 156 132 Z" fill="url(#headG)"/><path d="M125 118 C126 104 130 94 135 88 C142 100 146 114 147 126 Z" fill="#4a2614" stroke="none"/><path d="M131 120 C132 110 134 104 136 100 C140 110 142 118 142 126 Z" fill="#fff1e2" stroke="none"/></g>
<g id="earR" class="part"><path d="M224 124 C224 102 216 86 206 76 C194 92 186 112 184 132 Z" fill="url(#headG)"/><path d="M215 118 C214 104 210 94 205 88 C198 100 194 114 193 126 Z" fill="#4a2614" stroke="none"/><path d="M209 120 C208 110 206 104 204 100 C200 110 198 118 198 126 Z" fill="#fff1e2" stroke="none"/></g>
<path d="M108 162 C108 126 136 106 170 106 C204 106 232 126 232 162 C232 178 226 190 216 198 C206 220 190 234 170 234 C150 234 134 220 124 198 C114 190 108 178 108 162 Z" fill="url(#headG)"/>
<path d="M110 178 C116 204 140 232 170 234 C200 232 224 204 230 178 C212 198 192 202 170 194 C148 202 128 198 110 178 Z" fill="#fff7ec"/>
<path d="M112 190 l-14 5 l15 5 z M228 190 l14 5 l-15 5 z" fill="#fff7ec"/>
<g stroke="none">
<ellipse cx="146" cy="160" rx="12" ry="15" fill="url(#eyeG)"/>
<ellipse cx="194" cy="160" rx="12" ry="15" fill="url(#eyeG)"/>
<circle cx="150" cy="154" r="4.5" fill="#fff"/><circle cx="198" cy="154" r="4.5" fill="#fff"/>
<circle cx="142" cy="166" r="2" fill="#fff" opacity=".8"/><circle cx="190" cy="166" r="2" fill="#fff" opacity=".8"/>
<ellipse id="lidL" class="part" cx="146" cy="160" rx="13" ry="16" fill="#f3842f"/>
<ellipse id="lidR" class="part" cx="194" cy="160" rx="13" ry="16" fill="#f3842f"/>
</g>
<path d="M134 138 q12 -6 24 0 M182 138 q12 -6 24 0" fill="none" stroke-width="2.5"/>
<path d="M161 186 C161 179 179 179 179 186 C179 193 173 196 170 196 C167 196 161 193 161 186 Z" fill="#2a1508"/>
<ellipse cx="166" cy="183" rx="3.5" ry="2" fill="#fff" opacity=".7" stroke="none"/>
<path d="M170 196 L170 201 M159 201 Q164.5 208 170 201 Q175.5 208 181 201" fill="none" stroke-width="2.5"/>
<path d="M165 205 Q170 214 175 205 Z" fill="#f28a8a" stroke-width="2"/>
<ellipse cx="128" cy="184" rx="10" ry="6" fill="#ff9c9c" opacity=".55" stroke="none"/>
<ellipse cx="212" cy="184" rx="10" ry="6" fill="#ff9c9c" opacity=".55" stroke="none"/>
</g>
</g></g>
</svg>
`;

export function mountFox(container) {
  container.innerHTML = SVG;
  const q = (id) => container.querySelector('#' + id);
  const fox = q('fox'), mover = q('mover'), head = q('head'), torso = q('torso'), tail = q('tail'), shadow = q('shadow');
  const legFR = q('legFR'), legFL = q('legFL'), legBR = q('legBR'), legBL = q('legBL'), earL = q('earL'), earR = q('earR');
  const A = (el, k, o) => el.animate(k, Object.assign({ duration: 900, easing: 'ease-in-out' }, o)).finished;
  let busy = false;

  const T = {
    jump: async () => {
      shadow.animate([{ transform: 'scale(1)' }, { transform: 'scale(.55)' }, { transform: 'scale(1)' }], { duration: 950 });
      [legFR, legFL].forEach((e) => e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-35deg)' }, { transform: 'rotate(0)' }], { duration: 950 }));
      [legBR, legBL].forEach((e) => e.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(35deg)' }, { transform: 'rotate(0)' }], { duration: 950 }));
      await A(fox, [{ transform: 'translateY(0) scaleY(1)' }, { transform: 'translateY(0) scaleY(.88)', offset: 0.15 }, { transform: 'translateY(-120px) scaleY(1.04)', offset: 0.5 }, { transform: 'translateY(0) scaleY(.92)', offset: 0.85 }, { transform: 'translateY(0) scaleY(1)' }], { duration: 950 });
    },
    spin: async () => {
      await A(fox, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(-1)', offset: 0.25 }, { transform: 'scaleX(1)', offset: 0.5 }, { transform: 'scaleX(-1)', offset: 0.75 }, { transform: 'scaleX(1)' }], { duration: 1100 });
    },
    happy: async () => {
      tail.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-16deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(-16deg)' }, { transform: 'rotate(0)' }], { duration: 900 });
      [earL, earR].forEach((e) => e.animate([{ transform: 'none' }, { transform: 'rotate(-8deg)' }, { transform: 'none' }], { duration: 900 }));
      await A(head, [{ transform: 'none' }, { transform: 'rotate(-7deg) translateY(-4px)' }, { transform: 'rotate(5deg)' }, { transform: 'none' }], { duration: 900 });
    },
    sit: async () => {
      const k = [{ transform: 'none' }, { transform: 'translateY(26px) rotate(-14deg)', offset: 0.25 }, { transform: 'translateY(26px) rotate(-14deg)', offset: 0.8 }, { transform: 'none' }];
      [torso, tail].forEach((e) => e.animate(k, { duration: 2000, easing: 'ease-in-out' }));
      [legBR, legBL].forEach((e) => e.animate([{ transform: 'none' }, { transform: 'translateY(18px) scaleY(.45)', offset: 0.25 }, { transform: 'translateY(18px) scaleY(.45)', offset: 0.8 }, { transform: 'none' }], { duration: 2000, easing: 'ease-in-out' }));
      await A(head, [{ transform: 'none' }, { transform: 'translateY(-6px) rotate(-6deg)', offset: 0.3 }, { transform: 'translateY(-6px) rotate(6deg)', offset: 0.6 }, { transform: 'none' }], { duration: 2000 });
    },
    down: async () => {
      [legFR, legFL, legBR, legBL].forEach((e) => e.animate([{ transform: 'none' }, { transform: 'translateY(14px) scaleY(.3)', offset: 0.3 }, { transform: 'translateY(14px) scaleY(.3)', offset: 0.8 }, { transform: 'none' }], { duration: 2400, easing: 'ease-in-out' }));
      [torso, tail].forEach((e) => e.animate([{ transform: 'none' }, { transform: 'translateY(36px)', offset: 0.3 }, { transform: 'translateY(36px)', offset: 0.8 }, { transform: 'none' }], { duration: 2400, easing: 'ease-in-out' }));
      [earL, earR].forEach((e) => e.animate([{ transform: 'none' }, { transform: 'rotate(-12deg)', offset: 0.3 }, { transform: 'rotate(-12deg)', offset: 0.8 }, { transform: 'none' }], { duration: 2400 }));
      await A(head, [{ transform: 'none' }, { transform: 'translateY(46px) rotate(4deg)', offset: 0.3 }, { transform: 'translateY(46px) rotate(4deg)', offset: 0.8 }, { transform: 'none' }], { duration: 2400 });
    },
    paw: async () => {
      head.animate([{ transform: 'none' }, { transform: 'rotate(-8deg)' }, { transform: 'none' }], { duration: 1600 });
      await A(legFR, [{ transform: 'rotate(0)' }, { transform: 'rotate(75deg)', offset: 0.3 }, { transform: 'rotate(65deg)', offset: 0.5 }, { transform: 'rotate(75deg)', offset: 0.7 }, { transform: 'rotate(0)' }], { duration: 1600 });
    },
  };

  async function trick(name) {
    if (busy || !T[name] || !fox.animate) return;
    busy = true;
    try { await T[name](); } catch { /* animation cancelled */ }
    busy = false;
  }
  function setMood(m) {
    ['happy', 'ok', 'hungry', 'sad'].forEach((x) => container.classList.toggle('mood-' + x, x === m));
  }
  return { trick, setMood, tricks: Object.keys(T), el: fox };
}
