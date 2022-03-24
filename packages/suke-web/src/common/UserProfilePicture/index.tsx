import React from 'react';
import { ImageCircle } from '../../components/ImageCircle';
import apiUrl from '../../util/apiUrl';

export const UserProfilePicture = ({fileName}: {fileName?: string}) => <ImageCircle className="bg-black border border-darkgray inline-block" alt="profile picture" src={fileName ? apiUrl("/api/images/" + fileName).toString() : apiUrl("/api/images/PngItem_307416.png").toString()}></ImageCircle>