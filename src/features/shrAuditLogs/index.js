import React, { Component } from "react";
import _ from "lodash";
import TitleCard from "../../components/Cards/TitleCard";
import API from "../../app/init";
import * as URL from "../../app/lib/apiUrls";
import Loader from "../../components/Loader";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import "../common/list.css";
import AuditViewModel from "./auditView";
import Datepicker from "react-tailwindcss-datepicker";
import { ACTIONS } from "../../app/lib/constants";

export default class AuditLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      size: 10,
      totalRecords: 0,
      showLoader: false,
      dateValue: "",
      auditData: [],
      searcValue: "",
      viewModel: false,
      actionData: "",
    };
  }

  componentDidMount() {
    this.handleGetAuditReq(1, this.state.size);
  }

  handleGetAuditReq = async (page, size) => {
    this.setState({ showLoader: true });
    let url = `${URL.SHR_AUDIT_LOGS_LIST}?page=${page}&size=${size}`;
    const { searcValue, dateValue } = this.state;
    if (searcValue && searcValue !== "ALL") {
      url += `&type=${searcValue}`;
    }
    if (dateValue) {
      url += `&fromDate=${dateValue.startDate}&toDate=${dateValue.endDate}`;
    }
    API.get(url, {})
      .then((response) => {
        this.setState({
          auditData: response.entry ? response.entry : [],
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

  handleSearch = (event, pageNumber = 1) => {
    const { searcValue, size, dateValue } = this.state;
    let currentSize = size;
    if (event && event.target.name === "size") {
      currentSize = event.target.value;
      this.setState({ size: currentSize });
    }
    let url = URL.SHR_AUDIT_LOGS_LIST;
    if (currentSize) {
      url = `${url}?page=${pageNumber}&size=${currentSize}`;
    }
    if (searcValue && searcValue !== "ALL") {
      url += `&type=${searcValue}`;
    }
    if (dateValue) {
      url += `&fromDate=${dateValue.startDate}&toDate=${dateValue.endDate}`;
    }
    this.setState({ showLoader: true });
    API.get(url, {})
      .then((response) => {
        this.setState({
          auditData: response.entry ? response.entry : [],
          totalRecords: response.entry
            ? response.entry[0].resource.meta.versionId
            : 0,
          showLoader: false,
          page: pageNumber,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDatePickerValueChange = (newValue) => {
    this.setState({ dateValue: newValue });
  };

  handlePageChange = (pageNumber) => {
    this.setState(
      {
        page: pageNumber,
      },
      () => {
        this.handleGetAuditReq(this.state.page, this.state.size);
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

  handleChange = (event) => {
    const { value } = event.target;
    const { name } = event.target;
    if (name === "searcValue") {
      this.setState({ searcValue: value });
    }
  };

  handleClear = () => {
    this.setState(
      { searcValue: "", page: 1, size: 10 },
      () => {
        this.handleGetAuditReq(1, 10);
      }
    );
  };  

  render() {
    const {
      auditData,
      showLoader,
      size,
      page,
      searcValue,
      viewModel,
      actionData,
      dateValue,
      totalRecords,
    } = this.state;
    const totalPages = Math.ceil(totalRecords / size);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visiblePageNumbers = pageNumbers.slice(
      Math.max(0, page - 2),
      Math.min(page + 1, totalPages)
    );
    const options = [
      { value: "ALL", label: "All" },
      { value: "CREATE", label: "Create" },
      { value: "UPDATE", label: "Update" },
      { value: "SEARCH", label: "Search" },
      { value: "DELETE", label: "Delete" },
      { value: "EXECUTE", label:"Execute"},
    ];
    return (
      <>
        <div className={"card w-full p-6 bg-base-100 shadow-xl"}>
          <div className="h-full w-full pb-6 bg-base-100">
            <div className="flex flex items-start float-left">
              <div className="px-1">
                <label className="label">Event Type</label>
                <select
                  className="select w-full max-w-xs select-accent"
                  onChange={this.handleChange}
                  name="searcValue"
                  value={searcValue}
                >
                  {options.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="px-1">
                <label className="label">Event Date</label>
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
            </div>
          </div>
        </div>
        <TitleCard
          title={
            <div className="flex items-center">
              Logs List
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
            Showing {auditData.length} out of {totalRecords} records
          </div>
          <div className="overflow-x-auto w-full">
            <table
              className="table table-xs table-pin-rows table-pin-cols"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Event Date & time</th>
                  <th>Agent Name</th>
                  <th>ResourceType</th>
                  <th>Event Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {auditData.length > 0 ? (
                <tbody>
                  {auditData &&
                    auditData.map((l, k) => {
                      let resourceType = "";
                      let satusCode = "";
                      let agentName = "";

                      if (l && l.resource.hasOwnProperty("entity")) {
                        if (l && l.resource.entity) {
                          l.resource.entity.map((data) => {
                            resourceType = data.name;
                            return resourceType;
                          });
                        }
                      }

                      if (l && l.resource.hasOwnProperty("agent")) {
                        if (l && l.resource.agent) {
                          l.resource.agent.map((data) => {
                            agentName = data.who ? data.who.display : "N/A";
                            return agentName;
                          });
                        }
                      }
                      let act = l.resource.action;
                      _.find(ACTIONS, function (obj) {
                        if (obj.value === act) {
                          satusCode = obj.label;
                        }
                      });
                      let recordedDate =
                        l && l.resource.recorded
                          ? new Date(l.resource.recorded)
                          : null;
                        const formattedDateTime = recordedDate
                        ? recordedDate.toISOString().replace('T', ' ').slice(0, 19)
                        : "N/A";
                      return (
                        <tr key={k}>
                          <td>{k + 1}</td>
                          <td>
                            {formattedDateTime ? formattedDateTime : "N/A"}
                          </td>
                          <td>{agentName ? agentName : "N/A"}</td>
                          <td>{resourceType ? resourceType : "N/A"}</td>
                          <td>{satusCode ? satusCode : "N/A"}</td>
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
        <AuditViewModel
          id={viewModel}
          data={actionData}
          onClose={() => this.setState({ viewModel: false })}
        />
        {showLoader ? <Loader id={showLoader} /> : null}
      </>
    );
  }
}
