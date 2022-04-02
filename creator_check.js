const fs = require('fs');
const {restart_embed} = require('./embeds');
module.exports.creator = async (prefix,msg,client) => {
    
    let content = msg.content.split(/ +/);
    if(content[0] == '?changeradio'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        try{
            await client.user.setActivity(`?help | ${msg.content.substring(13)}`, {type: 'LISTENING'});
            return 0;
            
        }catch{
            await msg.channel.send(`Yanlış yazdın ${msg.author.username}`);
            return 0;
        }
    }
    }else if(content[0] == prefix+'add'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        let membership = content[2];
        fs.readFile('server-membership.txt','utf-8',function(err,data){
            let json_data = JSON.parse(data);
            let startTime = new Date;
            let endTime = new Date();
            endTime.setMonth(startTime.getMonth() + 1);
            try{
            client.server_membership[membership][content[1]] = {"startTime": `${startTime}`,"endTime": `${endTime}`};
            json_data[membership][content[1]] = {"startTime": `${startTime}`,"endTime": `${endTime}`};
            }catch(err){
                msg.channel.send('Wrong Entry');
                return;
            }
            fs.writeFile('server-membership.txt',JSON.stringify(json_data),function(err){})
            msg.channel.send('Successfully Activated');
        })
    }
        
    }else if(content[0] == prefix+'restart_message'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        client.message_channel.forEach(channel => {
            channel.send(restart_embed);
        });
    }
    }else if(content[0] == prefix+'kick'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        var member = msg.mentions.members.first();
        member.kick().then(()=>{
                        
        })
        }
    
    }else if(content[0] == prefix+'remove'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        let membership = content[2];
        fs.readFile('server-membership.txt','utf-8',function(err,data){
            let json_data = JSON.parse(data);
            let startTime = new Date;
            let endTime = new Date();
            endTime.setMonth(startTime.getMonth() - 1);
            try{
            client.server_membership[membership][content[1]] = {"startTime": `${startTime}`,"endTime": `${endTime}`};
            json_data[membership][content[1]] = {"startTime": `${startTime}`,"endTime": `${endTime}`};
            }catch(err){
                msg.channel.send('Wrong Entry');
                return;
            }
            fs.writeFile('server-membership.txt',JSON.stringify(json_data),function(err){})
            msg.channel.send('Successfully Deactivated');
        })
    }
    }else if(content[0] == prefix+'msg'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        let server = content[1];
        client.channels.cache.get(server).send(content.slice(2).join(' '));
        }
    }else if(content[0] == prefix+'setnicknameA'){
        if(msg.author.username != 'utkuearas' || msg.author.discriminator != '1640'){
            await msg.channel.send('**Sorry for that but you are not authorized to do this :tired_face:**');
            return 0;
        }else{
        let id = content[1];
        msg.guild.members.cache.get(id).setNickname(content.slice(2).join(' '));
        }
    }
}