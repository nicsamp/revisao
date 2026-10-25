import json

content = """
Literatura - 3, 4, 5
Sociologia - 3, 4, 5
Educacao fisica - esportes
"""
FILE_PATH = 'current.json'
content_formatted = []

for line in content.strip().split('\n'):
    discipline, chapters = line.split(' - ')
    discipline = discipline.strip().lower().replace(' ', '-')
    chapter_names = []
    for chapter in chapters.split(','):
        name = chapter.strip().lower()
        try:
            int(name)
            chapter_names.append(f"cap. {name}")
        except:
            chapter_names.append(name)
    content_formatted.append({
        'materia': discipline,
        'caps': chapter_names
    })

with open(FILE_PATH, 'w') as f:
    json.dump(content_formatted, f, ensure_ascii=False, indent=4)