import React from "react";
import PropTypes from 'prop-types';

// @material-ui/core components
import {

  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';





const useStyles = makeStyles((theme) => ({
  root: {},
  image: {
    flexShrink: 0,
    height: 56,
    width: 56
  },

}));


const CategoryItemTableEditAvatarText = ({ className, idName, iconImage, displayName, summary, description, displayDescription, ...rest }) => {

  const classes = useStyles();



  return (
    <Box
      display="flex"
      alignItems="center"
    >
      <img
        alt={displayName}
        className={classes.image}
        src={iconImage}
      />

      <Box ml={2}>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {displayName}
        </Typography>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              variant="body2"
              color="textSecondary"
            >
              {summary}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {description}
            </Typography>
          </AccordionDetails>
        </Accordion>


      </Box>
    </Box>
  );
}

CategoryItemTableEditAvatarText.propTypes = {
  className: PropTypes.string,
  idName: PropTypes.string,
  iconImage: PropTypes.string,
  displayName: PropTypes.string,
  summary: PropTypes.string,
  description: PropTypes.string,
  displayDescription: PropTypes.bool
};

export default CategoryItemTableEditAvatarText;
