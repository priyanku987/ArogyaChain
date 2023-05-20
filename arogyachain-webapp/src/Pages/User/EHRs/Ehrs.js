/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
// This is written from a mobile perspective
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
import { toast } from 'react-toastify';

export default function Ehrs() {
  const history = useHistory();
  const axios = useAxios();

  const [ehrs, setEhrs] = useState([]);
  const [fetchingEhrs, setFetchingEhrs] = useState(false);

  // Get the EHR of the user
  useEffect(() => {
    setFetchingEhrs(true);
    axios
      .get('/user/chaincode/getAllEHR', { withCredentials: true })
      .then(res => {
        setEhrs(res?.data?.data);
      })
      .catch(err => {
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
      .finally(() => {
        setFetchingEhrs(false);
      });
  }, [axios]);
  return (
    <>
      <OutlinedInput
        id="outlined-adornment-weight"
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        style={{ width: '100%' }}
        size="small"
        aria-describedby="outlined-weight-helper-text"
        inputProps={{
          'aria-label': 'weight',
        }}
        placeholder="Search Health Records"
      />
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontWeight: 800, marginTop: '10px' }}
      >
        Your Health Records
      </Typography>

      <Grid container spacing={2}>
        {fetchingEhrs
          ? 'Loading your Health Records...'
          : ehrs?.map(ehr => (
              <>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  lg={2}
                  style={{ marginTop: '10px' }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography variant="body2" style={{ color: 'grey' }}>
                      {dayjs(ehr?.IssueDate).format('MMM')}
                    </Typography>

                    <Typography
                      variant="body2"
                      style={{
                        color: '#865dff',
                        fontSize: '20px',
                        fontWeight: 400,
                      }}
                    >
                      {dayjs(ehr?.IssueDate).format('DD')}
                    </Typography>

                    <Typography variant="body2" style={{ color: 'grey' }}>
                      {dayjs(ehr?.IssueDate).format('YYYY')}
                    </Typography>
                  </div>
                </Grid>

                <Grid
                  item
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: '10px' }}
                  onClick={() => history.push(`/myEhrs/${ehr?.Id}`)}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: 'black',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '18px',
                      }}
                    >
                      {ehr?.Id}
                    </Typography>

                    <Typography
                      variant="body2"
                      style={{
                        color: 'grey',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                      }}
                    >
                      {ehr?.HospitalName}
                    </Typography>

                    <Chip
                      label={ehr?.Type}
                      color="success"
                      variant="outlined"
                      style={{ marginTop: '2px' }}
                      size="small"
                    />
                  </div>
                </Grid>
                {/* <Grid
                  item
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  style={{ marginTop: '10px' }}
                >
                  <IconButton aria-label="upload picture" component="label">
                    <MoreVertIcon />
                  </IconButton>
                </Grid> */}

                <Divider style={{ width: '100%', marginTop: '20px' }} />
              </>
            ))}
      </Grid>
    </>
  );
}
