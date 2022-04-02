module.exports.mention = (msg) => {
    if(msg.guild.id == '264445053596991498' && msg.mentions.members.find(object => object.id == '684487629139607573') != undefined){

        return msg.channel.send('My prefix is `dp?` in this server, say `dp?help` for help. My original prefix is `?` but you should use `dp?` instead of `?` in this server')

    }else if(msg.mentions.members.find(object => object.id == '684487629139607573') != undefined){

        return 0;

    }else {

        return 1;
        
    }
}