document.getElementById('site-title').textContent = STRINGS.siteTitle + " - About";
document.getElementById('nav-logo').textContent = STRINGS.siteTitle.toUpperCase();
document.getElementById('nav-home').textContent = STRINGS.nav.home;
document.getElementById('nav-about').textContent = STRINGS.nav.about;
document.getElementById('nav-get-involved').textContent = STRINGS.nav.getInvolved;
document.getElementById('nav-partner').textContent = STRINGS.nav.partner;

// About Section
document.getElementById('about-title').textContent = STRINGS.about.title;
document.getElementById('about-intro').textContent = STRINGS.about.intro;

// Board Section
document.getElementById('board-title').textContent = STRINGS.about.boardTitle;
document.getElementById('board-members').innerHTML = STRINGS.about.boardMembers.map(member =>
    `<div class="board-member"><div class="member-name">${member.name}</div><div class="member-title">${member.title}</div></div>`
).join('');

// Case Statement Section
document.getElementById('case-title').textContent = STRINGS.about.caseTitle;
document.getElementById('budget-breakdown').innerHTML = STRINGS.about.budget.map(item =>
    `<div class="budget-item"><span>${item.label}</span><span style="color: #D4AF37; font-weight: bold;">${item.amount}</span></div>`
).join('');

// Testimonials Section
document.getElementById('testimonial-text').textContent = STRINGS.about.testimonial.text;
document.getElementById('testimonial-author').textContent = STRINGS.about.testimonial.author;

// Footer
document.getElementById('footer-contact-title').textContent = STRINGS.footer.contactTitle;
document.getElementById('footer-contact-email').textContent = STRINGS.footer.contactEmail;
document.getElementById('footer-contact-phone').textContent = STRINGS.footer.contactPhone;
document.getElementById('footer-quick-title').textContent = STRINGS.footer.quickLinksTitle;
document.getElementById('footer-quick-links').innerHTML = STRINGS.footer.quickLinks.map(link =>
    `<p><a href="${link.url}">${link.label}</a></p>`
).join('');
document.getElementById('footer-follow-title').textContent = STRINGS.footer.followTitle;
document.getElementById('footer-follow-links').textContent = STRINGS.footer.followLinks;
document.getElementById('footer-copyright').innerHTML = STRINGS.footer.copyright;