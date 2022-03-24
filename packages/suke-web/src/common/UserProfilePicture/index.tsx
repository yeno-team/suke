import classNames from 'classnames';
import React from 'react';
import { ImageCircle } from '../../components/ImageCircle';
import apiUrl from '../../util/apiUrl';

export const UserProfilePicture = ({fileName, className, onClick}: {fileName?: string, className?: string, onClick?: () => void}) => <ImageCircle onClick={onClick} className={classNames("bg-black border border-darkgray inline-block", className)} alt="profile picture" src={fileName ? apiUrl("/api/images/" + fileName).toString() : apiUrl("/api/images/PngItem_307416.png").toString()}></ImageCircle>