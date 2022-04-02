module.exports.control_message = (msg,prefix) => {
    
    if(msg.guild.id == '264445053596991498' && msg.content.toLowerCase().startsWith('dp?')){

        switch(msg.content.split(/ +/)[0].toLowerCase()) {

        case "dp?p":
            if(msg.content.toLowerCase().split(/ +/)[1] == null){
                var command = "play";
                break;
            }else{
                var command = "play " + msg.content.split(/ +/).slice(1).join(" ");
                break;
            }
        case "dp?s":
            if(msg.content.toLowerCase() == "dp?s"){
                var command = "skip";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }
        case "dp?np":
            if(msg.content.toLowerCase() == "dp?np"){
                var command = "nowplaying";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }
        case "dp?q":
            if(msg.content.toLowerCase() == "dp?q"){
                var command = "queue";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }
        case "dp?l":
            if(msg.content.toLowerCase() == "dp?l"){
                var command = "loop";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }
        case "dp?d":
            if(msg.content.toLowerCase() == "dp?d"){
                var command = "deep";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }
        case "dp?r":
            if(msg.content.toLowerCase() == "dp?r"){
                var command = "rythm";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(3);
                break;
            }

        default :
            var command = msg.content.toLowerCase().substring(3);
        }
        
    }else if(!msg.content.startsWith(prefix) || msg.author.bot){

        return "14532";

    }else if(msg.guild.id != '264445053596991498'){ 

        switch(msg.content.split(/ +/)[0].toLowerCase()) {

            case prefix+"p":
                if(msg.content.toLowerCase().split(/ +/)[1] == null){
                    var command = "play";
                    break;
                }else{
                    var command = "play " + msg.content.split(/ +/).slice(1).join(" ")
                    break;
                }
            case prefix+"s":
                if(msg.content.toLowerCase() == prefix+"s"){
                    var command = "skip";
                    break;
                }else{
                    var command = msg.content.toLowerCase().substring(prefix.length);
                    break;
                }
            case prefix+"np":
                if(msg.content.toLowerCase() == prefix+"np"){
                    var command = "nowplaying";
                    break;
                }else{
                    var command = msg.content.toLowerCase().substring(prefix.length);
                    break;
                }
            case prefix+"q":
                if(msg.content.toLowerCase() == prefix+"q"){
                    var command = "queue";
                    break;
                }else{
                    var command = msg.content.toLowerCase().substring(prefix.length);
                    break;
                }
            case prefix+"l":
                if(msg.content.toLowerCase() == prefix+"l"){
                   var command = "loop";
                   break;
                }else{
                   var command = msg.content.toLowerCase().substring(prefix.length);
                   break;
                }
            case prefix+"d":
            if(msg.content.toLowerCase() == prefix+"d"){
                var command = "deep";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(prefix.length);
                break;
            }
            case prefix+"r":
            if(msg.content.toLowerCase() == prefix+"r"){
                var command = "rythm";
                break;
            }else{
                var command = msg.content.toLowerCase().substring(prefix.length);
                break;
            }
            default :
                var command = msg.content.toLowerCase().substring(prefix.length);
                break;
            }
    }else{
        return "14532";
    }
    return command;
}