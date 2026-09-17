(function() {
    const CSS = `
        html { scrollbar-gutter: stable; }

        header.site-header {
            background: rgba(0,40,100,0.82);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 0 5%;
            height: 64px;
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
            font-family: 'Calibri','Segoe UI',sans-serif;
            font-weight: 700;
            font-style: italic;
            font-size: 1.8rem;
            color: white;
            text-decoration: none;
            letter-spacing: -0.01em;
            flex-shrink: 0;
            line-height: 1;
            transition: color 160ms ease;
        }
        .site-logo:hover { color: #4DA9FF; }

        .site-nav-list {
            display: flex;
            gap: 2.5rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .site-nav-list a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            font-family: 'Inter',sans-serif;
            font-weight: 500;
            font-size: 0.9rem;
            letter-spacing: 0.01em;
            white-space: nowrap;
            transition: color 140ms ease;
        }
        .site-nav-list a:hover,
        .site-nav-list a.active { color: #ffffff; }

        .site-social-links {
            display: flex;
            align-items: center;
            flex-shrink: 0;
        }
        .site-social-links a {
            margin-left: 1.5rem;
            color: white;
            font-size: 1.3rem;
            text-decoration: none;
            transition: color 0.3s, transform 0.3s;
        }
        .site-social-links a:hover { transform: translateY(-3px); color: #4DA9FF; }

        /* Hamburger — oculto en escritorio */
        .site-hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 5px;
            background: none;
            border: none;
            flex-shrink: 0;
            z-index: 1002;
        }
        .site-hamburger span {
            display: block;
            width: 25px;
            height: 3px;
            background: white;
            border-radius: 3px;
            transition: all 220ms ease;
        }
        .site-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .site-hamburger.open span:nth-child(2) { opacity: 0; }
        .site-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        /* Nav móvil — debajo del header, no encima */
        .site-nav {
            display: contents; /* En escritorio se comporta como si no existiera */
        }

        .site-mobile-social { display: none; }

        @media (max-width: 1024px) {
            .site-hamburger { display: flex; }
            .site-social-links { display: none; }

            .site-nav {
                display: block;
                position: fixed;
                top: 64px; /* Justo debajo del header de 64px */
                left: 0;
                width: 100%;
                background: rgba(0,50,130,0.97);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                padding: 0;
                max-height: 0;
                overflow: hidden;
                transition: max-height 300ms ease, padding 200ms ease;
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                z-index: 999;
            }
            .site-nav.open {
                max-height: 400px;
                padding: 1rem 0 1.5rem;
            }
            .site-nav-list {
                flex-direction: column;
                align-items: center;
                gap: 0;
            }
            .site-nav-list li { width: 100%; text-align: center; }
            .site-nav-list a {
                display: block;
                padding: 12px 20px;
                font-size: 1.1rem;
                color: rgba(255,255,255,0.85);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .site-nav-list li:last-of-type a { border-bottom: none; }
            .site-mobile-social {
                display: flex;
                justify-content: center;
                gap: 2rem;
                padding: 15px 0 5px;
            }
            .site-mobile-social a {
                color: white;
                font-size: 1.4rem;
                text-decoration: none;
            }
        }

        @media (prefers-reduced-transparency: reduce) {
            header.site-header {
                background: rgba(0, 40, 100, 0.98);
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
            }
        }
        @media (prefers-reduced-motion: reduce) {
            .site-hamburger span { transition: none; }
            .site-nav { transition: none; }
        }
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Detect active page
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isProyecto = page === 'proyecto.html';
    const isHistoria = page === 'historia.html';

    // Build header
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
        <a href="index.html" class="site-logo">@ObrasRomareda</a>
        <button class="site-hamburger" id="siteHamburger" aria-label="Abrir menú" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" id="siteNav">
            <ul class="site-nav-list">
                <li><a href="index.html#videos">Actualidad</a></li>
                <li><a href="proyecto.html"${isProyecto ? ' class="active"' : ''}>El Proyecto</a></li>
                <li><a href="historia.html"${isHistoria ? ' class="active"' : ''}>La Vieja Romareda</a></li>
            </ul>
            <div class="site-mobile-social">
                <a href="https://twitter.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://instagram.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://youtube.com/@ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            </div>
        </nav>
        <div class="site-social-links">
            <a href="https://twitter.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://instagram.com/ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://youtube.com/@ObrasRomareda" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
    `;

    document.body.insertBefore(header, document.body.firstChild);

    // Hamburger logic
    const btn = document.getElementById('siteHamburger');
    const nav = document.getElementById('siteNav');

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const open = nav.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        });
    });

    document.addEventListener('click', function(e) {
        if (!header.contains(e.target)) {
            nav.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', false);
        }
    });
})();
