/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { useAxios } from '../../../utils/axios';
import Typography from '@mui/material/Typography';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Input from '@mui/material/Input';
import { Button, Divider, IconButton } from '@mui/material';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
  PatientName: yup.string().required(),
  PatientId: yup.string().required(),
  PatientAge: yup.string().required(),
  PatientAddress: yup.string().required(),
  PatientCountry: yup.string().required(),
  PatientState: yup.string().required(),
  PatientDistrict: yup.string().required(),
  PatientZipcode: yup.string().required(),
  PatientEmail: yup.string().email().required(),
  PatientPhoneNumbers: yup.string().required(),
  PatientAttendantName: yup.string().required(),
  PatientAttendantRelation: yup.string().required(),
  DiseaseName: yup.string().required(),
  DiseaseDescription: yup.string().required(),
  SeverityOfDisease: yup.string().required(),
  MedicinesPrescribed: yup.array().when('$arrayNotEmpty', {
    then: () =>
      yup.array().of(
        yup.object().shape({
          name: yup.string().required(),
          reason: yup.string().required(),
          dosage: yup.string().required(),
        }),
      ),
    otherwise: yup.array(),
  }),
  Suggesstions: yup.string().required(),
  TestsRecommended: yup.array().when('$arrayNotEmpty', {
    then: () =>
      yup.array().of(
        yup.object().shape({
          test: yup.string().required(),
        }),
      ),
    otherwise: yup.array(),
  }),
  Type: yup.string().required(),
  ConsultingDoctorRegisteredNumber: yup.string().required(),
  HospitalId: yup.string().required(),
  HospitalName: yup.string().required(),
  HospitalRegisteredNumber: yup.string().required(),
});

export default function CreateEhr() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      PatientName: '',
      PatientId: '',
      PatientAge: '',
      PatientAddress: '',
      PatientCountry: '',
      PatientState: '',
      PatientCity: '',
      PatientDistrict: '',
      PatientVillage: '',
      PatientZipcode: '',
      PatientEmail: '',
      PatientPhoneNumbers: '',
      PatientAttendantName: '',
      PatientAttendantRelation: '',
      ConsultingDoctorName: '',
      ConsultingDoctorRegisteredNumber: '',
      HospitalId: '',
      HospitalName: '',
      HospitalRegisteredNumber: '',
      DiseaseName: '',
      DiseaseDescription: '',
      SeverityOfDisease: '',
      MedicinesPrescribed: [
        {
          name: '',
          reason: '',
          dosage: '',
        },
      ],
      Suggesstions: '',
      TestsRecommended: [
        {
          test: '',
        },
      ],
      Type: 'PRESCRIPTION',
    },
  });
  const {
    append: appendMedicines,
    remove: removeMedicines,
    fields: medicineFields,
  } = useFieldArray({
    control,
    name: 'MedicinesPrescribed',
  });

  const {
    append: appendTests,
    remove: removeTests,
    fields: testFields,
  } = useFieldArray({
    control,
    name: 'TestsRecommended',
  });
  const axios = useAxios();

  const onSubmit = async data => {
    try {
      try {
        await validationSchema.validate(data, {
          context: data?.MedicinesPrescribed.length > 0,
        });
      } catch (error) {
        return toast.error('Please provide all the required fields!', {
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

      // prepare the data
      data.Owner = data?.PatientId;
      data.TestsRecommended = data?.TestsRecommended?.map(test => test?.test);

      await axios.post('/healthcare/chaincode/createEHR', data, {
        withCredentials: true,
      });

      return toast.info('Successfully initiated EHR creation!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      return toast.error('Invalid Credentials!', {
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
  };
  return (
    <>
      <Typography variant="h5">Create Patient Health Record</Typography>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Patient Details</Divider>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Name"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Aadhar Number <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Aadhaar Number"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Age <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientAge"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Age"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={9} lg={9}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Address <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Address"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Country <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientCountry"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Country"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient State <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientState"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient State"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient District <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientDistrict"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient District"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient City <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientCity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient City"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Village <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientVillage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Vllage"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography style={{ marginBottom: '10px' }}>
              Zipcode <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientZipcode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Zipcode"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Phone Numbers <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientPhoneNumbers"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Phone Numbers (comma seperated list, eg: +9173883903,+91739873943)"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Email <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientEmail"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Email"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Attendant Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientAttendantName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Attendant Name"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Patient Attendant Relation <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="PatientAttendantRelation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Patient Attendant Relation"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Consulting Doctor Details</Divider>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Doctor Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="ConsultingDoctorName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Consulting Doctor Name"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Doctor Registration Number <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="ConsultingDoctorRegisteredNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Consulting Doctor Registered Number"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Healthcare Details</Divider>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Healthcare Id <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="HospitalId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Healthcare Id"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Healthcare Name<span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="HospitalName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Healthcare Name"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Healthcare Registration Number
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="HospitalRegisteredNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Healthcare Registration Number"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Diagnosis Details</Divider>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Disease Name<span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="DiseaseName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Disease Name"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Disease Description<span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="DiseaseDescription"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Disease Description"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              Severity of Disease
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="SeverityOfDisease"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Severity of Disease, eg: LOW, MODERATE etc"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography style={{ marginBottom: '10px' }}>
              EMR Type
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="Type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Type of EMR"
                  disabled
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Medicines Recommended</Divider>
          </Grid>

          {medicineFields.map((medicine, index) => (
            <>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <Typography style={{ marginBottom: '10px' }}>
                  {index + 1}. Medicine Name
                  <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  name={`MedicinesPrescribed.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label=""
                      style={{ width: '100%' }}
                      size="small"
                      placeholder="Medicine Name"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3}>
                <Typography style={{ marginBottom: '10px' }}>
                  Reason
                  <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  name={`MedicinesPrescribed.${index}.reason`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label=""
                      style={{ width: '100%' }}
                      size="small"
                      placeholder="Reason"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4}>
                <Typography style={{ marginBottom: '10px' }}>
                  Dosage
                  <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  name={`MedicinesPrescribed.${index}.dosage`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label=""
                      style={{ width: '100%' }}
                      size="small"
                      placeholder="Dosage"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Typography style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'white' }}>*</span>
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    appendMedicines({
                      name: '',
                      reason: '',
                      dosage: '',
                    })
                  }
                >
                  <AddCircleIcon />
                </Button>
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Typography style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'white' }}>*</span>
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => removeMedicines(index)}
                  disabled={medicineFields?.length < 2}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </>
          ))}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider textAlign="left">Tests Recommended</Divider>
          </Grid>

          {testFields.map((test, index) => (
            <>
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <Typography style={{ marginBottom: '10px' }}>
                  {index + 1}. Lab Test
                  <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  name={`TestsRecommended.${index}.test`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label=""
                      style={{ width: '100%' }}
                      size="small"
                      placeholder="Type of EMR"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Typography style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'white' }}>*</span>
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    appendTests({
                      test: '',
                    })
                  }
                >
                  <AddCircleIcon />
                </Button>
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1}>
                <Typography style={{ marginBottom: '10px' }}>
                  <span style={{ color: 'white' }}>*</span>
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => removeTests(index)}
                  disabled={testFields?.length < 2}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </>
          ))}

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography style={{ marginBottom: '10px' }}>
              Extra Suggesstions
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="Suggesstions"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  minRows={5}
                  label=""
                  style={{ width: '100%' }}
                  size="small"
                  placeholder="Extra Suggesstions"
                />
              )}
            />
          </Grid>
        </Grid>

        {/* <input type="submit" /> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          <Button type="submit" color="primary" variant="contained">
            Create EMR for Patient
          </Button>
        </div>
      </form>
    </>
  );
}
