import { Link } from "react-router-dom";

export default function SpecialOffersSection({  }) {
    const specialOffers = [
        { title: "15% Off Weekend Rentals", description: "Book now to enjoy exclusive weekend discounts!", link: "/available-cars" },
        { title: "Luxury Cars at BDT 99/day", description: "This holiday season, drive in style for less.", link: "/available-cars" },
    ];


    return <section className="mt-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Special Offers</h2>
        <div className="flex flex-wrap justify-center gap-6">
            {specialOffers.map((offer, index) => (
                <div
                    key={index}
                    className="w-full md:w-[300px] bg-orange-100 shadow-lg p-4 rounded-lg text-center transition-transform transform hover:scale-105"
                >
                    <h3 className="font-bold text-lg text-orange-800">{offer.title}</h3>
                    <p className="text-sm text-gray-600 my-2">{offer.description}</p>
                    <Link
                        to={offer.link}
                        className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 me-2  inline-block"
                    >
                        See Available Cars
                    </Link>
                </div>
            ))}
        </div>
    </section>;
}