import { GrNext, GrPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
import { Zoom } from "react-slideshow-image";

export default function HomeHeroSlideshow({ user, isDarkTheme }) {
    const slideImages = [
        {
            url: "https://autovista24.autovistagroup.com/wp-content/uploads/sites/5/2022/05/d662614-1024x640.jpg",
            title: `Welcome ${user ? "back " + user.displayName : ""} to Car Rental`,
            desc: "Drive Your Dreams Today!",
            btnName: "",
            btnLink: ""
        },
        {
            url: "https://charge.cars/uploads/videos-cover/product-1.jpg",
            title: "Your Next Car Awaits You",
            desc: "",
            btnName: "View Available Cars",
            btnLink: "/available-cars"
        },
        {
            url: "https://www.paintnuts.co.uk/storage/photos/321873/Cars%20on%20production%20line.webp",
            title: "Your Ride Awaits",
            desc: "",
            btnName: "View Available Cars",
            btnLink: "/available-cars"
        },
    ];

    return <section className="slide-container">
        <Zoom
            scale={3}
            prevArrow={
                <button
                    style={{
                        position: "absolute",
                        left: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        padding: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    <GrPrevious/>
                </button>
            }
            nextArrow={
                <button
                    style={{
                        position: "absolute",
                        right: "20px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        padding: "20px",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                >
                    <GrNext />
                </button>
            }
            duration={1000}
            cssClass={"bg-black"}
        >
            {slideImages.map((slideImage, index) => (
                <div key={index} className="text-center -z-10 relative">
                    <div
                        style={{
                            backgroundImage: `url(${slideImage.url})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            height: "400px"
                        }}
                    >
                        <div
                            className={`w-full h-full flex flex-col items-center justify-center ${isDarkTheme ? "bg-[#131313] bg-opacity-75" : "bg-white bg-opacity-25 backdrop-blur-sm text-white "}`}
                        >
                            <div className="text-4xl font-bold animate__animated animate__bounce">{slideImage.title}</div>
                            {slideImage.desc !== "" && (
                                <div className="py-4">{slideImage.desc}</div>
                            )}
                            {slideImage.btnName !== "" && (
                                <Link
                                    to={slideImage.btnLink}
                                    className={`${isDarkTheme ? "bg-[#2e2e2e]" : "bg-gray-500"} mt-4 text-white px-6 py-2 rounded font-semibold bg-opacity-25 backdrop-blur-[1px] hover:backdrop-blur-[5px]`}
                                >
                                    {slideImage.btnName}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </Zoom>
    </section>
}