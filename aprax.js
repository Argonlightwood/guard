const {Client, MessageEmbed} = require("discord.js"), client = new Client({fetchAllMembers: true});  
let yetki = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];

client.ayar = {
  prefix: "?",
  token: "ODA4NDI5NzY0MDQ1ODMyMjUy.YCGa4w.7AzDOZZBEL4lAxaeyDh_q_caaag",
  
  jail: "807927139507634217",
  booster: "808082228159447090",
  sunucu: "807926442301456445",
  
  dokunma: ["733441151864143902","791364825124962304","808422589319872512","808414736773414973","808428776467857450","808428995896147968","808429764045832252","802307907059318807","775631788282347521","795624032250494987","750828719039316062"],
  sahip: "750828719039316062",
  ses: "807927176300199937",
  
  vanity_url: "1945",
  
  logs: {
    sunucuk: "807927210597154816",
    botk: "808598305939652620",
    kick: "803576661953871872",
    bank: "803576697492471838",
    kanalk: "807927212350373908"
  }
};

client.login(client.ayar.token).then(x=> console.log(`${client.user.username} kullanıcı adıyla giriş yapıldı.`));

function ceza (id, tür, sebep) {
  let guild = client.guilds.cache.get(client.ayar.sunucu),
      member = guild.members.cache.get(id); 
  
 if (!member || !tür) return; 
 if (!sebep) sebep = "Belirtilmedi. | Cyber Guard." 
  
 if (tür == "jail") return member.roles.cache.has(client.ayar.booster) ? member.roles.set([client.ayar.jail, client.ayar.booster]) : member.roles.set([client.ayar.jail]);
 if (tür == "ban")  return member.ban({reason: sebep});
};


function güvenli (userID) {
 let member = client.guilds.cache.get(client.ayar.sunucu).members.cache.get(userID);
 let x = client.ayar.dokunma || []; 
  
 if (!member || member.id == client.user.id || member.id == client.ayar.sahip || member.id == member.guild.owner.id || x.some(v=> member.id == v || member.roles.cache.has(v))) return true
 else return false;
};

/*client.renk = {
  "renksiz": "2F3136", // 0x36393E
  "mor": "3c0149",
  "mavi": "10033d",
  "turkuaz": "00ffcb",
  "kirmizi": "750b0c",
  "yesil": "032221"// 00cd00 - 008b00
};

client.color = function () {
  return client.renk[Object.keys(client.renk).random()];
};*/

client.color = "RANDOM";

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};


client.on("ready", () => {
  let kanal = client.channels.cache.get(client.ayar.ses);   
    
      client.user.setPresence({activity: {name: "Cyber ❤️ Dia", type: "WATCHING"}, status: "online"});
  if (kanal) kanal.join(); 
  });

  
client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.ayar.prefix)) return;
  if (message.author.id !== client.ayar.sahip) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(client.ayar.prefix.length);
  
  // Eval
  if (command === "eval" && message.author.id === client.ayar.sahip) {
    if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
      let code = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };
});  

client.on("guildMemberAdd", async (member) => {
  let entry = await member.guild.fetchAuditLogs({type: "BOT_ADD"}).then(x=> x.entries.first());
         
  let kanal = member.guild.channels.cache.get(client.ayar.logs.botk);
  
  if (!entry || !entry.executor || !member.user.bot || güvenli(entry.executor.id)) return;
  
  ceza (entry.executor.id, "ban", "Bot Koruma | Cyber Guard.");
  ceza (member.id, "ban", "Bot Koruma | Cyber Guard.");  
  ytKapat (client.ayar.sunucu);
  
  if (kanal) kanal.send(new MessageEmbed().setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuya ${member.user.tag} • \`${member.id}\` botunu ekledi. Güvenlik amacıyla 2 sinide sunucudan uzaklaştırdım!`).setColor(client.color));
});




const request = require("request");

client.on("guildUpdate", async (oldGuild, newGuild) => {
  let entry = await newGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(x=> x.entries.first());
  
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  let kanal = newGuild.channels.cache.get(client.ayar.logs.sunucuk);
  
  ceza (entry.executor.id, "ban", "Sunucu Koruması | Cyber Guard.");
  ytKapat(client.ayar.sunucu);
  
  if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
  if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true}))
  if (oldGuild.vanityURLCode != newGuild.vanityURLCode) {
 // ceza (entry.executor.id, "ban", "Url Koruma | Cyber Guard.");

  request({  
  method: 'PATCH',
  url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
  body: {
    code: client.ayar.vanity_url
  },
  json: true,
  headers: {
    "Authorization": `Bot ${client.ayar.token}`
  }
}, (err, aprax, body) => {
  if (err) return console.error(err);
});
};
  
  if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda değişiklik yaptı ve sunucudan uzaklaştırıldı!`))
});

client.on("channelCreate", async (channel) => {
  let entry = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(x=> x.entries.first());
  
  if (!entry || !entry.executor || güvenli(entry.executor.id)) return;
  
  let kanal = channel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  channel.delete({reason: "Kanal Koruma | Cyber Guard."});
  ceza (entry.executor.id, "ban", "Kanal Koruma | Cyber Guard.");
  ytKapat(client.ayar.sunucu);
  
 if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda kanal açtı ve sunucudan uzaklaştırıldı!`))
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  
  if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  ceza (entry.executor.id, "ban", "Kanal Koruma | Cyber Guard.");
  ytKapat(client.ayar.sunucu);
  
  let kanal = newChannel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  
   if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda \`${newChannel.name}\` kanalı üzerinde değişiklik yaptı ve sunucudan uzaklaştırıldı!`));
 }); 

client.on("channelDelete", async (channel) => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  let kanal = channel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  ceza (entry.executor.id, "ban", "Kanal Koruma | Cyber Guard.");
  ytKapat(client.ayar.sunucu);
  
  await channel.clone({ reason: "Kanal Koruma | Cyber Guard." }).then(async kanal => {
    if (channel.parentID != null) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
  });
  
  if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda \`${channel.name}\` kanalını sildi ve sunucudan uzaklaştırıldı!`));
 }); 
