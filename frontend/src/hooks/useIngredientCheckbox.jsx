import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

const STORAGE_KEY = 'checkedIngredients';

const useIngredientCheckbox = () => {
    const {id: recipeId} = useParams();
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length > 0 && navigationEntries[0].type !== "reload") {
            sessionStorage.removeItem(STORAGE_KEY);
        } else {
            setChecked(getChecked());
        }
    }, [recipeId]);

    const getChecked = () => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (recipeId === parsedData.id) {
                return parsedData.checked || [];
            } else {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        }
        return [];
    };

    const saveChecked = (newChecked) => {
        const dataToSave = JSON.stringify({id: recipeId, checked: newChecked});
        sessionStorage.setItem(STORAGE_KEY, dataToSave);
    };

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
