import { useState } from 'react';
import styled from 'styled-components';
// import eyeIcon from '../../../assets/icons/eye-regular.svg';

import {ReactComponent as eyeIcon} from '../../../assets/icons/eye-regular.svg';

function INPUT({placeholder,className}) {

     const [showCrossEye, setShowCrossEye] = useState(true);
     const [showEye, setShowEye] = useState(false);

    return (   
        <Input className={className}>

            <input type={`${showCrossEye ? 'password' : 'text'}`}  className="input" placeholder={placeholder} onChange={()=>setShowEye(true)}/>
            {showEye && !showCrossEye && <svg onClick={()=>setShowCrossEye(!showCrossEye)} aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>}
            {showEye && showCrossEye && <svg onClick={()=>setShowCrossEye(!showCrossEye)} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye-slash" class="svg-inline--fa fa-eye-slash fa-w-20" role="img" viewBox="0 0 640 512"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"/></svg>}

        </Input> 
    )
}


const Input=styled.div`     
        border:  var(--border-style-default); 
        padding: 6rem; 
        display: flex;

        input{
            margin-right: auto;
            flex: 1;  
            /* background-color: yellow;    */
        }


        svg{ 
            width: 22rem;   
            cursor: pointer;
        }

`;      


export default INPUT;
