import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners"
import CarCard from "./CarCard";

export default function MostRecentCarList({ fetchMostRecentCars = () =>{} }) { 
    const [carsLoading, setCarsLoading] = useState(true);
    const [mostRecentCarList, setMostRecentCarList] = useState([]);

    useEffect(() => {
        (async () => {
            setCarsLoading(true);
            const res = await fetchMostRecentCars();
            setCarsLoading(false);
            if (res && res.length > 0) {
                setMostRecentCarList(res);
            }
        })();
    }, []);

    return <section className="mt-20 mx-auto">
        <div className="mx-4 ">
            <h2 className="text-3xl font-bold mb-8 text-center">Most Recent Cars</h2>
            {carsLoading ? (
                <HashLoader color="#f97316" />
            ) : mostRecentCarList.length > 0 ?
                <div className="grid grid-cols-1 justify-between md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-8">
                    {mostRecentCarList.map((car) => {
                        return (
                            <CarCard key={car._id} car={car} className={"w-[300px] "} />
                        )
                    })}
                </div> : (
                    <p>No Most Recent Cars available.</p>
                )
            }
        </div>
    </section>
}