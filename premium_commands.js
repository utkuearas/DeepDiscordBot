const axios = require('axios')
const {parse} = require('node-html-parser');
const { error_embed } = require("./embeds")

module.exports.play_search_v = (client,msg,stream_embed,error_joinable_embed,cache) => {

    let number = parseInt(msg.content.split(/ +/)[1])

    if(number > 7 || number < 1) return msg.channel.send(error_embed)

    let radio = client.search_buffer[msg.guild.id][number - 1]

    if(radio == undefined) return msg.channel.send(error_embed)

    stream_embed.setTitle(radio[0]+' - '+radio[1]);
    stream_embed.setThumbnail("https://"+radio[2]);
    cache.hmset('queue',msg.guild.id,'');

    if(isNaN(msg.guild.voice) || msg.guild.voice.connection == null){

        if(msg.member.voice.channel.joinable == false) return msg.channel.send(error_joinable_embed)

        msg.member.voice.channel.join().then( connection =>{

            connection.on('disconnect', () => {

                cache.hmset('now_playing',msg.guild.id,'');

            });

            connection.play(radio[3], {volume: false,bitrate: 'auto'});
            msg.channel.send(stream_embed);
            cache.hmset('now_playing',msg.guild.id,`{"name":"${radio[0]+' - '+radio[1]}","image":"${'https://'+radio[2]}","type":"radio"}`);

        })
    } else {

        msg.guild.voice.connection.play(radio[3], {volume: false, bitrate: 'auto'});
        msg.channel.send(stream_embed);
        cache.hmset('now_playing',msg.guild.id,`{"name":"${radio[0]+' - '+radio[1]}","image":"${'https://'+radio[2]}","type":"radio"}`);

    }
}

module.exports.search_v = (msg,client,search_embed) => {

    const vip_search_link = "https://onlineradiobox.com/search?q=";
    let search = msg.content.substring(prefix.length+7);
    let search_url = vip_search_link + encodeURIComponent(search);

    return new Promise(resolve => {

        axios.get(search_url).then(response =>{

            resolve(response.data);

        })

    }).then(data => {

        var liste = [];
        let count = 0;

        if(parse(data).querySelectorAll('li.stations__station').length == 0) {

            msg.channel.send("We searched everywhere but couldn't find anything like this on youtube")
            return []

        }

        parse(data).querySelectorAll('li.stations__station').forEach(element => {

            count += 1;
            if(count > 7) return

            let country = element.querySelector('a.i-flag').getAttribute('title');
            let stream = element.querySelector('button.b-play.station_play').getAttribute('stream');
            let title = element.querySelector('img.station__title__logo').getAttribute('title'); 
            let img = element.querySelector('img.station__title__logo').getAttribute('src').substring(2);
            liste.push([title,country,img,stream]);

        })

        return liste;

    }).then(liste => {

        if(liste.length == 0) return

        client.search_buffer[msg.guild.id] = liste;
        let description_text = "**Sample Example**: \u200B \u200B `?playsearch 1` \u200B \u200B \u200B :arrow_left: \u200B \u200B \u200B This is for 1st Radio in the list\n\n"

        liste.forEach(element => {
            description_text +=  "**" + (liste.indexOf(element)+1).toString() + ")** "+ element[0] + "\n" + element[1] + "\n\n"; 
        })
            
        search_embed.setDescription(description_text);
        msg.channel.send(search_embed);

    })

}