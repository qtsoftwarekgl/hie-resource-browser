import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ServiceRequest from '../../features/serviceRequest'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Service Requests"}))
    }, [])


    return(
        <ServiceRequest/>
    )
}

export default InternalPage