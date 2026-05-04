const fs = require('fs');
const path = require('path');

class DatabaseManager {
    constructor() {
        this.basePath = path.join(__dirname, "data");
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, { recursive: true });
        }
    }

    getServerPath(guildId) {
        const serverPath = path.join(this.basePath, guildId);
        if (!fs.existsSync(serverPath)) {
            fs.mkdirSync(serverPath, { recursive: true });
        }
        return serverPath;
    }

    getVouches(guildId) {
        const filePath = path.join(this.getServerPath(guildId), "vouches.json");
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
            return [];
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    saveVouches(guildId, vouches) {
        const filePath = path.join(this.getServerPath(guildId), "vouches.json");
        fs.writeFileSync(filePath, JSON.stringify(vouches, null, 2));
    }

    addVouch(guildId, vouchData) {
        const vouches = this.getVouches(guildId);
        const newVouch = {
            id: Date.now().toString(),
            ...vouchData,
            timestamp: new Date().toISOString()
        };
        vouches.push(newVouch);
        this.saveVouches(guildId, vouches);
        return newVouch;
    }

    getConfig(guildId) {
        const filePath = path.join(this.getServerPath(guildId), "config.json");
        if (!fs.existsSync(filePath)) {
            const defaultConfig = { sticky_enabled: false, sticky_message_id: null };
            fs.writeFileSync(filePath, JSON.stringify(defaultConfig));
            return defaultConfig;
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    saveConfig(guildId, config) {
        const filePath = path.join(this.getServerPath(guildId), "config.json");
        fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    }

    getBackupVouches() {
        const filePath = path.join(this.basePath, "vouches.json");
        if (!fs.existsSync(filePath)) return [];
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) {
            return [];
        }
    }
}

module.exports = new DatabaseManager();
