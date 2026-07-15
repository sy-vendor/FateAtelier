/** 抽取仪式器物：克制的青瓷签筒，不在结果揭晓前展示任何签文字符。 */
export function OracleVessel({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`oracle-vessel ${className}`.trim()}
      viewBox="0 0 240 260"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="vesselCeladon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8eb29d" />
          <stop offset="0.45" stopColor="#527764" />
          <stop offset="1" stopColor="#29493b" />
        </linearGradient>
        <linearGradient id="vesselBamboo" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a98b55" />
          <stop offset="0.48" stopColor="#e0c98f" />
          <stop offset="1" stopColor="#8a6b3d" />
        </linearGradient>
        <radialGradient id="vesselMouth">
          <stop offset="0" stopColor="#07110d" />
          <stop offset="0.72" stopColor="#13291f" />
          <stop offset="1" stopColor="#3d6653" />
        </radialGradient>
        <filter id="vesselSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <ellipse cx="120" cy="232" rx="62" ry="10" fill="#000" opacity=".28" filter="url(#vesselSoftShadow)" />

      <g className="oracle-flying-stick">
        <rect x="116.5" y="18" width="7" height="88" rx="3.5" fill="url(#vesselBamboo)" />
        <path d="M117 31 H123" stroke="#6f5430" strokeWidth="1.5" opacity=".7" />
      </g>

      <path
        d="M58 97 C62 88 84 82 120 82 C156 82 178 88 182 97 L170 211 C168 224 148 232 120 232 C92 232 72 224 70 211 Z"
        fill="url(#vesselCeladon)"
        stroke="#b5d0bf"
        strokeOpacity=".3"
        strokeWidth="1.5"
      />
      <path d="M77 104 C80 100 86 97 92 96 L88 207 C85 207 81 204 79 200 Z" fill="#edf7f0" opacity=".1" />
      <ellipse cx="120" cy="96" rx="63" ry="20" fill="#759b86" />
      <ellipse cx="120" cy="96" rx="51" ry="13" fill="url(#vesselMouth)" />
      <path d="M62 99 Q120 117 178 99" fill="none" stroke="#d7e8dd" strokeOpacity=".2" strokeWidth="1.5" />
      <path d="M78 202 Q120 217 162 202" fill="none" stroke="#d7e8dd" strokeOpacity=".16" />

      <g className="oracle-vessel__leaf" fill="none" stroke="#c8ddce" strokeLinecap="round" strokeLinejoin="round">
        <path d="M111 164 C119 151 132 151 136 153 C132 165 123 171 111 164 Z" />
        <path d="M107 176 C113 163 125 159 134 156" />
      </g>

      <g className="oracle-vessel__lid">
        <ellipse cx="120" cy="91" rx="66" ry="20" fill="#416a57" stroke="#b5d0bf" strokeOpacity=".28" />
        <ellipse cx="120" cy="87" rx="53" ry="13" fill="#6f9782" />
        <ellipse cx="120" cy="84" rx="24" ry="7" fill="#83a892" />
        <path d="M103 84 Q120 73 137 84" fill="#5b826e" stroke="#b5d0bf" strokeOpacity=".25" />
      </g>
    </svg>
  )
}
