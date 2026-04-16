# QR Studio — Gerador de QR Code

Gerador de QR Code moderno, responsivo e gratuito. Suporta links, telefones e redes WiFi. Download em PNG e PDF.

## ✨ Funcionalidades

- **Link** — Gera QR para qualquer URL
- **Telefone** — Ligar, SMS ou WhatsApp
- **WiFi** — Compartilhe senha de rede facilmente
- **Personalização** — Cor do QR, cor de fundo e tamanho
- **Download PNG** — Imagem de alta qualidade
- **Download PDF** — Página A4 com layout profissional
- **Responsivo** — Funciona perfeitamente em mobile

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (http://localhost:3000)
npm run dev

# Build para produção
npm run build

# Pré-visualizar build
npm run preview
```

## 📁 Estrutura

```
qr-generator/
├── index.html              # HTML principal
├── src/
│   ├── main.js             # Lógica da aplicação
│   └── style.css           # Estilos
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions
├── vite.config.js
├── package.json
└── .gitignore
```

## 🔧 Deploy com GitHub Actions

O workflow em `.github/workflows/deploy.yml` faz automaticamente:

1. Instala as dependências (`npm ci`)
2. Faz o build (`npm run build`)
3. Publica na branch `gh-pages` (GitHub Pages)

### Ativar GitHub Pages

1. Vá em **Settings → Pages** no seu repositório
2. Em **Source**, selecione a branch `gh-pages`
3. Salve — o site ficará disponível em `https://seu-usuario.github.io/qr-generator/`

## 🛠 Tecnologias

- [Vite](https://vitejs.dev/) — Build tool
- [qrcode](https://github.com/soldair/node-qrcode) — Geração de QR Code
- [jsPDF](https://github.com/parallax/jsPDF) — Exportação em PDF
- Google Fonts (Syne + DM Sans)
