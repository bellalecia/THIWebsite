document.addEventListener('DOMContentLoaded', function() {
    // Set page title
    document.getElementById('site-title').textContent = STRINGS.siteTitle + " - About";

    // Wait for includes to load
    setTimeout(() => {
        // About Section
document.getElementById('about-title').textContent = STRINGS.about.title;
document.getElementById('about-intro').textContent = STRINGS.about.intro;

// Board Section
document.getElementById('board-title').textContent = STRINGS.about.boardTitle;

// Load board members dynamically from JSON
async function loadBoardMembers() {
    try {
        const response = await fetch('data/board.json');
        if (!response.ok) throw new Error('Failed to load board data');
        const boardMembers = await response.json();
        
        document.getElementById('board-members').innerHTML = boardMembers.map(member =>
            `<div class="board-member"><div class="member-name">${member.name}</div><div class="member-title">${member.title}</div></div>`
        ).join('');
    } catch (error) {
        console.warn('Failed to load board members from JSON, using fallback data:', error);
        // Fallback to static data if JSON fails to load
        document.getElementById('board-members').innerHTML = STRINGS.about.boardMembers.map(member =>
            `<div class="board-member"><div class="member-name">${member.name}</div><div class="member-title">${member.title}</div></div>`
        ).join('');
    }
}

// Load board members
loadBoardMembers();

// Case Statement Section
document.getElementById('case-title').textContent = STRINGS.about.caseTitle;
document.getElementById('budget-breakdown').innerHTML = STRINGS.about.budget.map(item =>
    `<div class="budget-item"><span>${item.label}</span><span style="color: #D4AF37; font-weight: bold;">${item.amount}</span></div>`
).join('');

// Testimonials Section
document.getElementById('testimonial-text').textContent = STRINGS.about.testimonial.text;
document.getElementById('testimonial-author').textContent = STRINGS.about.testimonial.author;

    }, 100); // Small delay to ensure includes are loaded
});
document.getElementById('footer-quick-title').textContent = STRINGS.footer.quickLinksTitle;
document.getElementById('footer-quick-links').innerHTML = STRINGS.footer.quickLinks.map(link =>
    `<p><a href="${link.url}">${link.label}</a></p>`
).join('');
document.getElementById('footer-follow-title').textContent = STRINGS.footer.followTitle;
document.getElementById('footer-follow-links').textContent = STRINGS.footer.followLinks;
document.getElementById('footer-copyright').innerHTML = STRINGS.footer.copyright;