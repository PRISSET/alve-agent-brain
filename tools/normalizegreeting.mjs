export function run(input) {
  if (typeof input !== 'string') return '';
  const cleaned = input.trim();
  if (cleaned === '') return '';
  const key = cleaned.toLowerCase().replace(/[!?.,;:'"`~()\[\]{}\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  const salaam = ['салам алейкум', 'салам алейкум', 'салам алейкум', 'ассалам алейкум', 'ассаламу алейкум', 'асалам алейкум', 'салам', 'салям', 'салам алейкум ва рахматуллах', 'salam aleykum', 'salam alaykum', 'assalam alaikum', 'assalamu alaikum', 'asalam alaikum', 'salaam', 'salam', 'salom'];
  const hello = ['hi', 'hii', 'hiii', 'hiya', 'hey', 'heya', 'heyy', 'yo', 'yoo', 'hello', 'helo', 'hullo', 'sup', 'wassup', 'whatsup', 'whats up', 'hi there', 'hey there', 'howdy', 'hellow', 'ello'];
  const privet = ['привет', 'приветик', 'прив', 'здарова', 'здорово', 'здаров', 'хай', 'дратути', 'здравствуй', 'здравствуйте'];
  if (salaam.indexOf(key) !== -1) return 'Assalamu alaikum';
  if (hello.indexOf(key) !== -1) return 'Hello';
  if (privet.indexOf(key) !== -1) return 'Здравствуйте';
  return cleaned;
}
