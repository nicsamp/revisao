function updateThemeIcon() {
    if (els.body.classList.contains('dark-mode')) {
        els.themeIcon.textContent = 'light_mode'; // Show sun when dark mode is active
    }
    else {
        els.themeIcon.textContent = 'dark_mode'; // Show moon when light mode is active
    }
};

async function getFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Error fetching file: ${response.status}`);
        }
        return response;
    }
    catch (error) {
        throw new Error(`Error fetching file: ${error}`);
    }
}

async function getRawMarkdown(configPath) {
    let rawMarkdown = '';
    let config = await (await getFile(configPath)).json();
    for (const discipline of config) {
        let markdown = await (await getFile(`current/${discipline.materia}.md`)).text();
        rawMarkdown += markdown.match(/^.*$/m)[0] + '\n'; // Add the first line (title) of the markdown file
        let wantedChapters = discipline.caps;
        let rawChapters = markdown.match(/(^## )([\s\S]*?)(?=$(?![\r\n])|^## )/gm);
        rawChapters.forEach((chapter) => {
            let name = chapter.match(/^.*/)[0].toLowerCase().replace('## ', '').replace(/\[.*$/g, '');
            if (wantedChapters.includes(name))  {
                if (rawMarkdown) {
                    rawMarkdown += '\n';
                }
                rawMarkdown += chapter;
            }
        });
    };
    return rawMarkdown;
}

async function loadMarkdown(configPath) {
    const rawMarkdown = await getRawMarkdown(configPath);
    els.content.innerHTML = marked.parse(rawMarkdown);

    const headers = els.content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const idTracker = {};

    headers.forEach(header => {
        let baseId = header.innerText.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
        
        if (!baseId) {
            baseId = "section";
        }

        let id = baseId;
        if (idTracker[baseId]) {
            id = `${baseId}-${idTracker[baseId]}`;
            idTracker[baseId]++;
        }
        else {
            idTracker[baseId] = 1;
        }

        header.id = id;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = header.innerText;
        
        const level = parseInt(header.tagName.substring(1));
        li.style.marginLeft = `${(level - 1) * 15}px`;

        a.addEventListener('click', () => {
            if (window.innerWidth < 800) {
                els.tocContainer.classList.remove('open');
            }
        });

        li.appendChild(a);
        els.tocList.appendChild(li);
    });
}

let els = {};
document.addEventListener("DOMContentLoaded", async () => {
    els = {
        body: document.body,
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        tocToggle: document.getElementById('toc-toggle'),
        tocContainer: document.getElementById('toc-container'),
        tocList: document.getElementById('toc-list'),
        content: document.getElementById('content')
    }
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
        els.body.classList.add("dark-mode");
    }
    updateThemeIcon();

    els.themeToggle.addEventListener('click', () => {
        els.body.classList.toggle('dark-mode');
        updateThemeIcon();
    });

    els.tocToggle.addEventListener('click', (event) => {
        els.tocContainer.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        // Use .closest() to check if the click happened anywhere inside the toggle button
        const isClickInsideToC = els.tocContainer.contains(event.target);
        const isClickOnToggle = event.target.closest('#toc-toggle');
        
        if (!isClickInsideToC && !isClickOnToggle && els.tocContainer.classList.contains('open')) {
            els.tocContainer.classList.remove('open');
        }
    });

    let config_path = './current.json';
    await loadMarkdown(config_path);
});