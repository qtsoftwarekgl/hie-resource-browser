import React from "react";
import "../common/viewbox.css";

const ServiceViewModel = (props) => {
  const { id, data, onClose } = props;
  const l = data.resource;
  let requester = "";
  let upid = "";
  let OrderType = l && l.encounter ? l.encounter.type : "N/A";
  let recordedDate = l && l.occurrencePeriod ? new Date(l.occurrencePeriod.start) : null;
  const formattedDateTime = recordedDate
    ? recordedDate.toISOString().replace('T', ' ').slice(0, 19)
    : "N/A";
      
  let status = l && l.status;
  if (l && l.subject.hasOwnProperty("identifier")) {
    l.subject.identifier.type.coding.map((info) => {
      if (info.hasOwnProperty("display")) {
        if (info.display === "UPID") {
          upid = l.subject.identifier.value
            ? l.subject.identifier.value
            : "N/A";
        }
      }
      return upid;
    });
  }

  if (l && l.hasOwnProperty("requester")) {
    if (l && l.requester.type) {
      requester = l.requester.display;
    }
  }

  return (
    <div>
      <div className={`modal ${id ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="heading">Service Request</h3>
          <div className="divider bg-cyan-200"></div>
          <div class="grid grid-cols-2 gap-0">
            <div>
              <span className="field-label">Order Type </span>
            </div>
            <div>{OrderType ? OrderType : "N/A"}</div>
            <div>
              <span className="field-label">Request Date & Time </span>
            </div>
            <div>{formattedDateTime ? formattedDateTime : "N/A"}</div>
            <div>
              <span className="field-label">UPID </span>
            </div>
            <div>{upid ? upid : "N/A"}</div>
            <div>
              <span className="field-label">Status </span>
            </div>
            <div>{status ? status : "N/A"}</div>
            <div>
              <span className="field-label">Requester </span>
            </div>
            <div>{requester ? requester : "N/A"}</div>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceViewModel;
