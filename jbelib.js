function createQRWithLogo(containerId, url, logoUrl, options = {}) {
  // Default settings
  const defaults = {
    width: 246,
    height: 246,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H, // High correction required for logo
    logoRatio: 0.2,   // Logo size = 20% of QR size
    logoMargin: 6     // White padding around logo
  };

  // Merge custom options
  const config = { ...defaults, ...options };

  // Step 1: Create base QR code
  const container = document.getElementById(containerId);
  const qr = new QRCode(container, {
    width: config.width,
    height: config.height,
    colorDark: config.colorDark,
    colorLight: config.colorLight,
    correctLevel: config.correctLevel
  });

  qr.makeCode(url);

  // Step 2: Add logo after QR is rendered
  setTimeout(() => {
    const qrImage = container.querySelector("img");
    if (!qrImage) {
      console.error("QR image not found");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = config.width;
    canvas.height = config.height;

    const logo = new Image();
    logo.crossOrigin = "anonymous"; // Avoid CORS issues
    logo.onload = () => {
      // Draw original QR first
      ctx.drawImage(qrImage, 0, 0, config.width, config.height);

      // Calculate logo position & size
      const logoSize = config.width * config.logoRatio;
      const x = (config.width - logoSize) / 2;
      const y = (config.height - logoSize) / 2;

      // Draw white background behind logo
      ctx.fillStyle = config.colorLight;
      ctx.fillRect(
        x - config.logoMargin,
        y - config.logoMargin,
        logoSize + config.logoMargin * 2,
        logoSize + config.logoMargin * 2
      );

      // Draw logo
      ctx.drawImage(logo, x, y, logoSize, logoSize);

      // Replace original QR image with the new one containing logo
      qrImage.src = canvas.toDataURL("image/png");
    };

    logo.src = logoUrl;
  }, 100); // Small delay ensures QR is fully drawn

  return qr;
}

function share_app(){
  if(navigator.share) {
    navigator.share({
      title: document.title,
      //text: 'E-Store App',
      text: document.title,
      url: location.href,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => {
      console.log('Error sharing', error);
      MSG_SHOW(vbOk,"Error sharing:",error,function(){},function(){});
     })
  }
}


async function generateQRWithLogoSimplified(url, logoUrl, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  const size = 300;
  const logoSize = 60;
  
  // Create canvas for QR code
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  // Generate QR code
  await QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H'
  });
  
  // Create a new canvas to combine QR and logo
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = size;
  finalCanvas.height = size;
  const ctx = finalCanvas.getContext('2d');
  
  // Draw QR code
  ctx.drawImage(canvas, 0, 0);
  
  // Load and draw logo
  const logo = new Image();
  logo.crossOrigin = 'anonymous';
  logo.src = logoUrl;
  
  await new Promise((resolve) => {
      logo.onload = () => {
          // White background for logo
          const centerX = (size - logoSize) / 2;
          const centerY = (size - logoSize) / 2;
          
          ctx.fillStyle = 'white';
          ctx.fillRect(centerX - 10, centerY - 10, logoSize + 20, logoSize + 20);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeRect(centerX - 10, centerY - 10, logoSize + 20, logoSize + 20);
          
          // Draw logo
          ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);
          
          // Display result
          const img = document.createElement('img');
          img.src = finalCanvas.toDataURL();
          container.appendChild(img);
          
          resolve();
      };
  });
}
/*
// Usage
        generateQRWithLogoSimplified(
            'https://example.com',
            'https://via.placeholder.com/60',
            'qrcode-container'
        );
*/