// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
  }
  
  // Show only the clicked section and close mobile menu
  document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetSection = document.getElementById(targetId);
  
          // Hide all sections
          document.querySelectorAll('.content-section').forEach(section => {
              section.classList.remove('active');
          });
  
          // Show the clicked section
          targetSection.classList.add('active');
  
          // Close mobile menu after clicking a link
          toggleMenu();
      });
  });
  
  // Activate Home section on page load
  document.getElementById('home').classList.add('active');

  document.getElementById('contact-form').addEventListener('submit', function(e) {
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
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            this.reset();
            showSuccessMessage();
        } else {
            showErrorMessage();
        }
    }).catch(() => {
        showErrorMessage();
    }).finally(() => {
        btn.disabled = false;
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
    });
});

function showSuccessMessage() {
    const statusDiv = document.querySelector('.form-status');
    statusDiv.innerHTML = '<div class="success-message">✓ Message sent successfully!</div>';
    setTimeout(() => statusDiv.innerHTML = '', 5000);
}

function showErrorMessage() {
    const statusDiv = document.querySelector('.form-status');
    statusDiv.innerHTML = '<div class="error-message">⚠️ Error sending message. Please try again.</div>';
}

function openTab(evt, tabName) {
    // Hide all tab content
    let tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Remove active class from all tab links
    let tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the selected tab content and mark button as active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}