import { useEffect, useState } from "react";
import { getCategories } from "../api/category";
import { Category } from "@suke/suke-core/src/entities/Category";

export const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Error[]>([]);
 
    const fetchCategories = async (pageNumber = 1, limit = 20) => {
        try {
            const fetchedCategories = await getCategories(pageNumber, limit);
            setCategories(fetchedCategories);
            return fetchedCategories;
        } catch (e) {
            setErrors(prevError => [...prevError, e as Error]);
        }
    }
    
    useEffect(() => {
        async function getInitCategories() {
            const fetchedCategories = await getCategories(1, 50);
            console.log("FETCHED", fetchedCategories);
            setCategories(fetchedCategories);

        }
        getInitCategories();
    }, []);

    return { categories, fetchCategories, errors }
}