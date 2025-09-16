document.addEventListener('DOMContentLoaded', function() {
    // Set page title
    document.getElementById('site-title').textContent = STRINGS.siteTitle + " - Partner with Us";

    // Wait for includes to load
    setTimeout(() => {
        // Set partner page content
        document.getElementById('partner-title').textContent = STRINGS.partner.title;
        document.getElementById('partner-intro').textContent = STRINGS.partner.intro;

        // Set donation options
        document.getElementById('donation-options').innerHTML = STRINGS.partner.donationOptions.map(opt =>
            `<div class="donation-card"><h3>${opt.title}</h3><p>${opt.text}</p></div>`
        ).join('');

        // Set naming opportunities
        document.getElementById('naming-title').textContent = STRINGS.partner.namingTitle;
        document.getElementById('naming-grid').innerHTML = STRINGS.partner.naming.map(n =>
            `<div class="naming-card"><div class="naming-amount">${n.amount}</div><div>${n.label}</div></div>`
        ).join('');

        // Set download section
        document.getElementById('download-title').textContent = STRINGS.partner.downloadTitle;
        document.getElementById('download-btn').textContent = STRINGS.partner.downloadBtn;

        // Set board section
        document.getElementById('board-title').textContent = STRINGS.about.boardTitle;
        loadBoardMembers();
    }, 100); // Small delay to ensure includes are loaded
});

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