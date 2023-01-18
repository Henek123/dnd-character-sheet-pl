//determining proficiency bonus from level
function proficiencyBonusFromLvl(input, output){
  let lvl;
  if(input.value === ""){
    lvl = 1;
  }else{
    lvl = input.value.match(/(\d+)/g)[0];
  }
  lvl = parseInt(lvl);
  if(lvl >= 1 && lvl <= 4){
    output.value = 2;
  } else if(lvl >= 5 && lvl <= 8){
    output.value = 3;
  } else if(lvl >= 9 && lvl <= 12){
    output.value = 4;
  } else if(lvl >= 13 && lvl <= 16){
    output.value = 5;
  } else if(lvl >= 17 && lvl <= 20){
    output.value = 6;
  } else{
    output.value = 0;
  }
  return;
};

//adding user bonus to skill
function addBonus(label, id){
  const re = /\d+$/g;
  let text = label.textContent;
  //console.log(text);
  let bonus = localStorage.getItem(id);
  //console.log(bonus);
  if(re.test(text)){
    text = text.split(" ");
    text.pop();
    text = text.join(" ");
  }
  label.textContent = `${text} +${bonus}`;
  
  return;
}

//removing user bonus from skill
function removeBonus(label, id){
  const re = /\d+$/g;
  let text = label.textContent;
  if(re.test(text)){
    text = text.split(" ")
    text.pop();
    text = text.join(" ");
    label.textContent = `${text}`;
  };
};

//from stack overflow (rewrite)
function findLableForControl(el) {
  var idVal = el.id;
  labels = document.getElementsByTagName('label');
  for( var i = 0; i < labels.length; i++ ) {
     if (labels[i].htmlFor == idVal)
          return labels[i];
  }
};

//comparing calculated proficiency bonus with user input if larger saving diffrence to local storage
function compare(baseStatBonus, skill, skillBonusValue, proficiency){
  let id = skillBonusValue.id;
  let userInput = skillBonusValue.value;
  let calculatedValue = localStorage.getItem(id);
  let diffrence = userInput - calculatedValue;
  let label = findLableForControl(skill);
  let text = label.textContent
  if(calculatedValue < Math.abs(userInput) && diffrence >= 1){
    localStorage.setItem(`${id}-user`, diffrence);
    addBonus(label, `${id}-user`);
  } else{
    removeBonus(label, `${id}-user`);
    if(localStorage.getItem(`${id}-user`) !== null){
      localStorage.removeItem(`${id}-user`);
    }
  }
  skillBonus(baseStatBonus, skill, skillBonusValue, proficiency);
  return;
};

//creating cantrip input
function createCantripInput(num){
  let div = document.createElement("div");
  div.classList.add("flex-row-nowrap");
  div.classList.add("center");
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add(`cantrip`)
  div.append(input)
  let parent = document.querySelector(`.cantrips`);
  for(let i = 0; i < num; i++){
    parent.appendChild(div.cloneNode(true));
  }
  return;
};

//creating spell input
function createSpellInput(circle, num){
  let div = document.createElement("div");
  div.classList.add("flex-row-nowrap");
  div.classList.add("full-width");
  div.classList.add("center");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add(`prepared-${circle}`);
  let input = document.createElement("input");
  input.type = "text";
  input.classList.add(`spell-lvl-${circle}`);
  input.classList.add(`full-width`);
  div.append(checkbox, input);
  let parent = document.querySelector(`.circle-${circle}`);
  for(let i = 0; i < num; i++){
    input.id = `spell-lvl-${circle}-${i}`
    checkbox.id = `prepared-${circle}-${i}`
    parent.appendChild(div.cloneNode(true));
  }
  return;
};

//reading saved stats
function loadAbilityScore(ability, abilityBonus){
  if(localStorage.getItem(ability.id) !== null){
    ability.value = localStorage.getItem(ability.id);
  }
  abilityBonusValue(ability, abilityBonus);
  return;
};

//calculating and saving skill bonus and saving throws
function skillBonus(baseStatBonus, skill, skillBonusValue, proficiency){
  //console.log(proficiency.value);  
  let id = skillBonusValue.id;
    let value;
    if(skill.checked){
      localStorage.setItem(skill.id, true);
      value = +baseStatBonus.textContent + +proficiency.value;
    } else{
        skill.checked = false;
      localStorage.removeItem(skill.id);
        value = +baseStatBonus.textContent;
    }
  localStorage.setItem(id, value);
  if(localStorage.getItem(`${id}-user`) !== null){
    value += +localStorage.getItem(`${id}-user`);
  }
    skillBonusValue.value = value;
  return value;
};

//calculating passive wisdom
function passiveWisValue(passiveWis, wisBonus, proficiencyBonus, skills){
  let value = 10 + +wisBonus.textContent;
  if(skills.checked === true){
    value += +proficiencyBonus.value;
  }
  passiveWis.value = value;
};

//calculating and saving ability score bonus
function abilityBonusValue(ability, abilityBonus){
  if(ability.value){
    abilityBonus.textContent = Math.floor((ability.value - 10) / 2);
  } else{
    abilityBonus.textContent = "";
  }
  saveAbility(ability);
};

//saving ability score bonus
function saveAbility(ability){
  if(localStorage.getItem(ability.id) !== ability.value){
    localStorage.setItem(ability.id, ability.value)
  }
};

//loading skill bonus and saving throws
function loadSkillBonusproficiency(skill){
  if(localStorage.getItem(skill.id) === "true"){
    skill.checked = true;
  }
};

//saving single inputs
function inputSave(input){
  localStorage.setItem(input.id, input.value);
  return;
};

//loading single inputs
function inputLoad(input){
  if(localStorage.getItem(input.id) !== null){
    input.value = localStorage.getItem(input.id);
  }
  return;
};

//loading checkbox inputs
function loadCheckbox(input){
  if(localStorage.getItem(input.id) !== null){
    input.checked = true;
  }
  return;
};

//saving checkbox input
function saveCheckbox(input){
  if(input.checked === true){
    localStorage.setItem(input.id, true);
  } else{
    localStorage.removeItem(input.id, true);
  }
};

//loading saved data on load and calculating skills bonus
window.addEventListener("DOMContentLoaded", () =>{
  //reading skills and proficiency
  let proficiencyBonus = document.getElementById("proficiency");
  let skillsBonus = document.querySelectorAll(".skill-bonus");
  let skills = document.querySelectorAll(".skill");

  //reading abilities
  let str = document.getElementById("strength");
  let strBonus = document.getElementById("str-bonus");
  let dex = document.getElementById("dexterity");
  let dexBonus = document.getElementById("dex-bonus");
  let con = document.getElementById("constitution");
  let conBonus = document.getElementById("con-bonus");
  let wis = document.getElementById("wisdom");
  let wisBonus = document.getElementById("wis-bonus");
  let int = document.getElementById("inteligence");
  let intBonus = document.getElementById("int-bonus");
  let cha = document.getElementById("charisma");
  let chaBonus = document.getElementById("cha-bonus");

  //reading passive wisdom
  let passiveWis = document.querySelector("#passive-wis");

  //reading text inputs
  let textInputs = document.querySelectorAll(".text-input");
  
  //reading saving throws
  let saveThrows = document.querySelectorAll(".saves");
  let saveThrowsBonus = document.querySelectorAll(".saves-bonus");
  
  //adding inputs for spells
  createCantripInput(8);
  createSpellInput(1, 12);
  createSpellInput(2, 13);
  createSpellInput(3, 13);
  createSpellInput(4, 13);
  createSpellInput(5, 9);
  createSpellInput(6, 9);
  createSpellInput(7, 9);
  createSpellInput(8, 7);
  createSpellInput(9, 7);

  //reading character name
  let characterName = document.querySelector("#char-name");
  characterName.addEventListener("change", () => {
    inputSave(characterName);
  });

  //reading prepared spells checkbox 
  let spellCirclesPrepared = []; 
  for(let spellLevel = 1; spellLevel < 10; spellLevel++){ 
    spellCirclesPrepared.push(document.querySelectorAll(`.prepared-${spellLevel}`)); 
  }; 

  //reading spells input 
  let spellCircles = []; 
  for(let spellLevel = 1; spellLevel < 10; spellLevel++){ 
   spellCircles.push(document.querySelectorAll(`.spell-lvl-${spellLevel}`)); 
  }; 
   
  //loading and saving spells 
  for(let spellLevel = 0; spellLevel < 9; spellLevel++){ 
    for(let spellNumber = 0; spellNumber < spellCircles[spellLevel].length; spellNumber++){ 
        spellCircles[spellLevel][spellNumber].addEventListener("change", () => { 
        inputSave(spellCircles[spellLevel][spellNumber]); 
        }); 
      }; 
    for(let spellNumber = 0; spellNumber < spellCircles[spellLevel].length; spellNumber++){ 
      inputLoad(spellCircles[spellLevel][spellNumber]); 
      } 
    };

  //loading proficiency bonus
  inputLoad(proficiencyBonus);
  for(let i = 0; i < 18; i++){
    loadCheckbox(skills[i]);
  };

  //loading saving throws
  for(let i = 0; i < 6; i++){
    loadCheckbox(saveThrows[i]);
  }

  //loading single inputs
  for(let i = 0; i < textInputs.length; i++){
      inputLoad(textInputs[i]);
  };
  //loading name
  inputLoad(characterName);

  //loading stats and skills
  loadAbilityScore(str, strBonus);
  skillBonus(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
  skillBonus(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  
  loadAbilityScore(dex, dexBonus);
  skillBonus(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
  skillBonus(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
  skillBonus(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
  skillBonus(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
  skillBonus(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
  
  loadAbilityScore(con, conBonus);
  skillBonus(conBonus, saveThrows[2], saveThrowsBonus[2], proficiencyBonus);
  
  loadAbilityScore(wis, wisBonus);
  skillBonus(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
  skillBonus(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
  skillBonus(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
  skillBonus(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
  skillBonus(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);
  skillBonus(wisBonus, saveThrows[3], saveThrowsBonus[3], proficiencyBonus);
  passiveWisValue(passiveWis, wisBonus, proficiencyBonus, skills[11]);
  
  loadAbilityScore(int, intBonus);
  skillBonus(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
  skillBonus(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
  skillBonus(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
  skillBonus(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
  skillBonus(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
  skillBonus(intBonus, saveThrows[4], saveThrowsBonus[4], proficiencyBonus);
  
  loadAbilityScore(cha, chaBonus);
  skillBonus(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
  skillBonus(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
  skillBonus(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
  skillBonus(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
  skillBonus(chaBonus, saveThrows[5], saveThrowsBonus[5], proficiencyBonus);
  
  //setting marker for user added proficiency bonus
  compare(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
  compare(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
  compare(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
  compare(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
  compare(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
  compare(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
  compare(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
  compare(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
  compare(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
  compare(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
  compare(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
  compare(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
  compare(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
  compare(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
  compare(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
  compare(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
  compare(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
  compare(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);

  //reading class and level
  let classAndLvl = document.getElementById("class");
  proficiencyBonusFromLvl(classAndLvl, proficiencyBonus);
  
  //adding lvl change and proficiency change listener
  classAndLvl.addEventListener("change", () => {
    proficiencyBonusFromLvl(classAndLvl, proficiencyBonus);
    skillBonus(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
    skillBonus(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
    skillBonus(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
    skillBonus(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
    skillBonus(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
    skillBonus(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
    skillBonus(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
    skillBonus(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
    skillBonus(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
    skillBonus(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
    skillBonus(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
    skillBonus(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
    skillBonus(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
    skillBonus(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
    skillBonus(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
    skillBonus(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
    skillBonus(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
    skillBonus(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);
    skillBonus(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
    skillBonus(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
    skillBonus(conBonus, saveThrows[2], saveThrowsBonus[2], proficiencyBonus);
    skillBonus(wisBonus, saveThrows[3], saveThrowsBonus[3], proficiencyBonus);
    skillBonus(intBonus, saveThrows[4], saveThrowsBonus[4], proficiencyBonus);
    skillBonus(chaBonus, saveThrows[5], saveThrowsBonus[5], proficiencyBonus);
    inputSave(proficiencyBonus);
    passiveWisValue(passiveWis, wisBonus, proficiencyBonus, skills[11]);
  })

  //setting strength bonus
  str.addEventListener("change", () => {
    abilityBonusValue(str, strBonus);
    skillBonus(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
    skillBonus(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  });

  //setting dexterity bonus
  dex.addEventListener("change", () => {
    abilityBonusValue(dex, dexBonus);
    skillBonus(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
    skillBonus(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
    skillBonus(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
    skillBonus(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
  });

  //setting constitution bonus
  con.addEventListener("change", () => {
    abilityBonusValue(con, conBonus);
    skillBonus(conBonus, saveThrows[2], saveThrowsBonus[2], proficiencyBonus);
  });

  //setting wisdom bonus
  wis.addEventListener("change", () => {
    abilityBonusValue(wis, wisBonus);
    skillBonus(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
    skillBonus(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
    skillBonus(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
    skillBonus(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
    skillBonus(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);
    skillBonus(wisBonus, saveThrows[3], saveThrowsBonus[3], proficiencyBonus);
    passiveWisValue(passiveWis, wisBonus, proficiencyBonus, skills[11]);
  });

  //setting intelgence bonus
  int.addEventListener("change", () => {
    abilityBonusValue(int, intBonus);
    skillBonus(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
    skillBonus(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
    skillBonus(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
    skillBonus(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
    skillBonus(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
    skillBonus(intBonus, saveThrows[4], saveThrowsBonus[4], proficiencyBonus);
  });

  //setting charisma bonus
  cha.addEventListener("change", () => {
    abilityBonusValue(cha, chaBonus);
    skillBonus(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
    skillBonus(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
    skillBonus(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
    skillBonus(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
    skillBonus(chaBonus, saveThrows[5], saveThrowsBonus[5], proficiencyBonus);
  });

  //comparing user input for acrobatics
  skillsBonus[0].addEventListener("change", () =>{
    compare(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
  });

  //comparing user input for animal handling
  skillsBonus[1].addEventListener("change", () =>{
    compare(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
  });

  //comparing user input for arcana
  skillsBonus[2].addEventListener("change", () =>{
    compare(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
  });

  //comparing user input for athletics
  skillsBonus[3].addEventListener("change", () =>{
    compare(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
  });

  //comparing user input for deception
  skillsBonus[4].addEventListener("change", () =>{
    compare(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
  });

  //comparing user input for history
  skillsBonus[5].addEventListener("change", () =>{
    compare(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
  });

  //comparing user input for insight
  skillsBonus[6].addEventListener("change", () =>{
    compare(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
  });

  //comparing user input for intimidation
  skillsBonus[7].addEventListener("change", () =>{
    compare(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
  });

  //comparing user input for invegistation
  skillsBonus[8].addEventListener("change", () =>{
    compare(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
  });

  //comparing user input for medicine
  skillsBonus[9].addEventListener("change", () =>{
    compare(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
  });

  //comparing user input for nature
  skillsBonus[10].addEventListener("change", () =>{
    compare(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
  });

  //comparing user input for preception
  skillsBonus[11].addEventListener("change", () =>{
    compare(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
  });

  //comparing user input for performance
  skillsBonus[12].addEventListener("change", () =>{
    compare(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
  });

  //comparing user input for persuasion
  skillsBonus[13].addEventListener("change", () =>{
    compare(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
  });

  //comparing user input for religion
  skillsBonus[14].addEventListener("change", () =>{
    compare(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
  });

  //comparing user input for sleight of hand
  skillsBonus[15].addEventListener("change", () =>{
    compare(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
  });

  //comparing user input for stealth
  skillsBonus[16].addEventListener("change", () =>{
    compare(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
  });

  //comparing user input for survival
  skillsBonus[17].addEventListener("change", () =>{
    compare(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);
  });

  //setting acrobatics bonus
  skills[0].addEventListener("change", () =>{
      skillBonus(dexBonus, skills[0], skillsBonus[0], proficiencyBonus);
  });

  //setting animal handling bonus
  skills[1].addEventListener("change", () =>{
      skillBonus(wisBonus, skills[1], skillsBonus[1], proficiencyBonus);
  });

  //setting arcana bonus
  skills[2].addEventListener("change", () =>{
      skillBonus(intBonus, skills[2], skillsBonus[2], proficiencyBonus);
  });

  //setting athletics bonus
  skills[3].addEventListener("change", () =>{
      skillBonus(strBonus, skills[3], skillsBonus[3], proficiencyBonus);
  });

  //setting deception bonus
  skills[4].addEventListener("change", () =>{
      skillBonus(chaBonus, skills[4], skillsBonus[4], proficiencyBonus);
  });

  //setting history bonus
  skills[5].addEventListener("change", () =>{
    skillBonus(intBonus, skills[5], skillsBonus[5], proficiencyBonus);
  });

  //setting insight bonus
  skills[6].addEventListener("change", () =>{
      skillBonus(wisBonus, skills[6], skillsBonus[6], proficiencyBonus);
  });

  //setting intimidation bonus
  skills[7].addEventListener("change", () =>{
      skillBonus(chaBonus, skills[7], skillsBonus[7], proficiencyBonus);
  });

  //setting invegistation bonus
  skills[8].addEventListener("change", () =>{
      skillBonus(intBonus, skills[8], skillsBonus[8], proficiencyBonus);
  });

  //setting medicine bonus
  skills[9].addEventListener("change", () =>{
      skillBonus(wisBonus, skills[9], skillsBonus[9], proficiencyBonus);
  });

  //setting nature bonus
  skills[10].addEventListener("change", () =>{
      skillBonus(intBonus, skills[10], skillsBonus[10], proficiencyBonus);
  });

  //setting perception bonus
  skills[11].addEventListener("change", () =>{
      skillBonus(wisBonus, skills[11], skillsBonus[11], proficiencyBonus);
    passiveWisValue(passiveWis, wisBonus, proficiencyBonus, skills[11]);
  });

  //setting performance bonus
  skills[12].addEventListener("change", () =>{
      skillBonus(chaBonus, skills[12], skillsBonus[12], proficiencyBonus);
  });

  //setting persuasion bonus
  skills[13].addEventListener("change", () =>{
      skillBonus(chaBonus, skills[13], skillsBonus[13], proficiencyBonus);
  });

  //setting religion bonus
  skills[14].addEventListener("change", () =>{
      skillBonus(intBonus, skills[14], skillsBonus[14], proficiencyBonus);
  });

  //setting sleight of hand bonus
  skills[15].addEventListener("change", () =>{
      skillBonus(dexBonus, skills[15], skillsBonus[15], proficiencyBonus);
  });

  //setting stealth bonus
  skills[16].addEventListener("change", () =>{
      skillBonus(dexBonus, skills[16], skillsBonus[16], proficiencyBonus);
  });

  //setting survival bonus
  skills[17].addEventListener("change", () =>{
      skillBonus(wisBonus, skills[17], skillsBonus[17], proficiencyBonus);
  });
  
  //setting and comparing str save bonus
  saveThrowsBonus[0].addEventListener("change", () => {
    compare(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  })
  saveThrows[0].addEventListener("change", () => {
    skillBonus(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  })

  //setting and comparing str save bonus
  saveThrowsBonus[0].addEventListener("change", () => {
  compare(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  })
  saveThrows[0].addEventListener("change", () => {
  skillBonus(strBonus, saveThrows[0], saveThrowsBonus[0], proficiencyBonus);
  })

  //setting and comparing dex save bonus
  saveThrowsBonus[1].addEventListener("change", () => {
  compare(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
  })
  saveThrows[1].addEventListener("change", () => {
  skillBonus(dexBonus, saveThrows[1], saveThrowsBonus[1], proficiencyBonus);
  })

  //setting and comparing con save bonus
  saveThrowsBonus[2].addEventListener("change", () => {
  compare(conBonus, saveThrows[2], saveThrowsBonus[2], proficiencyBonus);
  })
  saveThrows[2].addEventListener("change", () => {
  skillBonus(conBonus, saveThrows[2], saveThrowsBonus[2], proficiencyBonus);
  })

  //setting and comparing wis save bonus
  saveThrowsBonus[3].addEventListener("change", () => {
  compare(wisBonus, saveThrows[3], saveThrowsBonus[3], proficiencyBonus);
  })
  saveThrows[3].addEventListener("change", () => {
  skillBonus(wisBonus, saveThrows[3], saveThrowsBonus[3], proficiencyBonus);
  })

  //setting and comparing int save bonus
  saveThrowsBonus[4].addEventListener("change", () => {
  compare(intBonus, saveThrows[4], saveThrowsBonus[4], proficiencyBonus);
  })
  saveThrows[4].addEventListener("change", () => {
  skillBonus(intBonus, saveThrows[4], saveThrowsBonus[4], proficiencyBonus);
  })

  //setting and comparing cha save bonus
  saveThrowsBonus[5].addEventListener("change", () => {
  compare(chaBonus, saveThrows[5], saveThrowsBonus[5], proficiencyBonus);
  })
  saveThrows[5].addEventListener("change", () => {
  skillBonus(chaBonus, saveThrows[5], saveThrowsBonus[5], proficiencyBonus);
  })
  //saving inputs with class text-input
  for(let i = 0; i < textInputs.length; i++){
    textInputs[i].addEventListener("change", () => {
      inputSave(textInputs[i]);
    });
  };

  //loading and saving prepared spells checkbox 
  for(let spellLevel = 0; spellLevel < 9; spellLevel++){ 
    for(let spellNumber = 0; spellNumber < spellCirclesPrepared[spellLevel].length; spellNumber++){ 
      spellCirclesPrepared[spellLevel][spellNumber].addEventListener("change", () => { 
      saveCheckbox(spellCirclesPrepared[spellLevel][spellNumber]); 
      }); 
    }; 
    for(let spellNumber = 0; spellNumber < spellCirclesPrepared[spellLevel].length; spellNumber++){ 
      loadCheckbox(spellCirclesPrepared[spellLevel][spellNumber]); 
    } 
  }
});