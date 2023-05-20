/* eslint-disable react/no-array-index-key */
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

export default function Ehrs({ ehrId }) {
  const history = useHistory();
  const axios = useAxios();

  const [anchorEl, setAnchorEl] = useState(null);
  const [ehr, setEhr] = useState({});
  const [fetchingEhrs, setFetchingEhrs] = useState(false);
  const [openGrantRevokeAccessToEHRModal, setOpenGrantRevokeAccessToEHRModal] =
    useState(false);
  const [accessControlModalType, setAccessControlModalType] =
    useState('GRANT_ACCESS');
  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get the EHR of the user
  useEffect(() => {
    setFetchingEhrs(true);
    axios
      .get('/user/chaincode/getAllEHR', { withCredentials: true })
      .then(res => {
        const foundEhr = res?.data?.data?.find(eh => eh?.Id === ehrId);
        setEhr(foundEhr);
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
  }, [axios, ehrId]);
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{ fontWeight: 800, textAlign: 'left' }}
        >
          Your Health Record Details
        </Typography>
        <IconButton
          aria-label="upload picture"
          component="label"
          onClick={handleMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setAccessControlModalType('GRANT_ACCESS');
              setOpenGrantRevokeAccessToEHRModal(true);
              handleMenuClose();
            }}
          >
            Grant Access to this EHR
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAccessControlModalType('REVOKE_ACCESS');
              setOpenGrantRevokeAccessToEHRModal(true);
              handleMenuClose();
            }}
          >
            Remove Access from this EHR
          </MenuItem>
        </Menu>
      </div>

      {fetchingEhrs ? (
        'Loading Health Record'
      ) : (
        <div>
          <div style={{ marginBottom: '8px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              EHR ID
            </Typography>
          </div>

          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.Id}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              EHR Type
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.Type}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Patient Aadhaar Number
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.Owner}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Patient Name
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientName}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Patient Age
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientAge}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              EHR Issued on
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {new Date(ehr?.IssueDate).toDateString()}
            </Typography>
          </div>

          <Divider textAlign="left" style={{ marginTop: '20px' }}>
            Diagnosis Details
          </Divider>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Disease
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.DiseaseName}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Description
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.DiseaseDescription}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Disease Severity
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.SeverityOfDisease}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Medicines Prescribed
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {ehr?.MedicinesPrescribed
              ? JSON.parse(ehr?.MedicinesPrescribed)?.map((medicine, m) => (
                  <div key={m}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ fontSize: '16px', fontWeight: 600 }}
                    >
                      {m + 1}.{medicine?.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ fontSize: '16px', marginLeft: '14px' }}
                    >
                      - Reason: {medicine?.reason}
                    </Typography>
                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ fontSize: '16px', marginLeft: '14px' }}
                    >
                      - Dosage: {medicine?.dosage}
                    </Typography>
                  </div>
                ))
              : null}
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Tests Recommended
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {ehr?.TestsRecommended
              ? JSON.parse(ehr?.TestsRecommended)?.map((test, m) => (
                  <div key={m}>
                    <Typography
                      variant="body2"
                      gutterBottom
                      style={{ fontSize: '16px', fontWeight: 500 }}
                    >
                      {m + 1}.{test}
                    </Typography>
                  </div>
                ))
              : null}
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Suggesstions
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.Suggesstions}
            </Typography>
          </div>

          <Divider textAlign="left" style={{ marginTop: '20px' }}>
            Patient Communication Details
          </Divider>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Full Address
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientAddress}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Country
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientCountry}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              State
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientState}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              District
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientDistrict}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              City
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientCity}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Village
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientVillage}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Zipcode
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientZipcode}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Full Address
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientAddress}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Full Address
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.PatientAddress}
            </Typography>
          </div>

          <Divider textAlign="left" style={{ marginTop: '20px' }}>
            Consulting Doctor Details
          </Divider>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Doctor Name
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.ConsultingDoctorName}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Doctor Registered Id
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.ConsultingDoctorRegisteredNumber}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Doctor Aadhaar Number
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.ConsultingDoctorID}
            </Typography>
          </div>

          <Divider textAlign="left" style={{ marginTop: '20px' }}>
            Healthcare Details
          </Divider>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Healthcare Name
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.HospitalName}
            </Typography>
          </div>

          <div style={{ marginBottom: '8px', marginTop: '20px' }}>
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              Heathcare Registered Id
            </Typography>
          </div>
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: '#f5f2ff',
              padding: '10px',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom
              style={{ fontSize: '16px' }}
            >
              {ehr?.HospitalRegisteredNumber}
            </Typography>
          </div>
        </div>
      )}

      <GrantRevokeAccessToEHRModal
        open={openGrantRevokeAccessToEHRModal}
        setOpen={setOpenGrantRevokeAccessToEHRModal}
        ehrId={ehrId}
        type={accessControlModalType}
      />
    </>
  );
}
