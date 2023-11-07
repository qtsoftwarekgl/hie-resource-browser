/** Icons are imported separatly to reduce build time */
import {
  EyeIcon,
  BeakerIcon,
  IdentificationIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`

const routes = [
  {
    path: '/patients',
    icon: <IdentificationIcon className={iconClasses}/>,
    name: 'Patients',
  },
  {
    path: '/encounters',
    icon: <EyeIcon className={iconClasses}/>,
    name: 'Encounters',
  },
  {
    path: '/observations',
    icon: <DocumentMagnifyingGlassIcon className={iconClasses}/>,
    name: 'Observations',
  },
  {
    path: '/service-requests',
    icon: <BeakerIcon className={iconClasses}/>,
    name: 'Service Requests',
  },
  {
    path: '/medical-requests',
    icon: <div><img width="25" height="50" src="drug-icon-dark.png" alt="drug-icon"/></div>,
    name: 'Medication Request',
  },
  {
    path: '',
    icon: <ClipboardDocumentCheckIcon className={`${iconClasses} inline` }/>,
    name: 'Audit Logs',
    submenu : [
      {
        path: '/auditlogs/cr-audit-logs',
        icon: <ClipboardDocumentListIcon className={submenuIconClasses}/>,
        name: 'CR Audit Logs',
      },
      {
        path: '/auditlogs/shr-audit-logs',
        icon: <ClipboardDocumentListIcon className={submenuIconClasses}/>,
        name: 'SHR Audit Logs',
      },    
    ]
  },
]

export default routes


