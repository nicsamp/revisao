document.addEventListener("DOMContentLoaded", () => {
    // --- 1. System Preference Theme Initialization ---
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Function to update the material symbol based on current mode
    const updateThemeIcon = () => {
        if (body.classList.contains('dark-mode')) {
            themeIcon.textContent = 'light_mode'; // Show sun when dark mode is active
        } else {
            themeIcon.textContent = 'dark_mode'; // Show moon when light mode is active
        }
    };

    // Set initial theme based on system preference
    if (prefersDarkScheme.matches) {
        body.classList.add("dark-mode");
    }
    updateThemeIcon();

    // Manual toggle listener
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateThemeIcon();
    });

    // Listen for system theme changes dynamically
    prefersDarkScheme.addEventListener("change", (e) => {
        if (e.matches) {
            body.classList.add("dark-mode");
        } else {
            body.classList.remove("dark-mode");
        }
        updateThemeIcon();
    });

    // --- 2. Render Markdown ---
    const rawMarkdown = document.getElementById('raw-markdown').value;
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = marked.parse(rawMarkdown);

    // --- 3. Generate Table of Contents (ToC) ---
    const headers = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocList = document.getElementById('toc-list');
    const tocContainer = document.getElementById('toc-container');
    const tocToggle = document.getElementById('toc-toggle');

    // Dictionary to keep track of how many times an ID has been used
    const idTracker = {};

    headers.forEach(header => {
        // Generate a base ID from the text
        let baseId = header.innerText.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
        
        // Fallback if the header is somehow empty or only special characters
        if (!baseId) baseId = "section";

        // Check if this ID already exists, and append a number if it does
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
        
        // Indent based on header level (h1 = 0, h2 = 1, etc.)
        const level = parseInt(header.tagName.substring(1));
        li.style.marginLeft = `${(level - 1) * 15}px`;

        // Auto-close ToC when clicking a link on mobile/small screens
        a.addEventListener('click', () => {
            if (window.innerWidth < 800) {
                tocContainer.classList.remove('open');
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

// --- 4. ToC Toggle Logic ---
    tocToggle.addEventListener('click', (event) => {
        tocContainer.classList.toggle('open');
    });

    // Optional: Close ToC when clicking outside of it
    document.addEventListener('click', (event) => {
        // Use .closest() to check if the click happened anywhere inside the toggle button
        const isClickInsideToC = tocContainer.contains(event.target);
        const isClickOnToggle = event.target.closest('#toc-toggle');
        
        if (!isClickInsideToC && !isClickOnToggle && tocContainer.classList.contains('open')) {
            tocContainer.classList.remove('open');
        }
    });
});