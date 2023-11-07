import React from "react";
import "../common/viewbox.css";

const MedicalReqViewModel = (props) => {
  const { id, data, onClose } = props;
  const l = data;

  let upid = "";
  let order = "";
  let medRef = "";
  let requester_name = "";
  let frequency = "";
  let period = "";
  let periodUnit = "";
  let duration = "";
  let durationUnit = "";
  let route = "";
  let reason = "";
  if (l.resource.hasOwnProperty("medicationReference")) {
    let sub = l.resource.medicationReference;
    if (sub.hasOwnProperty("type") && sub.type === "Medication") {
      order = sub.type ? sub.type : "N/A";
      medRef = sub.display ? sub.display : "N/A";
    }
  }
  if (l.resource.hasOwnProperty("subject")) {
    let sub = l.resource.subject;
    sub.hasOwnProperty("identifier") &&
      sub.identifier.type.coding.map((info) => {
        if (info.code === "UPID") {
          upid = sub.identifier.value ? sub.identifier.value : "N/A";
        }
        return upid;
      });
  }
  if (l.resource.hasOwnProperty("requester")) {
    let sub = l.resource.requester;
    if (sub.hasOwnProperty("type") && sub.type === "Practitioner") {
      requester_name = sub.display ? sub.display : "N/A";
    }
  }

  if (l.resource.hasOwnProperty("dosageInstruction")) {
    let sub = l.resource.dosageInstruction;
    if (sub[0].timing.repeat) {
      let repeat = sub[0].timing.repeat;
      frequency = repeat.frequency;
      period = repeat.period;
      periodUnit = repeat.periodUnit;
      duration = repeat.duration;
      durationUnit = repeat.durationUnit;
      let ro = sub[0].route.coding[0];
      route = ro ? ro.display : "N/A";
    }
  }

  return (
    <div>
      <div className={`modal ${id ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="heading">Medication Request</h3>
          <div className="divider bg-cyan-200"></div>
          <div class="grid grid-cols-2 gap-0">
            <div>
              <span className="field-label">Type </span>
            </div>
            <div>{order ? order : "N/A"}</div>
            <div>
              <span className="field-label">UPID </span>
            </div>
            <div>{upid ? upid : "N/A"}</div>
            <div>
              <span className="field-label">Requester </span>
            </div>
            <div>{requester_name ? requester_name : "N/A"}</div>
            <div>
              <span className="field-label">Period </span>
            </div>
            <div>{period ? period + periodUnit : "N/A"}</div>
            <div>
              <span className="field-label">Frequency </span>
            </div>
            <div>{frequency ? frequency : "N/A"}</div>
            <div>
              <span className="field-label">Duration </span>
            </div>
            <div>{duration ? duration + durationUnit : "N/A"}</div>
            <div>
              <span className="field-label">Route </span>
            </div>
            <div>{route ? route : "N/A"}</div>
            <div>
              <span className="field-label">Reason </span>
            </div>
            <div>{reason ? reason : "N/A"}</div>
            <div>
              <span className="field-label">Medication Reference </span>
            </div>
            <div>{medRef ? medRef : "N/A"}</div>
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

export default MedicalReqViewModel;
