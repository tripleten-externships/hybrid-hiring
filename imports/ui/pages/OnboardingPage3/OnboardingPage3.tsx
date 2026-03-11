import React from "react";
import { Link } from "react-router-dom";
import {TextInput} from "../../components/TextInput/TextInput";
import {Button} from "../../components/Button/Button";
import "./OnboardingPage3.css";

export const OnboardingPage3 = () => {
    return (
        <div className="onboarding__page-3">
            <img src="#" alt="Backbutton" className="onboarding__back-btn" />
            <TextInput label="Skills" id="skills"  type="text" placeholder="Add skills" />
        </div>
    )