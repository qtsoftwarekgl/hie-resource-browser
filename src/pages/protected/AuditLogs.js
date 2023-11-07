import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AuditLogs from '../../features/auditLogs'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "CR AuditLogs"}))
    }, [])


    return(
        <AuditLogs/>
    )
}

export default InternalPage