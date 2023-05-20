/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { useAxios } from '../../utils/axios';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { toast } from 'react-toastify';

export default function GrantRevokeAccessToEHRModal({
  open,
  setOpen,
  ehrId,
  type = 'GRANT_ACCESS',
}) {
  const identity = useStoreState(store => store?.identityDetails?.identity);
  const axios = useAxios();

  const [granteeId, setGranteeId] = React.useState('');
  const [ehr, setEhr] = React.useState(ehrId);
  const [performingTransaction, setPerformingTransaction] =
    React.useState(false);
  console.log(identity);

  async function grantAccess() {
    try {
      if (!granteeId) {
        return toast.error('Please provide the required fields.', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
      setPerformingTransaction(true);
      await axios.post(
        '/user/chaincode/grantParticularEHRAccessToIdentity',
        {
          granteeId,
          ehrId,
        },
        { withCredentials: true },
      );
      setGranteeId('');
      setOpen(false);
      setPerformingTransaction(false);
      return toast.success('Access Grant transaction committed successfully!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    } catch (error) {
      console.log(error);
      setGranteeId('');
      setPerformingTransaction(false);
      return toast.error('Something went wrong, please try again!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }

  async function revokeAccess() {
    try {
      if (!granteeId || !ehr) {
        return toast.error('Please provide the required fields.', {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
      setPerformingTransaction(true);
      await axios.post(
        '/user/chaincode/revokeParticularEHRAccessFromIdentity',
        {
          granteeId,
          ehrId: ehr,
        },
        { withCredentials: true },
      );
      setGranteeId('');
      setOpen(false);
      setPerformingTransaction(false);
      return toast.success(
        'Access Revoke transaction committed successfully!',
        {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        },
      );
    } catch (error) {
      setGranteeId('');
      console.log(error);
      setPerformingTransaction(false);
      return toast.error('Something went wrong, please try again!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  }
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {type === 'GRANT_ACCESS'
          ? 'Grant Access to EHR'
          : 'Revoke Access from EHR'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ marginBottom: '20px' }}>
          {type === 'GRANT_ACCESS'
            ? 'By performing this action, you are allowing an Identity on ArogyaChain to view your Health Record.'
            : 'By performing this action, you are removing access from an Identity on ArogyaChain to view your Health Record.'}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="aadhaarNumber"
          label="Aadhaar Number of the Identity"
          fullWidth
          variant="outlined"
          helperText={
            type === 'GRANT_ACCESS'
              ? 'Aadhaar Number of the Identity to whom you want to give access.'
              : 'Aadhaar Number of the Identity from whom you want to revoke access.'
          }
          InputLabelProps={{ shrink: true }}
          placeholder="Aadhaar Number"
          style={{ marginBottom: '24px' }}
          onChange={e => setGranteeId(e.target.value)}
          value={granteeId}
        />
        <TextField
          margin="dense"
          id="ehrId"
          label="EHR Id"
          fullWidth
          variant="outlined"
          disabled={!!ehr}
          autoFocus
          aria-disabled
          value={ehr}
          InputLabelProps={{ shrink: true }}
          onChange={e => setEhr(e.target.value)}
          placeholder="Your EHR Id"
        />
      </DialogContent>
      <DialogActions style={{ marginBottom: '12px', paddingRight: '22px' }}>
        <Button onClick={() => setOpen(false)} disabled={performingTransaction}>
          Cancel
        </Button>
        {type === 'GRANT_ACCESS' ? (
          <Button
            variant="outlined"
            onClick={() => grantAccess()}
            disabled={performingTransaction}
          >
            {performingTransaction ? 'Processing' : 'Grant Access'}
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => revokeAccess()}
            disabled={performingTransaction}
          >
            {performingTransaction ? 'Processing' : 'Revoke Access'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
