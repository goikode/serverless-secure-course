/**
 * Goikode Serverless Secure Course - Student Prefix Manager
 *
 * Manages student prefix persistence and dynamic replacement in documentation.
 * Stores prefix in localStorage and replaces all {prefijo} placeholders in real-time.
 */

class StudentPrefixManager {
    constructor() {
        this.STORAGE_KEY = 'ssc_student_prefix';
        this.PREFIX_PATTERN = /^[a-z]+-[a-z]+\d+-[a-z0-9]{5}$/; // nombre-apellidoN(N)-xxxxx
        this.prefix = this.loadPrefix();
        this.modal = null;
    }

    /**
     * Load prefix from localStorage
     */
    loadPrefix() {
        return localStorage.getItem(this.STORAGE_KEY);
    }

    /**
     * Save prefix to localStorage
     */
    savePrefix(prefix) {
        localStorage.setItem(this.STORAGE_KEY, prefix);
        this.prefix = prefix;
    }

    /**
     * Clear prefix from localStorage
     */
    clearPrefix() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.prefix = null;
    }

    /**
     * Validate prefix format
     */
    validatePrefix(prefix) {
        if (!prefix) {
            return 'El prefijo no puede estar vacío';
        }

        prefix = prefix.trim().toLowerCase();

        if (!this.PREFIX_PATTERN.test(prefix)) {
            return 'Formato incorrecto. Debe ser: nombre-apellidoNN-xxxxx (ej: jorge-fernandes01-vty3n)';
        }

        return null; // Valid
    }

    /**
     * Apply prefix to all {prefijo} and {tu-prefijo} placeholders in the document
     */
    applyPrefix() {
        if (!this.prefix) {
            return;
        }

        // Update header display
        const headerPrefix = document.getElementById('header-student-prefix');
        if (headerPrefix) {
            headerPrefix.textContent = this.prefix;
        }

        // Replace all {prefijo} and {tu-prefijo} placeholders in content
        const contentElements = document.querySelectorAll('p, li, pre, code, td, th, h1, h2, h3, h4, h5, h6');

        contentElements.forEach(el => {
            if (el.getAttribute('data-prefix-applied') === 'true') {
                // Already processed
                return;
            }

            const hasPlaceholder = el.innerHTML.includes('{prefijo}') || el.innerHTML.includes('{tu-prefijo}');

            if (hasPlaceholder) {
                el.innerHTML = el.innerHTML
                    .replace(
                        /\{prefijo\}/g,
                        `<strong>${this.prefix}</strong>`
                    )
                    .replace(
                        /\{tu-prefijo\}/g,
                        `<strong>${this.prefix}</strong>`
                    );

                // Mark as processed
                el.setAttribute('data-prefix-applied', 'true');
            }
        });
    }

    /**
     * Show modal to request prefix from student
     */
    showModal() {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.modal = this.createModal();
        }

        this.modal.style.display = 'flex';

        // Focus input
        const input = this.modal.querySelector('#prefix-input');
        if (input) {
            input.focus();
        }
    }

    /**
     * Hide modal
     */
    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    /**
     * Create modal DOM element
     */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'prefix-modal';
        modal.className = 'prefix-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Configura tu Prefijo de Estudiante</h2>
                </div>
                <div class="modal-body">
                    <p>
                        Para personalizar la documentación con tus recursos AWS,
                        introduce el prefijo único que te fue asignado.
                    </p>
                    <p class="format-example">
                        <strong>Formato:</strong> <code>nombre-apellidoNN-xxxxx</code><br>
                        <strong>Ejemplo:</strong> <code>jorge-fernandes01-vty3n</code>
                    </p>
                    <input
                        type="text"
                        id="prefix-input"
                        placeholder="tu-prefijo-xxxxx"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    <div id="prefix-error" class="error-message"></div>
                </div>
                <div class="modal-footer">
                    <button id="prefix-submit" class="btn-primary">Guardar Prefijo</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const input = modal.querySelector('#prefix-input');
        const submitBtn = modal.querySelector('#prefix-submit');
        const errorDiv = modal.querySelector('#prefix-error');

        const handleSubmit = () => {
            const prefix = input.value.trim().toLowerCase();
            const error = this.validatePrefix(prefix);

            if (error) {
                errorDiv.textContent = error;
                errorDiv.style.display = 'block';
                input.classList.add('error');
                return;
            }

            // Valid prefix
            this.savePrefix(prefix);
            this.hideModal();

            // Reload page to apply new prefix
            window.location.reload();
        };

        submitBtn.addEventListener('click', handleSubmit);

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });

        input.addEventListener('input', () => {
            // Clear error on input
            errorDiv.style.display = 'none';
            input.classList.remove('error');
        });

        return modal;
    }

    /**
     * Initialize prefix manager
     */
    init() {
        // Check if prefix exists
        if (!this.prefix) {
            // Show modal to request prefix
            this.showModal();
        } else {
            // Apply existing prefix
            this.applyPrefix();
        }

        // Add change prefix button click handler
        const changeBtn = document.getElementById('change-prefix-btn');
        if (changeBtn) {
            changeBtn.addEventListener('click', () => {
                // Clear prefix and show modal
                this.clearPrefix();

                // Clear current display
                const headerPrefix = document.getElementById('header-student-prefix');
                if (headerPrefix) {
                    headerPrefix.textContent = '-';
                }

                this.showModal();
            });
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const prefixManager = new StudentPrefixManager();
    prefixManager.init();
});
