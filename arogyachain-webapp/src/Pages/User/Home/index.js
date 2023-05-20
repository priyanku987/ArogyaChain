/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
// This is written from a mobile perspective
import GrantRevokeAccessToEHRModal from '../../../Components/GrantRevokeAccessToEHR';
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
} from '@mui/material';
import { FaFilePrescription } from 'react-icons/fa';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createUseStyles } from 'react-jss';
import {
  Link,
  Switch,
  useRouteMatch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { toast } from 'react-toastify';

const useClasses = createUseStyles({
  registerIdentityTab: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f6f2ff',
    },
  },
});

export default function Home() {
  const classes = useClasses();
  const history = useHistory();
  const axios = useAxios();

  const [recentEhrs, setRecentEhrs] = useState([]);
  const [fetchingEhrs, setFetchingEhrs] = useState(false);

  const [openGrantRevokeAccessToEHRModal, setOpenGrantRevokeAccessToEHRModal] =
    useState(false);
  const [accessControlModalType, setAccessControlModalType] =
    useState('GRANT_ACCESS');

  // Get the EHR of the user
  useEffect(() => {
    setFetchingEhrs(true);
    axios
      .get('/user/chaincode/getAllEHR', { withCredentials: true })
      .then(res => {
        setRecentEhrs(res?.data?.data);
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
      <Typography variant="h5" gutterBottom style={{ fontWeight: 800 }}>
        Welcome
      </Typography>

      <Typography variant="p" gutterBottom>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mi
        ipsum.
      </Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          marginBottom: '14px',
        }}
      >
        <Typography variant="h6" gutterBottom style={{ fontWeight: 800 }}>
          Recent Health Records
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={() => history.push('/myEhrs')}
        >
          See All
        </Button>
      </div>
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div
          style={{
            alignItems: 'stretch',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            width: '100%!important',
            padding: '14px',
          }}
        >
          {recentEhrs?.map(ob => (
            <Card
              raised
              style={{
                maxWidth: '86%',
                flexBasis: '86%',
                height: '200px',
                flexGrow: 0,
                flexShrink: 0,
                marginRight: '20px',
                padding: '20px',
              }}
              onClick={() => history.push(`/myEhrs/${ob?.Id}`)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: '20%' }}>
                  <FaFilePrescription
                    style={{
                      width: '100%',
                      fontSize: '80px',
                      color: '#4caf50',
                    }}
                  />
                </div>

                <div
                  style={{
                    width: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Chip
                    label={ob?.Type}
                    color="success"
                    variant="outlined"
                    style={{ marginLeft: '20px', fontWeight: 800 }}
                  />

                  <Typography
                    variant="body2"
                    style={{ marginLeft: '20px', marginTop: '10px' }}
                  >
                    {new Date(ob?.IssueDate).toDateString()}
                  </Typography>

                  <div
                    style={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant="h7"
                      gutterBottom
                      style={{ marginLeft: '20px', color: 'grey' }}
                    >
                      {ob?.Id}
                    </Typography>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px',
                }}
              >
                <Typography
                  variant="h7"
                  style={{
                    fontWeight: 600,
                    marginLeft: '20px',
                    textAlign: 'center',
                  }}
                >
                  {ob?.HospitalName}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          marginBottom: '14px',
        }}
      >
        <Typography variant="h6" gutterBottom style={{ fontWeight: 800 }}>
          Control access to your EHRs
        </Typography>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          style={{ marginRight: '20px' }}
          onClick={() => {
            setAccessControlModalType('GRANT_ACCESS');
            setOpenGrantRevokeAccessToEHRModal(true);
          }}
        >
          Grant Access to EHR
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setAccessControlModalType('REVOKE_ACCESS');
            setOpenGrantRevokeAccessToEHRModal(true);
          }}
        >
          Revoke Access from EHR
        </Button>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '20px',
        }}
      >
        <Button
          style={{ marginRight: '20px' }}
          endIcon={<ArrowForwardIosIcon />}
        >
          Explore More
        </Button>
      </div>
      <GrantRevokeAccessToEHRModal
        open={openGrantRevokeAccessToEHRModal}
        setOpen={setOpenGrantRevokeAccessToEHRModal}
        type={accessControlModalType}
      />
    </>
  );
}
