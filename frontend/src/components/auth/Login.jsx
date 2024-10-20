import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

const Login = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading } = useSelector(store => store.auth)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const { user } = useSelector(store => store.auth);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate('/')
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            dispatch(setLoading(false))
        }

    }

    useEffect(() => {
        if (user) {
            navigate("/")
        }
    })


    return (
        <div className='bg-[#e2f5ee] h-[100vh]'>
            <div>
                <Navbar />
            </div>
            <div className='flex items-center justify-center mx-auto max-w-7xl'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10 shadow-md shadow-zinc-700'>
                    <h1 className='text-3xl font-semibold text-cyan-800 text-center my-3'>Login</h1>
                    <div>
                        <Label>Email:</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className='bg-[#e2f5ee]'
                        />
                    </div>
                    <div>
                        <Label>Password:</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className='bg-[#e2f5ee]'
                        />
                    </div>
                    <div className='flex gap-10'>
                        <div>
                            <Label>Role:</Label>
                            <RadioGroup className="flex my-1 gap-5 mx-2">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    {
                        loading ? <Button className='w-full my-4'> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait... </Button> : <Button className='w-full my-4' type='submit'>Login</Button>
                    }
                    <p className='text-center'>If you don't have an account please <Link to='/signup' className='text-sky-600 text underline text-sm'>Signup</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;