export default function ToothDiagram() {
  return (
    <svg width="190" viewBox="0 0 190 340" xmlns="http://www.w3.org/2000/svg" aria-label="Cross-section diagram of a tooth showing crown, enamel, pulp, gum line, and root">
      {/* Gum line */}
      <rect x="30" y="155" width="130" height="12" rx="6" fill="#F9C5C5" />
      <text x="95" y="165" textAnchor="middle" fontSize="9" fill="#C47070">gum line</text>

      {/* Crown outer shell */}
      <rect x="45" y="40" width="100" height="120" rx="28" fill="#F5F0E8" stroke="#C8BEA0" strokeWidth="1.5" />

      {/* Enamel ring */}
      <rect x="45" y="40" width="100" height="120" rx="28" fill="none" stroke="#E8DEC8" strokeWidth="8" />

      {/* Dentin layer */}
      <rect x="62" y="57" width="66" height="86" rx="18" fill="#F0E6C8" stroke="#D4C88A" strokeWidth="1" />

      {/* Pulp */}
      <ellipse cx="95" cy="100" rx="18" ry="28" fill="#F9C8C8" stroke="#E89898" strokeWidth="1" />

      {/* Root */}
      <path d="M60 160 Q55 240 95 310 Q135 240 130 160 Z" fill="#F0E6C8" stroke="#C8BEA0" strokeWidth="1.5" />

      {/* Pointer dots */}
      <circle cx="95" cy="50" r="3" fill="#555" />
      <circle cx="95" cy="70" r="3" fill="#555" />
      <circle cx="95" cy="100" r="3" fill="#555" />
      <circle cx="95" cy="160" r="3" fill="#555" />
      <circle cx="95" cy="250" r="3" fill="#555" />

      {/* Leader lines to right */}
      <line x1="95" y1="50" x2="155" y2="50" stroke="#bbb" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="95" y1="70" x2="155" y2="80" stroke="#bbb" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="95" y1="100" x2="155" y2="110" stroke="#bbb" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="95" y1="160" x2="155" y2="168" stroke="#bbb" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="95" y1="250" x2="155" y2="248" stroke="#bbb" strokeWidth="0.8" strokeDasharray="3 2" />

      {/* Number labels */}
      <text x="158" y="54" fontSize="11" fill="#888">①</text>
      <text x="158" y="84" fontSize="11" fill="#888">②</text>
      <text x="158" y="114" fontSize="11" fill="#888">③</text>
      <text x="158" y="172" fontSize="11" fill="#888">④</text>
      <text x="158" y="252" fontSize="11" fill="#888">⑤</text>
    </svg>
  );
}
