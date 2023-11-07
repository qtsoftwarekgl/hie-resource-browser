import React, { Component } from "react";
import TitleCard from "../../components/Cards/TitleCard"
import { MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import API from '../../app/init';
import * as URL from '../../app/lib/apiUrls';
import MedicalReqViewModel from "./MedicalReqViewModel";
import Loader from '../../components/Loader'
import '../common/list.css';

export default class MedicationRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: 10,
            showLoader: false,
            totalRecords: 0,
            medicalData: [],
            searcValue: '',
            viewModel: false,
            actionData: ''
        }
    }

    componentDidMount() {
        this.handleGetMedicalReq(1, this.state.size);
    }

    handleGetMedicalReq = async (page, size) => {
        const { searcValue } = this.state;
        this.setState({ showLoader: true });
        let url = `${URL.MEDICATION_REQUEST_LIST}?page=${page}&size=${size}`;
        if (searcValue) {
            url += `&searchSet=UPI&value=${searcValue}`;
        } else {
            url += `&searchSet=ALL`;
        }
        API.get(url, {})
            .then((response) => {
                this.setState({
                    medicalData: response.entry ? response.entry : [],
                    showLoader: false,
                    page: page,
                    totalRecords: response.entry ? response.entry[0].resource.meta.versionId : 0,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleSearch = (event, pageNumber = 1) => {
        const { searcValue, size } = this.state;
        let currentSize = size;
        if (event && event.target.name === 'size') {
            currentSize = event.target.value;
            this.setState({ size: currentSize });
        }
        let url = URL.MEDICATION_REQUEST_LIST;
        if (currentSize) {
            url = `${url}?page=${pageNumber}&size=${currentSize}`;
        }

        if (searcValue) {
            url += `&searchSet=UPI&value=${searcValue}`;
        } else {
            url += `&searchSet=ALL`
        }

        this.setState({ showLoader: true })
        API.get(url, {})
            .then((response) => {
                this.setState({ medicalData: response.entry ? response.entry : [], totalRecords: response.entry ? response.entry[0].resource.meta.versionId : 0, showLoader: false, page: pageNumber })
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handlePageChange = (pageNumber) => {
        this.setState(
            {
                page: pageNumber,
            },
            () => {
                this.handleGetMedicalReq(this.state.page, this.state.size);
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
        if (this.state.page < Math.ceil(this.state.totalRecords / this.state.size)) {
            const newPage = this.state.page + 1;
            this.handlePageChange(newPage);
        }
    };

    handleChange = (event) => {
        const { value } = event.target;
        const { name } = event.target;
        if (name === 'searcValue') {
            this.setState({ searcValue: value });
        }
    }

    onActionClicked = (rowData) => {
        this.setState({
            viewModel: true,
            actionData: rowData ? rowData : []
        });
    }

    handleClear = () => {
        this.setState(
          { searcValue: "", page: 1, size: 10 },
          () => {
            this.handleGetMedicalReq(1, 10);
          }
        );
      };

    render() {
        const { medicalData, searcValue, viewModel, actionData, size, page, showLoader, totalRecords } = this.state
        const totalPages = Math.ceil(totalRecords / size);

        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        const visiblePageNumbers = pageNumbers.slice(
            Math.max(0, page - 2),
            Math.min(page + 1, totalPages)
        );

        return (
            <>
                <div className={"card w-full p-6 bg-base-100 shadow-xl"}>
                    <div className='h-full w-full pb-6 bg-base-100'>
                        <div className="flex flex items-start float-left">
                            <div className="px-1">
                                <label className="label">UPID</label>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" name='searcValue' value={searcValue} onChange={this.handleChange} />
                            </div>
                            <div className="px-1 pt-10">
                                <button className="btn btn-accent" onClick={this.handleSearch}><MagnifyingGlassIcon className='h-6 w-6' /></button>
                            </div>
                            <div className="px-1 pt-10">
                                <button className="btn btn-accent" onClick={this.handleClear}><TrashIcon className='h-6 w-6' /></button>
                            </div>
                        </div>
                    </div>
                </div>

                <TitleCard title={
                    <div className="flex items-center">
                        List of Medication Request
                        <div className="ml-auto" style={{ fontStyle: 'italic', fontSize: 'small' }}>
                            Records per page
                            <select className="select max-w-xs select-accent ml-2" onChange={this.handleSearch} name='size' value={size}>
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
                } topMargin="mt-2">
                    <div className="pb-3 float-right btn-group">
                        <button
                            className={`first-btn bor btn  ${page === 1 ? "btn-disabled" : "btn-normal"} tooltip`}
                            data-tip="First page"
                            onClick={() => this.handlePageChange(1)}
                            disabled={page === 1}
                        >
                            {"<<"}
                        </button>
                        <button
                            className={`pagination-item bor btn ${page === 1 ? "btn-disabled" : ""} tooltip`}
                            data-tip="Previous page"
                            onClick={this.handlePrevPage}
                            disabled={page === 1}
                        >
                            {"<"}
                        </button>
                        {visiblePageNumbers.map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`btn ${pageNum === page ? "btn-actives" : "btn-normal"} tooltip`}
                                data-tip={`Page ${pageNum}`}
                                onClick={() => this.handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            className={`pagination-item bor btn ${page === totalPages ? "btn-disabled" : "btn-normal"} tooltip`}
                            data-tip="Next page"
                            onClick={this.handleNextPage}
                            disabled={page === totalPages || totalRecords === 0}
                        >
                            {">"}
                        </button>
                    </div>
                    <div className="pb-1"> Showing {medicalData.length} out of {totalRecords} records</div>
                    <div className="overflow-x-auto w-full">
                        <table className="table table-xs table-pin-rows table-pin-cols" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Order Type</th>
                                    <th>Medication Reference</th>
                                    <th>UPID</th>
                                    <th>Requester</th>
                                    <th>Reason</th>
                                    <th>Frequency</th>
                                    <th>Period</th>
                                    <th>Duration</th>
                                    <th>Route</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {medicalData.length > 0 ? <tbody>
                                {
                                    medicalData && medicalData.map((l, k) => {
                                        let upid = ""
                                        let order = ""
                                        let medRef = ""
                                        let requester_name = ""
                                        let frequency = ""
                                        let period = ""
                                        let periodUnit = ""
                                        let duration = ""
                                        let durationUnit = ""
                                        let route = ""
                                        let reason = ""
                                        if (l.resource.hasOwnProperty("medicationReference")) {
                                            let sub = l.resource.medicationReference
                                            if (sub.hasOwnProperty("type") && sub.type === 'Medication') {
                                                order = sub.type ? sub.type : 'N/A'
                                                medRef = sub.display ? sub.display : 'N/A'
                                            }
                                        }
                                        if (l.resource.hasOwnProperty("subject")) {
                                            let sub = l.resource.subject
                                            sub.hasOwnProperty("identifier") && sub.identifier.type.coding.map((info) => {
                                                if (info.code === 'UPID') {
                                                    upid = sub.identifier.value ? sub.identifier.value : 'N/A'
                                                }
                                                return upid
                                            })
                                        }
                                        if (l.resource.hasOwnProperty("requester")) {
                                            let sub = l.resource.requester
                                            if (sub.hasOwnProperty("type") && sub.type === 'Practitioner') {
                                                requester_name = sub.display ? sub.display : 'N/A'
                                            }
                                        }

                                        if (l.resource.hasOwnProperty("dosageInstruction")) {
                                            let sub = l.resource.dosageInstruction
                                            if (sub[0].timing.repeat) {
                                                let repeat = sub[0].timing.repeat
                                                frequency = repeat.frequency
                                                period = repeat.period
                                                periodUnit = repeat.periodUnit
                                                duration = repeat.duration
                                                durationUnit = repeat.durationUnit
                                                let ro = sub[0].route.coding[0]
                                                route = ro ? ro.display : 'N/A'
                                            }
                                        }


                                        return (
                                            <tr key={k}>
                                                <td>{k + 1}</td>
                                                <td>{order ? order : 'N/A'}</td>
                                                <td>{medRef ? medRef : 'N/A'}</td>
                                                <td>{upid ? upid : 'N/A'}</td>
                                                <td>{requester_name ? requester_name : 'N/A'}</td>
                                                <td>{reason ? reason : 'N/A'}</td>
                                                <td>{frequency ? frequency : 'N/A'}</td>
                                                <td>{period ? periodUnit ? period + periodUnit : period : 'N/A'}</td>
                                                <td>{duration ? durationUnit ? duration + durationUnit : duration : 'N/A'}</td>
                                                <td>{route ? route : 'N/A'}</td>
                                                <td>
                                                    <div className="tooltip tooltip-info" data-tip="View">
                                                        <EyeIcon onClick={() => this.onActionClicked(l)} className='h-6 w-6 stroke-secondary hover:stroke-secondary-focus' />
                                                    </div>
                                                    {/* <div className="tooltip tooltip-info" data-tip="Audit Log">
                                                        <ClipboardDocumentCheckIcon onClick={() => this.onActionAduitClicked(l)} className='h-6 w-6 stroke-purple-500 hover:stroke-purple-700'/>
                                                    </div> */}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody> : <div className="pt-2">No record found</div>}
                        </table>
                    </div>
                </TitleCard>
                {viewModel ? <MedicalReqViewModel
                    id={viewModel}
                    data={actionData}
                    onClose={() => this.setState({ viewModel: false })}
                /> : null}

                {showLoader ? <Loader id={showLoader} /> : null}
            </>
        );
    }
}
