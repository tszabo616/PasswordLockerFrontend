import React, { useState } from 'react';

import classes from './Home.module.css';
import Image from '../components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const IMAGES = [
    {
        src: '../home-img-01.jpg',
        text: 'Safely access your passwords in public',
    },
    {
        src: '../home-img-02.jpg',
        text: 'Access all of your passwords across multiple devices',
    },
    {
        src: '../home-img-03.jpg',
        text: 'Using the latest technology to keep your information secure',
    },
];

export default function Home() {
    const [imgNum, setImgNum] = useState(0);

    function handleNextImg() {
        setImgNum(i => (i+1) % IMAGES.length);
    }

    function handlePrevImg() {
        setImgNum(i => {
            if(i <= 0) {
                return IMAGES.length-1;
            } else {
                return i-1;
            }
        });
    }

    return (
        <React.Fragment>
            <div className={classes.Home}>
                <FontAwesomeIcon icon={faLock} className={classes.icon} />
                <br />
                <label>Password Locker</label>
            </div>
            <div className={classes.imagesContainer}>
                <div className={`${classes.arrowContainer} ${classes.prevArrowContainer}`} onClick={handlePrevImg}>
                    <FontAwesomeIcon icon={faChevronLeft} className={classes.arrow} />
                </div>
                <div className={`${classes.arrowContainer} ${classes.nextArrowContainer}`} onClick={handleNextImg}>
                    <FontAwesomeIcon icon={faChevronRight} className={classes.arrow}/>
                </div>
                {IMAGES.map((e, i) =>
                    <Image key={i} className={imgNum != i ? classes.hiddenImage : ''} alt='Password Locker' src={e.src} text={e.text} />
                    )}
            </div>
        </React.Fragment>
    );
}