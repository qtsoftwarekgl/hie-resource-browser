import React, { Component } from "react";
import moment from "moment";
import TitleCard from "../../components/Cards/TitleCard";
import _ from "lodash";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import API from "../../app/init";
import * as URL from "../../app/lib/apiUrls";
import PatientViewModel from "./PatientViewModel";
import Loader from "../../components/Loader";
import Datepicker from "react-tailwindcss-datepicker";
import "../common/list.css";

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 10,
      totalRecords: 0,
      dateValue: null,
      patientData: [],
      showLoader: false,
      searcValue: "",
      viewModel: false,
      actionData: "",
      filterParam: "",
      filterval: [],
      options: [
        { value: "upid", label: "UPID" },
        { value: "nid", label: "NID" },
        { value: "family", label: "Surname" },
        { value: "given", label: "PostNames" },
        { value: "gender", label: "Gender" },
        { value: "age", label: "Age" },
        { value: "facility", label: "Facility" },
        { value: "registrationDate", label: "Registration Date" },
      ],
      allOptions: [],
      upid: "",
      nid: "",
      gender: "",
      age: "",
      facility: "",
      given: "",
      family: "",
      textDisp: "none",
      dateDisp: "none",
      errorDisp: "none",
    };
  }

  componentDidMount() {
    this.handleGetPatients(1, this.state.size);
    const stateCopy = _.cloneDeep(this.state);
    const { options } = JSON.parse(JSON.stringify(stateCopy));
    let allOptions = Object.assign({}, options);
    stateCopy.allOptions = allOptions;
    this.setState(stateCopy);
  }

  handleGetPatients = async (page, size) => {
    this.setState({ showLoader: true });
    let url = `${URL.PATIENT_LIST}?page=${page}&size=${size}`;
    API.get(url, {})
      .then((response) => {
        this.setState({
          patientData: response.entry ? response.entry : [],
          showLoader: false,
          page: page,
          totalRecords: response.entry
            ? response.entry[0].resource.meta.versionId
            : 0,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSizeChange = (event) => {
    let currentSize = "";
    if (event && event.target.name === "size") {
      currentSize = event.target.value;
      this.setState({ size: currentSize }, () => {
        this.handleSearch();
      });
    }
  };
  handleSearch = () => {
    let url = URL.PATIENT_LIST;
    const {
      size,
      page,
      upid,
      nid,
      age,
      facility,
      family,
      given,
      gender,
      dateValue,
    } = this.state;
    url += `?page=${page}&size=${size}`;
    if (upid !== "") {
      url += `&identifier=${upid}`;
    }
    if (nid !== "") {
      url += `&identifier=${nid}`;
    }
    if (family !== "") {
      url += `&family=${family}`;
    }
    if (given !== "") {
      url += `&given=${given}`;
    }
    if (age !== "") {
      url += `&age=${age}`;
    }
    if (gender !== "") {
      url += `&gender=${gender}`;
    }
    if (facility !== "") {
      url += `&facility=${facility}`;
    }
    if (dateValue !== null) {
      url += `&fromDate=${dateValue.startDate}&endDate=${dateValue.endDate}`;
    }
    this.setState({ showLoader: true , errorDisp: "none"});
    API.get(url, {})
      .then((response) => {
        this.setState({
          patientData: response.entry ? response.entry : [],
          totalRecords: response.entry
            ? response.entry[0].resource.meta.versionId
            : 0,
          showLoader: false,
          page: page,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handlePageChange = (pageNumber) => {
    this.setState(
      {
        page: pageNumber,
      },
      () => {
        this.handleSearch();
      }
    );
  };

  handlePrevPage = () => {
    if (this.state.page > 1) {
      const newPage = this.state.page - 1;
      this.handlePageChange(newPage);
    }
  };

  handleNextPage = () => {
    if (
      this.state.page < Math.ceil(this.state.totalRecords / this.state.size)
    ) {
      const newPage = this.state.page + 1;
      this.handlePageChange(newPage);
    }
  };

  handleChange = (event) => {
    const { value } = event.target;
    const { name } = event.target;
    if (name === "searcValue") {
      this.setState({ searcValue: value });
    }
  };

  handleDatePickerValueChange = (newValue) => {
    this.setState({ dateValue: newValue });
  };

  onActionClicked = (rowData) => {
    this.setState({
      viewModel: true,
      actionData: rowData,
    });
  };

  removeAppliedFilter = (value, index) => {
    const findIndex = index;
    const stateCopy = _.cloneDeep(this.state);
    const { filterval } = stateCopy;
    const { allOptions, options } = JSON.parse(JSON.stringify(stateCopy));
    let selOp = {};
    if (value === "registrationDate") {
      stateCopy.dateValue = null;
      stateCopy.dateDisp = "none";
      stateCopy.errorDisp= "none";
    } else {
      stateCopy[value] = "";
      stateCopy.textDisp = "none";
      stateCopy.errorDisp= "none";
    }
    _.find(allOptions, function (obj) {
      if (obj.value === value) {
        selOp.value = obj.value;
        selOp.label = obj.label;
      }
    });
    if (!_.isEmpty(selOp)) {
      options.push(selOp);
    }
    stateCopy.options = options;
    findIndex !== -1 && filterval.splice(findIndex, 1);
    stateCopy.filterval = filterval;
    stateCopy.filterParam = "";
    this.setState(stateCopy, () => {
      this.handleSearch();
    });
  };

  removeAllFilters = () => {
    this.setState(
      {
        filterval: [],
        textDisp: "none",
        dateDisp: "none",
        errorDisp: "none",
        dateValue: null,
        nid: "",
        upid: "",
        family: "",
        given: "",
        gender: "",
        age: "",
        facility: "",
      },
      () => {
        this.handleSearch();
      }
    );
  };

  addedFilter = async (value) => {
    const { searcValue, filterParam, dateValue } = this.state;
    const stateCopy = _.cloneDeep(this.state);
    const { filterval } = stateCopy;
    const { options } = JSON.parse(JSON.stringify(stateCopy));
    let selOp = "";
    _.find(options, function (obj) {
      if (obj.value === filterParam) {
        selOp = obj.label;
      }
    });
    if (searcValue) {
      if (value === "upid") {
        stateCopy.upid = searcValue;
      }
      if (value === "nid") {
        stateCopy.nid = searcValue;
      }
      if (value === "family") {
        stateCopy.family = searcValue;
      }
      if (value === "given") {
        stateCopy.given = searcValue;
      }
      if (value === "gender") {
        stateCopy.gender = searcValue;
      }
      if (value === "age") {
        stateCopy.age = searcValue;
      }
      if (value === "facility") {
        stateCopy.facility = searcValue;
      }
      let params = { label: value, value: `${selOp} : ${searcValue}` };
      stateCopy.filterval = _.concat(filterval, params);

      stateCopy.textDisp = "none";
      stateCopy.searcValue = "";
      const findIndex = options.findIndex((a) => a.value === value);
      findIndex !== -1 && options.splice(findIndex, 1);
      stateCopy.options = options;
      this.setState(stateCopy, () => {
        this.handleSearch();
      });
    } else {
      this.setState({ errorDisp: "block" });
    }
    if (value === "registrationDate" && dateValue) {
      if (
        dateValue &&
        dateValue.startDate !== null &&
        dateValue.endDate !== null
      ) {
        stateCopy.filterParam = "Registration Date";
        let params = {
          label: value,
          value: `FomDate : ${dateValue.startDate} - ToDate : ${dateValue.endDate}`,
        };
        stateCopy.filterval = _.concat(filterval, params);
      }
      stateCopy.dateDisp = "none";
      const findIndex = options.findIndex((a) => a.value === value);
      findIndex !== -1 && options.splice(findIndex, 1);
      stateCopy.options = options;
      this.setState(stateCopy, () => {
        this.handleSearch();
      });
    } else {
      this.setState({ errorDisp: "block" });
    }
  };

  handleDropdown = (event) => {
    const stateCopy = _.cloneDeep(this.state);
    if (
      event === "nid" ||
      event === "upid" ||
      event === "family" ||
      event === "given" ||
      event === "gender" ||
      event === "age" ||
      event === "facility"
    ) {
      stateCopy.textDisp = "block";
      stateCopy.filterParam = event;
    }
    if (event === "registrationDate") {
      stateCopy.dateDisp = "block";
      stateCopy.filterParam = event;
    }
    this.setState(stateCopy);
  };

  render() {
    const {
      patientData,
      searcValue,
      viewModel,
      actionData,
      showLoader,
      page,
      size,
      dateValue,
      totalRecords,
      filterval,
      filterParam,
      options,
      textDisp,
      dateDisp,
      errorDisp,
    } = this.state;
    let selOp = "";
    _.find(options, function (obj) {
      if (obj.value === filterParam) {
        selOp = obj.label;
      }
    });
    const totalPages = Math.ceil(totalRecords / size);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePageNumbers = pageNumbers.slice(
      Math.max(0, page - 2),
      Math.min(page + 1, totalPages)
    );
    return (
      <>
        <div className={"card w-full p-6 bg-base-100 shadow-xl"}>
          <div className="h-full w-full pb-6 bg-base-100">
            <div className="flex flex items-start">
              <div className="dropdown">
                <label tabIndex={0} className="btn m-1">
                  Filters &nbsp;&nbsp;
                  <FunnelIcon className="w-5 mr-2" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 w-full rounded-box w-52"
                >
                  {options.map((item, k) => {
                    return (
                      <li key={k}>
                        <a
                          href="#"
                          onClick={() => this.handleDropdown(item.value)}
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                  <div className="divider mt-0 mb-0"></div>
                  <li>
                    <a href="#" onClick={() => this.removeAllFilters()}>
                      Remove Filter &nbsp;&nbsp;
                      <TrashIcon className="h-6 w-6" />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="px-1 flex flex items-start float-right">
                {filterval &&
                  !_.isEmpty(filterval) &&
                  filterval.map((element, index) => (
                    <div style={{ paddingLeft: "5px" }}>
                      <button
                        key={index}
                        className="btn btn-md btn-accent normal-case"
                        onClick={() =>
                          this.removeAppliedFilter(element.label, index)
                        }
                      >
                        {element.value}
                        <XMarkIcon className="w-4 ml-2" />
                      </button>
                    </div>
                  ))}
                {selOp && selOp !== "Registration Date" ? (
                  <div
                    className="grid grid-cols-4 gap-2"
                    style={{ paddingLeft: "5px" }}
                  >
                    <div
                      className="grid grid-rows-1 gap-2"
                      style={{ display: textDisp }}
                    >
                      <div>
                        <input
                          type="text"
                          placeholder={selOp}
                          className="input input-bordered w-full max-w-xs"
                          name="searcValue"
                          value={searcValue}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div
                      className="grid grid-row-1 gap-2"
                      style={{ display: textDisp }}
                    >
                      <button
                        className="pr-5 btn btn-accent"
                        onClick={() => this.addedFilter(filterParam)}
                      >
                        <MagnifyingGlassIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ) : null}
                {selOp && selOp === "Registration Date" ? (
                  <div
                    className="grid grid-cols-4 gap-2"
                    style={{ paddingLeft: "5px" }}
                  >
                    <div
                      className="grid grid-rows-1 gap-2"
                      style={{ display: dateDisp }}
                    >
                      <div className="float-left">
                        <Datepicker
                          containerClassName="relative"
                          placeholder={selOp}
                          value={dateValue ? dateValue : null}
                          theme={"light"}
                          inputClassName="input input-bordered w-full"
                          popoverDirection={"down"}
                          onChange={this.handleDatePickerValueChange}
                          showShortcuts={true}
                          primaryColor={"white"}
                        />
                      </div>
                    </div>
                    <div
                      className="grid grid-row-1 gap-2"
                      style={{ display: dateDisp }}
                    >
                      <button
                        className="pr-5 btn btn-accent"
                        onClick={() => this.addedFilter(filterParam)}
                      >
                        <MagnifyingGlassIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ) : null}
                <div className="float-right error-box" style={{ display: errorDisp }}>
                  <div className="alert alert-error shadow-lg">
                    <ExclamationCircleIcon className="h-6 w-6" />
                    <span>Please enter the value</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TitleCard
          title={
            <div className="flex items-center">
              List of Registered Patients
              <div
                className="ml-auto"
                style={{ fontStyle: "italic", fontSize: "small" }}
              >
                Records per page
                <select
                  className="select max-w-xs select-accent ml-2"
                  onChange={this.handleSizeChange}
                  name="size"
                  value={size}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
                  <option value="60">60</option>
                  <option value="70">70</option>
                  <option value="80">80</option>
                  <option value="90">90</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          }
          topMargin="mt-2"
        >
          <div className="pb-3 float-right btn-group">
            <button
              className={`first-btn bor btn  ${
                page === 1 ? "btn-disabled" : "btn-normal"
              } tooltip`}
              data-tip="First page"
              onClick={() => this.handlePageChange(1)}
              disabled={page === 1}
            >
              {"<<"}
            </button>
            <button
              className={`pagination-item bor btn ${
                page === 1 ? "btn-disabled" : ""
              } tooltip`}
              data-tip="Previous page"
              onClick={this.handlePrevPage}
              disabled={page === 1}
            >
              {"<"}
            </button>
            {visiblePageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                className={`btn ${
                  pageNum === page ? "btn-actives" : "btn-normal"
                } tooltip`}
                data-tip={`Page ${pageNum}`}
                onClick={() => this.handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className={`pagination-item bor btn ${
                page === totalPages ? "btn-disabled" : "btn-normal"
              } tooltip`}
              data-tip="Next page"
              onClick={this.handleNextPage}
              disabled={page === totalPages || totalRecords === 0}
            >
              {">"}
            </button>
          </div>
          <div className="pb-1">
            {" "}
            Showing {patientData.length} out of {totalRecords} records
          </div>

          <div className="overflow-x-auto w-full">
            <table
              className="table table-xs table-pin-rows table-pin-cols"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Facility</th>
                  <th>Upid</th>
                  <th>Primary care ID</th>
                  <th>Patient Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>sector</th>
                  <th>Registration date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {patientData.length > 0 ? (
                <tbody>
                  {patientData &&
                    patientData.map((l, k) => {
                      let name = "";
                      if (l.resource.hasOwnProperty("name")) {
                        name =
                          l.resource.name[0].family +
                          " " +
                          l.resource.name[0].given[0];
                      }

                      let upid = "";
                      let nida = "";
                      let residence_address = "";
                      let registrationDate = "";
                      let location = "";
                      let locationId = "";
                      let facility = "";
                      if (l.resource.hasOwnProperty("identifier")) {
                        l.resource.identifier.map((info) => {
                          if (info.hasOwnProperty("system")) {
                            if (info.system === "UPI") {
                              upid = info.value ? info.value : "N/A";
                            } else if (
                              info.system === "NID" ||
                              info.system === "PASSPORT"
                            ) {
                              nida = info.value ? info.value : "N/A";
                            }
                          }
                          return upid;
                        });
                      }

                      if (l.resource.hasOwnProperty("address")) {
                        l.resource.address.map((addressInfo) => {
                          if (
                            addressInfo.hasOwnProperty("line") &&
                            addressInfo.line[0].match(/(RESIDENTIAL)/)
                          ) {
                            residence_address = addressInfo.city
                              ? addressInfo.city
                              : "N/A";
                          }
                          return residence_address;
                        });
                      }

                      if(l.resource.extension){
                          l.resource.extension.map((ext) => {
                            if (ext.valueDate) {
                              registrationDate = ext.valueDate
                                ? moment(ext.valueDate).format("YYYY-MM-DD")
                                : "N/A";
                            } else {
                              registrationDate = "N/A";
                            }
                            return registrationDate;
                          });
                      }

                      if (
                        l.resource.hasOwnProperty("managingOrganization") &&
                        l.resource.managingOrganization
                      ) {
                        location = l.resource.managingOrganization.display;
                        locationId =
                          l.resource.managingOrganization.identifier.value;
                        facility = locationId + " - " + location;
                      } else {
                        facility = "N/A";
                      }

                      return (
                        <tr key={k}>
                          <td>{k + 1}</td>
                          <td>{facility}</td>
                          <td>{upid}</td>
                          <td>{nida}</td>
                          <td>{name}</td>
                          <td>{l.resource.gender.toUpperCase()}</td>
                          <td>
                            {moment().diff(
                              Date.parse(l.resource.birthDate),
                              "years"
                            )}
                          </td>
                          <td>{residence_address}</td>
                          <td>{registrationDate}</td>
                          <td>
                            <div
                              className="tooltip tooltip-info"
                              data-tip="View"
                            >
                              <EyeIcon
                                onClick={() => this.onActionClicked(l)}
                                className="h-6 w-6 stroke-secondary hover:stroke-secondary-focus"
                              />
                            </div>
                            {/* <div className="tooltip tooltip-info" data-tip="Audit Log">
                                                        <ClipboardDocumentCheckIcon className='h-6 w-6 stroke-purple-500 hover:stroke-purple-700'/>
                                                    </div> */}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              ) : (
                <div className="pt-2">No record found</div>
              )}
            </table>
          </div>
        </TitleCard>
        {viewModel ? (
          <PatientViewModel
            id={viewModel}
            data={actionData}
            onClose={() => this.setState({ viewModel: false })}
          />
        ) : null}

        {showLoader ? <Loader id={showLoader} /> : null}
      </>
    );
  }
}
