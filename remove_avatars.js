const fs = require('fs');
const path = require('path');

const files = [
    'src/app/(cliente)/perfil/page.tsx',
    'src/app/(cliente)/meus-agendamentos/page.tsx',
    'src/app/(cliente)/feedback/page.tsx',
    'src/app/(cliente)/dashboard/page.tsx',
    'src/app/(cliente)/agendar/page.tsx',
    'src/app/(profissional)/profissional/perfil/page.tsx',
    'src/app/(profissional)/profissional/dashboard/page.tsx',
    'src/app/(admin)/admin/profissionais/page.tsx',
    'src/app/(admin)/admin/feedbacks/page.tsx',
    'src/app/(admin)/admin/dashboard/page.tsx',
    'src/app/(admin)/admin/comissoes/page.tsx',
    'src/app/(admin)/admin/bloqueios/page.tsx',
    'src/app/(admin)/admin/assinantes/page.tsx',
    'src/app/(admin)/admin/agenda/page.tsx',
    'src/app/(public)/sobre/profissionais/page.tsx',
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const newLines = lines.filter(line => !line.includes('<AvatarImage'));

    fs.writeFileSync(filePath, newLines.join('\r\n'), 'utf8');
    console.log(`Processed: ${file}`);
});

console.log('Done!');
