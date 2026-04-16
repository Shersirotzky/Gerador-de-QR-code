let qr;

function generateQR(){
  const value = document.getElementById("input").value;
  document.getElementById("qrcode").innerHTML = "";
  qr = new QRCode(document.getElementById("qrcode"), value);
}

function getCanvas(){
  return document.querySelector("#qrcode canvas");
}

function downloadPNG(){
  const canvas = getCanvas();
  if(!canvas) return alert("Gere o QR primeiro");
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "qrcode.png";
  link.click();
}

function downloadPDF(){
  const canvas = getCanvas();
  if(!canvas) return alert("Gere o QR primeiro");
  const img = canvas.toDataURL();
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.addImage(img, "PNG", 30, 30, 150, 150);
  pdf.save("qrcode.pdf");
}
