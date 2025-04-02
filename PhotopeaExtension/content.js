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

const init = () => {
    // Initial modifications
    setTitle();
    removeElements();

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

    // Aggressive cleanup for stubborn elements
    let retries = 0;
    const interval = setInterval(() => {
        setTitle();
        removeElements();
        if (retries++ > 20) clearInterval(interval);
    }, 500);

        // Cleanup
        window.addEventListener('unload', () => {
            clearInterval(interval);
            titleObserver.disconnect();
            elementObserver.disconnect();
        });
};

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
