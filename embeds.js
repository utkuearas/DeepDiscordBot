const {MessageEmbed} = require('discord.js');

module.exports.restart_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Restart Alert')
    .setDescription('There is a new update, DEEP is rebooting.')

module.exports.sorry_premium_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('This content is for premium members.')
    .setDescription('If you want, you can browse the premium content here:\n\nhttps://www.patreon.com/deepbot')
    .setImage('https://cdn.discordapp.com/attachments/635581097073311745/704110473087418518/1600x400.png')

module.exports.search_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Search Results');

module.exports.play_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setAuthor('Now Playing','https://cdn.discordapp.com/attachments/707703621239963658/708769574530580530/iconfinder_395_Youtube_logo_4375133.png');
    
module.exports.hours_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('This video is longer than 4 hours.')
    
module.exports.about_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle("Hi! \n\nWe're DEEP")
    .setDescription("We joined Discord in 2020. We're so young that's why we consider our current users very important. Because we know that our current users actually help us to improve ourselves.")
    .setThumbnail('https://cdn.discordapp.com/attachments/664911534480293929/691416658656624660/logo.png')
    .addField(name = 'Useful Links',value = "[Premium](https://www.patreon.com/deepbot) / [DEEP Official Server](https://discord.gg/jxNS7f4) / [Invite](https://discord.com/oauth2/authorize?client_id=684487629139607573&scope=bot&permissions=8) / [Bot Page](https://top.gg/bot/684487629139607573)");

module.exports.queue_empty_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Empty Queue')
    .setDescription('Music queue is empty')

module.exports.queue_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Queue List');
    
module.exports.error_joinable_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('I Have No Permission')
    .setDescription('I have no permission to join this voice channel. You should give me a permission to join this voice channel.')
    
module.exports.high_cpu_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Sorry')
    .setDescription('We are sorry but live videos cause a lot of memory usage.')

module.exports.donate_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle('Donation')
    .setDescription('***You can add more radio to your server with donation: ***https://www.patreon.com/deepbot')
    .setImage('https://cdn.discordapp.com/attachments/635581097073311745/704110473087418518/1600x400.png');
    
module.exports.error_same_embed = new MessageEmbed()
    .setColor('8B31F0')
    .setTitle("You're in another room now");
    
module.exports.error_embed = new MessageEmbed()
    .setTitle('Whaaat?  :smile:')
    .setDescription('**If you need help you can say `?help` or you can read the top user manual.**')
    .setColor('8B31F0');

module.exports.stop_embed = new MessageEmbed()
    .setTitle('Stopped  :stop_button:')
    .setColor('8B31F0');

module.exports.error_join_embed = new MessageEmbed()
    .setTitle('Firstly, you should join a voice channel.')
    .setColor('8B31F0');

module.exports.bye_embed = new MessageEmbed()
    .setTitle('Goodbye  :smile:')
    .setColor('8B31F0');

module.exports.sad_embed = new MessageEmbed()
    .setTitle('Oh no again  :tired_face:')
    .setColor('8B31F0');

module.exports.paused_embed = new MessageEmbed()
    .setTitle('Paused  :pause_button:')
    .setColor('8B31F0');

module.exports.already_embed = new MessageEmbed()
    .setTitle("You haven't listened anything already")
    .setColor('8B31F0');

module.exports.play_error_embed = new MessageEmbed()
    .setTitle("If you want to play something, you should say ?play 153. Actually 153's my advice :thumbsup:")
    .setColor('8B31F0');

module.exports.resume_embed = new MessageEmbed()
    .setTitle("Let's Continue  :play_pause:")
    .setColor('8B31F0');

module.exports.skip_embed = new MessageEmbed()
    .setTitle('Skipped :metal: ')
    .setColor('8B31F0');

module.exports.stream_embed = new MessageEmbed() 
    .setDescription('Connecting To Radio Station')
    .setAuthor('\u200B','https://img.icons8.com/ios-filled/50/000000/radio-waves.png')
    .setColor('8B31F0')
    .setFooter("If it doesn't work, report us by using ?bug radio_name command");

module.exports.info_embed = new MessageEmbed()
    .setAuthor('Added To Queue','https://cdn.discordapp.com/attachments/707703621239963658/708769574530580530/iconfinder_395_Youtube_logo_4375133.png')
    .setColor('8B31F0');
