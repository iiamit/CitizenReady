import { readinessBand } from './readiness.js';
import { isCapacitor } from './platform.js';

export async function generateScoreCard(score, categoryStats) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  const band = readinessBand(score);

  // Background
  ctx.fillStyle = '#FAFAFA';
  ctx.fillRect(0, 0, 1200, 630);

  // Navy left stripe
  ctx.fillStyle = '#1A3A5C';
  ctx.fillRect(0, 0, 8, 630);

  // Header
  ctx.fillStyle = '#1A3A5C';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText('CitizenReady', 60, 82);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillStyle = '#666';
  ctx.fillText('US Naturalization Test Prep', 60, 116);

  // Divider
  ctx.strokeStyle = '#E8E8E8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 142);
  ctx.lineTo(1140, 142);
  ctx.stroke();

  // Score gauge (semi-circle)
  const cx = 270, cy = 370, r = 150;
  // Track
  ctx.strokeStyle = '#E8E8E8';
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.stroke();
  // Fill
  ctx.strokeStyle = band.color;
  const endAngle = Math.PI + (Math.PI * Math.min(score, 100) / 100);
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, endAngle);
  ctx.stroke();

  // Score number
  ctx.fillStyle = band.color;
  ctx.font = 'bold 96px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${score}%`, cx, cy + 30);
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillStyle = '#444';
  ctx.fillText(band.label, cx, cy + 70);

  // Category bars (right side)
  ctx.textAlign = 'left';
  const barStartX = 540, barStartY = 185;
  const barW = 540, barH = 16, barGap = 36;

  ctx.fillStyle = '#111';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText('Category Mastery', barStartX, barStartY - 12);

  const visible = (categoryStats ?? []).slice(0, 11);
  visible.forEach(({ name, mastery }, i) => {
    const y = barStartY + i * barGap;
    const pct = Math.round((mastery ?? 0) * 100);

    ctx.fillStyle = '#555';
    ctx.font = '15px system-ui, sans-serif';
    // Truncate long names
    const label = name.length > 34 ? name.slice(0, 32) + '…' : name;
    ctx.fillText(label, barStartX, y + barH - 2);

    // Track
    ctx.fillStyle = '#E8E8E8';
    ctx.beginPath();
    ctx.roundRect?.(barStartX, y + barH + 4, barW, barH, 4);
    ctx.fill();

    // Fill
    if (pct > 0) {
      ctx.fillStyle = pct >= 70 ? '#2E7D32' : '#E65100';
      ctx.beginPath();
      const fw = Math.max((pct / 100) * barW, 6);
      ctx.roundRect?.(barStartX, y + barH + 4, fw, barH, 4);
      ctx.fill();
    }

    ctx.fillStyle = '#666';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(`${pct}%`, barStartX + barW + 10, y + barH * 2);
  });

  // Footer
  ctx.fillStyle = '#E8E8E8';
  ctx.fillRect(0, 586, 1200, 44);
  ctx.fillStyle = '#888';
  ctx.font = '16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('citizenready.app', 60, 613);
  ctx.textAlign = 'right';
  ctx.fillText('Not affiliated with or endorsed by USCIS.', 1140, 613);

  return canvas.toDataURL('image/png');
}

export async function shareScoreCard(score, categoryStats) {
  const dataUrl = await generateScoreCard(score, categoryStats);
  const base64 = dataUrl.split(',')[1];

  if (isCapacitor()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const file = await Filesystem.writeFile({
      path: 'citizenready-score.png',
      data: base64,
      directory: Directory.Cache
    });
    await Share.share({
      title: 'My CitizenReady Readiness Score',
      text: `I'm ${score}% ready for my US citizenship test! Studying with CitizenReady.`,
      url: file.uri
    });
    return;
  }

  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], 'citizenready-score.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: 'My CitizenReady Readiness Score',
      text: `I'm ${score}% ready for my US citizenship test!`,
      files: [file]
    });
    return;
  }

  // Fallback: download
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'citizenready-score.png';
  a.click();
}
