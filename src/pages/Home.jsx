import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Fade, Slide, Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";
import { HashLoader } from "react-spinners";
import CarCard from "../components/CarCard";
import HomeHeroSlideshow from "../components/HomeHeroSlideshow";
import MostRecentCarList from "../components/MostRecentCars";
import SpecialOffersSection from "../components/SpecialOffersSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import TestimonialsSections from "../components/TestimonialsSections";
import FindYoursDreams from "../components/FindYoursDreams";

const Home = ({ user, isDarkTheme = false, fetchMostRecentCars }) => {

    


    



    

    return (
        <div className={`${isDarkTheme ? "bg-[#131313] text-white" : "bg-white text-black"} min-h-[100vh] w-full`}>
            <div>

                <HomeHeroSlideshow user={user} isDarkTheme={isDarkTheme}/>
                
                <div className="mx-auto w-10/12">






                    {/* most recent cars */}
                    <MostRecentCarList fetchMostRecentCars={fetchMostRecentCars} />



                    {/* Special Offers Section */}
                    <SpecialOffersSection />



                    {/* why choose us sec */}
                    <WhyChooseUsSection />





                    {/* User Testimonials Section */}
                    <TestimonialsSections />


                    {/* find you drems */}

                    <FindYoursDreams />

                    <div className="pt-20 text-center"></div>


                </div>
            </div>
        </div>
    );
};

export default Home;
