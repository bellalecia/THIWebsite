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

// Load board members dynamically from Azure Blob Storage or fallback sources
async function loadBoardMembers() {
    try {
        // Try dynamic data first
        const boardData = await BoardDataAPI.fetchBoardMembers();
        
        if (boardData && boardData.length > 0) {
            // Use dynamic data from Azure Blob Storage
            renderBoardMembers(boardData, 'Azure Blob Storage');
            return;
        }

        // Final fallback to static data
        renderBoardMembers(STRINGS.about.boardMembers, 'Static Data');

    } catch (error) {
        console.warn('Error loading board members:', error);
        // Use static data as final fallback
        renderBoardMembers(STRINGS.about.boardMembers, 'Static Data (Error Fallback)');
    }
}

// Render board members and show data source
function renderBoardMembers(boardMembers, dataSource) {
    document.getElementById('board-members').innerHTML = boardMembers.map(member =>
        `<div class="board-member">
            <div class="member-name">${member.name}</div>
            <div class="member-title">${member.title}</div>
        </div>`
    ).join('');
    
    // Add a small indicator of data source (you can remove this later)
    if (BOARD_DATA_CONFIG.debug) {
        console.log(`Board members loaded from: ${dataSource}`, boardMembers);
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