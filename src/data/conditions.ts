export type ConditionCategory = 
  | "skin"
  | "hair"
  | "nails"
  | "infections"
  | "allergies"
  | "pigmentation";

export interface Condition {
  name: string;
  category: ConditionCategory;
  description: string;
}

export const categoryLabels: Record<ConditionCategory, string> = {
  skin: "Skin Conditions",
  hair: "Hair & Scalp",
  nails: "Nail Conditions",
  infections: "Infections",
  allergies: "Allergies & Reactions",
  pigmentation: "Pigmentation",
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
    category: "skin",
    description: "A common skin condition causing pimples, blackheads, and cysts. It occurs when hair follicles become clogged with oil and dead skin cells, often affecting the face, chest, and back.",
  },
  {
    name: "Eczema (Atopic Dermatitis)",
    category: "skin",
    description: "A chronic condition causing dry, itchy, and inflamed skin. It often appears in patches and can flare up periodically, commonly affecting the hands, feet, and creases of elbows and knees.",
  },
  {
    name: "Psoriasis",
    category: "skin",
    description: "An autoimmune condition causing rapid skin cell buildup, resulting in red, scaly patches. It commonly affects the scalp, elbows, knees, and lower back.",
  },
  {
    name: "Rosacea",
    category: "skin",
    description: "A chronic skin condition causing facial redness, visible blood vessels, and sometimes small, pus-filled bumps. It primarily affects the central face and can worsen over time.",
  },
  {
    name: "Seborrheic Dermatitis",
    category: "skin",
    description: "A common skin condition causing scaly patches, red skin, and stubborn dandruff. It mainly affects oily areas of the body like the scalp, face, and chest.",
  },
  {
    name: "Contact Dermatitis",
    category: "skin",
    description: "A red, itchy rash caused by direct contact with a substance or an allergic reaction. Common triggers include soaps, cosmetics, jewelry, and plants.",
  },
  {
    name: "Perioral Dermatitis",
    category: "skin",
    description: "A facial rash causing redness, bumps, and scaling around the mouth, nose, and sometimes eyes. It's often triggered by topical steroids or certain skincare products.",
  },
  {
    name: "Keratosis Pilaris",
    category: "skin",
    description: "A harmless skin condition causing small, rough bumps, often on the upper arms, thighs, and cheeks. It results from a buildup of keratin blocking hair follicles.",
  },
  {
    name: "Dry Skin (Xerosis)",
    category: "skin",
    description: "A condition where the skin lacks moisture, leading to rough, scaly, or flaky patches. It can cause itching and discomfort, especially in cold, dry weather.",
  },
  {
    name: "Hyperhidrosis",
    category: "skin",
    description: "A condition causing excessive sweating beyond what's needed for body temperature regulation. It commonly affects the palms, feet, underarms, and face.",
  },
  {
    name: "Hidradenitis Suppurativa",
    category: "skin",
    description: "A chronic condition causing painful lumps under the skin, typically in areas where skin rubs together. It can lead to tunnels under the skin and scarring.",
  },
  {
    name: "Lichen Planus",
    category: "skin",
    description: "An inflammatory condition causing purplish, flat-topped bumps on the skin, mouth, or nails. It can also cause lacy white patches in the mouth.",
  },
  {
    name: "Moles (Nevi)",
    category: "skin",
    description: "Common skin growths that appear as small, dark brown spots. While usually harmless, changes in size, shape, or color should be evaluated for skin cancer.",
  },
  {
    name: "Skin Tags",
    category: "skin",
    description: "Small, soft, flesh-colored growths that hang off the skin. They're harmless and commonly appear in areas where skin folds, like the neck and armpits.",
  },
  {
    name: "Cysts",
    category: "skin",
    description: "Closed pockets of tissue that can be filled with fluid, pus, or other material. Epidermoid and sebaceous cysts are common and usually benign.",
  },
  
  // Hair & Scalp
  {
    name: "Androgenetic Alopecia",
    category: "hair",
    description: "The most common type of hair loss, also known as male or female pattern baldness. It's hereditary and results in gradual thinning and hair loss.",
  },
  {
    name: "Alopecia Areata",
    category: "hair",
    description: "An autoimmune condition causing sudden, patchy hair loss on the scalp or body. Hair may regrow on its own but can fall out again.",
  },
  {
    name: "Telogen Effluvium",
    category: "hair",
    description: "Temporary hair shedding caused by stress, illness, hormonal changes, or nutritional deficiencies. Hair typically regrows once the underlying cause is addressed.",
  },
  {
    name: "Scalp Psoriasis",
    category: "hair",
    description: "Psoriasis affecting the scalp, causing red, scaly patches that may extend beyond the hairline. It can cause significant itching and flaking.",
  },
  {
    name: "Dandruff",
    category: "hair",
    description: "A common scalp condition causing white or gray flakes of dead skin. It can be accompanied by itching and is often related to seborrheic dermatitis.",
  },
  {
    name: "Folliculitis",
    category: "hair",
    description: "Inflammation of hair follicles, usually caused by bacterial or fungal infection. It appears as small red bumps or white-headed pimples around hair follicles.",
  },
  {
    name: "Traction Alopecia",
    category: "hair",
    description: "Hair loss caused by repeated pulling or tension on hair from tight hairstyles. Early treatment can prevent permanent damage to hair follicles.",
  },
  {
    name: "Trichotillomania",
    category: "hair",
    description: "A condition involving recurrent, compulsive urges to pull out one's hair. It can result in noticeable hair loss and significant distress.",
  },
  {
    name: "Scalp Folliculitis",
    category: "hair",
    description: "Infection of hair follicles on the scalp, causing itchy, painful bumps. It can be caused by bacteria, fungi, or inflammation.",
  },
  
  // Nail Conditions
  {
    name: "Nail Fungus (Onychomycosis)",
    category: "nails",
    description: "A common fungal infection causing thickened, discolored, and brittle nails. It typically affects toenails and can spread without treatment.",
  },
  {
    name: "Ingrown Toenails",
    category: "nails",
    description: "A condition where the nail grows into the surrounding skin, causing pain, swelling, and sometimes infection. It most commonly affects the big toe.",
  },
  {
    name: "Nail Psoriasis",
    category: "nails",
    description: "Psoriasis affecting the nails, causing pitting, abnormal nail growth, and discoloration. It can occur with or without skin psoriasis.",
  },
  {
    name: "Paronychia",
    category: "nails",
    description: "An infection of the skin around the nail, causing redness, swelling, and pain. It can be acute (bacterial) or chronic (often fungal).",
  },
  {
    name: "Brittle Nails",
    category: "nails",
    description: "Nails that are dry, weak, and prone to splitting or breaking. It can be caused by aging, frequent hand washing, or nutritional deficiencies.",
  },
  {
    name: "Nail Ridges",
    category: "nails",
    description: "Vertical or horizontal lines on the nails. Vertical ridges are usually harmless and increase with age, while horizontal ridges may indicate underlying health issues.",
  },
  {
    name: "White Spots on Nails",
    category: "nails",
    description: "Small white marks or spots on the nails, usually caused by minor trauma. They're generally harmless and grow out with the nail.",
  },
  
  // Infections
  {
    name: "Herpes Simplex",
    category: "infections",
    description: "A viral infection causing cold sores (HSV-1) or genital herpes (HSV-2). It causes painful blisters and can recur throughout life.",
  },
  {
    name: "Shingles (Herpes Zoster)",
    category: "infections",
    description: "A viral infection causing a painful rash, usually appearing as a stripe of blisters on one side of the body. It's caused by the reactivation of the chickenpox virus.",
  },
  {
    name: "Warts",
    category: "infections",
    description: "Benign skin growths caused by the human papillomavirus (HPV). They can appear anywhere on the body and may spread through contact.",
  },
  {
    name: "Molluscum Contagiosum",
    category: "infections",
    description: "A viral skin infection causing small, raised, flesh-colored bumps with a dimpled center. It spreads through direct contact and is common in children.",
  },
  {
    name: "Impetigo",
    category: "infections",
    description: "A highly contagious bacterial skin infection causing red sores that can break open, ooze, and form a yellow-brown crust. It commonly affects children.",
  },
  {
    name: "Cellulitis",
    category: "infections",
    description: "A bacterial skin infection causing red, swollen, and painful skin. It can spread rapidly and requires prompt antibiotic treatment.",
  },
  {
    name: "Ringworm (Tinea)",
    category: "infections",
    description: "A fungal infection causing a circular, red, itchy rash with clearer skin in the middle. Despite its name, it's not caused by a worm.",
  },
  {
    name: "Athlete's Foot",
    category: "infections",
    description: "A fungal infection affecting the feet, causing itching, burning, and cracked skin, especially between the toes. It thrives in warm, moist environments.",
  },
  {
    name: "Jock Itch",
    category: "infections",
    description: "A fungal infection causing an itchy, red rash in the groin area. It's common in athletes and people who sweat heavily.",
  },
  {
    name: "Scabies",
    category: "infections",
    description: "A contagious skin infestation caused by tiny mites that burrow into the skin. It causes intense itching and a pimple-like rash.",
  },
  {
    name: "Lice",
    category: "infections",
    description: "Parasitic insects that live on the scalp, body, or pubic area. They cause intense itching and are spread through close personal contact.",
  },
  
  // Allergies & Reactions
  {
    name: "Hives (Urticaria)",
    category: "allergies",
    description: "Raised, itchy welts on the skin that appear suddenly. They can be triggered by allergies, stress, infections, or medications.",
  },
  {
    name: "Angioedema",
    category: "allergies",
    description: "Swelling beneath the skin, often around the eyes, lips, hands, and feet. It frequently occurs with hives and can be triggered by allergies.",
  },
  {
    name: "Drug Eruptions",
    category: "allergies",
    description: "Skin reactions caused by medications, ranging from mild rashes to severe conditions. They can appear days to weeks after starting a new medication.",
  },
  {
    name: "Allergic Contact Dermatitis",
    category: "allergies",
    description: "An allergic reaction causing a red, itchy rash after contact with an allergen like poison ivy, nickel, or fragrances.",
  },
  {
    name: "Photodermatitis",
    category: "allergies",
    description: "A skin reaction to sunlight, causing redness, itching, and sometimes blisters. It can be triggered by certain medications or skin products.",
  },
  {
    name: "Latex Allergy",
    category: "allergies",
    description: "An allergic reaction to proteins in natural rubber latex. It can cause skin rashes, hives, and in severe cases, anaphylaxis.",
  },
  
  // Pigmentation
  {
    name: "Vitiligo",
    category: "pigmentation",
    description: "A condition causing loss of skin pigment in patches. It occurs when melanocytes are destroyed and can affect any area of the body.",
  },
  {
    name: "Melasma",
    category: "pigmentation",
    description: "Brown or gray-brown patches on the face, often triggered by sun exposure, hormonal changes, or pregnancy. It's sometimes called the 'mask of pregnancy.'",
  },
  {
    name: "Age Spots (Solar Lentigines)",
    category: "pigmentation",
    description: "Flat, brown spots on sun-exposed areas of the skin. They're caused by years of sun exposure and are more common in people over 50.",
  },
  {
    name: "Post-Inflammatory Hyperpigmentation",
    category: "pigmentation",
    description: "Darkening of the skin following injury or inflammation, such as acne, eczema, or cuts. It's more common in darker skin tones.",
  },
  {
    name: "Hypopigmentation",
    category: "pigmentation",
    description: "Lighter patches of skin caused by reduced melanin production. It can result from injury, infection, or certain skin conditions.",
  },
  {
    name: "Albinism",
    category: "pigmentation",
    description: "A genetic condition causing little or no melanin production, resulting in very light skin, hair, and eyes. It increases sensitivity to sun damage.",
  },
  {
    name: "Freckles",
    category: "pigmentation",
    description: "Small, flat, brown spots that appear on sun-exposed skin. They're caused by an increase in melanin and are often genetic.",
  },
  {
    name: "Birthmarks",
    category: "pigmentation",
    description: "Colored marks on the skin present at birth or appearing shortly after. They can be vascular (red) or pigmented (brown) and are usually harmless.",
  },
];

// Featured conditions for homepage
export const featuredConditions = conditions.filter(c => 
  ["Acne", "Eczema (Atopic Dermatitis)", "Psoriasis", "Rosacea", "Hives (Urticaria)", "Androgenetic Alopecia"].includes(c.name)
).map(c => ({
  name: c.name === "Eczema (Atopic Dermatitis)" ? "Eczema" : c.name === "Androgenetic Alopecia" ? "Hair Loss" : c.name,
  description: c.name === "Eczema (Atopic Dermatitis)" 
    ? "Itchy, inflamed patches that can appear anywhere"
    : c.name === "Androgenetic Alopecia"
    ? "Thinning hair or bald patches on scalp"
    : c.description.split('.')[0],
}));
