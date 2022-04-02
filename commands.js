const {prep_list} = require('./rythm_radios.js')
const {MessageEmbed} = require('discord.js');
const { t_countries } = require('./free_radios.js');
module.exports.now_playing_embed = (value) => {
    try{
    let data = JSON.parse(value)
    if(data['type'] == 'youtube'){
    return new MessageEmbed()
        .setColor('8B31F0')
        .setAuthor('Now Playing','https://cdn.discordapp.com/attachments/707703621239963658/708769574530580530/iconfinder_395_Youtube_logo_4375133.png')
        .setTitle(data['name'])
        .setThumbnail(data['image']);
    }else{
        return new MessageEmbed()
        .setColor('8B31F0')
        .setAuthor('Now Playing','https://img.icons8.com/ios-filled/50/000000/radio-waves.png')
        .setTitle(data['name'])
        .setThumbnail(data['image']);
    }
    }catch(err){
        return new MessageEmbed()
        .setColor('8B31F0')
        .setTitle("You haven't listened anything already");

    }
}
module.exports.loop = async (cache,msg,error_embed) => {
    try { 
        cache.hmget('queue',msg.guild.id, async (err,value) => {
            if(value[0] != "" && value[0] != null){
                cache.hmget('loop',msg.guild.id, async (err,value) => {
                    if(value[0] == "true"){
                        cache.hmset('loop',msg.guild.id,false);
                        await msg.channel.send("**Loop: `Inactive`**"); 
                    }else if(value[0] == "false" || value[0] == null){
                        cache.hmset('loop',msg.guild.id,true);
                        await msg.channel.send("**Loop: `Active`**");
                    }
                })
            }else{
                await msg.channel.send(error_embed);
            }
        });
    }catch(err){
        await msg.channel.send(error_embed);
    }
}
module.exports.loop_playlist = async (cache,msg,error_embed) => {
    try { 
        cache.hmget('queue',msg.guild.id, async (err,value) => {
            if(value[0].split('AAAAA').length == 1){
                await msg.channel.send("Dude this is not a playlist :smile:");
            }else if(value[0] != "" && value[0] != null){
                cache.hmget('loop_playlist',msg.guild.id, async (err,value) => {
                    if(value[0] == "true"){
                        cache.hmset('loop_playlist',msg.guild.id,false);
                        await msg.channel.send("**Loop Playlist : `Inactive`**"); 
                    }else if(value[0] == "false" || value[0] == null){
                        cache.hmset('loop_playlist',msg.guild.id,true);
                        await msg.channel.send("**Loop Playlist : `Active`**");
                    }
                })
            }else{
                await msg.channel.send(error_embed);
            }
        });
    }catch(err){
        await msg.channel.send(error_embed);
    }
}
module.exports.skip = async (msg,cache,error_embed,skip_embed) =>{
    try{
        cache.hmset('state',msg.guild.id,'play');
        cache.hmset('now_playing',msg.guild.id,'');
        try{
           msg.guild.voice.connection.dispatcher.resume();
        }catch(err){}
        setTimeout(async () =>{
            try{
            cache.hmset('loop',msg.guild.id,false);
            msg.guild.voice.connection.dispatcher.end();
            await msg.channel.send(skip_embed);
            }catch(err){
            await msg.channel.send(error_embed);
            }
        },100);
    }catch(err){
        await msg.channel.send(error_embed);
    };
}

module.exports.resume = async (msg,cache,resume_embed,error_embed) => {
    try{
        cache.hmset('state',msg.guild.id,'play')
        msg.guild.voice.connection.dispatcher.resume();
        await msg.channel.send(resume_embed);
    }catch(err){
        await msg.channel.send(error_embed);
    }
}

module.exports.dc = async (msg,cache,bye_embed,sad_embed) => {
    try{
        cache.hmset('queue',msg.guild.id,'');
        cache.hmset('state',msg.guild.id,'');
        cache.hmset('loop',msg.guild.id,false);
        cache.hmset('now_playing',msg.guild.id,'');
        try {
            msg.guild.voice.connection.dispatcher.end();
            setTimeout(() =>{
                try{
                msg.guild.voice.connection.dispatcher.destroy();
                }catch(err){}
                },500);
        } catch {};
        msg.guild.voice.connection.disconnect();
        await msg.channel.send(bye_embed);
    }catch(err){
        await msg.channel.send(sad_embed);
    }
}

module.exports.stop = async  (msg,stop_embed,cache,already_embed) =>{
    try{
        cache.hmset('state',msg.guild.id,'stop');
        cache.hmset('queue',msg.guild.id,'');
        cache.hmset('loop',msg.guild.id,false);
        cache.hmset('now_playing',msg.guild.id,'');
        msg.guild.voice.connection.dispatcher.end();
        await msg.channel.send(stop_embed);
    }catch(err){
        await msg.channel.send(already_embed);
    };
}

module.exports.pause = async (cache,msg,paused_embed,already_embed) =>{
    try{
        cache.hmset('state',msg.guild.id,'stop');
        msg.guild.voice.connection.dispatcher.pause();
        await msg.channel.send(paused_embed);
    }catch(err){
        await msg.channel.send(already_embed);
    };
}

module.exports.deep = (t_countries,msg,cache) =>{
    async function put_deep_data(){
        cache.hmset('buffer',msg.guild.id,'deep');
        let deep_embed = new MessageEmbed()
        .setTitle('Universal Radio Stations')
        .setColor('8B31F0')
        .setThumbnail('https://cdn8.dissolve.com/p/D1307_41_001/D1307_41_001_0004_600.jpg');
        if(msg.guild.id == '264445053596991498'){
            deep_embed.setDescription('**\nSample example : \u200B \u200B `dp?2` \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B For America**\n\nYou can add more radios to your server with donation.');
        }else{
            deep_embed.setDescription('**\nSample example : \u200B \u200B `?2`  \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B  For America**\n\nYou can add more radios to your server with donation.');
        }
        
        t_countries.forEach(element => {
            deep_embed.addField(name = '**'+ (t_countries.indexOf(element)+1).toString() + ')**', value = element, inline = true );
        });
        await msg.channel.send(deep_embed);
        deep_embed = null;
    };
    put_deep_data();
}

module.exports.rythm = async (msg,cache) => {
    
        let embed1 = new MessageEmbed()
            .setTitle('Music Genres')
            .setColor('8B31F0')
            .setThumbnail('https://cdn.discordapp.com/attachments/696846651268268112/697728549578211418/deep_background.png');
        let description_text = "";

        if(msg.guild.id == '264445053596991498'){
            description_text += '**\nSample Example:** \u200B \u200B `dp?5`\u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B For Pop Radio Stations\n\nYou can add more radios to your server with donation.\n\n'
        }else{
            description_text += '**\nSample Example:** \u200B \u200B `?5` \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B For Pop Radio Stations\n\nYou can add more radios to your server with donation.\n\n'
        }
        description_text += "**1)** \u200B Rock\n\n"
        description_text += "**2)** \u200B Rap\n\n"
        description_text += "**3)** \u200B Hip Hop\n\n"
        description_text += "**4)** \u200B Metal\n\n"
        description_text += "**5)** \u200B Pop\n\n"
        description_text += "**6)** \u200B Deep House\n\n"
        description_text += "**7)** \u200B Dance\n\n"
        description_text += "**8)** \u200B Reggae\n\n"
        description_text += "**9)** \u200B K-Pop \u200B \u200B \u200B ***- Premium***\n\n"

        embed1.setDescription(description_text);

        await msg.channel.send(embed1);
        embed1 = null; 
    
        cache.hmset('buffer',msg.guild.id,'rythm');
}

module.exports.help = async (msg) =>{
    let embed10 = new MessageEmbed()
        .setTitle('Commands')
        .setThumbnail('https://cdn.discordapp.com/attachments/664911534480293929/691416658656624660/logo.png')
        .setColor('8B31F0')
    let description_text = "";
    if(msg.guild.id == '264445053596991498'){
        description_text += "**dp?deep**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show countries for radio stations\n\n"
        description_text += "**dp?rythm**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show music genres\n\n"
        description_text += "**dp?join**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Join the voice channel\n\n"
        description_text += "**dp?play number , youtube_search or youtube_url **\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Connect to stream with number , play music from youtube or play playlist from youtube\n\n"
        description_text += "**dp?skip**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B  Skip the song\n\n"
        description_text += "**dp?stop**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Stop the stream \nIf you use that, you cannot use resume to continue, you should use pause for that.\n\n"
        description_text += "**dp?pause**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Pause the stream\n\n"
        description_text += "**dp?resume**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Resume the stream\n\n"
        description_text += "**dp?loop**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Activate or Inactivate loop\n\n"
        description_text += "**dp?loopplaylist**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Activate or Inactivate playlist loop\n\n"
        description_text += "**dp?nowplaying** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show the song that is playing\n\n"
        description_text += "**dp?queue** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show the music queue list\n\n"
        description_text += "**dp?dc**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Disconnect from the server\n\n"
        description_text += "**?support**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Get the support server invite\n\n"
        description_text += "**dp?donate**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Get donation information and link\n\n"
        description_text += "**dp?vote** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can support us with this command\n\n"
        description_text += "**dp?invite** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can invite DEEP to your server\n\n"
        description_text += "**dp?premium** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can purchase premium account\n\n"
        description_text += "**dp?about** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can read the DEEP About page\n\n"
        description_text += "**dp?bug (reason)**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B If you see any bug please report us with this command. (Reason required)\n\n**Sample Example**: \u200B \u200B \u200B dp?bug Bot closed stream when i play this song"
    }else{
        description_text += "**?streamfromurl your_url**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B It's playing external stream links\n\n"
        description_text += "**?deep**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show countries for radio stations\n\n"
        description_text += "**?rythm**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show music genres\n\n"
        description_text += "**?search**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Search radio from internet ***- Premium***\n\n"
        description_text += "**?playsearch radio_number**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Play radio from search results \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B ***- Premium***\n\n"
        description_text += "**?join**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Join the voice channel\n\n"
        description_text += "**?play number , youtube_search or youtube_url **\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Connect to stream with number , play music from youtube or play playlist from youtube\n\n"
        description_text += "**?skip**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B  Skip the song\n\n"
        description_text += "**?stop**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Stop the stream \nIf you use that, you cannot use resume to continue, you should use pause for that.\n\n"
        description_text += "**?pause**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Pause the stream\n\n"
        description_text += "**?resume**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Resume the stream\n\n"
        description_text += "**?loop**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Activate or Inactivate loop\n\n"
        description_text += "**?loopplaylist**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Activate or Inactivate playlist loop\n\n"
        description_text += "**?nowplaying** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show the song that is playing\n\n"
        description_text += "**?queue** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Show the music queue list\n\n"
        description_text += "**?dc**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Disconnect from the server\n\n"
        description_text += "**?setprefixto newprefix**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can change DEEP prefix\n\n"
        description_text += "**?support**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Get the support server invite\n\n"
        description_text += "**?donate**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B Get donation information and link\n\n"
        description_text += "**?vote** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can support us with this command\n\n"
        description_text += "**?invite** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can invite DEEP to your server\n\n"
        description_text += "**?about** \u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B You can read the DEEP About page\n\n"
        description_text += "**?bug (reason)**\u200B \u200B \u200B :arrow_right: \u200B \u200B \u200B If you see any bug please report us with this command. (Reason required)\n\n**Sample Example**: \u200B \u200B \u200B ?bug Bot closed stream when i tried to play this song"
    }
    embed10.setDescription(description_text);
    await msg.channel.send(embed10);
    embed10 = null;
    let embed = new MessageEmbed()
        .setDescription('**If you like DEEP, you can support us by voting [here](https://top.gg/bot/684487629139607573/vote)**')
        .setColor('8B31F0');
    await msg.channel.send(embed);
    embed = null;
}

module.exports.getdata = async (msg,client) => {
    if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
        await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
    }else{
        const special_channel_data = new MessageEmbed()
        .setTitle('DEEP Datas')
        .setColor('8B31F0')
        .setThumbnail('https://cdn.discordapp.com/attachments/664911534480293929/691416658656624660/logo.png');
    guild_l = client.guilds;
    voice_client_list = client.voice.connections;
    let member_v = 0;
    try{
        voice_client_list.forEach(connection =>{ 
            member_v += connection['channel']['members'].keyArray().length - 1
        });
    }catch{

    }
    let member_t = 0;
    guild_l['cache'].forEach(element => {
       if(element['id'] == '264445053596991498'){
          return
       }
       member_t += element.memberCount;
    });
    special_channel_data.addField(name = '**Number of Servers :**', value = '**`'+guild_l['cache'].keyArray().length.toString()+'`**');
    special_channel_data.addField(name = '**Number of Stream Servers :**', value = '**`'+voice_client_list.keyArray().length.toString()+'`**');
    special_channel_data.addField(name = '**Number of Listeners :**', value = '**`'+member_v.toString()+'`**');
    special_channel_data.addField(name = '**Number of Total Potential Customer :**', value = "**`"+member_t.toString()+"`**");
    await msg.channel.send(special_channel_data);
    }
}

