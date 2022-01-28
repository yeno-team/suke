import { useEffect, useState } from "react";
import { getCategories } from "../api/category";
import { Category } from "@suke/suke-core/src/entities/Category";

export const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Error[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>("DESC");

    const fetchCategories = async (pageNumber = 1, limit = 20) => {
        try {
            setLoading(true);
            const fetchedCategories = await getCategories(pageNumber, limit, sortDirection);
            setCategories(prev => [...prev, ...fetchedCategories]);
            return fetchedCategories;
        } catch (e) {
            setErrors(prevError => [...prevError, e as Error]);
        } finally {
            setLoading(false);
        }
    }

    const getNextPage = async () => {
        try {
            setLoading(true);
            const fetchedCategories = await getCategories(pageNumber+1, 20, sortDirection);
            setCategories(prev => [...prev, ...fetchedCategories]);
            setPageNumber(prev => prev+1);
            
            return fetchedCategories;
        } catch (e) {
            setErrors(prevError => [...prevError, e as Error]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function getInitCategories() {
            try {
                const fetchedCategories = await getCategories(1, 20, sortDirection);
                setCategories(fetchedCategories);
            } catch (e) {
                setErrors(prevError => [...prevError, e as Error]);
            } finally {
                setLoading(false);
            }
        }
        getInitCategories();
    }, [sortDirection]);

    return { categories, fetchCategories, errors, getNextPage, loading, setSortDirection, sortDirection };
}