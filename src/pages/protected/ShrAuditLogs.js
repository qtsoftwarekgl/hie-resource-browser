import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ShrAuditLogs from '../../features/shrAuditLogs'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "SHR AuditLogs"}))
    }, [])


    return(
        <ShrAuditLogs/>
    )
}

export default InternalPage