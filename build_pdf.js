const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

// Configure marked
marked.setOptions({
    gfm: true,
    breaks: true
});

const mdPath = path.resolve(__dirname, 'BAO_CAO_GIAM_DINH_NAM_NHU_DAY_DU.md');
const htmlPath = path.resolve(__dirname, 'BAO_CAO_GIAM_DINH_NAM_NHU_DAY_DU.html');
const pdfPath = path.resolve(__dirname, 'BAO_CAO_GIAM_DINH_NAM_NHU_DAY_DU.pdf');

console.log('Reading markdown from:', mdPath);
let mdContent = fs.readFileSync(mdPath, 'utf8');

// Replace relative image paths with absolute file URLs so headless browser resolves them reliably
const imageDir = path.resolve(__dirname, 'image').replace(/\\/g, '/');
mdContent = mdContent.replace(/!\[(.*?)\]\(image\/([^)]+)\)/g, (match, alt, filename) => {
    const fullImgPath = path.resolve(__dirname, 'image', filename).replace(/\\/g, '/');
    return `![${alt}](file:///${fullImgPath})`;
});

console.log('Converting Markdown to HTML...');
const bodyHtml = marked.parse(mdContent);

const htmlTemplate = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>BẢN GIÁM ĐỊNH PHÁP Y KỸ THUẬT PHẦN MỀM - TRẦN QUỐC VIỆT NAM VÀ TRẦN PHẠM HUỲNH NHƯ</title>
    <style>
        @page {
            size: A4;
            margin: 18mm 15mm 20mm 15mm;
            @bottom-right {
                content: counter(page);
            }
        }
        
        *, *::before, *::after {
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
            font-size: 13.5px;
            line-height: 1.65;
            color: #1a202c;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #0f172a;
            font-weight: 700;
            line-height: 1.3;
            margin-top: 1.6em;
            margin-bottom: 0.6em;
            page-break-after: avoid;
        }

        h1 {
            font-size: 22px;
            border-bottom: 2.5px solid #2563eb;
            padding-bottom: 8px;
            margin-top: 24px;
            color: #1e3a8a;
            text-transform: uppercase;
        }

        h2 {
            font-size: 17px;
            border-bottom: 1.5px solid #cbd5e1;
            padding-bottom: 5px;
            margin-top: 20px;
            color: #1e40af;
        }

        h3 {
            font-size: 15px;
            color: #0369a1;
            margin-top: 16px;
        }

        h4 {
            font-size: 14px;
            color: #334155;
        }

        p, ul, ol {
            margin-top: 0;
            margin-bottom: 10px;
        }

        li {
            margin-bottom: 4px;
        }

        blockquote {
            margin: 12px 0;
            padding: 10px 16px;
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            color: #334155;
            border-radius: 0 6px 6px 0;
            font-style: italic;
            page-break-inside: avoid;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            font-size: 12px;
            line-height: 1.45;
            page-break-inside: avoid;
            background-color: #ffffff;
        }

        th, td {
            border: 1px solid #cbd5e1;
            padding: 8px 10px;
            text-align: left;
            vertical-align: top;
        }

        th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
            border-bottom: 2px solid #94a3b8;
        }

        tr:nth-child(even) {
            background-color: #f8fafc;
        }

        code {
            font-family: 'Cascadia Code', 'Fira Code', 'Consolas', 'Courier New', monospace;
            font-size: 12px;
            background-color: #f1f5f9;
            color: #b91c1c;
            padding: 2px 5px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }

        pre {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 12px 14px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 11.5px;
            line-height: 1.5;
            page-break-inside: avoid;
            margin: 12px 0;
        }

        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
            border: none;
            font-size: inherit;
        }

        img {
            max-width: 96%;
            height: auto;
            display: block;
            margin: 12px auto;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            page-break-inside: avoid;
        }

        hr {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 20px 0;
        }

        strong {
            color: #0f172a;
            font-weight: 600;
        }

        /* Evidence blocks styling */
        h3[id^="mã-chứng-cứ"], h3:has(+ p strong) {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 8px 12px;
            border-left: 4px solid #0284c7;
            border-radius: 4px;
            margin-top: 24px;
            page-break-after: avoid;
        }

        .footer-note {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #cbd5e1;
            font-size: 11px;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>
    ${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
console.log('HTML written to:', htmlPath);

// Execute Edge / Chrome headless print
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browserExe = fs.existsSync(edgePath) ? edgePath : chromePath;

console.log('Using browser for PDF generation:', browserExe);

const cmd = `"${browserExe}" --headless --disable-gpu --allow-file-access-from-files --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;

console.log('Executing print-to-pdf command...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`\n>>> SUCCESS: PDF generated successfully!`);
    console.log(`>>> Output PDF: ${pdfPath}`);
    console.log(`>>> Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
} else {
    console.error('ERROR: PDF file was not created.');
    process.exit(1);
}
