import {useNavigate} from "react-router-dom";
import ImageButtonGrid from "../components/ImageButtonGrid";
import {Box, Divider, Paper, Typography, useTheme} from "@mui/material";
import {defaultFilter, defaultSort, useSearchState} from "../hooks/useSearchState";

const MainPage = () => {
    const theme = useTheme();
    const {save} = useSearchState({id: "/recipes"});
    const navigate = useNavigate();

    const onClick = (image) => {
        save({filter: image.filter, sort: defaultSort});
        navigate("/recipes");
    }

    const HeaderText = ({text, mt}) => {
        return <Typography component="h1" fontWeight="medium" color="primary" width="100%" mt={mt}
                           sx={{
                               fontSize: {
                                   xs: theme.typography.h6.fontSize,
                                   sm: theme.typography.h5.fontSize,
                               }
                           }}>
            {text}
        </Typography>
    }

    return (
        <>
            <Typography component="h1" fontWeight="bold" color="primary" textAlign="center" width="100%"
                        mt={{xs: 3, sm: 3, md: 0}}
                        sx={{
                            fontSize: {
                                xs: theme.typography.h4.fontSize,
                                sm: theme.typography.h3.fontSize,
                            }
                        }}>
                Co Na Obiad
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" textAlign="center" width="100%">
                Pyszne przepisy dla każdego!
            </Typography>
            <Box display="flex" justifyContent="center" width="100%">
                <Divider width="80%" sx={{my: 5, borderColor: 'primary.main'}}/>
            </Box>
            <ImageButtonGrid images={images} onClick={onClick}/>
            <Paper sx={{mt: 10, width: "100%", padding: 4}}>
                <HeaderText text={'Witaj w "Co na Obiad"!'}/>
                Jeśli kiedykolwiek zastanawiałeś się, co dziś ugotować, nasza aplikacja jest właśnie dla Ciebie! "Co na
                Obiad" to Twoje nowe, niezawodne źródło inspiracji kulinarnych, które sprawi, że gotowanie stanie się
                przyjemnością.
                <HeaderText text={'Odkryj Nowe Przepisy'} mt={4}/>
                Nasza aplikacja to prawdziwa skarbnica przepisów na każdą okazję. Znajdziesz tu pomysły na szybkie
                obiady, eleganckie kolacje, zdrowe przekąski oraz wyjątkowe desery. Niezależnie od tego, czy jesteś
                wegetarianinem, fanem tradycyjnej kuchni, czy po prostu szukasz czegoś nowego – "Co na Obiad" pomoże Ci
                znaleźć idealne danie na każdą chwilę.
                <HeaderText text={'Dodaj Własne Przepisy'} mt={4}/>
                Masz swój ulubiony przepis, którym chcesz się podzielić ze światem? Po zalogowaniu możesz łatwo dodać
                własne przepisy do naszej bazy. Dołącz do naszej społeczności i zainspiruj innych swoimi kulinarnymi
                pomysłami!
                <HeaderText text={'Filtruj Według Składników'} mt={4}/>
                Dzięki unikalnej funkcji filtrowania przepisów według składników, możesz łatwo znaleźć dania zawierające
                podane produkty, na które masz ochotę. Co więcej, masz również możliwość wykluczenia składników, których
                nie lubisz lub na które jesteś uczulony, co pozwoli Ci znaleźć przepisy idealnie dopasowane do Twoich
                potrzeb. Na przykład możesz wyszukać wszystkie dania z mięsem i warzywami lub wykluczyć przepisy
                zawierające nabiał, aby cieszyć się posiłkami zgodnymi z Twoimi preferencjami.
                <HeaderText text={'Dołącz Do Nas!'} mt={4}/>
                Nie czekaj! Już dziś zarejestruj się i zacznij korzystać z pełni możliwości naszej aplikacji.
                Niezależnie od tego, czy gotujesz dla siebie, rodziny, czy przyjaciół – z nami
                każde danie będzie sukcesem!
                <br/><br/><b>Co dziś na obiad? Odpowiedź znajdziesz w naszej aplikacji!</b>
            </Paper>
        </>
    );
};

export default MainPage;


const images = [
    {
        path: '/img/all_recipes.jpg',
        title:
            'Wszystkie przepisy',
        filter: {...defaultFilter}
    },
    {
        path: '/img/dinner.jpg',
        title:
            'Dania główne',
        filter: {...defaultFilter, categories: ['Dania główne']}
    },
    {
        path: '/img/wege.jpg',
        title:
            'Wegetariańskie',
        filter: {
            ...defaultFilter,
            exclude: ["Mięso", "Owoce morza", "Ryba", "Bulion drobiowy", "Żelatyna"],
            categories: ['Dania główne']
        }
    },
    {
        path: '/img/meat.jpg',
        title:
            'Mięsne',
        filter: {...defaultFilter, include: ["Mięso"]}
    },
    {
        path: '/img/pasta.jpg',
        title:
            'Makarony',
        filter: {...defaultFilter, include: ["Makaron"]}
    },
    {
        path: '/img/flour.jpg',
        title:
            'Mączne',
        filter: {...defaultFilter, include: ["Mąka"]}
    },
    {
        path: '/img/baking.jpg',
        title:
            'Wypieki',
        filter: {...defaultFilter, categories: ['Wypieki']}
    },
    {
        path: '/img/cake.jpg',
        title:
            'Ciasta',
        filter: {...defaultFilter, categories: ['Ciasta']}
    },
    {
        path: '/img/dessert.jpg',
        title:
            'Desery',
        filter: {...defaultFilter, categories: ['Desery']}
    },
    {
        path: '/img/breakfast.jpg',
        title:
            'Śniadania',
        filter: {...defaultFilter, categories: ['Śniadania']}
    },
    {
        path: '/img/supper.jpg',
        title:
            'Kolacje',
        filter: {...defaultFilter, categories: ['Kolacje']}
    },
    {
        path: '/img/snack.jpg',
        title:
            'Przekąski',
        filter: {...defaultFilter, categories: ['Przekąski']}
    },
    {
        path: '/img/fish.jpg',
        title:
            'Ryby',
        filter: {...defaultFilter, include: ["Ryba"]}
    },
    {
        path: '/img/soup.jpg',
        title:
            'Zupy',
        filter: {...defaultFilter, categories: ['Zupy']}
    },
    {
        path: '/img/salad.jpg',
        title:
            'Sałatki',
        filter: {...defaultFilter, categories: ['Sałatki']}
    },
    {
        path: '/img/drink.jpg',
        title:
            'Napoje',
        filter: {...defaultFilter, categories: ['Napoje']}
    },
    {
        path: '/img/festal.jpg',
        title:
            'Świąteczne',
        filter: {...defaultFilter, categories: ['Świąteczne']}
    },
    {
        path: '/img/thermomix.jpg',
        title:
            'Thermomix',
        filter: {...defaultFilter, categories: ['Thermomix']}
    },
];