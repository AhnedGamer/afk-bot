const mineflayer = require('mineflayer');

const botOptions = {
  host: 'x30vut.aternos.me', // ضع رابط سيرفرك هنا
  port: 55134,                             // غير البورت إذا كان سيرفرك يستخدم بورت مختلف
  username: 'x30vut_boxpvp',
  version: '1.21.1'
};

let bot;
let isFirstJoin = true; // متغير لمعرفة إذا كان الدخول الأول للبوت أو إعادة دخول

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log(`${bot.username} دخل السيرفر بنجاح!`);
    
    // الانتظار ثانيتين للتأكد من تحميل اللعبة ثم إرسال الأمر المناسب
    setTimeout(() => {
      if (isFirstJoin) {
        bot.chat('/register x30vut123 x30vut123');
        console.log('تم إرسال أمر التسجيل للمرة الأولى (/register).');
        isFirstJoin = false; // تحويله إلى false حتى يكتب أمر الـ login في المرات القادمة
      } else {
        bot.chat('/login x30vut123');
        console.log('تم إرسال أمر تسجيل الدخول تلقائياً (/login).');
      }
    }, 2000);

    // بدء الحركة العشوائية لمنع الطرد بسبب الخمول (AFK)
    startAntiAFK();
  });

  function startAntiAFK() {
    // مسح أي مؤقت قديم لتفادي تداخل الحركات عند إعادة الاتصال
    if (global.afkInterval) clearInterval(global.afkInterval);
    
    global.afkInterval = setInterval(() => {
      if (!bot || !bot.entity) return;
      const actions = ['forward', 'back', 'left', 'right'];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      bot.setControlState(randomAction, true);
      
      setTimeout(() => {
        if (bot && bot.clearControlStates) bot.clearControlStates();
      }, 500);
    }, 10000); // يتحرك كل 10 ثوانٍ
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

// كود الويب سيرفر لإبقاء الاستضافة مستيقظة
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('البوت يعمل بنجاح 24/7!'));
app.listen(3000, () => console.log('سيرفر الويب جاهز لبث الحياة في البوت.'));
