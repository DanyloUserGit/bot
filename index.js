require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const User = require('./models/User');

// DB --------------------------------------------------

mongoose.connect(process.env.DB_URL)
.then(()=>console.log("DB connected"))
.catch(e=>console.log(e));

async function logUser(data){
    try{    
        const {name, id} = data;
        const candidate = await User.findOne({id});
        if(candidate){
            return console.log("User already exists");
        }
        const user = new User({name:name, id:id});
        await user.save();
        console.log("User was saved");
    } catch (error){
        console.log(error);
    }
}

// Bot --------------------------------------------------

const bot = new TelegramBot(process.env.TOKEN, {

    polling: {
        interval: 300,
        autoStart: true
    }
    
});

bot.on("polling_error", err => console.log(err.data.error.message));
bot.on("text", async msg => {
    try {
        if(msg.text === "/start"){
            await bot.sendMessage(msg.chat.id, `Вы запустили бота! 👋🏻 \n Желаете получить чек? \n `,{
                reply_markup: {
                    inline_keyboard: [
                        [{text: '💸 Получить', callback_data: 'check'}]
        
                    ],
                    resize_keyboard: true
        
                }
            });
            console.log("bot has been started");
        }
        if(msg.text==="/check" || msg.text==="💸 Получить"){
            logUser({name:msg.from.first_name, id:msg.from.id}) // db send
        }
    } catch (error) {
        console.log(error);
    }
});
bot.on("callback_query", async ctx => {
    try {
        if(ctx.data==="check"){
            logUser({name:ctx.from.first_name, id:ctx.from.id}); // db send
        }
    } catch (error) {
        console.log(error);
    }
})

const commands = [

    {

        command: "start",
        description: "Запуск бота"

    },
    {

        command: "check",
        description: "Получить чек"

    },

]

bot.setMyCommands(commands);
