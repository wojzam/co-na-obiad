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
import useIngredientCheckbox from "../hooks/useIngredientCheckbox";

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
            <Typography marginTop={3} fontWeight="bold"
                        textAlign={{xs: 'center', sm: 'center', md: 'start'}}
                        sx={{
                            fontSize: {
                                xs: theme.typography.h6.fontSize,
                                lg: theme.typography.h5.fontSize,
                            },
                        }}>
                Składniki:
            </Typography>
            <Typography fontWeight="lighter" gutterBottom
                        textAlign={{xs: 'center', sm: 'center', md: 'start'}}
                        variant="subtitle2">
                (zaznacz dodane)
            </Typography>
            {ingredientSections ? (
                ingredientSections.map((section, sectionIndex) => (
                    <Box key={sectionIndex} mt={sectionIndex > 0 ? 5 : 0}>
                        <Typography variant="h6" fontWeight="medium"
                                    textAlign={{xs: 'center', sm: 'center', md: 'start'}}>
                            {section?.sectionName}{section?.sectionName && ":"}
                        </Typography>
                        <List sx={{width: "100%"}}>
                            {section.ingredients.map((ingredient, index) => {
                                // The alternative ingredients don't have separate ListItem.
                                // Instead, there are combined with the main ingredient.
                                if (ingredient?.type === "alt") {
                                    if (index === 0) ingredient.type = "";
                                    else return null;
                                }

                                const key = getItemIndex(sectionIndex, index);
                                const visibleIndex = section.ingredients.slice(0, index + 1)
                                    .filter(ing => ing?.type !== "alt").length - 1;

                                return (
                                    <ListItem key={key} disableGutters style={{
                                        marginLeft: 0,
                                        padding: 1,
                                        backgroundColor: visibleIndex % 2 === 0 ? "inherit" : theme.palette.action.hover,
                                    }}>
                                        <ListItemButton role={undefined}
                                                        onClick={handleToggle(key)}
                                                        dense
                                                        disableGutters>
                                            <ListItemIcon sx={{minWidth: 50, pl: 1, py: 0.3}}>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(key) !== -1}
                                                    tabIndex={-1}
                                                    size={"small"}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography variant="body1" fontWeight="medium"
                                                                textAlign={{xs: 'center', sm: 'center', md: 'start'}}
                                                                paddingRight={{xs: 7, sm: 7, md: 0}}
                                                                color={checked.indexOf(key) !== -1 ? 'grey' : 'primary'}
                                                                sx={{textDecorationLine: checked.indexOf(key) !== -1 ? 'line-through' : 'none'}}>
                                                        {getIngredientDesc(ingredient)}
                                                        {collectAltIngredients(index, section).map((alt, altIndex) => (
                                                            <span key={`${key}-${altIndex}`}>
                                                                <span style={{fontWeight: 'lighter'}}>
                                                                    <br/>lub<span>&nbsp;</span>
                                                                </span>
                                                                {getIngredientDesc(alt)}
                                                            </span>
                                                        ))}
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