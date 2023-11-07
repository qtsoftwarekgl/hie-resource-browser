module.exports = {
  SESSION: {
    TOKEN: 'token',
    EXPIRED: 'session_expired',
    EXPIRED_ERROR_CODE: 310
  },
  HEADER: {
    TOKEN: 'x-auth-token',
    CONTENT_TYPE: 'application/json',
    MULTIPART_CONTENT_TYPE: 'multipart/form-data',
    TIMEOUT: 120000
  },
  ERROR: {
    MSG: 'error',
    INVALID_RESPONSE: 'INVALID_RESPONSE'
  },
  ACTIONS: [
    {label : "Create", value:"C"},
    {label : "Update", value:"U"},
    {label : "Search", value:"R"},
    {label : "Delete", value:"D"},
    {label : "Execute", value:"E"}
  ]
};
