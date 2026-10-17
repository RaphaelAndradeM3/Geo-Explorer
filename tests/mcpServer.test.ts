import { describe, it, expect } from 'vitest';
import { createMcpServer } from '../src/mcp/server.js';
import { trackService } from '../src/services/trackService.js';
import { challengeService } from '../src/services/challengeService.js';
import { certificateService } from '../src/services/certificateService.js';

describe('MCP Server - Geo-Explorer', () => {
  it('deve instanciar o McpServer com nome e versão corretos', () => {
    const server = createMcpServer();
    expect(server).toBeDefined();
  });

  it('serviços subjacentes às tools MCP devem responder com sucesso', () => {
    // 1. list_tracks
    const tracks = trackService.filterTracks({ technology: 'python' });
    expect(tracks.length).toBeGreaterThan(0);

    // 2. get_track_details
    const details = trackService.findTrackById('csharp-dotnet');
    expect(details).toBeDefined();
    expect(details?.technology).toBe('C# .NET');

    // 3. get_code_challenge
    const ch = challengeService.getChallenge({ technology: 'devops', level: 'iniciante' });
    expect(ch).toBeDefined();
    expect(ch?.id).toBe('ch-dev-init');

    // 4. generate_certificate
    const cert = certificateService.createCertificateData('Tester MCP', 'javascript-fullstack');
    expect(cert.studentName).toBe('Tester MCP');
    expect(cert.verificationCode).toBeDefined();

    // 5. verify_certificate
    const verified = certificateService.verifyCertificate(cert.verificationCode);
    expect(verified.valid).toBe(true);
  });
});
