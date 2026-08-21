document.addEventListener("DOMContentLoaded", async () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    const updateThemeIcon = () => {
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = 'light_mode'; // Show sun when dark mode is active
        } else {
            themeIcon.textContent = 'dark_mode'; // Show moon when light mode is active
        }
    };

    if (prefersDarkScheme.matches) {
        body.classList.add("dark-mode");
    }
    updateThemeIcon();

    // Manual toggle listener
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateThemeIcon();
    });
    
    const response = await fetch('./content/prova.md');
    if (!response.ok) {
        throw new Error(`Failed to load Markdown: ${response.status}`);
    }
    const rawMarkdown = await response.text();
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = marked.parse(rawMarkdown);

    const headers = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('toc-container');
    const tocToggle = document.getElementById('toc-toggle');

    // Dictionary to keep track of how many times an ID has been used
    const idTracker = {};

    headers.forEach(header => {
        let baseId = header.innerText.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
        
        if (!baseId) baseId = "section";

        let id = baseId;
        if (idTracker[baseId]) {
            id = `${baseId}-${idTracker[baseId]}`;
            idTracker[baseId]++;
        } else {
            idTracker[baseId] = 1;
        }

        // Assign the unique ID to the header
        header.id = id;

        // Create the ToC list item
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = header.innerText;
        
        const level = parseInt(header.tagName.substring(1));
        li.style.marginLeft = `${(level - 1) * 15}px`;

        a.addEventListener('click', () => {
            if (window.innerWidth < 800) {
                tocContainer.classList.remove('open');
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    tocToggle.addEventListener('click', (event) => {
        tocContainer.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        // Use .closest() to check if the click happened anywhere inside the toggle button
        const isClickInsideToC = tocContainer.contains(event.target);
        const isClickOnToggle = event.target.closest('#toc-toggle');
        
        if (!isClickInsideToC && !isClickOnToggle && tocContainer.classList.contains('open')) {
            tocContainer.classList.remove('open');
        }
    });
});