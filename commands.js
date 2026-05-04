const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('./database.js');
const config = require('./config.js');
const { createVouchEmbed } = require('./utils.js');

const commands = [
    new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Leave a vouch for a seller')
        .addStringOption(opt => opt.setName('product').setDescription('Product name').setRequired(true))
        .addUserOption(opt => opt.setName('seller').setDescription('The seller').setRequired(true))
        .addIntegerOption(opt => opt.setName('stars').setDescription('Rating (1-5)').setRequired(true).addChoices(
            { name: '⭐', value: 1 }, { name: '⭐⭐', value: 2 }, { name: '⭐⭐⭐', value: 3 }, { name: '⭐⭐⭐⭐', value: 4 }, { name: '⭐⭐⭐⭐⭐', value: 5 }
        ))
        .addStringOption(opt => opt.setName('note').setDescription('Feedback note').setRequired(true))
        .addAttachmentOption(opt => opt.setName('image').setDescription('Proof image')),

    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Show server vouch stats'),

    new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Show a user\'s vouch profile')
        .addUserOption(opt => opt.setName('user').setDescription('Target user')),

    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show top sellers'),

    new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Manage the sticky message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(opt => opt.setName('action').setDescription('Action').setRequired(true).addChoices(
            { name: 'Enable', value: 'enable' }, { name: 'Disable', value: 'disable' }
        ))
];

async function handleInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, guildId, user } = interaction;

    if (commandName === 'vouch') {
        const product = interaction.options.getString('product');
        const seller = interaction.options.getUser('seller');
        const stars = interaction.options.getInteger('stars');
        const note = interaction.options.getString('note');
        const image = interaction.options.getAttachment('image');

        if (seller.id === user.id) return interaction.reply({ content: "❌ You cannot vouch for yourself!", ephemeral: true });

        const vouch = db.addVouch(guildId, {
            customerId: user.id, customerName: user.username,
            sellerId: seller.id, sellerName: seller.username,
            product, stars, note, imageUrl: image ? image.url : null
        });

        const embed = createVouchEmbed(vouch);
        const channel = interaction.guild.channels.cache.get(config.VOUCH_CHANNEL_ID) || interaction.channel;
        
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: `✅ Vouch submitted in ${channel}!`, ephemeral: true });

        const serverConfig = db.getConfig(guildId);
        if (serverConfig.sticky_enabled) {
            if (serverConfig.sticky_message_id) {
                try {
                    const msg = await channel.messages.fetch(serverConfig.sticky_message_id);
                    await msg.delete();
                } catch (e) {}
            }
            const sticky = await channel.send({ content: "💬 **Vouch for us!** Use `/vouch` to leave feedback." });
            serverConfig.sticky_message_id = sticky.id;
            db.saveConfig(guildId, serverConfig);
        }
    }

    if (commandName === 'stats') {
        const vouches = db.getVouches(guildId);
        if (vouches.length === 0) return interaction.reply("No vouches recorded yet.");
        const avg = vouches.reduce((a, b) => a + b.stars, 0) / vouches.length;
        await interaction.reply(`📊 **Server Stats**\nTotal: ${vouches.length}\nAverage: ${avg.toFixed(1)} ⭐`);
    }

    if (commandName === 'profile') {
        const target = interaction.options.getUser('user') || user;
        const vouches = db.getVouches(guildId).filter(v => v.sellerId === target.id);
        if (vouches.length === 0) return interaction.reply(`${target.username} has no vouches.`);
        const avg = vouches.reduce((a, b) => a + b.stars, 0) / vouches.length;
        await interaction.reply(`👤 **Profile: ${target.username}**\nVouches: ${vouches.length}\nAverage: ${avg.toFixed(1)} ⭐`);
    }

    if (commandName === 'leaderboard') {
        const vouches = db.getVouches(guildId);
        const leaders = {};
        vouches.forEach(v => { leaders[v.sellerName] = (leaders[v.sellerName] || 0) + 1; });
        const sorted = Object.entries(leaders).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const text = sorted.map(([name, count], i) => `${i + 1}. **${name}**: ${count}`).join('\n');
        await interaction.reply(`🏆 **Top Sellers**\n\n${text || "No data."}`);
    }

    if (commandName === 'sticky') {
        const action = interaction.options.getString('action');
        const serverConfig = db.getConfig(guildId);
        if (action === 'enable') {
            serverConfig.sticky_enabled = true;
            await interaction.reply({ content: "✅ Sticky message enabled", ephemeral: true });
        } else {
            serverConfig.sticky_enabled = false;
            serverConfig.sticky_message_id = null;
            await interaction.reply({ content: "✅ Sticky message disabled", ephemeral: true });
        }
        db.saveConfig(guildId, serverConfig);
    }
}

module.exports = { commands, handleInteraction };
