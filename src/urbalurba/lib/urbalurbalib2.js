// Library functions to urbalurba gui

import { IMAGEANDCOLOR } from "./libconfig";




export function getCoverImage(image, internalImage, imageType) {
    
  let coverImage = ""; //see libconfig file for def
  coverImage = IMAGEANDCOLOR[imageType].cover;

  
  if (image) { //image is there
    if (image.hasOwnProperty("cover")) { //profile is there
      if (image.cover.hasOwnProperty("url")) { //has url 
        if (typeof (image.cover.url) === "string") {
          coverImage = image.cover.url
        }
      }
    }
  } else
    if (internalImage) { //image is there
      if (internalImage.hasOwnProperty("cover")) { //profile is there
        if (internalImage.cover.hasOwnProperty("url")) { //has url 
          if (typeof (internalImage.cover.url) === "string") {
            if( internalImage.cover.url !== "" )
            coverImage = internalImage.cover.url
          }
        }
      }
    }

  return coverImage;

}





export function getProfileImage(image, internalImage, imageType) {
    
    let profileImage = ""; //see libconfig file for def
    profileImage = IMAGEANDCOLOR[imageType].profile;

    
    if (image) { //image is there
      if (image.hasOwnProperty("profile")) { //profile is there
        if (image.profile.hasOwnProperty("url")) { //has url 
          if (typeof (image.profile.url) === "string") {
            profileImage = image.profile.url
          }
        }
      }
    } else
      if (internalImage) { //image is there
        if (internalImage.hasOwnProperty("profile")) { //profile is there
          if (internalImage.profile.hasOwnProperty("url")) { //has url 
            if (typeof (internalImage.profile.url) === "string") {
              if( internalImage.profile.url !== "" )
                profileImage = internalImage.profile.url
            }
          }
        }
      }

    return profileImage;

  }




  export function getIconImage(image, internalImage, imageType) {
    
    let iconImage = ""; 

    
    iconImage = IMAGEANDCOLOR[imageType].icon; //see libconfig file for def

    if (image) { //image is there
      if (image.hasOwnProperty("icon")) { //icon is there
        if (image.icon.hasOwnProperty("url")) { //has url 
          if (typeof (image.icon.url) === "string") {
            iconImage = image.icon.url
          }
        }
      }
    } else
      if (internalImage) { //image is there
        if (internalImage.hasOwnProperty("icon")) { //icon is there
          if (internalImage.icon.hasOwnProperty("url")) { //has url 
            if (typeof (internalImage.icon.url) === "string") {
              if( internalImage.icon.url !== "" )
              iconImage = internalImage.icon.url
            }
          }
        }
      }

    return iconImage;

  }


export function displayCategoryItemAnswerTxt(categoryType) { 

let display = false;

    switch (categoryType) {
      case "single": 
        display = false;
        break;
      case "multiple": 
        display = false;
        break;        
      case "tag": 
        display = false;
        break;        
      case "input": 
        display = true;
        break;        
      default: 
        display = false;
        break;        
    }
    return display;
  }
  

  
  export function isSingleChoiceItemAnswer(categoryType) { 

    let singleChoice = false;
    
        switch (categoryType) {
          case "single": 
            singleChoice = true;
            break;
          case "multiple": 
            singleChoice = false;
            break;        
          case "tag": 
            singleChoice = false;
            break;        
          case "input": 
            singleChoice = false;
            break;        
          default: 
            singleChoice = false;
            break;        
        }
        return singleChoice;
      }
    


  /*** setFormInputValues
 * takes the full list of possible answers and the list of ansers 
 * returns  an object where every answer (idName) has a value true or false. 
 eg newDefaultValues ={
  energy: true,
  water: false
}
*/
export function setFormInputValues(categoryitems, entityCategoryAnswers) {
  let newDefaultValues = {};

  for (let i = 0; i < categoryitems.length; i++) {
    let found = entityCategoryAnswers.find(
      (item) => item.categoryitem.idName === categoryitems[i].idName
    );
    if (found) {
      newDefaultValues[categoryitems[i].idName] = true;
      let textAttribute = found.categoryitem.idName + "-text";
      newDefaultValues[textAttribute] = found.text;
      //console.log("textAttribute: ", textAttribute, "newDefaultValues[textAttribute]",newDefaultValues[textAttribute] );
    } else newDefaultValues[categoryitems[i].idName] = false;
  }
  return newDefaultValues;
}

/*** readFormInputValuesMultiple
 * takes the full list of possible answers (categoryitems) and the list of ansers that was there before they was displayo n the screen (entityCategoryAnswers) 
 * the object inputAnswers contains the answers after the user has changed some of them.
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array  that can be used to update the database.


*/
export function readFormInputValuesMultiple(
  entityCategoryID,
  categoryitems,
  entityCategoryAnswers,
  inputAnswers
) {


  let newEntityCategoryAnswers = [];

  let newEntityCategoryAnswerRecord = {};

  for (let i = 0; i < categoryitems.length; i++) {
    // loop trugh all possible answers
    newEntityCategoryAnswerRecord = {
      action: "dont know", // "unchanged", "create", "delete" or "update"
      idName: categoryitems[i].idName, //just for debugging
      text: "dont know",
      entityCategoryAnswerID: "dont know", //for existing answers a ID for new its empty
      categoryitemID: "dont know",
      entityCategoryID: entityCategoryID
    };

    // first figure out if this answer was already in the database before we enabeled editing
    let alreadyChecked = entityCategoryAnswers.find(
      (item) => item.categoryitem.idName === categoryitems[i].idName
    );

    // if the entity already has one or more answers in this category. then there is a entityCategory record
    //

    //console.log("idName:", categoryitems[i].idName);
    if (alreadyChecked)
      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " alreadyChecked: TRUE");
    else
      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " alreadyChecked: FALSE");
    console.log(
      "readFormInputValuesMultiple inputAnswers[categoryitems[i].idName]:",
      inputAnswers[categoryitems[i].idName]
    );




    if (inputAnswers[categoryitems[i].idName] && alreadyChecked) {
      // if the checkbox is checked and it was checked before editing


      //Now we need to figure out if the text has changed. If it has then we must mark it to be UPDATE
      if ((inputAnswers[`${categoryitems[i].idName}-text`] !== alreadyChecked.text) && (inputAnswers[`${categoryitems[i].idName}-text`] !== undefined) ) {
        console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION UPDATE TEXT CHANGED alreadyChecked.text=",alreadyChecked.text, "= text=", inputAnswers[`${categoryitems[i].idName}-text`], "=" );        
        newEntityCategoryAnswerRecord.action = "UPDATE";
        newEntityCategoryAnswerRecord.text = inputAnswers[`${categoryitems[i].idName}-text`]; //text is changed
      } else {

      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION unchanged");
      newEntityCategoryAnswerRecord.action = "unchanged";
      newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has not been changed in this input
    }      
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty
      
      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if (inputAnswers[categoryitems[i].idName] && !alreadyChecked) {
      // if the checkbox is checked and it was NOT checked before editing
      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION create");
      newEntityCategoryAnswerRecord.action = "CREATE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "to be created"; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = ""; 
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }
    if (!inputAnswers[categoryitems[i].idName] && alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION delete");
      newEntityCategoryAnswerRecord.action = "DELETE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has no been changed in this input
      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if (!inputAnswers[categoryitems[i].idName] && !alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      console.log("readFormInputValuesMultiple idName:", categoryitems[i].idName, " ACTION not selected");
      newEntityCategoryAnswerRecord.action = "not selected";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "not selected";
      newEntityCategoryAnswerRecord.text = "not selected";
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }

    // now we have the record - lets add it to the array
newEntityCategoryAnswers.push(
      newEntityCategoryAnswerRecord
    );

  } // end loop

  

  return newEntityCategoryAnswers;
}




/*** readFormInputValuesSingle
 * takes the full list of possible answers (categoryitems) and the list of ansers that was there before they was displayo n the screen (entityCategoryAnswers) 
 * the object inputAnswers contains the answers after the user has changed some of them.
 * This function figures out what has changed and returns an array of objects that is marked 
 * updated, deleted, added for each of the possible answers

 * returns  an array (newAnswersArray) that can be used to update the database.

newCategoryAnswer =
{
"action": "unchanged" // "create", "delete" or "update"
"entityCategoryID" : "5f325a0f203f6aa1903207f0", //if the usr has answers in the category
"idName": //just for debugging
"text": "what to write here",
newEntityCategoryAnswers: [
{
"action": "unchanged" // "create", "delete" or "update"
idName: "mobility", //just for debugging
"text": "what to write here",
"entityCategoryAnswerID":  //for existing answers a ID for new its empty
"categoryID" : "5f325a0f203f6aa1903207f0", //if the usr has answers in the category
"categoryitemID": "5f325891203f6aa19031fe92", 
}
]
}

*/
export function readFormInputValuesSingle(
  categoryID,
  categoryitems,
  entityCategoryAnswers,
  selectedAnswer
) {
  let newEntityCategoryRecord = {
    action: "dont know", // "not selected", "create", "delete" or "update"
    entityCategoryID: "dont know", //if the usr has answers in the category it must be created. otherwise we find it on one of the entityCategoryAnswers
    categoryID: categoryID,
    text: "what to write here",
    entityCategoryAnswers: []
  };
  // if the entity already has one or more answers in this category. then there is a entityCategory record
  // we look at the first answer (entityCategoryAnswers) that was there before editing to find the id of the entityCategory record
  if (entityCategoryAnswers) {
    //if there are answers
    if (entityCategoryAnswers.length > 0) {
      // there are at least one answer
      newEntityCategoryRecord.entityCategoryID =
        entityCategoryAnswers[0].entity_category.id;
    }
  }

// For a category of categoryType="single" the answer is set in selectedAnswer.RadioSelected 
let selectedIdName = selectedAnswer.RadioSelected; 


  let newEntityCategoryAnswerRecord = {};
  let alreadyChecked = {};

  for (let i = 0; i < categoryitems.length; i++) {
    // loop trugh all possible answers
    newEntityCategoryAnswerRecord = {
      action: "dont know", // "unchanged", "create", "delete" or "update"
      idName: categoryitems[i].idName, //just for debugging
      text: "dont know",
      entityCategoryAnswerID: "dont know", //for existing answers a ID for new its empty
      categoryID: "dont know", //if the usr has answers in the category
      categoryitemID: "dont know",
      entityCategoryID: newEntityCategoryRecord.entityCategoryID
    };
    alreadyChecked = {};

    // first figure out if this answer was already in the database before we enabeled editing
    alreadyChecked = entityCategoryAnswers.find(
      (item) => item.categoryitem.idName === categoryitems[i].idName
    );


    
    if (alreadyChecked)
      console.log("idName:", categoryitems[i].idName, " alreadyChecked: TRUE");
    else
      console.log("idName:", categoryitems[i].idName, " alreadyChecked: FALSE");


    if ((categoryitems[i].idName === selectedIdName) && alreadyChecked) {
      // if the checkbox is checked and it was checked before editing
      console.log("idName:", categoryitems[i].idName, " ACTION unchanged");
      newEntityCategoryAnswerRecord.action = "unchanged";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has no been changed in this input
      newEntityCategoryAnswerRecord.categoryID = categoryID; //if the usr has answers in the category
      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if ((categoryitems[i].idName === selectedIdName) && !alreadyChecked) {
      // if the checkbox is checked and it was NOT checked before editing
      console.log("idName:", categoryitems[i].idName, " ACTION create");
      newEntityCategoryAnswerRecord.action = "CREATE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "to be created"; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = ""; 
      newEntityCategoryAnswerRecord.categoryID = categoryID; //if the usr has answers in the category
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }
    if (!(categoryitems[i].idName === selectedIdName) && alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      console.log("idName:", categoryitems[i].idName, " ACTION delete");
      newEntityCategoryAnswerRecord.action = "DELETE";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = alreadyChecked.id; //for existing answers a ID for new its empty
      newEntityCategoryAnswerRecord.text = alreadyChecked.text; //this has no been changed in this input
      newEntityCategoryAnswerRecord.categoryID = categoryID; //if the usr has answers in the category
      newEntityCategoryAnswerRecord.categoryitemID =
        alreadyChecked.categoryitem.id;
      newEntityCategoryAnswerRecord.idName = alreadyChecked.categoryitem.idName;
    }

    if (!(categoryitems[i].idName === selectedIdName) && !alreadyChecked) {
      // it is not checked. if it was checked before we need to delete that record
      console.log("idName:", categoryitems[i].idName, " ACTION not selected");
      newEntityCategoryAnswerRecord.action = "not selected";
      newEntityCategoryAnswerRecord.entityCategoryAnswerID = "not selected";
      newEntityCategoryAnswerRecord.text = "not selected";
      newEntityCategoryAnswerRecord.categoryID = categoryID; //if the usr has answers in the category
      newEntityCategoryAnswerRecord.categoryitemID = categoryitems[i].id;
      newEntityCategoryAnswerRecord.idName = categoryitems[i].idName;
    }

    // now we have the record - lats add it to the array
    newEntityCategoryRecord.entityCategoryAnswers.push(
      newEntityCategoryAnswerRecord
    );
  } // end loop

  // now we need to fiure out if the relation between the entity and the category (entityCategory) must be CREATED, DELETED or is unchanged
  // if there was no entityCategoryAnswers and there now are one or more then a entityCategory must be CREATED first in order to add entityCategoryAnswers
  // if there was entityCategoryAnswers and there now are NONE then the entityCategory must be DELETED after deleting all entityCategoryAnswers

  let unchanged = newEntityCategoryRecord.entityCategoryAnswers.find(
    (item) => item.action === "unchanged"
  );
  console.log("unchanged:", JSON.stringify(unchanged));

  let created = newEntityCategoryRecord.entityCategoryAnswers.find(
    (item) => item.action === "CREATE"
  );
  console.log("created:", JSON.stringify(created));

  let deleted = newEntityCategoryRecord.entityCategoryAnswers.find(
    (item) => item.action === "DELETE"
  );
  console.log("deleted:", JSON.stringify(deleted));

  if (unchanged || created) {
    // there are answers that are unchanged or created
    newEntityCategoryRecord.action = "unchanged"; //then we can keep the record. no matter if thee are created and deleted answers
  }

  if (!unchanged && created && !deleted) {
    newEntityCategoryRecord.action = "CREATE"; // we have at least one new answer -> then we must create the record
    newEntityCategoryRecord.entityCategoryID = "to be created"; // database will give us this when the record is created
  }

  if (!unchanged && !created && deleted) {
    newEntityCategoryRecord.action = "DELETE"; // no unchanged and no created answers, but at least one deleted. It means that there are no answers. so we must delete
  }

  if (!unchanged && !created && !deleted) {
    newEntityCategoryRecord.action = "not selected"; // nothing changed, created or deleted - that means that nothing is selected
    newEntityCategoryRecord.entityCategoryID = "not relevant"; // database will give us this when the record is created
  }

  return newEntityCategoryRecord;
}
