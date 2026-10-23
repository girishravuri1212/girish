import React, { useState, useEffect } from 'react';

interface APGovtLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const APGovtLogo: React.FC<APGovtLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [customImgSrc, setCustomImgSrc] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
    xl: 'w-16 h-16',
  };

  useEffect(() => {
    const stored = localStorage.getItem('ap_custom_logo_data');
    if (stored) {
      setCustomImgSrc(stored);
    }
  }, []);

  if (customImgSrc) {
    return (
      <img
        src={customImgSrc}
        alt="Government of Andhra Pradesh"
        className={`${sizeClasses[size]} shrink-0 object-contain rounded-full ${className}`}
      />
    );
  }

  // Exact vector replica of the official Andhra Pradesh State Emblem uploaded by user
  return (
    <div className={`${sizeClasses[size]} shrink-0 relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 440"
        className="w-full h-full object-contain drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="apTopArc" d="M 68,200 A 132,132 0 0,1 332,200" fill="none" />
          <path id="apLeftArc" d="M 68,200 A 132,132 0 0,0 200,332" fill="none" />
          <path id="apRightArc" d="M 332,200 A 132,132 0 0,1 200,332" fill="none" />

          <radialGradient id="apSunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF2" />
            <stop offset="60%" stopColor="#FFF9C4" />
            <stop offset="100%" stopColor="#FDD835" />
          </radialGradient>

          <linearGradient id="apAshokaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" />
            <stop offset="60%" stopColor="#F4511E" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>
        </defs>

        {/* Outer Circular Seal - Emerald Green */}
        <circle cx="200" cy="200" r="188" fill="#FFFFFF" stroke="#006837" strokeWidth="4" />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#006837" strokeWidth="1.5" />
        
        {/* Ring Division */}
        <circle cx="200" cy="200" r="142" fill="none" stroke="#006837" strokeWidth="2" />
        <circle cx="200" cy="200" r="136" fill="none" stroke="#006837" strokeWidth="1" strokeDasharray="3,2" />

        {/* Outer Inscriptions */}
        {/* Telugu: ఆంధ్రప్రదేశ్ ప్రభుత్వం */}
        <text
          fontFamily="'Noto Sans Telugu', 'Gautami', 'Mandali', sans-serif"
          fontWeight="700"
          fontSize="19"
          fill="#006837"
          letterSpacing="1.5"
        >
          <textPath href="#apTopArc" startOffset="50%" textAnchor="middle">
            ఆంధ్రప్రదేశ్ ప్రభుత్వం
          </textPath>
        </text>

        {/* English: ANDHRA PRADESH */}
        <text
          fontFamily="'Noto Sans', 'Segoe UI', Arial, sans-serif"
          fontWeight="800"
          fontSize="14.5"
          fill="#006837"
          letterSpacing="2"
        >
          <textPath href="#apLeftArc" startOffset="30%" textAnchor="middle">
            ANDHRA PRADESH
          </textPath>
        </text>

        {/* Hindi: आंध्र प्रदेश */}
        <text
          fontFamily="'Noto Sans Devanagari', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fontSize="15"
          fill="#006837"
          letterSpacing="1.5"
        >
          <textPath href="#apRightArc" startOffset="30%" textAnchor="middle">
            आंध्र प्रदेश
          </textPath>
        </text>

        {/* Traditional Ornamental Beaded Garland Ring (Kalpavriksha band) */}
        <g stroke="#006837" fill="#006837" opacity="0.95">
          <circle cx="200" cy="200" r="128" fill="none" stroke="#006837" strokeWidth="2" />
          <circle cx="200" cy="200" r="116" fill="none" stroke="#006837" strokeWidth="1" />
          
          {/* Beaded ring dots */}
          <circle cx="200" cy="78" r="2.5" />
          <circle cx="221" cy="80" r="2.5" />
          <circle cx="241" cy="86" r="2.5" />
          <circle cx="260" cy="95" r="2.5" />
          <circle cx="277" cy="107" r="2.5" />
          <circle cx="292" cy="122" r="2.5" />
          <circle cx="304" cy="139" r="2.5" />
          <circle cx="313" cy="158" r="2.5" />
          <circle cx="319" cy="179" r="2.5" />
          <circle cx="321" cy="200" r="2.5" />
          <circle cx="319" cy="221" r="2.5" />
          <circle cx="313" cy="242" r="2.5" />
          <circle cx="304" cy="261" r="2.5" />
          <circle cx="292" cy="278" r="2.5" />
          <circle cx="277" cy="293" r="2.5" />
          <circle cx="260" cy="305" r="2.5" />
          <circle cx="241" cy="314" r="2.5" />
          <circle cx="221" cy="320" r="2.5" />
          <circle cx="200" cy="322" r="2.5" />
          <circle cx="179" cy="320" r="2.5" />
          <circle cx="159" cy="314" r="2.5" />
          <circle cx="140" cy="305" r="2.5" />
          <circle cx="123" cy="293" r="2.5" />
          <circle cx="108" cy="278" r="2.5" />
          <circle cx="96" cy="261" r="2.5" />
          <circle cx="87" cy="242" r="2.5" />
          <circle cx="81" cy="221" r="2.5" />
          <circle cx="79" cy="200" r="2.5" />
          <circle cx="81" cy="179" r="2.5" />
          <circle cx="87" cy="158" r="2.5" />
          <circle cx="96" cy="139" r="2.5" />
          <circle cx="108" cy="122" r="2.5" />
          <circle cx="123" cy="107" r="2.5" />
          <circle cx="140" cy="95" r="2.5" />
          <circle cx="159" cy="86" r="2.5" />
          <circle cx="179" cy="80" r="2.5" />
        </g>

        {/* Radiant Golden-Yellow Sunburst Center Disc */}
        <circle cx="200" cy="200" r="114" fill="#FFFDE7" />
        <circle cx="200" cy="200" r="114" fill="none" stroke="#FBC02D" strokeWidth="2" />
        <circle cx="200" cy="200" r="54" fill="none" stroke="#FBC02D" strokeWidth="2.5" />

        {/* Radiating Sunburst Rays */}
        <g stroke="#FBC02D" strokeWidth="2" strokeLinecap="round">
          <line x1="200" y1="88" x2="200" y2="144" />
          <line x1="213" y1="89" x2="208" y2="145" />
          <line x1="226" y1="92" x2="216" y2="147" />
          <line x1="239" y1="97" x2="223" y2="150" />
          <line x1="251" y1="104" x2="231" y2="154" />
          <line x1="262" y1="112" x2="237" y2="159" />
          <line x1="273" y1="121" x2="243" y2="164" />
          <line x1="282" y1="132" x2="249" y2="170" />
          <line x1="289" y1="144" x2="253" y2="177" />
          <line x1="296" y1="157" x2="257" y2="184" />
          <line x1="301" y1="170" x2="259" y2="192" />
          <line x1="304" y1="185" x2="260" y2="200" />
          <line x1="305" y1="200" x2="260" y2="200" />
          <line x1="304" y1="215" x2="260" y2="208" />
          <line x1="301" y1="230" x2="259" y2="216" />
          <line x1="296" y1="243" x2="257" y2="224" />
          <line x1="289" y1="256" x2="253" y2="231" />
          <line x1="282" y1="268" x2="249" y2="238" />
          <line x1="273" y1="279" x2="243" y2="244" />
          <line x1="262" y1="288" x2="237" y2="249" />
          <line x1="251" y1="296" x2="231" y2="254" />
          <line x1="239" y1="303" x2="223" y2="258" />
          <line x1="226" y1="308" x2="216" y2="261" />
          <line x1="213" y1="311" x2="208" y2="263" />
          <line x1="200" y1="312" x2="200" y2="264" />
          <line x1="187" y1="311" x2="192" y2="263" />
          <line x1="174" y1="308" x2="184" y2="261" />
          <line x1="161" y1="303" x2="177" y2="258" />
          <line x1="149" y1="296" x2="169" y2="254" />
          <line x1="138" y1="288" x2="163" y2="249" />
          <line x1="127" y1="279" x2="157" y2="244" />
          <line x1="118" y1="268" x2="151" y2="238" />
          <line x1="111" y1="256" x2="147" y2="231" />
          <line x1="104" y1="243" x2="143" y2="224" />
          <line x1="99" y1="230" x2="141" y2="216" />
          <line x1="96" y1="215" x2="140" y2="208" />
          <line x1="95" y1="200" x2="140" y2="200" />
          <line x1="96" y1="185" x2="140" y2="192" />
          <line x1="99" y1="170" x2="141" y2="184" />
          <line x1="104" y1="157" x2="143" y2="177" />
          <line x1="111" y1="144" x2="147" y2="170" />
          <line x1="118" y1="132" x2="151" y2="164" />
          <line x1="127" y1="121" x2="157" y2="159" />
          <line x1="138" y1="112" x2="163" y2="154" />
          <line x1="149" y1="104" x2="169" y2="150" />
          <line x1="161" y1="97" x2="177" y2="147" />
          <line x1="174" y1="92" x2="184" y2="145" />
          <line x1="187" y1="89" x2="192" y2="144" />
        </g>

        {/* Central Amaravati Purna Kumbha (Sacred Vessel of Plenty) in Green */}
        <g id="purnaKumbha" transform="translate(0, 5)">
          <ellipse cx="200" cy="180" rx="20" ry="4" fill="#006837" stroke="#004d25" strokeWidth="1" />
          <path d="M 200,180 C 196,162 198,148 200,140 C 202,148 204,162 200,180 Z" fill="#006837" />
          <path d="M 194,181 C 182,168 174,158 170,154 C 180,161 189,171 194,181 Z" fill="#006837" />
          <path d="M 206,181 C 218,168 226,158 230,154 C 220,161 211,171 206,181 Z" fill="#006837" />
          <path d="M 197,181 C 189,165 186,152 185,146 C 192,156 196,167 197,181 Z" fill="#007934" />
          <path d="M 203,181 C 211,165 214,152 215,146 C 208,156 204,167 203,181 Z" fill="#007934" />

          {/* Kalash Body */}
          <path d="M 182,184 C 172,192 170,208 178,220 C 184,228 192,231 200,231 C 208,231 216,228 222,220 C 230,208 228,192 218,184 Z" fill="#006837" />

          {/* White Festoons on Pot */}
          <path d="M 176,198 Q 200,210 224,198" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M 179,207 Q 200,219 221,207" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="200" cy="216" r="3" fill="#FFFFFF" />
          <circle cx="191" cy="214" r="2.5" fill="#FFFFFF" />
          <circle cx="209" cy="214" r="2.5" fill="#FFFFFF" />
          <rect x="187" y="231" width="26" height="5" rx="2" fill="#006837" />
        </g>

        {/* Foreground Sarnath Ashoka Lions (Terracotta Orange) */}
        <g id="ashokaLions" transform="translate(0, 10)">
          {/* Abacus */}
          <path d="M 166,326 L 234,326 L 230,338 L 170,338 Z" fill="url(#apAshokaGrad)" stroke="#B71C1C" strokeWidth="1" />
          <rect x="172" y="338" width="56" height="5" fill="#B71C1C" rx="1" />

          {/* Ashoka Chakra */}
          <circle cx="200" cy="332" r="5" fill="#FFFFFF" stroke="#0D47A1" strokeWidth="1" />
          <circle cx="200" cy="332" r="1.5" fill="#0D47A1" />
          <circle cx="180" cy="332" r="2" fill="#FFE082" />
          <circle cx="220" cy="332" r="2" fill="#FFE082" />

          {/* Center Lion Body */}
          <path d="M 176,290 C 172,305 174,322 176,326 L 224,326 C 226,322 228,305 224,290 Z" fill="url(#apAshokaGrad)" />
          <path d="M 178,295 C 184,302 184,312 179,320" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 188,292 C 193,300 193,314 188,322" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 200,290 C 200,300 200,314 200,324" stroke="#FFE082" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 212,292 C 207,300 207,314 212,322" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 222,295 C 216,302 216,312 221,320" stroke="#FFE082" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Head */}
          <circle cx="200" cy="270" r="16" fill="url(#apAshokaGrad)" />
          <circle cx="186" cy="258" r="4.5" fill="url(#apAshokaGrad)" stroke="#B71C1C" strokeWidth="0.8" />
          <circle cx="214" cy="258" r="4.5" fill="url(#apAshokaGrad)" stroke="#B71C1C" strokeWidth="0.8" />
          <path d="M 190,258 Q 200,252 210,258 Q 200,262 190,258 Z" fill="#FFE082" />
          <circle cx="193" cy="266" r="2.2" fill="#FFFFFF" />
          <circle cx="193" cy="266" r="1.2" fill="#000000" />
          <circle cx="207" cy="266" r="2.2" fill="#FFFFFF" />
          <circle cx="207" cy="266" r="1.2" fill="#000000" />
          <ellipse cx="200" cy="274" rx="6" ry="4" fill="#FFE082" />
          <polygon points="198,272 202,272 200,275" fill="#B71C1C" />
          <path d="M 194,277 Q 200,283 206,277 Z" fill="#B71C1C" />
          <polygon points="196,277 197,280 198,277" fill="#FFFFFF" />
          <polygon points="202,277 203,280 204,277" fill="#FFFFFF" />

          {/* Left Profile */}
          <g>
            <path d="M 166,282 C 160,286 156,298 168,326 L 176,326 C 174,310 172,296 172,284 Z" fill="url(#apAshokaGrad)" />
            <circle cx="166" cy="276" r="11" fill="url(#apAshokaGrad)" />
            <circle cx="157" cy="268" r="3.5" fill="url(#apAshokaGrad)" />
            <circle cx="162" cy="274" r="1.8" fill="#FFFFFF" />
            <circle cx="162" cy="274" r="1" fill="#000000" />
            <path d="M 155,278 Q 160,283 165,280" fill="#B71C1C" stroke="#B71C1C" strokeWidth="1" />
          </g>

          {/* Right Profile */}
          <g>
            <path d="M 234,282 C 240,286 244,298 232,326 L 224,326 C 226,310 228,296 228,284 Z" fill="url(#apAshokaGrad)" />
            <circle cx="234" cy="276" r="11" fill="url(#apAshokaGrad)" />
            <circle cx="243" cy="268" r="3.5" fill="url(#apAshokaGrad)" />
            <circle cx="238" cy="274" r="1.8" fill="#FFFFFF" />
            <circle cx="238" cy="274" r="1" fill="#000000" />
            <path d="M 245,278 Q 240,283 235,280" fill="#B71C1C" stroke="#B71C1C" strokeWidth="1" />
          </g>
        </g>

        {/* Bottom National Motto: సత్యమేవ జయతే */}
        <text
          x="200"
          y="416"
          fontFamily="'Noto Sans Telugu', 'Gautami', 'Mandali', sans-serif"
          fontWeight="700"
          fontSize="24"
          fill="#006837"
          textAnchor="middle"
          letterSpacing="1"
        >
          సత్యమేవ జయతే
        </text>
      </svg>
    </div>
  );
};
