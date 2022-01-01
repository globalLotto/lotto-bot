// @ts-check
require("dotenv").config();

const { Client, MessageAttachment, MessageEmbed } = require("discord.js");
const client = new Client({ intents: ["GUILDS"] });

const { scheduleJob } = require("node-schedule");
const sharp = require("sharp");
const { appendFileSync } = require("fs");

client.once("ready", () => {
	console.log(`Bot is up and ready! (${client.user.tag})`);
	const channel = client.channels.cache.get("922457577105817681");
	scheduleJob("0 0 12 * * ?", async () => {
		try {
			const now = new Date(Date.now());

			const rand_num = (() => {
				const num = Math.floor(Math.random() * 100000);
				return "0".repeat(6 - num.toString().length) + num.toString();
			})();
			const imagebuffer = await sharp({
				create: {
					width      : 1200,
					height     : 600,
					channels   : 3,
					background : { r: 0, g: 0, b: 0 }
				}
			})
				.composite([{ input: Buffer.from(`<svg width="1200" height="600"><text x="50%" y="50%" text-anchor="middle" font-family="Roboto" font-size="25em" dy=".35em" fill="#fff">${rand_num}</text></svg>`) }])
				.jpeg()
				.toBuffer();

			const embed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(`**Period**: A${now.getFullYear()}${now.getMonth()}${now.getDate()}\n**Time**: <t:${~~(now.getTime() / 1000)}>\n**Draw Number**: ${rand_num}\n**Reward**: 100 WETH`)
				.setImage("attachment://globallottery_winner.jpeg")
				.setTimestamp();
			// @ts-ignore
			await channel.send({ embeds: [embed], files: [new MessageAttachment(imagebuffer, "globallottery_winner.jpeg")] });

			appendFileSync( "log.txt", `${new Date(Date.now()).toISOString()},${rand_num}` );
		} catch (e) {
			console.error(e);
		}
	});
});

client.login(process.env.BOT_TOKEN);
