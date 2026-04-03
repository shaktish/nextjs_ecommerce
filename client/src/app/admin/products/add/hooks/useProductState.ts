import { ProductImage } from "@/store/useProductStore";
import { Category, Variant } from "@/types/product.types";
import { useEffect, useMemo, useState } from "react";

interface formState {
    name: string;
    brandId: string;
    description: string;
    categoryId: string;
    genderId: string;
    featured: boolean;
}

interface UseProductStateProp {
    categories: Category[]
}

const useProductState = ({ categories }: UseProductStateProp) => {
    const [formState, setFormState] = useState<formState>({
        name: "",
        brandId: "",
        description: "",
        genderId: "",
        categoryId: "",
        featured: false,
    });
    const [variants, setVariants] = useState<Variant[]>([]);

    const [sizes, setSizes] = useState<string[]>([]);

    const [categoryLevels, setCategoryLevels] = useState<Category[][]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const categoryMap = useMemo(() => {
        const map = new Map<string | null, Category[]>();
        categories?.forEach((cat) => {
            const key = cat.parentId ?? null;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(cat);
        });

        return map;
    }, [categories]);

    const getChildren = (parentId: string | null) =>
        categoryMap.get(parentId) ?? [];


    const handleChange = (levelIndex: number, categoryId: string) => {
        const updatedSelected = selectedCategories.slice(0, levelIndex);
        updatedSelected[levelIndex] = categoryId;

        setSelectedCategories(updatedSelected);

        const children = getChildren(categoryId);

        const updatedLevels = categoryLevels.slice(0, levelIndex + 1);

        if (children.length) {
            updatedLevels.push(children);
        }

        setCategoryLevels(updatedLevels);

        if (!children.length) {
            setFormState((prev) => ({
                ...prev,
                categoryId: categoryId,
            }));
        }
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value,
        });
    };

    const onValueChangeHandler = (value: string, name: string) => {
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const onToggleChange = (value: string, name: string) => {
        if (name === "sizes") {
            setSizes((prevState) => {
                return prevState.includes(value)
                    ? prevState.filter((size) => size !== value)
                    : [...prevState, value];
            });

            setVariants((prev) => {
                const exists = prev.find((v) => v.sizeId === value);
                if (exists) {
                    return prev.filter((v) => v.sizeId !== value);
                }
                return [
                    ...prev,
                    {
                        sizeId: value,
                        price: 0,
                        stock: 0,
                    },
                ];
            });
        }
    };

    const onCheckboxHandler = (checked: boolean, name: string) => {
        setFormState({
            ...formState,
            [name]: checked,
        });
    };

    const handleVariantChange = (
        sizeId: string,
        field: "price" | "stock",
        value: string,
    ) => {
        setVariants((prev) =>
            prev.map((variant) =>
                variant.sizeId === sizeId
                    ? { ...variant, [field]: Number(value) }
                    : variant,
            ),
        );
    };

    useEffect(() => {
        if (!categories) return;
        const roots = getChildren(null);
        if (roots.length > 0) {
            setCategoryLevels([roots]);
        }
    }, [categories]);

    return {
        formState,
        variants,
        sizes,

        onValueChangeHandler,
        handleInputChange,
        categoryLevels,
        selectedCategories,
        handleChange,
        onCheckboxHandler,
        onToggleChange,
        handleVariantChange,
    }

}

export default useProductState;