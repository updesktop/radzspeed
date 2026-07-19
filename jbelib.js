function createQRWithLogo(containerId, url, logoPath, options = {}) {
  return new Promise((resolve, reject) => {
    const defaults = {
      width: 246,
      height: 246,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H, // High correction = safe for logo
      logoRatio: 0.22,    // Logo size % of QR
      logoMargin: 6       // White padding around logo
    };

    const config = { ...defaults, ...options };
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    // Step 1: Create QR using qrcodejs
    const tempDiv = document.createElement("div");
    new QRCode(tempDiv, {
      text: url,
      width: config.width,
      height: config.height,
      colorDark: config.colorDark,
      colorLight: config.colorLight,
      correctLevel: config.correctLevel
    });

    // Wait for QR to render
    setTimeout(() => {
      const qrImg = tempDiv.querySelector("img") || tempDiv.querySelector("canvas");
      if (!qrImg) {
        const err = new Error("QR image not generated");
        console.error(err);
        reject(err);
        return;
      }

      // Step 2: Load and convert logo to Base64 internally
      const logo = new Image();
      logo.crossOrigin = "anonymous";

      logo.onload = () => {
        // Convert logo to Base64
        const logoCanvas = document.createElement("canvas");
        const logoCtx = logoCanvas.getContext("2d");
        logoCanvas.width = logo.naturalWidth;
        logoCanvas.height = logo.naturalHeight;
        logoCtx.drawImage(logo, 0, 0);
        const logoBase64 = logoCanvas.toDataURL("image/png");

        // Step 3: Draw everything onto one final canvas
        const finalCanvas = document.createElement("canvas");
        const ctx = finalCanvas.getContext("2d");
        finalCanvas.width = config.width;
        finalCanvas.height = config.height;

        const qrReady = new Image();
        qrReady.onload = () => {
          // Draw QR background
          ctx.drawImage(qrReady, 0, 0, config.width, config.height);

          // Calculate logo position & size
          const logoSize = config.width * config.logoRatio;
          const x = (config.width - logoSize) / 2;
          const y = (config.height - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = config.colorLight;
          ctx.fillRect(
            x - config.logoMargin,
            y - config.logoMargin,
            logoSize + config.logoMargin * 2,
            logoSize + config.logoMargin * 2
          );

          // Draw logo from Base64
          const logoFinal = new Image();
          logoFinal.onload = () => {
            ctx.drawImage(logoFinal, x, y, logoSize, logoSize);
            // Show final merged image
            const finalImg = document.createElement("img");
            finalImg.src = finalCanvas.toDataURL("image/png");
            container.appendChild(finalImg);
            console.log("✅ QR + Logo generated successfully");
            resolve(finalImg.src);
          };
          logoFinal.src = logoBase64;
        };
        qrReady.src = qrImg.tagName === "IMG" ? qrImg.src : qrImg.toDataURL();
      };

      logo.onerror = () => {
        console.warn("⚠️ Logo failed — showing QR only");
        const qrOnly = new Image();
        qrOnly.onload = () => container.appendChild(qrOnly);
        qrOnly.src = qrImg.tagName === "IMG" ? qrImg.src : qrImg.toDataURL();
        resolve(qrOnly.src);
      };

      logo.src = logoPath;
    }, 100);
  });
}


function zzzzcreateQRWithLogo(containerId, url, logoUrl, options = {}) {
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

//--------------------------------------------------------------------------------
/**
 * Generates a QR code image with a centered logo - Chrome Android compatible
 * @param {string} url - The URL or text to encode in the QR code
 * @param {string} logoUrl - URL or base64 string of the logo image
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} - Returns a promise that resolves to a data URL
 */
async function generateQRWithLogo(url, logoUrl, options = {}) {
    const {
        size = 300,
        logoSize = 60,
        logoBackground = '#ffffff',
        logoBorderRadius = 8,
        errorCorrectionLevel = 'H'
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        // Generate QR code first
        QRCode.toCanvas(canvas, url, {
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: errorCorrectionLevel
        }, async (error) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                // Convert logo URL to base64 to avoid CORS issues
                const logoBase64 = await convertImageToBase64(logoUrl);
                
                // Create a new canvas for the final composition
                const finalCanvas = document.createElement('canvas');
                finalCanvas.width = size;
                finalCanvas.height = size;
                const ctx = finalCanvas.getContext('2d');
                
                // Draw QR code
                ctx.drawImage(canvas, 0, 0);
                
                // Load logo from base64
                const logo = await loadImageFromBase64(logoBase64);
                
                // Calculate logo position (center)
                const logoX = (size - logoSize) / 2;
                const logoY = (size - logoSize) / 2;
                const padding = 10;
                
                // Draw white background with border
                ctx.save();
                
                // Background
                ctx.fillStyle = logoBackground;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                roundRect(
                    ctx, 
                    logoX - padding, 
                    logoY - padding, 
                    logoSize + (padding * 2), 
                    logoSize + (padding * 2), 
                    logoBorderRadius
                );
                ctx.fill();
                
                // Reset shadow for border
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                
                // Border
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                roundRect(
                    ctx, 
                    logoX - padding, 
                    logoY - padding, 
                    logoSize + (padding * 2), 
                    logoSize + (padding * 2), 
                    logoBorderRadius
                );
                ctx.stroke();
                
                ctx.restore();
                
                // Draw the logo
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                
                resolve(finalCanvas.toDataURL('image/png', 1.0));
            } catch (err) {
                console.error('Error adding logo:', err);
                // Return QR code without logo as fallback
                resolve(canvas.toDataURL('image/png', 1.0));
            }
        });
    });
}

/**
 * Convert image URL to base64 to avoid CORS issues
 */
function convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
        // If it's already base64, return as is
        if (url.startsWith('data:image')) {
            resolve(url);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => {
            // If XHR fails, try canvas approach
            tryCanvasConversion(url).then(resolve).catch(reject);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

/**
 * Fallback method to convert image using canvas
 */
function tryCanvasConversion(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            try {
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                reject(new Error('Canvas conversion failed - CORS issue'));
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        img.src = url;
    });
}

/**
 * Load image from base64 string
 */
function loadImageFromBase64(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load base64 image'));
        img.src = base64;
    });
}

/**
 * Draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}