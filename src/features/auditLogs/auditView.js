import React from "react";
import "../common/viewbox.css";
import _ from "lodash";
import { ACTIONS } from "../../app/lib/constants";

const AuditViewModel = (props) => {
  const { id, data, onClose } = props;

  const l = data.resource;
  let reference = "";
  let type = "";
  let satusCode = "";
  let role = "";
  let agentId = "";
  let agentName = "";

  if (l && l.hasOwnProperty("entity")) {
    if (l && l.entity) {
      l.entity.map((data) => {
        reference = data.what.reference;
        type = data.name;
      });
    }
  }

  if (l && l.hasOwnProperty("agent")) {
    if (l && l.agent) {
      l.agent.map((data) => {
        data.role.map((name) => {
          role = name.text;
        });
        agentId = data.who.identifier.value;
        agentName = data.who.display;
      });
    }
  }

  let act = l && l.action;
  _.find(ACTIONS, function (obj) {
    if (obj.value === act) {
      satusCode = obj.label;
    }
  });
  let recordedDate = l && l && l.recorded ? new Date(l.recorded) : null;
  const formattedDateTime = recordedDate
    ? recordedDate.toISOString().replace('T', ' ').slice(0, 19)
    : "N/A";

  return (
    <div>
      <div className={`modal ${id ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="heading">CR AUDIT LOGS</h3>
          <div className="divider bg-cyan-200"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="event-details">
              <h2>Event</h2>
              <div>
                <span className="field-label">Event Date & Time:</span>
                {formattedDateTime ? formattedDateTime : "N/A"}
              </div>
              <div>
                <span className="field-label">Event Type:</span>
                {satusCode ? satusCode : "N/A"}
              </div>
            </div>
            <div className="agent-details">
              <h2>Agent</h2>
              <div>
                <span className="field-label">Agent Name:</span>
                {agentName ? agentName : "N/A"}
              </div>
              <div>
                <span className="field-label">Agent ID:</span>
                {agentId ? agentId : "N/A"}
              </div>
              <div>
                <span className="field-label">Role:</span>
                {role ? role : "N/A"}
              </div>
            </div>
          </div>
          <div
            className="grid grid-cols-1 gap-2"
            style={{ paddingTop: "20px" }}
          >
            <div className="entity-details">
              <h2>Entities</h2>
              <div>
                <span className="field-label">Reference:</span>
                {reference ? reference : "N/A"}
              </div>
              <div>
                <span className="field-label">Type:</span>
                {type ? type : "N/A"}
              </div>
            </div>
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

export default AuditViewModel;
