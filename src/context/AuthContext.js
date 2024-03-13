import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
// import { add_user, base_url, forgot_password, user_login } from '../utils/service';
import useToken from 'antd/es/theme/useToken';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { admin_login, base_url } from '../api/Constants';
import { message } from 'antd';

// Create the context
const AuthContext = createContext();

// Create a provider component to wrap the app
export const AuthContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [value, setValue] = useState('Default Value');
    const [userId, setUserId] = useState()
    const [userEmail, setUserEmail] = useState()
    const [email, setEmail] = useState()
    const [userToken, setUserToken] = useState()
    const [otpScreen, setOtpscreen] = useState()
    const [showCreateAccountModal, setShowCreateAccountModal] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    // You can add more state or functions here

    const UserLogin = async (formData) => {
        console.log("formData", formData)
        // try {
        //     const response = await axios.post(`${base_url}${admin_login}`, {
        //         email: loginData.email,
        //         password: loginData.password,
        //     });
        //     if(response.data.status === true) {
        //         const { token, userId, email } = response.data.userDetails;

        //         localStorage.setItem('token', token);
        //         localStorage.setItem('userId', userId);
        //         localStorage.setItem('email', email);

        //         setEmail(email)
        //         setUserToken(token)
        //         setUserId(userId)
        //         console.log(token)
        //         console.log(userId)
        //         navigate('/')
        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Success!',
        //             text: 'Login successful',
        //             showCancelButton: false,
        //             confirmButtonColor: '#3085d6',
        //             confirmButtonText: 'OK'
        //         });
        //     } else {
        //         console.error('Login failed:', response.data.message);
        //     }
        // } catch (error) {
        //     console.log(error)
        //     // showAlert('An error occurred while logging in.', 'error');
        //     return null
        // }
        try {
            const response = await axios.post(`${base_url}${admin_login}`, {
            email: formData.email, // Assuming email is the username
            password: formData.password,
        });
    
            console.log('Login successful:', response.data);
            const { token, userId } = response.data;
    
            // Store the token in local storage (you can use session storage as well)
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            message.success("Login successful")
            // Display success message
            // Swal.fire({
            //     icon: "success",
            //     title: "Success!",
            //     text: response.data.msg,
            // });
            // Update the authentication state
            // onLogin();
            setUserToken(token)
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response.data);
            message.error('Invalid credentials!')
            // Swal.fire({
            //     icon: "error",
            //     title: "Error!",
            //     text: "Invalid credentials",
            // });
        }
    }

    const isLoggedIn = async () => {
        const localStorageToken = localStorage.getItem("token")
        const localStorageUserId = localStorage.getItem("userId")
        const localStorageEmail = localStorage.getItem("email")

        // const response = await axios.get(`url`)

        console.log("Local Storage Token ::: ", localStorageToken)

        if(localStorageToken) {
            setUserToken(localStorageToken)
            setUserId(localStorageUserId)
            setEmail(localStorageEmail)
            // showAlert('Logged in successfully', 'success');
        }
        else {
            setUserToken(null)
            // showAlert('Not logged in', 'info');
        }
    }

    useEffect(() => {
        isLoggedIn()
    }, [useToken])

    return (
        <AuthContext.Provider value={{ userToken, userId, userEmail, email, UserLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Create a custom hook to consume the context
export const useAuthContext = () => {
    return useContext(AuthContext);
};
