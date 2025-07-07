import { Element } from '../types';

export const exportLayoutToHTML = (elements: Element[], layoutName: string): string => {
  const elementHTML = elements.map(element => {
    const style = `
      position: absolute;
      left: ${element.x}px;
      top: ${element.y}px;
      width: ${element.width}px;
      height: ${element.height}px;
    `;

    switch (element.type) {
      case 'text':
        const textElement = element as any;
        return `
          <div style="${style} font-family: ${textElement.fontFamily || 'Arial'}; font-size: ${textElement.fontSize || 14}px; color: #000; display: flex; align-items: center; justify-content: center; border: 1px solid #ccc; background: white; padding: 8px; box-sizing: border-box;">
            ${textElement.text || 'Text'}
          </div>
        `;
      
      case 'image':
        const imageElement = element as any;
        return `
          <div style="${style} border: 1px solid #ccc; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">
            [Image: ${imageElement.src || 'No source'}]
          </div>
        `;
      
      case 'button':
        const buttonElement = element as any;
        return `
          <button style="${style} background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
            ${buttonElement.text || 'Button'}
          </button>
        `;
      
      default:
        return '';
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${layoutName}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
        }
        .layout-container {
            position: relative;
            width: 800px;
            height: 600px;
            margin: 0 auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .layout-title {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
            font-size: 24px;
            font-weight: bold;
        }
        .export-info {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="layout-title">${layoutName}</div>
    <div class="layout-container">
        ${elementHTML}
    </div>
    <div class="export-info">
        Exported from Layout Builder on ${new Date().toLocaleDateString()}
    </div>
</body>
</html>`;
};

export const downloadHTML = (html: string, filename: string): void => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 