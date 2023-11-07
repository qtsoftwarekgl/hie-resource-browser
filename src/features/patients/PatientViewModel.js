import React from "react";
import "../common/viewbox.css";
import moment from "moment";

const PatientViewModel = (props) => {
  const { id, data, onClose } = props;
  const l = data.resource;

  let name = "";
  let upid = "";
  let nid = "";
  let nidApplicationnumber = "";
  let passport = "";
  let insurenceNo = "";
  let residence_address = "";
  let registrationDate = "";
  let telecom = "";
  let nationality = "";
  let education = "";
  let religion = "";
  let profession = "";
  let fathername = "";
  let mothername = "";
  let spousename = "";
  if (l) {
    if (l.hasOwnProperty("name")) {
      name = l.name[0].family + " " + l.name[0].given[0];
    }

    l.telecom.map((e) => {
      telecom = e.value;
    });
    {
      l.extension &&
        l.extension.map((ext) => {
          if (ext.valueDate) {
            registrationDate = ext.valueDate
              ? moment(ext.valueDate).format("YYYY-MM-DD")
              : "N/A";
          } else {
            registrationDate = "N/A";
          }
        });
    }

    if (l.hasOwnProperty("identifier")) {
      l.identifier.map((info) => {
        if (info.hasOwnProperty("system")) {
          if (info.system === "UPI") {
            upid = info.value ? info.value : "N/A";
          }
          if (info.system === "NID") {
            nid = info.value ? info.value : "N/A";
          }
          if (info.system === "NID_APPLICATION_NUMBER") {
            nidApplicationnumber = info.value ? info.value : "N/A";
          }
          if (info.system === "INSURANCE_POLICY_NUMBER") {
            insurenceNo = info.value ? info.value : "N/A";
          }
          if (info.system === "PASSPORT") {
            passport = info.value ? info.value : "N/A";
          }
        }
        return upid;
      });
    }

    if (l.hasOwnProperty("address")) {
      l.address.map((addressInfo) => {
        if (
          addressInfo.hasOwnProperty("line") &&
          addressInfo.line[0].match(/(RESIDENTIAL)/)
        ) {
          residence_address = addressInfo.country ? addressInfo.country : "N/A";
        }
        return residence_address;
      });
    }
  }

  {
    l &&
      l.contact &&
      l.contact.map((contact, index) => {
        console.log("first", contact);
        if (contact.name.family === "FATHER NAME") {
          fathername =
            contact.name.given && contact.name.given[0]
              ? contact.name.given[0]
              : "N/A";
        }
        if (contact.name.family === "MOTHER NAME") {
          mothername =
            contact.name.given && contact.name.given[0]
              ? contact.name.given[0]
              : "N/A";
        }
        if (contact.name.family === "SPOUSE NAME") {
          spousename =
            contact.name.given && contact.name.given[0]
              ? contact.name.given[0]
              : "N/A";
        }
      });
  }

  {
    l &&
      l.extension &&
      l.extension.map(
        (ext, index) =>
          ext.valueCodeableConcept &&
          ext.valueCodeableConcept.coding.map((val, data) => {
            let text = ext.valueCodeableConcept.text;
            if (text === "NATIONALITY") {
              if (val.code === "RW") {
                nationality = "Rwanda";
              } else {
                nationality = val.code ? val.code : "N/A";
              }
            }
            if (text === "EDUCATIONAL_LEVEL") {
              education = val.code ? val.code : "N/A";
            }
            if (text === "RELIGION") {
              religion = val.code ? val.code : "N/A";
            }
            if (text === "PROFESSION") {
              profession = val.code ? val.code : "N/A";
            }
          })
      );
  }

  return (
    <div>
      <div className={`modal ${id ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="heading">Patient</h3>
          <div className="divider bg-cyan-200"></div>
          <div className="info-container">
            <div class="grid grid-cols-2 gap-0">
              <div>
                <span className="field-label">Name </span>
              </div>
              <div>{name ? name : "N/A"}</div>
              <div>
                <span className="field-label">UPID </span>
              </div>
              <div>{upid ? upid : "N/A"}</div>
              <div>
                <span className="field-label">NID</span>
              </div>
              <div>{nid ? nid : "N/A"}</div>
              <div>
                <span className="field-label">NID Application Number</span>
              </div>
              <div>{nidApplicationnumber ? nidApplicationnumber : "N/A"}</div>
              <div>
                <span className="field-label">Passport Number</span>
              </div>
              <div>{passport ? passport : "N/A"}</div>
              <div>
                <span className="field-label">Insurance</span>
              </div>
              <div>{insurenceNo ? insurenceNo : "N/A"}</div>
              <div>
                <span className="field-label">Gender</span>
              </div>
              <div>{l.gender ? l.gender.toUpperCase() : "N/A"}</div>
              <div>
                <span className="field-label">Age</span>
              </div>
              <div>{moment().diff(Date.parse(l.birthDate), "years")}</div>
              <div>
                <span className="field-label">Telephone Number</span>
              </div>
              <div>{telecom ? telecom : "N/A"}</div>
              <div>
                <span className="field-label">Registration Date</span>
              </div>
              <div>{registrationDate ? registrationDate : "N/A"}</div>
            </div>
            <div className="grid grid-cols-2 gap-0">
              <div>
                <span className="field-label">Nationality</span>
              </div>
              <div>{nationality ? nationality : "N/A"}</div>
              <div>
                <span className="field-label">Education</span>
              </div>
              <div>{education ? education : "N/A"}</div>
              <div>
                <span className="field-label">Profession</span>
              </div>
              <div>{profession ? profession : "N/A"}</div>
              <div>
                <span className="field-label">Religion</span>
              </div>
              <div>{religion ? religion : "N/A"}</div>
              <div>
                <span className="field-label">Father Name</span>
              </div>
              <div>{fathername ? fathername : "N/A"}</div>
              <div>
                <span className="field-label">Mother Name</span>
              </div>
              <div>{mothername ? mothername : "N/A"}</div>
              <div>
                <span className="field-label">Spouse Name</span>
              </div>
              <div>{spousename ? spousename : "N/A"}</div>
              {l &&
                l.address &&
                l.address.map((address, index) => (
                  <>
                    <div key={index} className="address-block">
                      <span className="field-label">Address {index + 1}</span>
                      <div className="address-line">
                        {address.line && address.line.join(", ")}
                      </div>
                      <div>
                        {address.city ? address.city + ", " : ""}
                        {address.district ? address.district + ", " : ""}
                      </div>
                      <div>
                        {address.state ? address.state + ", " : ""}
                        {address.country ? address.country : ""}
                      </div>
                    </div>
                  </>
                ))}
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

export default PatientViewModel;
