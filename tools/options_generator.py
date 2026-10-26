import json

content = """
portugues - 14, 15, 16, 17, 18
literatura - 8, 9, 10
redacao - 6, 7
educacao-fisica - pca
historia - 12, 13, 14, 15
geografia - 14, 15, 16, 17, 18
filosofia - cap. 2 (livro d)
sociologia - 12, 13
biologia-1 - 13, 14, 15, 16
biologia-2 - 11, 12, 13
"""
FILE_PATH = 'pm4.json'
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