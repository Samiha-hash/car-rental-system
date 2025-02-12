import { Link } from "react-router-dom";

export default ({ car, className }) => {
    return (
        <div key={car._id} className={`${className} flex bg-white shadow-md rounded-lg overflow-hidden h-[300px]`}>

            <div className="h-full w-4/12 bg-gray-200 overflow-hidden">
                <img
                    src={car.images && car.images[0] ? car.images[0] : "/placeholder.png"}
                    alt={`${car.carBrand} ${car.carModel}`}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="p-4 w-6/12 flex flex-col justify-between flex-grow">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {car.carBrand} {car.carModel}
                    </h2>
                    <p className="text-sm text-gray-500">{car.location}</p>
                    <p className="mt-2 text-gray-700 text-sm line-clamp-3">{car.description}</p>
                    <div className="mt-2">
                        <h3 className="text-sm font-semibold text-gray-800">Features:</h3>
                        <ul className="list-disc list-inside text-sm text-gray-600 max-h-20 overflow-auto">
                            {car.features.slice(0, 3).map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                            {car.features.length > 3 && <li>and more...</li>}
                        </ul>
                    </div>
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

            <div className='flex items-center justify-around h-full w-2/12 text-center'>
                <div>
                    <div className="justify-between mt-4">
                        <div>
                            <span className="text-lg font-semibold text-gray-800">
                                BDT {car.dailyRentalPrice}
                            </span>
                            <span className="text-sm text-gray-500"> /day</span>
                        </div>

                    </div>

                    <Link
                        to={`/car/${car._id}`}
                        className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 inline-block"
                    >
                        <span>See More</span>
                    </Link>
                </div>
            </div>
        </div>

    );
};