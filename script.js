class MemorableSmiles {
    constructor() {
        this.smiles = this.loadSmiles();
        this.emojis = ['😊', '😄', '😁', '😆', '😍', '🥰', '😘', '😌', '🤗', '😋', '😎', '🥳', '🎉', '💖', '⭐'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setTodayAsDate();
        this.render();
    }

    setupEventListeners() {
        const form = document.getElementById('smileForm');
        form.addEventListener('submit', (e) => this.handleAddSmile(e));
    }

    setTodayAsDate() {
        const dateInput = document.getElementById('smileDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    handleAddSmile(e) {
        e.preventDefault();

        const title = document.getElementById('smileTitle').value.trim();
        const description = document.getElementById('smileDescription').value.trim();
        const date = document.getElementById('smileDate').value;

        if (!title || !date) {
            alert('Please fill in the required fields!');
            return;
        }

        const smile = {
            id: Date.now(),
            title: this.escapeHtml(title),
            description: this.escapeHtml(description),
            date: date,
            emoji: this.getRandomEmoji(),
            createdAt: new Date().toISOString()
        };

        this.smiles.unshift(smile);
        this.saveSmiles();
        this.resetForm();
        this.render();
    }

    deleteSmile(id) {
        if (confirm('Are you sure you want to delete this smile?')) {
            this.smiles = this.smiles.filter(smile => smile.id !== id);
            this.saveSmiles();
            this.render();
        }
    }

    getRandomEmoji() {
        return this.emojis[Math.floor(Math.random() * this.emojis.length)];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
    }

    saveSmiles() {
        localStorage.setItem('memorableSmiles', JSON.stringify(this.smiles));
    }

    loadSmiles() {
        const stored = localStorage.getItem('memorableSmiles');
        return stored ? JSON.parse(stored) : [];
    }

    resetForm() {
        document.getElementById('smileForm').reset();
        this.setTodayAsDate();
    }

    render() {
        const smilesList = document.getElementById('smilesList');
        smilesList.innerHTML = '';

        if (this.smiles.length === 0) {
            smilesList.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <p>No smiles yet! Add one to get started. 😊</p>
                </div>
            `;
            return;
        }

        this.smiles.forEach(smile => {
            const smileCard = document.createElement('div');
            smileCard.className = 'smile-card';
            smileCard.innerHTML = `
                <div class="smile-emoji">${smile.emoji}</div>
                <h3 class="smile-title">${smile.title}</h3>
                <p class="smile-date">${this.formatDate(smile.date)}</p>
                ${smile.description ? `<p class="smile-description">${smile.description}</p>` : ''}
                <div class="smile-actions">
                    <button class="btn btn-delete" onclick="app.deleteSmile(${smile.id})">Delete</button>
                </div>
            `;
            smilesList.appendChild(smileCard);
        });
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MemorableSmiles();
});
