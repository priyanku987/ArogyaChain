/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
// This is written from a mobile perspective
import { useAxios } from '../../../utils/axios';
import AadharIcon from '../../../assets/extra_icons/aadhaar.png';
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
  Paper,
} from '@mui/material';
import { groupBy, find } from 'lodash-es';
import dayjs from 'dayjs';
import { FaFilePrescription, FaPrescription } from 'react-icons/fa';
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
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function Ehr({ patientId, ehrId }) {
  const axios = useAxios();
  const history = useHistory();

  const [ehr, setEhr] = useState([]);

  const [loadingEhrs, setLoadingEhrs] = useState(false);

  useEffect(() => {
    setLoadingEhrs(true);
    axios
      .get('/healthcare/chaincode/getEHRByPatient', {
        withCredentials: true,
        params: {
          patientId,
        },
      })
      .then(res => {
        // console.log(res?.data?.data);

        // find the ehr
        const foundEhr = find(res?.data?.data, { Id: ehrId });

        setEhr(foundEhr);
      })
      .catch(() => {
        toast.error('Unable to fetch EHRs!', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      })
      .finally(() => setLoadingEhrs(false));
  }, [axios, ehrId, patientId]);

  if (loadingEhrs) {
    return <>Loading...</>;
  }

  console.log('ehr', ehr);

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontWeight: 800, textAlign: 'center' }}
      >
        Health Record -{' '}
        <span style={{ fontWeight: 500, textTransform: 'uppercase' }}>
          {ehrId}
        </span>
      </Typography>
      <Paper
        elevation={3}
        style={{
          borderRadius: '1px',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '10px',
          paddingBottom: '10px',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={6}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="body2"
                style={{ fontWeight: 800, fontSize: '20px' }}
              >
                {ehr?.ConsultingDoctorName}
              </Typography>

              <Typography variant="body2" style={{ fontSize: '16px' }}>
                MBBS, MS
              </Typography>

              <Typography variant="body2" style={{ fontSize: '15px' }}>
                Reg no - {ehr?.ConsultingDoctorRegisteredNumber}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
