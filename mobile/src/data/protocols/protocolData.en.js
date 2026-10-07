export const AGE_PROFILES = [
  { id: "infant", label: "Newborn or infant (under 1 year)", icon: "baby-face-outline" },
  { id: "child", label: "Child (1-8 years)", icon: "human-child" },
  { id: "adult", label: "Adult or over 8 years", icon: "account" },
];

export const SITUATIONS = [
  { id: "svb", label: "Unresponsive / not breathing normally / I don't know what is wrong", icon: "heart-pulse" },
  { id: "choking", label: "Choking, something is blocking the airway", icon: "account-alert-outline" },
  { id: "bleeding", label: "Heavy bleeding / wound", icon: "water" },
  { id: "burn", label: "Burn", icon: "fire" },
  { id: "electric", label: "Electric shock", icon: "flash-alert-outline" },
  { id: "drowning", label: "Drowning", icon: "waves" },
  { id: "trauma", label: "Fall or car/motorcycle crash, possible fracture", icon: "car-emergency" },
];

const finalAction = { label: "Continue to handoff", kind: "handoff" };
const call112Action = { label: "Call 112", kind: "call112" };

const adult = {
  "adult-2": {
    title: "Does the person respond?",
    text: "Gently shake their shoulder. Ask loudly: ‘Can you hear me? Open your eyes!’",
    actions: [
      { label: "YES, they respond", next: "adult-3a" },
      { label: "NO response", next: "adult-3b" },
    ],
  },
  "adult-3a": {
    title: "Do not move them from the position you found them in",
    text: "Leave them exactly as you found them. Do not force them to stand up. Check the area again for hazards. Try to understand why they are staying in that position, as it may indicate an injury.",
    actions: [call112Action, { label: "Their condition changed", next: "adult-2" }, finalAction],
  },
  "adult-3b": {
    title: "Call out for help",
    text: "Ask people nearby for help. Place the person on their back on a flat surface.",
    actions: [{ label: "Continue", next: "adult-4" }],
  },
  "adult-4": {
    title: "Open the airway",
    text: "Place one hand on the forehead and gently tilt the head back. With two fingers of the other hand, lift the chin. Remove any clearly visible object from the mouth.",
    warning: "If you suspect a cervical spine injury: do not tilt the head back. Lift only the jaw without moving the neck.",
    actions: [{ label: "Airway opened", next: "adult-5" }],
  },
  "adult-5": {
    title: "Is the person breathing?",
    text: "For no more than 10 seconds: look for chest movement, listen for breathing sounds, and feel for air on your cheek.",
    actions: [
      { label: "YES, breathing normally", next: "adult-6a" },
      { label: "NO, not breathing or breathing abnormally", next: "adult-6b" },
    ],
  },
  "adult-6a": {
    title: "Place them in the recovery position",
    text: "Follow the video/animated steps for the recovery position. Keep the head tilted back and the mouth slightly open toward the ground.",
    actions: [call112Action, { label: "Their condition changed", next: "adult-5" }, finalAction],
  },
  "adult-6b": {
    title: "Call 112 immediately",
    text: "Tell the dispatcher your location, what happened, and how many people are injured. If possible, put the phone on speaker and continue.",
    actions: [
      { label: "Call 112", kind: "call112" },
      { label: "I called — start CPR", next: "adult-7" },
    ],
  },
  "adult-7": {
    title: "Cardiopulmonary resuscitation",
    text: "Place the heel of one hand on the lower half of the breastbone. Place the other hand on top. Keep your elbows straight. Compress 5-6 cm deep at a rate of 100 per minute. After every 30 compressions: give 2 rescue breaths.",
    warning: "If coughing, spontaneous movement, vomiting, or eye opening occurs, stop and reassess.",
    cpr: { label: "30:2", bpm: 100 },
    actions: [{ label: "Continue the 30:2 cycle", next: "adult-7" }, { label: "See when to stop", next: "adult-8" }],
  },
  "adult-8": {
    title: "Continue until...",
    text: "Qualified help arrives and takes over, OR the person starts breathing normally, OR you are exhausted and can no longer continue.",
    actions: [
      { label: "The person recovered / is breathing", next: "adult-6a" },
      { label: "Help has arrived", kind: "handoff" },
    ],
  },
};

const child = {
  "child-2": {
    title: "Does the child respond?",
    text: "Gently shake the child's shoulder. Ask loudly: ‘Can you hear me? Open your eyes!’",
    actions: [{ label: "YES, the child responds", next: "child-3a" }, { label: "NO response", next: "child-3b" }],
  },
  "child-3a": {
    title: "Leave the child in the position you found them in",
    text: "Do not move the child. Look for visible injuries. Give first aid for what you find.",
    actions: [call112Action, { label: "The condition changed", next: "child-2" }, finalAction],
  },
  "child-3b": {
    title: "Call out for help",
    text: "Ask people nearby for help. Place the child on their back on a flat surface.",
    actions: [{ label: "Continue", next: "child-4" }],
  },
  "child-4": {
    title: "Open the airway",
    text: "Gently tilt the head back in line with the body. Lift the chin with two fingers.",
    warning: "If trauma is suspected: do not tilt the head. Lift only the jaw without moving the neck.",
    actions: [{ label: "Airway opened", next: "child-5" }],
  },
  "child-5": {
    title: "Is the child breathing?",
    text: "For no more than 10 seconds: look at the chest, listen for breathing, and feel for air on your cheek.",
    note: "The source document states that a respiratory rate over 60 breaths/minute is a warning sign.",
    actions: [{ label: "YES, breathing normally", next: "child-6a" }, { label: "NO, not breathing or breathing abnormally", next: "child-6b" }],
  },
  "child-6a": {
    title: "Place the child in the recovery position",
    text: "Follow the video/animated steps for the recovery position, the same as for an adult.",
    actions: [call112Action, finalAction],
  },
  "child-6b": {
    title: "Give 5 initial rescue breaths",
    text: "Pinch the nose, seal your mouth over the child's mouth, blow for 1-1.5 seconds, then let the chest fall. Repeat 5 times. Check for signs of life: movement, coughing, or breathing.",
    actions: [{ label: "No signs of life — start CPR", next: "child-7" }],
  },
  "child-7": {
    title: "Are you alone or is someone helping you?",
    text: "Choose the correct situation. The number of rescuers changes the compression-to-breath ratio and when 112 is called.",
    actions: [
      { label: "I am alone", next: "child-7-single" },
      { label: "There are 2 rescuers", next: "child-7-two" },
    ],
  },
  "child-7-single": {
    title: "Cardiopulmonary resuscitation — one rescuer",
    text: "Perform 1 minute of resuscitation, then call 112. Use a ratio of 30 compressions to 2 rescue breaths. Use one hand, with the heel of the palm on the lower half of the breastbone. Compress to 1/3 of the chest depth at 100-120/minute.",
    warning: "If coughing, spontaneous movement, vomiting, or eye opening occurs, stop and reassess.",
    cpr: { label: "30:2 · 100-120/min", bpm: 110 },
    actions: [
      { label: "Continue the 30:2 cycle", next: "child-7-single" },
      { label: "I completed 1 minute — call 112", kind: "call112" },
      { label: "See when to stop", next: "child-8" },
    ],
  },
  "child-7-two": {
    title: "Cardiopulmonary resuscitation — two rescuers",
    text: "One rescuer calls 112 immediately while the other starts resuscitation. Use a ratio of 15 compressions to 2 rescue breaths. Use one hand, with the heel of the palm on the lower half of the breastbone. Compress to 1/3 of the chest depth at 100-120/minute.",
    warning: "If coughing, spontaneous movement, vomiting, or eye opening occurs, stop and reassess.",
    cpr: { label: "15:2 · 100-120/min", bpm: 110 },
    actions: [
      { label: "Call 112", kind: "call112" },
      { label: "Continue the 15:2 cycle", next: "child-7-two" },
      { label: "See when to stop", next: "child-8" },
    ],
  },
  "child-8": {
    title: "Continue until...",
    text: "Qualified help arrives and takes over, OR the child starts breathing normally, OR you are exhausted and can no longer continue.",
    actions: [{ label: "The child recovered / is breathing", next: "child-6a" }, { label: "Help has arrived", kind: "handoff" }],
  },
};

const infant = {
  "infant-2": {
    title: "Does the infant respond?",
    text: "Gently touch the infant and call their name. Look for movement, crying, or eye opening.",
    actions: [{ label: "YES, the infant responds", next: "infant-3a" }, { label: "NO response", next: "infant-3b" }],
  },
  "infant-3a": {
    title: "Hold the infant",
    text: "Look for visible injuries. Give first aid for what you find.",
    actions: [call112Action, { label: "The condition changed", next: "infant-2" }, finalAction],
  },
  "infant-3b": {
    title: "Call out for help",
    text: "Ask people nearby for help. Place the infant on their back on a flat surface. If you have a towel or blanket available, place it under the head and neck for alignment.",
    actions: [{ label: "Continue", next: "infant-4" }],
  },
  "infant-4": {
    title: "Open the airway carefully",
    text: "Gently extend the head without forcing it. Keep the face aligned with the surface rather than tilting far back. Gently lift the chin.",
    warning: "If trauma is suspected: do not extend the head at all. Lift only the jaw without moving the neck.",
    actions: [{ label: "Airway opened", next: "infant-5" }],
  },
  "infant-5": {
    title: "Is the infant breathing?",
    text: "For no more than 10 seconds: look at the chest, listen for breathing, and feel for air on your cheek.",
    note: "The source document states that a respiratory rate over 60 breaths/minute is a warning sign.",
    actions: [{ label: "YES, breathing normally", next: "infant-6a" }, { label: "NO, not breathing or breathing abnormally", next: "infant-6b" }],
  },
  "infant-6a": {
    title: "Place the infant on their side with support",
    text: "Use a supported side-lying position with the head neutral. If appropriate, you can hold the infant in this position.",
    actions: [call112Action, finalAction],
  },
  "infant-6b": {
    title: "Give 5 initial rescue breaths",
    text: "Seal your mouth over both the infant's mouth and nose. Blow gently for 1-1.5 seconds, only enough to see the chest rise. Repeat 5 times. Check for signs of life.",
    actions: [{ label: "No signs of life — start CPR", next: "infant-7" }],
  },
  "infant-7": {
    title: "Cardiopulmonary resuscitation",
    text: "If you are alone, perform 1 minute of resuscitation, then call 112. If there are 2 rescuers, one calls immediately while the other starts resuscitation. Use a ratio of 15 compressions to 2 rescue breaths. Use 2 fingers on the lower half of the breastbone. Compress to 1/3 of the chest depth at 100-120/minute. After every 15 compressions: give 2 breaths over the mouth and nose.",
    warning: "If coughing, spontaneous movement, vomiting, or eye opening occurs, stop and reassess.",
    cpr: { label: "15:2", bpm: 110 },
    actions: [{ label: "Continue the cycle", next: "infant-7" }, { label: "See when to stop", next: "infant-8" }],
  },
  "infant-8": {
    title: "Continue until...",
    text: "Qualified help arrives and takes over, OR the infant starts breathing normally, OR you are exhausted and can no longer continue.",
    actions: [{ label: "The infant recovered / is breathing", next: "infant-6a" }, { label: "Help has arrived", kind: "handoff" }],
  },
};

const special = {
  "obs-1": {
    title: "Can the person cough or speak?",
    text: "Assess whether the person can cough effectively, speak, or make a sound.",
    actions: [{ label: "YES, coughing and able to make a sound", next: "obs-2" }, { label: "NO, unable to speak, breathe, or cough", next: "obs-3" }],
  },
  "obs-2": {
    title: "Encourage coughing",
    text: "Do not hit the person's back and do not put your fingers in their mouth. Stay with them and monitor them; the obstruction can become complete at any time.",
    actions: [{ label: "It got worse", next: "obs-3" }, { label: "Help has arrived", kind: "handoff" }],
  },
  "obs-3": {
    title: "Give 5 back blows between the shoulder blades",
    text: "Lean the person slightly forward and give 5 firm blows between the shoulder blades with the heel of your hand. Check after each blow whether the airway has cleared.",
    actions: [{ label: "The airway is still blocked", next: "obs-4" }],
  },
  "obs-4": {
    title: "Continue the age-appropriate manoeuvres",
    dynamicText: true,
    actions: [{ label: "Repeat the sequence", next: "obs-3" }, { label: "The person became unconscious", kind: "svb" }],
  },
  "hem-1": {
    title: "Apply direct pressure to the wound",
    text: "Use a clean dressing or clean cloth. Press firmly and continuously.",
    warning: "If the wound is on the skull, DO NOT apply direct pressure.",
    actions: [
      { label: "The bleeding does not stop", next: "hem-2" },
      { label: "It stopped — call 112", kind: "call112_handoff" },
      { label: "Organs are protruding from the wound", next: "hem-4" },
    ],
  },
  "hem-2": {
    title: "Raise the affected limb",
    text: "Keep applying pressure and raise the limb above heart level if you do not suspect a fracture in that area.",
    actions: [{ label: "It still does not stop", next: "hem-3" }],
  },
  "hem-3": {
    title: "Use a tourniquet only if nothing else works",
    text: "Apply it above the wound, tight enough to stop the bleeding. Write down the exact time on a visible note on the person. Do not loosen it yourself; leave that to the medical team.",
    warning: "The supplied document presents this as a last resort. Follow the 112 dispatcher's instructions.",
    actions: [call112Action, finalAction],
  },
  "hem-4": {
    title: "Organs protruding from the wound? Do not put them back",
    text: "Cover them with a moist dressing. Gently bend the person's knees to reduce abdominal tension.",
    actions: [call112Action, finalAction],
  },
  "burn-1": {
    title: "What caused the burn?",
    text: "Choose the cause that fits best.",
    actions: [{ label: "Flame or hot liquid", next: "burn-2a" }, { label: "Chemical substance", next: "burn-2b" }, { label: "Electric current", next: "elec-1" }],
  },
  "burn-2a": {
    title: "Cool with running water",
    text: "Keep the area under running water even if the flame already appears to be out. Remove clothing that is not stuck to the skin.",
    actions: [{ label: "Continue", next: "burn-3" }],
  },
  "burn-2b": {
    title: "Rinse with water for a longer time",
    text: "Keep the area under running water for a longer period to remove the substance completely.",
    actions: [{ label: "Continue", next: "burn-3" }],
  },
  "burn-3": {
    title: "Do not apply ointments or ice",
    text: "Cover the burn with a clean, moistened dressing or clean cloth. Cover the rest of the body to help prevent heat loss.",
    warning: "The document describes burns to the face, neck, hands, flexion areas, or more than 30% of the body as major emergencies. Call 112 if you have not already done so.",
    actions: [call112Action, finalAction],
  },
  "elec-1": {
    title: "Turn off the electrical source",
    text: "Do not approach the person before doing this. If you cannot turn off the current, the document instructs moving the person away using a dry, non-conductive object while standing on a dry surface.",
    warning: "The document indicates medical evaluation even if the person appears well.",
    actions: [{ label: "The current is off / the person is away from the source", kind: "svb" }],
  },
  "drown-1": {
    title: "Do not enter the water without suitable equipment",
    text: "If you cannot swim or do not have the necessary equipment, call for specialist help.",
    actions: [{ label: "I removed the person from the water", next: "drown-2" }],
  },
  "drown-2": {
    title: "Suspect a spinal injury",
    text: "Keep the neck and back aligned. Move the person as a unit without bending the neck.",
    note: "The supplied document indicates medical evaluation and observation even if the person fully recovers.",
    actions: [{ label: "Continue with the condition check", kind: "svb" }],
  },
  "trauma-1": {
    title: "Do not try to straighten anything",
    text: "If you suspect a fracture or dislocation, temporarily immobilize it in the position found without pulling or repositioning it.",
    actions: [{ label: "Continue", next: "trauma-2" }],
  },
  "trauma-2": {
    title: "Do not remove a motorcycle helmet if the person is breathing normally",
    text: "Remove the helmet only if it blocks the airway or CPR must be performed.",
    actions: [{ label: "Continue with responsiveness and breathing checks", kind: "svb" }],
  },
};

export const PROTOCOLS = { ...adult, ...child, ...infant, ...special };

export function getSvbStart(ageProfile) {
  if (ageProfile === "infant") return "infant-2";
  if (ageProfile === "child") return "child-2";
  return "adult-2";
}

export function getSituationStart(situation, ageProfile) {
  if (situation === "svb") return getSvbStart(ageProfile);
  if (situation === "choking") return "obs-1";
  if (situation === "bleeding") return "hem-1";
  if (situation === "burn") return "burn-1";
  if (situation === "electric") return "elec-1";
  if (situation === "drowning") return "drown-1";
  if (situation === "trauma") return "trauma-1";
  return getSvbStart(ageProfile);
}

export function getDynamicProtocolText(nodeId, ageProfile) {
  if (nodeId !== "obs-4") return null;
  if (ageProfile === "infant") {
    return "DO NOT use abdominal thrusts on an infant. Alternate 5 back blows with 5 chest thrusts, keeping the infant's head lower than the body on your forearm.";
  }
  return "Give 5 abdominal thrusts: stand behind the person, place your fist above the navel, and pull sharply inward and upward 5 times.";
}
