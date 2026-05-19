// Legacy string injection — only runs if elements exist
(function() {
    const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
    const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

    setText('site-title', STRINGS.siteTitle + " - Get Involved");
    setText('nav-logo', STRINGS.siteTitle.toUpperCase());
    setText('nav-home', STRINGS.nav.home);
    setText('nav-about', STRINGS.nav.about);
    setText('nav-get-involved', STRINGS.nav.getInvolved);
    setText('nav-partner', STRINGS.nav.partner);

    setText('get-title', STRINGS.getInvolved.title);
    setText('get-intro', STRINGS.getInvolved.intro);
    setHtml('get-programs', STRINGS.getInvolved.programs.map(p =>
        `<div class="program-card"><div class="program-title">${p.title}</div><p>${p.text}</p></div>`
    ).join(''));
    setText('get-video', STRINGS.getInvolved.video);
    setHtml('get-partners', STRINGS.getInvolved.partners.map(l =>
        `<div class="partner-logo">${l}</div>`
    ).join(''));

    // Footer
    setText('footer-contact-title', STRINGS.footer.contactTitle);
    setText('footer-contact-email', STRINGS.footer.contactEmail);
    setText('footer-contact-phone', STRINGS.footer.contactPhone);
    setHtml('footer-quick-title', STRINGS.footer.quickLinksTitle);
    setHtml('footer-quick-links', STRINGS.footer.quickLinks.map(link =>
        `<p><a href="${link.url}">${link.label}</a></p>`
    ).join(''));
    setText('footer-follow-title', STRINGS.footer.followTitle);
    setText('footer-follow-links', STRINGS.footer.followLinks);
    setHtml('footer-copyright', STRINGS.footer.copyright);
})();