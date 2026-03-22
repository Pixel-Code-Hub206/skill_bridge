import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
emoji_map = {
    '📊': '<i data-lucide="layout-dashboard"></i>',
    '👤': '<i data-lucide="user"></i>',
    '⚡': '<i data-lucide="zap"></i>',
    '📧': '<i data-lucide="mail"></i>',
    '➕': '<i data-lucide="plus-circle"></i>',
    '🔍': '<i data-lucide="search"></i>',
    '📁': '<i data-lucide="folder"></i>',
    '✅': '<i data-lucide="check-circle"></i>',
    '📈': '<i data-lucide="trending-up"></i>',
    '👀': '<i data-lucide="eye"></i>',
    '👨‍🏫': '<i data-lucide="graduation-cap"></i>',
    '📋': '<i data-lucide="clipboard-list"></i>',
    '💡': '<i data-lucide="lightbulb"></i>',
    '🔔': '<i data-lucide="bell"></i>'
}

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace SSMS
    content = content.replace('SSMS', 'SkillBridge')
    
    # 2. Inject lucide script
    if 'lucide@latest' not in content:
        content = content.replace('</head>', '    <script src="https://unpkg.com/lucide@latest"></script>\n</head>')

    # 3. Replace emojis
    for emoji, icon in emoji_map.items():
        content = content.replace(emoji, icon)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Successfully migrated {len(html_files)} files!")
