var TelegramBot = require('node-telegram-bot-api');
const options = {
    webHook: {
        // Just use 443 directly
        port: 443
    }
};
const url = process.env.NOW_URL;
const bot = new TelegramBot(process.env.TOKEN, options);

bot.setWebHook(`${url}/bot${process.env.TOKEN}`);

const creatorID = 202588723;
const botID = 306341783;

const publicChatID = -1001135378115;
const maintainersChatID = -1001112979036;
const adminsChatID = -1001133671655;

var gifStickerMap = {};
const gifStickerNumber = 3;           // 3 gifs/stickers in
const gifStickerTime = 90;           // 1.5 mins

var textMap = {};
const textNumber = 20;           // 20 messages in
const textTime = 10;             // 10 seconds

// Ban time table, first offense is 5 mins, second is 15, third is 1hr, fourth is a day, and 5th is permaban
const banTable = [300, 900, 3600, 86400];

var releaseDate = new Date();
releaseDate.setDate(releaseDate.getDate() + 14);

var chatAdmins = null;

var debug=false;

Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
    hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

const greeting = "Welcome to the Invictus Community. Please read and follow the /rules(Click to view). If you report a bug please specify which device you are on. Enjoy!\n\nYou can also view \n/aboutus\n/links\n/team\n/banrules\nand /help"

const story = "Did you ever hear the tragedy of Red Dragon \"the debugger\"?\nI thought not. It's not a story the Android docs would tell you. It's an Android legend. Red Dragon was a Dark Lord of the Androids, so powerful and so wise he could use the Force to influence the midichlorians to debug his apps... He had such a knowledge of the dark side that he could even keep the ones he cared about from force closes. The dark side of the Android is a pathway to many abilities some consider to be unnatural. He became so powerful... the only thing he was afraid of was losing his power, which eventually, of course, he did. Unfortunately, he taught his apprentice everything he knew, then his apprentice killed him in his sleep. It's ironic he could save others from force closes, but not himself.";

const poem = "Invictus - William Ernest Henley\n\nOut of the night that covers me,\nBlack as the pit from pole to pole,\nI thank whatever gods may be\nFor my unconquerable soul.\nIn the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance\nMy head is bloody, but unbowed.\nBeyond this place of wrath and tears\nLooms but the Horror of the shade,\nAnd yet the menace of the years\nFinds and shall find me unafraid.\nIt matters not how strait the gate,\nHow charged with punishments the scroll,\nI am the master of my fate,\nI am the captain of my soul.";

const help = "/rules - View chat rules\n/aboutus - Who we are as a ROM\n/links - Links to github and other resources\n/team - Information about who's who.\n/banrules - Ban thresholds"

const rules = "1) Please add an avatar to distinguish yourself from others.\n\n2) Think twice before posting something (and especially something NSFW). Some of us view this in public.\n\n3) Do not bash or send hurtful messages to others. It will earn you a ban. This includes things like racism, sexism, and so on. Remember, this is an open community with lots of different people so please keep that in mind.\n\n4) Do NOT bash other ROMs, ROM teams, or developers. This is a friendly chat and we have no room for Android drama.\n\n5) No links to piracy (warez apps, etc.) This will earn you a ban. Also, if you're banned for piracy in another chat and we see it, you'll be banned here as well. This is a zero tolerance rule.\n\n6) In extension to rule 5, anybody caught using Lucky Patcher, a modded play store for piracy, or other related apps such as BlackMart will be banned. This is also a zero tolerance rule. Not to mention Invictus has anti-piracy detection that would ruin your experience if you used it with piracy apps.\n\n7) No asking for ETAs, we're humans with real lives, not robots that crank out ROMs and such.\n\n8) (The Nepo Rule) No spoilers for anything new, be it Game of Thrones or Rick and Morty, or ANY show/movie, you have a 2 week grace period between when the show airs and when you can talk about it. If @USA_RedDragon catches GoT spoilers, he will be pissed.\n\n9) For the love of all things holy, no drama. Drama ruins teams and friendships and is a huge waste of time. Drama is an immediate kick in the ass towards the door."

const aboutUs = "Invictus is more than just a rom, it's a family. Our biggest aim is a very stable yet optimized rom with just the right amount of features."

const banThresholds = "You will be autobanned for sending:\n3 gifs/stickers/images/files per 1.5 mins\n20 messages per 10 seconds\n\nBan times:\n1st offsense is 5 min ban, 2nd offense is 15 mins, 3rd is 1hr, 4th is 1 day. 5th is permaban.\n\nAny admin here can ban you for any reason."

const team = "@USA-RedDragon - Website Maintainer, Bot Builder, ROM Developer, Essential PH-1 Maintainer.\n@Snuzzo - Team Leader, Developer\n@electrikjesus - ROM Ambassador\n@Infect_Ed - Moto Z2 Force Maintainer\n@Motorhead1991 - Galaxy S6 Maintainer\n@me2151 - Galaxy Note 5 Maintainer\n@Blackscorpion3 - OnePlus 5, OnePlus One Maintainer\n@Harpin14789 - OnePlus 5T Maintainer\n@Izzaeroth - HTC One M8 Maintainer\n@Otisman - OnePlus 3, OnePlus 5, OnePlus 5T, Xiaomi Mi 5 Maintainer\n@Shrayanshy - Yu Yuphoria Maintainer\n@Coldhans - Honor 5x Maintainer\n@Jsbeyond - Honor 5x Maintainer\n@Nvdx11 - Xiaomi Redmi Note 3 Maintainer\n@NepoRood - Nexus 6P, Pixel XL Maintainer\n@MZO9400 - Xiaomi Mi5s Maintainer\n@Anirudhgupta109 - Nexus 5X Maintainer\n@Kunalshah - Developer, OnePlus 2, Xiaomi Mi A1 Maintainer\n@Akh18 - Motorola G5 Plus Maintainer"

const links = "Devices Github: https://github.com/InvictrixROM-Devices\n\nROM Github: https://github.com/InvictrixROM\n\n\nGoogle Plus Community: https://plus.google.com/communities/109716291977795337501\n\nTelegram Chat: https://t.me/InvictusROM"

const adminlinks = "Chats\n\nPublic chat: https://t.me/InvictusROM\n\nMaintainers chat: https://t.me/joinchat/D5WWKUJWtlyziOyechwOHA\n\nCore chat: https://t.me/joinchat/D5WWKUOSdOfzt6gRvRzX5Q\n\nDocuments:\n\nFeatures Doc: https://docs.google.com/document/d/1JNSL3X2jSAT70WfXoUbqF1ZtoUXVEcjEEII_OsFCykg/edit?usp=sharing\n\nThread Templates\n\nXDA thread template: None Yet"

const maintainerlinks = "Chats\n\nPublic chat: https://t.me/InvictusROM\n\nMaintainers chat: https://t.me/joinchat/D5WWKUJWtlyziOyechwOHA\n\nDocuments\n\nFeatures Doc: https://docs.google.com/document/d/1JNSL3X2jSAT70WfXoUbqF1ZtoUXVEcjEEII_OsFCykg/edit?usp=sharing\n\nThread Templates\n\nXDA thread template: None Yet"

function SpamInfo(user, date, number, firstDate, messages, offenses) {
    this.user = user;
    this.date = date;
    this.number = number;
    this.firstDate = firstDate;
    this.messages = messages;
    this.offenses = offenses;
}

try {
bot.getChatAdministrators(publicChatID).then( function(data) {
    chatAdmins=data;
}).catch( function(err) {
    bot.sendMessage(creatorID, JSON.stringify(err));
});

bot.on('message', (msg) => {  
    if(debug) {
        bot.sendMessage(creatorID, JSON.stringify(msg));
    }

    //Check if we're in a invictus chat
    if(!checkChat(msg)) {
        return;
    }
 
    //Check if we're greeting a new member
    if(checkNewChatMember(msg)) {
        return;
    }

    //Check if we're moving towards a ban
    checkBannableOffenses(msg);

    //Easter Eggs!
    checkEasterEggs(msg);

    checkSlashCommands(msg);

    if(msg.text && msg.text.toLowerCase() == "/debug" && msg.from.id == creatorID) {
        debug=!debug;
        bot.sendMessage(msg.from.id, "You have turned debugging to: " + debug);
    }
});

function userIsChatAdmin(userId) {
    if(chatAdmins == null) return false;
    for (var i = 0, len = chatAdmins.length; i < len; i++) {
        if(chatAdmins[i].user.id == userId) return true;
    }
    return false;
}

function restrictUser(msg, reason, time) {
    bot.restrictChatMember(msg.chat.id, msg.from.id, {until_date: (msg.date+(time)), can_send_messages: false});
    bot.sendMessage(msg.chat.id, "AutoBanned @" + msg.from.username + " for " + time.toHHMMSS() +  " because of " + reason);
    bot.sendMessage(msg.chat.id, "Message @USA_RedDragon if this was in error");
}

function bantUser(msg, reason) {
    bot.kickChatMember(msg.chat.id, msg.from.id);
    bot.sendMessage(msg.chat.id, "PermaBanned @" + msg.from.username + " for " + reason);
}

function removeMessages(messages) {
    for (var i = 0, len = messages.length; i < len; i++) {
        bot.deleteMessage(messages[i].chat.id, messages[i].message_id);
    }
}

function checkChat(msg) {
   if(msg.chat.id != publicChatID && msg.chat.id != adminsChatID && msg.chat.id != maintainersChatID && msg.chat.type != "private") {
        bot.sendMessage(msg.chat.id, "Oh God, I have no clue where I am, there's strangers everywhere. I'm getting the hell outta here!");
        bot.leaveChat(msg.chat.id);
        return false;
    } else {
        return true;
    }
}

function checkNewChatMember(msg) {
    if(msg.new_chat_member) {
        bot.getChatMember(msg.chat.id, msg.new_chat_member.id).then(function(data) {
            if(!data.user.username) {
                bot.sendMessage(msg.chat.id, "Hello " + data.user.first_name + ". First, please create a username so we can tag you. " + greeting, {reply_to_message_id: msg.message_id});
            } else {
                bot.sendMessage(msg.chat.id, "Hello @" + data.user.username + ". " + greeting, {reply_to_message_id: msg.message_id});
            }
        }).catch(function(err) {
            bot.sendMessage(creatorID, JSON.stringify(err));
        });
        return true;    
    }
    return false;
}

function checkBannableOffenses(msg) {
    //No moderation in admin chats
    if(msg.chat.id == adminsChatID || msg.chat.id == maintainersChatID) return;

    if(msg.sticker || msg.video || msg.photo || msg.document) {
        if(userIsChatAdmin(msg.from.id)) return;
        if(msg.from.id in gifStickerMap) {
            var oldSpamInfo = gifStickerMap[msg.from.id];
            if((msg.date - oldSpamInfo.firstDate) > gifStickerTime) {
                oldSpamInfo.firstDate = date;
                oldSpamInfo.number = 0;
                oldSpamInfo.messages = [];
            }
            oldSpamInfo.number++;
            oldSpamInfo.messages.push(msg);
            if(oldSpamInfo.number >= gifStickerNumber && (msg.date - oldSpamInfo.firstDate) <= gifStickerTime) {
                if(oldSpamInfo.offenses >= 4) {
                    banUser(msg, "Spamming", banTable[oldSpamInfo.offenses]);
                }
                else {
                    restrictUser(msg, "Spamming", banTable[oldSpamInfo.offenses]);
                }
                oldSpamInfo.offenses++;
                removeMessages(oldSpamInfo.messages);
            }
        } else {
            var user = msg.from.id;
            var date = msg.date;
            var number = 1;
            var firstDate = msg.date;
            var messages = [];
            var offenses = 0;
            messages.pop(msg);
            gifStickerMap[msg.from.id] = new SpamInfo(user,date,number,firstDate, messages, offenses);
        }
    } else if(msg.text) {
        if(msg.from.id in textMap) {
            var oldSpamInfo = textMap[msg.from.id];
            if((msg.date - oldSpamInfo.firstDate) > textTime) {
                oldSpamInfo.firstDate = date;
                oldSpamInfo.number = 0;
                oldSpamInfo.messages = [];
            }
            oldSpamInfo.number++;
            oldSpamInfo.messages.push(msg);
            if(oldSpamInfo.number >= textNumber && (msg.date - oldSpamInfo.firstDate) <= textTime) {
                if(oldSpamInfo.offenses >= 4) {
                    banUser(msg, "Spamming", banTable[oldSpamInfo.offenses]);
                }
                else {
                    restrictUser(msg, "Spamming", banTable[oldSpamInfo.offenses]);
                }
                oldSpamInfo.offenses++;
                removeMessages(oldSpamInfo.messages);
            }
        } else {
            var user = msg.from.id;
            var date = msg.date;
            var number = 1;
            var firstDate = msg.date;
            var messages = [];
            var offenses = 0;
            messages.pop(msg);
            textMap[msg.from.id] = new SpamInfo(user,date,number,firstDate, messages, offenses);
        }
    }
}

function checkEasterEggs(msg) {
    if(!msg.text) return;
    if (msg.text.toLowerCase().includes("fuck the rules")) {
        if(userIsChatAdmin(msg.from.id)) {
          bot.sendMessage(msg.chat.id, "You're lucky you're an admin.", {reply_to_message_id: msg.message_id});
        } else {
          bot.sendMessage(msg.chat.id, "Are you trying to get banned?", {reply_to_message_id: msg.message_id});
        }
    } else if (msg.text.toLowerCase() == "/story") {
        bot.sendMessage(msg.chat.id, story, {reply_to_message_id: msg.message_id});
    } else if (msg.text.toLowerCase() == "/poem") {
        bot.sendMessage(msg.chat.id, poem, {reply_to_message_id: msg.message_id});
    }
}

function checkSlashCommands(msg) {
    if(!msg.text) return;
    if (msg.text.toLowerCase() == "/greeting") {
        bot.sendMessage(msg.chat.id, greeting, {reply_to_message_id: msg.message_id});
    } else if (msg.text.toLowerCase() == "/help" || msg.text.toLowerCase() == "/help@invictus_robot") {
        bot.sendMessage(msg.chat.id, help, {reply_to_message_id: msg.message_id});
    } else if (msg.text.toLowerCase() == "/banrules" || msg.text.toLowerCase() == "/banrules@invictus_robot") {
        bot.sendMessage(msg.chat.id, banThresholds, {reply_to_message_id: msg.message_id});
    } else if (msg.text.toLowerCase() == "/links" || msg.text.toLowerCase() == "/links@invictus_robot") {
        if(msg.chat.id == adminsChatID)
            bot.sendMessage(msg.chat.id, adminlinks, {reply_to_message_id: msg.message_id});
        else if(msg.chat.id == maintainersChatID)
            bot.sendMessage(msg.chat.id, maintainerlinks, {reply_to_message_id: msg.message_id});
        else
            bot.sendMessage(msg.chat.id, links, {reply_to_message_id: msg.message_id});
    } else if (msg.text.toLowerCase() == "/team" || msg.text.toLowerCase() == "/team@invictus_robot") {
        bot.sendMessage(msg.chat.id, team, {reply_to_message_id: msg.message_id, disable_notification: true});
    } else if (msg.text.toLowerCase() == "/aboutus" || msg.text.toLowerCase() == "/aboutus@invictus_robot") {
        bot.sendMessage(msg.chat.id, aboutUs, {reply_to_message_id: msg.message_id});
    } else if(msg.text.toLowerCase() == "/rules" || msg.text.toLowerCase() == "/rules@invictus_robot") {
        bot.sendMessage(msg.chat.id, "Here are the rules: \n\n" + rules);
    } else if(msg.text.toLowerCase().includes("/ban") && userIsChatAdmin(msg.from.id)) {
        var splitArr = msg.text.split(" ");
        if(splitArr.length < 3) {
            bot.sendMessage(msg.chat.id, "/ban usage \n\n /ban @Username reason here");
            return;
        }
        var reason = "";
        for (var i = 2; i < splitArr.length; i++) {
            reason += splitArr[i] + " ";
        }
        bot.sendMessage(adminsChatID, "Admin @" + msg.from.username + " wants to ban " + splitArr[1] + " " + reason);
    } else if(msg.text.toLowerCase().includes("/ban") && !userIsChatAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "You can't ban, you're just a normal person");
    }
}
} catch(error) {
    bot.sendMessage(creatorID, JSON.stringify(error));
}
