/* ==========================================================================
   Fanni's Store — configuration & catalogue
   ► Modifiez ici : numéro WhatsApp, réseaux sociaux, devise, produits, prix.
   ► Photos : ajoutez vos images dans assets/img/produits/ et renseignez
     "images: ['assets/img/produits/mon-image.jpg', ...]" sur le produit.
     Sans photo, une illustration élégante est générée automatiquement.
   ========================================================================== */

window.FANNI = window.FANNI || {};

FANNI.config = {
  storeName: "Fanni's Store",
  whatsapp: "21600000000",               // format international sans « + » ni espaces
  email: "bonjour@fannis-store.com",
  instagram: "https://www.instagram.com/fannis.store",
  instagramHandle: "@fannis.store",
  facebook: "https://www.facebook.com/fannis.store",
  tiktok: "https://www.tiktok.com/@fannis.store",
  currency: "DT",                         // affiché après le prix
  shippingFee: 8,                         // frais de livraison
  freeShippingFrom: 150,                  // livraison offerte dès ce montant
  onlinePaymentUrl: "",                   // lien de votre passerelle (Konnect, Flouci, Stripe…) — laissé vide = lien envoyé par WhatsApp
  giftCardPrice: 5,                       // carte message premium
  photoOptionPrice: 10                    // impression d'une photo personnalisée
};

FANNI.occasions = [
  { id: "anniversaire", fr: "Anniversaire", ar: "عيد ميلاد", icon: "cake" },
  { id: "saint-valentin", fr: "Saint-Valentin", ar: "عيد الحب", icon: "heart" },
  { id: "mariage", fr: "Mariage", ar: "زفاف", icon: "rings" },
  { id: "naissance", fr: "Naissance", ar: "ولادة", icon: "baby" },
  { id: "fete-parents", fr: "Fête des mères/pères", ar: "عيد الأم / الأب", icon: "flower" },
  { id: "remerciements", fr: "Remerciements", ar: "شكر وامتنان", icon: "thanks" },
  { id: "sur-mesure", fr: "Box sur mesure", ar: "علبة حسب الطلب", icon: "sparkle" }
];

FANNI.recipients = [
  { id: "elle", fr: "Pour elle", ar: "لها" },
  { id: "lui", fr: "Pour lui", ar: "له" },
  { id: "enfant", fr: "Pour enfant", ar: "للطفل" },
  { id: "couple", fr: "Pour un couple", ar: "للثنائي" }
];

FANNI.ribbons = [
  { id: "poudre", fr: "Rose poudré", ar: "وردي فاتح", color: "#e8b9b3" },
  { id: "or", fr: "Or", ar: "ذهبي", color: "#c9a25a" },
  { id: "ivoire", fr: "Ivoire", ar: "عاجي", color: "#f3ead9" },
  { id: "sauge", fr: "Vert sauge", ar: "أخضر", color: "#3e9b78" },
  { id: "bordeaux", fr: "Bordeaux", ar: "خمري", color: "#8e3b46" },
  { id: "nude", fr: "Nude", ar: "بيج", color: "#d8c0a6" }
];

FANNI.cardStyles = [
  { id: "none", fr: "Sans carte", ar: "بدون بطاقة", price: 0 },
  { id: "classique", fr: "Carte classique", ar: "بطاقة كلاسيكية", price: 0 },
  { id: "doree", fr: "Carte dorée à chaud", ar: "بطاقة مذهّبة", price: 5 },
  { id: "calligraphie", fr: "Calligraphiée à la main", ar: "بطاقة بخط اليد", price: 8 }
];

/* art : paramètres de l'illustration générée (v = modèle, b = boîte, l = couvercle, r = ruban, bg = fond) */
FANNI.products = [
  {
    id: "box-eclat-de-rose", occasion: ["anniversaire", "fete-parents"], recipient: ["elle"],
    price: 89, bestseller: true, badge: "best", rating: 4.9, reviews: 64,
    name: { fr: "Box Éclat de Rose", ar: "علبة إشراقة الورد" },
    short: { fr: "Bougie parfumée, roses éternelles & douceurs", ar: "شمعة معطّرة، ورود أبدية وحلويات" },
    desc: {
      fr: "Une box tendre comme un premier bouquet. Des roses éternelles poudrées, une bougie aux notes de pivoine et de musc blanc, et quelques douceurs choisies avec soin, le tout niché dans un papier de soie. Pour dire « je pense à toi » avec une infinie délicatesse.",
      ar: "علبة رقيقة كأول باقة ورد. ورود أبدية بلون وردي ناعم، شمعة بعبير الفاوانيا والمسك الأبيض، وحلويات مختارة بعناية، ملفوفة في ورق حريري. لتقولي «أفكر فيك» بكل رقة."
    },
    includes: { fr: ["Roses éternelles en écrin", "Bougie parfumée pivoine & musc (180 g)", "Chocolats artisanaux", "Carte message personnalisée"], ar: ["ورود أبدية في علبة", "شمعة معطرة بالفاوانيا والمسك", "شوكولاتة حرفية", "بطاقة رسالة مخصصة"] },
    art: { v: "box", b: "#f4d6d1", l: "#f8e3df", r: "#c9a25a", bg: "#fbeeea", deco: "rose" }
  },
  {
    id: "box-mon-amour", occasion: ["saint-valentin"], recipient: ["elle", "couple"],
    price: 119, oldPrice: 135, bestseller: true, badge: "promo", rating: 5, reviews: 82,
    name: { fr: "Box Mon Amour", ar: "علبة حبيبي" },
    short: { fr: "Cadre photo gravé, parfum d'ambiance & chocolats", ar: "إطار صورة محفور، عطر منزلي وشوكولاتة" },
    desc: {
      fr: "Parce que votre histoire mérite d'être racontée. Un cadre en bois gravé de vos prénoms et de votre date, une photo imprimée sur papier d'art, un parfum d'ambiance aux notes de rose et de vanille, et des chocolats en forme de cœur. Un écrin pour vos plus beaux souvenirs à deux.",
      ar: "لأن قصتكما تستحق أن تُروى. إطار خشبي محفور بأسمائكما وتاريخكما، صورة مطبوعة على ورق فني، عطر منزلي بنفحات الورد والفانيليا، وشوكولاتة على شكل قلب."
    },
    includes: { fr: ["Cadre en bois gravé (prénoms + date)", "Photo imprimée sur papier d'art", "Parfum d'ambiance rose & vanille", "Chocolats cœur"], ar: ["إطار خشبي محفور", "صورة مطبوعة على ورق فني", "عطر منزلي بالورد والفانيليا", "شوكولاتة على شكل قلب"] },
    art: { v: "round", b: "#e7b3ae", l: "#f0c8c3", r: "#8e3b46", bg: "#f8e4e1", deco: "heart" }
  },
  {
    id: "coffret-oui-pour-la-vie", occasion: ["mariage"], recipient: ["couple"],
    price: 159, bestseller: true, badge: "best", rating: 4.9, reviews: 37,
    name: { fr: "Coffret Oui pour la vie", ar: "صندوق نعم للأبد" },
    short: { fr: "Deux flûtes gravées, bougie & livre d'or", ar: "كأسان محفوران، شمعة ودفتر ذكريات" },
    desc: {
      fr: "Un coffret ivoire et or pour célébrer le plus beau des « oui ». Deux flûtes gravées des prénoms des mariés, une bougie aux fleurs blanches, un carnet de souvenirs relié en lin et des dragées délicates. Un cadeau qui accompagnera leurs premiers pas de jeunes mariés.",
      ar: "صندوق عاجي وذهبي للاحتفال بأجمل «نعم». كأسان محفوران بأسماء العروسين، شمعة بعبير الزهور البيضاء، دفتر ذكريات مغلف بالكتان، وملبّس رقيق."
    },
    includes: { fr: ["2 flûtes gravées aux prénoms", "Bougie fleurs blanches", "Carnet de souvenirs en lin", "Dragées amandes"], ar: ["كأسان محفوران بالأسماء", "شمعة الزهور البيضاء", "دفتر ذكريات من الكتان", "ملبّس باللوز"] },
    art: { v: "box", b: "#f5eee2", l: "#fbf6ec", r: "#c9a25a", bg: "#f6f0e6", deco: "rings" }
  },
  {
    id: "box-petit-tresor", occasion: ["naissance"], recipient: ["enfant"],
    price: 99, bestseller: true, badge: "new", rating: 5, reviews: 41,
    name: { fr: "Box Petit Trésor", ar: "علبة الكنز الصغير" },
    short: { fr: "Doudou, lange brodé au prénom & carnet de naissance", ar: "دمية ناعمة، قماط مطرّز بالاسم ودفتر الولادة" },
    desc: {
      fr: "Pour accueillir un tout petit cœur. Un doudou tout doux, un lange en gaze de coton brodé à son prénom, un carnet pour noter ses premières fois et une jolie veilleuse étoile. Une box douce comme une berceuse, pour les nouveaux parents et leur petit trésor.",
      ar: "لاستقبال قلب صغير. دمية ناعمة، قماط قطني مطرّز باسمه، دفتر لتدوين لحظاته الأولى ومصباح ليلي على شكل نجمة. علبة ناعمة كتهويدة."
    },
    includes: { fr: ["Doudou lapin en coton bio", "Lange brodé au prénom", "Carnet « Mes premières fois »", "Veilleuse étoile"], ar: ["دمية أرنب من القطن العضوي", "قماط مطرّز بالاسم", "دفتر «أولى لحظاتي»", "مصباح ليلي نجمة"] },
    art: { v: "open", b: "#dcefe5", l: "#e9f6ef", r: "#f3ead9", bg: "#eef8f2", deco: "star" }
  },
  {
    id: "box-maman-cherie", occasion: ["fete-parents"], recipient: ["elle"],
    price: 95, bestseller: true, rating: 4.8, reviews: 58,
    name: { fr: "Box Maman Chérie", ar: "علبة أمي الغالية" },
    short: { fr: "Tasse gravée, thé fleuri, crème mains & fleurs séchées", ar: "كوب محفور، شاي بالزهور، كريم يدين وزهور مجففة" },
    desc: {
      fr: "Pour celle qui a toujours su trouver les mots. Une tasse en céramique gravée d'un message, un thé aux pétales de rose, une crème pour les mains au karité et un petit bouquet de fleurs séchées. Un moment de douceur rien que pour elle, parce qu'elle le mérite tant.",
      ar: "لمن عرفت دائماً كيف تجد الكلمات. كوب سيراميك محفور برسالة، شاي بتلات الورد، كريم يدين بزبدة الشيا وباقة زهور مجففة. لحظة دفء لها وحدها."
    },
    includes: { fr: ["Tasse céramique gravée", "Thé aux pétales de rose", "Crème mains karité", "Bouquet de fleurs séchées"], ar: ["كوب سيراميك محفور", "شاي بتلات الورد", "كريم يدين بالشيا", "باقة زهور مجففة"] },
    art: { v: "box", b: "#ecdccd", l: "#f3e7da", r: "#e8b9b3", bg: "#f7eee6", deco: "flower" }
  },
  {
    id: "box-gentleman", occasion: ["anniversaire", "fete-parents"], recipient: ["lui"],
    price: 109, bestseller: true, rating: 4.8, reviews: 33,
    name: { fr: "Box Gentleman", ar: "علبة الجنتلمان" },
    short: { fr: "Portefeuille en cuir gravé, bougie boisée & café", ar: "محفظة جلدية محفورة، شمعة خشبية وقهوة" },
    desc: {
      fr: "Élégante et chaleureuse, comme lui. Un portefeuille en cuir gravé de ses initiales, une bougie aux notes de cèdre et de tabac blond, un café de spécialité et un carnet en kraft. Pour un père, un frère, un mari ou un ami qui compte.",
      ar: "أنيقة ودافئة مثله. محفظة جلدية محفورة بالأحرف الأولى من اسمه، شمعة بعبير الأرز، قهوة مختصة ودفتر كرافت. لأب أو أخ أو زوج أو صديق عزيز."
    },
    includes: { fr: ["Portefeuille cuir gravé aux initiales", "Bougie cèdre & tabac blond", "Café de spécialité 250 g", "Carnet kraft"], ar: ["محفظة جلدية محفورة", "شمعة الأرز", "قهوة مختصة 250 غ", "دفتر كرافت"] },
    art: { v: "box", b: "#c9a37c", l: "#d6b48f", r: "#3b302b", bg: "#efe2d2", deco: "star" }
  },
  {
    id: "box-merci-du-fond-du-coeur", occasion: ["remerciements"], recipient: ["elle", "lui"],
    price: 55, bestseller: true, rating: 4.9, reviews: 49,
    name: { fr: "Box Merci du fond du cœur", ar: "علبة شكراً من القلب" },
    short: { fr: "Mini bougie, biscuits fins & carte « Merci »", ar: "شمعة صغيرة، بسكويت فاخر وبطاقة «شكراً»" },
    desc: {
      fr: "Certains mercis méritent plus qu'un simple mot. Une mini bougie parfumée, des biscuits fins au beurre, un savon artisanal et une carte « Merci » calligraphiée. L'attention idéale pour une maîtresse, une collègue, une amie qui a toujours été là.",
      ar: "بعض كلمات الشكر تستحق أكثر من مجرد كلمة. شمعة صغيرة معطرة، بسكويت بالزبدة، صابون حرفي وبطاقة «شكراً» بخط اليد. هدية مثالية لمعلمة أو زميلة أو صديقة."
    },
    includes: { fr: ["Mini bougie parfumée", "Biscuits fins au beurre", "Savon artisanal", "Carte « Merci » calligraphiée"], ar: ["شمعة صغيرة معطرة", "بسكويت بالزبدة", "صابون حرفي", "بطاقة شكر بخط اليد"] },
    art: { v: "box", b: "#fbf6ec", l: "#ffffff", r: "#3e9b78", bg: "#eef8f2", deco: "thanks" }
  },
  {
    id: "box-douce-nuit", occasion: ["anniversaire", "remerciements"], recipient: ["elle"],
    price: 79, rating: 4.7, reviews: 22,
    name: { fr: "Box Douce Nuit", ar: "علبة ليلة هانئة" },
    short: { fr: "Masque en soie, tisane & brume d'oreiller", ar: "قناع نوم حريري، شاي أعشاب ورذاذ وسادة" },
    desc: {
      fr: "Une invitation à ralentir. Un masque de nuit en satin de soie, une tisane apaisante à la camomille, une brume d'oreiller à la lavande et une bougie aux notes de coton. Pour offrir ce qu'il y a de plus précieux : du temps pour soi.",
      ar: "دعوة للتمهل. قناع نوم من الساتان، شاي البابونج المهدئ، رذاذ وسادة باللافندر وشمعة بعبير القطن. لتهدي أثمن شيء: وقتاً للنفس."
    },
    includes: { fr: ["Masque de nuit en satin", "Tisane camomille", "Brume d'oreiller lavande", "Bougie coton"], ar: ["قناع نوم ساتان", "شاي البابونج", "رذاذ وسادة باللافندر", "شمعة القطن"] },
    art: { v: "round", b: "#e9dfee", l: "#f1eaf4", r: "#c9a25a", bg: "#f5f0f6", deco: "star" }
  },
  {
    id: "box-premier-anniversaire", occasion: ["anniversaire", "naissance"], recipient: ["enfant"],
    price: 85, rating: 4.9, reviews: 18,
    name: { fr: "Box Ma première bougie", ar: "علبة شمعتي الأولى" },
    short: { fr: "Livre illustré, peluche & couronne au prénom", ar: "كتاب مصور، دمية وتاج بالاسم" },
    desc: {
      fr: "Pour souffler sa toute première bougie avec des étoiles plein les yeux. Un livre illustré, une peluche douce, une couronne en feutrine brodée à son prénom et un petit sachet de confettis dorés. Une box joyeuse et tendre, pleine de promesses.",
      ar: "ليطفئ شمعته الأولى والنجوم تملأ عينيه. كتاب مصور، دمية ناعمة، تاج من اللباد مطرّز باسمه وكيس قصاصات ذهبية."
    },
    includes: { fr: ["Livre illustré", "Peluche douce", "Couronne brodée au prénom", "Confettis dorés"], ar: ["كتاب مصور", "دمية ناعمة", "تاج مطرّز بالاسم", "قصاصات ذهبية"] },
    art: { v: "open", b: "#f7e3c6", l: "#fbeedb", r: "#e8b9b3", bg: "#fbf3e7", deco: "cake" }
  },
  {
    id: "box-duo-complice", occasion: ["saint-valentin", "mariage"], recipient: ["couple"],
    price: 129, rating: 4.8, reviews: 26,
    name: { fr: "Box Duo Complice", ar: "علبة الثنائي المتناغم" },
    short: { fr: "2 tasses assorties, jeu pour couple & douceurs", ar: "كوبان متناسقان، لعبة للثنائي وحلويات" },
    desc: {
      fr: "Pour les amoureux qui rient ensemble. Deux tasses assorties gravées « Lui » et « Elle », un jeu de questions pour se (re)découvrir, un plaid tout doux et des douceurs à partager. Une box pensée pour créer de nouveaux souvenirs à deux.",
      ar: "للعشاق الذين يضحكون معاً. كوبان محفوران «هو» و«هي»، لعبة أسئلة لاكتشاف بعضكما من جديد، بطانية ناعمة وحلويات للمشاركة."
    },
    includes: { fr: ["2 tasses gravées « Lui & Elle »", "Jeu de questions pour couple", "Plaid doux", "Douceurs à partager"], ar: ["كوبان محفوران", "لعبة أسئلة للثنائي", "بطانية ناعمة", "حلويات للمشاركة"] },
    art: { v: "box", b: "#e7b3ae", l: "#efc5c0", r: "#fbf6ec", bg: "#f8e4e1", deco: "heart" }
  },
  {
    id: "box-papa-heros", occasion: ["fete-parents"], recipient: ["lui"],
    price: 89, rating: 4.7, reviews: 19,
    name: { fr: "Box Papa Héros", ar: "علبة أبي البطل" },
    short: { fr: "Porte-clés gravé, mug & chocolats noirs", ar: "ميدالية محفورة، كوب وشوكولاتة داكنة" },
    desc: {
      fr: "Pour le premier héros de notre vie. Un porte-clés en cuir gravé d'un petit mot, un mug « Meilleur papa du monde », des chocolats noirs intenses et une carte où les enfants peuvent dessiner. Simple, sincère et plein d'amour.",
      ar: "لبطل حياتنا الأول. ميدالية جلدية محفورة بكلمة صغيرة، كوب «أفضل أب في العالم»، شوكولاتة داكنة وبطاقة يرسم عليها الأطفال."
    },
    includes: { fr: ["Porte-clés cuir gravé", "Mug « Meilleur papa »", "Chocolats noirs 70 %", "Carte à dessiner"], ar: ["ميدالية جلدية محفورة", "كوب «أفضل أب»", "شوكولاتة داكنة", "بطاقة للرسم"] },
    art: { v: "round", b: "#d8c0a6", l: "#e3d0ba", r: "#3e9b78", bg: "#f2e8dc", deco: "star" }
  },
  {
    id: "box-bouquet-eternel", occasion: ["anniversaire", "saint-valentin", "fete-parents"], recipient: ["elle"],
    price: 69, rating: 4.9, reviews: 44,
    name: { fr: "Écrin Bouquet Éternel", ar: "علبة الباقة الأبدية" },
    short: { fr: "Roses éternelles dans une boîte chapeau", ar: "ورود أبدية في علبة أسطوانية" },
    desc: {
      fr: "Des roses qui ne fanent jamais, comme les sentiments sincères. Une boîte chapeau en velours garnie de roses éternelles, avec un ruban de soie et un petit mot glissé à l'intérieur. Elles garderont leur beauté pendant des années.",
      ar: "ورود لا تذبل أبداً، كالمشاعر الصادقة. علبة أسطوانية مخملية مليئة بالورود الأبدية، مع شريط حريري ورسالة صغيرة. تحتفظ بجمالها لسنوات."
    },
    includes: { fr: ["Boîte chapeau en velours", "Roses éternelles (durée 2 à 3 ans)", "Ruban de soie", "Petit mot personnalisé"], ar: ["علبة مخملية أسطوانية", "ورود أبدية تدوم سنوات", "شريط حريري", "رسالة مخصصة"] },
    art: { v: "round", b: "#f4d6d1", l: "#f8e3df", r: "#c9a25a", bg: "#fbeeea", deco: "rose" }
  },
  {
    id: "box-cocooning", occasion: ["remerciements", "anniversaire"], recipient: ["elle", "lui"],
    price: 99, rating: 4.8, reviews: 29,
    name: { fr: "Box Cocooning", ar: "علبة الدفء" },
    short: { fr: "Plaid, chaussettes douillettes, chocolat chaud", ar: "بطانية، جوارب دافئة وشوكولاتة ساخنة" },
    desc: {
      fr: "Un câlin qu'on peut envelopper. Un plaid en maille douce, une paire de chaussettes douillettes, un chocolat chaud gourmand, des guimauves et une bougie vanille. Pour les soirées d'hiver, les jours gris, ou simplement pour dire « prends soin de toi ».",
      ar: "عناق يمكن تغليفه. بطانية محبوكة ناعمة، جوارب دافئة، شوكولاتة ساخنة، مارشميلو وشمعة فانيليا. لأمسيات الشتاء أو لتقول «اعتنِ بنفسك»."
    },
    includes: { fr: ["Plaid en maille douce", "Chaussettes douillettes", "Chocolat chaud & guimauves", "Bougie vanille"], ar: ["بطانية محبوكة", "جوارب دافئة", "شوكولاتة ساخنة ومارشميلو", "شمعة فانيليا"] },
    art: { v: "open", b: "#ecdccd", l: "#f3e7da", r: "#b97c77", bg: "#f7eee6", deco: "heart" }
  },
  {
    id: "box-bebe-arrive", occasion: ["naissance"], recipient: ["couple", "enfant"],
    price: 139, rating: 5, reviews: 15,
    name: { fr: "Coffret Bébé arrive", ar: "صندوق المولود القادم" },
    short: { fr: "Pour les futurs parents : album, tisane & body brodé", ar: "للوالدين المنتظرين: ألبوم، شاي أعشاب ولباس مطرّز" },
    desc: {
      fr: "Pour les futurs parents qui comptent les jours. Un album de grossesse à remplir, un body brodé « Bientôt là », une tisane d'allaitement bio, une huile de massage douce et une paire de chaussons en laine. Parce que l'attente, elle aussi, se célèbre.",
      ar: "للوالدين اللذين يعدّان الأيام. ألبوم حمل، لباس مطرّز «قريباً هنا»، شاي أعشاب عضوي، زيت تدليك لطيف وحذاء صوفي صغير."
    },
    includes: { fr: ["Album de grossesse", "Body brodé « Bientôt là »", "Tisane bio", "Huile de massage", "Chaussons en laine"], ar: ["ألبوم الحمل", "لباس مطرّز", "شاي أعشاب عضوي", "زيت تدليك", "حذاء صوفي"] },
    art: { v: "box", b: "#dcefe5", l: "#e9f6ef", r: "#e8b9b3", bg: "#eef8f2", deco: "baby" }
  },
  {
    id: "box-signature-sur-mesure", occasion: ["sur-mesure"], recipient: ["elle", "lui", "enfant", "couple"],
    price: 45, priceFrom: true, rating: 5, reviews: 97, custom: true,
    name: { fr: "Box Signature sur mesure", ar: "علبة التوقيع حسب الطلب" },
    short: { fr: "Composez-la article par article, à votre image", ar: "صمّموها قطعة بقطعة على ذوقكم" },
    desc: {
      fr: "La box qui vous ressemble. Choisissez la taille, les articles, le message et l'emballage : nous assemblons chaque détail à la main, avec amour. Idéale quand aucune box ne raconte exactement votre histoire.",
      ar: "العلبة التي تشبهكم. اختاروا الحجم والقطع والرسالة والتغليف: نجمع كل تفصيل يدوياً وبحب."
    },
    includes: { fr: ["Box au choix (3 tailles)", "Articles à sélectionner", "Message personnalisé", "Emballage au choix"], ar: ["علبة حسب الاختيار", "قطع مختارة", "رسالة مخصصة", "تغليف حسب الاختيار"] },
    art: { v: "open", b: "#f4d6d1", l: "#f8e3df", r: "#c9a25a", bg: "#fbeeea", deco: "sparkle" }
  },
  {
    id: "mini-box-attention", occasion: ["remerciements", "anniversaire"], recipient: ["elle", "lui", "enfant"],
    price: 35, rating: 4.8, reviews: 52, badge: "new",
    name: { fr: "Mini Box Petite Attention", ar: "علبة صغيرة لفتة لطيفة" },
    short: { fr: "Bougie, chocolat & mot doux — tout petit, tout mignon", ar: "شمعة، شوكولاتة ورسالة لطيفة" },
    desc: {
      fr: "Les plus petites attentions laissent parfois les plus grands souvenirs. Une mini bougie, une tablette de chocolat artisanal et un petit mot doux, dans une boîte kraft nouée d'un ruban. Parfaite pour un sourire, sans raison.",
      ar: "أصغر اللفتات تترك أحياناً أجمل الذكريات. شمعة صغيرة، لوح شوكولاتة حرفية ورسالة لطيفة في علبة كرافت مربوطة بشريط."
    },
    includes: { fr: ["Mini bougie", "Chocolat artisanal", "Mot doux", "Boîte kraft & ruban"], ar: ["شمعة صغيرة", "شوكولاتة حرفية", "رسالة لطيفة", "علبة كرافت وشريط"] },
    art: { v: "box", b: "#c9a37c", l: "#d6b48f", r: "#e8b9b3", bg: "#efe2d2", deco: "heart" }
  }
];

/* ---------- Configurateur « Crée ta box » ---------- */
FANNI.builder = {
  boxes: [
    { id: "ecrin", fr: "L'Écrin", ar: "الصغيرة", price: 15, capacity: 3, descFr: "Petite box délicate · jusqu'à 3 articles", descAr: "علبة صغيرة · حتى 3 قطع", scale: 0.78 },
    { id: "classique", fr: "La Classique", ar: "الكلاسيكية", price: 25, capacity: 5, descFr: "Notre format préféré · jusqu'à 5 articles", descAr: "الحجم المفضل · حتى 5 قطع", scale: 0.9 },
    { id: "prestige", fr: "La Prestige", ar: "الفاخرة", price: 40, capacity: 8, descFr: "Grande box avec couvercle aimanté · jusqu'à 8 articles", descAr: "علبة كبيرة بغطاء مغناطيسي · حتى 8 قطع", scale: 1 }
  ],
  categories: [
    { id: "douceurs", fr: "Douceurs", ar: "حلويات" },
    { id: "bien-etre", fr: "Bien-être", ar: "عناية" },
    { id: "deco", fr: "Déco & souvenirs", ar: "ديكور وذكريات" },
    { id: "perso", fr: "Personnalisés", ar: "مخصص" },
    { id: "bebe", fr: "Bébé & enfant", ar: "رضيع وطفل" }
  ],
  items: [
    { id: "chocolats", cat: "douceurs", emoji: "🍫", fr: "Chocolats artisanaux", ar: "شوكولاتة حرفية", price: 18, color: "#6b4436" },
    { id: "macarons", cat: "douceurs", emoji: "🧁", fr: "Macarons (x6)", ar: "ماكرون (6)", price: 22, color: "#f0bfc0" },
    { id: "the", cat: "douceurs", emoji: "🍵", fr: "Thé aux pétales de rose", ar: "شاي بتلات الورد", price: 14, color: "#b8cfa3" },
    { id: "cafe", cat: "douceurs", emoji: "☕", fr: "Café de spécialité", ar: "قهوة مختصة", price: 20, color: "#8a5a3c" },
    { id: "miel", cat: "douceurs", emoji: "🍯", fr: "Miel & dragées", ar: "عسل وملبّس", price: 16, color: "#e0a93b" },
    { id: "bougie", cat: "bien-etre", emoji: "🕯️", fr: "Bougie parfumée", ar: "شمعة معطرة", price: 24, color: "#f3ead9" },
    { id: "savon", cat: "bien-etre", emoji: "🧼", fr: "Savon artisanal", ar: "صابون حرفي", price: 10, color: "#dcefe5" },
    { id: "creme", cat: "bien-etre", emoji: "🧴", fr: "Crème mains karité", ar: "كريم يدين بالشيا", price: 16, color: "#fbf6ec" },
    { id: "masque", cat: "bien-etre", emoji: "😴", fr: "Masque de nuit satin", ar: "قناع نوم ساتان", price: 19, color: "#e8b9b3" },
    { id: "chaussettes", cat: "bien-etre", emoji: "🧦", fr: "Chaussettes douillettes", ar: "جوارب دافئة", price: 12, color: "#d8c0a6" },
    { id: "roses", cat: "deco", emoji: "🌹", fr: "Roses éternelles", ar: "ورود أبدية", price: 35, color: "#d98a8a" },
    { id: "fleurs", cat: "deco", emoji: "💐", fr: "Bouquet de fleurs séchées", ar: "باقة زهور مجففة", price: 18, color: "#e6cf98" },
    { id: "cadre", cat: "deco", emoji: "🖼️", fr: "Cadre photo", ar: "إطار صورة", price: 22, color: "#c9a37c" },
    { id: "carnet", cat: "deco", emoji: "📔", fr: "Carnet en lin", ar: "دفتر من الكتان", price: 15, color: "#ecdccd" },
    { id: "bijou", cat: "deco", emoji: "💍", fr: "Bijou délicat plaqué or", ar: "قطعة مجوهرات مطلية بالذهب", price: 39, color: "#c9a25a" },
    { id: "tasse-gravee", cat: "perso", emoji: "☕", fr: "Tasse gravée au prénom", ar: "كوب محفور بالاسم", price: 25, color: "#ffffff", personal: true },
    { id: "porte-cles", cat: "perso", emoji: "🔑", fr: "Porte-clés cuir gravé", ar: "ميدالية جلدية محفورة", price: 18, color: "#8a5a3c", personal: true },
    { id: "photo-print", cat: "perso", emoji: "📷", fr: "Photo imprimée sur papier d'art", ar: "صورة مطبوعة على ورق فني", price: 12, color: "#f3ead9", personal: true },
    { id: "trousse", cat: "perso", emoji: "👝", fr: "Trousse brodée aux initiales", ar: "حقيبة مطرّزة بالأحرف", price: 28, color: "#f4d6d1", personal: true },
    { id: "doudou", cat: "bebe", emoji: "🧸", fr: "Doudou tout doux", ar: "دمية ناعمة", price: 26, color: "#e3d0ba" },
    { id: "lange", cat: "bebe", emoji: "👶", fr: "Lange brodé au prénom", ar: "قماط مطرّز بالاسم", price: 29, color: "#dcefe5", personal: true },
    { id: "livre", cat: "bebe", emoji: "📚", fr: "Livre illustré", ar: "كتاب مصور", price: 17, color: "#f7e3c6" }
  ],
  wrappings: [
    { id: "kraft", fr: "Papier kraft & ficelle", ar: "ورق كرافت وخيط", price: 0, box: "#c9a37c", lid: "#d6b48f", descFr: "Naturel et bohème", descAr: "طبيعي وبسيط" },
    { id: "soie", fr: "Papier de soie rose poudré", ar: "ورق حريري وردي", price: 5, box: "#f4d6d1", lid: "#f8e3df", descFr: "Tendre et romantique", descAr: "رقيق ورومانسي" },
    { id: "ivoire-or", fr: "Écrin ivoire & dorure", ar: "علبة عاجية مذهّبة", price: 10, box: "#f5eee2", lid: "#fbf6ec", descFr: "Chic et intemporel", descAr: "أنيق وخالد" },
    { id: "menthe", fr: "Écrin vert menthe", ar: "علبة بلون النعناع", price: 5, box: "#cfe9dc", lid: "#dcf1e5", descFr: "Frais, aux couleurs de la maison", descAr: "منعش بألوان المتجر" }
  ],
  extras: [
    { id: "fleurs-sechees", fr: "Brin de fleurs séchées sur le nœud", ar: "زهور مجففة على الشريط", price: 6 },
    { id: "sceau", fr: "Sceau de cire doré", ar: "ختم شمعي ذهبي", price: 4 },
    { id: "parfum", fr: "Papier parfumé à la rose", ar: "ورق معطّر بالورد", price: 3 }
  ]
};

FANNI.reviews = [
  { name: "Salma B.", city: "Tunis", fr: "J'ai offert la Box Mon Amour à mon mari pour nos 5 ans… Il a eu les larmes aux yeux. Chaque détail était parfait, jusqu'au petit mot écrit à la main. Merci Fanni 🤍", ar: "أهديت علبة حبيبي لزوجي في ذكرانا الخامسة… دمعت عيناه. كل تفصيل كان مثالياً. شكراً فاني 🤍", product: "box-mon-amour", rating: 5 },
  { name: "Yasmine K.", city: "Sousse", fr: "Une box sur mesure pour l'anniversaire de ma meilleure amie : l'emballage était sublime, on aurait dit un cadeau de conte de fées. Elle l'a gardée comme boîte à souvenirs !", ar: "علبة حسب الطلب لعيد ميلاد صديقتي: التغليف كان رائعاً كأنه هدية من حكاية خيالية.", product: "box-signature-sur-mesure", rating: 5 },
  { name: "Mehdi R.", city: "Sfax", fr: "Commande passée pour la fête des mères, livrée à temps et magnifiquement présentée. Ma mère n'arrête pas d'en parler. Un service attentionné et très réactif sur WhatsApp.", ar: "طلبت لعيد الأم، وصلت في الوقت ومقدمة بشكل رائع. أمي لا تتوقف عن الحديث عنها.", product: "box-maman-cherie", rating: 5 },
  { name: "Ines & Karim", city: "Nabeul", fr: "Nous avons reçu le coffret Oui pour la vie en cadeau de mariage. Les flûtes gravées sont devenues notre trésor. On sent l'amour mis dans chaque création ✨", ar: "تلقينا صندوق نعم للأبد هدية زفاف. الكؤوس المحفورة أصبحت كنزنا ✨", product: "coffret-oui-pour-la-vie", rating: 5 },
  { name: "Nour H.", city: "Bizerte", fr: "La Box Petit Trésor pour la naissance de ma nièce : douce, raffinée, avec son prénom brodé. Toute la famille a craqué !", ar: "علبة الكنز الصغير لولادة ابنة أختي: ناعمة وراقية مع اسمها المطرّز.", product: "box-petit-tresor", rating: 5 },
  { name: "Amira T.", city: "Monastir", fr: "J'avais une idée un peu floue, Fanni l'a transformée en une box qui racontait exactement notre histoire d'amitié. C'est rare de se sentir aussi bien écoutée.", ar: "كانت لدي فكرة غامضة، وحوّلتها فاني إلى علبة تحكي قصة صداقتنا بالضبط.", product: "box-eclat-de-rose", rating: 5 }
];
