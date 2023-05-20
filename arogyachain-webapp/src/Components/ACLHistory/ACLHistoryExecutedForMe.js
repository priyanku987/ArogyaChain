/* eslint-disable no-console */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import { useAxios } from '../../utils/axios';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import dayjs from 'dayjs';
import { find } from 'lodash-es';
import { FaFilePrescription } from 'react-icons/fa';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createUseStyles } from 'react-jss';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Link,
  Switch,
  useRouteMatch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';

export default function ACExecutorACLHistory() {
  const axios = useAxios();
  const [aclHistory, setACLHistory] = useState([]);
  const [loadingACLHistory, setLoadingACLHistory] = useState(false);
  useEffect(() => {
    setLoadingACLHistory(true);
    axios
      .get('/user/chaincode/getACLHistoryExecutedForIdentity', {
        withCredentials: true,
      })
      .then(res => {
        console.log(res?.data?.data);
        setACLHistory(res?.data?.data);
      })
      .catch(err =>
        toast.error('Unable to fetch ACL History!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }),
      )
      .finally(() => setLoadingACLHistory(false));
  }, [axios]);

  if (loadingACLHistory) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        Loading..
      </div>
    );
  }

  if (aclHistory?.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        Sorry, you don&apos;t have any access to other identities&apos;
        resources on the network!
      </div>
    );
  }
  return (
    <div
      style={{
        height: '64vh',
        overflowY: 'scroll',
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {aclHistory?.map((hist, h) => (
          <TimelineItem key={h}>
            <TimelineSeparator>
              <TimelineDot
                color={hist?.Operation === 'GRANT_ACCESS' ? 'success' : 'error'}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    fontSize: '16px',
                    color: hist?.Operation === 'GRANT_ACCESS' ? 'green' : 'red',
                    fontWeight: 700,
                  }}
                >
                  {hist?.Operation === 'GRANT_ACCESS'
                    ? 'Granted Access'
                    : 'Revoked Access'}
                </Typography>

                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    fontSize: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '76vw',
                  }}
                >
                  EHR: {hist?.EHRId}
                </Typography>

                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    fontSize: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '76vw',
                  }}
                >
                  {hist?.Operation === 'GRANT_ACCESS'
                    ? 'To Identity:'
                    : 'From Identity:'}{' '}
                  {hist?.PerformedFor}
                </Typography>

                <Typography
                  variant="body2"
                  gutterBottom
                  style={{
                    fontSize: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '76vw',
                    color: 'grey',
                  }}
                >
                  Timestamp: {new Date(hist?.Date).toISOString()}
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
