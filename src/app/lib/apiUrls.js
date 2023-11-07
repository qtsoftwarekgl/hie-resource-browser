const { REACT_APP_BASE_URL } = process.env;

module.exports = {
  PATIENT_LIST: `${REACT_APP_BASE_URL}/clientregistry/Patient`,
  ENCOUNTERS_LIST: `${REACT_APP_BASE_URL}/shr/Encounter`,
  OBSERVATION_LIST: `${REACT_APP_BASE_URL}/shr/Observation`,
  MEDICATION_REQUEST_LIST: `${REACT_APP_BASE_URL}/shr/MedicationRequest`,
  SERVICE_REQUEST_LIST: `${REACT_APP_BASE_URL}/shr/ServiceRequest`,
  AUDIT_LOGS_LIST: `${REACT_APP_BASE_URL}/clientregistry/AuditEvent`,
  SHR_AUDIT_LOGS_LIST: `${REACT_APP_BASE_URL}/shr/AuditEvent`,
};