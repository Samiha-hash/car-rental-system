import { Slide } from "react-slideshow-image";

export default ({ }) => {

    const testimonials = [
        { name: "Alice Johnson", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg_52ohYMqFwf18gOAaAwpLdIH_Qf54wq0ybk_py8EkNjnss9KfpSo1YuQCdvpT7Rp_rwguoAsBgQ9uP03agZY0w", rating: 5, text: "Amazing service and great cars. Highly recommend!" },
        { name: "Bob Smith", image: "https://innovation.gwu.edu/sites/g/files/zaxdzs4966/files/2023-01/bobheadshotrect.jpg", rating: 4, text: "Affordable prices and smooth booking process!" },
        { name: "Clara Davis", image: "https://media.licdn.com/dms/image/v2/C5103AQGXAV2-OR0E6A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516985328996?e=2147483647&v=beta&t=n48mZ9IChQ07ZO1OUmbqu6z7IuGH3dTtjniDbOmajsk", rating: 5, text: "Loved the car options, and the service was excellent." },
    ];


    return <section className="mt-20 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
        <Slide pauseOnHover={true}>
            {testimonials.map((testimonial, index) => (
                <div key={index} className="mx-auto flex flex-col items-center max-w-3xl bg-black  bg-opacity-5 dark:bg-opacity-50 shadow-lg p-6 rounded-lg select-none">
                    <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <div className="flex mb-2">
                        {Array.from({ length: testimonial.rating }, (_, i) => (
                            <span key={i} className="text-yellow-500">★</span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.text}</p>
                </div>
            ))}
        </Slide>
    </section>;
}