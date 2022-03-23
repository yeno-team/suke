import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import apiUrl from '../../util/apiUrl';

export const Image = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => <img alt={props.alt} {...props} src={apiUrl("/api/proxy/" + props.src).toString()}>{props.children}</img>