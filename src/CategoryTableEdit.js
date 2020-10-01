import React, {  useEffect }  from 'react';
import { useForm, Controller } from "react-hook-form";

import clsx from 'clsx';


import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Checkbox,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';

// App resources
import CategoryItemTableEditAvatarText from "/src/urbalurba/views/adm/SharedComponents/TableEditAvatarText.js"
import { setFormInputValues, readFormInputValuesMultiple, readFormInputValuesSingle, getIconImage, getProfileImage, displayCategoryItemAnswerTxt, isSingleChoiceItemAnswer } from "/src/urbalurba/lib/urbalurbalib2.js"

const useStyles = makeStyles((theme) => ({
  root: {},
}));










const CategoryTableEdit = ({ className, data, ...rest }) => {
  const classes = useStyles();
  

  function setFormInputValues2(categoryitems, entityCategoryAnswers) {

    for (let i = 0; i < categoryitems.length; i++) {
      let found = entityCategoryAnswers.find(
        (item) => item.categoryitem.idName === categoryitems[i].idName
      );

      if (found) {
        let textAttribute = found.categoryitem.idName + "-text";
        setValue(categoryitems[i].idName, true, { shouldValidate: false })
        setValue(textAttribute, found.text, { shouldValidate: false })
      } else {
        setValue(categoryitems[i].idName, false, { shouldValidate: false })
      }
    }

  }



  const { handleSubmit, control, watch, setValue, reset } = useForm();







//apollo graphql hook here
// the graphql query returns a data object (the data object is pased as a parameter to CategoryTableEdit just for simplicity ) 
  let category = data.categories[0];
  let entityCategoryAnswers = data.entities[0].entity_categories[0].entity_category_answers;
  let entityCategoryID = data.entities[0].entity_categories[0].id;


  let defaultValues = {};
  defaultValues = setFormInputValues(category.categoryitems, entityCategoryAnswers);  

// FIRST USE OF useForm was with  defaultValues
// like this: useForm({defaultValues: defaultValues} );

// but since I started using apollo graphql hook I needed to initialize useForm before I have the data from apollo  

// TRYING TO USE useEffect - BUT IT RUNS ALL THE TIME SO THAT ANY EDITING IS RESET 
  useEffect(() => {      
      const myDefaultValues = setFormInputValues(category.categoryitems, entityCategoryAnswers);  
      reset(myDefaultValues); //setting default values
    });


  const watchAllFields = watch();

  let singleChoiceForm = isSingleChoiceItemAnswer(category.categoryType);

  if (singleChoiceForm) {
    // For a category of tye SingleChoiceItemAnswer only one value is used in the defaultValues
    // eg defaultValues.RadioSelected = "municipality";         
    if (entityCategoryAnswers) {       // is there
      if (entityCategoryAnswers.length > 0) {         // and has value
        defaultValues.RadioSelected = entityCategoryAnswers[0].categoryitem.idName; // the first item [0] is the one - always
      }
    } else
      defaultValues.RadioSelected = "not selected";
  }



  let showCategoryItemAnswerTxt = displayCategoryItemAnswerTxt(category.categoryType);
  




  const onSubmit = async (data) => {

    let newEntityCategoryAnswers = {};

    if (singleChoiceForm) {
      newEntityCategoryAnswers = readFormInputValuesSingle(
        entityCategoryID,
        category.categoryitems,
        entityCategoryAnswers,
        data
      );

    } else {
      newEntityCategoryAnswers = readFormInputValuesMultiple(
        entityCategoryID,
        category.categoryitems,
        entityCategoryAnswers,
        data
      );

    }


    console.log("newEntityCategoryAnswers:", JSON.stringify(newEntityCategoryAnswers, null, 2));

  }    

    return (
      <form >
        <Card
          className={clsx(classes.root, className)}
          {...rest}
        >
          <CardHeader
            avatar={(
              <Avatar
                alt="Category"
                src={getProfileImage(category.image, category.internalImage, "cat")}
              />
            )}
            title={category.displayName}
            subheader={category.summary}
          />
          <Divider />
          <CardContent>

              <Box >
                <Table>
                  <TableBody>
                    {singleChoiceForm ?
                      <Controller
                        name="RadioSelected"
                        control={control}
                        as={
                          <RadioGroup>
                            {category.categoryitems.map((currentCategory) => {
                              return (
                                <TableRow
                                  hover
                                  key={currentCategory.idName}
                                >


                                  <TableCell>
                                    <CategoryItemTableEditAvatarText idName={currentCategory.idName} iconImage={getIconImage(currentCategory.image, currentCategory.internalImage, "categoryitem")} displayName={currentCategory.displayName} summary={currentCategory.summary} description={currentCategory.description} displayDescription={true} />
                                  </TableCell>


                                  <TableCell>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="flex-end">

                                      <FormControlLabel
                                        value={`${currentCategory.idName}`}
                                        control={<Radio />}

                                        label=""
                                      />
                                    </Box>

                                  </TableCell>


                                </TableRow>
                              );
                            })}
                          </RadioGroup>
                        }
                      />
                      :
                      category.categoryitems.map((currentCategory) => {

                        //find the defaultvalue for each controller by doing a lookup
                        let found = entityCategoryAnswers.find(
                          (item) => item.categoryitem.idName === currentCategory.idName
                        );
                        let checkboxValue = false;
                        let textValue = "";

                        if (found) { //if the answer is there - then we will set them as defaultvalue
                          textValue = found.text;
                          checkboxValue = true
                        }




                        return (

                          <TableRow
                            hover
                            key={currentCategory.idName}
                          >


                            <TableCell>

                              <Box mr={2}
                                display="flex"
                                alignItems="center"
                                justifyContent="flex-end"
                              >
                                <Controller
                                  name={`${currentCategory.idName}`}
                                  control={control}
                                  defaultValue={checkboxValue}
                                  render={(props) => (
                                    <Checkbox
                                      onChange={(e) => props.onChange(e.target.checked)}
                                      checked={props.value}
                                    />
                                  )}
                                />
                              </Box>

                            </TableCell>



                            <TableCell>

                              <CategoryItemTableEditAvatarText idName={currentCategory.idName} iconImage={getIconImage(currentCategory.image, currentCategory.internalImage, "categoryitem")} displayName={currentCategory.displayName} summary={currentCategory.summary} description={currentCategory.description} displayDescription={true} />

                              {(showCategoryItemAnswerTxt && (watchAllFields[`${currentCategory.idName}`])) ?

                                <div>
                                  <Controller
                                    as={TextField}
                                    name={`${currentCategory.idName}-text`}
                                    control={control}
                                    defaultValue={textValue}
                                    label={currentCategory.displayName}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    type="text"
                                    helperText="How you focus on the topic"
                                    rules={{ required: true }}
                                  />

                                </div>

                                : null
                              }

                            </TableCell>



                          </TableRow>



                        );
                      })

                    }



                  </TableBody>

                </Table>
              </Box>

          </CardContent>
          <CardActions >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Lagre
      </Button>
          </CardActions>
        </Card>
      </form>
    );
  }

  CategoryTableEdit.propTypes = {
    data: PropTypes.object.isRequired
  };

  export default CategoryTableEdit;
