class Storage {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('requestHistory') || '[]');
        this.environments = JSON.parse(localStorage.getItem('environments') || '{}');
        this.collections = JSON.parse(localStorage.getItem('collections') || '[]');
        this.theme = localStorage.getItem('theme') || 'light';
    }

    // Request History Methods
    addToHistory(request) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
            response: request.response
        };
        this.history.unshift(historyItem);
        if (this.history.length > 50) this.history.pop(); // Keep last 50 requests
        this.saveHistory();
        return historyItem;
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    saveHistory() {
        localStorage.setItem('requestHistory', JSON.stringify(this.history));
    }

    // Environment Methods
    addEnvironment(name, variables) {
        this.environments[name] = variables;
        this.saveEnvironments();
    }

    getEnvironment(name) {
        return this.environments[name] || {};
    }

    getAllEnvironments() {
        return this.environments;
    }

    deleteEnvironment(name) {
        delete this.environments[name];
        this.saveEnvironments();
    }

    saveEnvironments() {
        localStorage.setItem('environments', JSON.stringify(this.environments));
    }

    // Collections Methods
    addCollection(collection) {
        const newCollection = {
            id: Date.now(),
            ...collection
        };
        this.collections.push(newCollection);
        this.saveCollections();
        return newCollection;
    }

    getCollections() {
        return this.collections;
    }

    updateCollection(id, updates) {
        const index = this.collections.findIndex(c => c.id === id);
        if (index !== -1) {
            this.collections[index] = { ...this.collections[index], ...updates };
            this.saveCollections();
            return this.collections[index];
        }
        return null;
    }

    deleteCollection(id) {
        this.collections = this.collections.filter(c => c.id !== id);
        this.saveCollections();
    }

    saveCollections() {
        localStorage.setItem('collections', JSON.stringify(this.collections));
    }

    // Theme Methods
    getTheme() {
        return this.theme;
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', theme);
    }
}

const storage = new Storage();
export default storage;