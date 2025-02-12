import { Link } from "react-router-dom";

export default ({ }) => {
    return <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold mb-6">Find Your Dream Car Today!</h2>
        <p>Explore our wide selection of cars and book your next ride now.</p>
        <Link
            to="/available-cars"
            className="text-white bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-6 py-3 text-center mt-4 me-2 mb-4  inline-block"
        >
            Browse Available Cars
        </Link>
    </section>;
}