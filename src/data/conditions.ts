export type ConditionCategory = 
  | "skin"
  | "hair"
  | "nails"
  | "infections"
  | "allergies"
  | "pigmentation";

export interface Condition {
  name: string;
  nameDE: string;
  category: ConditionCategory;
  description: string;
  descriptionDE: string;
}

export const categoryLabels: Record<ConditionCategory, string> = {
  skin: "Skin Conditions",
  hair: "Hair & Scalp",
  nails: "Nail Conditions",
  infections: "Infections",
  allergies: "Allergies & Reactions",
  pigmentation: "Pigmentation",
};

export const categoryLabelsDE: Record<ConditionCategory, string> = {
  skin: "Hauterkrankungen",
  hair: "Haar & Kopfhaut",
  nails: "Nagelerkrankungen",
  infections: "Infektionen",
  allergies: "Allergien & Reaktionen",
  pigmentation: "Pigmentierung",
};

export const categoryColors: Record<ConditionCategory, string> = {
  skin: "bg-primary/10 text-primary",
  hair: "bg-amber-100 text-amber-700",
  nails: "bg-rose-100 text-rose-700",
  infections: "bg-red-100 text-red-700",
  allergies: "bg-orange-100 text-orange-700",
  pigmentation: "bg-violet-100 text-violet-700",
};

export const conditions: Condition[] = [
  // Skin Conditions
  {
    name: "Acne",
    nameDE: "Akne",
    category: "skin",
    description: "A common skin condition causing pimples, blackheads, and cysts. It occurs when hair follicles become clogged with oil and dead skin cells, often affecting the face, chest, and back.",
    descriptionDE: "Eine häufige Hauterkrankung, die Pickel, Mitesser und Zysten verursacht. Sie entsteht, wenn Haarfollikel mit Öl und abgestorbenen Hautzellen verstopft werden.",
  },
  {
    name: "Eczema (Atopic Dermatitis)",
    nameDE: "Ekzem (Atopische Dermatitis)",
    category: "skin",
    description: "A chronic condition causing dry, itchy, and inflamed skin. It often appears in patches and can flare up periodically, commonly affecting the hands, feet, and creases of elbows and knees.",
    descriptionDE: "Eine chronische Erkrankung, die trockene, juckende und entzündete Haut verursacht. Sie tritt oft in Flecken auf und kann periodisch aufflammen.",
  },
  {
    name: "Psoriasis",
    nameDE: "Schuppenflechte (Psoriasis)",
    category: "skin",
    description: "An autoimmune condition causing rapid skin cell buildup, resulting in red, scaly patches. It commonly affects the scalp, elbows, knees, and lower back.",
    descriptionDE: "Eine Autoimmunerkrankung, die zu schnellem Hautzellaufbau führt und rote, schuppige Flecken verursacht. Betrifft häufig Kopfhaut, Ellbogen, Knie und unteren Rücken.",
  },
  {
    name: "Rosacea",
    nameDE: "Rosazea",
    category: "skin",
    description: "A chronic skin condition causing facial redness, visible blood vessels, and sometimes small, pus-filled bumps. It primarily affects the central face and can worsen over time.",
    descriptionDE: "Eine chronische Hauterkrankung, die Gesichtsrötung, sichtbare Blutgefäße und manchmal kleine, eitergefüllte Beulen verursacht.",
  },
  {
    name: "Skin Rashes",
    nameDE: "Hautausschläge",
    category: "skin",
    description: "Various types of skin irritation causing redness, itching, and changes in skin texture. Can be caused by allergies, infections, or other underlying conditions.",
    descriptionDE: "Verschiedene Arten von Hautreizungen, die Rötung, Juckreiz und Veränderungen der Hauttextur verursachen. Können durch Allergien, Infektionen oder andere Erkrankungen verursacht werden.",
  },
  {
    name: "Seborrheic Dermatitis",
    nameDE: "Seborrhoische Dermatitis",
    category: "skin",
    description: "A common skin condition causing scaly patches, red skin, and stubborn dandruff. It mainly affects oily areas of the body like the scalp, face, and chest.",
    descriptionDE: "Eine häufige Hauterkrankung, die schuppige Flecken, rote Haut und hartnäckige Schuppen verursacht. Betrifft hauptsächlich fettige Körperbereiche.",
  },
  {
    name: "Contact Dermatitis",
    nameDE: "Kontaktdermatitis",
    category: "skin",
    description: "A red, itchy rash caused by direct contact with a substance or an allergic reaction. Common triggers include soaps, cosmetics, jewelry, and plants.",
    descriptionDE: "Ein roter, juckender Ausschlag, der durch direkten Kontakt mit einer Substanz oder eine allergische Reaktion verursacht wird.",
  },
  {
    name: "Perioral Dermatitis",
    nameDE: "Periorale Dermatitis",
    category: "skin",
    description: "A facial rash causing redness, bumps, and scaling around the mouth, nose, and sometimes eyes. It's often triggered by topical steroids or certain skincare products.",
    descriptionDE: "Ein Gesichtsausschlag, der Rötung, Beulen und Schuppung um Mund, Nase und manchmal Augen verursacht.",
  },
  {
    name: "Keratosis Pilaris",
    nameDE: "Keratosis Pilaris",
    category: "skin",
    description: "A harmless skin condition causing small, rough bumps, often on the upper arms, thighs, and cheeks. It results from a buildup of keratin blocking hair follicles.",
    descriptionDE: "Eine harmlose Hauterkrankung, die kleine, raue Beulen verursacht, oft an Oberarmen, Oberschenkeln und Wangen.",
  },
  {
    name: "Dry Skin (Xerosis)",
    nameDE: "Trockene Haut (Xerose)",
    category: "skin",
    description: "A condition where the skin lacks moisture, leading to rough, scaly, or flaky patches. It can cause itching and discomfort, especially in cold, dry weather.",
    descriptionDE: "Ein Zustand, bei dem die Haut an Feuchtigkeit mangelt, was zu rauen, schuppigen oder flockigen Stellen führt.",
  },
  {
    name: "Hyperhidrosis",
    nameDE: "Hyperhidrose",
    category: "skin",
    description: "A condition causing excessive sweating beyond what's needed for body temperature regulation. It commonly affects the palms, feet, underarms, and face.",
    descriptionDE: "Eine Erkrankung, die übermäßiges Schwitzen verursacht. Betrifft häufig Handflächen, Füße, Achseln und Gesicht.",
  },
  {
    name: "Hidradenitis Suppurativa",
    nameDE: "Hidradenitis Suppurativa",
    category: "skin",
    description: "A chronic condition causing painful lumps under the skin, typically in areas where skin rubs together. It can lead to tunnels under the skin and scarring.",
    descriptionDE: "Eine chronische Erkrankung, die schmerzhafte Knoten unter der Haut verursacht, typischerweise in Bereichen, wo Haut aneinander reibt.",
  },
  {
    name: "Lichen Planus",
    nameDE: "Lichen Planus",
    category: "skin",
    description: "An inflammatory condition causing purplish, flat-topped bumps on the skin, mouth, or nails. It can also cause lacy white patches in the mouth.",
    descriptionDE: "Eine entzündliche Erkrankung, die purpurfarbene, flache Beulen auf Haut, Mund oder Nägeln verursacht.",
  },
  {
    name: "Moles (Nevi)",
    nameDE: "Muttermale (Nävi)",
    category: "skin",
    description: "Common skin growths that appear as small, dark brown spots. While usually harmless, changes in size, shape, or color should be evaluated for skin cancer.",
    descriptionDE: "Häufige Hautwucherungen, die als kleine, dunkelbraune Flecken erscheinen. Veränderungen sollten auf Hautkrebs untersucht werden.",
  },
  {
    name: "Skin Tags",
    nameDE: "Stielwarzen",
    category: "skin",
    description: "Small, soft, flesh-colored growths that hang off the skin. They're harmless and commonly appear in areas where skin folds, like the neck and armpits.",
    descriptionDE: "Kleine, weiche, hautfarbene Wucherungen, die von der Haut abhängen. Sie sind harmlos und treten häufig in Hautfalten auf.",
  },
  {
    name: "Cysts",
    nameDE: "Zysten",
    category: "skin",
    description: "Closed pockets of tissue that can be filled with fluid, pus, or other material. Epidermoid and sebaceous cysts are common and usually benign.",
    descriptionDE: "Geschlossene Gewebetaschen, die mit Flüssigkeit, Eiter oder anderem Material gefüllt sein können. Meist gutartig.",
  },
  
  // Hair & Scalp
  {
    name: "Hair Loss (Androgenetic Alopecia)",
    nameDE: "Haarausfall (Androgenetische Alopezie)",
    category: "hair",
    description: "The most common type of hair loss, also known as male or female pattern baldness. It's hereditary and results in gradual thinning and hair loss.",
    descriptionDE: "Die häufigste Art von Haarausfall, auch als männlicher oder weiblicher Haarausfall bekannt. Erblich bedingt mit allmählicher Ausdünnung.",
  },
  {
    name: "Alopecia Areata",
    nameDE: "Alopecia Areata",
    category: "hair",
    description: "An autoimmune condition causing sudden, patchy hair loss on the scalp or body. Hair may regrow on its own but can fall out again.",
    descriptionDE: "Eine Autoimmunerkrankung, die plötzlichen, fleckigen Haarausfall auf Kopfhaut oder Körper verursacht.",
  },
  {
    name: "Telogen Effluvium",
    nameDE: "Telogenes Effluvium",
    category: "hair",
    description: "Temporary hair shedding caused by stress, illness, hormonal changes, or nutritional deficiencies. Hair typically regrows once the underlying cause is addressed.",
    descriptionDE: "Vorübergehender Haarausfall, verursacht durch Stress, Krankheit, hormonelle Veränderungen oder Nährstoffmangel.",
  },
  {
    name: "Scalp Psoriasis",
    nameDE: "Kopfhaut-Psoriasis",
    category: "hair",
    description: "Psoriasis affecting the scalp, causing red, scaly patches that may extend beyond the hairline. It can cause significant itching and flaking.",
    descriptionDE: "Psoriasis, die die Kopfhaut betrifft und rote, schuppige Flecken verursacht, die über den Haaransatz hinausgehen können.",
  },
  {
    name: "Dandruff",
    nameDE: "Schuppen",
    category: "hair",
    description: "A common scalp condition causing white or gray flakes of dead skin. It can be accompanied by itching and is often related to seborrheic dermatitis.",
    descriptionDE: "Eine häufige Kopfhauterkrankung, die weiße oder graue Flocken abgestorbener Haut verursacht.",
  },
  {
    name: "Folliculitis",
    nameDE: "Follikulitis",
    category: "hair",
    description: "Inflammation of hair follicles, usually caused by bacterial or fungal infection. It appears as small red bumps or white-headed pimples around hair follicles.",
    descriptionDE: "Entzündung der Haarfollikel, meist durch bakterielle oder Pilzinfektion verursacht.",
  },
  {
    name: "Traction Alopecia",
    nameDE: "Traktionsalopezie",
    category: "hair",
    description: "Hair loss caused by repeated pulling or tension on hair from tight hairstyles. Early treatment can prevent permanent damage to hair follicles.",
    descriptionDE: "Haarausfall durch wiederholtes Ziehen oder Spannung an den Haaren durch enge Frisuren.",
  },
  {
    name: "Trichotillomania",
    nameDE: "Trichotillomanie",
    category: "hair",
    description: "A condition involving recurrent, compulsive urges to pull out one's hair. It can result in noticeable hair loss and significant distress.",
    descriptionDE: "Eine Erkrankung mit wiederkehrenden, zwanghaften Impulsen, sich die Haare auszureißen.",
  },
  {
    name: "Scalp Folliculitis",
    nameDE: "Kopfhaut-Follikulitis",
    category: "hair",
    description: "Infection of hair follicles on the scalp, causing itchy, painful bumps. It can be caused by bacteria, fungi, or inflammation.",
    descriptionDE: "Infektion der Haarfollikel auf der Kopfhaut, die juckende, schmerzhafte Beulen verursacht.",
  },
  
  // Nail Conditions
  {
    name: "Nail Fungus (Onychomycosis)",
    nameDE: "Nagelpilz (Onychomykose)",
    category: "nails",
    description: "A common fungal infection causing thickened, discolored, and brittle nails. It typically affects toenails and can spread without treatment.",
    descriptionDE: "Eine häufige Pilzinfektion, die verdickte, verfärbte und brüchige Nägel verursacht.",
  },
  {
    name: "Ingrown Toenails",
    nameDE: "Eingewachsene Zehennägel",
    category: "nails",
    description: "A condition where the nail grows into the surrounding skin, causing pain, swelling, and sometimes infection. It most commonly affects the big toe.",
    descriptionDE: "Ein Zustand, bei dem der Nagel in die umgebende Haut wächst und Schmerzen, Schwellung und manchmal Infektion verursacht.",
  },
  {
    name: "Nail Psoriasis",
    nameDE: "Nagel-Psoriasis",
    category: "nails",
    description: "Psoriasis affecting the nails, causing pitting, abnormal nail growth, and discoloration. It can occur with or without skin psoriasis.",
    descriptionDE: "Psoriasis, die die Nägel betrifft und Grübchenbildung, abnormales Nagelwachstum und Verfärbung verursacht.",
  },
  {
    name: "Paronychia",
    nameDE: "Paronychie",
    category: "nails",
    description: "An infection of the skin around the nail, causing redness, swelling, and pain. It can be acute (bacterial) or chronic (often fungal).",
    descriptionDE: "Eine Infektion der Haut um den Nagel, die Rötung, Schwellung und Schmerzen verursacht.",
  },
  {
    name: "Brittle Nails",
    nameDE: "Brüchige Nägel",
    category: "nails",
    description: "Nails that are dry, weak, and prone to splitting or breaking. It can be caused by aging, frequent hand washing, or nutritional deficiencies.",
    descriptionDE: "Nägel, die trocken, schwach und anfällig für Splittern oder Brechen sind.",
  },
  {
    name: "Nail Ridges",
    nameDE: "Nagelrillen",
    category: "nails",
    description: "Vertical or horizontal lines on the nails. Vertical ridges are usually harmless and increase with age, while horizontal ridges may indicate underlying health issues.",
    descriptionDE: "Vertikale oder horizontale Linien auf den Nägeln. Vertikale Rillen sind meist harmlos.",
  },
  {
    name: "White Spots on Nails",
    nameDE: "Weiße Flecken auf Nägeln",
    category: "nails",
    description: "Small white marks or spots on the nails, usually caused by minor trauma. They're generally harmless and grow out with the nail.",
    descriptionDE: "Kleine weiße Markierungen oder Flecken auf den Nägeln, meist durch leichte Verletzungen verursacht.",
  },
  
  // Infections
  {
    name: "Herpes Simplex",
    nameDE: "Herpes Simplex",
    category: "infections",
    description: "A viral infection causing cold sores (HSV-1) or genital herpes (HSV-2). It causes painful blisters and can recur throughout life.",
    descriptionDE: "Eine Virusinfektion, die Lippenherpes (HSV-1) oder Genitalherpes (HSV-2) verursacht.",
  },
  {
    name: "Shingles (Herpes Zoster)",
    nameDE: "Gürtelrose (Herpes Zoster)",
    category: "infections",
    description: "A viral infection causing a painful rash, usually appearing as a stripe of blisters on one side of the body. It's caused by the reactivation of the chickenpox virus.",
    descriptionDE: "Eine Virusinfektion, die einen schmerzhaften Ausschlag verursacht, meist als Blasenstreifen auf einer Körperseite.",
  },
  {
    name: "Warts",
    nameDE: "Warzen",
    category: "infections",
    description: "Benign skin growths caused by the human papillomavirus (HPV). They can appear anywhere on the body and may spread through contact.",
    descriptionDE: "Gutartige Hautwucherungen, die durch das humane Papillomavirus (HPV) verursacht werden.",
  },
  {
    name: "Molluscum Contagiosum",
    nameDE: "Molluscum Contagiosum",
    category: "infections",
    description: "A viral skin infection causing small, raised, flesh-colored bumps with a dimpled center. It spreads through direct contact and is common in children.",
    descriptionDE: "Eine virale Hautinfektion, die kleine, erhabene, hautfarbene Beulen mit eingedellter Mitte verursacht.",
  },
  {
    name: "Impetigo",
    nameDE: "Impetigo",
    category: "infections",
    description: "A highly contagious bacterial skin infection causing red sores that can break open, ooze, and form a yellow-brown crust. It commonly affects children.",
    descriptionDE: "Eine hochansteckende bakterielle Hautinfektion, die rote Wunden verursacht, die aufbrechen und eine gelbbraune Kruste bilden können.",
  },
  {
    name: "Cellulitis",
    nameDE: "Zellulitis",
    category: "infections",
    description: "A bacterial skin infection causing red, swollen, and painful skin. It can spread rapidly and requires prompt antibiotic treatment.",
    descriptionDE: "Eine bakterielle Hautinfektion, die rote, geschwollene und schmerzhafte Haut verursacht.",
  },
  {
    name: "Ringworm (Tinea)",
    nameDE: "Ringelflechte (Tinea)",
    category: "infections",
    description: "A fungal infection causing a circular, red, itchy rash with clearer skin in the middle. Despite its name, it's not caused by a worm.",
    descriptionDE: "Eine Pilzinfektion, die einen kreisförmigen, roten, juckenden Ausschlag mit hellerer Haut in der Mitte verursacht.",
  },
  {
    name: "Athlete's Foot",
    nameDE: "Fußpilz",
    category: "infections",
    description: "A fungal infection affecting the feet, causing itching, burning, and cracked skin, especially between the toes. It thrives in warm, moist environments.",
    descriptionDE: "Eine Pilzinfektion der Füße, die Juckreiz, Brennen und rissige Haut verursacht, besonders zwischen den Zehen.",
  },
  {
    name: "Jock Itch",
    nameDE: "Leistenpilz",
    category: "infections",
    description: "A fungal infection causing an itchy, red rash in the groin area. It's common in athletes and people who sweat heavily.",
    descriptionDE: "Eine Pilzinfektion, die einen juckenden, roten Ausschlag im Leistenbereich verursacht.",
  },
  {
    name: "Scabies",
    nameDE: "Krätze",
    category: "infections",
    description: "A contagious skin infestation caused by tiny mites that burrow into the skin. It causes intense itching and a pimple-like rash.",
    descriptionDE: "Ein ansteckender Hautbefall durch winzige Milben, die sich in die Haut graben. Verursacht intensiven Juckreiz.",
  },
  {
    name: "Lice",
    nameDE: "Läuse",
    category: "infections",
    description: "Parasitic insects that live on the scalp, body, or pubic area. They cause intense itching and are spread through close personal contact.",
    descriptionDE: "Parasitäre Insekten, die auf Kopfhaut, Körper oder Schambereich leben. Verursachen intensiven Juckreiz.",
  },
  
  // Allergies & Reactions
  {
    name: "Hives (Urticaria)",
    nameDE: "Nesselsucht (Urtikaria)",
    category: "allergies",
    description: "Raised, itchy welts on the skin that appear suddenly. They can be triggered by allergies, stress, infections, or medications.",
    descriptionDE: "Erhabene, juckende Quaddeln auf der Haut, die plötzlich auftreten. Können durch Allergien, Stress, Infektionen oder Medikamente ausgelöst werden.",
  },
  {
    name: "Angioedema",
    nameDE: "Angioödem",
    category: "allergies",
    description: "Swelling beneath the skin, often around the eyes, lips, hands, and feet. It frequently occurs with hives and can be triggered by allergies.",
    descriptionDE: "Schwellung unter der Haut, oft um Augen, Lippen, Hände und Füße. Tritt häufig mit Nesselsucht auf.",
  },
  {
    name: "Drug Eruptions",
    nameDE: "Arzneimittelexanthem",
    category: "allergies",
    description: "Skin reactions caused by medications, ranging from mild rashes to severe conditions. They can appear days to weeks after starting a new medication.",
    descriptionDE: "Hautreaktionen durch Medikamente, von leichten Ausschlägen bis zu schweren Zuständen.",
  },
  {
    name: "Allergic Contact Dermatitis",
    nameDE: "Allergische Kontaktdermatitis",
    category: "allergies",
    description: "An allergic reaction causing a red, itchy rash after contact with an allergen like poison ivy, nickel, or fragrances.",
    descriptionDE: "Eine allergische Reaktion, die einen roten, juckenden Ausschlag nach Kontakt mit einem Allergen verursacht.",
  },
  {
    name: "Photodermatitis",
    nameDE: "Photodermatitis",
    category: "allergies",
    description: "A skin reaction to sunlight, causing redness, itching, and sometimes blisters. It can be triggered by certain medications or skin products.",
    descriptionDE: "Eine Hautreaktion auf Sonnenlicht, die Rötung, Juckreiz und manchmal Blasen verursacht.",
  },
  {
    name: "Latex Allergy",
    nameDE: "Latexallergie",
    category: "allergies",
    description: "An allergic reaction to proteins in natural rubber latex. It can cause skin rashes, hives, and in severe cases, anaphylaxis.",
    descriptionDE: "Eine allergische Reaktion auf Proteine in Naturkautschuk-Latex. Kann Hautausschläge, Nesselsucht und in schweren Fällen Anaphylaxie verursachen.",
  },
  
  // Pigmentation
  {
    name: "Vitiligo",
    nameDE: "Vitiligo",
    category: "pigmentation",
    description: "A condition causing loss of skin pigment in patches. It occurs when melanocytes are destroyed and can affect any area of the body.",
    descriptionDE: "Eine Erkrankung, die fleckigen Verlust von Hautpigment verursacht. Kann jeden Körperbereich betreffen.",
  },
  {
    name: "Melasma",
    nameDE: "Melasma",
    category: "pigmentation",
    description: "Brown or gray-brown patches on the face, often triggered by sun exposure, hormonal changes, or pregnancy. It's sometimes called the 'mask of pregnancy.'",
    descriptionDE: "Braune oder graubraune Flecken im Gesicht, oft ausgelöst durch Sonneneinstrahlung, hormonelle Veränderungen oder Schwangerschaft.",
  },
  {
    name: "Age Spots (Solar Lentigines)",
    nameDE: "Altersflecken (Sonnenflecken)",
    category: "pigmentation",
    description: "Flat, brown spots on sun-exposed areas of the skin. They're caused by years of sun exposure and are more common in people over 50.",
    descriptionDE: "Flache, braune Flecken auf sonnenexponierten Hautbereichen. Durch jahrelange Sonneneinstrahlung verursacht.",
  },
  {
    name: "Post-Inflammatory Hyperpigmentation",
    nameDE: "Postinflammatorische Hyperpigmentierung",
    category: "pigmentation",
    description: "Darkening of the skin following injury or inflammation, such as acne, eczema, or cuts. It's more common in darker skin tones.",
    descriptionDE: "Dunkelfärbung der Haut nach Verletzung oder Entzündung wie Akne, Ekzem oder Schnitten.",
  },
  {
    name: "Hypopigmentation",
    nameDE: "Hypopigmentierung",
    category: "pigmentation",
    description: "Lighter patches of skin caused by reduced melanin production. It can result from injury, infection, or certain skin conditions.",
    descriptionDE: "Hellere Hautflecken durch reduzierte Melaninproduktion. Kann durch Verletzung, Infektion oder bestimmte Hauterkrankungen entstehen.",
  },
  {
    name: "Albinism",
    nameDE: "Albinismus",
    category: "pigmentation",
    description: "A genetic condition causing little or no melanin production, resulting in very light skin, hair, and eyes. It increases sensitivity to sun damage.",
    descriptionDE: "Eine genetische Erkrankung mit wenig oder keiner Melaninproduktion, die zu sehr heller Haut, Haaren und Augen führt.",
  },
  {
    name: "Freckles",
    nameDE: "Sommersprossen",
    category: "pigmentation",
    description: "Small, flat, brown spots that appear on sun-exposed skin. They're caused by an increase in melanin and are often genetic.",
    descriptionDE: "Kleine, flache, braune Flecken auf sonnenexponierter Haut. Durch Melaninzunahme verursacht und oft genetisch bedingt.",
  },
  {
    name: "Birthmarks",
    nameDE: "Muttermale",
    category: "pigmentation",
    description: "Colored marks on the skin present at birth or appearing shortly after. They can be vascular (red) or pigmented (brown) and are usually harmless.",
    descriptionDE: "Farbige Markierungen auf der Haut, die bei der Geburt vorhanden sind oder kurz danach erscheinen. Meist harmlos.",
  },
];

// Featured conditions for homepage
export const featuredConditions = conditions.filter(c => 
  ["Acne", "Eczema (Atopic Dermatitis)", "Psoriasis", "Rosacea", "Hives (Urticaria)", "Hair Loss (Androgenetic Alopecia)"].includes(c.name)
).map(c => ({
  name: c.name === "Eczema (Atopic Dermatitis)" ? "Eczema" : c.name === "Hair Loss (Androgenetic Alopecia)" ? "Hair Loss" : c.name,
  description: c.name === "Eczema (Atopic Dermatitis)" 
    ? "Itchy, inflamed patches that can appear anywhere"
    : c.name === "Hair Loss (Androgenetic Alopecia)"
    ? "Thinning hair or bald patches on scalp"
    : c.description.split('.')[0],
}));
