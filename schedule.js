
const {MessageEmbed} = require('discord.js')

module.exports.schedule = (msg,client) =>{
    /*
    description_text = "**K-Pop Music Genre Added**\n\n• Now K-Pop is available for rythm premium members. \n\n\n\n• Some bugs have been solved\n\n• Youtube problem has been solved";
    */
    /*
    description_text += "• `?support` \u200B \u200B :arrow_right: \u200B \u200B Get support server invite\n\n• Finally we added `?join` command, we know that is too late, we are really sorry.\n\n\n"
    description_text += "**We Have a Very Good New**\n\nFrom now on, DEEP is in its most stable state. Music enjoyment is waiting for you for a long time.";
    //description_text += "**We added new memberships :**\n\n";
    //description_text += "**Youtube Premium:**\n\n• Youtube Live Video Access\n• Video playback support longer than 4 hours\n• Premium Role in DEEP Official Server\n\n**Country Premium:**\n\n• Additional 100 premium radios in country page\n• Premium Role in DEEP Official Server\n\n**Rythm Premium :**\n\n• Additional 40 premium radios in Rythm Page\n• Premium Role in DEEP Official Server\n\n**Vip Radio:**\n\n• Additional 100 premium radios in country\n• Additional 40 premium radios in Rythm Page\n• Radio search feature from 100000 radio\n• VIP Role in DEEP Official Server"
    
    description_text += "**Radio Updates:**\n\n"
    description_text += "Power R&P Hip Hop was taken down, so we put another radio in the hip hop section.\n\n"
    description_text += "181.Fm - The Beat (R&B Hip Hop)"
    
    description_text = "**Radio Fix**\n• Radio Shazamzee (Sometimes error is occur because of unknown problem , if you see the error please try play another radio and replay Radio Shazamzee)";
    */
    description_text = "Some bugs have been solved\n";
    let schedule = new MessageEmbed()
        .setColor('8B31F0')
        .setTitle('**We Have A New Update**')
        .setDescription(description_text);

    client.schedule[msg.guild.id] = 0;

    setTimeout( () => {

        msg.channel.send(schedule);

    },2000);
}
