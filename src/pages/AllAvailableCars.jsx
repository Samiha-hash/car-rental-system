import React, { useState, useEffect } from 'react';
import CarCard from "../components/CarCard";
import CarList from '../components/CarList';
import { HashLoader } from "react-spinners";
import { IoGrid, IoList } from 'react-icons/io5';

const AllAvailableCars = ({ fetchAvailableCars = async () => [] }) => {

    const [tempAvailableCars, setTempAvailableCars] = useState([]);
    const [isAvailableCarsLoading, setIsAvailableCarsLoading] = useState(true);
    const [isCardView, setIsCardView] = useState(true);
    const [searchPrompt, setSearchPrompt] = useState("");
    const [sortBy, setSortBy] = useState("date_desc");

    useEffect(() => {
        (async () => {
            setIsAvailableCarsLoading(true);
            const res = await fetchAvailableCars(searchPrompt);
            if (res) {            
                sortCars(res);  
            }
            setIsAvailableCarsLoading(false);
        })();
    }, [searchPrompt])


    useEffect(() => {
        sortCars(tempAvailableCars);
    }, [sortBy]);


    const sortCars = (tempAvailableCarsTemp) => {
        let sortedCars = [...tempAvailableCarsTemp];

        if (sortBy === 'price_asc') {
            sortedCars.sort((a, b) => a.dailyRentalPrice - b.dailyRentalPrice);
        } else if (sortBy === 'price_des') {
            sortedCars.sort((a, b) => b.dailyRentalPrice - a.dailyRentalPrice);
        } else if (sortBy === 'date_ascc') {
            sortedCars.sort((a, b) => a.dateAdded - b.dateAdded);
        } else if (sortBy === 'date_desc') {
            sortedCars.sort((a, b) => b.dateAdded - a.dateAdded);
        }

        setTempAvailableCars(sortedCars);
    }







    return (
        <div className="w-10/12 mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">All Available Cars</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4 w-full">
                <div className='w-10/12 space-x-2'>
                    <input
                        type="text"
                        placeholder='Search with car brand, model, location or details...'
                        className='dark:bg-black dark:bg-opacity-25 border dark:border-black rounded-md w-1/2 py-2 px-4 text-white'
                        value={searchPrompt}
                        onChange={e => {
                            setSearchPrompt(e.target.value);
                        }}
                    />
                    <select
                        type="text"
                        placeholder='Search with car brand, model, location or details...'
                        className='dark:bg-black dark:bg-opacity-25 border dark:border-black rounded-md w-1/4  py-2 px-4 dark:text-white'
                        value={sortBy}
                        onChange={e => {
                            setSortBy(e.target.value);
                        }}
                    >
                        <option value="date_desc">Date: Newest</option>
                        <option value="date_ascc">Date: Oldest</option>
                        <option value="price_asc">Price: Low to high</option>
                        <option value="price_des">Price: High to Low</option>
                    </select>
                </div>
                <div className='w-2/12 flex'>
                    <div className='flex ml-auto border border-slate-500 rounded-md items-center overflow-hidden'>
                        <div
                            className={`${isCardView && "dark:bg-slate-800 bg-slate-300"} py-2 pl-2 pr-1 cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-300`}
                            onClick={e => {
                                setIsCardView(true);
                            }}
                        >
                            <IoGrid />
                        </div>
                        <div
                            className={`${!isCardView && "dark:bg-slate-800 bg-slate-300"} py-2 pr-2 pl-1 cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-300`}
                            onClick={e => {
                                setIsCardView(false);
                            }}
                        >
                            <IoList />
                        </div>
                    </div>
                </div>
            </div>

            {isAvailableCarsLoading ? (
                <HashLoader color="#f97316" />
            ) : tempAvailableCars.length > 0 ? (isCardView ? (
                <div className="mb-32 grid grid-cols-1 justify-between md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6">
                    {tempAvailableCars.map((car) => {
                        return (
                            <CarCard key={car._id} car={car} className={"w-[300px]"} />
                        )
                    })}
                </div>
            ) : (<div className={`mb-32 space-y-4 `}>
                {tempAvailableCars.map((car) => {
                    return (
                        <CarList key={car._id} car={car} />
                    )
                })}
            </div>)) : (
                <p>No Cars available.</p>
            )}
        </div>
    );
};

export default AllAvailableCars;