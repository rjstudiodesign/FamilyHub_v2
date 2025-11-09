// src/utils/imageOptimization.js
/**
 * Bild-Optimierung und Lazy-Loading
 */

export function createImageElement(src, alt = '', className = '', lazy = true) {
  const img = document.createElement('img');
  img.alt = alt;
  img.className = className;
  
  if (lazy) {
    img.loading = 'lazy';
    img.dataset.src = src;
    
    // Intersection Observer für Progressive Loading
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.add('fade-in');
          observer.unobserve(image);
        }
      });
    });
    
    observer.observe(img);
  } else {
    img.src = src;
  }
  
  return img;
}

export async function compressImage(file, maxWidth = 1920, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type, quality);
      };
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
