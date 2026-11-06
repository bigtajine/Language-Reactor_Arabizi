/* Arabizi mod: any object with Arabic `.text` and no own `.translit` gets an Arabizi translit.
   ponytail: Object.prototype getter catches every code path at once; scoped to Arabic-script text only. */
(function () {
  if (Object.prototype.hasOwnProperty("translit")) return;
  var M = {
    "ء": "2", "أ": "2", "إ": "2i", "آ": "2a", "ؤ": "2", "ئ": "2", "ا": "a", "ٱ": "a", "ب": "b", "ت": "t", "ث": "th",
    "ج": "j", "ح": "7", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s",
    "ض": "d", "ط": "6", "ظ": "z", "ع": "3", "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m",
    "ن": "n", "ه": "h", "ة": "a", "ى": "a", "پ": "p", "چ": "ch", "ڤ": "v", "گ": "g", "ک": "k", "ی": "i",
    "َ": "a", "ِ": "i", "ُ": "u", "ً": "an", "ٍ": "in", "ٌ": "un", "ْ": "", "ـ": "", "ٰ": "a",
    "،": ",", "؛": ";", "؟": "?", "٪": "%"
  };
  var AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
  function letters(s) {
    var out = "", prev = "";
    for (var i = 0; i < s.length; i++) {
      var c = s[i], n = s[i + 1] || "", r;
      var start = i === 0 || !AR.test(s[i - 1]);
      var wordStart = start || /(^|[^؀-ۿ])[وبفكل]?ال$/.test(s.slice(Math.max(0, i - 5), i)); // after (w/b/f/k/l+)al-
      var end = !n || !AR.test(n);
      var vowelNext = /[اويىةَ-ِ]/.test(n);
      if (c >= "٠" && c <= "٩") r = String(c.charCodeAt(0) - 0x660);
      else if (c >= "۰" && c <= "۹") r = String(c.charCodeAt(0) - 0x6F0);
      else if (c === "ّ") r = prev.slice(-1); // shadda doubles previous consonant
      else if (wordStart && (c === "أ" || c === "إ" || c === "آ")) r = c === "إ" ? "i" : "a"; // word-initial hamza is silent
      else if (c === "أ" && end) r = "a"; // final أ (أقرأ) -> a
      else if (c === "و") r = start || s[i - 1] === "ا" || vowelNext ? "w" : s[i - 1] === "ُ" ? "" : "ou";
      else if (c === "ي") r = start || s[i - 1] === "ا" || vowelNext ? "y" : s[i - 1] === "ِ" ? "" : "i";
      else r = c in M ? M[c] : c;
      out += r; prev = r || prev;
    }
    return out;
  }
  // Common words with vowels (subtitles rarely carry harakat). Keys: bare spelling, no harakat.
  var D = {}; ("أنا:ana أنت:enta انت:enta أنتي:enti انتي:enti هو:huwe هي:hiye نحن:na7nu نحنا:ne7na احنا:e7na إحنا:e7na أنتم:intum انتو:entu إنتو:entu هم:hum هني:henne هنن:hennen " +
    "هذا:hada هاد:had هيدا:hayda هذه:hadhihi هاي:hay هيدي:haydi هدول:hadol هؤلاء:ha2ula2 هيك:heek هلق:halla2 هلأ:halla2 هون:hon هناك:hunak هنيك:honik " +
    "في:fi من:min مِن:min إلى:ila الى:ila على:3ala عن:3an مع:ma3 بس:bas كمان:kaman كتير:kteer كثير:kathir شوي:shway شوية:shwayye " +
    "رح:ra7 عم:3am كان:kan كانت:kanet بدي:baddi بدك:baddak بده:baddo بدها:badda ما:ma مش:mish مو:mu لا:la نعم:na3am أيوه:aywa ايوه:aywa اي:ee آه:ah " +
    "شو:shu ليش:leesh وين:wein كيف:kif كيفك:kifak امتى:emta إمتى:emta مين:meen قديش:addeish ماذا:madha لماذا:limadha كم:kam متى:mata أين:ayna " +
    "واحد:wa7ad واحدة:wa7de اثنين:tnein اتنين:tnein ثلاثة:tlate تلاتة:tlate ثلاث:tlat تلات:tlat أربعة:arba3a اربعة:arba3a خمسة:khamse ستة:sitte سبعة:sab3a ثمانية:tmane تمانية:tmane تسعة:tis3a عشرة:3ashra " +
    "مرحبا:mar7aba مرحبتين:mar7abtein أهلا:ahlan اهلا:ahlan سلام:salam السلام:assalam عليكم:3alaykum شكرا:shukran يسلمو:yislamu عفوا:3afwan صباح:saba7 مسا:masa مساء:masa2 الخير:il5eir تصبح:tisba7 " +
    "يلا:yalla خلص:khalas خلصت:khallast منيح:mnee7 منيحة:mnee7a كويس:kwayyes حلو:7ilu حلوة:7ilwe كبير:kbeer كبيرة:kbeere صغير:zghir صغيرة:zghire جديد:jdeed قديم:2adeem " +
    "كتاب:ktab كتب:kutub الكتب:ilkutub بيت:beit دار:dar يوم:yom اليوم:ilyom بكرا:bukra مبارح:mbare7 وقت:wa2t ساعة:sa3a سنة:sene ناس:nas شي:shi كل:kil أكل:akl مي:mai " +
    "حكي:7aki بحكي:b7ki أحكي:a7ki احكي:a7ki قرأ:qara2 أقرأ:a2ra اقرا:a2ra أقرا:a2ra قرأت:2aret قريت:2areet بقرأ:b2ra بعرف:ba3ref عرف:3iref بحب:b7ibb حب:7ubb روح:rou7 بروح:brou7 رحت:ri7t " +
    "إجا:eja اجا:eja تعال:ta3a بشوف:bshouf شوف:shouf شفت:shift قال:2al بقول:b2oul عمل:3amal بعمل:ba3mel أكلت:akalt شربت:shribt نام:nam بدرس:bidrus عربي:3arabi العربي:il3arabi إنجليزي:inglizi انجليزي:inglizi " +
    "حسن:7asan محمد:m7ammad أحمد:a7mad علي:3ali الله:allah إن:inn إنه:inno انه:inno لأنه:la2anno لانه:la2anno يعني:ya3ni طيب:tayyeb و:w او:aw أو:aw لكن:lakin بس:bas كمان:kaman").split(" ").forEach(function (p) { p = p.split(":"); D[p[0]] = p[1]; });
  var SUN = "تثدذرزسشصضطظلن", PRE = { "و": "w", "ف": "f", "ب": "b", "ك": "k", "ل": "l" };
  function word(w) {
    var b = w.replace(/[ً-ْـ]/g, ""), pre = "";
    if (D[b]) return D[b];
    var ok = function (x) { return D[x] || /^(ال|لل)../.test(x) || /^[بكل]ال../.test(x); };
    if (/^[وف]/.test(b) && ok(b.slice(1))) { pre = PRE[b[0]]; b = b.slice(1); }      // wa-/fa-
    var art = /^ال../.test(b) ? 2 : /^[بكل]ال../.test(b) ? 3 : /^لل../.test(b) ? 2 : 0; // (bi/ka/li-)al-
    if (art) {
      if (art === 3 || b[0] === "ل" && b[1] === "ل") pre += PRE[b[0]];
      var stem = b.slice(art);
      var core = D[stem] ? D[stem].replace(/^il/, "") : letters(stem);
      var l = SUN.indexOf(stem[0]) >= 0 ? letters(stem[0]) : "l"; // sun letters assimilate: الشمس -> ishshams
      return (pre ? pre + "i" : "i") + l + core;
    }
    if (pre && D[b]) return pre + "a" + D[b];
    if (/^[بكل]/.test(b) && D[b.slice(1)]) return pre + PRE[b[0]] + "i" + D[b.slice(1)]; // bi-/li-/ka- + word
    return pre ? pre + letters(b) : letters(w);
  }
  function arabizi(s) {
    return letters(s.normalize("NFKC").replace(/[ء-ْٰ-ۿ]+/g, word));
  }
  Object.defineProperty(Object.prototype, "translit", {
    configurable: true,
    get: function () { return typeof this.text === "string" && AR.test(this.text) ? arabizi(this.text) : undefined; },
    set: function (v) { Object.defineProperty(this, "translit", { value: v, writable: true, enumerable: true, configurable: true }); }
  });
  // self-check
  if (arabizi("أنا رح أقرأ الكتاب") !== "ana ra7 a2ra ilktab" || arabizi("الشمس") !== "ishshms" || letters("حبيبي") !== "7bibi") console.warn("arabizi self-check failed");
})();
