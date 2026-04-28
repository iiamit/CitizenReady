const VISUALS = {

  'constitution': `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Constitution timeline">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; rx: 6; }
      .line { stroke: var(--color-primary); stroke-width: 1.5; fill: none; }
      .dot { fill: var(--color-primary); }
      .star { fill: var(--color-warning); }
    </style>
    <!-- Title -->
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">The Constitution at a Glance</text>
    <!-- Timeline line -->
    <line x1="40" y1="60" x2="320" y2="60" class="line"/>
    <!-- 1787 -->
    <circle cx="60" cy="60" r="5" class="dot"/>
    <text x="60" y="50" text-anchor="middle" class="vth" style="font-size:10px;">1787</text>
    <text x="60" y="78" text-anchor="middle" class="vts">Written at</text>
    <text x="60" y="89" text-anchor="middle" class="vts">Philadelphia</text>
    <!-- 1788 -->
    <circle cx="140" cy="60" r="5" class="dot"/>
    <text x="140" y="50" text-anchor="middle" class="vth" style="font-size:10px;">1788</text>
    <text x="140" y="78" text-anchor="middle" class="vts">Ratified by</text>
    <text x="140" y="89" text-anchor="middle" class="vts">9 states</text>
    <!-- 1791 -->
    <circle cx="220" cy="60" r="5" class="dot"/>
    <text x="220" y="50" text-anchor="middle" class="vth" style="font-size:10px;">1791</text>
    <text x="220" y="78" text-anchor="middle" class="vts">Bill of Rights</text>
    <text x="220" y="89" text-anchor="middle" class="vts">(1st 10 amend.)</text>
    <!-- Today -->
    <circle cx="300" cy="60" r="5" class="dot"/>
    <text x="300" y="50" text-anchor="middle" class="vth" style="font-size:10px;">Today</text>
    <text x="300" y="78" text-anchor="middle" class="vts">27</text>
    <text x="300" y="89" text-anchor="middle" class="vts">amendments</text>
    <!-- Key facts boxes -->
    <rect x="20" y="108" width="150" height="60" rx="6" class="box"/>
    <text x="95" y="126" text-anchor="middle" class="vth" style="font-size:11px;">Supreme Law</text>
    <text x="95" y="142" text-anchor="middle" class="vt">The Constitution is the</text>
    <text x="95" y="155" text-anchor="middle" class="vt">supreme law of the land</text>
    <rect x="190" y="108" width="150" height="60" rx="6" class="box"/>
    <text x="265" y="126" text-anchor="middle" class="vth" style="font-size:11px;">Preamble Purpose</text>
    <text x="265" y="142" text-anchor="middle" class="vt">"We the People" — sets</text>
    <text x="265" y="155" text-anchor="middle" class="vt">up a self-governing nation</text>
    <!-- 3 boxes at bottom -->
    <rect x="20" y="188" width="96" height="70" rx="6" class="box"/>
    <text x="68" y="206" text-anchor="middle" class="vth" style="font-size:10px;">Articles</text>
    <text x="68" y="220" text-anchor="middle" class="vts">7 articles</text>
    <text x="68" y="233" text-anchor="middle" class="vts">define the</text>
    <text x="68" y="246" text-anchor="middle" class="vts">government</text>
    <rect x="132" y="188" width="96" height="70" rx="6" class="box"/>
    <text x="180" y="206" text-anchor="middle" class="vth" style="font-size:10px;">Amendments</text>
    <text x="180" y="220" text-anchor="middle" class="vts">27 total</text>
    <text x="180" y="233" text-anchor="middle" class="vts">changes added</text>
    <text x="180" y="246" text-anchor="middle" class="vts">over time</text>
    <rect x="244" y="188" width="96" height="70" rx="6" class="box"/>
    <text x="292" y="206" text-anchor="middle" class="vth" style="font-size:10px;">Separation</text>
    <text x="292" y="220" text-anchor="middle" class="vts">3 branches</text>
    <text x="292" y="233" text-anchor="middle" class="vts">balance each</text>
    <text x="292" y="246" text-anchor="middle" class="vts">other's power</text>
  </svg>`,

  'rights-freedoms': `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="First Amendment rights">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
      .hdr { fill: var(--color-primary); }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">First Amendment — 5 Freedoms</text>
    <!-- Center circle -->
    <circle cx="180" cy="120" r="38" fill="none" stroke="var(--color-primary)" stroke-width="2"/>
    <text x="180" y="115" text-anchor="middle" class="vth" style="font-size:11px;">1st</text>
    <text x="180" y="128" text-anchor="middle" class="vth" style="font-size:11px;">Amendment</text>
    <!-- 5 petals -->
    <!-- Religion (top) -->
    <ellipse cx="180" cy="55" rx="36" ry="20" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="180" y="51" text-anchor="middle" class="vth" style="font-size:10px;">Religion</text>
    <text x="180" y="64" text-anchor="middle" class="vts">Free to worship</text>
    <!-- Speech (top-right) -->
    <ellipse cx="265" cy="85" rx="36" ry="20" transform="rotate(-30 265 85)" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="265" y="81" text-anchor="middle" class="vth" style="font-size:10px;">Speech</text>
    <text x="265" y="94" text-anchor="middle" class="vts">Speak freely</text>
    <!-- Press (bottom-right) -->
    <ellipse cx="257" cy="165" rx="36" ry="20" transform="rotate(30 257 165)" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="257" y="161" text-anchor="middle" class="vth" style="font-size:10px;">Press</text>
    <text x="257" y="174" text-anchor="middle" class="vts">Free media</text>
    <!-- Assembly (bottom-left) -->
    <ellipse cx="103" cy="165" rx="36" ry="20" transform="rotate(-30 103 165)" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="103" y="161" text-anchor="middle" class="vth" style="font-size:10px;">Assembly</text>
    <text x="103" y="174" text-anchor="middle" class="vts">Peaceful groups</text>
    <!-- Petition (top-left) -->
    <ellipse cx="95" cy="85" rx="36" ry="20" transform="rotate(30 95 85)" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="95" y="81" text-anchor="middle" class="vth" style="font-size:10px;">Petition</text>
    <text x="95" y="94" text-anchor="middle" class="vts">Ask government</text>
    <!-- Bottom note -->
    <rect x="30" y="218" width="300" height="62" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1"/>
    <text x="180" y="235" text-anchor="middle" class="vth" style="font-size:11px;">Other Key Rights &amp; Responsibilities</text>
    <text x="55" y="252" text-anchor="start" class="vts">✓ Bear arms (2nd)</text>
    <text x="55" y="265" text-anchor="start" class="vts">✓ No unreasonable search (4th)</text>
    <text x="195" y="252" text-anchor="start" class="vts">✓ Vote (if eligible)</text>
    <text x="195" y="265" text-anchor="start" class="vts">✓ Serve on a jury</text>
  </svg>`,

  'branches': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three branches of government">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .hdr { fill: var(--color-primary); rx: 4; }
      .sub { fill: var(--color-surface); stroke: var(--color-border); stroke-width: 1; rx: 4; }
      .line { stroke: var(--color-primary); stroke-width: 1.5; fill: none; stroke-dasharray: 4 3; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Three Branches of Government</text>
    <!-- Legislative box -->
    <rect x="10" y="38" width="104" height="34" rx="4" class="hdr"/>
    <text x="62" y="51" text-anchor="middle" style="font-size:11px;font-weight:700;fill:white;">Legislative</text>
    <text x="62" y="64" text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,0.85);">Congress — Makes Laws</text>
    <!-- Executive box -->
    <rect x="128" y="38" width="104" height="34" rx="4" class="hdr"/>
    <text x="180" y="51" text-anchor="middle" style="font-size:11px;font-weight:700;fill:white;">Executive</text>
    <text x="180" y="64" text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,0.85);">President — Enforces Laws</text>
    <!-- Judicial box -->
    <rect x="246" y="38" width="104" height="34" rx="4" class="hdr"/>
    <text x="298" y="51" text-anchor="middle" style="font-size:11px;font-weight:700;fill:white;">Judicial</text>
    <text x="298" y="64" text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,0.85);">Courts — Interprets Laws</text>
    <!-- Legislative sub-items -->
    <rect x="10" y="82" width="104" height="44" rx="4" class="sub"/>
    <text x="62" y="97" text-anchor="middle" class="vth" style="font-size:10px;">Senate</text>
    <text x="62" y="110" text-anchor="middle" class="vts">100 senators</text>
    <text x="62" y="120" text-anchor="middle" class="vts">6-year terms</text>
    <rect x="10" y="134" width="104" height="44" rx="4" class="sub"/>
    <text x="62" y="149" text-anchor="middle" class="vth" style="font-size:10px;">House of Rep.</text>
    <text x="62" y="162" text-anchor="middle" class="vts">435 members</text>
    <text x="62" y="172" text-anchor="middle" class="vts">2-year terms</text>
    <!-- Executive sub-items -->
    <rect x="128" y="82" width="104" height="44" rx="4" class="sub"/>
    <text x="180" y="97" text-anchor="middle" class="vth" style="font-size:10px;">President</text>
    <text x="180" y="110" text-anchor="middle" class="vts">4-year term</text>
    <text x="180" y="120" text-anchor="middle" class="vts">max 2 terms</text>
    <rect x="128" y="134" width="104" height="44" rx="4" class="sub"/>
    <text x="180" y="149" text-anchor="middle" class="vth" style="font-size:10px;">Vice President</text>
    <text x="180" y="162" text-anchor="middle" class="vts">Presides over</text>
    <text x="180" y="172" text-anchor="middle" class="vts">Senate</text>
    <!-- Judicial sub-items -->
    <rect x="246" y="82" width="104" height="44" rx="4" class="sub"/>
    <text x="298" y="97" text-anchor="middle" class="vth" style="font-size:10px;">Supreme Court</text>
    <text x="298" y="110" text-anchor="middle" class="vts">9 justices</text>
    <text x="298" y="120" text-anchor="middle" class="vts">lifetime terms</text>
    <rect x="246" y="134" width="104" height="44" rx="4" class="sub"/>
    <text x="298" y="149" text-anchor="middle" class="vth" style="font-size:10px;">Lower Courts</text>
    <text x="298" y="162" text-anchor="middle" class="vts">Federal circuit</text>
    <text x="298" y="172" text-anchor="middle" class="vts">and district courts</text>
    <!-- Checks arrows label -->
    <text x="180" y="200" text-anchor="middle" class="vth" style="font-size:12px;">Checks &amp; Balances</text>
    <rect x="10" y="210" width="335" height="68" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1"/>
    <text x="22" y="227" class="vts">President vetoes Congress → Congress overrides with 2/3 vote</text>
    <text x="22" y="243" class="vts">Congress approves President's appointments (Senate)</text>
    <text x="22" y="259" class="vts">Supreme Court can strike down laws (judicial review)</text>
    <text x="22" y="272" class="vts">President appoints Supreme Court justices</text>
  </svg>`,

  'laws': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="How a bill becomes a law">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .step { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
      .arrow { fill: var(--color-primary); }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">How a Bill Becomes a Law</text>
    <!-- Step 1 -->
    <rect x="20" y="38" width="320" height="38" rx="6" class="step"/>
    <text x="44" y="53" class="vth" style="font-size:11px;">① Introduced</text>
    <text x="44" y="68" class="vts">A member of Congress introduces a bill in the House or Senate</text>
    <!-- Arrow -->
    <polygon points="176,82 184,82 180,90" class="arrow"/>
    <!-- Step 2 -->
    <rect x="20" y="96" width="320" height="38" rx="6" class="step"/>
    <text x="44" y="111" class="vth" style="font-size:11px;">② Committee Review</text>
    <text x="44" y="126" class="vts">A committee studies, debates, and may amend the bill</text>
    <!-- Arrow -->
    <polygon points="176,140 184,140 180,148" class="arrow"/>
    <!-- Step 3 -->
    <rect x="20" y="154" width="320" height="38" rx="6" class="step"/>
    <text x="44" y="169" class="vth" style="font-size:11px;">③ Floor Vote</text>
    <text x="44" y="184" class="vts">Both the House AND Senate must vote and pass the bill</text>
    <!-- Arrow -->
    <polygon points="176,198 184,198 180,206" class="arrow"/>
    <!-- Step 4 -->
    <rect x="20" y="212" width="320" height="38" rx="6" class="step"/>
    <text x="44" y="227" class="vth" style="font-size:11px;">④ Sent to the President</text>
    <text x="44" y="242" class="vts">President signs → becomes law   OR   President vetoes → back to Congress</text>
    <!-- Arrow -->
    <polygon points="176,256 184,256 180,264" class="arrow"/>
    <!-- Step 5 -->
    <rect x="20" y="268" width="320" height="18" rx="6" fill="var(--color-primary)"/>
    <text x="180" y="281" text-anchor="middle" style="font-size:11px;font-weight:700;fill:white;">⑤ It becomes the LAW of the land</text>
  </svg>`,

  'president': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Executive branch and president">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; rx: 6; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">The President — Executive Branch</text>
    <!-- Central president box -->
    <rect x="110" y="34" width="140" height="52" rx="6" fill="var(--color-primary)"/>
    <text x="180" y="56" text-anchor="middle" style="font-size:13px;font-weight:700;fill:white;">President</text>
    <text x="180" y="72" text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,0.9);">4-year term · Max 2 terms</text>
    <!-- Requirements box -->
    <rect x="10" y="104" width="155" height="68" rx="6" class="box"/>
    <text x="87" y="119" text-anchor="middle" class="vth" style="font-size:11px;">Requirements</text>
    <text x="22" y="134" class="vts">• Natural-born US citizen</text>
    <text x="22" y="147" class="vts">• At least 35 years old</text>
    <text x="22" y="160" class="vts">• US resident ≥ 14 years</text>
    <!-- Powers box -->
    <rect x="195" y="104" width="155" height="68" rx="6" class="box"/>
    <text x="272" y="119" text-anchor="middle" class="vth" style="font-size:11px;">Key Powers</text>
    <text x="207" y="134" class="vts">• Signs or vetoes bills</text>
    <text x="207" y="147" class="vts">• Commander in Chief</text>
    <text x="207" y="160" class="vts">• Appoints Cabinet &amp; judges</text>
    <!-- Succession box -->
    <rect x="10" y="186" width="155" height="88" rx="6" class="box"/>
    <text x="87" y="201" text-anchor="middle" class="vth" style="font-size:11px;">Succession Order</text>
    <text x="22" y="217" class="vts">1. Vice President</text>
    <text x="22" y="230" class="vts">2. Speaker of the House</text>
    <text x="22" y="243" class="vts">3. President Pro Tempore</text>
    <text x="22" y="256" class="vts">   of the Senate</text>
    <text x="22" y="269" class="vts">4. Cabinet (in order)</text>
    <!-- Election box -->
    <rect x="195" y="186" width="155" height="88" rx="6" class="box"/>
    <text x="272" y="201" text-anchor="middle" class="vth" style="font-size:11px;">Election Facts</text>
    <text x="207" y="217" class="vts">• Electoral College votes</text>
    <text x="207" y="230" class="vts">• 270 votes needed to win</text>
    <text x="207" y="243" class="vts">• Elected every 4 years</text>
    <text x="207" y="256" class="vts">• November election</text>
    <text x="207" y="269" class="vts">• January inauguration</text>
  </svg>`,

  'colonial': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Colonial period and founding timeline">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .dot { fill: var(--color-primary); }
      .line { stroke: var(--color-primary); stroke-width: 2; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Colonial Era &amp; Revolution</text>
    <!-- Vertical timeline -->
    <line x1="60" y1="40" x2="60" y2="270" class="line"/>
    <!-- 1620 -->
    <circle cx="60" cy="52" r="6" class="dot"/>
    <text x="76" y="48" class="vth" style="font-size:11px;">1620</text>
    <text x="76" y="60" class="vts">Pilgrims arrive (Mayflower)</text>
    <!-- 1776 -->
    <circle cx="60" cy="100" r="6" class="dot"/>
    <text x="76" y="96" class="vth" style="font-size:11px;">July 4, 1776</text>
    <text x="76" y="109" class="vts">Declaration of Independence signed</text>
    <text x="76" y="120" class="vts">13 colonies break from Britain</text>
    <!-- 1775-1783 -->
    <circle cx="60" cy="148" r="6" class="dot"/>
    <text x="76" y="144" class="vth" style="font-size:11px;">1775–1783</text>
    <text x="76" y="157" class="vts">Revolutionary War</text>
    <text x="76" y="168" class="vts">Colonists vs. Britain</text>
    <!-- 1787 -->
    <circle cx="60" cy="196" r="6" class="dot"/>
    <text x="76" y="192" class="vth" style="font-size:11px;">1787</text>
    <text x="76" y="205" class="vts">Constitution written in Philadelphia</text>
    <!-- 1789 -->
    <circle cx="60" cy="244" r="6" class="dot"/>
    <text x="76" y="240" class="vth" style="font-size:11px;">1789</text>
    <text x="76" y="253" class="vts">George Washington: 1st President</text>
    <text x="76" y="264" class="vts">New government begins</text>
  </svg>`,

  'civil-war': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Civil War era timeline">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .dot { fill: var(--color-primary); }
      .line { stroke: var(--color-primary); stroke-width: 2; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Civil War &amp; Reconstruction</text>
    <line x1="60" y1="40" x2="60" y2="270" class="line"/>
    <circle cx="60" cy="52" r="6" class="dot"/>
    <text x="76" y="48" class="vth" style="font-size:11px;">1861–1865</text>
    <text x="76" y="60" class="vts">Civil War — North vs. South</text>
    <text x="76" y="71" class="vts">Issue: slavery and states' rights</text>
    <circle cx="60" cy="102" r="6" class="dot"/>
    <text x="76" y="98" class="vth" style="font-size:11px;">Jan 1, 1863</text>
    <text x="76" y="110" class="vts">Emancipation Proclamation</text>
    <text x="76" y="121" class="vts">Lincoln frees enslaved people in rebel states</text>
    <circle cx="60" cy="152" r="6" class="dot"/>
    <text x="76" y="148" class="vth" style="font-size:11px;">1865 — 13th Amendment</text>
    <text x="76" y="160" class="vts">Slavery abolished throughout the US</text>
    <circle cx="60" cy="196" r="6" class="dot"/>
    <text x="76" y="192" class="vth" style="font-size:11px;">1868 — 14th Amendment</text>
    <text x="76" y="204" class="vts">Citizenship to all born in US</text>
    <text x="76" y="215" class="vts">Equal protection under law</text>
    <circle cx="60" cy="248" r="6" class="dot"/>
    <text x="76" y="244" class="vth" style="font-size:11px;">1870 — 15th Amendment</text>
    <text x="76" y="256" class="vts">Black men granted the right to vote</text>
    <text x="76" y="267" class="vts">(women: 1920 — 19th Amendment)</text>
  </svg>`,

  'recent-history': `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Recent American history timeline">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .dot { fill: var(--color-primary); }
      .line { stroke: var(--color-border); stroke-width: 2; }
      .hlDot { fill: var(--color-warning); }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">20th–21st Century America</text>
    <line x1="50" y1="40" x2="50" y2="285" class="line"/>
    <circle cx="50" cy="50" r="5" class="dot"/>
    <text x="64" y="46" class="vth" style="font-size:10px;">1917–1918</text>
    <text x="64" y="57" class="vts">World War I — US joins Allies</text>
    <circle cx="50" cy="84" r="5" class="dot"/>
    <text x="64" y="80" class="vth" style="font-size:10px;">1941–1945</text>
    <text x="64" y="91" class="vts">World War II — Pearl Harbor; D-Day</text>
    <circle cx="50" cy="118" r="5" class="dot"/>
    <text x="64" y="114" class="vth" style="font-size:10px;">1950–1953</text>
    <text x="64" y="125" class="vts">Korean War</text>
    <circle cx="50" cy="152" r="5" class="hlDot"/>
    <text x="64" y="148" class="vth" style="font-size:10px;">1954–1968</text>
    <text x="64" y="159" class="vts">Civil Rights Movement; MLK Jr. leads</text>
    <text x="64" y="170" class="vts">marches, speeches, peaceful protest</text>
    <circle cx="50" cy="194" r="5" class="dot"/>
    <text x="64" y="190" class="vth" style="font-size:10px;">1964–1965</text>
    <text x="64" y="201" class="vts">Civil Rights Act + Voting Rights Act</text>
    <circle cx="50" cy="228" r="5" class="dot"/>
    <text x="64" y="224" class="vth" style="font-size:10px;">Sept 11, 2001</text>
    <text x="64" y="235" class="vts">Terrorist attacks — War on Terror begins</text>
    <circle cx="50" cy="262" r="5" class="hlDot"/>
    <text x="64" y="258" class="vth" style="font-size:10px;">2008</text>
    <text x="64" y="269" class="vts">Barack Obama — first Black president</text>
  </svg>`,

  'geography': `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="US geography facts">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">US Geography at a Glance</text>
    <!-- Simple US outline approximation -->
    <rect x="30" y="34" width="300" height="130" rx="8" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1"/>
    <text x="180" y="55" text-anchor="middle" class="vth" style="font-size:12px;">United States of America</text>
    <!-- Regions -->
    <rect x="40" y="64" width="60" height="28" rx="4" fill="#C8102E" opacity="0.15" stroke="#C8102E" stroke-width="1"/>
    <text x="70" y="78" text-anchor="middle" class="vts">Northeast</text>
    <text x="70" y="88" text-anchor="middle" class="vts">New England</text>
    <rect x="110" y="64" width="60" height="28" rx="4" fill="#1A3A5C" opacity="0.15" stroke="#1A3A5C" stroke-width="1"/>
    <text x="140" y="78" text-anchor="middle" class="vts">Midwest</text>
    <text x="140" y="88" text-anchor="middle" class="vts">Great Plains</text>
    <rect x="180" y="64" width="60" height="28" rx="4" fill="#2D7A46" opacity="0.15" stroke="#2D7A46" stroke-width="1"/>
    <text x="210" y="78" text-anchor="middle" class="vts">South</text>
    <text x="210" y="88" text-anchor="middle" class="vts">Southeast</text>
    <rect x="250" y="64" width="68" height="28" rx="4" fill="#8B4513" opacity="0.15" stroke="#8B4513" stroke-width="1"/>
    <text x="284" y="78" text-anchor="middle" class="vts">West</text>
    <text x="284" y="88" text-anchor="middle" class="vts">Rockies/Pacific</text>
    <!-- Facts row -->
    <text x="180" y="116" text-anchor="middle" class="vth" style="font-size:10px;">50 States + Washington, D.C. (capital)</text>
    <text x="180" y="130" text-anchor="middle" class="vts">Alaska and Hawaii: non-contiguous states</text>
    <text x="180" y="143" text-anchor="middle" class="vts">Territories: Puerto Rico, Guam, USVI, AS, CNMI</text>
    <!-- Borders & water boxes -->
    <rect x="10" y="178" width="160" height="88" rx="6" class="box"/>
    <text x="90" y="194" text-anchor="middle" class="vth" style="font-size:11px;">Borders</text>
    <text x="22" y="210" class="vts">North: Canada</text>
    <text x="22" y="224" class="vts">South: Mexico</text>
    <text x="22" y="238" class="vts">East: Atlantic Ocean</text>
    <text x="22" y="252" class="vts">West: Pacific Ocean</text>
    <rect x="184" y="178" width="166" height="88" rx="6" class="box"/>
    <text x="267" y="194" text-anchor="middle" class="vth" style="font-size:11px;">Major Rivers</text>
    <text x="196" y="210" class="vts">Mississippi River (longest)</text>
    <text x="196" y="224" class="vts">Missouri River</text>
    <text x="196" y="238" class="vts">Colorado River</text>
    <text x="196" y="252" class="vts">Rio Grande (SW border)</text>
  </svg>`,

  'state-local': `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Federal vs state vs local government">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Levels of Government</text>
    <!-- Federal -->
    <rect x="100" y="34" width="160" height="40" rx="6" fill="var(--color-primary)"/>
    <text x="180" y="52" text-anchor="middle" style="font-size:12px;font-weight:700;fill:white;">Federal Government</text>
    <text x="180" y="66" text-anchor="middle" style="font-size:10px;fill:rgba(255,255,255,0.85);">Washington, D.C.</text>
    <!-- Connector lines -->
    <line x1="180" y1="74" x2="90" y2="100" stroke="var(--color-border)" stroke-width="1.5"/>
    <line x1="180" y1="74" x2="180" y2="100" stroke="var(--color-border)" stroke-width="1.5"/>
    <line x1="180" y1="74" x2="270" y2="100" stroke="var(--color-border)" stroke-width="1.5"/>
    <!-- State govt boxes -->
    <rect x="20" y="100" width="145" height="82" rx="6" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="92" y="117" text-anchor="middle" class="vth" style="font-size:11px;">State Government</text>
    <text x="32" y="133" class="vts">• Governor (executive)</text>
    <text x="32" y="146" class="vts">• State legislature</text>
    <text x="32" y="159" class="vts">• State courts</text>
    <text x="32" y="172" class="vts">• Drivers licenses, education</text>
    <!-- Local govt boxes -->
    <rect x="195" y="100" width="145" height="82" rx="6" fill="var(--color-surface)" stroke="var(--color-primary)" stroke-width="1.5"/>
    <text x="267" y="117" text-anchor="middle" class="vth" style="font-size:11px;">Local Government</text>
    <text x="207" y="133" class="vts">• Mayor (cities)</text>
    <text x="207" y="146" class="vts">• City/County council</text>
    <text x="207" y="159" class="vts">• Police, fire, schools</text>
    <text x="207" y="172" class="vts">• Zoning, utilities</text>
    <!-- Unique federal powers -->
    <rect x="20" y="198" width="320" height="70" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1"/>
    <text x="180" y="214" text-anchor="middle" class="vth" style="font-size:11px;">Federal Powers Only</text>
    <text x="32" y="230" class="vts">• Print money  • Declare war  • Make treaties</text>
    <text x="32" y="244" class="vts">• Regulate interstate commerce  • Immigration</text>
    <text x="32" y="258" class="vts">• Postal service  • Armed forces</text>
  </svg>`,

  'symbols-holidays': `<svg viewBox="0 0 360 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American symbols and holidays">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; rx: 6; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Symbols &amp; Holidays</text>
    <!-- Flag facts -->
    <rect x="10" y="34" width="160" height="100" rx="6" class="box"/>
    <text x="90" y="51" text-anchor="middle" class="vth" style="font-size:11px;">The Flag</text>
    <text x="22" y="67" class="vts">• 50 stars = 50 states</text>
    <text x="22" y="80" class="vts">• 13 stripes = 13 colonies</text>
    <text x="22" y="93" class="vts">• Red: valor, white: purity</text>
    <text x="22" y="106" class="vts">• Blue: justice, vigilance</text>
    <text x="22" y="119" class="vts">• Pledge of Allegiance</text>
    <!-- National symbols -->
    <rect x="184" y="34" width="166" height="100" rx="6" class="box"/>
    <text x="267" y="51" text-anchor="middle" class="vth" style="font-size:11px;">National Symbols</text>
    <text x="196" y="67" class="vts">🦅 Bald Eagle (national bird)</text>
    <text x="196" y="80" class="vts">🗽 Statue of Liberty (NY)</text>
    <text x="196" y="93" class="vts">🔔 Liberty Bell (Philadelphia)</text>
    <text x="196" y="106" class="vts">🏛️ White House (president)</text>
    <text x="196" y="119" class="vts">📜 Declaration (July 4, 1776)</text>
    <!-- Holidays table -->
    <rect x="10" y="148" width="340" height="130" rx="6" class="box"/>
    <text x="180" y="165" text-anchor="middle" class="vth" style="font-size:11px;">Key American Holidays</text>
    <text x="22" y="181" class="vts">Jan 1 — New Year's Day</text>
    <text x="185" y="181" class="vts">May (3rd Mon) — Memorial Day</text>
    <text x="22" y="195" class="vts">Jan (3rd Mon) — MLK Jr. Day</text>
    <text x="185" y="195" class="vts">Jul 4 — Independence Day ★</text>
    <text x="22" y="209" class="vts">Feb (3rd Mon) — Presidents' Day</text>
    <text x="185" y="209" class="vts">Sep (1st Mon) — Labor Day</text>
    <text x="22" y="223" class="vts">Oct (2nd Mon) — Columbus Day</text>
    <text x="185" y="223" class="vts">Nov 11 — Veterans Day</text>
    <text x="22" y="237" class="vts">Nov (4th Thu) — Thanksgiving</text>
    <text x="185" y="237" class="vts">Dec 25 — Christmas</text>
    <text x="180" y="268" text-anchor="middle" class="vts">★ = Most likely to appear on test</text>
  </svg>`,

  'voting': `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Voting rights and elections">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .box { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
      .yes { fill: #2D7A46; opacity: 0.15; stroke: #2D7A46; stroke-width: 1.5; }
      .no { fill: #C8102E; opacity: 0.15; stroke: #C8102E; stroke-width: 1.5; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Voting Rights &amp; Elections</text>
    <!-- Who can vote -->
    <rect x="10" y="34" width="155" height="100" rx="6" class="yes"/>
    <text x="87" y="52" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#2D7A46;">Who CAN Vote</text>
    <text x="22" y="69" class="vts">✓ US citizens</text>
    <text x="22" y="83" class="vts">✓ Age 18 or older</text>
    <text x="22" y="97" class="vts">✓ Meet state residency rules</text>
    <text x="22" y="111" class="vts">✓ Registered to vote</text>
    <text x="22" y="125" class="vts">✓ Not disqualified by state law</text>
    <!-- Who cannot vote -->
    <rect x="195" y="34" width="155" height="100" rx="6" class="no"/>
    <text x="272" y="52" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#C8102E;">Who CANNOT Vote</text>
    <text x="207" y="69" class="vts">✗ Non-citizens</text>
    <text x="207" y="83" class="vts">✗ Under 18</text>
    <text x="207" y="97" class="vts">✗ Varies: felony conviction</text>
    <text x="207" y="111" class="vts">✗ Not registered</text>
    <!-- Amendments expanding voting -->
    <rect x="10" y="148" width="340" height="88" rx="6" class="box"/>
    <text x="180" y="165" text-anchor="middle" class="vth" style="font-size:11px;">Amendments That Expanded Voting</text>
    <text x="22" y="181" class="vts">15th (1870) — Black men gain right to vote</text>
    <text x="22" y="195" class="vts">19th (1920) — Women gain right to vote</text>
    <text x="22" y="209" class="vts">24th (1964) — No poll tax (removed fee to vote)</text>
    <text x="22" y="223" class="vts">26th (1971) — Voting age lowered to 18</text>
    <!-- Run for office requirement -->
    <rect x="10" y="248" width="340" height="24" rx="4" fill="var(--color-primary)" opacity="0.1"/>
    <text x="180" y="264" text-anchor="middle" class="vts" style="fill:var(--color-primary);">Citizens can run for office; President must be natural-born citizen</text>
  </svg>`,

  'rights-resp': `<svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rights and responsibilities of citizens">
    <style>
      .vt { font-family: 'Source Sans 3', sans-serif; font-size: 11px; fill: var(--color-text); }
      .vth { font-family: 'Playfair Display', serif; font-size: 12px; font-weight: 700; fill: var(--color-primary); }
      .vts { font-size: 10px; fill: var(--color-text-secondary); }
      .rbox { fill: var(--color-surface); stroke: var(--color-primary); stroke-width: 1.5; }
    </style>
    <text x="180" y="22" text-anchor="middle" class="vth" style="font-size:15px;">Citizen Rights &amp; Responsibilities</text>
    <!-- Rights column -->
    <rect x="10" y="36" width="162" height="186" rx="6" class="rbox"/>
    <text x="91" y="54" text-anchor="middle" class="vth">Rights</text>
    <text x="22" y="71" class="vts">• Freedom of speech &amp; press</text>
    <text x="22" y="85" class="vts">• Freedom of religion</text>
    <text x="22" y="99" class="vts">• Right to bear arms</text>
    <text x="22" y="113" class="vts">• Vote in elections</text>
    <text x="22" y="127" class="vts">• Run for public office</text>
    <text x="22" y="141" class="vts">• Fair, speedy trial</text>
    <text x="22" y="155" class="vts">• Due process of law</text>
    <text x="22" y="169" class="vts">• Petition the government</text>
    <text x="22" y="183" class="vts">• Equal protection</text>
    <text x="22" y="197" class="vts">• Bring family to US</text>
    <text x="22" y="211" class="vts">• Get federal jobs</text>
    <!-- Responsibilities column -->
    <rect x="188" y="36" width="162" height="186" rx="6" class="rbox"/>
    <text x="269" y="54" text-anchor="middle" class="vth">Responsibilities</text>
    <text x="200" y="71" class="vts">• Obey federal/state/local laws</text>
    <text x="200" y="85" class="vts">• Pay federal, state, local taxes</text>
    <text x="200" y="99" class="vts">• Register for Selective Service</text>
    <text x="200" y="113" class="vts">  (males, age 18)</text>
    <text x="200" y="127" class="vts">• Serve on a jury if called</text>
    <text x="200" y="141" class="vts">• Vote in elections</text>
    <text x="200" y="155" class="vts">• Participate in community</text>
    <text x="200" y="169" class="vts">• Defend the country</text>
    <text x="200" y="183" class="vts">  if needed</text>
    <!-- Bottom note -->
    <rect x="10" y="234" width="340" height="36" rx="6" fill="var(--color-primary)" opacity="0.08"/>
    <text x="180" y="250" text-anchor="middle" class="vth" style="font-size:10px;">Note: Voting is both a RIGHT and a RESPONSIBILITY</text>
    <text x="180" y="263" text-anchor="middle" class="vts">Permanent residents have most rights but cannot vote or run for federal office</text>
  </svg>`,

};

export function getVisual(categoryId) {
  return VISUALS[categoryId] ?? `<div style="text-align:center;padding:40px 20px;color:var(--color-text-secondary);font-size:14px;">No diagram available for this category.</div>`;
}
