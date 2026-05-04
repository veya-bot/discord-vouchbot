# 🚀 VouchBot

[![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A powerful, lightweight Discord bot with a secure persistent database, designed for marketplaces to manage and display customer vouches with zero data loss. Built with **Discord.js v14**.

---

## ✨ Features

- **📝 Easy Vouching**: Simple `/vouch` command with support for products, ratings, notes, and proof images.
- **📊 Real-time Stats**: Track server-wide performance with the `/stats` command.
- **👤 User Profiles**: View a detailed vouch history for any seller using `/profile`.
- **🏆 Leaderboards**: Competitive seller rankings based on vouch counts with `/leaderboard`.
- **📌 Sticky Messages**: Keep the vouch prompt visible in your vouch channel automatically.
- **📁 Local Data Storage**: Uses a lightweight JSON database – no complex database setup required.
- **⚙️ Direct Configuration**: No `.env` files. Everything is managed in a single `config.js`.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.11.0 or higher)
- A Discord Bot Token (Get one at [Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/veya-bot/discord-vouchbot.git
   cd discord-vouchbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   Open `config.js` and fill in your credentials:
   ```javascript
   TOKEN: "YOUR_BOT_TOKEN",
   CLIENT_ID: "YOUR_APPLICATION_ID",
   VOUCH_CHANNEL_ID: "YOUR_TARGET_CHANNEL_ID"
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

---

## 🛠️ Commands

| Command | Description | Permissions |
| :--- | :--- | :--- |
| `/vouch` | Submit a new vouch for a seller | Everyone |
| `/stats` | View server-wide vouch statistics | Everyone |
| `/profile` | View a user's vouch history and rating | Everyone |
| `/leaderboard` | View the top 10 sellers | Everyone |
| `/sticky` | Enable/Disable the sticky message | Manage Server |
| `/restore` | Restore vouches from vouches.json | Bot Admin |

---

## 🔧 Configuration Details

The `config.js` file allows you to customize the bot's behavior and appearance:

- **`ADMIN_IDS`**: Add user IDs to this array for administrative control.
- **`BOT_STATUS`**: 
  - `TEXT`: The text shown in the bot's status.
  - `TYPE`: `Watching`, `Playing`, `Listening`, or `Competing`.
  - `STATE`: `online`, `idle`, `dnd`, or `invisible`.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
