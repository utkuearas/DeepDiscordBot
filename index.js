const {Client, MessageEmbed} = require('discord.js');
const ypi = require('ytfps');
const fs = require('fs');
const jsdom = require('jsdom'),
{JSDOM} = jsdom;
const {rythm_radios} = require('./rythm_radios');
global.Promise = require('bluebird');
const {loop_playlist,now_playing_embed,loop,skip,resume,dc,stop,pause,deep,rythm,help,getdata} = require('./commands');
const {hours_embed,sorry_premium_embed,search_embed,about_embed,queue_empty_embed,queue_embed,error_joinable_embed,high_cpu_embed,donate_embed,error_embed,stop_embed,error_join_embed,bye_embed,sad_embed,paused_embed,already_embed,play_error_embed,resume_embed,skip_embed,error_same_embed,stream_embed,info_embed} = require('./embeds');
const redis = require('redis');
const { control_message } = require('./message_control');
const {get_data,add_element} = require('./redis_func');
const {play} = require('./play')
const {schedule} = require('./schedule');
const {mention} = require('./mention');
const {creator} = require('./creator_check')
const {play_search_v,search_v} = require('./premium_commands');
const {premium_radios} = require('./premium_radios');
const {free_radios,countries,t_countries,country_geo,category} = require('./free_radios');
const axios = require('axios');
const yts = require('yt-search');

const DBL = require("dblapi.js");
const client = new Client();
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDQ4NzYyOTEzOTYwNzU3MyIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk0OTY3NzQ4fQ.hrFzA7aoIoY4o2J94NXFIS0sjJ8LdKfSqpQq1hgL7Hw',client);
const TOKEN = "Njg0NDg3NjI5MTM5NjA3NTcz.XrcgVA.KTfqRW5ZLBL4PoPE30tjHfmNDFg";   //real
//const TOKEN = "NjMyNjIzNTA0NjUwNTM0OTE0.XreqBw.qT7eFCRfVZVFiYcgwc2kv-MPTDI";
const PREFIX = "?";

const totalRadio = premium_radios.length + free_radios.length + rythm_radios.length


const cache = redis.createClient();

client.schedule = {};
client.prefix = fs.readFileSync('prefix.txt','utf-8',function(err,data) {
    if(err){
        console.log(err);
    }
    return data;
})

client.prefix = JSON.parse(client.prefix);
client.search_buffer = {};
client.message_channel = [];


client.server_membership;
fs.readFile('server-membership.txt','utf-8',function(err,data){
    if(err) console.log(err);
    client.server_membership = JSON.parse(data);
})


client.on('message', msg =>{
    prefix = client.prefix[msg.guild.id];
    if(prefix == undefined) prefix = PREFIX;

    if(mention(msg) == 0){return};

    var command = control_message(msg,prefix);

    if(command == 'k'){
        
        command = 'play ride it mr';
        msg.content = '?play https://www.youtube.com/watch?v=Qzxo6AnNQ-o';
    }

    if(command == "14532") return;

    console.log(command);

    if(msg.content.split(/ +/)[0] == "?setnickname"){
        msg.member.setNickname(msg.content.split(/ +/).slice(1).join(' '));
    }
    
    if(client.schedule[msg.guild.id] != 0){schedule(msg,client);}

    if(creator(prefix,msg,client) == 0) return;
    
    if(command.slice(0,3) == "bug") {
        let content = msg.content.split(/ +/).slice(1).join(' ');
        return client.channels.fetch('704455864609931395').then( channel => {
            channel.send(content + " <@353986240191791106>");
            msg.channel.send("**Your message sent successfully**");
      });
    }
    if(msg.content.split(/ +/)[0].substring(prefix.length) == 'setprefixto'){
        client.prefix[msg.guild.id] = msg.content.split(/ +/)[1];
        let data = fs.readFileSync('prefix.txt','utf-8',function(err,data){
            if(err) return console.log(err);
            return data;
        });

        obj_data = JSON.parse(data);
        obj_data[msg.guild.id] = msg.content.split(/ +/)[1];

        fs.writeFileSync('prefix.txt',JSON.stringify(obj_data),function(err) {

            if(err) console.log(err)

        });

        msg.channel.send('Successfully changed prefix');
    }


    if(msg.content.substring(prefix.length).split(/ +/)[0].toLowerCase() == "playsearch"){

        if(client.search_buffer[msg.guild.id] == undefined || client.search_buffer[msg.guild.id] == []) return console.log(1);

        return play_search_v(client,msg,stream_embed,error_joinable_embed,cache);
    }
    
    if(msg.content.substring(prefix.length).split(/ +/)[0].toLowerCase() == 'search' && client.server_membership['search'][msg.guild.id] != undefined && new Date(client.server_membership['search'][msg.guild.id]['endTime']) > new Date()){
        return search_v(msg,client,search_embed);

    }else if(msg.content.substring(prefix.length).split(/ +/)[0].toLowerCase() == 'search'){
        return msg.channel.send(sorry_premium_embed);
    }

    if(client.message_channel.indexOf(msg.channel) == -1)client.message_channel.push(msg.channel);

    switch (command){
        case "reset":

            msg.channel.send('Successfully cleaned all the cache.')
            cache.hmset('loop',msg.guild.id,false);
            cache.hmset('loop_playlist',msg.guild.id,false);
            cache.hmset('queue',msg.guild.id,'');
            cache.hmset('state',msg.guild.id,'');
            cache.hmset('now_playing',msg.guild.id,'');
            cache.hmset('buffer',msg.guild.id,'');
            return;

        case "queue":

            get_data(cache,msg.guild.id,'queue').then(value => {
                let description_text = "";
                let pages = [];
                if(value == null) return(false)

                value_list = value.split('AAAAA');
                if(value_list[0] == '') return(false)
                
                let index = 1
                value_list.forEach(element => {

                    if(index == 1){index++; return description_text += `**Now Playing :** \u200B \u200B ${JSON.parse(element)['name']}\n\n`}

                    description_text += `**${index})** \u200B \u200B ${JSON.parse(element)['name']}\n\n`
                    index += 1

                })

                let point = 0;
                while(point < description_text.length){

                    let text_point = description_text.substring(point,point + 2048).split('\n\n').slice(0,description_text.substring(point,point + 2048).split('\n\n').length - 1).join('\n\n')+'\n\n';
                    pages.push(text_point);
                    point += text_point.length;

                }

                queue_embed.setDescription(pages[0]);
                queue_embed.setFooter('Page : 1')
                return pages;

            }).then( (pages) => {

                if(pages != []){

                    msg.channel.send(queue_embed).then(msg_r =>{

                        msg_r.react('⬅️');
                        msg_r.react('➡️');
                    
                        const forward_f = (reaction,user) => reaction.emoji.name == '➡️' && user.bot != true;
                        const back_f = (reaction,user) => reaction.emoji.name == '⬅️' && user.bot != true;

                        const back = msg_r.createReactionCollector(back_f, {time : 600000});
                        const forward = msg_r.createReactionCollector(forward_f, {time : 600000});
                    
                        let page = 0;
                        back.on('collect', (r,user) => {
                            if(page == 0) {r.users.remove(user); return;}
                            page--;
                            queue_embed.setDescription(pages[page]);
                            queue_embed.setFooter('Page : '+ (page+1).toString())
                            msg_r.edit(queue_embed);
                            r.users.remove(user);
                        });

                        forward.on('collect', (r,user) => {

                            if(page == pages.length - 1) {r.users.remove(user); return;}

                            page++;
                            queue_embed.setDescription(pages[page]);
                            queue_embed.setFooter('Page : '+ (page+1).toString())
                            msg_r.edit(queue_embed);
                            r.users.remove(user);

                        })
                    })
                }else{
                    msg.channel.send(queue_empty_embed);
                }
            });
            return;

        case "premium":

            return msg.channel.send('https://www.patreon.com/deepbot');

        case "vip":

            return msg.channel.send('https://www.patreon.com/deepbot');

        case "invite":

            return msg.channel.send('https://discord.com/oauth2/authorize?client_id=684487629139607573&scope=bot&permissions=8');
            
        case "nowplaying":

            return get_data(cache,msg.guild.id,'now_playing').then( value => msg.channel.send(now_playing_embed(value)));

        case "vote":

            return msg.channel.send('https://top.gg/bot/684487629139607573/vote');
            
        case "donate":

            return msg.channel.send(donate_embed);
            
        case "loopplaylist":

            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return loop_playlist(cache,msg,error_embed);
            
        case "loop":
            
            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return loop(cache,msg,error_embed);

        case 'skip':
            
            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return skip(msg,cache,error_embed,skip_embed);
            
        case 'resume':
            
            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return resume(msg,cache,resume_embed,error_embed);
            
        case 'dc':

            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return dc(msg,cache,bye_embed,sad_embed);
            
        case 'stop':

            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return stop(msg,stop_embed,cache,already_embed);

        case 'join':

            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            if(msg.member.voice.channel.joinable == false) return msg.channel.send(error_joinable_embed)
            
            if(!isNaN(msg.guild.voice) && msg.guild.voice.connection != null) return msg.channel.send("I'm already connected to the voice channel.")
            
            return msg.member.voice.channel.join().then( connection =>{

                msg.channel.send(`Joined the **${msg.member.voice.channel.name}** channel`)

                connection.on('disconnect', () => {

                    cache.hmset('queue',msg.guild.id,'');
                    cache.hmset('loop_playlist',msg.guild.id,false);
                    cache.hmset('loop',msg.guild.id,false);
                    cache.hmset('now_playing',msg.guild.id,'');
                    cache.hmset('state',msg.guild.id,'');
                })
            })

            
        case 'pause': 
            
            if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed);
            }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id)return msg.channel.send(error_same_embed)
            
            return pause(cache,msg,paused_embed,already_embed);

        case 'support':

            return msg.channel.send("https://discord.gg/mMSdWsy");

        case 'deep':

            return deep(t_countries,msg,cache);
            
        case 'rythm':

            return rythm(msg,cache);
            
        case 'help':

            return help(msg);
            
        case 'getdata':

            return getdata(msg,client);  
            
        case 'about':

            return msg.channel.send(about_embed);
        
    };

    if(command.split(/ +/)[0] == 'streamfromurl' && command.split(/ +/).length == 2){

        stream_embed.setTitle("Stream playing from url");

        let stream_url = command.split(/ +/)[1];

        if(isNaN(msg.guild.voice) || msg.guild.voice.connection == null){
            if(msg.member.voice.channel.joinable == false) return msg.channel.send(error_joinable_embed)
                
            msg.member.voice.channel.join().then( connection =>{

                connection.on('disconnect', () => {

                        cache.hmset('queue',msg.guild.id,'');
                        cache.hmset('loop_playlist',msg.guild.id,false);
                        cache.hmset('loop',msg.guild.id,false);
                        cache.hmset('now_playing',msg.guild.id,'');
                        cache.hmset('state',msg.guild.id,'');

                    })

                connection.play(stream_url, {volume: false,bitrate: 'auto'});

                msg.channel.send(stream_embed);

                cache.hmset('now_playing',msg.guild.id,`{"name":"Stream playing from url","image":"None","type":"radio"}`);

            })
        } else {

            msg.guild.voice.connection.play(stream_url, {volume: false, bitrate: 'auto'});
            msg.channel.send(stream_embed);
            cache.hmset('now_playing',msg.guild.id,`{"name":"Stream playing from url","image":"None","type":"radio"}`);
        }

        return 0;

    }
    
    if(command.split(' ')[0] == 'play' && command.split(/ +/).length > 1){

        if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed)
        }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id) return msg.channel.send(error_same_embed)
        
        if(command.split(/ +/).length == 2 && !isNaN(parseInt(command.split(/ +/)[1]))){

            let number = parseInt(command.split(/ +/)[1]);
            const key = msg.guild.id;

            if(number > 291 || number < 1) return msg.channel.send(error_embed)

            if(number <= free_radios.length){

                var stream_url = free_radios[number - 1]['url'];
                var thumbnail = free_radios[number - 1]['thumbnail']
                var name = free_radios[number - 1]['name'].split(/ +/).slice(2).join(' ');

            }else if(number > free_radios.length &&  number <= premium_radios.length + free_radios.length){

                if(client.server_membership['country'][msg.guild.id] == undefined || new Date(client.server_membership['country'][msg.guild.id]['endTime']) < new Date()){

                    return msg.channel.send(sorry_premium_embed);
                        
                }else{

                    var stream_url = premium_radios[number - 1 - free_radios.length]['url']
                    var thumbnail = premium_radios[number - 1 -free_radios.length]['thumbnail']
                    var name = premium_radios[number - 1 -free_radios.length]['name'].split(/ +/).slice(2).join(' ');

                }

            }else{

                number -= free_radios.length + premium_radios.length + 1;

                if(number >= 80 && (client.server_membership['rythm'][msg.guild.id] == undefined || new Date(client.server_membership['rythm'][msg.guild.id]['endTime']) < new Date())){

                    return msg.channel.send(sorry_premium_embed)
                }

                if(parseInt((number + 1) / 5) % 2 != 0 && (client.server_membership['rythm'][msg.guild.id] == undefined || new Date(client.server_membership['rythm'][msg.guild.id]['endTime']) < new Date())){

                    return msg.channel.send(sorry_premium_embed)

                }else{

                    var thumbnail = rythm_radios[parseInt(number / 10)][number - (parseInt(number / 10) * 10)]['logo'];
                    var stream_url = rythm_radios[parseInt(number / 10)][number - (parseInt(number / 10) * 10)]['url'];
                    var name = rythm_radios[parseInt(number / 10)][number - (parseInt(number / 10) * 10)]['name'];

                }

            };

            stream_embed.setTitle(name);
            client.user.setActivity('?help | '+name,{type: 'LISTENING'});
            stream_embed.setThumbnail(thumbnail);

            cache.hmset('loop',msg.guild.id,false);
            cache.hmset('loop_playlist',msg.guild.id,false);
            cache.hmset('queue',key,'');

            try {msg.guild.voice.connection.dispatcher.end()} catch {};

            if(isNaN(msg.guild.voice) || msg.guild.voice.connection == null){
                if(msg.member.voice.channel.joinable == false) return msg.channel.send(error_joinable_embed)
                    
                msg.member.voice.channel.join().then( connection =>{

                    connection.on('disconnect', () => {

                            cache.hmset('queue',msg.guild.id,'');
                            cache.hmset('loop_playlist',msg.guild.id,false);
                            cache.hmset('loop',msg.guild.id,false);
                            cache.hmset('now_playing',msg.guild.id,'');
                            cache.hmset('state',msg.guild.id,'');

                        })

                    connection.play(stream_url, {volume: false,bitrate: 'auto'});

                    msg.channel.send(stream_embed);

                    cache.hmset('now_playing',msg.guild.id,`{"name":"${name}","image":"${thumbnail}","type":"radio"}`);

                })
            } else {

                msg.guild.voice.connection.play(stream_url, {volume: false, bitrate: 'auto'});
                msg.channel.send(stream_embed);
                cache.hmset('now_playing',msg.guild.id,`{"name":"${name}","image":"${thumbnail}","type":"radio"}`);

            }
                
        } else if(parseInt(command.split(/ +/).slice(1).join(' ')).toString().length != command.split(/ +/).slice(1).join(' ') && command.split(/ +/).length > 1){

            if(msg.content.split(/ +/)[1].toLowerCase().indexOf('list=') != -1 && msg.content.split(/ +/)[1].toLowerCase().indexOf('youtube.com') != -1){

                if(msg.member.voice.channel == null){return msg.channel.send(error_join_embed)
                }else if(msg.guild.voice != undefined && msg.member.voice != undefined && msg.guild.voice.connection != undefined && msg.guild.voice.connection.channel.id != msg.member.voice.channel.id) return msg.channel.send(error_same_embed)

                let input_url = msg.content.split(/ +/)[1];
                let playlist_id = input_url.split('list=')[1];
                let playlist_url_format = "https://www.youtube.com/playlist?list=" + playlist_id;


                ypi(playlist_id).then(items => {

                    if(input_url.indexOf('start_radio') != -1) msg.channel.send('This is Youtube Mix url and Youtube mix varies individually but I can play my Youtube Mix.')
                    
                    let queue = ""
                    let index = 0;
                    let first = true;

                    items.videos.forEach(item => {

                        if(item.title == "Private video") return index++

                        index++

                        let title = item.title;
                        if(title.search('"') != -1) title = title.split('"').join("'")

                        let thumbnail = item.thumbnail_url;
                        let url = "https://www.youtube.com/watch?v=" + item.id;

                        if(first == true){

                            first = false

                            info_embed.setTitle(items.videos.length.toString() + ' Songs Added to Queue')
                            info_embed.setThumbnail(thumbnail);
                            msg.channel.send(info_embed);

                            get_data(cache,msg.guild.id,'queue').then(queue_list =>{

                                if (queue_list == null || (queue_list == "")) {

                                    try {msg.guild.voice.connection.dispatcher.end() }catch { }

                                    return play(title, url, thumbnail, "", msg, cache)

                                }
                            })
                        }

                        if(index == items.length){ queue += `{"name": "${title}", "url": "${url}", "thumbnail": "${thumbnail}", "time": ""}`
                        }else{ queue += `{"name": "${title}", "url": "${url}", "thumbnail": "${thumbnail}", "time": ""}AAAAA` }
                        
                    })

                    if(queue.substring(queue.length - 5,queue.length) == "AAAAA") queue = queue.substring(0,queue.length-5) 

                    return add_element(cache,msg.guild.id,'queue',queue)

                })

            }else{

                yts(msg.content.split(/ +/).slice(1).join(' ') , function(err,res){

                    if(err) return msg.channel.send(error_embed)

                    if(res.videos.length == 0) return msg.channel.send("We searched everywhere but couldn't find anything like this on youtube")

                    const video = res.videos[0];

                    if(video.seconds == 0 && (client.server_membership['youtube'][msg.guild.id] == undefined || new Date(client.server_membership['youtube'][msg.guild.id]['endTime']) < new Date())) {

                        msg.channel.send(high_cpu_embed);
                        return msg.channel.send(sorry_premium_embed)

                    }

                    if(video.seconds > 14400 && (client.server_membership['youtube'][msg.guild.id] == undefined || new Date(client.server_membership['youtube'][msg.guild.id]['endTime']) < new Date())) {

                        msg.channel.send(hours_embed);
                        return msg.channel.send(sorry_premium_embed)
                        
                    }

                    return get_data(cache, msg.guild.id, 'queue').then(value => {

                        if (value == null || value.length == 0) {
                            try { msg.guild.voice.connection.dispatcher.end() } catch {}

                            
                            if(video.seconds == 0){ 
                                const time = "**Live**" 
                                play(video.title,video.url,"http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg",time, msg, cache);
                            }else {
                                const time = video.timestamp
                                play(video.title,video.url,"http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg",time, msg, cache);
                            }

                            let title = video.title;

                            if(title.search('"') != -1) title = title.split('"').join("'")                
                        
                            return add_element(cache,msg.guild.id,'queue',`{"name": "${title}", "url": "${video.url}", "thumbnail": "${"http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg"}", "time": "${video.timestamp}"}`);
                        
                        }else {

                            let title = video.title;

                            if(title.search('"') != -1) title = title.split('"').join("'")
                            
                            
                            if(video.seconds == 0){ 
                                const time = "**Live**" 
                                add_element(cache,msg.guild.id,'queue',`{"name": "${title}", "url": "${video.url}", "thumbnail": "${"http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg"}", "time": "${time}"}`);
                            }else {
                                const time = video.timestamp
                                add_element(cache,msg.guild.id,'queue',`{"name": "${title}", "url": "${video.url}", "thumbnail": "${"http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg"}", "time": "${time}"}`);
                            }
                        
                            info_embed.setTitle(title);
                            info_embed.setThumbnail("http://i.ytimg.com/vi/"+video.videoId+"/mqdefault.jpg");
                            return msg.channel.send(info_embed);

                        }
                    })



                })
            }
        }
    }
    if(command.split(/ +/).length == 1 && isNaN(parseInt(command)) != true) {

        return get_data(cache,msg.guild.id,'buffer').then( buffer => {

            if(buffer == 'deep' && command.split(' ')[0] != 'play' ){

                try{

                    const number = parseInt(command);

                    if(number > 20 || number < 1 || isNaN(number) == true) return msg.channel.send(error_embed)

                    let embed11 = new MessageEmbed()
                        .setTitle(t_countries[number - 1]+ ' Radios')
                        .setColor('8B31F0')
                        .setThumbnail(country_geo[number - 1]);

                    let description_text = ""

                    if(msg.guild.id == '264445053596991498'){ description_text += '\nYou can connect to radio stations with numbers written in front of the radio names.\n\n**Sample Example**: \u200B \u200B `dp?play 153` \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B This is for 153th Radio, I advice :thumbsup: \n\nYou can listen to more radio by purchasing membership.\n\n'
                    }else{ description_text += '\nYou can connect to radio stations with numbers written in front of the radio names.\n\n**Sample Example**: \u200B \u200B `?play 153` \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B  This is for 153th Radio, I advice :thumbsup: \n\nYou can listen to more radio by purchasing membership.\n\n' }
                    
                    free_radios.forEach(radio =>{

                        if(radio['trackingURL'].split('/')[2] != countries[number -1]){}else{ description_text += `**${free_radios.indexOf(radio) + 1})** ${radio['name'].split(/ +/).slice(2).join(' ')}\n\n` }

                    });

                    premium_radios.forEach(radio =>{
                        if(radio['trackingURL'].split('/')[2] != countries[number -1]){}else{ description_text += `**${premium_radios.indexOf(radio) + 1 + free_radios.length})** ${radio['name'].split(/ +/).slice(2).join(' ')} \u200B \u200B \u200B \u200B \u200B \u200B ***- Premium***\n\n` }; 
                    });

                    embed11.setDescription(description_text);
                    msg.channel.send(embed11);

                }catch(err){

                    console.log(err);

                    if(msg.guild.id == '264445053596991498') return 

                    return msg.channel.send(error_embed);
                    
                };

            }else if(buffer == 'rythm' && command.split(' ')[0] != 'play'){

                try{
                    
                    const number = parseInt(command) - 1;

                    if(number > 8 || number < 0 || isNaN(number) == true) return msg.channel.send(error_embed)

                    var embed12 = new MessageEmbed()
                        .setTitle(category().genres_s[number])
                        .setColor('8B31F0')
                        .setThumbnail(category().genres[number]);

                    let description_text = "";
                    if(msg.guild.id == '264445053596991498'){ description_text += '\nYou can connect to radio stations with numbers written in front of the radio names.\n\n**Sample Example** : \u200B \u200B `dp?play 205` \u200B \u200B \u200B  :arrow_left: \u200B \u200B \u200B  This is for 205th Radio, I advice :thumbsup:\n\nYou can add more radios to your server with donation.\n\n'
                    }else{ description_text += '\nYou can connect to radio stations with numbers written in front of the radio names.\n\n**Sample Example** : \u200B \u200B `?play 205` \u200B \u200B \u200B  :arrow_left: \u200B \u200B \u200B This is for 205th Radio, I advice :thumbsup:\n\nYou can add more radios to your server with donation.\n\n' }
                    
                    let index = 1;
                    let place = premium_radios.length + free_radios.length + 1 + rythm_radios.indexOf(rythm_radios[number]) * 10;

                    rythm_radios[number].forEach(radio => {

                        if(index > 5 && number != 8){

                            description_text += `**${place})** ${radio['name']} \u200B \u200B \u200B \u200B ***- Premium***\n\n`;
                            index++;
                            place++;

                        }else{

                            description_text += `**${place})** ${radio['name']}\n\n`;
                            index++;
                            place++;

                        }
                    })

                    embed12.setDescription(description_text);
                    return msg.channel.send(embed12);
                    
                }catch(err){

                    console.log(err);

                    if(msg.guild.id == '264445053596991498') return 

                    return msg.channel.send(error_embed);
                    
                };
            }
        });
    }

    if(command.split(/ +/).length == 1 && command.split(/ +/) == 'play') return msg.channel.send(play_error_embed)

});          

function sleep(number) { return new Promise(resolve =>{setTimeout(resolve, number)}) }

async function auto_disconnect(){

    const channels = client.voice.connections;
    channels.forEach( connection =>{

        if(connection['channel']['members'].keyArray().length == 1){

            let key = connection.channel.guild.id;
            cache.hmset('loop_playlist',key,false);
            cache.hmset('loop',key,false);
            cache.hmset('queue',key,'');
            cache.hmset('state',key,'');
            cache.hmset('now_playing',key,'');
            key = null;

            if(connection.dispatcher){

                connection.dispatcher.end();
                connection.dispatcher.destroy();

            }

            connection['channel']['guild'].voice.connection.disconnect();

        };
    });

    await sleep(60000).then(() => auto_disconnect());

};

async function  getServersDatas(client){
    var object = {};
    const servers = client.guilds['cache'];
    servers.forEach(element =>{
        object[element['name']] = element['id'];
    });
    let data = JSON.stringify(object);

    fs.writeFileSync('servers.txt',data,function(err){
        if(err){
            console.log(err);
        }
    })

    await sleep(600000).then(() => getServersDatas());
    
}

client.on('ready', () =>{

    client.user.setActivity('?help | Power FM',{type: 'LISTENING'});
    auto_disconnect();
    getServersDatas(client);

});

client.login(TOKEN);
