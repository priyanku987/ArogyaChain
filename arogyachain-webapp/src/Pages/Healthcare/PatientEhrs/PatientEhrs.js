/* eslint-disable no-console */
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
} from '@mui/material';
import { groupBy } from 'lodash-es';
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

export default function PatientEhrs({ patientId }) {
  const axios = useAxios();
  const history = useHistory();

  const [patients, setPatients] = useState([]);
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const columns = [
    {
      field: 'Id',
      headerName: 'EHR ID',
      width: 480,
      renderCell: params => (
        <div
          onClick={() =>
            history.push(`/patientsEhrs/${patientId}/${params?.value}`)
          }
        >
          <FaFilePrescription
            size={20}
            style={{ marginBottom: '-6px', marginRight: '10px' }}
          />
          {params?.value}
        </div>
      ),
    },
    {
      field: 'DiseaseName',
      headerName: 'Disease',
      flex: 1,
    },
    {
      field: 'HospitalName',
      headerName: 'Hospital Name',
      flex: 1,
    },
    {
      field: 'IssueDate',
      headerName: 'EHR Issued on',
      flex: 1,
      renderCell: params => <>{new Date(params.value).toDateString()}</>,
    },
  ];

  useEffect(() => {
    setLoadingPatients(true);
    axios
      .get('/healthcare/chaincode/getEHRByPatient', {
        withCredentials: true,
        params: {
          patientId,
        },
      })
      .then(res => {
        // console.log(res?.data?.data);
        console.log(res?.data?.data);

        // console.log(newFormattedArray);

        // format
        const formattedDat = res?.data?.data?.map(dat => ({
          ...dat,
          id: dat?.Id,
        }));
        setSearchedPatients(formattedDat);
        setPatients(formattedDat);
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
      .finally(() => setLoadingPatients(false));
  }, [axios, patientId]);
  if (loadingPatients) {
    return <>Loading...</>;
  }
  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: 800 }}>
        Health Records for Patient
        <img
          src={AadharIcon}
          alt="aadhar"
          width={40}
          style={{ marginBottom: '-10px', marginLeft: '20px' }}
        />
        {patientId}
      </Typography>

      <OutlinedInput
        id="outlined-adornment-weight"
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        style={{ width: '70%', marginBottom: '20px' }}
        size="small"
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
        placeholder="Search EHR"
      />
      <Box sx={{ height: '66vh', width: '100%', overflowY: 'scroll' }}>
        <DataGrid
          rows={searchedPatients}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          hideFooterPagination
          hideFooter
        />
      </Box>
    </>
  );
}
