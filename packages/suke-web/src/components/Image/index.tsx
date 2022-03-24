import React, { DetailedHTMLProps, ImgHTMLAttributes } from 'react';
import apiUrl from '../../util/apiUrl';

export const Image = (props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> & {noproxy?: string}) => <img alt={props.alt} {...props} src={props.noproxy != null && props.noproxy === "true" ? props.src : apiUrl("/api/proxy/" + props.src).toString()}>{props.children}</img>