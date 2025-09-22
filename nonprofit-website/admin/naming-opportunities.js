// Naming Opportunities Admin Module
class NamingOpportunitiesAdmin {
    constructor() {
        this.apiBaseUrl = 'https://harambee-board-api.azurewebsites.net/api/naming-opportunities';
        this.currentOpportunities = [];
        this.editingOpportunity = null;
        this.init();
    }

    init() {
        // Setup form handlers when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Add opportunity form submission
        const addOpportunityForm = document.getElementById('addOpportunityForm');
        if (addOpportunityForm) {
            addOpportunityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Load opportunities initially
        this.loadOpportunities();
    }

    async loadOpportunities() {
        const loadingMessage = document.getElementById('opportunitiesLoadingMessage');
        const opportunitiesList = document.getElementById('opportunitiesList');
        
        try {
            if (loadingMessage) loadingMessage.style.display = 'block';
            if (opportunitiesList) opportunitiesList.innerHTML = '';
            
            const response = await fetch(this.apiBaseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.currentOpportunities = await response.json();
            this.displayOpportunities();
            
        } catch (error) {
            console.error('Error loading opportunities:', error);
            window.showStatus('Error loading naming opportunities. Please check your connection and try again.', 'error');
            if (opportunitiesList) {
                opportunitiesList.innerHTML = '<p style="color: #dc3545; text-align: center;">Failed to load naming opportunities</p>';
            }
        } finally {
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    }

    displayOpportunities() {
        const opportunitiesList = document.getElementById('opportunitiesList');
        if (!opportunitiesList) return;
        
        if (this.currentOpportunities.length === 0) {
            opportunitiesList.innerHTML = '<p style="text-align: center; color: #6c757d;">No naming opportunities found. Add one above to get started.</p>';
            return;
        }

        // API already returns sorted data (highest to lowest amount)
        const sortedOpportunities = this.currentOpportunities;
        
        opportunitiesList.innerHTML = sortedOpportunities.map(opportunity => `
            <div class="opportunity-card" data-id="${opportunity.id}">
                <div class="opportunity-info">
                    <div class="opportunity-amount">${this.escapeHtml(opportunity.amount)}</div>
                    <div class="opportunity-label">${this.escapeHtml(opportunity.label)}</div>
                    ${opportunity.description ? `<div class="opportunity-description">${this.escapeHtml(opportunity.description)}</div>` : ''}
                    <span class="opportunity-status ${opportunity.available ? 'status-available' : 'status-unavailable'}">
                        ${opportunity.available ? 'Available' : 'Not Available'}
                    </span>
                </div>
                <div class="opportunity-actions">
                    <button onclick="namingOpportunitiesAdmin.editOpportunity(${opportunity.id})" class="btn-secondary">✏️ Edit</button>
                    <button onclick="namingOpportunitiesAdmin.deleteOpportunity(${opportunity.id})" class="btn-danger">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    }

    async addOpportunity() {
        const amount = document.getElementById('newAmount')?.value.trim();
        const label = document.getElementById('newLabel')?.value.trim();
        const description = document.getElementById('newDescription')?.value.trim();
        const available = document.getElementById('newAvailable')?.checked;

        if (!amount || !label) {
            window.showStatus('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    label: label,
                    description: description,
                    available: available
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add opportunity');
            }

            const newOpportunity = await response.json();
            window.showStatus(`✅ Successfully added "${newOpportunity.label}"!`, 'success');
            
            // Reset form
            const form = document.getElementById('addOpportunityForm');
            if (form) {
                form.reset();
                // Reset checkbox to default
                const availableCheckbox = document.getElementById('newAvailable');
                if (availableCheckbox) availableCheckbox.checked = true;
            }
            
            // Reload opportunities
            await this.loadOpportunities();

        } catch (error) {
            console.error('Error adding opportunity:', error);
            window.showStatus(`❌ Error adding opportunity: ${error.message}`, 'error');
        }
    }

    async editOpportunity(id) {
        const opportunity = this.currentOpportunities.find(o => o.id === id);
        if (!opportunity) {
            window.showStatus('Opportunity not found.', 'error');
            return;
        }

        // Pre-fill the form with current values
        const amountInput = document.getElementById('newAmount');
        const labelInput = document.getElementById('newLabel');
        const descriptionInput = document.getElementById('newDescription');
        const availableInput = document.getElementById('newAvailable');
        
        if (amountInput) amountInput.value = opportunity.amount;
        if (labelInput) labelInput.value = opportunity.label;
        if (descriptionInput) descriptionInput.value = opportunity.description || '';
        if (availableInput) availableInput.checked = opportunity.available;
        
        // Change form to edit mode
        this.editingOpportunity = id;
        const form = document.getElementById('addOpportunityForm');
        const submitButton = form?.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Update Opportunity';
            submitButton.style.background = '#ffc107';
        }
        
        // Add cancel button
        if (!document.getElementById('cancelOpportunityEdit')) {
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.id = 'cancelOpportunityEdit';
            cancelButton.textContent = 'Cancel Edit';
            cancelButton.className = 'btn-secondary';
            cancelButton.onclick = () => this.cancelEdit();
            if (submitButton) {
                submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
            }
        }
        
        // Scroll to form
        form?.scrollIntoView({ behavior: 'smooth' });
        window.showStatus(`Editing "${opportunity.label}". Make changes and click Update.`, 'info');
    }

    cancelEdit() {
        this.editingOpportunity = null;
        
        // Reset form
        const form = document.getElementById('addOpportunityForm');
        if (form) {
            form.reset();
            // Reset checkbox to default
            const availableCheckbox = document.getElementById('newAvailable');
            if (availableCheckbox) availableCheckbox.checked = true;
        }
        
        // Reset button
        const submitButton = document.querySelector('#addOpportunityForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Add Naming Opportunity';
            submitButton.style.background = '#2c5f41';
        }
        
        // Remove cancel button
        const cancelButton = document.getElementById('cancelOpportunityEdit');
        if (cancelButton) {
            cancelButton.remove();
        }
        
        if (window.hideStatus) window.hideStatus();
    }

    async updateOpportunity() {
        const amount = document.getElementById('newAmount')?.value.trim();
        const label = document.getElementById('newLabel')?.value.trim();
        const description = document.getElementById('newDescription')?.value.trim();
        const available = document.getElementById('newAvailable')?.checked;

        if (!amount || !label) {
            window.showStatus('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.editingOpportunity}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    label: label,
                    description: description,
                    available: available
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update opportunity');
            }

            const updatedOpportunity = await response.json();
            window.showStatus(`✅ Successfully updated "${updatedOpportunity.label}"!`, 'success');
            
            this.cancelEdit();
            await this.loadOpportunities();

        } catch (error) {
            console.error('Error updating opportunity:', error);
            window.showStatus(`❌ Error updating opportunity: ${error.message}`, 'error');
        }
    }

    async deleteOpportunity(id) {
        const opportunity = this.currentOpportunities.find(o => o.id === id);
        if (!opportunity) {
            window.showStatus('Opportunity not found.', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${opportunity.label}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete opportunity');
            }

            window.showStatus(`✅ Successfully deleted "${opportunity.label}"!`, 'success');
            await this.loadOpportunities();

        } catch (error) {
            console.error('Error deleting opportunity:', error);
            window.showStatus(`❌ Error deleting opportunity: ${error.message}`, 'error');
        }
    }

    refreshOpportunities() {
        this.loadOpportunities();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Handle form submission (checks if editing or adding)
    async handleFormSubmission() {
        if (this.editingOpportunity) {
            await this.updateOpportunity();
        } else {
            await this.addOpportunity();
        }
    }
}

// Global instance for onclick handlers
let namingOpportunitiesAdmin;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        namingOpportunitiesAdmin = new NamingOpportunitiesAdmin();
    });
} else {
    namingOpportunitiesAdmin = new NamingOpportunitiesAdmin();
}

// Global function for refresh button
function refreshOpportunities() {
    if (namingOpportunitiesAdmin) {
        namingOpportunitiesAdmin.refreshOpportunities();
    }
}