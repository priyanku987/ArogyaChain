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
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function PatientAccess() {
  const axios = useAxios();
  const history = useHistory();

  const [patients, setPatients] = useState([]);
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const columns = [
    {
      field: 'patientId',
      headerName: 'Patient Aadhaar Number',
      flex: 1,
      renderCell: params => (
        <>
          <img src={AadharIcon} alt="aadhar" width={40} />
          <Typography variant="body2" style={{ marginLeft: '10px' }}>
            {params?.value}
          </Typography>
        </>
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      renderCell: params => (
        <Button
          variant="outlined"
          onClick={() => history.push(`/patientsEhrs/${params?.row.patientId}`)}
        >
          View Health Records
        </Button>
      ),
      width: 220,
    },
  ];

  useEffect(() => {
    setLoadingPatients(true);
    axios
      .get('/healthcare/chaincode/getAccessGrantListForDoctor', {
        withCredentials: true,
      })
      .then(res => {
        // console.log(res?.data?.data);
        const grouppedData = groupBy(res?.data?.data, 'PerformedBy');
        // console.log(grouppedData);

        const newFormattedArray = [];
        for (const patientId in grouppedData) {
          newFormattedArray.push({
            id: patientId,
            patientId,
            data: grouppedData[patientId],
          });
        }

        // console.log(newFormattedArray);

        // format
        setSearchedPatients(newFormattedArray);
        setPatients(newFormattedArray);
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
  }, [axios]);
  if (loadingPatients) {
    return <>Loading...</>;
  }
  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontWeight: 800, textAlign: 'center' }}
      >
        Your Patients Access
      </Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
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
          placeholder="Search Patient by Aadhaar Number"
        />
        <Box sx={{ height: '400px', width: '70%', overflowY: 'scroll' }}>
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
      </div>
    </>
  );
}
