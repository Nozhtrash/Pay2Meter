
import type { Game, News, FreeGame } from '@/types';

const weeklyNewsData = [
  {
    "id": "news-1",
    "title": "Xbox despide 9.100 empleados y cancela varios juegos",
    "imageUrl": "https://dummyimage.com/600x400/c23b22/fff&text=Xbox+Layoffs",
    "source": "La última ronda de recortes en Microsoft deja a 9.100 empleados en la calle y varios proyectos en la morgue. Todo sea por \"optimizar procesos\"... mientras los fans miran con horror cómo se esfuman Forza y Perfect Dark.",
    "sourceUrl": "#"
  },
  {
    "id": "news-2",
    "title": "Ubisoft afirma que sus microtransacciones hacen los juegos más divertidos",
    "imageUrl": "https://dummyimage.com/600x400/5a6988/fff&text=Ubisoft+Microtransactions",
    "source": "Ubisoft presume de que las microtransacciones son \"más divertidas\". ¡Claro que sí, nada dice diversión como pagar por cada nivel extra en Assassin's Creed! Prepárense, porque seguro pronto sacan DLC hasta para respirar en Valhalla.",
    "sourceUrl": "#"
  },
  {
    "id": "news-3",
    "title": "The Alters: estudio admite que IA en el juego fue un descuido",
    "imageUrl": "https://dummyimage.com/600x400/8b4513/fff&text=The+Alters",
    "source": "En \"The Alters\" descubrieron texto de IA pegado como placeholder por un descuido. El estudio dice que jamás iba en la versión final. ¡Qué alivio! Seguro ahora culpan a los clones o al jefe de QA fantasma.",
    "sourceUrl": "#"
  },
  {
    "id": "news-4",
    "title": "Bungie regraba voces en Destiny 2 tras confusión de personajes",
    "imageUrl": "https://dummyimage.com/600x400/00719c/fff&text=Destiny+2",
    "source": "Resulta que en Destiny 2 la voz de una heroína sonaba como villana, gracias a que los actores no estaban disponibles (hola, huelga SAG-AFTRA). Bungie regraba el desastre para arreglarlo. Algunos dicen que eligieron el doblaje al azar... ¡qué casualidad!",
    "sourceUrl": "#"
  },
  {
    "id": "news-5",
    "title": "Elden Ring Nightreign: la penalización por abandonar es pura falsa alarma",
    "imageUrl": "https://dummyimage.com/600x400/f0e600/000&text=Elden+Ring",
    "source": "En Elden Ring Nightreign te advierten que si abandonas la partida te \"castigarán\". Pues parece que el castigo era blanco en la nevera: la mayoría sale impune tras abandonos múltiples. Moraleja: el juego asusta más con palabras que con hechos.",
    "sourceUrl": "#"
  },
  {
    "id": "news-6",
    "title": "Dead Island 2: retrasado 8 años para evitar un juego desastroso",
    "imageUrl": "https://dummyimage.com/600x400/ff851b/fff&text=Dead+Island+2",
    "source": "El exjefe de comunicación de Deep Silver confiesa que retrasar Dead Island 2 ocho años fue para no hundir la saga con aquella versión original. Ahora todo tiene más sentido: era una eternidad de desarrollo, y ocho veces más humor negro.",
    "sourceUrl": "#"
  }
];

const topGamesRawData = {
    "PC": [
        { "name": "Diablo Immortal", "developer": "Blizzard Entertainment", "imageUrl": "https://dummyimage.com/600x400/c23b22/fff&text=Diablo+Immortal", "critic": "Pagas etiquetas diabólicas: la pirámide del Infierno se financia con tu tarjeta. ¡Hasta Satán estaría orgulloso de este F2P!", "reviewCount": 48123, "abuseRating": 98, "p2wScore": 9.8 },
        { "name": "Lost Ark", "developer": "Smilegate RPG", "imageUrl": "https://dummyimage.com/600x400/5a6988/fff&text=Lost+Ark", "critic": "Batallas gratis en Arkesia, pero el oro cuesta dinero real. Parece un MMO medieval: el tesoro final lo tiene quien paga.", "reviewCount": 35211, "abuseRating": 92, "p2wScore": 9.1 },
        { "name": "League of Legends", "developer": "Riot Games", "imageUrl": "https://dummyimage.com/600x400/0397ab/fff&text=LoL", "critic": "Legends ostenta campeonatos gratis, pero los skins legendarios arman la economía real. La verdadera jungla aquí es la financiera.", "reviewCount": 49876, "abuseRating": 85, "p2wScore": 7.5 },
        { "name": "EA Sports FC 24", "developer": "EA Sports", "imageUrl": "https://dummyimage.com/600x400/3d9970/fff&text=FC+24", "critic": "FIFA te promete la Champions, pero solo tras sacar la billetera. Al final, tus cartas de Ultimate Team pesan más que el balón.", "reviewCount": 18432, "abuseRating": 88, "p2wScore": 8.9 },
        { "name": "Dying Light 2", "developer": "Techland", "imageUrl": "https://dummyimage.com/600x400/ff851b/fff&text=Dying+Light+2", "critic": "Corre gratis de los zombis, pero tropezarás con las compras. Al final, los verdaderos mutantes serán tus gastos extras.", "reviewCount": 9876, "abuseRating": 65, "p2wScore": 6.0 },
        { "name": "Battlefield 2042", "developer": "DICE", "imageUrl": "https://dummyimage.com/600x400/222/fff&text=BF+2042", "critic": "Tácticas gratis, pero las victorias VIP cuestan. Cada expansión es un nuevo campo de batalla para tu tarjeta.", "reviewCount": 12345, "abuseRating": 72, "p2wScore": 7.1 },
        { "name": "Path of Exile", "developer": "Grinding Gear Games", "imageUrl": "https://dummyimage.com/600x400/8b4513/fff&text=Path+of+Exile", "critic": "Camino al exilio con sonrisa gratuita y billetera herida. Aquí el loot se vende y las gemas son oro, ¡bendiciones del Diablo!", "reviewCount": 33211, "abuseRating": 78, "p2wScore": 6.8 },
        { "name": "Apex Legends", "developer": "Respawn Entertainment", "imageUrl": "https://dummyimage.com/600x400/b90000/fff&text=Apex+Legends", "critic": "Apex es gratis hasta que quieres parecer épico: cajas de loot, pases y trolleos infestan la tienda. El verdadero ganador es tu banco.", "reviewCount": 41234, "abuseRating": 81, "p2wScore": 7.2 },
        { "name": "Destiny 2", "developer": "Bungie", "imageUrl": "https://dummyimage.com/600x400/00719c/fff&text=Destiny+2", "critic": "Destiny te lleva a Marte gratis, pero lanza sus DLC y pases de temporada como meteoritos a tu cuenta. La suerte de la vigilia es pagar por sobrevivir.", "reviewCount": 28765, "abuseRating": 75, "p2wScore": 8.0 },
        { "name": "Cyberpunk 2077", "developer": "CD Projekt Red", "imageUrl": "https://dummyimage.com/600x400/f0e600/000&text=Cyberpunk+2077", "critic": "Lucir cromo en Night City sale caro. Aunque el juego base es una compra única, la tienda de cosméticos tienta a tu cartera.", "reviewCount": 15432, "abuseRating": 55, "p2wScore": 5.2 },
    ],
    "Android": [
        { "name": "Clash of Clans", "developer": "Supercell", "imageUrl": "https://dummyimage.com/600x400/ffc300/000&text=Clash+of+Clans", "critic": "Construyes tu aldea gratis... y luego la destruyes con compras: paquetes mágicos, elixir por montones y héroes VIP. Al final, el mayor ataque viene de tu propio bolsillo.", "reviewCount": 49999, "abuseRating": 99, "p2wScore": 9.9 },
        { "name": "Genshin Impact", "developer": "miHoYo", "imageUrl": "https://dummyimage.com/600x400/4a86e8/fff&text=Genshin+Impact", "critic": "Todo es hermoso al principio, pero cuidado con las gachas: lo que cae en la bolsa te deja en números rojos. ¡Magia oriental de bolsillo agujereado!", "reviewCount": 45678, "abuseRating": 95, "p2wScore": 9.5 },
        { "name": "Summoners War", "developer": "Com2uS", "imageUrl": "https://dummyimage.com/600x400/a64d79/fff&text=Summoners+War", "critic": "Invocas monstruos gratis, pero el verdadero Power se paga: hechizos, runas y paquetes VIP te dejan un summoner quebrado. ¡Ojalá dieran conferencias sobre esto!", "reviewCount": 25432, "abuseRating": 93, "p2wScore": 9.2 },
        { "name": "RAID: Shadow Legends", "developer": "Plarium", "imageUrl": "https://dummyimage.com/600x400/8e7cc3/fff&text=RAID", "critic": "El rey de la selva P2W: RAID te da caballos gratis pero vende la silla. Cada fragmento mítico es un mordisco más grande para tu cartera.", "reviewCount": 31234, "abuseRating": 97, "p2wScore": 9.7 },
        { "name": "Candy Crush Saga", "developer": "King", "imageUrl": "https://dummyimage.com/600x400/ff00ff/fff&text=Candy+Crush", "critic": "Es un caramelo gratis que te roban el azúcar: Candy Crush vende vidas y boosters. Cada nivel parece dulce hasta que te rompe el bolsillo.", "reviewCount": 47890, "abuseRating": 89, "p2wScore": 8.5 },
        { "name": "Marvel Strike Force", "developer": "Scopely", "imageUrl": "https://dummyimage.com/600x400/e06666/fff&text=Marvel+Strike+Force", "critic": "Peleas con héroes gratis, compras superpoderes caros: juntar a los Avengers te deja más solo que Hulk sin cuenta de banco. ¡La meta siempre es el ganador con más oro!", "reviewCount": 21345, "abuseRating": 94, "p2wScore": 9.3 },
        { "name": "Mobile Legends: Bang Bang", "developer": "Moonton", "imageUrl": "https://dummyimage.com/600x400/3d85c6/fff&text=Mobile+Legends", "critic": "Lucha épica gratis, pagos reales: Mobile Legends te anima a bailar la tarjeta. ¡Al final, a veces un skin decide más que tus propios dedos!", "reviewCount": 38765, "abuseRating": 86, "p2wScore": 8.1 },
        { "name": "Clash Royale", "developer": "Supercell", "imageUrl": "https://dummyimage.com/600x400/f1c232/000&text=Clash+Royale", "critic": "Barajas de estrategia y deudas: estas cartas se descargan gratis, pero si quieres ascender en arenas te invitan a palmar oro real. No lo llames juego, llámalo mata-cofres.", "reviewCount": 43210, "abuseRating": 91, "p2wScore": 9.0 },
        { "name": "Pokémon GO", "developer": "Niantic", "imageUrl": "https://dummyimage.com/600x400/cc0000/fff&text=Pokemon+GO", "critic": "Atrapar Pokémon es gratis hasta que llega el primer Charizard VIP: huevos de oro y Poképaradas brilla-pago. Ni Pikachu te salva de las cuentas extras.", "reviewCount": 39876, "abuseRating": 79, "p2wScore": 7.0 },
        { "name": "Rise of Kingdoms", "developer": "Lilith Games", "imageUrl": "https://dummyimage.com/600x400/b45f06/fff&text=Rise+of+Kingdoms", "critic": "Ciudades gratis, imperios deudas: tu reino crece mientras vacían tu bolsillo con recursos acelerados. El verdadero rey de RoK es la transacción.", "reviewCount": 29876, "abuseRating": 96, "p2wScore": 9.6 },
    ]
};

const freeGamesRawData = [
  { "title": "Civilization VI", "platform": "PC", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Civ+VI", "critic": "Gratis el juego base... pero prepárate: pronto te cobrarán cada DLC. Al fin y al cabo, solo faltaba que Napoleón te cobrara impuestos.", "url": "#" },
  { "title": "Fortnite", "platform": "PC", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Fortnite", "critic": "Gratis para descargar y jugar, pero Epic te endulza con skins que cuestan un ojo de la cara. Este virus gratuito es altamente contagioso para tu billetera.", "url": "#" },
  { "title": "Genshin Impact", "platform": "Android", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Genshin+Impact", "critic": "Gratis para todos, pero cuidado con las gachas: una vez abras las bolsas, ni Mario en Monedolandía rescata tu cartera.", "url": "#" },
  { "title": "Pokémon UNITE", "platform": "Android", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Pokemon+UNITE", "critic": "Gratis para pelear con Pikachu, pero luego te piden reales para evolucionar a Charizard. Quien dijo que capturar Pokémon no tenía su precio.", "url": "#" },
  { "title": "Candy Crush Saga", "platform": "Android", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Candy+Crush", "critic": "Gratis en tiendas, pero cada nivel te regala un dulce que sale carísimo: vidas y boosters de pago. La miel es gratis, lo amargo no tanto.", "url": "#" },
  { "title": "Fall Guys", "platform": "PC", "imageUrl": "https://dummyimage.com/600x400/000/fff&text=Fall+Guys", "critic": "Gratis jugar saltando y tropezando, pero guarda la billetera: los trajes más alocados cuestan más que dignidad. Al final del día... pagas por tropezones virtuales.", "url": "#" }
];


const mapGameData = (gameData: any, platform: "PC" | "Android"): Omit<Game, 'id'> => ({
    ...gameData,
    platform: platform,
    description: gameData.critic, // Use critic as the main description
});

export const mockPcGames: Omit<Game, 'id'>[] = topGamesRawData.PC.map(game => mapGameData(game, "PC"));
export const mockAndroidGames: Omit<Game, 'id'>[] = topGamesRawData.Android.map(game => mapGameData(game, "Android"));

export const mockAllGames: Game[] = [...mockPcGames, ...mockAndroidGames].map((game, index) => ({
    ...game,
    id: `mock-${game.name.replace(/\s+/g, '-').toLowerCase()}-${index}`,
}));

export const mockNews: News[] = weeklyNewsData.map(news => ({...news, sourceUrl: news.sourceUrl || '#'}));

export const mockFreeGames: FreeGame[] = freeGamesRawData.map((game, index) => ({
    ...game,
    id: `free-${game.title.replace(/\s+/g, '-').toLowerCase()}-${index}`,
    url: game.url || '#',
}));
