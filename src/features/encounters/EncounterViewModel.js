import React, { useState } from 'react';
import '../common/viewbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const EncounterViewModel = (props) => {
  const { id, data, onClose } = props;
  const l = data.resource;

  let encounterType = ""
  let requester = ""
  let upid = ""
  let location = ""
  let encounterId = ""

  l && l.type.map((info) => {
    info.coding.map((value) => {
      encounterType = value.display
      return encounterType
    })
    return encounterType
  })

  let recordedDate = l && l.period ? new Date(l.period.start) : null;
  const formattedDateTime = recordedDate
    ? recordedDate.toISOString().replace('T', ' ').slice(0, 19)
    : "N/A";

  if (l && l.subject.hasOwnProperty("identifier")) {
    l.subject.identifier.type.coding.map((info) => {
      if (info.hasOwnProperty("display")) {
        if (info.display === "UPID") {
          upid = l.subject.identifier.value ? l.subject.identifier.value : 'N/A'
        }
      }
      return upid
    })
  }

  if (l && l.hasOwnProperty('participant')) {
    if (l && l.participant) {
      l.participant.map((info) => {
        requester = info.individual.display;
        return requester
      })
    }
  }

  if (l && l.location) {
    l.location.map((loc => {
      location = loc.location.display;
      return location
    }))
  }

  if (l && l.partOf && l.partOf.reference) {
    encounterId = l.partOf.reference.split('/')[1] || '';
  }

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (encounterId) {
      navigator.clipboard.writeText(encounterId);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
  };

  const handleOnClose = () => {
    setIsCopied(false);
    onClose();
  };

  return (
    <div>
      <div className={`modal ${id ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="heading">Encounter</h3>
          <div className="divider bg-cyan-200"></div>
          {/* <div className="model-redirect">
            <div className="pt-5">
             <Link to={`/observations`} className="redirect-link">Observation</Link>
             <Link to={`/service-requests`} className="redirect-link">Service Request</Link> 
             <Link to={`/medical-requests`} className="redirect-link">Medical Request</Link>
            </div>
          </div> */}
          <div class="grid grid-cols-2 gap-0">
            <div><span className='field-label'>Encounter Type </span></div><div>{encounterType ? encounterType : 'N/A'}</div>
            <div><span className='field-label'>Encounter Date & Time </span></div><div>{formattedDateTime ? formattedDateTime : 'N/A'}</div>
            <div><span className='field-label'>Encounter Id </span></div><div>{encounterId ? (
              <span>
                {encounterId}{' '}
                <span className="copy-icon" onClick={handleCopy}>
                  <FontAwesomeIcon icon={faCopy} />
                </span>
              </span>) : ('N/A')}</div>
            <p></p>
            <p> {isCopied && (<span className="copied-text">Copied to clipboard</span>)}</p>
            <div><span className='field-label'>UPID </span></div><div>{upid ? upid : 'N/A'}</div>
            <div><span className='field-label'>Requester </span></div><div>{requester ? requester : 'N/A'}</div>
            <div><span className='field-label'>Location </span></div><div>{location ? location : 'N/A'}</div>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={handleOnClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncounterViewModel;
