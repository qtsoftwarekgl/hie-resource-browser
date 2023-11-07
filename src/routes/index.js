// All components mapping with path for internal routes

import { lazy } from 'react'

const Page404 = lazy(() => import('../pages/protected/404'))
const Blank = lazy(() => import('../pages/protected/Blank'))
const Patients = lazy(() => import('../pages/protected/Patients'))
const Encounters = lazy(() => import('../pages/protected/Encounters'))
const MedicalRequests = lazy(() => import('../pages/protected/MedicalRequests'))
const ServiceRequests = lazy(() => import('../pages/protected/ServiceRequest'))
const Observations = lazy(() => import('../pages/protected/Observation'))
const AuditLogs = lazy(() => import('../pages/protected/AuditLogs'))
const ShrAuditLogs = lazy(() => import('../pages/protected/ShrAuditLogs'))

const routes = [
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/patients',
    component: Patients,
  },
  {
    path: '/encounters',
    component: Encounters,
  },
  {
    path: '/medical-requests',
    component: MedicalRequests,
  },
  {
    path: '/service-requests',
    component: ServiceRequests,
  },
  {
    path: '/observations',
    component: Observations,
  },
  {
    path: '/auditlogs/cr-audit-logs',
    component: AuditLogs,
  },
  {
    path: '/auditlogs/shr-audit-logs',
    component: ShrAuditLogs,
  }
]

export default routes
