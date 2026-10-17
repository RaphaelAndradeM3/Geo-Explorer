import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { certificateService } from '../src/services/certificateService.js';

describe('CertificateService', () => {
  const testOutputDir = path.join(process.cwd(), 'certificates-test');

  beforeAll(() => {
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  it('deve gerar dados do certificado com código de verificação criptográfico', () => {
    const cert = certificateService.createCertificateData('Raphael Explorador', 'python-ai', 'Excelente');

    expect(cert.studentName).toBe('Raphael Explorador');
    expect(cert.trackId).toBe('python-ai');
    expect(cert.trackName).toContain('Inteligência Artificial');
    expect(cert.verificationCode).toMatch(/^GEO-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
    expect(cert.skillsAcquired.length).toBeGreaterThan(0);
  });

  it('deve lançar erro se a trilha não existir', () => {
    expect(() => {
      certificateService.createCertificateData('Explorador', 'trilha-fantasma');
    }).toThrow(/não foi encontrada/);
  });

  it('deve exportar certificado em HTML, SVG e JSON', () => {
    const result = certificateService.generateCertificate({
      studentName: 'Maria Silva',
      trackId: 'geo-spatial',
      grade: 'Distinção',
      outputDir: testOutputDir,
      formats: ['html', 'svg', 'json']
    });

    expect(result.certificate).toBeDefined();
    expect(result.files.html).toBeDefined();
    expect(result.files.svg).toBeDefined();
    expect(result.files.json).toBeDefined();

    expect(fs.existsSync(result.files.html!)).toBe(true);
    expect(fs.existsSync(result.files.svg!)).toBe(true);
    expect(fs.existsSync(result.files.json!)).toBe(true);

    const htmlContent = fs.readFileSync(result.files.html!, 'utf-8');
    expect(htmlContent).toContain('Maria Silva');
    expect(htmlContent).toContain('Geospatial Data Science');
    expect(htmlContent).toContain(result.certificate.verificationCode);

    const svgContent = fs.readFileSync(result.files.svg!, 'utf-8');
    expect(svgContent).toContain('<svg');
    expect(svgContent).toContain('Maria Silva');
  });

  it('deve verificar autenticidade de um código emitido', () => {
    const cert = certificateService.createCertificateData('Dev Explorer', 'cloud-devops');
    const verification = certificateService.verifyCertificate(cert.verificationCode);

    expect(verification.valid).toBe(true);
  });

  it('deve rejeitar código de verificação inválido', () => {
    const verification = certificateService.verifyCertificate('CODIGO-TOTALMENTE-INVALIDO');
    expect(verification.valid).toBe(false);
  });
});
