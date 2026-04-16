import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

// ============================================
// State
// ============================================
let currentQRData = null;
let currentQRCanvas = null;

// ============================================
// DOM References
// ============================================
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const generateBtn = document.getElementById('generate-btn');
const previewEmpty = document.getElementById('preview-empty');
const previewResult = document.getElementById('preview-result');
const downloadActions = document.getElementById('download-actions');
const qrCanvas = document.getElementById('qr-canvas');
const qrInfo = document.getElementById('qr-info');
const dlPng = document.getElementById('dl-png');
const dlPdf = document.getElementById('dl-pdf');

// Colors
const qrColorInput = document.getElementById('qr-color');
const bgColorInput = document.getElementById('bg-color');
const qrColorLabel = document.getElementById('qr-color-label');
const bgColorLabel = document.getElementById('bg-color-label');

// Phone
const phoneTypeRadios = document.querySelectorAll('input[name="phone-type"]');
const smsMessageField = document.getElementById('sms-message-field');

// WiFi
const togglePwd = document.getElementById('toggle-pwd');
const wifiPassword = document.getElementById('wifi-password');

// ============================================
// Tab Switching
// ============================================
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// ============================================
// Phone type toggle
// ============================================
phoneTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const val = radio.value;
    smsMessageField.style.display = val === 'sms' ? 'block' : 'none';
  });
});

// ============================================
// Password toggle
// ============================================
togglePwd.addEventListener('click', () => {
  const type = wifiPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  wifiPassword.setAttribute('type', type);
  togglePwd.innerHTML = type === 'text'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
});

// ============================================
// Color pickers
// ============================================
qrColorInput.addEventListener('input', () => {
  qrColorLabel.textContent = qrColorInput.value;
});
bgColorInput.addEventListener('input', () => {
  bgColorLabel.textContent = bgColorInput.value;
});

// ============================================
// Build QR Data String
// ============================================
function buildQRString() {
  const activeTab = document.querySelector('.tab.active')?.dataset.tab;

  if (activeTab === 'link') {
    const url = document.getElementById('link-url').value.trim();
    if (!url) throw new Error('Insira uma URL válida.');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  if (activeTab === 'phone') {
    const number = document.getElementById('phone-number').value.trim().replace(/\s/g, '');
    if (!number) throw new Error('Insira um número de telefone.');
    const type = document.querySelector('input[name="phone-type"]:checked')?.value;

    if (type === 'call') return `tel:${number}`;
    if (type === 'whatsapp') {
      const clean = number.replace(/[^0-9]/g, '');
      return `https://wa.me/${clean}`;
    }
    if (type === 'sms') {
      const msg = document.getElementById('sms-message').value.trim();
      return msg ? `sms:${number}?body=${encodeURIComponent(msg)}` : `sms:${number}`;
    }
    return `tel:${number}`;
  }

  if (activeTab === 'wifi') {
    const ssid = document.getElementById('wifi-ssid').value.trim();
    if (!ssid) throw new Error('Insira o nome da rede WiFi.');
    const password = document.getElementById('wifi-password').value;
    const security = document.getElementById('wifi-security').value;
    const hidden = document.getElementById('wifi-hidden').checked ? 'true' : 'false';

    // WiFi QR format: WIFI:T:WPA;S:ssid;P:pass;H:hidden;;
    const escapedSSID = ssid.replace(/[\\;,"]/g, c => `\\${c}`);
    const escapedPass = password.replace(/[\\;,"]/g, c => `\\${c}`);
    return `WIFI:T:${security};S:${escapedSSID};P:${escapedPass};H:${hidden};;`;
  }

  throw new Error('Selecione um tipo de QR Code.');
}

// ============================================
// Info label
// ============================================
function buildInfoLabel(qrString) {
  if (qrString.startsWith('WIFI:')) {
    const ssid = document.getElementById('wifi-ssid').value;
    return `📶 WiFi: ${ssid}`;
  }
  if (qrString.startsWith('tel:')) return `📞 ${qrString.replace('tel:', '')}`;
  if (qrString.startsWith('sms:')) return `💬 SMS: ${qrString.replace('sms:', '').split('?')[0]}`;
  if (qrString.startsWith('https://wa.me/')) return `💬 WhatsApp: ${qrString.replace('https://wa.me/', '+')}`;
  if (qrString.length > 50) return qrString.substring(0, 50) + '…';
  return qrString;
}

// ============================================
// Generate QR Code
// ============================================
generateBtn.addEventListener('click', async () => {
  try {
    generateBtn.classList.add('loading');
    generateBtn.textContent = 'Gerando…';

    const qrString = buildQRString();
    const size = parseInt(document.getElementById('qr-size').value);
    const color = qrColorInput.value;
    const bgColor = bgColorInput.value;

    await QRCode.toCanvas(qrCanvas, qrString, {
      width: Math.min(size, 400),
      margin: 2,
      color: {
        dark: color,
        light: bgColor,
      },
      errorCorrectionLevel: 'H',
    });

    currentQRData = qrString;
    currentQRCanvas = qrCanvas;

    qrInfo.textContent = buildInfoLabel(qrString);

    // Show result
    previewEmpty.style.display = 'none';
    previewResult.style.display = 'flex';
    downloadActions.style.display = 'grid';

    showToast('QR Code gerado com sucesso!', 'success');
  } catch (err) {
    showToast(err.message || 'Erro ao gerar QR Code.');
    console.error(err);
  } finally {
    generateBtn.classList.remove('loading');
    generateBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      Gerar QR Code
    `;
  }
});

// ============================================
// Download PNG
// ============================================
dlPng.addEventListener('click', () => {
  if (!currentQRCanvas) return;

  const link = document.createElement('a');
  link.download = `qrcode-${Date.now()}.png`;
  link.href = currentQRCanvas.toDataURL('image/png');
  link.click();

  showToast('PNG baixado!', 'success');
});

// ============================================
// Download PDF
// ============================================
dlPdf.addEventListener('click', () => {
  if (!currentQRCanvas) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = 210;
  const pageH = 297;
  const imgSize = 100;
  const x = (pageW - imgSize) / 2;
  const y = 60;

  // Background
  pdf.setFillColor(13, 13, 15);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(26);
  pdf.setTextColor(200, 255, 87);
  pdf.text('QR Studio', pageW / 2, 35, { align: 'center' });

  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.setTextColor(136, 136, 136);
  pdf.text('Gerador de QR Code', pageW / 2, 43, { align: 'center' });

  // White card behind QR
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(x - 6, y - 6, imgSize + 12, imgSize + 12, 4, 4, 'F');

  // QR Code image
  const imgData = currentQRCanvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', x, y, imgSize, imgSize);

  // Info text
  const info = buildInfoLabel(currentQRData);
  pdf.setFontSize(11);
  pdf.setTextColor(200, 200, 200);
  pdf.text(info, pageW / 2, y + imgSize + 24, { align: 'center', maxWidth: 160 });

  // Scan instruction
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Aponte a câmera do celular para ler este QR Code', pageW / 2, y + imgSize + 34, { align: 'center' });

  // Divider
  pdf.setDrawColor(42, 42, 46);
  pdf.line(20, pageH - 30, pageW - 20, pageH - 30);

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(80, 80, 80);
  pdf.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} via QRStudio`, pageW / 2, pageH - 20, { align: 'center' });

  pdf.save(`qrcode-${Date.now()}.pdf`);
  showToast('PDF baixado!', 'success');
});

// ============================================
// Toast
// ============================================
function showToast(message, type = 'error') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `toast ${type}`;

  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  });
}

// ============================================
// Keyboard shortcut: Enter to generate
// ============================================
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.ctrlKey) {
    generateBtn.click();
  }
});
