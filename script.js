// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    // Optional: toggle active class on the button too for styling
    // const menuToggle = document.querySelector('.menu-toggle');
    // menuToggle.classList.toggle('active');
}

// Navigation handler
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Handle external links normally
        if (!href.startsWith('#')) {
            window.location.href = href;
            return;
        }

        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show target section
            targetSection.classList.add('active');

            // Scroll to the section smoothly
            // Use setTimeout to allow the browser a moment to render the activated section
            setTimeout(() => {
                 // For internal links within the same page, scroll to the target section itself
                 // If clicking a link like #about within index.html and it loads about.html,
                 // this click handler won't run on about.html. The DOMContentLoaded handles that initial scroll.
                 // If you click a link like #about while *already* on about.html, this scrolls to the section.
                 // If you want clicking #about *while on about.html* to scroll to the active tab,
                 // you'd need to add similar logic as in the DOMContentLoaded handler here.
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // 100ms delay, adjust if needed
        }

        // The mobile menu closing when clicking a link is now handled by the
        // global click listener below, to avoid duplicating logic.
    });
});

// Activate initial section and scroll to it, and handle mobile menu closing
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash; // Keep the '#'
    // Find the element matching the hash. Need querySelector for '#' syntax.
    const targetSection = hash ? document.querySelector(hash) : null;

    // Default to home if no hash or target not found, or if target isn't a content section
    const homeSection = document.getElementById('home');
    let sectionToActivate = null;

    if (targetSection && targetSection.classList.contains('content-section')) {
        sectionToActivate = targetSection;
    } else if (homeSection && homeSection.classList.contains('content-section')) {
        // Fallback to home if hash is invalid or points to something else
        sectionToActivate = homeSection;
    }

    if (sectionToActivate) {
        // Make sure all others are inactive first (optional but good practice)
        document.querySelectorAll('.content-section.active').forEach(activeSection => {
            if (activeSection !== sectionToActivate) {
                activeSection.classList.remove('active');
            }
        });

        // Activate the target section
        sectionToActivate.classList.add('active');

        // --- START: Modified Scroll Logic ---
        let elementToScrollTo = sectionToActivate;

        // If the activated section is the 'about' section and contains tabs,
        // try to scroll to the currently active tab content inside it.
        if (sectionToActivate.id === 'about') {
             // Ensure tabs are correctly initialized/active before scrolling
             // The openTab function should ideally handle making one active on load if needed.
             // Assuming #about-content is the default active tab as per your HTML
             const activeTabContent = sectionToActivate.querySelector('.tab-content.active');
             if (activeTabContent) {
                elementToScrollTo = activeTabContent;
             }
             // Note: This logic specifically handles navigating *to* the page with a hash like #about.
             // It scrolls to the default active tab within #about.
             // If you want to deep link to a specific tab (#about#committee), you'd need more complex logic
             // here to parse the hash and potentially call openTab programmatically before scrolling.
        }


        // Use setTimeout to allow rendering, then scroll to the correct element
        setTimeout(() => {
            // Check if elementToScrollTo is still valid/in DOM before scrolling
            if (elementToScrollTo && document.body.contains(elementToScrollTo)) {
                 elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (sectionToActivate && document.body.contains(sectionToActivate)) {
                 // Fallback to scrolling to the section if active tab wasn't found
                 sectionToActivate.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        }, 100); // 100ms delay, adjust if needed
        // --- END: Modified Scroll Logic ---

    } else {
        console.warn("No valid section found to activate for hash:", hash);
        // Optional: Still ensure home section is active if nothing else is found
        if (homeSection && homeSection.classList.contains('content-section')) {
             homeSection.classList.add('active');
             // Optional: scroll to home if it wasn't active
             setTimeout(() => {
                 homeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }, 100);
        }
    }


    // --- START: Hamburger Close on Outside/Link Click Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Check if both elements exist before adding listeners
    if (menuToggle && navLinks) {
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickInsideToggle = menuToggle.contains(event.target);
            const isMenuOpen = navLinks.classList.contains('active');
            const isNavLinkClick = event.target.tagName === 'A' && isClickInsideMenu;

            // Close menu if open and click is outside both the menu and the toggle
            if (isMenuOpen && !isClickInsideMenu && !isClickInsideToggle) {
                navLinks.classList.remove('active');
                // If you toggle active class on the button for styling, uncomment this:
                // menuToggle.classList.remove('active');
            }

            // Close menu if open and a link *inside* the menu is clicked
            // Add a small delay to allow the navigation/scroll to potentially start first
            if (isMenuOpen && isNavLinkClick) {
                 // Use a small delay to allow link navigation/scroll to process
                 setTimeout(() => {
                    navLinks.classList.remove('active');
                    // If you toggle active class on the button for styling, uncomment this:
                    // menuToggle.classList.remove('active');
                 }, 50); // Adjust delay if needed
            }
        });

        // Optional: Add a listener specifically for the menu toggle button itself
        // This is needed IF the onclick attribute is removed from the HTML
        // menuToggle.addEventListener('click', toggleMenu); // Uncomment if removing onclick from HTML
    }
    // --- END: Hamburger Close on Outside/Link Click Logic ---

});

// Contact form handler (only if form exists)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const btn = this.querySelector('.submit-btn');
        const spinner = btn.querySelector('.spinner');
        const btnText = btn.querySelector('.btn-text');

        btn.disabled = true;
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');

        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            // Add console logs for debugging
            console.log('Form submission response:', response);
            if (response.ok) {
                console.log('Form submitted successfully!');
                this.reset();
                showSuccessMessage();
            } else {
                console.error('Form submission failed:', response.status, response.statusText);
                 // Attempt to read error body if available
                 response.text().then(text => console.error('Response body:', text));
                showErrorMessage();
            }
        }).catch(error => {
             console.error('Form submission fetch error:', error);
             showErrorMessage();
        })
        .finally(() => {
            console.log('Form submission process finished.');
            btn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        });
    });
}

// Form status messages
function showSuccessMessage() {
    const statusDiv = document.querySelector('.form-status');
    if (!statusDiv) return;

    statusDiv.innerHTML = '<div class="success-message">✓ Message sent successfully!</div>';
    // Clear message after 5 seconds
    setTimeout(() => statusDiv.innerHTML = '', 5000);
}

function showErrorMessage() {
    const statusDiv = document.querySelector('.form-status');
    if (!statusDiv) return;

    statusDiv.innerHTML = '<div class="error-message">⚠️ Error sending message. Please try again.</div>';
    // Error messages often persist until user interacts or refreshes, or add a timeout if preferred
    // setTimeout(() => statusDiv.innerHTML = '', 8000); // Example: clear after 8 seconds
}

// Tab system
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    const tabLinks = document.getElementsByClassName("tab-link");

    // Deactivate all tab contents and links
    Array.from(tabContents).forEach(content => content.classList.remove("active"));
    Array.from(tabLinks).forEach(link => link.classList.remove("active"));

    // Activate the target tab content and link
    const targetTabContent = document.getElementById(tabName);
    if(targetTabContent) {
        targetTabContent.classList.add("active");
    } else {
        console.warn(`Tab content with ID '${tabName}' not found.`);
    }

    // Add active class to the clicked button, if event object exists
    if(evt && evt.currentTarget) {
       evt.currentTarget.classList.add("active");
    } else {
         // If called programmatically (e.g., on page load for default tab)
         // try to find the corresponding button by data attribute or href
         const programmaticTabLink = document.querySelector(`.tab-link[onclick*="'${tabName}'"]`);
         if (programmaticTabLink) {
              programmaticTabLink.classList.add("active");
         }
         console.warn(`openTab called programmatically for '${tabName}' without event object.`);
    }


    // Optional: Scroll to the newly active tab content after switching
    // This is helpful if switching tabs *while already on the page*
    // The DOMContentLoaded handler handles the initial scroll on page load.
    if (targetTabContent) {
        // Use a small delay to allow content to render and height to be calculated
        setTimeout(() => {
            // Check if the tab content is actually visible/in DOM before scrolling
            if (targetTabContent.offsetHeight > 0 || targetTabContent.offsetWidth > 0) { // Simple visibility check
                targetTabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50); // Adjust delay if needed
    }
}


// Read more functionality
function toggleReadMore(link) {
    const previewContent = link.previousElementSibling; // Assumes preview is the element right before the link
    const moreContent = link.nextElementSibling; // Assumes more content is the element right after the link
    const isExpanded = moreContent.classList.contains('expanded');

    link.classList.toggle('expanded', !isExpanded);
    moreContent.classList.toggle('expanded', !isExpanded);

    // Use scrollHeight for smooth expansion animation, collapse by setting to 0
    moreContent.style.maxHeight = isExpanded ? '0' : `${moreContent.scrollHeight}px`;
    moreContent.style.paddingTop = isExpanded ? '0' : '1rem'; // Optional: add padding when expanded
    moreContent.style.paddingBottom = isExpanded ? '0' : '1rem'; // Optional: add padding when expanded


    link.textContent = isExpanded ? 'Continue reading' : 'Show less';

    // Optional: Scroll to the link after expanding/collapsing if it's near the bottom
    // Use a timeout to allow the max-height transition to start
     setTimeout(() => {
         link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
     }, 350); // Delay slightly longer than max-height transition
}