/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
// This is written from a mobile perspective
import PatientAccess from './PatientsAccess';
import PatientEhrs from './PatientEhrs';
import Ehr from './EHR';
import { useAxios } from '../../../utils/axios';
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
} from '@mui/material';
import dayjs from 'dayjs';
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
import urlJoin from 'url-join';
import { toast } from 'react-toastify';

export default function Index() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route
        path={urlJoin(match?.path, '/:patientId/:ehrId')}
        render={({ match: thisMatch }) => (
          <Ehr
            patientId={thisMatch?.params?.patientId}
            ehrId={thisMatch?.params?.ehrId}
          />
        )}
      />
      <Route
        path={urlJoin(match?.path, '/:patientId')}
        render={({ match: thisMatch }) => (
          <PatientEhrs patientId={thisMatch?.params?.patientId} />
        )}
      />
      <Route path={urlJoin(match?.path, '/')}>
        <PatientAccess />
      </Route>
    </Switch>
  );
}
