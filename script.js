// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
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
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // 100ms delay, adjust if needed
        }

        // Close mobile menu
        toggleMenu();
    });
});

// Activate initial section and scroll to it
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

        // --- START: Added Scroll Logic ---
        // Use setTimeout to allow the browser a moment to render the activated section
        setTimeout(() => {
            sectionToActivate.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // 100ms delay, adjust if needed
        // --- END: Added Scroll Logic ---

    } else {
        // Optional: Handle case where neither target nor home section found/valid
        console.warn("No valid section found to activate for hash:", hash);
    }
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
            if (response.ok) {
                this.reset();
                showSuccessMessage();
            } else {
                showErrorMessage();
            }
        }).catch(showErrorMessage)
        .finally(() => {
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
    setTimeout(() => statusDiv.innerHTML = '', 5000);
}

function showErrorMessage() {
    const statusDiv = document.querySelector('.form-status');
    if (!statusDiv) return;

    statusDiv.innerHTML = '<div class="error-message">⚠️ Error sending message. Please try again.</div>';
}

// Tab system
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    const tabLinks = document.getElementsByClassName("tab-link");

    Array.from(tabContents).forEach(content => content.classList.remove("active"));
    Array.from(tabLinks).forEach(link => link.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Read more functionality
function toggleReadMore(link) {
    const previewContent = link.previousElementSibling;
    const moreContent = link.nextElementSibling;
    const isExpanded = moreContent.classList.contains('expanded');

    link.classList.toggle('expanded', !isExpanded);
    moreContent.classList.toggle('expanded', !isExpanded);
    moreContent.style.maxHeight = isExpanded ? null : `${moreContent.scrollHeight}px`;

    link.textContent = isExpanded ? 'Continue reading' : 'Show less';
}
