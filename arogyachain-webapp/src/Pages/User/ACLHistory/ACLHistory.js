/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/require-default-props */
import ACExecutorACLHistory from '../../../Components/ACLHistory/ACExecutorACLHistory';
import ACLHistoryExecutedForMe from '../../../Components/ACLHistory/ACLHistoryExecutedForMe';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <Typography>{children}</Typography>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ACLHistory() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        style={{ marginBottom: '16px' }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Your operations" {...a11yProps(0)} />
          <Tab label="Operations for you" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ACExecutorACLHistory />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ACLHistoryExecutedForMe />
      </TabPanel>
    </>
  );
}
