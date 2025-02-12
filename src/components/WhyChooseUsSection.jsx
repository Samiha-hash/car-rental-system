export default function WhyChooseUsSection({ }) {
    return <section className="mt-20 px-6">
        <div className="mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <div className="md:flex block w-full justify-center items-center">
                <div className="md:w-[50%] w-full text-justify text-lg leading-relaxed">
                    <span className="block">
                        Renting a car with us ensures comfort, convenience, and safety at competitive prices. Whether you're looking for a budget-friendly ride or a luxury experience, we have a variety of cars to suit your needs.
                    </span>
                    <ul className="list-disc list-inside my-2 text-sm font-light">
                        <li><span className="font-bold">Wide Range</span>: Economy to Luxury Cars</li>
                        <li><span className="font-bold">Best Rates</span>: Competitive Daily Pricing</li>
                        <li><span className="font-bold">Quick Booking</span>: Simple Online Process</li>
                        <li><span className="font-bold">24/7 Support</span>: Always Here to Help</li>
                        <li><span className="font-bold">Clear Pricing</span>: No Hidden Fees</li>
                    </ul>
                    <span className="block">
                        Book your next ride with us and experience the difference. We guarantee a smooth and hassle-free experience every time you rent with us.
                    </span>
                </div>
                <div className="md:w-[50%] w-full overflow-hidden">
                    <img
                        src="https://png.pngtree.com/png-vector/20241002/ourmid/pngtree-modern-black-sports-car-silhouette-vector-illustration-on-transparent-background-for-png-image_13980107.png"
                        alt="Car Illustration"
                        className="mx-auto w-64 rounded-xl"
                    />
                </div>
            </div>
        </div>
    </section>;
}