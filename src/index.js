import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  makeStyles
} from '@material-ui/core';



import CategoryTableEdit from "./CategoryTableEdit"
import data from "./data.json"



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));


function App() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 
  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="value" {...a11yProps(0)} />
          <Tab label="sdg" {...a11yProps(1)} />
          <Tab label="orgtype" {...a11yProps(2)} />
          
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={1}>
      <CategoryTableEdit data={data.sdg} />
      </TabPanel>
      <TabPanel value={value} index={2}>
      <CategoryTableEdit data={data.orgtype} />
      </TabPanel>
      <TabPanel value={value} index={0}>
      <CategoryTableEdit data={data.value} />
      </TabPanel>

      
    </div>
    

  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
