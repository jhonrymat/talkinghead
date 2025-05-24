/**
* @class Spanish lip-sync processor
* @author Jhon matoma Colombia jhonrymat@gmail.com
*/

class LipsyncEs {

  constructor() {
    // Letras españolas mapeadas a visemas de Oculus
    this.visemes = {
      'a': 'aa', 'e': 'E', 'i': 'I', 'o': 'O', 'u': 'U',
      'b': 'PP', 'c': 'SS', 'd': 'DD', 'f': 'FF', 'g': 'kk',
      'h': 'sil', 'j': 'SS', 'k': 'kk', 'l': 'nn', 'm': 'PP',
      'n': 'nn', 'ñ': 'nn', 'p': 'PP', 'q': 'kk', 'r': 'RR',
      's': 'SS', 't': 'DD', 'v': 'FF', 'w': 'FF', 'x': 'SS',
      'y': 'I', 'z': 'SS'
    };

    this.visemeDurations = {
      'aa': 0.95, 'E': 0.90, 'I': 0.92, 'O': 0.96, 'U': 0.95,
      'PP': 1.08, 'SS': 1.23, 'DD': 1.05, 'FF': 1.00, 'kk': 1.21,
      'nn': 0.88, 'RR': 0.88, 'TH': 1, 'CH': 1.1, 'sil': 1
    };

    this.specialDurations = { ' ': 1, ',': 3, '-': 0.5 };

    this.symbols = {
      '%': 'por ciento', '€': 'euros', '&': 'y', '+': 'más', '$': 'dólares'
    };
    this.symbolsReg = /[%€&\+\$]/g;

    this.numbers = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco',
      'seis', 'siete', 'ocho', 'nueve'];
  }

  numberToSpanishWords(x) {
    let n = parseInt(x);
    if (isNaN(n)) return x;
    if (n < 10) return this.numbers[n];
    return [...x].map(d => this.numbers[parseInt(d)]).join(' ');
  }

  preProcessText(s) {
    return s.replace(/[#_*\'\":;]/g, '')
      .replace(this.symbolsReg, symbol => ' ' + this.symbols[symbol] + ' ')
      .replace(/(\d),(\d)/g, '$1 coma $2')
      .replace(/\d+/g, this.numberToSpanishWords.bind(this))
      .replace(/\s\s+/g, ' ')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC')
      .trim();
  }

  wordsToVisemes(w) {
    let o = { words: w, visemes: [], times: [], durations: [] };
    let t = 0;

    const chars = [...w];
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i].toLowerCase();
      const viseme = this.visemes[ch];
      if (viseme) {
        if (o.visemes.length && o.visemes[o.visemes.length - 1] === viseme) {
          const d = 0.7 * (this.visemeDurations[viseme] || 1);
          o.durations[o.durations.length - 1] += d;
          t += d;
        } else {
          const d = this.visemeDurations[viseme] || 1;
          o.visemes.push(viseme);
          o.times.push(t);
          o.durations.push(d);
          t += d;
        }
      } else {
        t += this.specialDurations[ch] || 0;
      }
    }

    return o;
  }

}

export { LipsyncEs };
