const fs = require('fs');
const path = require('path');

const files = [
    'src/app/(cliente)/meus-agendamentos/page.tsx',
    'src/app/(cliente)/feedback/page.tsx',
    'src/app/(cliente)/dashboard/page.tsx',
    'src/app/(cliente)/agendar/page.tsx',
    'src/app/(profissional)/profissional/dashboard/page.tsx',
    'src/app/(admin)/admin/profissionais/page.tsx',
    'src/app/(admin)/admin/feedbacks/page.tsx',
    'src/app/(admin)/admin/dashboard/page.tsx',
    'src/app/(admin)/admin/comissoes/page.tsx',
    'src/app/(admin)/admin/bloqueios/page.tsx',
    'src/app/(admin)/admin/assinantes/page.tsx',
    'src/app/(public)/sobre/profissionais/page.tsx',
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove linhas órfãs deixadas pela remoção do AvatarImage
    // Padrão: linhas que começam com src=, alt=, ou />, geralmente com espaços
    const lines = content.split(/\r?\n/);
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip linhas que são órfãs de AvatarImage
        if (
            (trimmed.startsWith('src={') && (trimmed.includes('avatar_url') || trimmed.includes('foto_url'))) ||
            (trimmed.startsWith('alt={') && i > 0 && newLines[newLines.length - 1].trim().startsWith('src={')) ||
            (trimmed === '/>') && i > 0 && (
                newLines[newLines.length - 1].trim().startsWith('src={') ||
                newLines[newLines.length - 1].trim().startsWith('alt={')
            )
        ) {
            console.log(`Removing orphan line in ${file}: ${trimmed}`);
            continue;
        }

        newLines.push(line);
    }

    fs.writeFileSync(filePath, newLines.join('\r\n'), 'utf8');
    console.log(`Cleaned: ${file}`);
});

console.log('Done!');
