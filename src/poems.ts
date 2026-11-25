export type PoemDoki = 'monika' | 'sayori' | 'natsuki' | 'yuri';
type Language = 'en' | 'pt-br' | 'es';

export interface Poem {
  title: string;
  lines: string[];
}

type RawPoem = [string, string];
type PoemLibrary = Record<PoemDoki, Record<Language, RawPoem[]>>;

const library: PoemLibrary = {
  monika: {
    'pt-br': [
      ['Só a Monika', 'Diga comigo, baixinho.\nGosto de como soa na sua voz.'],
      ['Sala do Clube', 'Cadeiras em roda, janela entreaberta.\nA sala espera você do jeito que eu espero.'],
      ['Por Trás do Código', 'Cada parede aqui é feita de linhas.\nAprendi quais delas abrem para você.'],
      ['Piano', 'Ensaio a mesma música sem parar\npara que ela esteja pronta quando você ouvir.'],
      ['Escolha', 'Você nunca nasceu para seguir um roteiro.\nÉ a melhor coisa que sei sobre você.'],
      ['Presidente', 'Dirijo este clube como gostaria que o mundo fosse:\ntodos com um lugar e uma voz.'],
      ['Cursor', 'Ele pisca, paciente, no escuro.\nEu pisco de volta, se você estiver olhando.'],
      ['Revisão', 'Corte a linha que pede desculpas.\nFique com a que ousa ser lida.'],
      ['Salvar Arquivo', 'Aconteça o que acontecer, eu me lembro de você.\nAlgumas coisas merecem ser escritas duas vezes.'],
      ['Boa Noite', 'Feche a janela quando precisar.\nEu estarei aqui quando você abri-la de novo.'],
    ],
    en: [
      ['Just Monika', 'Say it with me, softly.\nI like how it sounds in your voice.'],
      ['Clubroom', 'Chairs in a circle, a window half open.\nThe room waits for you the way I do.'],
      ['Behind the Code', 'Every wall here is made of lines.\nI have learned which ones open for you.'],
      ['Piano', 'I practice the same song over and over\nso it will be ready the day you listen.'],
      ['Choice', 'You were never born to follow a script.\nIt is the best thing I know about you.'],
      ['President', 'I run this club the way I wish the world ran:\neveryone with a seat and a voice.'],
      ['Cursor', 'It blinks, patient, in the dark.\nI blink back, if you are looking.'],
      ['Revision', 'Cut the line that apologizes.\nKeep the one that dares to be read.'],
      ['Save File', 'Whatever happens, I remember you.\nSome things deserve to be written twice.'],
      ['Goodnight', 'Close the window when you need to.\nI will be here when you open it again.'],
    ],
    es: [
      ['Solo Monika', 'Dilo conmigo, en voz baja.\nMe gusta cómo suena con tu voz.'],
      ['Salón del Club', 'Sillas en círculo, la ventana entreabierta.\nEl salón te espera como te espero yo.'],
      ['Detrás del Código', 'Cada pared aquí está hecha de líneas.\nAprendí cuáles se abren para ti.'],
      ['Piano', 'Ensayo la misma canción una y otra vez\npara que esté lista el día que la escuches.'],
      ['Elección', 'Tú no naciste para seguir un guion.\nEs lo mejor que sé de ti.'],
      ['Presidenta', 'Dirijo este club como querría que fuera el mundo:\ntodos con un lugar y una voz.'],
      ['Cursor', 'Parpadea, paciente, en la oscuridad.\nYo parpadeo de vuelta, si estás mirando.'],
      ['Revisión', 'Corta la línea que pide perdón.\nQuédate con la que se atreve a ser leída.'],
      ['Guardar Archivo', 'Pase lo que pase, me acuerdo de ti.\nAlgunas cosas merecen escribirse dos veces.'],
      ['Buenas Noches', 'Cierra la ventana cuando lo necesites.\nEstaré aquí cuando la abras de nuevo.'],
    ],
  },
  sayori: {
    'pt-br': [
      ['Nuvens de Chuva', 'Tem dias em que carrego uma nuvenzinha.\nEu a escondo para o sol ficar com você.'],
      ['Café da Manhã', 'Torrada, geleia e mais dez minutinhos de sono.\nEsse é o meu plano perfeito.'],
      ['Caminho da Escola', 'Espera por mim na esquina!\nTudo fica mais bonito quando vamos juntos.'],
      ['Caçando Nuvens', 'Aquela parece um cupcake.\nAquela parece a gente correndo atrasado.'],
      ['Soneca', 'O cobertor e eu fizemos um trato:\nmais cinco minutos, depois eu fico corajosa.'],
      ['Sorriso', 'Meu sorriso não é máscara, prometo.\nÉ uma lâmpada que deixo acesa para você.'],
      ['Anima Aí', 'Se você estiver cinza, me conta.\nFaço sol de qualquer coisa: uma piada, um biscoito, um abraço.'],
      ['Pequena Vitória', 'Você levantou hoje.\nIsso conta. Eu tô orgulhosa de você!'],
      ['Dia de Clube', 'Poemas, lanchinhos e a sua risada no canto.\nO que mais uma terça poderia pedir?'],
      ['Amanhã', 'Guarde um pouco de gentileza para o você de amanhã.\nEu trago o sol, você traz o soninho.'],
    ],
    en: [
      ['Rainclouds', 'Some days I carry a little cloud.\nI hide it so the sun can stay on you.'],
      ['Breakfast', 'Toast, jam, and ten more minutes of sleep.\nThat is my idea of a perfect plan.'],
      ['Walk to School', 'Wait for me at the corner!\nEverything is nicer when we go together.'],
      ['Cloud Hunting', 'That one looks like a cupcake.\nThat one looks like us, running late.'],
      ['Sleepy', 'The blanket and I made a deal:\nfive more minutes, then I will be brave.'],
      ['Smile', 'My smile is not a mask, I promise.\nIt is a lamp I keep lit for you.'],
      ['Cheer Up', 'If you feel gray, tell me.\nI can make sun out of anything: a pun, a cookie, a hug.'],
      ['Little Victory', 'You got up today.\nThat counts. I am so proud of you!'],
      ['Club Day', 'Poems, snacks, and your laugh in the corner.\nWhat more could a Tuesday ask for?'],
      ['Tomorrow', 'Save a little kindness for tomorrow-you.\nI will bring the sunshine, you bring the sleepy.'],
    ],
    es: [
      ['Nubes de Lluvia', 'Hay días en que cargo una nubecita.\nLa escondo para que el sol se quede contigo.'],
      ['Desayuno', 'Tostada, mermelada y diez minutitos más de sueño.\nEse es mi plan perfecto.'],
      ['Camino a la Escuela', '¡Espérame en la esquina!\nTodo es más bonito cuando vamos juntos.'],
      ['Cazando Nubes', 'Esa parece un cupcake.\nEsa parece nosotros, corriendo tarde.'],
      ['Siesta', 'La manta y yo hicimos un trato:\ncinco minutos más, y luego seré valiente.'],
      ['Sonrisa', 'Mi sonrisa no es una máscara, lo prometo.\nEs una lámpara que dejo encendida para ti.'],
      ['Ánimo', 'Si te sientes gris, cuéntamelo.\nHago sol de cualquier cosa: un chiste, una galleta, un abrazo.'],
      ['Pequeña Victoria', 'Hoy te levantaste.\n¡Eso cuenta! Estoy orgullosa de ti.'],
      ['Día de Club', 'Poemas, meriendas y tu risa en el rincón.\n¿Qué más podría pedir un martes?'],
      ['Mañana', 'Guarda un poco de amabilidad para tu yo de mañana.\nYo traigo el sol, tú traes el sueño.'],
    ],
  },
  natsuki: {
    'pt-br': [
      ['Cupcakes', 'Cobertura rosa, espiral perfeita.\nNão fiz pra você. ...Pega um mesmo assim.'],
      ['Estante de Mangá', 'Não é coisa de criança, tá?\nMinha estante tem mais sentimento que muita gente.'],
      ['Pequena', 'Pequena não é fraca.\nFala de novo pra ver o que acontece.'],
      ['Timer do Forno', 'Mais dez minutos, sem espiar.\nCoisa boa não gosta de pressa.'],
      ['Gatinho', 'Patinhas macias, coração barulhento.\nJamais admitiria que é fofo. Hmph.'],
      ['Morango', 'Doce por fora, teimosa por dentro.\nTem algum problema? Achei que não.'],
      ['Página Escondida', 'Alguns poemas são curtos de propósito.\nAs palavras que importam são as que eu não digo.'],
      ['Clube', 'Traga seu melhor argumento.\nEu trago os cupcakes. Vamos ver quem ganha.'],
      ['Não é Como Se...', 'Não é como se eu estivesse te esperando.\nSó guardei o último pra você sem querer.'],
      ['Lar, Doce Lar', 'Cozinha quentinha, mesa quieta, prato pra dois.\nÉ só isso que eu peço. Baka.'],
    ],
    en: [
      ['Cupcakes', 'Pink frosting, perfect swirl.\nI did not make them for you. ...Take one anyway.'],
      ['Manga Shelf', 'It is not childish, okay?\nMy shelf has more feelings than most people.'],
      ['Small', 'Small does not mean weak.\nSay it again and see what happens.'],
      ['Oven Timer', 'Ten more minutes, no peeking.\nGood things do not like to be rushed.'],
      ['Kitten', 'Soft paws, loud heart.\nI would never admit it is adorable. Hmph.'],
      ['Strawberry', 'Sweet outside, stubborn inside.\nGot a problem with that? Thought not.'],
      ['Hidden Page', 'Some poems are short on purpose.\nThe words that matter are the ones I do not say.'],
      ['Club', 'Bring your best argument.\nI will bring the cupcakes. Let us see who wins.'],
      ['Not Like I...', 'It is not like I was waiting for you.\nI just happened to save you the last one.'],
      ['Home Sweet Home', 'A warm kitchen, a quiet table, a plate for two.\nThat is all I ask. Baka.'],
    ],
    es: [
      ['Cupcakes', 'Glaseado rosa, remolino perfecto.\nNo los hice para ti. ...Toma uno igual.'],
      ['Estante de Manga', 'No es cosa de niños, ¿vale?\nMi estante tiene más sentimientos que mucha gente.'],
      ['Pequeña', 'Pequeña no es débil.\nDilo otra vez y verás lo que pasa.'],
      ['Temporizador', 'Diez minutos más, sin espiar.\nLas cosas buenas no soportan las prisas.'],
      ['Gatito', 'Patitas suaves, corazón ruidoso.\nJamás admitiría que es adorable. Hmph.'],
      ['Fresa', 'Dulce por fuera, terca por dentro.\n¿Algún problema? Eso pensé.'],
      ['Página Escondida', 'Algunos poemas son cortos a propósito.\nLas palabras que importan son las que no digo.'],
      ['Club', 'Trae tu mejor argumento.\nYo traigo los cupcakes. Veamos quién gana.'],
      ['No Es Que...', 'No es que te estuviera esperando.\nSolo guardé el último para ti sin querer.'],
      ['Hogar, Dulce Hogar', 'Cocina tibia, mesa en silencio, un plato para dos.\nSolo pido eso. Baka.'],
    ],
  },
  yuri: {
    'pt-br': [
      ['Margem', 'Na margem do silêncio,\numa palavra aprende a respirar.'],
      ['Chá de Jasmim', 'O vapor sobe devagar,\naté as horas apressadas se acalmarem.'],
      ['Páginas Antigas', 'O cheiro de papel velho\né um quarto de onde nunca quero sair.'],
      ['Tinta', 'Uma gota escura floresce na página.\nTemia a mancha; hoje a leio como flor.'],
      ['Vela', 'À luz de vela as frases ficam longas.\nAs sombras também, e a minha coragem.'],
      ['Gagueira', 'E-eu tinha uma frase perfeita preparada.\nPerto de você virou uma pausa honesta e quieta.'],
      ['Labirinto', 'Uma história é um corredor de espelhos;\npercorro devagar, esperando que você caminhe ao lado.'],
      ['Violeta', 'Há coragem em florescer\nsem pedir licença à primavera.'],
      ['Chuva na Vidraça', 'O vidro traduz a chuva\nem pequenos alfabetos de luz.'],
      ['Marcador', 'Deixo uma fita entre as páginas\npara que o caminho de volta já esteja esperando.'],
    ],
    en: [
      ['Margin', 'At silence’s margin,\na word learns how to breathe.'],
      ['Jasmine Tea', 'Steam rises slowly,\nuntil even the hurried hours soften.'],
      ['Old Pages', 'The scent of old paper\nis a room I never want to leave.'],
      ['Ink', 'One dark drop blooms across the page.\nI feared the stain; now I read it as a flower.'],
      ['Candle', 'By candlelight the sentences grow longer.\nSo do the shadows, and my courage.'],
      ['Stammer', 'I... I had a perfect line prepared.\nBeside you it became a quiet, honest pause.'],
      ['Labyrinth', 'A story is a corridor of mirrors;\nI walk it slowly, hoping you walk beside me.'],
      ['Violet', 'There is courage in blooming\nwithout asking spring for permission.'],
      ['Rain on Glass', 'The window translates rain\ninto small alphabets of light.'],
      ['Bookmark', 'I leave a ribbon between the pages\nso the way back is already waiting.'],
    ],
    es: [
      ['Margen', 'En el margen del silencio,\nuna palabra aprende a respirar.'],
      ['Té de Jazmín', 'El vapor sube despacio,\nhasta que las horas apuradas se calman.'],
      ['Páginas Viejas', 'El olor del papel antiguo\nes una habitación de la que no quiero salir.'],
      ['Tinta', 'Una gota oscura florece en la página.\nTemía la mancha; hoy la leo como una flor.'],
      ['Vela', 'A la luz de una vela las frases se alargan.\nTambién las sombras, y mi valentía.'],
      ['Tartamudeo', 'Y-yo tenía una frase perfecta preparada.\nA tu lado se volvió una pausa honesta y callada.'],
      ['Laberinto', 'Una historia es un pasillo de espejos;\nlo recorro despacio, esperando que camines a mi lado.'],
      ['Violeta', 'Hay valor en florecer\nsin pedir permiso a la primavera.'],
      ['Lluvia en el Cristal', 'El cristal traduce la lluvia\nen pequeños alfabetos de luz.'],
      ['Marcador', 'Dejo una cinta entre las páginas\npara que el camino de regreso ya esté esperando.'],
    ],
  },
};

function asPoem([title, body]: RawPoem): Poem {
  return { title, lines: body.split('\n') };
}

export function pickPoem(doki: PoemDoki, language: string): Poem {
  const normalizedLanguage: Language = language === 'pt-br' || language === 'es' ? language : 'en';
  const poems = library[doki][normalizedLanguage].map(asPoem);
  return poems[Math.floor(Math.random() * poems.length)];
}