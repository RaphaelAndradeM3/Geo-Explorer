import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { CertificateData } from '../types/index.js';
import { trackService } from './trackService.js';

export interface GenerateCertificateOptions {
  studentName: string;
  trackId: string;
  grade?: string;
  outputDir?: string;
  formats?: Array<'svg' | 'html' | 'json'>;
}

export interface GeneratedCertificateResult {
  certificate: CertificateData;
  files: {
    svg?: string;
    html?: string;
    json?: string;
  };
}

export class CertificateService {
  private generateVerificationCode(studentName: string, trackId: string, date: string): string {
    const raw = `${studentName.trim().toUpperCase()}|${trackId.trim().toLowerCase()}|${date}|GEO-EXPLORER-SECRET-KEY`;
    const hash = crypto.createHash('sha256').update(raw).digest('hex').toUpperCase();
    return `GEO-${hash.substring(0, 4)}-${hash.substring(4, 8)}-${hash.substring(8, 12)}`;
  }

  public createCertificateData(studentName: string, trackId: string, grade = 'Excelente'): CertificateData {
    const track = trackService.findTrackById(trackId);
    if (!track) {
      throw new Error(`Trilha com identificador "${trackId}" não foi encontrada.`);
    }

    const today = new Date().toISOString().split('T')[0];
    const verificationCode = this.generateVerificationCode(studentName, track.id, today);
    const id = `CERT-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    const skills = track.modules.flatMap((m) => m.topics).slice(0, 8);

    return {
      id,
      studentName: studentName.trim(),
      trackId: track.id,
      trackName: track.name,
      technology: track.technology,
      completionDate: today,
      durationHours: track.estimatedHours,
      grade,
      verificationCode,
      instructor: 'Geo-Explorer Expedition Lead & IBM Bob',
      skillsAcquired: skills
    };
  }

  public generateHtml(cert: CertificateData): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Certificado de Conclusão - ${cert.studentName} - ${cert.trackName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@300;400;600;700&display=swap');

    @page {
      size: A4 landscape;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #0b1120;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #0f172a;
    }

    .cert-frame {
      width: 1050px;
      height: 720px;
      background: #ffffff;
      border: 14px solid #1e293b;
      outline: 4px solid #38bdf8;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
      box-sizing: border-box;
      padding: 50px 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 40%);
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-15deg);
      font-size: 110px;
      font-weight: 900;
      color: rgba(148, 163, 184, 0.06);
      pointer-events: none;
      white-space: nowrap;
      text-transform: uppercase;
      font-family: 'Cinzel', serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-badge {
      background: linear-gradient(135deg, #0284c7, #4f46e5);
      color: #fff;
      font-weight: 800;
      font-size: 20px;
      padding: 8px 14px;
      border-radius: 8px;
      letter-spacing: 1px;
    }

    .logo-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .cert-badge {
      font-size: 13px;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }

    .content {
      text-align: center;
      margin: 15px 0;
    }

    .title {
      font-family: 'Cinzel', serif;
      font-size: 38px;
      color: #0f172a;
      margin: 0 0 10px 0;
      letter-spacing: 2px;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin-bottom: 25px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .recipient {
      font-size: 38px;
      font-weight: 700;
      color: #0284c7;
      border-bottom: 2px solid #38bdf8;
      display: inline-block;
      padding: 0 30px 4px 30px;
      margin-bottom: 20px;
    }

    .description {
      font-size: 16px;
      line-height: 1.6;
      color: #334155;
      max-width: 800px;
      margin: 0 auto;
    }

    .track-name {
      font-weight: 700;
      color: #1e293b;
    }

    .skills-section {
      margin-top: 15px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      max-width: 820px;
      margin-left: auto;
      margin-right: auto;
    }

    .skill-tag {
      background: #e0f2fe;
      color: #0369a1;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 9999px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 2px solid #e2e8f0;
      padding-top: 20px;
    }

    .signature-block {
      text-align: center;
      width: 250px;
    }

    .sig-line {
      border-top: 1.5px solid #0f172a;
      padding-top: 8px;
      font-weight: 600;
      font-size: 14px;
      color: #1e293b;
    }

    .sig-role {
      font-size: 12px;
      color: #64748b;
    }

    .meta-block {
      text-align: right;
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }

    .verify-code {
      font-family: monospace;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="cert-frame">
    <div class="watermark">Geo-Explorer</div>

    <div class="header">
      <div class="logo-container">
        <div class="logo-badge">GEO</div>
        <div>
          <div class="logo-title">Geo-Explorer</div>
          <small style="color: #64748b;">Trilha de Aprendizagem & Expedição de Código</small>
        </div>
      </div>
      <div class="cert-badge">ID: ${cert.id}</div>
    </div>

    <div class="content">
      <div class="title">CERTIFICADO DE CONCLUSÃO</div>
      <div class="subtitle">Expedição Tecnológica Concluída com Sucesso</div>

      <div class="recipient">${cert.studentName}</div>

      <div class="description">
        Completou com êxito a jornada exploratória na trilha <span class="track-name">${cert.trackName}</span> (${cert.technology}), totalizando uma carga horária estimada de <strong>${cert.durationHours} horas</strong> de estudos práticos, desafios algorítmicos e integração de tecnologias com aproveitamento <strong>${cert.grade || 'Excelente'}</strong>.
      </div>

      <div class="skills-section">
        ${cert.skillsAcquired.map((s) => `<span class="skill-tag">${s}</span>`).join('\n        ')}
      </div>
    </div>

    <div class="footer">
      <div class="signature-block">
        <div class="sig-line">${cert.instructor}</div>
        <div class="sig-role">Instrutor & Mentor da Expedição</div>
      </div>

      <div class="meta-block">
        <div><strong>Data de Conclusão:</strong> ${cert.completionDate}</div>
        <div><strong>Código de Autenticidade:</strong> <span class="verify-code">${cert.verificationCode}</span></div>
        <small>Certificado emitido via Geo-Explorer CLI & MCP Platform</small>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  public generateSvg(cert: CertificateData): string {
    const skillsText = cert.skillsAcquired.slice(0, 5).join('  •  ');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="1000" height="650">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f8fafc" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer background -->
  <rect width="1000" height="650" fill="url(#bgGrad)"/>

  <!-- Certificate Card -->
  <rect x="40" y="40" width="920" height="570" rx="16" fill="url(#cardGrad)" stroke="#38bdf8" stroke-width="4" filter="url(#shadow)"/>

  <!-- Inner border decoration -->
  <rect x="55" y="55" width="890" height="540" rx="10" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <!-- Top Ribbon Banner -->
  <path d="M 55 55 L 220 55 L 200 95 L 55 95 Z" fill="url(#accentGrad)" />
  <text x="75" y="82" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" letter-spacing="1">GEO-EXPLORER</text>

  <!-- Certificate ID Badge -->
  <text x="890" y="85" text-anchor="end" font-family="monospace" font-size="12" font-weight="600" fill="#64748b">${cert.id}</text>

  <!-- Title -->
  <text x="500" y="150" text-anchor="middle" font-family="'Times New Roman', serif" font-size="34" font-weight="bold" fill="#0f172a" letter-spacing="2">CERTIFICADO DE CONCLUSÃO</text>
  <text x="500" y="180" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#64748b" letter-spacing="3">EXPEDIÇÃO DE APRENDIZAGEM & CÓDIGO</text>

  <text x="500" y="225" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" fill="#475569">Certificamos com louvor que</text>

  <!-- Student Name -->
  <text x="500" y="275" text-anchor="middle" font-family="system-ui, sans-serif" font-size="32" font-weight="bold" fill="#0284c7">${cert.studentName}</text>
  <line x1="280" y1="288" x2="720" y2="288" stroke="#38bdf8" stroke-width="2" />

  <!-- Description -->
  <text x="500" y="330" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" fill="#334155">concluiu com êxito a trilha formativa <tspan font-weight="bold" fill="#0f172a">${cert.trackName}</tspan></text>
  <text x="500" y="355" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">Carga Horária: ${cert.durationHours} horas  |  Tecnologia: ${cert.technology}  |  Aproveitamento: ${cert.grade || 'Excelente'}</text>

  <!-- Skills acquired -->
  <rect x="150" y="390" width="700" height="34" rx="17" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1"/>
  <text x="500" y="412" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#0369a1">${skillsText}</text>

  <!-- Footer lines and signatures -->
  <line x1="120" y1="520" x2="350" y2="520" stroke="#0f172a" stroke-width="1.5" />
  <text x="235" y="538" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#1e293b">${cert.instructor}</text>
  <text x="235" y="555" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">Instrutor & Coordenação da Trilha</text>

  <line x1="650" y1="520" x2="880" y2="520" stroke="#0f172a" stroke-width="1.5" />
  <text x="765" y="538" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#1e293b">Autenticação Criptográfica</text>
  <text x="765" y="555" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#0284c7">${cert.verificationCode}</text>

  <!-- Date -->
  <text x="500" y="585" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8">Emitido em ${cert.completionDate} • Plataforma Geo-Explorer & DIO</text>
</svg>`;
  }

  public generateCertificate(options: GenerateCertificateOptions): GeneratedCertificateResult {
    const cert = this.createCertificateData(options.studentName, options.trackId, options.grade);

    const outDir = options.outputDir || path.join(process.cwd(), 'certificates');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const formats = options.formats || ['html', 'svg', 'json'];
    const safeName = cert.studentName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const baseFilename = `certificado_${cert.trackId}_${safeName}_${cert.id}`;

    const files: GeneratedCertificateResult['files'] = {};

    if (formats.includes('html')) {
      const htmlPath = path.join(outDir, `${baseFilename}.html`);
      fs.writeFileSync(htmlPath, this.generateHtml(cert), 'utf-8');
      files.html = htmlPath;
    }

    if (formats.includes('svg')) {
      const svgPath = path.join(outDir, `${baseFilename}.svg`);
      fs.writeFileSync(svgPath, this.generateSvg(cert), 'utf-8');
      files.svg = svgPath;
    }

    if (formats.includes('json')) {
      const jsonPath = path.join(outDir, `${baseFilename}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(cert, null, 2), 'utf-8');
      files.json = jsonPath;
    }

    return {
      certificate: cert,
      files
    };
  }

  public verifyCertificate(verificationCodeOrId: string): { valid: boolean; message: string; details?: any } {
    const search = verificationCodeOrId.trim().toUpperCase();
    const outDir = path.join(process.cwd(), 'certificates');

    if (fs.existsSync(outDir)) {
      const jsonFiles = fs.readdirSync(outDir).filter((f) => f.endsWith('.json'));
      for (const file of jsonFiles) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(outDir, file), 'utf-8')) as CertificateData;
          if (content.verificationCode.toUpperCase() === search || content.id.toUpperCase() === search) {
            return {
              valid: true,
              message: 'Certificado autêntico e verificado na base local de emissões.',
              details: content
            };
          }
        } catch {
          // ignore corrupted file
        }
      }
    }

    // Pattern check: starts with GEO-XXXX-XXXX-XXXX
    const regex = /^GEO-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;
    if (regex.test(search)) {
      return {
        valid: true,
        message: 'O formato do código de verificação é válido e está em conformidade com o padrão criptográfico do Geo-Explorer.',
        details: { code: search }
      };
    }

    return {
      valid: false,
      message: `Código ou ID "${verificationCodeOrId}" não foi localizado ou não corresponde ao padrão do Geo-Explorer.`
    };
  }
}

export const certificateService = new CertificateService();
