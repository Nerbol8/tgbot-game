const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5493374592:AAFEOV1hDX1hlWxvwcyoTdRdhh7d00gvxgE'


const bot = new TelegramApi(token,{polling:true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}




bot.setMyCommands( [
    {command: '/start',description:'Начальное приветствие'},
    {command: '/info',description:'Получить информацию о пользователе'},
    {command: '/game',description:'Угадай цифру'}
])

const start = async ()=>{
    bot.on ('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
    
        if (text === '/start') {
       await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/192/14.webp`)
       return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот, создатель Эрбол`)
        }
        if ( text === '/info') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/d06/e20/d06e2057-5c13-324d-b94f-9b5a0e64f2da/12.webp`)
           return bot.sendMessage(chatId, `Ваш ник ${msg.from.first_name} ${msg.from.last_name}`)
        }
          if(text === '/game'){
           return startGame(chatId)
          }

        return bot.sendMessage(chatId,'Я тебя не понимаю')
        } catch (e) {
            
            return bot.sendMessage(chatId,'Произошла какая-то ошибка')}
    })

    bot.on('callback_query', async msg => {

        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
               return startGame(chatId)
        }

        if (data == chats[chatId]) {
            await bot.sendMessage(chatId,`Поздравляю, ты отгадал цифру ${chats[chatId]}`,againOptions)
        }  else {
            await bot.sendMessage(chatId, `К сожалению ты не угадал`,againOptions)
        }

       // бот загадал цифру ${chats[chatId]}`
        
    })
}
start()