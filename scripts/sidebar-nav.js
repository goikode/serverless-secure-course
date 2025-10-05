/**
 * Goikode Serverless Secure Course - Sidebar Navigation
 *
 * Loads and displays course index in sidebar with active document highlighting
 */

class SidebarNavigation {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarContent = document.getElementById('sidebar-content');
        this.toggleBtn = document.getElementById('sidebar-toggle');
        this.openBtn = document.getElementById('sidebar-open-btn');

        // Course structure - hardcoded for now, could be loaded from JSON
        this.courseStructure = [
            {
                number: '0',
                title: 'Módulo 0: Configuración',
                docs: [
                    { number: '00', title: 'Configuración Entorno', path: '../modulo-0/00-configuracion-entorno.html' }
                ]
            },
            {
                number: '1.A',
                title: 'Módulo 1.A: Consola AWS',
                docs: [
                    { number: '00', title: 'Visión General', path: '../modulo-1a-consola/00-vision-general.html' },
                    { number: '01', title: 'Lambda Hardcoded', path: '../modulo-1a-consola/01-lambda-hardcoded.html' },
                    { number: '02', title: 'DynamoDB Table', path: '../modulo-1a-consola/02-dynamodb-table.html' },
                    { number: '03', title: 'S3 Imágenes', path: '../modulo-1a-consola/03-s3-imagenes.html' },
                    { number: '04', title: 'API Gateway', path: '../modulo-1a-consola/04-api-gateway.html' },
                    { number: 'EX', title: 'Ejercicio: S3 Trigger', path: '../modulo-1a-consola/ejercicio-opcional-s3-trigger.html' }
                ]
            },
            {
                number: '1.B',
                title: 'Módulo 1.B: SAM (IaC)',
                docs: [
                    { number: '01', title: 'Introducción SAM', path: '../modulo-1b-sam/01-introduccion-sam.html' },
                    { number: '02', title: 'Ejercicio: Base', path: '../modulo-1b-sam/02-ejercicio-despliegue-base.html' },
                    { number: '03', title: 'Ejercicio: POST', path: '../modulo-1b-sam/03-ejercicio-post.html' },
                    { number: '04', title: 'Ejercicio: GET by ID', path: '../modulo-1b-sam/04-ejercicio-get-by-id.html' }
                ]
            }
            // Module 2 and 3 will be added when they exist
        ];
    }

    /**
     * Initialize sidebar
     */
    init() {
        this.loadSidebarContent();
        this.highlightCurrentDoc();
        this.setupEventListeners();
    }

    /**
     * Load sidebar content with course structure
     */
    loadSidebarContent() {
        let html = '';

        this.courseStructure.forEach(module => {
            html += `
                <div class="sidebar-module">
                    <h3 class="sidebar-module-title">${module.title}</h3>
                    <ul class="sidebar-doc-list">
            `;

            module.docs.forEach(doc => {
                // Get current path relative to module directory
                const currentPath = window.location.pathname.split('/').pop();
                const isActive = currentPath === doc.path ? 'active' : '';

                html += `
                    <li class="sidebar-doc-item">
                        <a href="${doc.path}" class="sidebar-doc-link ${isActive}">
                            <span class="sidebar-doc-number">${doc.number}</span>
                            <span class="sidebar-doc-title">${doc.title}</span>
                        </a>
                    </li>
                `;
            });

            html += `
                    </ul>
                </div>
            `;
        });

        this.sidebarContent.innerHTML = html;
    }

    /**
     * Highlight current document in sidebar
     */
    highlightCurrentDoc() {
        const currentPath = window.location.pathname.split('/').pop();
        const links = this.sidebarContent.querySelectorAll('.sidebar-doc-link');

        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
                // Scroll to active link
                setTimeout(() => {
                    link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }

    /**
     * Setup event listeners for sidebar toggle
     */
    setupEventListeners() {
        // Close sidebar on mobile
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => {
                this.sidebar.classList.remove('open');
            });
        }

        // Open sidebar on mobile
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => {
                this.sidebar.classList.add('open');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!this.sidebar.contains(e.target) &&
                    !this.openBtn.contains(e.target)) {
                    this.sidebar.classList.remove('open');
                }
            }
        });

        // Close sidebar when clicking a link on mobile
        this.sidebarContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-doc-link') ||
                e.target.closest('.sidebar-doc-link')) {
                if (window.innerWidth <= 1024) {
                    this.sidebar.classList.remove('open');
                }
            }
        });
    }
}

// Initialize sidebar on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const sidebarNav = new SidebarNavigation();
    sidebarNav.init();
});
