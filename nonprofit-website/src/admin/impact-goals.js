// Impact Goals Administration Module
// Manages CRUD operations for impact goals through Azure Function API

class ImpactGoalsAdmin {
    constructor() {
        this.apiBaseUrl = 'https://harambee-board-api.azurewebsites.net/api/impact-goals';
        this.goals = [];
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.loadGoals();
    }

    bindEventListeners() {
        // Add goal form submission
        document.getElementById('addGoalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addGoal();
        });
    }

    async loadGoals() {
        try {
            this.showLoadingMessage();
            const response = await fetch(this.apiBaseUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.goals = await response.json();
            this.hideLoadingMessage();
            this.renderGoals();
        } catch (error) {
            console.error('Error loading impact goals:', error);
            this.hideLoadingMessage();
            this.showErrorMessage('Failed to load impact goals: ' + error.message);
        }
    }

    async addGoal() {
        const number = document.getElementById('newGoalNumber').value.trim();
        const label = document.getElementById('newGoalLabel').value.trim();

        if (!number || !label) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }

        try {
            showStatus('Adding impact goal...', 'info');
            
            const response = await fetch(this.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: number,
                    label: label
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const newGoal = await response.json();
            showStatus('Impact goal added successfully!', 'success');
            
            // Clear form
            document.getElementById('addGoalForm').reset();
            
            // Reload goals
            await this.loadGoals();
            
        } catch (error) {
            console.error('Error adding impact goal:', error);
            showStatus('Failed to add impact goal: ' + error.message, 'error');
        }
    }

    async editGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) {
            showStatus('Goal not found', 'error');
            return;
        }

        const newNumber = prompt('Enter new number/metric:', goal.number);
        if (newNumber === null) return; // User cancelled

        const newLabel = prompt('Enter new label:', goal.label);
        if (newLabel === null) return; // User cancelled

        if (!newNumber.trim() || !newLabel.trim()) {
            showStatus('Number and label cannot be empty', 'error');
            return;
        }

        try {
            showStatus('Updating impact goal...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    number: newNumber.trim(),
                    label: newLabel.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showStatus('Impact goal updated successfully!', 'success');
            await this.loadGoals();
            
        } catch (error) {
            console.error('Error updating impact goal:', error);
            showStatus('Failed to update impact goal: ' + error.message, 'error');
        }
    }

    async deleteGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (!goal) {
            showStatus('Goal not found', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${goal.label}"?`)) {
            return;
        }

        try {
            showStatus('Deleting impact goal...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showStatus('Impact goal deleted successfully!', 'success');
            await this.loadGoals();
            
        } catch (error) {
            console.error('Error deleting impact goal:', error);
            showStatus('Failed to delete impact goal: ' + error.message, 'error');
        }
    }

    renderGoals() {
        const container = document.getElementById('goalsList');
        
        if (!this.goals || this.goals.length === 0) {
            container.innerHTML = '<p class="loading">No impact goals found.</p>';
            return;
        }

        const goalsHtml = this.goals.map(goal => `
            <div class="goal-card">
                <div class="goal-info">
                    <div class="goal-number">${goal.number}</div>
                    <div class="goal-label">${goal.label}</div>
                    ${goal.updatedAt ? `<div class="goal-updated">Updated: ${new Date(goal.updatedAt).toLocaleDateString()}</div>` : ''}
                </div>
                <div class="goal-actions">
                    <button onclick="impactGoalsAdmin.editGoal(${goal.id})" class="btn-secondary" title="Edit Goal">
                        ✏️ Edit
                    </button>
                    <button onclick="impactGoalsAdmin.deleteGoal(${goal.id})" class="btn-danger" title="Delete Goal">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = goalsHtml;
    }

    showLoadingMessage() {
        const container = document.getElementById('goalsList');
        if (container) {
            container.innerHTML = '<div class="loading">Loading impact goals...</div>';
        }
        
        // Also show the main loading message
        const loadingElement = document.getElementById('goalsLoadingMessage');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
    }

    hideLoadingMessage() {
        // Hide the main loading message
        const loadingElement = document.getElementById('goalsLoadingMessage');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showErrorMessage(message) {
        // Hide the main loading message
        const loadingElement = document.getElementById('goalsLoadingMessage');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        const container = document.getElementById('goalsList');
        if (container) {
            container.innerHTML = `<div class="loading" style="color: #dc3545;">${message}</div>`;
        }
    }
}

// Global functions for refreshing
function refreshGoals() {
    if (window.impactGoalsAdmin) {
        window.impactGoalsAdmin.loadGoals();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on a page with impact goals elements
    if (document.getElementById('goalsList')) {
        window.impactGoalsAdmin = new ImpactGoalsAdmin();
    }
});