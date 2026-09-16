// header.js — Header compartido para todas las páginas de ObrasRomareda
// Incluir con: <script src="header.js"></script> antes de </body>

(function() {
    const CSS = `
        header {
            background: rgba(0, 40, 100, 0.82);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 1rem 5%;
            position: sticky;
            top: 0;
            width: 100%;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 0.5px solid rgba(255,255,255,0.12);
            box-sizing: border-box;
        }
        .site-logo {
            font-family: 'Calibri', 'Segoe UI', sans-serif;
            font-weight: 700;
            font-style: italic;
            font-size: 1.8rem;
            color: white;
            text-decoration: none;
            letter-spacing: -0.01em;
            transition: color 160ms cubic-bezier(0.23,1,0.32,1);
            flex-shrink: 0;
        }
        .site-logo:hover { color: #4DA9FF; }
        .site-nav ul {
            display: flex;
            gap: 2.5rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .site-nav a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            font-family: 'Inter', sans-serif;
            letter-spacing: 0.01em;
            transition: color 140ms cubic-bezier(0.23,1,0.32,1);
            white-space: nowrap;
        }
        .site-nav a:hover { color: white; }
        .site-nav a.active { color: white; font-weight: 700; }
        .site-social {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }
        .site-social a {
            margin-left: 1.5rem;
            color: white;
            font-size: 1.3rem;
            transition: color 0.3s, transform 0.3s;
            text-decoration: none;
        }
        .site-social a:hover { transform: translateY(-3px); color: #4DA9FF; }
        .site-hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 5px;
            background: none;
            border: none;
            z-index: 1100;
            flex-shrink: 0;
        }
        .site-hamburger span {
            display: block;
            width: 25px;
            height: 3px;
            background: white;
            border-radius: 3px;
            transition: all 220ms cubic-bezier(0.23,1,0.32,1);
        }
        .site-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .site-hamburger.open span:nth-child(2) { opacity: 0; }
        .site-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        .site-mobile-social {
            display: none;
            justify-content: center;
            gap: 2rem;
            padding: 15px 0 5px;
        }
        .site-mobile-social a {
            color: white;
            font-size: 1.4rem;
            transition: color 0.3s, transform 0.3s;
            text-decoration: none;
        }
        .site-mobile-social a:hover { color: #4DA9FF; transform: translateY(-3px); }
        @media (max-width: 1024px) {
            .site-hamburger { display: flex; }
            .site-social { display: none; }
            .site-nav {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: #00529F;
                padding: 0;
                max-height: 0;
                overflow: hidden;
                transition: max-height 300ms cubic-bezier(0.23,1,0.32,1), padding 200ms cubic-bezier(0.23,1,0.32,1);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                z-index: 999;
            }
            .site-nav.open {
                max-height: 400px;
                padding: 4rem 0 1.5rem;
            }
            .site-nav ul {
                flex-direction: column;
                align-items: center;
                gap: 0;
            }
            .site-nav ul li { width: 100%; text-align: center; }
            .site-nav a {
                display: block;
                padding: 12px 20px;
                font-size: 1.1rem;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.85);
            }
            .site-nav ul li:last-child a { border-bottom: none; }
            .site-mobile-social { display: flex; }
        }
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Detect current page for active link
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isProyecto = page.includes('proyecto');
    const isHistoria = page.includes('historia');

    // Build header HTML
    const header = document.createElement('header');
    header.innerHTML = `
        <a href="index.html" class="site-logo">@ObrasRomareda</a>
        <button class="site-hamburger" id="siteHamburger" aria-label="Abrir menú" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" id="siteNav">
            <ul>
                <li><a href="index.html#videos">Actualidad</a></li>
                <li><a href="proyecto.html"${isProyecto ? ' class="active"' : ''}>El Proyecto</a></li>
                <li><a href="historia.html"${isHistoria ? ' class="active"' : ''}>La Vieja Romareda</a></li>
            </ul>
            <div class="site-mobile-social">
                <a href="https://twitter.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
                <a href="https://instagram.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
                <a href="https://youtube.com/@ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube" aria-hidden="true"></i></a>
            </div>
        </nav>
        <div class="site-social">
            <a href="https://twitter.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
            <a href="https://instagram.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="https://youtube.com/@ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube" aria-hidden="true"></i></a>
        </div>
    `;

    // Insert header as first element in body
    document.body.insertBefore(header, document.body.firstChild);

    // Hamburger logic
    const btn = document.getElementById('siteHamburger');
    const nav = document.getElementById('siteNav');
    btn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
    }));
    // Close on outside click
    document.addEventListener('click', e => {
        if (!header.contains(e.target)) {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        }
    });
})();
