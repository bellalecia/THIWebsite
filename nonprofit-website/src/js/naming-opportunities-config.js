const NamingOpportunitiesAPI = {
    baseUrl: 'https://harambee-board-api.azurewebsites.net/api/naming-opportunities',
    
    async fetchNamingOpportunities() {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching naming opportunities:', error);
            // Return fallback data from STRINGS if API fails
            if (typeof STRINGS !== 'undefined' && STRINGS.partner && STRINGS.partner.naming) {
                console.log('Using fallback naming opportunities data');
                return STRINGS.partner.naming.map((item, index) => ({
                    id: index + 1,
                    amount: item.amount,
                    label: item.label,
                    description: '',
                    available: true
                }));
            }
            return [];
        }
    },
    
    async displayNamingOpportunities(containerId = 'naming-grid') {
        const opportunities = await this.fetchNamingOpportunities();
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container with ID "${containerId}" not found`);
            return;
        }
        
        if (opportunities.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Naming opportunities information is being updated.</p>';
            return;
        }
        
        // API already returns sorted data (highest to lowest amount)
        const sortedOpportunities = opportunities;
        
        container.innerHTML = sortedOpportunities
            .filter(opp => opp.available !== false) // Only show available opportunities
            .map(opportunity => `
                <div class="naming-card" data-id="${opportunity.id}">
                    <div class="naming-amount">${opportunity.amount}</div>
                    <div class="naming-label">${opportunity.label}</div>
                    ${opportunity.description ? `<div class="naming-description">${opportunity.description}</div>` : ''}
                </div>
            `).join('');
    },
    
    // Admin functions for CRUD operations
    async addOpportunity(opportunityData) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(opportunityData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add opportunity');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding opportunity:', error);
            throw error;
        }
    },
    
    async updateOpportunity(id, opportunityData) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(opportunityData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update opportunity');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating opportunity:', error);
            throw error;
        }
    },
    
    async deleteOpportunity(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete opportunity');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            throw error;
        }
    }
};