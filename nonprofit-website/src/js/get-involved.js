document.getElementById('site-title').textContent = STRINGS.siteTitle + " - Get Involved";
document.getElementById('nav-logo').textContent = STRINGS.siteTitle.toUpperCase();
document.getElementById('nav-home').textContent = STRINGS.nav.home;
document.getElementById('nav-about').textContent = STRINGS.nav.about;
document.getElementById('nav-get-involved').textContent = STRINGS.nav.getInvolved;
document.getElementById('nav-partner').textContent = STRINGS.nav.partner;

document.getElementById('get-title').textContent = STRINGS.getInvolved.title;
document.getElementById('get-intro').textContent = STRINGS.getInvolved.intro;
document.getElementById('get-programs').innerHTML = STRINGS.getInvolved.programs.map(p =>
    `<div class="program-card"><div class="program-title">${p.title}</div><p>${p.text}</p></div>`
).join('');
document.getElementById('get-video').textContent = STRINGS.getInvolved.video;
document.getElementById('get-partners').innerHTML = STRINGS.getInvolved.partners.map(l =>
    `<div class="partner-logo">${l}</div>`
).join('');

// Footer 1
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