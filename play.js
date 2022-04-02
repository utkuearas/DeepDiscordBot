const {error_joinable_embed,play_embed} = require('./embeds')
const ytdl = require('ytdl-core');
const {get_data,delete_element} = require('./redis_func')
const newYtdl = require('discord-ytdl-core')

const play_only = async (url,connection,msg,cache) =>{



    connection.play(ytdl(url,{quality: 'highestaudio', filter: 'audioonly', dlChunkSize: 0}),{volume: false , bitrate: 'auto'})
    //connection.play(stream, {volume: false,type: 'opus',bitrate: 'auto', highWaterMark: 1})

        .on('finish',() =>{

            get_data(cache,msg.guild.id,'state').then(state =>{

                if(state != 'stop'){

                    get_data(cache,msg.guild.id,'loop').then(value => {

                        if(value == "true"){ play_only(url,connection,msg,cache)
                        }else{

                            get_data(cache,msg.guild.id,'loop_playlist').then(loop_playlist => {

                                if(loop_playlist == "true"){

                                    get_data(cache,msg.guild.id,'queue').then(loop_playlist_value =>{

                                        let data = JSON.parse(loop_playlist_value.split('AAAAA').slice(1)[0]);
                                        play(data['name'], data['url'], data['thumbnail'], data['time'],msg,cache);
                                        cache.hmset('queue',msg.guild.id,loop_playlist_value.split('AAAAA').slice(1).join('AAAAA')+"AAAAA"+loop_playlist_value.split('AAAAA')[0]);

                                    })

                                }else{

                                    delete_element(cache,msg.guild.id,'queue').then(v => {

                                        if(v[0].length != 0){

                                            let data = JSON.parse(v[0])
                                            play(data['name'], data['url'], data['thumbnail'], data['time'],msg,cache);
                                            data = null;           

                                        }
                                    });
                                }
                            })
                        }
                    });
                };
            });
        })
        
        .on('error',() =>{
            
            play_only(url,connection,msg,cache);

        });
}

const play = (name,url,thumbnail,time,msg,cache) => {

    cache.hmset('state',msg.guild.id,'play');
    cache.hmset('now_playing',msg.guild.id,`{"name": "${name}" , "image": "${thumbnail}","type":"youtube"}`);

    if(isNaN(msg.guild.voice) || msg.guild.voice.connection == null){

        if(msg.member.voice.channel.joinable == false) return msg.channel.send(error_joinable_embed) 

        msg.member.voice.channel.join().then(connection =>{

            connection.on('disconnect', () => {

                cache.hmset('queue',msg.guild.id,'');
                cache.hmset('loop',msg.guild.id,false);
                cache.hmset('loop_playlist',msg.guild.id,false);
                cache.hmset('now_playing',msg.guild.id,'');
                cache.hmset('state',msg.guild.id,'');

            });

            play_only(url,connection,msg,cache);

            play_embed.setTitle(name);
            play_embed.setThumbnail(thumbnail);

            if(time == ""){ play_embed.setDescription('')
            }else{ play_embed.setDescription('Duration: '+time) }

            return msg.channel.send(play_embed);
        });

    } else {

        play_only(url,msg.guild.voice.connection,msg,cache);

        play_embed.setTitle(name);
        play_embed.setThumbnail(thumbnail);

        if(time == ""){ play_embed.setDescription('')
        }else{ play_embed.setDescription('Duration: '+time) }
         
        return msg.channel.send(play_embed)
    }
}

module.exports.play = play;
