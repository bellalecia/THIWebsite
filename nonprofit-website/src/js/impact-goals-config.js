// Impact Goals Configuration
// API integration for dynamic loading of impact goals on the frontend

const ImpactGoalsAPI = {
    baseUrl: 'https://harambee-board-api.azurewebsites.net/api/impact-goals',
    
    // Fetch all impact goals from API
    async getImpactGoals() {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching impact goals:', error);
            // Return fallback data if API fails
            return this.getFallbackImpactGoals();
        }
    },
    
    // Fallback data matching the original strings.js structure
    getFallbackImpactGoals() {
        return [
            { id: 1, number: "500+", label: "Families to Receive Monthly Food Support" },
            { id: 2, number: "$10M", label: "Campaign Goal" },
            { id: 3, number: "200+", label: "Youth to Engage in STEAM Learning Annually" },
            { id: 4, number: "500+", label: "Adults to Gain Career-Ready Skills" }
        ];
    },
    
    // Display impact goals in the stats section
    async displayImpactGoals(containerId = 'impact-stats') {
        try {
            const goals = await this.getImpactGoals();
            const container = document.getElementById(containerId);
            
            if (!container) {
                console.warn(`Container ${containerId} not found`);
                return;
            }
            
            const goalsHtml = goals.map(goal => 
                `<div class="stat-card">
                    <div class="stat-number">${goal.number}</div>
                    <div>${goal.label}</div>
                </div>`
            ).join('');
            
            container.innerHTML = goalsHtml;
            
            // Add data source indicator for debugging
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('Impact Goals loaded:', goals.length, 'goals from API');
            }
            
        } catch (error) {
            console.error('Error displaying impact goals:', error);
            
            // Show fallback content
            const container = document.getElementById(containerId);
            if (container) {
                const fallbackGoals = this.getFallbackImpactGoals();
                const goalsHtml = fallbackGoals.map(goal => 
                    `<div class="stat-card">
                        <div class="stat-number">${goal.number}</div>
                        <div>${goal.label}</div>
                    </div>`
                ).join('');
                container.innerHTML = goalsHtml;
                console.log('Using fallback impact goals data');
            }
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImpactGoalsAPI;
}