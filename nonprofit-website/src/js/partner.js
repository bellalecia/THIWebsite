document.addEventListener('DOMContentLoaded', function() {
    // Set page title
    document.getElementById('site-title').textContent = STRINGS.siteTitle + " - Partner with Us";

    // Wait for includes to load
    setTimeout(() => {
        // Render programming collaborations section from JS
        renderProgrammingCollaborations();
        // Render Ways to Support section from STRINGS
        renderWaysToSupport();
        // Set partner page content
        document.getElementById('partner-title').textContent = STRINGS.partner.title;
        document.getElementById('partner-intro').textContent = STRINGS.partner.intro;

        // Set support section title
        document.getElementById('support-title').textContent = STRINGS.partner.waysToSupport.title;

        // Set donation options
        document.getElementById('donation-options').innerHTML = STRINGS.partner.donationOptions.map(opt =>
            `<div class="donation-card"><h3 style="color: #D4AF37;">${opt.title}</h3><p>${opt.text}</p></div>`
        ).join('');

        // Set support prompt text
        document.getElementById('support-prompt').textContent = STRINGS.partner.waysToSupport.prompt;
        document.getElementById('support-contact').textContent = STRINGS.partner.waysToSupport.contactLabel;

        // Set naming opportunities
        document.getElementById('naming-title').textContent = STRINGS.partner.namingTitle;
        document.getElementById('naming-grid').innerHTML = STRINGS.partner.naming.map(n =>
            `<div class="naming-card"><div class="naming-amount">${n.amount}</div><div>${n.label}</div></div>`
        ).join('');

        // Set download section
        document.getElementById('download-title').textContent = STRINGS.partner.downloadTitle;
        document.getElementById('download-btn').textContent = STRINGS.partner.downloadBtn;

        // Add click handler to download the pledge PDF
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            const pdfRelativePath = 'media/THI PLEDGE FORM.pdf';
            const pdfUrl = pdfRelativePath.replace(/ /g, '%20'); // encode spaces for URL
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    const a = document.createElement('a');
                    a.href = pdfUrl;
                    a.download = 'THI_PLEDGE_FORM.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } catch (err) {
                    // Fallback: open in new tab
                    window.open(pdfUrl, '_blank');
                }
            });

            // Create a second button for downloading the Case Statement PDF
            const casePdfRelative = 'media/Case Statement.pdf';
            const casePdfUrl = casePdfRelative.replace(/ /g, '%20');
            const caseBtn = document.createElement('a');
            caseBtn.href = '#';
            caseBtn.id = 'download-case-btn';
            caseBtn.className = 'download-btn';  // Use the same class as the first button
            caseBtn.textContent = 'Download Case Statement';
            caseBtn.setAttribute('aria-label', 'Download Case Statement PDF');
            caseBtn.style.marginLeft = '8px';

            // Insert the new button right after the existing download button
            downloadBtn.insertAdjacentElement('afterend', caseBtn);

            // Click handler for the Case Statement
            caseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    const a = document.createElement('a');
                    a.href = casePdfUrl;
                    a.download = 'THI_Case_Statement.pdf';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } catch (err) {
                    window.open(casePdfUrl, '_blank');
                }
            });
        }

        // Set board section
        document.getElementById('board-title').textContent = STRINGS.about.boardTitle;
        loadBoardMembers();
    }, 100); // Small delay to ensure includes are loaded
});

// Programming Collaborations renderer (content sourced from STRINGS)
function renderProgrammingCollaborations(selector = '#partner-mockup .collaboration-section') {
    const items = (STRINGS.partner && STRINGS.partner.programmingCollaborations) || [];
    const sectionHtml = `
        <h2 class="section-title">${STRINGS.partner.collaborationTitle || 'Programming Collaborations'}</h2>
        <div class="collaboration-grid">
            ${items.map(c => `\n                <div class="collaboration-card">\n                    <h3>${c.title}</h3>\n                    <p>${c.text}</p>\n                </div>`).join('')}
        </div>
    `;

    const el = document.querySelector(selector);
    if (el) {
        el.innerHTML = sectionHtml;
        return;
    }

    // If the expected section isn't present, append it inside the partner mockup
    const partner = document.getElementById('partner-mockup');
    if (partner) {
        const newSec = document.createElement('section');
        newSec.className = 'collaboration-section';
        newSec.innerHTML = sectionHtml;
        // Insert before the footer inside the partner mockup if possible
        const footer = partner.querySelector('footer');
        if (footer) partner.insertBefore(newSec, footer);
        else partner.appendChild(newSec);
    }
}

// Render the simple 'Ways to Support' contact prompt
function renderWaysToSupport(selector = '#partner-mockup .download-section') {
    const ws = (STRINGS.partner && STRINGS.partner.waysToSupport) || {};
    const sectionHtml = `
        <h2 class="section-title">${ws.title || 'Ways to Support'}</h2>
        <div class="support-box">
            <p class="support-prompt">${ws.prompt || 'Interested in supporting The Harambee Initiative?'}</p>
            <p class="support-contact-label">${ws.contactLabel || 'Contact us:'}</p>
            <p class="support-contact"><a href="mailto:${STRINGS.footer.contactEmail}">${STRINGS.footer.contactEmail}</a></p>
            <p class="support-contact">${STRINGS.footer.contactPhone}</p>
        </div>
    `;

    const el = document.querySelector(selector);
    if (el) {
        el.innerHTML = sectionHtml;
        return;
    }

    // If download-section isn't found, append it after programming collaborations
    const partner = document.getElementById('partner-mockup');
    if (partner) {
        const newSec = document.createElement('section');
        newSec.className = 'download-section';
        newSec.innerHTML = sectionHtml;
        const collab = partner.querySelector('.collaboration-section');
        if (collab && collab.nextSibling) partner.insertBefore(newSec, collab.nextSibling);
        else partner.appendChild(newSec);
    }
}

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