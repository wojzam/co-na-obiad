import {useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
import {useParams} from 'react-router-dom';

const useIngredientCheckbox = () => {
    const {id: recipeId} = useParams();
    const [cookies, setCookie, removeCookie] = useCookies([`checkedIngredients`]);
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        setChecked(getChecked());
    }, []);

    const getChecked = () => {
        if (cookies[`checkedIngredients`]) {
            if (recipeId === cookies[`checkedIngredients`].id) {
                const ch = cookies[`checkedIngredients`].checked;
                return ch ? ch : [];
            }
            removeCookie(`checkedIngredients`, {path: '/'});
        }
        return [];
    }

    const saveChecked = (newChecked) => {
        setCookie(`checkedIngredients`, {id: recipeId, checked: newChecked}, {path: '/'});
    }

    const handleToggle = (index) => () => {
        const currentIndex = checked.indexOf(index);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(index);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        saveChecked(newChecked);
    };

    return [checked, handleToggle];
};

export default useIngredientCheckbox;
