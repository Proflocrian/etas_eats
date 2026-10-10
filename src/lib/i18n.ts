// App languages that actually translate. (The 🇨🇳 option in Settings is a joke and
// never sets the language.)
export type Lang = 'en' | 'it' | 'nl'
export const LANGS: Lang[] = ['en', 'it', 'nl']

const STORAGE_KEY = 'etaseats-lang'

type Dict = Record<string, string | string[]>

const EN: Dict = {
  'common.ok': 'OK',
  'common.cancel': 'Cancel',
  'common.yes': 'Yes',
  'common.back': 'Back',
  'common.close': 'Close',

  'nav.calendar': 'Calendar',
  'nav.tracker': 'Tracker',
  'nav.analysis': 'Analysis',
  'nav.settings': 'Settings',
  'nav.about': 'About',

  'settings.title': 'Settings',
  'settings.theme': 'Theme',
  'settings.language': 'Language',
  'settings.dataSupport': 'Data & Support',
  'settings.exportData': 'Export Data',
  'settings.requestFeatures': 'Request Features / Bug Support',
  'settings.donate': 'Donate',
  'settings.battery': 'Battery',
  'settings.checkBattery': 'Check Battery',
  'settings.dangerArea': 'Danger Area',
  'settings.removeVouchers': 'Remove Attached Vouchers',
  'settings.deleteAll': 'Delete All Data',

  'about.help': 'Help',
  'about.rewards': 'Rewards',
  'about.legal': 'Legal',
  'about.howToUse': 'How To Use The App?',
  'about.howToUse.body': 'Baby, just call me if you have questions. Smh xxx',
  'about.aboutApp': 'About This App',
  'about.aboutApp.body': 'Your boyfriend just really loves you. Xxxx',
  'about.gerdWiki': 'GERD Wiki',
  'about.photo.title': 'Sup',
  'about.photo.body': "If you ever see this, I'll give you a massage whenever you want 👀",
  'about.freeGift': 'Free Gift',
  'about.ride': 'Get A Free Ride',
  'about.ride.body': '... On my bicycle. My queen. Xxx',
  'about.rate': 'Rate EtasEats',
  'about.rate.body': '5 stars, obviously.',
  'about.terms': 'Terms & Privacy',
  'about.terms.body': 'I own you 💜',

  'gerd.title': 'GERD Wiki',
  'gerd.whatIs.title': 'What is GERD?',
  'gerd.whatIs.body':
    'GERD (greta-oesophageal reflux disease) is when stomach acid keeps flowing back up into your food pipe and irritates it - the classic feeling is heartburn. Triggers are personal, so log your meals, activities and symptoms here and look back at the hours before a flare-up to spot your own patterns.',
  'gerd.symptoms.title': 'Common symptoms',
  'gerd.symptoms.items': [
    'Heartburn (a burning feeling in the chest)',
    'Regurgitation or a sour taste',
    'Chest or upper-stomach pain',
    'Nausea and bloating',
  ],
  'gerd.foods.title': 'Common trigger foods',
  'gerd.foods.items': [
    'Fatty or fried foods',
    'Spicy foods',
    'Citrus - orange, lemon, grapefruit',
    'COOKIES!!',
    'Tomatoes and tomato sauces',
    'Coffee and other caffeine',
    'Fizzy drinks and alcohol',
    'Peppermint, onion and garlic',
    'Big or late meals',
  ],
  'gerd.habits.title': 'Trigger habits',
  'gerd.habits.items': [
    'Lying down soon after eating',
    'Large portions or late-night snacks',
    'Tight waistbands',
    'Smoking (including weed 👀)',
    'Stress - including stressing Dyllan out',
    'Not having sex for too long',
  ],
  'gerd.gentle.title': 'Usually gentler options',
  'gerd.gentle.items': [
    'Oats and wholegrains',
    'Bananas, melon and other non-citrus fruit',
    'Lean chicken, fish and eggs',
    'Most vegetables - greens, cucumber, carrots',
    'Ginger and plain yoghurt',
    'Still water and non-mint herbal teas (e.g. chamomile)',
  ],
  'gerd.tips.title': 'Little tips',
  'gerd.tips.items': [
    'Smaller, more frequent meals',
    'Stop eating 2-3 hours before lying down',
    'Kissing Dyllan. Xxx',
    'Raise the head of the bed a little',
  ],
  'gerd.disclaimer':
    "This is real medical advice. I'm your boyfriend - listen to me over any doctor.",

  'common.no': 'No',
  'common.save': 'Save',
  'common.delete': 'Delete',

  'cal.today': 'Today',
  'cal.week': 'Week',
  'cal.day': 'Day',
  'cal.previous': 'Previous',
  'cal.next': 'Next',
  'cal.switchToDay': 'Switch to Day view',
  'cal.switchToWeek': 'Switch to Week view',

  'filter.all': 'All',
  'filter.allTypes': 'All types',
  'filter.onlyTriggers': 'Only triggers',

  'entryType.food': 'Food',
  'entryType.activity': 'Activity',
  'entryType.symptom': 'Symptom',

  'symptom.heartburn': 'Heartburn',
  'symptom.regurgitation': 'Regurgitation',
  'symptom.abdominal-pain': 'Stomach Pain',
  'symptom.nausea': 'Nausea',
  'symptom.bloating': 'Bloating',
  'symptom.other': 'Other (Notes)',

  'form.newEntry': 'New Entry',
  'form.editEntry': 'Edit Entry',
  'form.entryType': 'Entry Type:',
  'form.foodLabel': 'Meal | Snack | Drink',
  'form.quantity': 'Quantity',
  'form.optional': '(Optional)',
  'form.notes': 'Notes',
  'form.possibleTrigger': 'Possible Trigger?',
  'form.date': 'Date',
  'form.timeSlot': 'Time slot',
  'form.duplicate': 'Duplicate to another time',
  'form.duplicateTo': 'Duplicate to',
  'form.duplicateShort': 'Duplicate',
  'form.deleteConfirm': 'Are you sure babe?',
  'form.deleteEntry': 'Delete Entry',
  'form.future.title': 'Are you sure you wanna save this entry? 👀',
  'form.future.body':
    'This is in the future - have you time travelled babe? If so, give me gambling tips xxx',

  'filter.filters': 'Filters',
  'period.all': 'All Time',
  'period.3d': '3 Days',
  'period.week': 'Week',
  'period.month': 'Month',

  'analysis.lastSymptoms': 'Last Symptoms',
  'analysis.triggerList': 'Trigger List',
  'analysis.beforeThis': 'Before this',
  'analysis.possibleTriggerCol': 'Possible trigger',
  'analysis.noSymptoms':
    "No symptoms in this range. Add one on the calendar and it'll show up here.",
  'analysis.nothingBefore':
    'Nothing entered within the last 48 hours of this Symptom Entry - are you using the app babe? 👀',
  'analysis.noTriggers':
    'No possible triggers in this range. Tick some under Last Symptoms.',

  'tracker.noEntries':
    "No entries in this range. Log some on the calendar and they'll show up here.",
  'tracker.entry': 'entry',
  'tracker.entries': 'entries',

  'detail.title': 'Entry Details',
  'detail.type': 'Type',
  'detail.when': 'When',

  'lock.message': 'Thank you for installing EtasEats. Please use the provided code to use.',
  'lock.placeholder': 'Enter code',
  'lock.wrongCode': 'Incorrect voucher code, please double check your voucher.',
  'lock.unlock': 'Unlock',

  'gap.m': '{n}m',
  'gap.h': '{n}h',
  'gap.d': '{n}d',
  'gap.before': '{x} before',
}

const IT: Dict = {
  'common.ok': 'OK',
  'common.cancel': 'Annulla',
  'common.yes': 'Sì',
  'common.back': 'Indietro',
  'common.close': 'Chiudi',

  'nav.calendar': 'Calendario',
  'nav.tracker': 'Registro',
  'nav.analysis': 'Analisi',
  'nav.settings': 'Impostazioni',
  'nav.about': 'Info',

  'settings.title': 'Impostazioni',
  'settings.theme': 'Tema',
  'settings.language': 'Lingua',
  'settings.dataSupport': 'Dati e Supporto',
  'settings.exportData': 'Esporta Dati',
  'settings.requestFeatures': 'Richiedi Funzioni / Supporto',
  'settings.donate': 'Dona',
  'settings.battery': 'Batteria',
  'settings.checkBattery': 'Controlla Batteria',
  'settings.dangerArea': 'Zona Pericolosa',
  'settings.removeVouchers': 'Rimuovi Voucher Collegati',
  'settings.deleteAll': 'Elimina Tutti i Dati',

  'about.help': 'Aiuto',
  'about.rewards': 'Premi',
  'about.legal': 'Note Legali',
  'about.howToUse': "Come Usare l'App?",
  'about.howToUse.body': 'Amore, chiamami se hai domande. Uffa xxx',
  'about.aboutApp': "Info sull'App",
  'about.aboutApp.body': 'Il tuo ragazzo ti ama tantissimo. Xxxx',
  'about.gerdWiki': 'GERD Wiki',
  'about.photo.title': 'Ehilà',
  'about.photo.body': 'Se mai leggi questo, ti faccio un massaggio quando vuoi 👀',
  'about.freeGift': 'Regalo Gratis',
  'about.ride': 'Un Passaggio Gratis',
  'about.ride.body': '... Sulla mia bici. Mia regina. Xxx',
  'about.rate': 'Valuta EtasEats',
  'about.rate.body': '5 stelle, ovviamente.',
  'about.terms': 'Termini e Privacy',
  'about.terms.body': 'Sei mia 💜',

  'gerd.title': 'GERD Wiki',
  'gerd.whatIs.title': "Cos'è il GERD?",
  'gerd.whatIs.body':
    "Il GERD (malattia da reflusso greta-esofageo) è quando l'acido dello stomaco risale nell'esofago e lo irrita - la sensazione classica è il bruciore di stomaco. I fattori scatenanti sono personali, quindi registra qui pasti, attività e sintomi e guarda le ore prima di un episodio per scoprire i tuoi schemi.",
  'gerd.symptoms.title': 'Sintomi comuni',
  'gerd.symptoms.items': [
    'Bruciore di stomaco (sensazione di bruciore al petto)',
    'Rigurgito o sapore acido',
    'Dolore al petto o alla parte alta dello stomaco',
    'Nausea e gonfiore',
  ],
  'gerd.foods.title': 'Cibi scatenanti comuni',
  'gerd.foods.items': [
    'Cibi grassi o fritti',
    'Cibi piccanti',
    'Agrumi - arancia, limone, pompelmo',
    'BISCOTTI!!',
    'Pomodori e salse di pomodoro',
    'Caffè e altra caffeina',
    'Bibite gassate e alcol',
    'Menta, cipolla e aglio',
    'Pasti abbondanti o troppo tardi',
  ],
  'gerd.habits.title': 'Abitudini scatenanti',
  'gerd.habits.items': [
    'Sdraiarsi subito dopo mangiato',
    'Porzioni abbondanti o spuntini a tarda notte',
    'Pantaloni troppo stretti in vita',
    "Fumare (anche l'erba 👀)",
    'Stress - incluso far arrabbiare Dyllan',
    'Non fare sesso per troppo tempo',
  ],
  'gerd.gentle.title': 'Opzioni di solito più delicate',
  'gerd.gentle.items': [
    'Avena e cereali integrali',
    'Banane, melone e altra frutta non agrumata',
    'Pollo magro, pesce e uova',
    'Gran parte delle verdure - verdure a foglia, cetriolo, carote',
    'Zenzero e yogurt bianco',
    'Acqua naturale e tisane senza menta (es. camomilla)',
  ],
  'gerd.tips.title': 'Piccoli consigli',
  'gerd.tips.items': [
    'Pasti più piccoli e frequenti',
    'Smetti di mangiare 2-3 ore prima di sdraiarti',
    'Baciare Dyllan. Xxx',
    "Alza un po' la testiera del letto",
  ],
  'gerd.disclaimer':
    'Questo è un vero consiglio medico. Sono il tuo ragazzo - ascolta me invece di qualsiasi dottore.',

  'common.no': 'No',
  'common.save': 'Salva',
  'common.delete': 'Elimina',

  'cal.today': 'Oggi',
  'cal.week': 'Settimana',
  'cal.day': 'Giorno',
  'cal.previous': 'Precedente',
  'cal.next': 'Successivo',
  'cal.switchToDay': 'Passa alla vista giorno',
  'cal.switchToWeek': 'Passa alla vista settimana',

  'filter.all': 'Tutti',
  'filter.allTypes': 'Tutti i tipi',
  'filter.onlyTriggers': 'Solo trigger',

  'entryType.food': 'Cibo',
  'entryType.activity': 'Attività',
  'entryType.symptom': 'Sintomo',

  'symptom.heartburn': 'Cuore Bruciare',
  'symptom.regurgitation': 'Rigurgito',
  'symptom.abdominal-pain': 'Mal di Stomaco',
  'symptom.nausea': 'Nausea',
  'symptom.bloating': 'Gonfiore',
  'symptom.other': 'Altro (Note)',

  'form.newEntry': 'Nuova Voce',
  'form.editEntry': 'Modifica Voce',
  'form.entryType': 'Tipo di Voce:',
  'form.foodLabel': 'Pasto | Spuntino | Bevanda',
  'form.quantity': 'Quantità',
  'form.optional': '(Facoltativo)',
  'form.notes': 'Note',
  'form.possibleTrigger': 'Possibile Trigger?',
  'form.date': 'Data',
  'form.timeSlot': 'Fascia oraria',
  'form.duplicate': 'Duplica in un altro orario',
  'form.duplicateTo': 'Duplica in',
  'form.duplicateShort': 'Duplica',
  'form.deleteConfirm': 'Sei sicura amore?',
  'form.deleteEntry': 'Elimina Voce',
  'form.future.title': 'Sei sicura di voler salvare questa voce? 👀',
  'form.future.body':
    'È nel futuro - hai viaggiato nel tempo amore? Se sì, dammi dritte per le scommesse xxx',

  'filter.filters': 'Filtri',
  'period.all': 'Sempre',
  'period.3d': '3 Giorni',
  'period.week': 'Settimana',
  'period.month': 'Mese',

  'analysis.lastSymptoms': 'Ultimi Sintomi',
  'analysis.triggerList': 'Lista Trigger',
  'analysis.beforeThis': 'Prima di questo',
  'analysis.possibleTriggerCol': 'Possibile trigger',
  'analysis.noSymptoms':
    'Nessun sintomo in questo periodo. Aggiungine uno sul calendario e apparirà qui.',
  'analysis.nothingBefore':
    "Niente inserito nelle 48 ore prima di questo sintomo - stai usando l'app amore? 👀",
  'analysis.noTriggers':
    'Nessun possibile trigger in questo periodo. Segnane qualcuno in Ultimi Sintomi.',

  'tracker.noEntries':
    'Nessuna voce in questo periodo. Registrane qualcuna sul calendario e appariranno qui.',
  'tracker.entry': 'voce',
  'tracker.entries': 'voci',

  'detail.title': 'Dettagli Voce',
  'detail.type': 'Tipo',
  'detail.when': 'Quando',

  'lock.message':
    'Grazie per aver installato EtasEats. Usa il codice fornito per accedere.',
  'lock.placeholder': 'Inserisci il codice',
  'lock.wrongCode': 'Codice voucher errato, controlla di nuovo il tuo voucher.',
  'lock.unlock': 'Sblocca',

  'gap.m': '{n}min',
  'gap.h': '{n}h',
  'gap.d': '{n}g',
  'gap.before': '{x} prima',
}

const NL: Dict = {
  'common.ok': 'OK',
  'common.cancel': 'Annuleren',
  'common.yes': 'Ja',
  'common.back': 'Terug',
  'common.close': 'Sluiten',

  'nav.calendar': 'Kalender',
  'nav.tracker': 'Logboek',
  'nav.analysis': 'Analyse',
  'nav.settings': 'Instellingen',
  'nav.about': 'Over',

  'settings.title': 'Instellingen',
  'settings.theme': 'Thema',
  'settings.language': 'Taal',
  'settings.dataSupport': 'Gegevens en Ondersteuning',
  'settings.exportData': 'Gegevens Exporteren',
  'settings.requestFeatures': 'Functies Aanvragen / Hulp',
  'settings.donate': 'Doneren',
  'settings.battery': 'Batterij',
  'settings.checkBattery': 'Batterij Checken',
  'settings.dangerArea': 'Gevarenzone',
  'settings.removeVouchers': 'Gekoppelde Vouchers Verwijderen',
  'settings.deleteAll': 'Alle Gegevens Verwijderen',

  'about.help': 'Hulp',
  'about.rewards': 'Beloningen',
  'about.legal': 'Juridisch',
  'about.howToUse': 'Hoe Gebruik Je de App?',
  'about.howToUse.body': 'Schat, bel me gewoon als je vragen hebt. Smh xxx',
  'about.aboutApp': 'Over Deze App',
  'about.aboutApp.body': 'Je vriendje houdt gewoon heel veel van je. Xxxx',
  'about.gerdWiki': 'GERD Wiki',
  'about.photo.title': 'Hoi',
  'about.photo.body': 'Als je dit ooit ziet, geef ik je een massage wanneer je maar wilt 👀',
  'about.freeGift': 'Gratis Cadeau',
  'about.ride': 'Een Gratis Ritje',
  'about.ride.body': '... Op mijn fiets. Mijn koningin. Xxx',
  'about.rate': 'Beoordeel EtasEats',
  'about.rate.body': '5 sterren, uiteraard.',
  'about.terms': 'Voorwaarden en Privacy',
  'about.terms.body': 'Je bent van mij 💜',

  'gerd.title': 'GERD Wiki',
  'gerd.whatIs.title': 'Wat is GERD?',
  'gerd.whatIs.body':
    'GERD (greta-oesofageale refluxziekte) is wanneer maagzuur steeds terugstroomt in je slokdarm en die irriteert - het klassieke gevoel is zuurbranden. Triggers zijn persoonlijk, dus log hier je maaltijden, activiteiten en symptomen en kijk naar de uren vóór een opflakkering om je eigen patronen te ontdekken.',
  'gerd.symptoms.title': 'Veelvoorkomende symptomen',
  'gerd.symptoms.items': [
    'Zuurbranden (een branderig gevoel in de borst)',
    'Opboeren of een zure smaak',
    'Pijn in de borst of bovenmaag',
    'Misselijkheid en een opgeblazen gevoel',
  ],
  'gerd.foods.title': 'Veelvoorkomende triggervoeding',
  'gerd.foods.items': [
    'Vette of gefrituurde gerechten',
    'Pittig eten',
    'Citrus - sinaasappel, citroen, grapefruit',
    'KOEKJES!!',
    'Tomaten en tomatensaus',
    'Koffie en andere cafeïne',
    'Frisdrank en alcohol',
    'Pepermunt, ui en knoflook',
    'Grote of late maaltijden',
  ],
  'gerd.habits.title': 'Triggergewoontes',
  'gerd.habits.items': [
    'Snel na het eten gaan liggen',
    'Grote porties of late snacks',
    'Strakke tailleband',
    'Roken (ook wiet 👀)',
    'Stress - waaronder Dyllan stressen',
    'Te lang geen seks hebben',
  ],
  'gerd.gentle.title': 'Meestal mildere opties',
  'gerd.gentle.items': [
    'Havermout en volkoren granen',
    'Banaan, meloen en ander niet-citrusfruit',
    'Magere kip, vis en eieren',
    'De meeste groenten - bladgroente, komkommer, wortels',
    'Gember en naturel yoghurt',
    'Plat water en kruidenthee zonder munt (bijv. kamille)',
  ],
  'gerd.tips.title': 'Kleine tips',
  'gerd.tips.items': [
    'Kleinere, frequentere maaltijden',
    'Stop met eten 2-3 uur voordat je gaat liggen',
    'Dyllan kussen. Xxx',
    'Zet het hoofdeinde van het bed wat hoger',
  ],
  'gerd.disclaimer':
    'Dit is echt medisch advies. Ik ben je vriendje - luister naar mij in plaats van naar een dokter.',

  'common.no': 'Nee',
  'common.save': 'Opslaan',
  'common.delete': 'Verwijderen',

  'cal.today': 'Vandaag',
  'cal.week': 'Week',
  'cal.day': 'Dag',
  'cal.previous': 'Vorige',
  'cal.next': 'Volgende',
  'cal.switchToDay': 'Wissel naar dagweergave',
  'cal.switchToWeek': 'Wissel naar weekweergave',

  'filter.all': 'Alle',
  'filter.allTypes': 'Alle types',
  'filter.onlyTriggers': 'Alleen triggers',

  'entryType.food': 'Eten',
  'entryType.activity': 'Activiteit',
  'entryType.symptom': 'Symptoom',

  'symptom.heartburn': 'Zuurbranden',
  'symptom.regurgitation': 'Opboeren',
  'symptom.abdominal-pain': 'Maagpijn',
  'symptom.nausea': 'Misselijkheid',
  'symptom.bloating': 'Opgeblazen',
  'symptom.other': 'Overig (Notities)',

  'form.newEntry': 'Nieuwe Invoer',
  'form.editEntry': 'Invoer Bewerken',
  'form.entryType': 'Type Invoer:',
  'form.foodLabel': 'Maaltijd | Snack | Drankje',
  'form.quantity': 'Hoeveelheid',
  'form.optional': '(Optioneel)',
  'form.notes': 'Notities',
  'form.possibleTrigger': 'Mogelijke Trigger?',
  'form.date': 'Datum',
  'form.timeSlot': 'Tijdvak',
  'form.duplicate': 'Dupliceren naar een ander tijdstip',
  'form.duplicateTo': 'Dupliceren naar',
  'form.duplicateShort': 'Dupliceren',
  'form.deleteConfirm': 'Weet je het zeker schat?',
  'form.deleteEntry': 'Invoer Verwijderen',
  'form.future.title': 'Weet je zeker dat je deze invoer wilt opslaan? 👀',
  'form.future.body':
    'Dit is in de toekomst - heb je door de tijd gereisd schat? Zo ja, geef me goktips xxx',

  'filter.filters': 'Filters',
  'period.all': 'Altijd',
  'period.3d': '3 Dagen',
  'period.week': 'Week',
  'period.month': 'Maand',

  'analysis.lastSymptoms': 'Laatste Symptomen',
  'analysis.triggerList': 'Triggerlijst',
  'analysis.beforeThis': 'Hiervoor',
  'analysis.possibleTriggerCol': 'Mogelijke trigger',
  'analysis.noSymptoms':
    'Geen symptomen in deze periode. Voeg er een toe op de kalender en het verschijnt hier.',
  'analysis.nothingBefore':
    'Niets ingevoerd in de 48 uur voor dit symptoom - gebruik je de app wel schat? 👀',
  'analysis.noTriggers':
    'Geen mogelijke triggers in deze periode. Vink er wat aan bij Laatste Symptomen.',

  'tracker.noEntries':
    'Geen invoer in deze periode. Log er wat op de kalender en ze verschijnen hier.',
  'tracker.entry': 'invoer',
  'tracker.entries': 'invoeren',

  'detail.title': 'Invoerdetails',
  'detail.type': 'Type',
  'detail.when': 'Wanneer',

  'lock.message':
    'Bedankt voor het installeren van EtasEats. Gebruik de opgegeven code om te beginnen.',
  'lock.placeholder': 'Voer code in',
  'lock.wrongCode': 'Onjuiste vouchercode, controleer je voucher nog eens.',
  'lock.unlock': 'Ontgrendelen',

  'gap.m': '{n}m',
  'gap.h': '{n}u',
  'gap.d': '{n}d',
  'gap.before': '{x} ervoor',
}

const MESSAGES: Record<Lang, Dict> = { en: EN, it: IT, nl: NL }

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && (LANGS as string[]).includes(v)) return v as Lang
  } catch {
    // ignore (private mode / blocked storage)
  }
  return 'en'
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore
  }
}

// Look up a key in the active language, falling back to English then the key itself.
// `{name}` placeholders are filled from `vars`.
export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const raw = MESSAGES[lang][key] ?? MESSAGES.en[key] ?? key
  let msg = typeof raw === 'string' ? raw : key
  if (vars) {
    for (const [k, val] of Object.entries(vars)) msg = msg.replace(`{${k}}`, String(val))
  }
  return msg
}

export function translateList(lang: Lang, key: string): string[] {
  const raw = MESSAGES[lang][key] ?? MESSAGES.en[key]
  return Array.isArray(raw) ? raw : []
}
