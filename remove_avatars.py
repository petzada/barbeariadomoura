import os
import re

# Files to process
files_to_process = [
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(cliente)\perfil\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(cliente)\meus-agendamentos\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(cliente)\feedback\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(cliente)\dashboard\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(cliente)\agendar\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(profissional)\profissional\perfil\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(profissional)\profissional\dashboard\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\profissionais\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\feedbacks\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\dashboard\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\comissoes\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\bloqueios\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\assinantes\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(admin)\admin\agenda\page.tsx",
    r"c:\Users\MARCIO.PETIGROSSO\barbeariadomoura-1\src\app\(public)\sobre\profissionais\page.tsx",
]

for filepath in files_to_process:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_next = False
    for i, line in enumerate(lines):
        # Skip lines that contain <AvatarImage
        if '<AvatarImage' in line:
            continue
        new_lines.append(line)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Processed: {filepath}")

print("Done!")
