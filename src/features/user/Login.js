import {useState} from 'react'
import LandingIntro from './LandingIntro'
import ErrorText from  '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText'
import * as URL from '../../app/lib/apiUrls';

window.Buffer = window.Buffer || require("buffer").Buffer; 

function Login(){

    const INITIAL_LOGIN_OBJ = {
        password : "",
        emailId : ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = (e) =>{
        e.preventDefault()
        setErrorMessage("")

        if(loginObj.emailId.trim() === "")return setErrorMessage("Username is required!")
        if(loginObj.password.trim() === "")return setErrorMessage("Password is required!")
        else{
            setLoading(true)
            let username = loginObj.emailId.trim();
            let password = loginObj.password;
            if(username === "rhiesEMR" && password === "YWRtaW5QYXNzMTIzNA==") {   
                localStorage.setItem("username", username)
                localStorage.setItem("password", password)
                const base64encodedData = Buffer.from(`${username}:${password}`).toString('base64');
                localStorage.setItem("token", base64encodedData)
                window.location.href = '/patients'
                setLoading(false)
            }
            else {
                setLoading(false)
                return setErrorMessage("Invalid username and password!")
            }            
            // // Make sure to send test request to check if username and password can work

            // let url =  URL.PATIENT_LIST + "?identifier=loginattempt";
            // let username = loginObj.emailId.trim();
            // let password = loginObj.password;

            // const base64encodedData = Buffer.from(`${username}:${password}`).toString('base64');

            // fetch(url, {method: 'GET', headers:{
            //     'Content-Type':'application/json',
            //     'Authorization': `Basic ${base64encodedData}`
            // }}).then(response => {
            //     if(!response.ok){
            //         let data = response.text();
            //         data.then(jsonData => {
            //             let parsed = JSON.parse(jsonData);
            //             return setErrorMessage(parsed.issue[0].details.text);
            //         })
            //     } else {
            //         //Here make sure to register the user name to be used later in the dashboard part
            //         localStorage.setItem("token", base64encodedData)
            //         localStorage.setItem("username", username)
            //         localStorage.setItem("password", password)
            //         window.location.href = '/patients'
            //     }
            //     return response.json
            // })
            // .then(data => {
            // })
            // .catch(error => {
            //     return setErrorMessage(error.toString());
            // })
        }
    }

    const updateFormValue = ({updateType, value}) => {
        setErrorMessage("")
        setLoginObj({...loginObj, [updateType] : value})
    }

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        <LandingIntro />
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Username" updateFormValue={updateFormValue}/>

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue}/>

                        </div>

                        {/* <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div> */}

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>

                        {/* <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div> */}
                    </form>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Login