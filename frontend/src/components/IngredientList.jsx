import {
    Box,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Typography,
    useTheme
} from "@mui/material";
import {formatFraction} from "../utils/formatFraction";
import useIngredientCheckbox from "../hooks/useIngredientCheckbox.jsx";

const IngredientList = ({ingredientSections}) => {
    const theme = useTheme();
    const [checked, handleToggle] = useIngredientCheckbox();

    const getItemIndex = (sectionIndex, index) => `${sectionIndex}-${index}`;

    const collectAltIngredients = (index, section) => {
        let alternatives = [];
        for (let i = index + 1; i < section.ingredients.length; i++) {
            if (section.ingredients[i]?.type === "alt") {
                alternatives.push(section.ingredients[i]);
            } else {
                break;
            }
        }
        return alternatives;
    }

    function getIngredientDesc(ingredient) {
        return <>
            {ingredient.name}
            <span>&nbsp;&nbsp;</span>
            <span style={{fontWeight: 'lighter'}}>
                {formatFraction(ingredient.value)} {ingredient.unit}
                {ingredient?.type === "opt" && <><br/> (opcjonalnie)</>}
            </span>
        </>;
    }

    return (
        <>
            <Typography marginTop={3} fontWeight="medium" gutterBottom
                        textAlign={{xs: 'center', sm: 'center', md: 'start'}}
                        sx={{
                            fontSize: {
                                xs: theme.typography.h6.fontSize,
                                lg: theme.typography.h5.fontSize,
                            },
                        }}>
                Składniki:
            </Typography>
            {ingredientSections ? (
                ingredientSections.map((section, sectionIndex) => (
                    <Box key={section._id} mt={section._id > 1 ? 5 : 0}>
                        <Typography variant="h6" fontWeight="medium"
                                    textAlign={{xs: 'center', sm: 'center', md: 'start'}}>
                            {section.sectionName}{section.sectionName && ":"}
                        </Typography>
                        <List sx={{width: "100%"}}>
                            {section.ingredients.map((ingredient, index) => {
                                // The alternative ingredients don't have separate ListItem.
                                // Instead, there are combined with the main ingredient.
                                if (ingredient?.type === "alt") {
                                    if (index === 0) ingredient.type = "";
                                    else return null;
                                }

                                return (
                                    <ListItem key={index} disableGutters style={{marginLeft: 0, padding: 1}}>
                                        <ListItemButton role={undefined}
                                                        onClick={handleToggle(getItemIndex(sectionIndex, index))}
                                                        dense
                                                        disableGutters>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(getItemIndex(sectionIndex, index)) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium"
                                                                textAlign={{xs: 'center', sm: 'center', md: 'start'}}
                                                                paddingRight={{xs: 7, sm: 7, md: 0}}
                                                                color={theme.palette.primary.main}>
                                                        {getIngredientDesc(ingredient)}
                                                        {collectAltIngredients(index, section).map((alt) => (<>
                                                        <span style={{fontWeight: 'lighter'}}>
                                                            <br/>lub<span>&nbsp;</span>
                                                        </span>
                                                            {getIngredientDesc(alt)}
                                                        </>))}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                ))
            ) : (
                <Skeleton width={600}/>
            )}
        </>
    );
}

export default IngredientList;