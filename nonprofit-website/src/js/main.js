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
// Load impact stats dynamically from API
ImpactGoalsAPI.displayImpactGoals('impact-stats');

document.getElementById('components-title').textContent = STRINGS.components.title;
const componentsItems = STRINGS.components.items.map(item =>
    `<div class="component-card">
        <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">${item.title}</h3>
        <p style="font-size: 1.1rem;">${item.text}</p>
        <div class="component-cost" style="font-size: 1rem; margin-top: 0.5rem;">${item.cost}</div>
    </div>`
).join('');
document.getElementById('components-items').innerHTML = componentsItems;
    }, 100); // Small delay to ensure includes are loaded
});