import ImageButtonGrid from "../components/ImageButtonGrid";
import {Divider, Paper, Typography} from "@mui/material";
import Box from "@mui/material/Box";

const MainPage = () => {

    return (
        <>
            <Typography variant="h3" component="h1" fontWeight="bold" color="primary" textAlign="center" width="100%"
            mt={{xs:3, sm:3, md:0}}>
                Co na obiad
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" textAlign="center" width="100%">
                Pyszne przepisy na każdy gust!
            </Typography>
            <Box display="flex" justifyContent="center" width="100%">
                <Divider width="80%" sx={{my: 5, borderColor: 'primary.main'}}/>
            </Box>
            <ImageButtonGrid images={images}/>
            <Paper sx={{mt: 10, width: "100%", padding: 4}}>
                <Typography variant="h5" component="h1" fontWeight="medium" color="primary" width="100%">
                    Witaj w "Co na Obiad"!
                </Typography>
                Jeśli kiedykolwiek zastanawiałeś się, co dziś ugotować, nasza aplikacja jest właśnie dla Ciebie! "Co na
                Obiad" to Twoje nowe, niezawodne źródło inspiracji kulinarnych, które sprawi, że gotowanie stanie się
                przyjemnością.
                <Typography variant="h5" component="h1" fontWeight="medium" color="primary" width="100%" mt={4}>
                    Odkryj Nowe Przepisy
                </Typography>
                Nasza aplikacja to prawdziwa skarbnica przepisów na każdą okazję. Znajdziesz tu pomysły na szybkie
                obiady, eleganckie kolacje, zdrowe przekąski oraz wyjątkowe desery. Niezależnie od tego, czy jesteś
                wegetarianinem, fanem tradycyjnej kuchni, czy po prostu szukasz czegoś nowego – "Co na Obiad" pomoże Ci
                znaleźć idealne danie na każdą chwilę.
                <Typography variant="h5" component="h1" fontWeight="medium" color="primary" width="100%" mt={4}>
                    Dodaj Własne Przepisy
                </Typography>
                Masz swój ulubiony przepis, którym chcesz się podzielić ze światem? Po zalogowaniu możesz łatwo dodać
                własne przepisy do naszej bazy. Dołącz do naszej społeczności i zainspiruj innych swoimi kulinarnymi
                pomysłami!
                <Typography variant="h5" component="h1" fontWeight="medium" color="primary" width="100%" mt={4}>
                    Filtruj Według Składników
                </Typography>
                Nie wiesz, co ugotować z tego, co masz w lodówce? Nasza unikalna funkcja filtrowania przepisów
                według składników pozwoli Ci znaleźć dania, które możesz przygotować z dostępnych w domu produktów.
                Co więcej, możesz także wykluczyć składniki, których nie lubisz lub na które jesteś uczulony, aby
                znaleźć przepisy idealnie dopasowane do Twoich potrzeb.
                <Typography variant="h5" component="h1" fontWeight="medium" color="primary" width="100%" mt={4}>
                    Dołącz Do Nas!
                </Typography>
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
        url: '/public/img/all_recipes.jpg',
        title:
            'Wszystkie przepisy',
    },
    {
        url: '/public/img/dinner.jpg',
        title:
            'Dania główne',
    },
    {
        url: '/public/img/wege.jpg',
        title:
            'Wegetariańskie',
    },
    {
        url: '/public/img/meat.jpg',
        title:
            'Mięsne',
    },
    {
        url: '/public/img/pasta.jpg',
        title:
            'Makarony',
    },
    {
        url: '/public/img/flour.jpg',
        title:
            'Mączne',
    },
    {
        url: '/public/img/baking.jpg',
        title:
            'Wypieki',
    },
    {
        url: '/public/img/cake.jpg',
        title:
            'Ciasta',
    },
    {
        url: '/public/img/dessert.jpg',
        title:
            'Desery',
    },
    {
        url: '/public/img/breakfast.jpg',
        title:
            'Śniadania',
    },
    {
        url: '/public/img/supper.jpg',
        title:
            'Kolacje',
    },
    {
        url: '/public/img/snack.jpg',
        title:
            'Przekąski',
    },
    {
        url: '/public/img/fish.jpg',
        title:
            'Ryby',
    },
    {
        url: '/public/img/soup.jpg',
        title:
            'Zupy',
    },
    {
        url: '/public/img/salad.jpg',
        title:
            'Sałatki',
    },
    {
        url: '/public/img/drink.jpg',
        title:
            'Napoje',
    },
    {
        url: '/public/img/festal.jpg',
        title:
            'Świąteczne',
    },
    {
        url: '/public/img/thermomix.jpg',
        title:
            'Thermomix',
    },
];