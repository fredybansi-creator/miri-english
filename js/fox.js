// Sam the fox – an animated SVG character with soft shading for a 3D look.
// States (CSS classes on .fox): idle (default), talking, thinking, listening, happy.

export function foxSVG() {
  return `
  <svg class="fox" viewBox="0 0 200 200" role="img" aria-label="Sam, der Fuchs">
    <defs>
      <radialGradient id="fx-fur" cx="38%" cy="30%" r="80%">
        <stop offset="0" stop-color="#ffb06a"/>
        <stop offset=".55" stop-color="#f07a2e"/>
        <stop offset="1" stop-color="#c2531a"/>
      </radialGradient>
      <radialGradient id="fx-cream" cx="50%" cy="20%" r="90%">
        <stop offset="0" stop-color="#fffaf3"/>
        <stop offset="1" stop-color="#ecd5bd"/>
      </radialGradient>
      <linearGradient id="fx-ear" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3b1d10"/>
        <stop offset="1" stop-color="#7a3a1c"/>
      </linearGradient>
      <radialGradient id="fx-eye" cx="35%" cy="30%" r="80%">
        <stop offset="0" stop-color="#5b3a26"/>
        <stop offset="1" stop-color="#1d110b"/>
      </radialGradient>
      <filter id="fx-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#7a3210" flood-opacity=".25"/>
      </filter>
    </defs>

    <ellipse class="fx-shadow" cx="100" cy="190" rx="50" ry="7" fill="#000" opacity=".12"/>

    <g class="fx-all">
      <!-- body -->
      <path d="M46 200 C50 160 72 144 100 144 C128 144 150 160 154 200 Z" fill="url(#fx-fur)"/>
      <path d="M77 200 C79 172 89 158 100 158 C111 158 121 172 123 200 Z" fill="url(#fx-cream)"/>

      <g class="fx-head" filter="url(#fx-soft)">
        <!-- ears -->
        <g class="fx-ear-l">
          <path d="M44 84 L56 20 L94 58 Z" fill="url(#fx-fur)" stroke="#e8742c" stroke-width="6" stroke-linejoin="round"/>
          <path d="M55 70 L60 34 L82 58 Z" fill="url(#fx-ear)"/>
        </g>
        <g class="fx-ear-r">
          <path d="M156 84 L144 20 L106 58 Z" fill="url(#fx-fur)" stroke="#e8742c" stroke-width="6" stroke-linejoin="round"/>
          <path d="M145 70 L140 34 L118 58 Z" fill="url(#fx-ear)"/>
        </g>

        <!-- head -->
        <path d="M100 42 C142 42 166 70 166 100 C166 126 142 147 100 153 C58 147 34 126 34 100 C34 70 58 42 100 42 Z" fill="url(#fx-fur)"/>
        <!-- forehead highlight -->
        <ellipse cx="84" cy="64" rx="26" ry="12" fill="#fff" opacity=".18"/>
        <!-- white cheeks / muzzle -->
        <path d="M100 151 C69 148 47 133 40 112 C57 119 74 113 84 100 C90 113 96 119 100 119 C104 119 110 113 116 100 C126 113 143 119 160 112 C153 133 131 148 100 151 Z" fill="url(#fx-cream)"/>

        <!-- blush -->
        <ellipse cx="62" cy="114" rx="9" ry="4.5" fill="#ff7a7a" opacity=".3"/>
        <ellipse cx="138" cy="114" rx="9" ry="4.5" fill="#ff7a7a" opacity=".3"/>

        <!-- eyes -->
        <g class="fx-eye">
          <ellipse cx="76" cy="92" rx="7.5" ry="9.5" fill="url(#fx-eye)"/>
          <g class="fx-pupil"><circle cx="79" cy="88" r="2.8" fill="#fff"/><circle cx="74" cy="96" r="1.2" fill="#fff" opacity=".7"/></g>
        </g>
        <g class="fx-eye">
          <ellipse cx="124" cy="92" rx="7.5" ry="9.5" fill="url(#fx-eye)"/>
          <g class="fx-pupil"><circle cx="127" cy="88" r="2.8" fill="#fff"/><circle cx="122" cy="96" r="1.2" fill="#fff" opacity=".7"/></g>
        </g>

        <!-- nose -->
        <path d="M91 117 C91 110 109 110 109 117 C109 123 104 127 100 127 C96 127 91 123 91 117 Z" fill="#24140c"/>
        <ellipse cx="96" cy="114.5" rx="3.5" ry="1.8" fill="#fff" opacity=".55"/>

        <!-- mouth -->
        <path class="fx-mouth-closed" d="M91 133 Q100 140 109 133" stroke="#5a2e1a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <g class="fx-mouth-open">
          <ellipse cx="100" cy="136" rx="7" ry="5.5" fill="#5a1f12"/>
          <ellipse cx="100" cy="139" rx="4" ry="2" fill="#ff8f86"/>
        </g>
      </g>
    </g>
  </svg>`;
}

export function setFoxState(root, state) {
  const fox = root?.querySelector?.('.fox');
  if (!fox) return;
  fox.classList.remove('talking', 'thinking', 'listening', 'happy');
  if (state && state !== 'idle') fox.classList.add(state);
}
