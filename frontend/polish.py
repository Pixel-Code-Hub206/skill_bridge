import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make the logo take the Emerald CSS variable instead of hardcoded Blue!
    content = content.replace('fill="#2563eb"', 'fill="var(--primary-color)"')
    
    # Replace the lingering community emoji with the native lucide user group icon!
    content = content.replace('👥', '<i data-lucide="users"></i>')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Final UI polish complete!")
