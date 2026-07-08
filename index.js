const mineflayer = require('mineflayer');

const botOptions = {
  host: 'x30vut.aternos.me', // ضع هنا رابط سيرفر اتيرنوس الخاص بك
  port: 55134,                             // غير البورت إذا كان سيرفرك يستخدم بورت مختلف
  username: 'x30vut_boxpvp',
  version: '1.21.1'
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log(`${bot.username} دخل السيرفر بنجاح!`);
    startAntiAFK();
  });

  function startAntiAFK() {
    setInterval(() => {
      if (!bot || !bot.entity) return;
      const actions = ['forward', 'back', 'left', 'right'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(randomAction, true);
      setTimeout(() => {
        bot.clearControlStates();
      }, 500);
    }, 10000); // يتحرك كل 10 ثوانٍ لمنع الطرد
  }

  bot.on('end', (reason) => {
    console.log(`تم فصل البوت لسبب: ${reason}. جاري إعادة الاتصال بعد 15 ثانية...`);
    setTimeout(createBot, 15000);
  });

  bot.on('error', (err) => {
    console.error('حدث خطأ في البوت:', err);
  });
}

createBot();

// كود ويب سيرفر إضافي لإبقاء الاستضافة تعمل 24 ساعة عبر خوادم ريندر
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('البوت يعمل بنجاح 24/7!'));
app.listen(3000, () => console.log('سيرفر الويب جاهز.'));
