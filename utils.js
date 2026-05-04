const { EmbedBuilder } = require('discord.js');

function createVouchEmbed(vouch) {
    const embed = new EmbedBuilder()
        .setTitle("✨ New Vouch!")
        .setColor("#5865F2")
        .addFields(
            { name: "👤 Customer", value: `<@${vouch.customerId}>`, inline: true },
            { name: "👨‍💼 Seller", value: `<@${vouch.sellerId}>`, inline: true },
            { name: "📦 Product", value: vouch.product, inline: false },
            { name: "⭐ Rating", value: "⭐".repeat(vouch.stars), inline: true },
            { name: "💬 Feedback", value: vouch.note, inline: false }
        )
        .setTimestamp();

    if (vouch.imageUrl) {
        embed.setImage(vouch.imageUrl);
    }

    return embed;
}

module.exports = {
    createVouchEmbed
};
