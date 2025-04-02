const setTitle = () => {
    try {
        if (document.title !== 'Photopea') {
            document.title = 'Photopea';
        }
    } catch (error) {
        console.error('Title modification error:', error);
    }
};

const removeElements = () => {
    try {
        // Remove all button groups
        document.querySelectorAll('div[style*="float: right"][style*="app-region: no-drag"]').forEach(buttonGroup => {
            buttonGroup.remove();
        });

        // Remove account button
        const accountButton = document.querySelector('button.fitem.bbtn[style*="background-color:#bb0000"]');
        if (accountButton) accountButton.remove();
    } catch (error) {
        console.error('Element removal error:', error);
    }
};

let isHelloWorldActive = false;

function addHelloWorldButton() {
    // Check for existing button and correct dropdown content
    const contextPanel = document.querySelector('.contextpanel.cp_light');
    if (!contextPanel || document.querySelector('.custom-hello-world')) return;

    // Verify this is the "More" dropdown by checking for unique items
    const hasAboutPhotopea = [...contextPanel.querySelectorAll('.label')]
    .some(el => el.textContent === 'About Photopea');

    if (!hasAboutPhotopea) return;

    // Create and insert the new menu item
    const newMenuItem = document.createElement('div');
    newMenuItem.className = 'enab custom-hello-world';
    newMenuItem.innerHTML = `
    <span class="check">${isHelloWorldActive ?
        '<svg height="10px" width="10px" fill="none" stroke-width="1.35" stroke="currentColor">' +
        '<path d="M 1 5 L 4 8 L 9 2"></path></svg>' :
        ''}</span>
        <span class="label">Hello World!</span>
        `;

        newMenuItem.addEventListener('click', function(event) {
            event.stopPropagation();
            isHelloWorldActive = !isHelloWorldActive;

            // Update checkmark
            const checkSpan = this.querySelector('.check');
            checkSpan.innerHTML = isHelloWorldActive ?
            '<svg height="10px" width="10px" fill="none" stroke-width="1.35" stroke="currentColor">' +
            '<path d="M 1 5 L 4 8 L 9 2"></path></svg>' :
            '';

        console.log(`hello world ${isHelloWorldActive}`);
        });

        // Insert above the horizontal rule
        const hr = contextPanel.querySelector('hr');
        if (hr) {
            contextPanel.insertBefore(newMenuItem, hr);
        } else {
            contextPanel.appendChild(newMenuItem);
        }
}

const init = () => {
    // Initial modifications
    setTitle();
    removeElements();
    addHelloWorldButton();

    // Create observers
    const titleObserver = new MutationObserver((mutations) => {
        setTitle();
    });

    const elementObserver = new MutationObserver((mutations) => {
        removeElements();
    });

    // Observe title changes
    titleObserver.observe(document.querySelector('title'), {
        subtree: true,
        characterData: true,
        childList: true
    });

    // Observe DOM changes
    elementObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    // MutationObserver for More dropdown
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            setTimeout(addHelloWorldButton, 50);
        });
    });

    // Target SPECIFIC container for More dropdown
    const cmanager = document.querySelector('.cmanager');
    if (cmanager) {
        observer.observe(cmanager, {
            childList: true,
            subtree: true
        });
    }

    // Direct More button click handler
    const moreButton = document.querySelector('.topbar > span:first-child > button:last-child');
    if (moreButton) {
        moreButton.addEventListener('click', () => {
            setTimeout(addHelloWorldButton, 100);
        });
    }

    // Initial check if dropdown is already open
    addHelloWorldButton();

    // Aggressive cleanup for stubborn elements
    let retries = 0;
    const interval = setInterval(() => {
        setTitle();
        removeElements();
        addHelloWorldButton();
        if (retries++ > 20) clearInterval(interval);
    }, 500);

        // Cleanup
        window.addEventListener('unload', () => {
            clearInterval(interval);
            titleObserver.disconnect();
            elementObserver.disconnect();
            observer.disconnect();
        });
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
