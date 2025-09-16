// includes.js
function loadIncludes() {
    const header = `
        <nav class="nav">
            <div class="logo">
                <img src="media/THI Logo.jpg" alt="The Harambee Initiative Logo" class="logo-img">
                <div class="logo-text">The Harambee Initiative, Inc.</div>
            </div>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="get-involved.html">Get Involved</a></li>
                <li><a href="partner.html">Partner With Us</a></li>
            </ul>
        </nav>
    `;

    const footer = `
        <div class="footer-content">
            <div class="footer-sections-container">
                <div class="footer-section">
                    <h3>Contact Us</h3>
                    <p>admin@harambeenow.org</p>
                    <p>(630) 384-9070</p>
                </div>
                <div class="footer-section">
                    <h3>Follow Us</h3>
                    <div class="social-links">
                        <a href="https://www.facebook.com/p/The-Harambee-Initiative-Inc-61573615454626/" target="_blank" class="social-link">
                            <i class="fab fa-facebook"></i>
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.instagram.com/harambeenow/?g=5" target="_blank" class="social-link">
                            <i class="fab fa-instagram"></i>
                            <span>Instagram</span>
                        </a>
                        <a href="https://www.linkedin.com/company/the-harambee-initiative-inc/" target="_blank" class="social-link">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 The Harambee Initiative, Inc. | Tax ID: 99-0898227</p>
        </div>
    `;

    // Insert header and footer
    document.getElementById('header-placeholder').innerHTML = header;
    document.getElementById('footer-placeholder').innerHTML = footer;

    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelector(`a[href="${currentPage}"]`)?.classList.add('active');
}

// Run when the page loads
document.addEventListener('DOMContentLoaded', loadIncludes);