import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import Job from '../Jobs/Job'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const Browse = () => {
    useGetAllJobs();

    const { allJobs } = useSelector(store => store.job)
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [])

    return (
        <div>
            <div className='fixed top-0 left-0 right-0 '>
                <Navbar />
            </div>

            <div className='max-w-7xl mx-auto my-28'>
                <h1 className='font-md text-xl text-[#008080]'>Search Results ({allJobs.length}) </h1>
                <div className='grid grid-cols-3 gap-4 my-5'>
                    {
                        allJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job} />
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Browse