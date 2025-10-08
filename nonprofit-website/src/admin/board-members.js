// Board Members Admin Module
class BoardMembersAdmin {
    constructor() {
        this.apiBaseUrl = 'https://harambee-board-api.azurewebsites.net/api/board-members';
        this.currentMembers = [];
        this.editingMember = null;
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
        // Add member form submission
        const addMemberForm = document.getElementById('addMemberForm');
        if (addMemberForm) {
            addMemberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMember();
            });
        }

        // Load members initially
        this.loadMembers();
    }

    async loadMembers() {
        const loadingMessage = document.getElementById('loadingMessage');
        const membersList = document.getElementById('membersList');
        
        try {
            if (loadingMessage) loadingMessage.style.display = 'block';
            if (membersList) membersList.innerHTML = '';
            
            const response = await fetch(this.apiBaseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.currentMembers = await response.json();
            this.displayMembers();
            
        } catch (error) {
            console.error('Error loading members:', error);
            window.showStatus('Error loading board members. Please check your connection and try again.', 'error');
            if (membersList) {
                membersList.innerHTML = '<p style="color: #dc3545; text-align: center;">Failed to load board members</p>';
            }
        } finally {
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    }

    displayMembers() {
        const membersList = document.getElementById('membersList');
        if (!membersList) return;
        
        if (this.currentMembers.length === 0) {
            membersList.innerHTML = '<p style="text-align: center; color: #6c757d;">No board members found. Add one above to get started.</p>';
            return;
        }
        
        membersList.innerHTML = this.currentMembers.map(member => `
            <div class="member-card" data-id="${member.id}">
                <div class="member-info">
                    <div class="member-name">${this.escapeHtml(member.name)}</div>
                    <div class="member-title">${this.escapeHtml(member.title)}</div>
                </div>
                <div class="member-actions">
                    <button onclick="boardMembersAdmin.editMember(${member.id})" class="btn-secondary">✏️ Edit</button>
                    <button onclick="boardMembersAdmin.deleteMember(${member.id})" class="btn-danger">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    }

    async addMember() {
        const name = document.getElementById('newName')?.value.trim();
        const title = document.getElementById('newTitle')?.value.trim();

        if (!name || !title) {
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
                    name: name,
                    title: title
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add member');
            }

            const newMember = await response.json();
            window.showStatus(`✅ Successfully added "${newMember.name}"!`, 'success');
            
            // Reset form
            document.getElementById('addMemberForm')?.reset();
            
            // Reload members
            await this.loadMembers();

        } catch (error) {
            console.error('Error adding member:', error);
            window.showStatus(`❌ Error adding member: ${error.message}`, 'error');
        }
    }

    async editMember(id) {
        const member = this.currentMembers.find(m => m.id === id);
        if (!member) {
            window.showStatus('Member not found.', 'error');
            return;
        }

        // Pre-fill the form with current values
        const nameInput = document.getElementById('newName');
        const titleInput = document.getElementById('newTitle');
        
        if (nameInput) nameInput.value = member.name;
        if (titleInput) titleInput.value = member.title;
        
        // Change form to edit mode
        this.editingMember = id;
        const form = document.getElementById('addMemberForm');
        const submitButton = form?.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Update Member';
            submitButton.style.background = '#ffc107';
        }
        
        // Add cancel button
        if (!document.getElementById('cancelMemberEdit')) {
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.id = 'cancelMemberEdit';
            cancelButton.textContent = 'Cancel Edit';
            cancelButton.className = 'btn-secondary';
            cancelButton.onclick = () => this.cancelEdit();
            if (submitButton) {
                submitButton.parentNode.insertBefore(cancelButton, submitButton.nextSibling);
            }
        }
        
        // Scroll to form
        form?.scrollIntoView({ behavior: 'smooth' });
        window.showStatus(`Editing "${member.name}". Make changes and click Update.`, 'info');
    }

    cancelEdit() {
        this.editingMember = null;
        
        // Reset form
        document.getElementById('addMemberForm')?.reset();
        
        // Reset button
        const submitButton = document.querySelector('#addMemberForm button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Add Board Member';
            submitButton.style.background = '#2c5f41';
        }
        
        // Remove cancel button
        const cancelButton = document.getElementById('cancelMemberEdit');
        if (cancelButton) {
            cancelButton.remove();
        }
        
        if (window.hideStatus) window.hideStatus();
    }

    async updateMember() {
        const name = document.getElementById('newName')?.value.trim();
        const title = document.getElementById('newTitle')?.value.trim();

        if (!name || !title) {
            window.showStatus('Please fill in all required fields.', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${this.editingMember}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    title: title
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update member');
            }

            const updatedMember = await response.json();
            window.showStatus(`✅ Successfully updated "${updatedMember.name}"!`, 'success');
            
            this.cancelEdit();
            await this.loadMembers();

        } catch (error) {
            console.error('Error updating member:', error);
            window.showStatus(`❌ Error updating member: ${error.message}`, 'error');
        }
    }

    async deleteMember(id) {
        const member = this.currentMembers.find(m => m.id === id);
        if (!member) {
            window.showStatus('Member not found.', 'error');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${member.name}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete member');
            }

            window.showStatus(`✅ Successfully deleted "${member.name}"!`, 'success');
            await this.loadMembers();

        } catch (error) {
            console.error('Error deleting member:', error);
            window.showStatus(`❌ Error deleting member: ${error.message}`, 'error');
        }
    }

    refreshMembers() {
        this.loadMembers();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Handle form submission (checks if editing or adding)
    async handleFormSubmission() {
        if (this.editingMember) {
            await this.updateMember();
        } else {
            await this.addMember();
        }
    }
}

// Global instance for onclick handlers
let boardMembersAdmin;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        boardMembersAdmin = new BoardMembersAdmin();
    });
} else {
    boardMembersAdmin = new BoardMembersAdmin();
}

// Global function for refresh button
function refreshMembers() {
    if (boardMembersAdmin) {
        boardMembersAdmin.refreshMembers();
    }
}