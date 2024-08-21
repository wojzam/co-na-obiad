import * as React from 'react';
import {styled} from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

const images = [
    {
        url: '/public/img/all_recipes.jpg',
        title: 'Wszystkie przepisy',
    },
    {
        url: '/public/img/dinner.jpg',
        title: 'Dania główne',
    },
    {
        url: '/public/img/wege.jpg',
        title: 'Wegetariańskie',
    },
    {
        url: '/public/img/meat.jpg',
        title: 'Mięsne',
    },
    {
        url: '/public/img/pasta.jpg',
        title: 'Makarony',
    },
    {
        url: '/public/img/baking.jpg',
        title: 'Wypieki',
    },
    {
        url: '/public/img/cake.jpg',
        title: 'Ciasta',
    },
    {
        url: '/public/img/dessert.jpg',
        title: 'Desery',
    },
    {
        url: '/public/img/breakfast.jpg',
        title: 'Śniadania',
    },
    {
        url: '/public/img/supper.jpg',
        title: 'Kolacje',
    },
    {
        url: '/public/img/thermomix.jpg',
        title: 'Thermomix',
    },
];

const ImageButton = styled(ButtonBase)(({theme}) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    borderRadius: 20,
    overflow: 'hidden',
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .image-src': {
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease-in-out',
        },
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
    transition: 'transform 0.3s ease-in-out',
    borderRadius: 20,
    zIndex: -1,
});

const Image = styled('span')(({theme}) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({theme}) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({theme}) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

export default function ButtonBaseDemo() {
    return (
        <Grid container spacing={3} columns={{xs: 4, sm: 8, md: 12, lg: 12, xl: 16}} alignItems="stretch">
            {images.map((image) => (
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4} key={image.title}>
                    <Link href="/recipes">
                        <ImageButton
                            focusRipple
                            style={{
                                width: "100%",
                            }}
                        >
                            <ImageSrc
                                className="image-src"
                                style={{backgroundImage: `url(${image.url})`}}
                            />
                            <ImageBackdrop className="MuiImageBackdrop-root"/>
                            <Image>
                                <Typography
                                    component="span"
                                    variant="h5"
                                    fontWeight="medium"
                                    color="inherit"
                                    sx={{
                                        position: 'relative',
                                        p: 4,
                                        pt: 2,
                                    }}
                                >
                                    {image.title}
                                    <ImageMarked className="MuiImageMarked-root"/>
                                </Typography>
                            </Image>
                        </ImageButton>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
}
