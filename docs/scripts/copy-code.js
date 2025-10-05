/**
 * Goikode Serverless Secure Course - Copy Code Buttons
 *
 * Adds copy buttons to all code blocks (pre) and inline code elements
 */

class CopyCodeManager {
    constructor() {
        this.copyTimeout = null;
    }

    /**
     * Initialize copy buttons for all code elements
     */
    init() {
        this.addCopyButtonsToCodeBlocks();
        this.addCopyButtonsToInlineCode();
    }

    /**
     * Add copy buttons to all <pre> code blocks
     */
    addCopyButtonsToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre');

        codeBlocks.forEach((pre, index) => {
            // Skip if already wrapped
            if (pre.parentElement.classList.contains('code-block-wrapper')) {
                return;
            }

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';

            // Wrap the pre element
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // Create copy button
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.setAttribute('aria-label', 'Copiar código');
            button.setAttribute('data-index', index);

            const text = document.createElement('span');
            text.textContent = 'Copiar';
            button.appendChild(text);

            // Add click handler
            button.addEventListener('click', () => {
                this.copyCodeBlock(pre, button, text);
            });

            // Add button to wrapper
            wrapper.appendChild(button);
        });
    }

    /**
     * Add copy buttons to inline <code> elements (only those with commands or important values)
     */
    addCopyButtonsToInlineCode() {
        const inlineCodes = document.querySelectorAll('code:not(pre code)');

        inlineCodes.forEach((code, index) => {
            const text = code.textContent.trim();

            // Only add copy button if it looks like a command, path, or important value
            if (this.shouldHaveCopyButton(text)) {
                // Skip if already has copy button
                if (code.querySelector('.inline-copy-button')) {
                    return;
                }

                // Create copy button
                const button = document.createElement('button');
                button.className = 'inline-copy-button';
                button.setAttribute('aria-label', 'Copiar');
                button.setAttribute('data-index', index);

                // Add click handler
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.copyInlineCode(code, button);
                });

                // Add button after code text
                code.appendChild(button);
            }
        });
    }

    /**
     * Determine if inline code should have a copy button
     */
    shouldHaveCopyButton(text) {
        // Always add for commands, paths, prefixes, ARNs, etc.
        const patterns = [
            /^aws\s/i,                    // AWS CLI commands
            /^npm\s/i,                    // npm commands
            /^git\s/i,                    // git commands
            /^python/i,                   // Python commands
            /^node/i,                     // Node commands
            /^sam\s/i,                    // SAM CLI commands
            /^terraform/i,                // Terraform commands
            /^[\w-]+\-[\w-]+\-[a-z0-9]{5}/, // Prefixes like juan-perez-a7b3f
            /^arn:aws:/,                  // AWS ARNs
            /^\//,                        // Paths starting with /
            /\.(js|py|json|yaml|yml|md)$/, // File names
            /^https?:\/\//,               // URLs
            /^\{prefijo\}/,               // Placeholder prefix
            /^\{tu-prefijo\}/,            // Placeholder prefix variant
        ];

        // Check if text is long enough and matches patterns
        if (text.length > 5) {
            return patterns.some(pattern => pattern.test(text));
        }

        return false;
    }

    /**
     * Copy code block content
     */
    async copyCodeBlock(pre, button, text) {
        try {
            // Get text content (without HTML)
            let code = pre.textContent;

            // Copy to clipboard
            await navigator.clipboard.writeText(code);

            // Update button state
            button.classList.add('copied');
            text.textContent = 'Copiado!';

            // Reset after 2 seconds
            clearTimeout(this.copyTimeout);
            this.copyTimeout = setTimeout(() => {
                button.classList.remove('copied');
                text.textContent = 'Copiar';
            }, 2000);

        } catch (err) {
            console.error('Error al copiar:', err);
            text.textContent = 'Error';
            setTimeout(() => {
                text.textContent = 'Copiar';
            }, 2000);
        }
    }

    /**
     * Copy inline code content
     */
    async copyInlineCode(code, button) {
        try {
            // Get text content (excluding the copy button itself)
            // Clone the code element to manipulate it
            const clone = code.cloneNode(true);

            // Remove the copy button from the clone
            const copyBtn = clone.querySelector('.inline-copy-button');
            if (copyBtn) {
                copyBtn.remove();
            }

            // Get all text content (including text inside <strong>, <em>, etc.)
            let text = clone.textContent.trim();

            // Copy to clipboard
            await navigator.clipboard.writeText(text.trim());

            // Update button state
            button.classList.add('copied');

            // Reset after 2 seconds
            clearTimeout(this.copyTimeout);
            this.copyTimeout = setTimeout(() => {
                button.classList.remove('copied');
            }, 2000);

        } catch (err) {
            console.error('Error al copiar:', err);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const copyManager = new CopyCodeManager();
    copyManager.init();
});
