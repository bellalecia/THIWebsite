document.getElementById('site-title').textContent = STRINGS.siteTitle + " - Partner with Us";
document.getElementById('nav-logo').textContent = STRINGS.siteTitle.toUpperCase();
document.getElementById('nav-home').textContent = STRINGS.nav.home;
document.getElementById('nav-about').textContent = STRINGS.nav.about;
document.getElementById('nav-get-involved').textContent = STRINGS.nav.getInvolved;
document.getElementById('nav-partner').textContent = STRINGS.nav.partner;

document.getElementById('partner-title').textContent = STRINGS.partner.title;
document.getElementById('partner-intro').textContent = STRINGS.partner.intro;
document.getElementById('donation-options').innerHTML = STRINGS.partner.donationOptions.map(opt =>
    `<div class="donation-card"><h3>${opt.title}</h3><p>${opt.text}</p></div>`
).join('');
document.getElementById('naming-title').textContent = STRINGS.partner.namingTitle;
document.getElementById('naming-grid').innerHTML = STRINGS.partner.naming.map(n =>
    `<div class="naming-card"><div class="naming-amount">${n.amount}</div><div>${n.label}</div></div>`
).join('');
document.getElementById('download-title').textContent = STRINGS.partner.downloadTitle;
document.getElementById('download-btn').textContent = STRINGS.partner.downloadBtn;

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