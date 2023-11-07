import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import MedicalRequests from '../../features/medicalRequests'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Medication Requests"}))
    }, [])


    return(
        <MedicalRequests />
    )
}

export default InternalPage