import { Link } from "react-router-dom";

export default ({ car, className }) => {
    return (
        <div className={`${className} dark:bg-slate-900 dark:bg-opacity-50 bg-white shadow-lg rounded-xl overflow-hidden max-w-[250px] hover:scale-105 hover:shadow-2xl dark:shadow-slate-900 dark:border-slate-800 border transition-transform transform`}>

            <div className="h-48 w-full  overflow-hidden">
                <img
                    src={car.images && car.images[0] ? car.images[0] : "/placeholder.png"}
                    alt={`${car.carBrand} ${car.carModel}`}
                    className="h-full w-full object-cover"
                />
            </div>


            <div className="p-4">
                <h2 className="text-xl font-bold   truncate">
                    {car.carBrand} {car.carModel}
                </h2>
                <p className="text-sm   truncate">{car.location}</p>
                <p className="text-sm   truncate">Post Date: {new Date(parseInt(car.dateAdded)).toLocaleDateString()}</p>
                <p className="mt-2  text-sm line-clamp-3 truncate">{car.description}</p>


                <div className="mt-2">
                    <h3 className="text-sm font-semibold ">Features:</h3>
                    <ul className="list-disc list-inside text-sm  h-16 overflow-auto">
                        {car.features.slice(0, car.features.length > 2 ? 2:3).map((feature, index) => (
                            <li key={index} className=' truncate'>{feature}</li>
                        ))}
                        {car.features.length > 2 && <li>and more</li>}
                    </ul>
                </div>


                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="text-lg font-semibold ">
                            BDT {car.dailyRentalPrice}
                        </span>
                        <span className="text-sm "> /day</span>
                    </div>
                    <div>
                        {car.availability ? (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                                Available
                            </span>
                        ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                                Unavailable
                            </span>
                        )}
                    </div>
                </div>
                <Link
                    to={`/car/${car._id}`}
                    className='text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2 mb-4  inline-block'>
                    <span>See More</span>
                </Link>
            </div>
        </div>
    );
};