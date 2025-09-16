document.addEventListener('DOMContentLoaded', function() {
    // Set page title
    document.getElementById('site-title').textContent = STRINGS.siteTitle + " - Home";
    
    // Wait for includes to load
    setTimeout(() => {
        // Set hero section content
        document.getElementById('hero-title').textContent = STRINGS.hero.title;
document.getElementById('hero-subtitle').textContent = STRINGS.hero.subtitle;
document.getElementById('hero-button').textContent = STRINGS.hero.button;

document.getElementById('mission-title').textContent = STRINGS.mission.title;
document.getElementById('mission-description').textContent = STRINGS.mission.description;
const missionCards = STRINGS.mission.cards.map(card =>
    `<div class="mission-card"><h3>${card.title}</h3><p>${card.text}</p></div>`
).join('');
document.getElementById('mission-cards').innerHTML = missionCards;

document.getElementById('impact-title').textContent = STRINGS.impact.title;
const impactStats = STRINGS.impact.stats.map(stat =>
    `<div class="stat-card"><div class="stat-number">${stat.number}</div><div>${stat.label}</div></div>`
).join('');
document.getElementById('impact-stats').innerHTML = impactStats;

document.getElementById('components-title').textContent = STRINGS.components.title;
const componentsItems = STRINGS.components.items.map(item =>
    `<div class="component-card"><h3>${item.title}</h3><p>${item.text}</p><div class="component-cost">${item.cost}</div></div>`
).join('');
document.getElementById('components-items').innerHTML = componentsItems;

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
    }, 100); // Small delay to ensure includes are loaded
});