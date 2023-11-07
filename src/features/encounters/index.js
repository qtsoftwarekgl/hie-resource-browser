import React, { Component } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import API from "../../app/init";
import * as URL from "../../app/lib/apiUrls";
import EncounterViewModel from "./EncounterViewModel";
import Datepicker from "react-tailwindcss-datepicker";
import Loader from "../../components/Loader";
import "../common/list.css";

export default class Encounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 10,
      totalRecords: 0,
      encounterData: [],
      showLoader: false,
      dateValue: "",
      searchSet: "ALL",
      searcValue: "",
      location: "",
      viewModel: false,
      display: "none",
      actionData: "",
    };
  }

  componentDidMount() {
    this.handleGetEncounterReq(1, this.state.size);
  }

  handleGetEncounterReq = async (page, size) => {
    this.setState({ showLoader: true });
    const { searcValue, searchSet, dateValue, location } = this.state;
    let url = `${URL.ENCOUNTERS_LIST}?page=${page}&size=${size}`;
    if (location) {
      url += `&location=${location}`;
    }
    if (
      dateValue &&
      dateValue.startDate !== null &&
      dateValue.endDate !== null
    ) {
      url += `&fromDate=${dateValue.startDate}&toDate=${dateValue.endDate}`;
    }
    if (searcValue && searchSet !== "ALL") {
      url += `&searchSet=${searchSet}&value=${searcValue}`;
    } else {
      url += `&searchSet=ALL`;
    }
    API.get(url, {})
      .then((response) => {
        this.setState({
          encounterData: response.entry ? response.entry : [],
          showLoader: false,
          page: page,
          totalRecords: response.entry
            ? response.entry[0].resource.meta.versionId
            : 0,
          display: "none",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleSearch = (event, pageNumber = 1) => {
    const { searcValue, size, searchSet, dateValue, location } = this.state;
    let currentSize = size;
    if (event && event.target.name === "size") {
      currentSize = event.target.value;
      this.setState({ size: currentSize });
    }
    let url = URL.ENCOUNTERS_LIST;
    if (currentSize) {
      url = `${url}?page=${pageNumber}&size=${currentSize}`;
    }
    if (location) {
      url += `&location=${location}`;
    }
    if (
      dateValue &&
      dateValue.startDate !== null &&
      dateValue.endDate !== null
    ) {
      url += `&fromDate=${dateValue.startDate}&toDate=${dateValue.endDate}`;
    }
    if (searcValue) {
      url += `&searchSet=${searchSet}&value=${searcValue}`;
    } else {
      url += `&searchSet=ALL`;
    }
    this.setState({ showLoader: true });
    API.get(url, {})
      .then((response) => {
        this.setState({
          encounterData: response.entry ? response.entry : [],
          totalRecords: response.entry
            ? response.entry[0].resource.meta.versionId
            : 0,
          showLoader: false,
          page: pageNumber,
          display: "none",
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
        this.handleGetEncounterReq(this.state.page, this.state.size);
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

  onActionClicked = (rowData) => {
    this.setState({
      viewModel: true,
      actionData: rowData,
    });
  };

  handleDatePickerValueChange = (newValue) => {
    this.setState({ dateValue: newValue });
  };

  handleChange = (event) => {
    const { value } = event.target;
    const { name } = event.target;
    if (name === "searchSet") {
      this.setState({ searchSet: value });
    }
    if (name === "searcValue") {
      this.setState({ searcValue: value });
    }
    if (name === "location") {
      this.setState({ location: value });
    }
  };

  handleClear = () => {
    this.setState(
      { location: "",searcValue: "", page: 1, size: 10, searchSet: "ALL" },
      () => {
        this.handleGetEncounterReq(1, 10);
      }
    );
  };

  render() {
    const {
      encounterData,
      searcValue,
      dateValue,
      totalRecords,
      showLoader,
      viewModel,
      actionData,
      size,
      page,
      searchSet,
      location,
      display,
    } = this.state;
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
            <div className="grid grid-rows-2 grid-flow-col gap-4 float-left">
              <div className="px-1">
                <label className="label">Encounter type</label>
                <select
                  className="select w-full max-w-xs select-accent"
                  onChange={this.handleChange}
                  name="searchSet"
                  value={searchSet}
                >
                  <option value="ALL">ALL</option>
                  <option value="LAB_TEST">LAB_TEST</option>
                  <option value="DRUG_ORDER">DRUG_ORDER</option>
                  <option value="VISIT">VISIT</option>
                  <option value="DRUG_ADMINISTRATION">
                    DRUG_ADMINISTRATION
                  </option>
                  <option value="Diagnosis">Diagnosis</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>
              <div className="px-1">
                <label className="label">Facility</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  name="location"
                  value={location}
                  onChange={this.handleChange}
                />
              </div>
              <div className="px-1">
                <label className="label">UPID</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  name="searcValue"
                  value={searcValue}
                  onChange={this.handleChange}
                />
              </div>
              <div className="px-1">
                <label className="label">Encounter Date</label>
                <Datepicker
                  containerClassName="relative"
                  value={dateValue ? dateValue : ""}
                  theme={"light"}
                  inputClassName="input input-bordered w-full"
                  popoverDirection={"down"}
                  onChange={this.handleDatePickerValueChange}
                  showShortcuts={true}
                  primaryColor={"white"}
                />
              </div>
              <div className="px-1 pt-10">
                <button className="btn btn-accent" onClick={this.handleSearch}>
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="px-1 pt-10">
                <button className="btn btn-accent" onClick={this.handleClear}>
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="pt-10 px-1" style={{ display: display }}>
                <div className="alert alert-error shadow-lg pt-1">
                  <ExclamationCircleIcon className="h-6 w-6" />
                  <span>Please enter UPID</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TitleCard
          title={
            <div className="flex items-center">
              List of Encounters
              <div
                className="ml-auto"
                style={{ fontStyle: "italic", fontSize: "small" }}
              >
                Records per page
                <select
                  className="select max-w-xs select-accent ml-2"
                  onChange={this.handleSearch}
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
            Showing {encounterData.length} out of {totalRecords} records
          </div>
          <div className="overflow-x-auto w-full">
            <table
              className="table table-xs table-pin-rows table-pin-cols"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Encounter Type</th>
                  <th>UPID</th>
                  <th>Requester</th>
                  <th>Encounter Date & Time</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {encounterData.length > 0 ? (
                <tbody>
                  {encounterData &&
                    encounterData.map((l, k) => {
                      let encounterType = "";
                      let upid = "";
                      let requester = "";
                      let location = "";
                      if (
                        l.resource &&
                        l.resource.subject.hasOwnProperty("identifier")
                      ) {
                        l.resource.subject.identifier.type.coding.map(
                          (info) => {
                            if (info.hasOwnProperty("display")) {
                              if (info.display === "UPID") {
                                upid = l.resource.subject.identifier.value
                                  ? l.resource.subject.identifier.value
                                  : "N/A";
                              }
                            }
                            return upid;
                          }
                        );
                      }

                      l.resource &&
                        l.resource.type.map((info) => {
                          info.coding.map((value) => {
                            encounterType = value.display;
                            return encounterType;
                          });
                          return encounterType;
                        });

                      if (
                        l.resource &&
                        l.resource.hasOwnProperty("participant")
                      ) {
                        if (l.resource && l.resource.participant) {
                          l.resource.participant.map((info) => {
                            requester = info.individual.display;
                            return requester;
                          });
                        }
                      }

                      if (l.resource && l.resource.location) {
                        l.resource.location.map((loc) => {
                          location = loc.location.display;
                          return location;
                        });
                      }

                      let recordedDate = l && l.resource.period ? new Date(l.resource.period.start) : null;
                      const formattedDateTime = recordedDate
                        ? recordedDate.toISOString().replace('T', ' ').slice(0, 19)
                        : "N/A";
                      
                      return (
                        <tr key={k}>
                          <td>{k + 1}</td>
                          <td>{encounterType ? encounterType : "N/A"}</td>
                          <td>{upid ? upid : "N/A"}</td>
                          <td>{requester ? requester : "N/A"}</td>
                          <td>{formattedDateTime ? formattedDateTime : "N/A"}</td>
                          <td>{location ? location : "N/A"}</td>
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
                                                        <ClipboardDocumentCheckIcon onClick={() => this.onActionAuditClicked(l)} className='h-6 w-6 stroke-purple-500 hover:stroke-purple-700'/>
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
        <EncounterViewModel
          id={viewModel}
          data={actionData}
          onClose={() => this.setState({ viewModel: false })}
        />

        {showLoader ? <Loader id={showLoader} /> : null}
      </>
    );
  }
}
