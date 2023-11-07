import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Encounters from '../../features/encounters'
function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Encounters"}))
    }, [])


    return(
        <Encounters/>
    )
}

export default InternalPage